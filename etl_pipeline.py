import pandas as pd
from datetime import datetime, timedelta


def load_data(filepath: str = "case_level_data.csv") -> pd.DataFrame:
    df = pd.read_csv(filepath)
    df["date"] = pd.to_datetime(df["date"])
    return df


def filter_data(df: pd.DataFrame, time_window_days: int, channel: str,
                reference_date: datetime = None):
    """
    Returns two dataframes:
      - current_df  : last `time_window_days` from reference_date
      - previous_df : the immediately preceding equivalent window

    Parameters
    ----------
    df               : raw dataframe loaded from case_level_data.csv
    time_window_days : number of days for each window (e.g. 7, 30)
    channel          : 'All' to skip channel filter, or a specific channel
                       string (e.g. 'Chat', 'Call', 'Email', 'Phone')
    reference_date   : anchor date for window calculation; defaults to the
                       max date in df (use datetime.now() for production)
    """
    if reference_date is None:
        reference_date = df["date"].max()

    today = reference_date.replace(hour=23, minute=59, second=59, microsecond=999999)

    current_start  = today - timedelta(days=time_window_days)
    current_end    = today                                        # inclusive of reference date

    previous_start = today - timedelta(days=time_window_days * 2)
    previous_end   = current_start

    current_mask  = (df["date"] >= current_start)  & (df["date"] <= current_end)
    previous_mask = (df["date"] >= previous_start) & (df["date"] <  previous_end)

    if channel != "All":
        channel_mask   = df["Channel_of_Origin"] == channel
        current_mask  &= channel_mask
        previous_mask &= channel_mask

    current_df  = df[current_mask].reset_index(drop=True)
    previous_df = df[previous_mask].reset_index(drop=True)

    return current_df, previous_df


def calculate_kpis(current_df: pd.DataFrame, previous_df: pd.DataFrame) -> dict:
    """
    Computes core KPIs for the dashboard and their trend vs the previous period.

    Parameters
    ----------
    current_df  : filtered dataframe for the current time window
    previous_df : filtered dataframe for the preceding equivalent window

    Returns
    -------
    Nested dict with 'value' and 'trend' (% change) for each KPI.
    Trend is None when previous period has no data (division by zero guard).
    """

    def _compute(df: pd.DataFrame) -> dict:
        n = len(df)
        if n == 0:
            return {k: None for k in ("total_requests", "resolution_rate", "aht", "csat", "drop_off")}
        return {
            "total_requests":  n,
            "resolution_rate": round(df["Issue_Resolved"].sum()    / n * 100, 1),
            "aht":             round(df["AHT"].mean(), 1),
            "csat":            round((df["Inferred_CSAT"] >= 4).sum() / n * 100, 1),
            "drop_off":        round(df["Customer_Dropped"].sum()  / n * 100, 1),
        }

    def _trend(current_val, previous_val) -> float | None:
        if previous_val is None or previous_val == 0:
            return None
        return round((current_val - previous_val) / previous_val * 100, 1)

    curr = _compute(current_df)
    prev = _compute(previous_df)

    return {
        metric: {
            "value": curr[metric],
            "trend": _trend(curr[metric], prev[metric]),
        }
        for metric in ("total_requests", "resolution_rate", "aht", "csat", "drop_off")
    }


