# Insight Engine Backend

A Python ETL pipeline that processes customer support case data and serves pre-computed dashboard metrics via a FastAPI REST endpoint.

---

## Project Structure

```
Insight_Engine_Backend/
├── case_level_data.csv      # Source data (1000 support cases)
├── etl_pipeline.py          # ETL logic — filtering, metrics, aggregation
├── api.py                   # FastAPI server — serves pre-computed JSON
├── output/                  # 12 pre-computed dashboard JSON files
│   ├── dashboard_1d_all.json
│   ├── dashboard_7d_chat.json
│   └── ... (3 time windows × 4 channels)
├── venv/                    # Python virtual environment
└── README.md
```

---

## Quick Start

### 1. Run the ETL pipeline (generates all JSON files)
```bash
venv\Scripts\python.exe etl_pipeline.py
```

### 2. Start the API server
```bash
venv\Scripts\python.exe api.py
```

API will be live at `http://localhost:8000`
Interactive docs at `http://localhost:8000/docs`

---

## Input Data — `case_level_data.csv`

| Column | Type | Description |
|--------|------|-------------|
| `case_id` | string | Unique identifier: `Brand_Model_YYYYMMDD_HHMMSS_ID` |
| `Case_id` | string | Duplicate of `case_id` |
| `text` | string | Full raw conversation transcript |
| `conversation_json` | string | Structured JSON of the conversation |
| `_cache_key` | string | Internal processing cache key |
| `Summary` | string | AI-generated case summary |
| `Reason_of_contact` | string | Why the customer contacted support |
| `Issue_Resolved` | bool | Whether the issue was resolved |
| `Customer_Dropped` | bool | Whether the customer dropped the call |
| `Agent_Dropped` | bool | Whether the agent dropped the call |
| `Escalation` | bool | Whether the case was escalated |
| `Inferred_CSAT` | int (1–5) | AI-inferred customer satisfaction score |
| `Customer_Effort_Score_CES` | int (1–5) | Effort required by customer to resolve |
| `Informational_Educational` | bool | Whether contact was informational |
| `Self_Serve_Eligibility` | bool | Whether issue could be self-served |
| `KB_Gap_Identified` | bool | Whether a knowledge base gap was found |
| `Alternate_Resource_Utilised` | string (JSON list) | External resources used by agent |
| `Pre_Sentiment` | string | Customer sentiment at start (Neutral, Frustrated, Angry, etc.) |
| `Post_Sentiment` | string | Customer sentiment at end (Satisfied, Relieved, Dissatisfied, etc.) |
| `Repeat_Contact` | bool | Whether customer contacted before for same issue |
| `Channel_of_Origin` | string | Contact channel: Chat, Call, Email, Phone |
| `AHT` | int | Average Handle Time in minutes |
| `Agent_Resolution_Step` | string | Steps taken by agent to resolve |
| `topic_text` | string | Raw topic text from conversation |
| `L1` | string | Level 1 topic category (14 categories) |
| `L2` | string | Level 2 topic subcategory (27 subcategories) |
| `date` | datetime | Timestamp extracted from `case_id` |

---

## `etl_pipeline.py` — Function Reference

### `load_data`
Loads the CSV and parses the date column.

**Input**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `filepath` | `str` | `"case_level_data.csv"` | Path to the CSV file |

**Output**
`pd.DataFrame` — raw dataframe with `date` column as `datetime64`.

---

### `filter_data`
Splits the dataframe into a current and previous time window, optionally filtered by channel.

**Input**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `df` | `pd.DataFrame` | — | Full raw dataframe |
| `time_window_days` | `int` | — | Window size in days (e.g. 1, 7, 30) |
| `channel` | `str` | — | `"All"` to skip filter, or `"Chat"` / `"Call"` / `"Email"` / `"Phone"` |
| `reference_date` | `datetime` | `None` | Anchor date; defaults to max date in df |

**Output**
`(current_df, previous_df)` — two `pd.DataFrame` objects.

| DataFrame | Date range |
|-----------|-----------|
| `current_df` | `[reference_date - N days, reference_date]` |
| `previous_df` | `[reference_date - 2N days, reference_date - N days)` |

