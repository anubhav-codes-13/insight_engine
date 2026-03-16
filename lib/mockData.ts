export const TOP_ISSUES = [
    { name: "Payment Failed", count: 8432, healingTime: "2m", color: "hsl(var(--destructive))" },
    { name: "Order Not Created", count: 5231, healingTime: "3m", color: "hsl(var(--warning))" },
    { name: "Refund Delay", count: 4120, healingTime: "5m", color: "hsl(var(--primary))" },
    { name: "Card Declined", count: 3890, healingTime: "2m", color: "hsl(var(--destructive))" },
    { name: "OTP Not Received", count: 2100, healingTime: "1m", color: "hsl(var(--secondary))" },
    { name: "Delivery Tracking", count: 1800, healingTime: "4m", color: "hsl(var(--accent))" },
    { name: "Checkout Error", count: 1560, healingTime: "3m", color: "hsl(var(--warning))" },
    { name: "Login Problem", count: 1240, healingTime: "1m", color: "hsl(var(--secondary))" },
    { name: "App Crash", count: 980, healingTime: "Unknown", color: "hsl(var(--destructive))" },
    { name: "Coupon Error", count: 850, healingTime: "2m", color: "hsl(var(--primary))" },
];

type Cluster = { name: string; count: number; healingTime: string };

export const CLUSTER_DATA: Record<string, Record<string, Cluster[]>> = {
    "24h": {
        All:   [
            { name: "Payment Failed",    count: 1204, healingTime: "2m" },
            { name: "Order Not Created", count:  747, healingTime: "3m" },
            { name: "Refund Delay",      count:  589, healingTime: "5m" },
            { name: "Card Declined",     count:  556, healingTime: "2m" },
            { name: "OTP Not Received",  count:  300, healingTime: "1m" },
            { name: "Delivery Tracking", count:  257, healingTime: "4m" },
        ],
        Chat:  [
            { name: "Payment Failed",    count:  662, healingTime: "2m" },
            { name: "OTP Not Received",  count:  245, healingTime: "1m" },
            { name: "Card Declined",     count:  210, healingTime: "2m" },
            { name: "Checkout Error",    count:  180, healingTime: "3m" },
            { name: "Login Problem",     count:  142, healingTime: "1m" },
            { name: "Coupon Error",      count:  115, healingTime: "2m" },
        ],
        Call:  [
            { name: "Payment Failed",    count:  361, healingTime: "2m" },
            { name: "Refund Delay",      count:  294, healingTime: "5m" },
            { name: "Order Not Created", count:  224, healingTime: "3m" },
            { name: "Card Declined",     count:  167, healingTime: "2m" },
            { name: "App Crash",         count:  112, healingTime: "Unknown" },
            { name: "Delivery Tracking", count:   89, healingTime: "4m" },
        ],
        Email: [
            { name: "Refund Delay",      count:  236, healingTime: "5m" },
            { name: "Payment Failed",    count:  181, healingTime: "2m" },
            { name: "Order Not Created", count:  149, healingTime: "3m" },
            { name: "Delivery Tracking", count:  112, healingTime: "4m" },
            { name: "Card Declined",     count:   89, healingTime: "2m" },
            { name: "Checkout Error",    count:   74, healingTime: "3m" },
        ],
    },
    "7d": {
        All:   [
            { name: "Payment Failed",    count: 8432, healingTime: "2m" },
            { name: "Order Not Created", count: 5231, healingTime: "3m" },
            { name: "Refund Delay",      count: 4120, healingTime: "5m" },
            { name: "Card Declined",     count: 3890, healingTime: "2m" },
            { name: "OTP Not Received",  count: 2100, healingTime: "1m" },
            { name: "Delivery Tracking", count: 1800, healingTime: "4m" },
        ],
        Chat:  [
            { name: "Payment Failed",    count: 4638, healingTime: "2m" },
            { name: "OTP Not Received",  count: 1710, healingTime: "1m" },
            { name: "Card Declined",     count: 1470, healingTime: "2m" },
            { name: "Checkout Error",    count: 1260, healingTime: "3m" },
            { name: "Login Problem",     count:  994, healingTime: "1m" },
            { name: "Coupon Error",      count:  808, healingTime: "2m" },
        ],
        Call:  [
            { name: "Payment Failed",    count: 2530, healingTime: "2m" },
            { name: "Refund Delay",      count: 2060, healingTime: "5m" },
            { name: "Order Not Created", count: 1569, healingTime: "3m" },
            { name: "Card Declined",     count: 1167, healingTime: "2m" },
            { name: "App Crash",         count:  784, healingTime: "Unknown" },
            { name: "Delivery Tracking", count:  630, healingTime: "4m" },
        ],
        Email: [
            { name: "Refund Delay",      count: 1648, healingTime: "5m" },
            { name: "Payment Failed",    count: 1265, healingTime: "2m" },
            { name: "Order Not Created", count: 1047, healingTime: "3m" },
            { name: "Delivery Tracking", count:  784, healingTime: "4m" },
            { name: "Card Declined",     count:  623, healingTime: "2m" },
            { name: "Checkout Error",    count:  520, healingTime: "3m" },
        ],
    },
    "30d": {
        All:   [
            { name: "Payment Failed",    count: 33728, healingTime: "2m" },
            { name: "Order Not Created", count: 20924, healingTime: "3m" },
            { name: "Refund Delay",      count: 16480, healingTime: "5m" },
            { name: "Card Declined",     count: 15560, healingTime: "2m" },
            { name: "OTP Not Received",  count:  8400, healingTime: "1m" },
            { name: "Delivery Tracking", count:  7200, healingTime: "4m" },
        ],
        Chat:  [
            { name: "Payment Failed",    count: 18550, healingTime: "2m" },
            { name: "OTP Not Received",  count:  6840, healingTime: "1m" },
            { name: "Card Declined",     count:  5880, healingTime: "2m" },
            { name: "Checkout Error",    count:  5040, healingTime: "3m" },
            { name: "Login Problem",     count:  3978, healingTime: "1m" },
            { name: "Coupon Error",      count:  3230, healingTime: "2m" },
        ],
        Call:  [
            { name: "Payment Failed",    count: 10118, healingTime: "2m" },
            { name: "Refund Delay",      count:  8240, healingTime: "5m" },
            { name: "Order Not Created", count:  6277, healingTime: "3m" },
            { name: "Card Declined",     count:  4668, healingTime: "2m" },
            { name: "App Crash",         count:  3136, healingTime: "Unknown" },
            { name: "Delivery Tracking", count:  2520, healingTime: "4m" },
        ],
        Email: [
            { name: "Refund Delay",      count:  6592, healingTime: "5m" },
            { name: "Payment Failed",    count:  5060, healingTime: "2m" },
            { name: "Order Not Created", count:  4185, healingTime: "3m" },
            { name: "Delivery Tracking", count:  3136, healingTime: "4m" },
            { name: "Card Declined",     count:  2490, healingTime: "2m" },
            { name: "Checkout Error",    count:  2080, healingTime: "3m" },
        ],
    },
};

