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

export const CALL_TRENDS_24H = [
    { time: "00:00", resolution: 72, volume: 210, escalation: 18 },
    { time: "04:00", resolution: 65, volume: 140, escalation: 22 },
    { time: "08:00", resolution: 80, volume: 480, escalation: 15 },
    { time: "12:00", resolution: 88, volume: 920, escalation: 10 },
    { time: "16:00", resolution: 76, volume: 1100, escalation: 20 },
    { time: "18:00", resolution: 60, volume: 1540, escalation: 35 },
    { time: "20:00", resolution: 70, volume: 1200, escalation: 28 },
    { time: "22:00", resolution: 82, volume: 740, escalation: 14 },
];

export const CALL_TRENDS_7D = [
    { time: "Mon", resolution: 78, volume: 5200, escalation: 16 },
    { time: "Tue", resolution: 81, volume: 4900, escalation: 14 },
    { time: "Wed", resolution: 74, volume: 6100, escalation: 22 },
    { time: "Thu", resolution: 83, volume: 5600, escalation: 12 },
    { time: "Fri", resolution: 70, volume: 7200, escalation: 28 },
    { time: "Sat", resolution: 86, volume: 4100, escalation: 10 },
    { time: "Sun", resolution: 90, volume: 3200, escalation: 8 },
];

export const CALL_TRENDS_30D = [
    { time: "Week 1", resolution: 75, volume: 28000, escalation: 18 },
    { time: "Week 2", resolution: 79, volume: 31000, escalation: 16 },
    { time: "Week 3", resolution: 83, volume: 29500, escalation: 13 },
    { time: "Week 4", resolution: 88, volume: 26000, escalation: 10 },
];

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
    { rank: 1,  name: "Payment Failed",    category: "Payments",  volume: 8432, dropOff: "34%", escalation: "18%", sentiment: "Negative" },
    { rank: 2,  name: "Order Not Created", category: "Orders",    volume: 5231, dropOff: "22%", escalation: "12%", sentiment: "Negative" },
    { rank: 3,  name: "Refund Delay",      category: "Payments",  volume: 4120, dropOff: "41%", escalation: "28%", sentiment: "Negative" },
    { rank: 4,  name: "Card Declined",     category: "Payments",  volume: 3890, dropOff: "29%", escalation: "15%", sentiment: "Neutral"  },
    { rank: 5,  name: "OTP Not Received",  category: "Account",   volume: 2100, dropOff: "18%", escalation: "9%",  sentiment: "Neutral"  },
    { rank: 6,  name: "Delivery Tracking", category: "Delivery",  volume: 1800, dropOff: "12%", escalation: "6%",  sentiment: "Neutral"  },
    { rank: 7,  name: "Checkout Error",    category: "Technical", volume: 1560, dropOff: "37%", escalation: "21%", sentiment: "Negative" },
    { rank: 8,  name: "Login Problem",     category: "Account",   volume: 1240, dropOff: "8%",  escalation: "4%",  sentiment: "Positive" },
    { rank: 9,  name: "App Crash",         category: "Technical", volume: 980,  dropOff: "55%", escalation: "44%", sentiment: "Negative" },
    { rank: 10, name: "Coupon Error",      category: "Payments",  volume: 850,  dropOff: "16%", escalation: "7%",  sentiment: "Neutral"  },
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