def generate_chart_data(current_df: pd.DataFrame, previous_df: pd.DataFrame, time_window_days: int) -> dict:
    """
    Aggregates filtered data into chart-ready structures for the dashboard.

    Parameters
    ----------
    current_df       : filtered dataframe for the current time window
    previous_df      : filtered dataframe for the preceding equivalent window
    time_window_days : drives bucketing — hourly if 1, daily otherwise

    Returns
    -------
    {
        "trends"  : list of time-bucketed dicts for the line chart,
        "clusters": list of top-5 issue cluster dicts for the table
    }
    """

    # ------------------------------------------------------------------
    # Part 1: Customer Call Trends
    # ------------------------------------------------------------------
    freq   = "h" if time_window_days == 1 else "D"
    fmt    = "%Y-%m-%d %H:00" if time_window_days == 1 else "%Y-%m-%d"

    if current_df.empty:
        trends = []
    else:
        grp = current_df.set_index("date").resample(freq)
        trends_df = pd.DataFrame({
            "volume":     grp.size(),
            "resolution": grp["Issue_Resolved"].mean() * 100,
            "escalation": grp["Escalation"].mean() * 100,
        }).reset_index()

        trends = [
            {
                "date":       row["date"].strftime(fmt),
                "volume":     int(row["volume"]),
                "resolution": round(row["resolution"], 1),
                "escalation": round(row["escalation"], 1),
            }
            for _, row in trends_df.iterrows()
        ]

    # ------------------------------------------------------------------
    # Part 2: Issue Clusters — all issues grouped by L1, sorted descending
    # ------------------------------------------------------------------
    spark_freq = "h" if time_window_days == 1 else "D"

    if current_df.empty:
        clusters = []
    else:
        # volume per L1 in current window, descending
        l1_order = (
            current_df.groupby("L1")
            .size()
            .sort_values(ascending=False)
            .index.tolist()
        )

        # pre-build previous L1 counts for fast lookup
        prev_l1_counts = (
            previous_df.groupby("L1").size()
            if not previous_df.empty
            else pd.Series(dtype=int)
        )

        clusters = []
        for l1 in l1_order:
            curr_slice = current_df[current_df["L1"] == l1]
            curr_vol   = len(curr_slice)
            prev_vol   = int(prev_l1_counts.get(l1, 0))

            chg = None if prev_vol == 0 else round((curr_vol - prev_vol) / prev_vol * 100, 1)

            trend_data = [
                int(v) for v in curr_slice.set_index("date").resample(spark_freq).size().values
            ]

            clusters.append({
                "topic":      l1,
                "vol":        curr_vol,
                "prev_vol":   prev_vol,
                "chg":        chg,
                "trend_data": trend_data,
            })

    return {"trends": trends, "clusters": clusters}


def get_top_trending_topics(current_df: pd.DataFrame, previous_df: pd.DataFrame,
                            time_window_days: int) -> list:
    """
    Returns all L1 topics with positive volume growth compared to the
    previous period, sorted by percentage change descending.

    Parameters
    ----------
    current_df       : filtered dataframe for the current time window
    previous_df      : filtered dataframe for the preceding equivalent window
    time_window_days : drives sparkline bucketing — hourly if 1, daily otherwise

    Returns
    -------
    List of all positively trending topics, sorted by trend_pct descending:
    [{"topic": str, "vol": int, "trend_pct": float, "trend_data": [int, ...]}, ...]
    """
    if current_df.empty:
        return []

    spark_freq = "h" if time_window_days == 1 else "D"

    curr_counts = current_df.groupby("L1").size()
    prev_counts = previous_df.groupby("L1").size() if not previous_df.empty else pd.Series(dtype=int)

    trending = []
    for topic, curr_vol in curr_counts.items():
        prev_vol = int(prev_counts.get(topic, 0))

        if prev_vol == 0:
            continue                             # skip — no baseline to compare against

        trend_pct = round((curr_vol - prev_vol) / prev_vol * 100, 1)

        if trend_pct <= 0:
            continue                             # only positive growth qualifies

        trending.append((topic, int(curr_vol), trend_pct))

    # sort by trend_pct descending
    trending.sort(key=lambda x: x[2], reverse=True)

    result = []
    for topic, curr_vol, trend_pct in trending:
        topic_slice = current_df[current_df["L1"] == topic]
        trend_data  = [int(v) for v in topic_slice.set_index("date").resample(spark_freq).size().values]

        result.append({
            "topic":      topic,
            "vol":        curr_vol,
            "trend_pct":  trend_pct,
            "trend_data": trend_data,
        })

    return result