export const TREND_DATA = [
    { time: "00:00", issues: 400 },
    { time: "04:00", issues: 300 },
    { time: "08:00", issues: 600 },
    { time: "12:00", issues: 1200 },
    { time: "16:00", issues: 1800 },
    { time: "18:00", issues: 2400 }, // Spike detected
    { time: "20:00", issues: 2100 },
    { time: "22:00", issues: 1500 },
];

export const ANALYTICS_STATS = {
    totalRequests: "28,431",
    avgHealingTime: "2.3 min",
    csatScore: "92%",
    dropOffRate: "11%",
    automationRate: 78,
    humanEscalation: 22,
};

// --- Overview Screen ---

export const CHANNEL_TRENDS: Record<string, Record<string, { time: string; resolution: number; volume: number; escalation: number }[]>> = {
    "24h": {
        All:   [
            { time: "00:00", resolution: 72, volume: 210,  escalation: 18 },
            { time: "04:00", resolution: 65, volume: 140,  escalation: 22 },
            { time: "08:00", resolution: 80, volume: 480,  escalation: 15 },
            { time: "12:00", resolution: 88, volume: 920,  escalation: 10 },
            { time: "16:00", resolution: 76, volume: 1100, escalation: 20 },
            { time: "18:00", resolution: 60, volume: 1540, escalation: 35 },
            { time: "20:00", resolution: 70, volume: 1200, escalation: 28 },
            { time: "22:00", resolution: 82, volume: 740,  escalation: 14 },
        ],
        Chat:  [
            { time: "00:00", resolution: 82, volume: 115,  escalation: 10 },
            { time: "04:00", resolution: 76, volume: 78,   escalation: 13 },
            { time: "08:00", resolution: 89, volume: 265,  escalation: 8  },
            { time: "12:00", resolution: 93, volume: 506,  escalation: 6  },
            { time: "16:00", resolution: 84, volume: 605,  escalation: 12 },
            { time: "18:00", resolution: 72, volume: 847,  escalation: 20 },
            { time: "20:00", resolution: 79, volume: 660,  escalation: 15 },
            { time: "22:00", resolution: 88, volume: 407,  escalation: 8  },
        ],
        Call:  [
            { time: "00:00", resolution: 62, volume: 63,   escalation: 28 },
            { time: "04:00", resolution: 55, volume: 42,   escalation: 34 },
            { time: "08:00", resolution: 71, volume: 144,  escalation: 24 },
            { time: "12:00", resolution: 80, volume: 276,  escalation: 16 },
            { time: "16:00", resolution: 66, volume: 330,  escalation: 30 },
            { time: "18:00", resolution: 48, volume: 462,  escalation: 50 },
            { time: "20:00", resolution: 60, volume: 360,  escalation: 42 },
            { time: "22:00", resolution: 74, volume: 222,  escalation: 22 },
        ],
        Email: [
            { time: "00:00", resolution: 55, volume: 32,   escalation: 22 },
            { time: "04:00", resolution: 48, volume: 20,   escalation: 28 },
            { time: "08:00", resolution: 64, volume: 71,   escalation: 20 },
            { time: "12:00", resolution: 72, volume: 138,  escalation: 14 },
            { time: "16:00", resolution: 60, volume: 165,  escalation: 24 },
            { time: "18:00", resolution: 44, volume: 231,  escalation: 38 },
            { time: "20:00", resolution: 54, volume: 180,  escalation: 30 },
            { time: "22:00", resolution: 68, volume: 111,  escalation: 18 },
        ],
    },
    "7d": {
        All:   [
            { time: "Mon", resolution: 78, volume: 5200,  escalation: 16 },
            { time: "Tue", resolution: 81, volume: 4900,  escalation: 14 },
            { time: "Wed", resolution: 74, volume: 6100,  escalation: 22 },
            { time: "Thu", resolution: 83, volume: 5600,  escalation: 12 },
            { time: "Fri", resolution: 70, volume: 7200,  escalation: 28 },
            { time: "Sat", resolution: 86, volume: 4100,  escalation: 10 },
            { time: "Sun", resolution: 90, volume: 3200,  escalation: 8  },
        ],
        Chat:  [
            { time: "Mon", resolution: 87, volume: 2860,  escalation: 9  },
            { time: "Tue", resolution: 89, volume: 2695,  escalation: 8  },
            { time: "Wed", resolution: 82, volume: 3355,  escalation: 13 },
            { time: "Thu", resolution: 91, volume: 3080,  escalation: 7  },
            { time: "Fri", resolution: 79, volume: 3960,  escalation: 16 },
            { time: "Sat", resolution: 93, volume: 2255,  escalation: 6  },
            { time: "Sun", resolution: 96, volume: 1760,  escalation: 5  },
        ],
        Call:  [
            { time: "Mon", resolution: 67, volume: 1560,  escalation: 26 },
            { time: "Tue", resolution: 71, volume: 1470,  escalation: 23 },
            { time: "Wed", resolution: 64, volume: 1830,  escalation: 34 },
            { time: "Thu", resolution: 73, volume: 1680,  escalation: 20 },
            { time: "Fri", resolution: 59, volume: 2160,  escalation: 44 },
            { time: "Sat", resolution: 76, volume: 1230,  escalation: 16 },
            { time: "Sun", resolution: 80, volume: 960,   escalation: 13 },
        ],
        Email: [
            { time: "Mon", resolution: 52, volume: 780,   escalation: 20 },
            { time: "Tue", resolution: 56, volume: 735,   escalation: 18 },
            { time: "Wed", resolution: 48, volume: 915,   escalation: 28 },
            { time: "Thu", resolution: 58, volume: 840,   escalation: 16 },
            { time: "Fri", resolution: 44, volume: 1080,  escalation: 36 },
            { time: "Sat", resolution: 62, volume: 615,   escalation: 14 },
            { time: "Sun", resolution: 68, volume: 480,   escalation: 10 },
        ],
    },
    "30d": {
        All:   [
            { time: "Week 1", resolution: 75, volume: 28000,  escalation: 18 },
            { time: "Week 2", resolution: 79, volume: 31000,  escalation: 16 },
            { time: "Week 3", resolution: 83, volume: 29500,  escalation: 13 },
            { time: "Week 4", resolution: 88, volume: 26000,  escalation: 10 },
        ],
        Chat:  [
            { time: "Week 1", resolution: 84, volume: 15400,  escalation: 10 },
            { time: "Week 2", resolution: 87, volume: 17050,  escalation: 9  },
            { time: "Week 3", resolution: 91, volume: 16225,  escalation: 7  },
            { time: "Week 4", resolution: 94, volume: 14300,  escalation: 6  },
        ],
        Call:  [
            { time: "Week 1", resolution: 64, volume: 8400,   escalation: 28 },
            { time: "Week 2", resolution: 68, volume: 9300,   escalation: 26 },
            { time: "Week 3", resolution: 72, volume: 8850,   escalation: 21 },
            { time: "Week 4", resolution: 78, volume: 7800,   escalation: 16 },
        ],
        Email: [
            { time: "Week 1", resolution: 50, volume: 4200,   escalation: 22 },
            { time: "Week 2", resolution: 54, volume: 4650,   escalation: 20 },
            { time: "Week 3", resolution: 58, volume: 4425,   escalation: 17 },
            { time: "Week 4", resolution: 64, volume: 3900,   escalation: 14 },
        ],
    },
};

