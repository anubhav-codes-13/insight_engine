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