---

### `calculate_kpis`
Computes 5 core KPIs for the current period and their % change vs the previous period.

**Input**
| Parameter | Type | Description |
|-----------|------|-------------|
| `current_df` | `pd.DataFrame` | Current window data |
| `previous_df` | `pd.DataFrame` | Previous window data |

**Output** — `dict`
```json
{
  "total_requests":  {"value": 250,  "trend": 8.2},
  "resolution_rate": {"value": 43.6, "trend": -3.1},
  "aht":             {"value": 17.4, "trend": 0.0},
  "csat":            {"value": 55.8, "trend": -5.0},
  "drop_off":        {"value": 1.1,  "trend": null}
}
```
- `trend` is `null` when previous window is empty (no prior baseline).
- All values rounded to 1 decimal place.

---

### `generate_chart_data`
Produces time-bucketed trend data and L1-level issue cluster data for charts.

**Input**
| Parameter | Type | Description |
|-----------|------|-------------|
| `current_df` | `pd.DataFrame` | Current window data |
| `previous_df` | `pd.DataFrame` | Previous window data |
| `time_window_days` | `int` | Drives bucketing: hourly if `1`, daily otherwise |

**Output** — `dict`
```json
{
  "trends": [
    {"date": "2026-03-12", "volume": 35, "resolution": 48.6, "escalation": 22.9}
  ],
  "clusters": [
    {"topic": "Display & Screen", "vol": 41, "prev_vol": 27, "chg": 51.9, "trend_data": [4, 8, 7, 6, 8, 8]}
  ]
}
```
- `trends.date` format: `"YYYY-MM-DD"` for daily, `"YYYY-MM-DD HH:00"` for hourly.
- `clusters.chg` is `null` when `prev_vol` is 0.

---

### `get_top_trending_topics`
Returns all L1 topics with positive volume growth vs the previous period, sorted by growth % descending.

**Input**
| Parameter | Type | Description |
|-----------|------|-------------|
| `current_df` | `pd.DataFrame` | Current window data |
| `previous_df` | `pd.DataFrame` | Previous window data |
| `time_window_days` | `int` | Drives sparkline bucketing |

**Output** — `list`
```json
[
  {"topic": "Device Setup", "vol": 11, "trend_pct": 266.7, "trend_data": [2, 2, 2, 1, 3, 0, 1]}
]
```
- Topics with `prev_vol == 0` or `trend_pct <= 0` are excluded.

---

### `get_performing_topics`
Returns all L1 topics sorted by CSAT score descending.

**Input**
| Parameter | Type | Description |
|-----------|------|-------------|
| `current_df` | `pd.DataFrame` | Current window data |
| `time_window_days` | `int` | Drives sparkline bucketing |

**Output** — `list`
```json
[
  {"topic": "Features & Compatibility", "vol": 4, "csat": 100.0, "trend_data": [1, 0, 0, 1]}
]
```

---

### `get_category_metrics`
Returns all L1 topics with resolution, repeat contact, and drop-off rates. Sorted by volume descending.

**Input**
| Parameter | Type | Description |
|-----------|------|-------------|
| `current_df` | `pd.DataFrame` | Current window data |
| `time_window_days` | `int` | Drives sparkline bucketing |

**Output** — `list`
```json
[
  {
    "topic": "Display & Screen",
    "vol": 41,
    "resolution": 43.9,
    "repeat_call": 2.4,
    "drop_off": 0.0,
    "trend_data": [4, 0, 8, 8, 7, 6, 8]
  }
]
```

---

### `get_issues_deep_dive`
Calculates 7 detailed metrics for every L1 + L2 combination. Sorted by volume descending.

**Input**
| Parameter | Type | Description |
|-----------|------|-------------|
| `current_df` | `pd.DataFrame` | Current window data |

**Output** — `list`
```json
[
  {
    "l1_topic": "Network & Connectivity",
    "l2_topic": "wifi connectivity problems",
    "volume": 24,
    "csat": 62.5,
    "drop_off": 0.0,
    "aht": 19.0,
    "is_resolved": 45.8,
    "repeat": 0.0,
    "escalation": 29.2
  }
]
```