// Legacy exports kept for backward compatibility
export const CALL_TRENDS_24H = CHANNEL_TRENDS["24h"].All;
export const CALL_TRENDS_7D  = CHANNEL_TRENDS["7d"].All;
export const CALL_TRENDS_30D = CHANNEL_TRENDS["30d"].All;

export const CHANNEL_STATS: Record<string, typeof ANALYTICS_STATS> = {
    All:   { totalRequests: "28,431", avgHealingTime: "2.3 min", csatScore: "92%", dropOffRate: "11%", automationRate: 78, humanEscalation: 22 },
    Chat:  { totalRequests: "15,637", avgHealingTime: "1.8 min", csatScore: "94%", dropOffRate: "8%",  automationRate: 85, humanEscalation: 15 },
    Call:  { totalRequests: "8,529",  avgHealingTime: "3.1 min", csatScore: "88%", dropOffRate: "16%", automationRate: 66, humanEscalation: 34 },
    Email: { totalRequests: "4,265",  avgHealingTime: "4.6 min", csatScore: "85%", dropOffRate: "19%", automationRate: 55, humanEscalation: 45 },
};

export const AI_INSIGHTS: Record<string, Record<string, string>> = {
    "24h": {
        All:   "In the last 24 hours, support volume peaked at 18:00 with 1,540 interactions — a surge driven by a payment gateway degradation. Escalation hit 35% at that window. AI resolution held at 70% overall. Recommend monitoring payment flows and pre-staging refund auto-replies for the evening window.",
        Chat:  "Chat volume over the last 24 hours peaked at 847 sessions at 18:00. Resolution rate stayed strong at 79% with escalation contained to 20%. OTP and card-decline issues dominated chat threads. Bot containment is healthy — no handoff spike detected.",
        Call:  "Call volume spiked to 462 at 18:00, with escalation reaching 50% — the highest across all channels. Payment failures drove the majority of inbound calls. Average handle time increased during the 16:00–20:00 window. Recommend staffing buffer for early evening call load.",
        Email: "Email tickets received a 24-hour high of 231 at 18:00. Refund delay queries account for 41% of all email volume. Resolution is lowest among channels at 54% with a 30% escalation rate. Prioritise refund SLA communication templates to reduce repeat contacts.",
    },
    "7d": {
        All:   "Support volume peaked on Friday at 7,200 interactions — a 24% surge vs. last week. Payment failure clusters drove 62% of escalations. AI resolution rate improved by 4.2 points to 83% after the SLM-v4.0 hot-patch deployed Wednesday. Recommend reviewing refund delay flows where drop-off remains elevated at 41%.",
        Chat:  "Chat handled 3,960 sessions on Friday, the weekly high. Resolution rate reached 96% on Sunday as volume normalised. Checkout errors and OTP failures are the top unresolved chat topics. Suggest adding a proactive OTP retry prompt to reduce user-initiated escalations.",
        Call:  "Call volume surged 44% on Friday with escalation at its weekly peak. Refund Delay and Payment Failed are the primary drivers. Wednesday saw the highest escalation rate at 34%. Consider deploying a call-deflection IVR flow for refund status queries to reduce live-agent load.",
        Email: "Email volume was highest on Friday at 1,080 tickets. Refund Delay alone accounts for 34% of the 7-day email backlog. Resolution rate is improving week-on-week but remains the lowest channel at 56%. Auto-acknowledge and ETA-setting templates could reduce escalation rate by an estimated 12%.",
    },
    "30d": {
        All:   "Over the last 30 days, total support volume reached 114,500 interactions with Week 2 as the peak at 31,000. Resolution improved from 75% to 88% across the month. Payment failures remain the top cluster at 33,728 tickets. Escalation declined 44% from Week 1 to Week 4 — indicating the SLM-v4 deployment had significant positive impact.",
        Chat:  "Chat resolution improved from 84% in Week 1 to 94% in Week 4, the strongest trend across all channels. Volume peaked in Week 2 at 17,050 sessions. OTP and card-decline issues are declining, suggesting upstream payment fixes are taking effect. Recommend promoting chat as the primary deflection channel given its performance trajectory.",
        Call:  "Call escalation dropped from 28% in Week 1 to 16% in Week 4 following the SLM retrain. However, call volume remains high for Refund Delay issues — 8,240 tickets over 30 days. Deflecting refund status queries to a self-serve portal could save an estimated 3,100 call minutes per week.",
        Email: "Email volume totalled 18,975 tickets over 30 days with Refund Delay as the dominant topic at 6,592 tickets. Resolution improved from 50% to 64% but remains below target. Average handling time is 4.6 minutes — 2× the chat baseline. Automating refund status acknowledgements is the highest-ROI action for this channel.",
    },
};