def get_performing_topics(current_df: pd.DataFrame, time_window_days: int) -> list:
    """
    Returns all L1 topics sorted by CSAT descending, with volume sparkline data.

    Parameters
    ----------
    current_df       : filtered dataframe for the current time window
    time_window_days : drives sparkline bucketing — hourly if 1, daily otherwise

    Returns
    -------
    List of all L1 topics sorted by csat descending:
    [{"topic": str, "vol": int, "csat": float, "trend_data": [int, ...]}, ...]
    """
    if current_df.empty:
        return []

    spark_freq = "h" if time_window_days == 1 else "D"

    result = []
    for topic, group in current_df.groupby("L1"):
        vol  = len(group)
        csat = round((group["Inferred_CSAT"] >= 4).sum() / vol * 100, 1)
        trend_data = [int(v) for v in group.set_index("date").resample(spark_freq).size().values]

        result.append({
            "topic":      topic,
            "vol":        vol,
            "csat":       csat,
            "trend_data": trend_data,
        })

    result.sort(key=lambda x: x["csat"], reverse=True)
    return result


def get_category_metrics(current_df: pd.DataFrame, time_window_days: int) -> list:
    """
    Returns category-level metrics for all L1 topics, sorted by volume descending.
    Supports the frontend dropdown metric selector.

    Parameters
    ----------
    current_df       : filtered dataframe for the current time window
    time_window_days : drives sparkline bucketing — hourly if 1, daily otherwise

    Returns
    -------
    List of all L1 topics sorted by vol descending:
    [{"topic": str, "vol": int, "resolution": float, "repeat_call": float,
      "drop_off": float, "trend_data": [int, ...]}, ...]
    """
    if current_df.empty:
        return []

    spark_freq = "h" if time_window_days == 1 else "D"

    result = []
    for topic, group in current_df.groupby("L1"):
        vol        = len(group)
        resolution = round(group["Issue_Resolved"].sum()    / vol * 100, 1)
        repeat_call= round(group["Repeat_Contact"].sum()    / vol * 100, 1)
        drop_off   = round(group["Customer_Dropped"].sum()  / vol * 100, 1)
        trend_data = [int(v) for v in group.set_index("date").resample(spark_freq).size().values]

        result.append({
            "topic":       topic,
            "vol":         vol,
            "resolution":  resolution,
            "repeat_call": repeat_call,
            "drop_off":    drop_off,
            "trend_data":  trend_data,
        })

    result.sort(key=lambda x: x["vol"], reverse=True)
    return result


def get_issues_deep_dive(current_df: pd.DataFrame) -> list:
    """
    Calculates detailed metrics for every L1 + L2 combination.
    Populates the Issues insight table on the frontend.

    Parameters
    ----------
    current_df : filtered dataframe for the current time window

    Returns
    -------
    List of L1/L2 combinations sorted by volume descending:
    [{"l1_topic": str, "l2_topic": str, "volume": int, "csat": float,
      "drop_off": float, "aht": float, "is_resolved": float,
      "repeat": float, "escalation": float}, ...]
    """
    if current_df.empty:
        return []

    result = []
    for (l1, l2), group in current_df.groupby(["L1", "L2"]):
        vol = len(group)
        result.append({
            "l1_topic":   l1,
            "l2_topic":   l2,
            "volume":     vol,
            "csat":       round((group["Inferred_CSAT"] >= 4).sum() / vol * 100, 1),
            "drop_off":   round(group["Customer_Dropped"].sum()      / vol * 100, 1),
            "aht":        round(group["AHT"].mean(), 1),
            "is_resolved":round(group["Issue_Resolved"].sum()        / vol * 100, 1),
            "repeat":     round(group["Repeat_Contact"].sum()        / vol * 100, 1),
            "escalation": round(group["Escalation"].sum()            / vol * 100, 1),
        })

    result.sort(key=lambda x: x["volume"], reverse=True)
    return result


def generate_monitoring_data(current_df: pd.DataFrame, previous_df: pd.DataFrame,
                             time_window_days: int) -> dict:
    """
    Wrapper that stitches all monitoring screen data into a single dict.

    Returns
    -------
    {
        "trending":         get_top_trending_topics() output,
        "performing":       get_performing_topics() output,
        "category_metrics": get_category_metrics() output
    }
    """
    return {
        "trending":         get_top_trending_topics(current_df, previous_df, time_window_days),
        "performing":       get_performing_topics(current_df, time_window_days),
        "category_metrics": get_category_metrics(current_df, time_window_days),
    }