---

### `generate_monitoring_data`
Wrapper that stitches the three monitoring screen functions into a single dict.

**Input**
| Parameter | Type | Description |
|-----------|------|-------------|
| `current_df` | `pd.DataFrame` | Current window data |
| `previous_df` | `pd.DataFrame` | Previous window data |
| `time_window_days` | `int` | Drives sparkline bucketing |

**Output** — `dict`
```json
{
  "trending":         [...],
  "performing":       [...],
  "category_metrics": [...]
}
```

---

### `generate_basic_insight`
Generates a deterministic 2-sentence text summary. Placeholder for future LLM integration.

**Input**
| Parameter | Type | Description |
|-----------|------|-------------|
| `kpis` | `dict` | Output of `calculate_kpis()` |
| `charts` | `dict` | Output of `generate_chart_data()` |

**Output** — `str`
```
"Support volume reached 250 interactions, marking a 8.2% increase vs the previous period.
The primary driver of contact was 'Display & Screen', with the overall resolution rate sitting at 43.6%."
```
- Trend comparison omitted if `trend` is `null`.
- Top issue sentence omitted if `clusters` is empty.

---

### `build_dashboard_payloads`
Orchestrates the full ETL pipeline across all 12 filter combinations (3 time windows × 4 channels) and writes one JSON file per combination.

**Input**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `df` | `pd.DataFrame` | — | Full raw dataframe |
| `output_dir` | `str` | `"output"` | Directory to write JSON files |
| `reference_date` | `datetime` | `None` | Anchor date; defaults to max date in df |

**Output** — None. Writes 12 files to `output/`:

| File | Time Window | Channel |
|------|-------------|---------|
| `dashboard_1d_all.json` | 24 hours | All |
| `dashboard_1d_chat.json` | 24 hours | Chat |
| `dashboard_1d_call.json` | 24 hours | Call |
| `dashboard_1d_email.json` | 24 hours | Email |
| `dashboard_7d_all.json` | 7 days | All |
| ... | ... | ... |
| `dashboard_30d_email.json` | 30 days | Email |

**Each JSON file structure:**
```json
{
  "filters":         {"time": "7d", "channel": "chat", "start_date": "...", "end_date": "..."},
  "kpis":            {...},
  "charts":          {"trends": [...], "clusters": [...]},
  "ai_insight":      "...",
  "monitoring":      {"trending": [...], "performing": [...], "category_metrics": [...]},
  "issues_insights": [...]
}
```

---

## `api.py` — API Reference

### Setup
- Framework: **FastAPI**
- Server: **Uvicorn** on `http://0.0.0.0:8000`
- CORS: All origins allowed (`*`)

---

### `GET /api/dashboard`
Serves a pre-computed dashboard payload JSON file.

**Query Parameters**
| Parameter | Type | Default | Valid Values |
|-----------|------|---------|--------------|
| `time_window` | `str` | `"7d"` | `"24h"`, `"7d"`, `"30d"` |
| `channel` | `str` | `"all"` | `"all"`, `"chat"`, `"call"`, `"email"` |

**Example Requests**
```
GET /api/dashboard
GET /api/dashboard?time_window=30d&channel=chat
GET /api/dashboard?time_window=24h&channel=all
```

**Success Response — `200 OK`**

Returns the full dashboard payload JSON (see `build_dashboard_payloads` output structure above).

**Error Response — `404 Not Found`**
```json
{
  "detail": "No dashboard file found for time_window='90d' and channel='chat'. Valid time windows: 24h, 7d, 30d. Valid channels: all, chat, call, email."
}
```

---

## Regenerating the Output Files

Run `etl_pipeline.py` any time the source data changes:

```bash
venv\Scripts\python.exe etl_pipeline.py
```

The pipeline will:
1. Load `case_level_data.csv`
2. Auto-detect the max date as the reference anchor
3. Compute all metrics and write 12 JSON files to `output/`