export const TOP_TOPICS = [
    { topic: "Payment Failed",    volume: 8432, share: 100 },
    { topic: "Order Not Created", volume: 5231, share: 62  },
    { topic: "Refund Delay",      volume: 4120, share: 49  },
    { topic: "Card Declined",     volume: 3890, share: 46  },
    { topic: "OTP Not Received",  volume: 2100, share: 25  },
    { topic: "Delivery Tracking", volume: 1800, share: 21  },
    { topic: "Checkout Error",    volume: 1560, share: 18  },
];

// --- Insights Screen ---

export const L1_CATEGORIES = ["All", "Payments", "Orders", "Account", "Delivery", "Technical"];

export const INSIGHTS_TOPICS = [
    { rank: 1,  name: "Payment Failed",    category: "Payments",  volume: 8432, csat: "68%", dropOff: "34%", aht: "4m 12s", isResolved: "61%", repeat: "29%", escalation: "18%" },
    { rank: 2,  name: "Order Not Created", category: "Orders",    volume: 5231, csat: "72%", dropOff: "22%", aht: "3m 48s", isResolved: "74%", repeat: "21%", escalation: "12%" },
    { rank: 3,  name: "Refund Delay",      category: "Payments",  volume: 4120, csat: "64%", dropOff: "41%", aht: "5m 30s", isResolved: "52%", repeat: "38%", escalation: "28%" },
    { rank: 4,  name: "Card Declined",     category: "Payments",  volume: 3890, csat: "75%", dropOff: "29%", aht: "2m 55s", isResolved: "68%", repeat: "24%", escalation: "15%" },
    { rank: 5,  name: "OTP Not Received",  category: "Account",   volume: 2100, csat: "82%", dropOff: "18%", aht: "1m 20s", isResolved: "88%", repeat: "12%", escalation: "9%"  },
    { rank: 6,  name: "Delivery Tracking", category: "Delivery",  volume: 1800, csat: "80%", dropOff: "12%", aht: "2m 10s", isResolved: "86%", repeat: "10%", escalation: "6%"  },
    { rank: 7,  name: "Checkout Error",    category: "Technical", volume: 1560, csat: "70%", dropOff: "37%", aht: "3m 40s", isResolved: "58%", repeat: "31%", escalation: "21%" },
    { rank: 8,  name: "Login Problem",     category: "Account",   volume: 1240, csat: "91%", dropOff: "8%",  aht: "58s",    isResolved: "94%", repeat: "6%",  escalation: "4%"  },
    { rank: 9,  name: "App Crash",         category: "Technical", volume: 980,  csat: "55%", dropOff: "55%", aht: "6m 05s", isResolved: "40%", repeat: "44%", escalation: "44%" },
    { rank: 10, name: "Coupon Error",      category: "Payments",  volume: 850,  csat: "78%", dropOff: "16%", aht: "1m 45s", isResolved: "82%", repeat: "14%", escalation: "7%"  },
];