def generate_basic_insight(kpis: dict, charts: dict) -> str:
    """
    Deterministic 2-sentence insight placeholder until LLM integration.

    Parameters
    ----------
    kpis   : output of calculate_kpis()
    charts : output of generate_chart_data()

    Returns
    -------
    A 2-sentence insight string (sentences omitted gracefully on missing data).
    """
    sentences = []

    # --- Sentence 1: volume + trend ---
    volume = kpis.get("total_requests", {}).get("value")
    trend  = kpis.get("total_requests", {}).get("trend")

    if volume is not None:
        vol_str = f"{volume:,}"
        if trend is not None:
            direction = "increase" if trend >= 0 else "decrease"
            trend_str = f", marking a {abs(trend)}% {direction} vs the previous period"
        else:
            trend_str = ""
        sentences.append(
            f"Support volume reached {vol_str} interactions{trend_str}."
        )

    # --- Sentence 2: top issue + resolution rate ---
    clusters        = charts.get("clusters", [])
    resolution_rate = kpis.get("resolution_rate", {}).get("value")

    if clusters and resolution_rate is not None:
        top_issue = clusters[0]["topic"]
        sentences.append(
            f"The primary driver of contact was '{top_issue}', "
            f"with the overall resolution rate sitting at {resolution_rate}%."
        )
    elif resolution_rate is not None:
        sentences.append(
            f"The overall resolution rate is sitting at {resolution_rate}%."
        )

    return " ".join(sentences)


def build_dashboard_payloads(df: pd.DataFrame, output_dir: str = "output",
                             reference_date: datetime = None) -> None:
    """
    Orchestrates the full ETL pipeline across all filter combinations and
    writes one JSON file per (time_window, channel) pair to `output_dir`.

    Combinations produced: 3 time windows x 4 channels = 12 files.

    Parameters
    ----------
    df             : raw dataframe
    output_dir     : folder where JSON files are written
    reference_date : anchor for window calculations; defaults to max date in df
                     (swap to datetime.now() for production)
    """
    import json
    import os

    TIME_WINDOWS = [1, 7, 30]
    CHANNELS     = ["All", "Chat", "Call", "Email"]

    if reference_date is None:
        reference_date = df["date"].max()

    os.makedirs(output_dir, exist_ok=True)

    total = len(TIME_WINDOWS) * len(CHANNELS)
    count = 0

    for time_window in TIME_WINDOWS:
        time_label  = "24h" if time_window == 1 else f"{time_window}d"
        file_prefix = f"{time_window}d"
        start_date  = reference_date - timedelta(days=time_window)

        for channel in CHANNELS:
            current_df, previous_df = filter_data(df, time_window, channel, reference_date)
            kpis          = calculate_kpis(current_df, previous_df)
            charts        = generate_chart_data(current_df, previous_df, time_window)
            insight       = generate_basic_insight(kpis, charts)
            monitoring    = generate_monitoring_data(current_df, previous_df, time_window)
            issues_data   = get_issues_deep_dive(current_df)

            payload = {
                "filters": {
                    "time":       time_label,
                    "channel":    channel.lower(),
                    "start_date": start_date.strftime("%Y-%m-%d"),
                    "end_date":   reference_date.strftime("%Y-%m-%d"),
                },
                "kpis":            kpis,
                "charts":          charts,
                "ai_insight":      insight,
                "monitoring":      monitoring,
                "issues_insights": issues_data,
            }

            filename = f"dashboard_{file_prefix}_{channel.lower()}.json"
            filepath = os.path.join(output_dir, filename)

            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(payload, f, indent=2, default=str)

            count += 1
            print(f"  [{count:02d}/{total}] Written: {filename}")

    print(f"\nAll {total} dashboard JSON files saved to '{output_dir}/'")
    print(f"Reference date : {reference_date.strftime('%Y-%m-%d %H:%M:%S')}")


if __name__ == "__main__":
    df = load_data("case_level_data.csv")
    print(f"Loaded {len(df)} rows | date range: {df['date'].min()} to {df['date'].max()}\n")
    build_dashboard_payloads(df)