// --- Monitoring Screen ---

export const TRENDING_TOPICS = [
    { name: "Checkout Error",    change: "+42%", volume: 1560, spark: [12, 18, 22, 30, 38, 45] },
    { name: "App Crash",         change: "+31%", volume: 980,  spark: [8,  10, 14, 18, 22, 31] },
    { name: "OTP Not Received",  change: "+18%", volume: 2100, spark: [20, 22, 21, 24, 26, 28] },
    { name: "Delivery Tracking", change: "+14%", volume: 1800, spark: [16, 17, 18, 19, 21, 24] },
];

export const TOP_PERFORMING_TOPICS = [
    { name: "Login Problem",    resolutionRate: "96%", avgTime: "58s",   csat: "94%" },
    { name: "OTP Not Received", resolutionRate: "92%", avgTime: "1m 2s", csat: "91%" },
    { name: "Coupon Error",     resolutionRate: "90%", avgTime: "1m 20s",csat: "89%" },
    { name: "Card Declined",    resolutionRate: "87%", avgTime: "1m 45s",csat: "87%" },
];

export const TOPIC_RESOLUTION_DATA = [
    { name: "Fully Resolved", value: 62, color: "#10b981" },
    { name: "Partial",        value: 24, color: "#f59e0b" },
    { name: "Escalated",      value: 14, color: "#ef4444" },
];

export const AI_TOOLS = [
    { name: "GPT-4o",                   type: "LLM",        status: "active",  version: "2024-11"  },
    { name: "text-embedding-3-large",   type: "Embedding",  status: "active",  version: "v3"       },
    { name: "Whisper v3",               type: "STT",        status: "active",  version: "large-v3" },
    { name: "Custom SLM v4",            type: "Classifier", status: "active",  version: "4.0.2"    },
    { name: "GPT-3.5-turbo",            type: "Fallback",   status: "standby", version: "0125"     },
];

export const TOKEN_USAGE = [
    { model: "GPT-4o",    used: 3_200_000, limit: 5_000_000,  pct: 64 },
    { model: "Embedding", used: 8_100_000, limit: 10_000_000, pct: 81 },
    { model: "GPT-3.5",   used: 420_000,   limit: 2_000_000,  pct: 21 },
];

export const MODEL_PERFORMANCE = [
    { time: "00:00", latency: 320, accuracy: 97 },
    { time: "04:00", latency: 280, accuracy: 98 },
    { time: "08:00", latency: 410, accuracy: 96 },
    { time: "12:00", latency: 560, accuracy: 94 },
    { time: "16:00", latency: 490, accuracy: 95 },
    { time: "18:00", latency: 680, accuracy: 92 },
    { time: "20:00", latency: 510, accuracy: 94 },
    { time: "22:00", latency: 350, accuracy: 97 },
];

export const AI_QUALITY = {
    bleuScore: 0.82,
    hallucinationRate: "1.4%",
    groundednessScore: "94.6%",
    coherenceScore: "96.2%",
    fluencyScore: "97.8%",
};

export const MONITORING_ALERTS = [
    { id: "m1", severity: "warning",  msg: "Embedding model latency spiked to 820ms",       system: "EMBED-ENGINE",  time: "8m ago"  },
    { id: "m2", severity: "info",     msg: "GPT-4o context window utilization at 74%",       system: "LLM-ROUTER",   time: "22m ago" },
    { id: "m3", severity: "critical", msg: "Hallucination rate exceeded 2% threshold",       system: "QUALITY-GUARD", time: "1h ago" },
    { id: "m4", severity: "info",     msg: "SLM v4.0.2 classifier retrained on new batch",   system: "ML-OPS",       time: "3h ago"  },
];
