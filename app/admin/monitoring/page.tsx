"use client";

import { useState, useMemo } from "react";
import AdminLayout from "@/components/dashboard/AdminLayout";
import { ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, CheckCircle2, Activity, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
type DateRange = "24h" | "7d" | "30d";
type Channel   = "All" | "Chat" | "Call" | "Email";

const DATE_RANGES: DateRange[] = ["24h", "7d", "30d"];
const CHANNELS:   Channel[]   = ["All", "Chat", "Call", "Email"];
const DATE_LABELS: Record<DateRange, string> = { "24h": "24 Hours", "7d": "7 Days", "30d": "30 Days" };

// ─── L1 Topic base data ───────────────────────────────────────────────────────
const L1_TOPICS = [
    { name: "Payment Failed",    healTime: "2m", baseVol: 8432 },
    { name: "Order Not Created", healTime: "3m", baseVol: 5231 },
    { name: "Refund Delay",      healTime: "5m", baseVol: 4120 },
    { name: "Card Declined",     healTime: "2m", baseVol: 3890 },
    { name: "OTP Not Received",  healTime: "1m", baseVol: 2100 },
    { name: "Delivery Tracking", healTime: "4m", baseVol: 1800 },
];

// ─── Volume multipliers ───────────────────────────────────────────────────────
const VOL_MULT:  Record<DateRange, number> = { "24h": 1 / 7, "7d": 1,    "30d": 4.3  };
const CHAN_SPLIT: Record<Channel, number>  = { "All": 1,      "Chat": 0.55, "Call": 0.30, "Email": 0.15 };

// ─── Per-topic metrics table (dynamic by filter) ──────────────────────────────
const TOPIC_BASE: Record<string, { res: number; rep: number; drop: number }> = {
    "Payment Failed":    { res: 61, rep: 29, drop: 34 },
    "Order Not Created": { res: 74, rep: 21, drop: 22 },
    "Refund Delay":      { res: 52, rep: 38, drop: 41 },
    "Card Declined":     { res: 68, rep: 24, drop: 29 },
    "OTP Not Received":  { res: 88, rep: 12, drop: 18 },
    "Delivery Tracking": { res: 86, rep: 10, drop: 12 },
};
const DATE_METRIC_ADJ: Record<string, { res: number; rep: number; drop: number }> = {
    "24h": { res: -5, rep:  4, drop:  5 },
    "7d":  { res:  0, rep:  0, drop:  0 },
    "30d": { res:  4, rep: -3, drop: -4 },
};
const CHAN_METRIC_ADJ: Record<string, { res: number; rep: number; drop: number }> = {
    "All":   { res:   0, rep:  0, drop:  0 },
    "Chat":  { res:  10, rep: -8, drop: -8 },
    "Call":  { res:  -7, rep:  6, drop:  7 },
    "Email": { res: -14, rep: 10, drop: 12 },
};
function getTopicMetrics(dr: string, ch: string): Record<string, { resolution: string; repeatCall: string; dropOff: string }> {
    const da = DATE_METRIC_ADJ[dr] ?? DATE_METRIC_ADJ["7d"];
    const ca = CHAN_METRIC_ADJ[ch] ?? CHAN_METRIC_ADJ["All"];
    const clamp = (v: number) => Math.min(98, Math.max(5, v));
    return Object.fromEntries(Object.entries(TOPIC_BASE).map(([name, b]) => [name, {
        resolution: `${clamp(b.res  + da.res  + ca.res)}%`,
        repeatCall: `${clamp(b.rep  + da.rep  + ca.rep)}%`,
        dropOff:    `${clamp(b.drop + da.drop + ca.drop)}%`,
    }]));
}

// ─── Trending topics per filter ───────────────────────────────────────────────
const TRENDING_BY_FILTER: Record<string, { name: string; change: string; volume: number; spark: number[] }[]> = {
    "24h-All":   [
        { name: "Checkout Error",    change: "+42%", volume: 223,  spark: [12, 18, 22, 30, 38, 45] },
        { name: "App Crash",         change: "+31%", volume: 140,  spark: [8,  10, 14, 18, 22, 31] },
        { name: "OTP Not Received",  change: "+18%", volume: 300,  spark: [20, 22, 21, 24, 26, 28] },
        { name: "Delivery Tracking", change: "+14%", volume: 257,  spark: [16, 17, 18, 19, 21, 24] },
    ],
    "7d-All":    [
        { name: "Checkout Error",    change: "+42%", volume: 1560, spark: [12, 18, 22, 30, 38, 45] },
        { name: "App Crash",         change: "+31%", volume: 980,  spark: [8,  10, 14, 18, 22, 31] },
        { name: "OTP Not Received",  change: "+18%", volume: 2100, spark: [20, 22, 21, 24, 26, 28] },
        { name: "Delivery Tracking", change: "+14%", volume: 1800, spark: [16, 17, 18, 19, 21, 24] },
    ],
    "30d-All":   [
        { name: "Checkout Error",    change: "+38%", volume: 6708,  spark: [18, 26, 30, 38, 46, 52] },
        { name: "Payment Failed",    change: "+29%", volume: 33728, spark: [10, 14, 18, 24, 30, 38] },
        { name: "App Crash",         change: "+26%", volume: 4214,  spark: [8,  12, 16, 20, 26, 32] },
        { name: "Refund Delay",      change: "+19%", volume: 17716, spark: [20, 24, 22, 26, 28, 30] },
    ],
    "24h-Chat":  [
        { name: "OTP Not Received",  change: "+38%", volume: 165, spark: [14, 20, 24, 32, 40, 48] },
        { name: "Checkout Error",    change: "+29%", volume: 123, spark: [8,  12, 16, 22, 28, 36] },
        { name: "Payment Failed",    change: "+22%", volume: 662, spark: [18, 20, 21, 24, 26, 28] },
        { name: "Card Declined",     change: "+16%", volume: 304, spark: [12, 14, 15, 18, 20, 22] },
    ],
    "7d-Chat":   [
        { name: "OTP Not Received",  change: "+38%", volume: 1155, spark: [14, 20, 24, 32, 40, 48] },
        { name: "Checkout Error",    change: "+29%", volume: 858,  spark: [8,  12, 16, 22, 28, 36] },
        { name: "Payment Failed",    change: "+22%", volume: 4638, spark: [18, 20, 21, 24, 26, 28] },
        { name: "Card Declined",     change: "+16%", volume: 2140, spark: [12, 14, 15, 18, 20, 22] },
    ],
    "30d-Chat":  [
        { name: "OTP Not Received",  change: "+34%", volume: 4967,  spark: [16, 22, 26, 34, 42, 50] },
        { name: "Payment Failed",    change: "+28%", volume: 19950, spark: [12, 16, 20, 26, 32, 40] },
        { name: "Checkout Error",    change: "+24%", volume: 3689,  spark: [10, 14, 18, 22, 28, 34] },
        { name: "Card Declined",     change: "+18%", volume: 9199,  spark: [14, 16, 17, 20, 22, 24] },
    ],
    "24h-Call":  [
        { name: "Refund Delay",      change: "+44%", volume: 176, spark: [10, 16, 20, 30, 40, 48] },
        { name: "Payment Failed",    change: "+32%", volume: 361, spark: [8,  10, 14, 18, 24, 32] },
        { name: "App Crash",         change: "+28%", volume: 42,  spark: [6,  8,  10, 14, 18, 26] },
        { name: "Order Not Created", change: "+19%", volume: 224, spark: [16, 18, 18, 21, 23, 24] },
    ],
    "7d-Call":   [
        { name: "Refund Delay",      change: "+44%", volume: 1236, spark: [10, 16, 20, 30, 40, 48] },
        { name: "Payment Failed",    change: "+32%", volume: 2530, spark: [8,  10, 14, 18, 24, 32] },
        { name: "App Crash",         change: "+28%", volume: 294,  spark: [6,  8,  10, 14, 18, 26] },
        { name: "Order Not Created", change: "+19%", volume: 1569, spark: [16, 18, 18, 21, 23, 24] },
    ],
    "30d-Call":  [
        { name: "Refund Delay",      change: "+40%", volume: 5315,  spark: [12, 18, 22, 32, 42, 50] },
        { name: "Payment Failed",    change: "+30%", volume: 10879, spark: [10, 12, 16, 20, 26, 34] },
        { name: "App Crash",         change: "+26%", volume: 1265,  spark: [8,  10, 12, 16, 20, 28] },
        { name: "Order Not Created", change: "+20%", volume: 6748,  spark: [18, 20, 20, 23, 25, 26] },
    ],
    "24h-Email": [
        { name: "Refund Delay",      change: "+48%", volume: 88,  spark: [8,  14, 18, 28, 38, 46] },
        { name: "Order Not Created", change: "+28%", volume: 112, spark: [6,  8,  10, 14, 20, 28] },
        { name: "Payment Failed",    change: "+21%", volume: 181, spark: [14, 16, 17, 20, 22, 24] },
        { name: "Checkout Error",    change: "+15%", volume: 33,  spark: [10, 11, 12, 14, 15, 17] },
    ],
    "7d-Email":  [
        { name: "Refund Delay",      change: "+48%", volume: 618,  spark: [8,  14, 18, 28, 38, 46] },
        { name: "Order Not Created", change: "+28%", volume: 785,  spark: [6,  8,  10, 14, 20, 28] },
        { name: "Payment Failed",    change: "+21%", volume: 1265, spark: [14, 16, 17, 20, 22, 24] },
        { name: "Checkout Error",    change: "+15%", volume: 234,  spark: [10, 11, 12, 14, 15, 17] },
    ],
    "30d-Email": [
        { name: "Refund Delay",      change: "+44%", volume: 2657, spark: [10, 16, 20, 30, 40, 48] },
        { name: "Order Not Created", change: "+26%", volume: 3375, spark: [8,  10, 12, 16, 22, 30] },
        { name: "Payment Failed",    change: "+19%", volume: 5440, spark: [16, 18, 19, 22, 24, 26] },
        { name: "Checkout Error",    change: "+13%", volume: 1006, spark: [12, 13, 14, 16, 17, 19] },
    ],
};

// ─── Top performing per filter ────────────────────────────────────────────────
const PERFORMING_BY_FILTER: Record<string, { name: string; resolutionRate: string; avgTime: string; csat: string }[]> = {
    "24h-All":   [{ name: "Login Problem", resolutionRate: "94%", avgTime: "1m 2s",  csat: "92%" }, { name: "OTP Not Received", resolutionRate: "90%", avgTime: "1m 10s", csat: "89%" }, { name: "Coupon Error",      resolutionRate: "88%", avgTime: "1m 32s", csat: "87%" }, { name: "Card Declined",     resolutionRate: "84%", avgTime: "1m 58s", csat: "85%" }],
    "7d-All":    [{ name: "Login Problem", resolutionRate: "96%", avgTime: "58s",    csat: "94%" }, { name: "OTP Not Received", resolutionRate: "92%", avgTime: "1m 2s",  csat: "91%" }, { name: "Coupon Error",      resolutionRate: "90%", avgTime: "1m 20s", csat: "89%" }, { name: "Card Declined",     resolutionRate: "87%", avgTime: "1m 45s", csat: "87%" }],
    "30d-All":   [{ name: "Login Problem", resolutionRate: "97%", avgTime: "52s",    csat: "95%" }, { name: "OTP Not Received", resolutionRate: "94%", avgTime: "58s",    csat: "93%" }, { name: "Coupon Error",      resolutionRate: "92%", avgTime: "1m 10s", csat: "91%" }, { name: "Card Declined",     resolutionRate: "89%", avgTime: "1m 38s", csat: "88%" }],
    "24h-Chat":  [{ name: "Login Problem", resolutionRate: "96%", avgTime: "48s",    csat: "94%" }, { name: "OTP Not Received", resolutionRate: "93%", avgTime: "52s",    csat: "91%" }, { name: "Card Declined",     resolutionRate: "90%", avgTime: "1m 18s", csat: "89%" }, { name: "Coupon Error",      resolutionRate: "89%", avgTime: "1m 2s",  csat: "88%" }],
    "7d-Chat":   [{ name: "Login Problem", resolutionRate: "98%", avgTime: "42s",    csat: "96%" }, { name: "OTP Not Received", resolutionRate: "95%", avgTime: "48s",    csat: "93%" }, { name: "Card Declined",     resolutionRate: "92%", avgTime: "1m 12s", csat: "91%" }, { name: "Coupon Error",      resolutionRate: "91%", avgTime: "58s",    csat: "90%" }],
    "30d-Chat":  [{ name: "Login Problem", resolutionRate: "99%", avgTime: "38s",    csat: "97%" }, { name: "OTP Not Received", resolutionRate: "96%", avgTime: "44s",    csat: "95%" }, { name: "Card Declined",     resolutionRate: "93%", avgTime: "1m 6s",  csat: "92%" }, { name: "Coupon Error",      resolutionRate: "92%", avgTime: "52s",    csat: "91%" }],
    "24h-Call":  [{ name: "Login Problem", resolutionRate: "90%", avgTime: "1m 20s", csat: "88%" }, { name: "OTP Not Received", resolutionRate: "86%", avgTime: "1m 30s", csat: "85%" }, { name: "Card Declined",     resolutionRate: "82%", avgTime: "2m 18s", csat: "82%" }, { name: "Coupon Error",      resolutionRate: "81%", avgTime: "1m 58s", csat: "81%" }],
    "7d-Call":   [{ name: "Login Problem", resolutionRate: "92%", avgTime: "1m 12s", csat: "90%" }, { name: "OTP Not Received", resolutionRate: "88%", avgTime: "1m 22s", csat: "87%" }, { name: "Card Declined",     resolutionRate: "85%", avgTime: "2m 8s",  csat: "84%" }, { name: "Coupon Error",      resolutionRate: "84%", avgTime: "1m 48s", csat: "83%" }],
    "30d-Call":  [{ name: "Login Problem", resolutionRate: "94%", avgTime: "1m 4s",  csat: "92%" }, { name: "OTP Not Received", resolutionRate: "90%", avgTime: "1m 14s", csat: "89%" }, { name: "Card Declined",     resolutionRate: "87%", avgTime: "2m 2s",  csat: "86%" }, { name: "Coupon Error",      resolutionRate: "86%", avgTime: "1m 42s", csat: "85%" }],
    "24h-Email": [{ name: "Login Problem", resolutionRate: "80%", avgTime: "4m 48s", csat: "76%" }, { name: "Coupon Error",     resolutionRate: "76%", avgTime: "3m 38s", csat: "74%" }, { name: "OTP Not Received",  resolutionRate: "72%", avgTime: "5m 28s", csat: "72%" }, { name: "Delivery Tracking", resolutionRate: "70%", avgTime: "6m 42s", csat: "70%" }],
    "7d-Email":  [{ name: "Login Problem", resolutionRate: "82%", avgTime: "4m 30s", csat: "78%" }, { name: "Coupon Error",     resolutionRate: "78%", avgTime: "3m 20s", csat: "76%" }, { name: "OTP Not Received",  resolutionRate: "74%", avgTime: "5m 10s", csat: "74%" }, { name: "Delivery Tracking", resolutionRate: "72%", avgTime: "6m 20s", csat: "72%" }],
    "30d-Email": [{ name: "Login Problem", resolutionRate: "84%", avgTime: "4m 10s", csat: "80%" }, { name: "Coupon Error",     resolutionRate: "80%", avgTime: "3m 2s",  csat: "78%" }, { name: "OTP Not Received",  resolutionRate: "76%", avgTime: "4m 52s", csat: "76%" }, { name: "Delivery Tracking", resolutionRate: "74%", avgTime: "5m 58s", csat: "74%" }],
};




// ─── Per-L1-topic trending (sub-issues) ───────────────────────────────────────
const L1_TOPIC_TRENDING: Record<string, { name: string; change: string; volume: number; spark: number[] }[]> = {
    "Payment Failed":    [{ name: "3DS Auth Failure",      change: "+44%", volume: 2840, spark: [10, 14, 18, 26, 34, 42] }, { name: "Insufficient Funds",    change: "+28%", volume: 2110, spark: [8,  10, 12, 16, 22, 28] }, { name: "Gateway Timeout",       change: "+19%", volume: 1920, spark: [14, 16, 15, 18, 20, 22] }, { name: "Card Expired",          change: "+12%", volume: 1562, spark: [20, 21, 22, 24, 25, 26] }],
    "Order Not Created": [{ name: "OMS Timeout",           change: "+38%", volume: 1840, spark: [8,  12, 16, 22, 30, 36] }, { name: "Inventory Mismatch",    change: "+26%", volume: 1620, spark: [10, 12, 14, 18, 22, 26] }, { name: "Payment Hold",          change: "+18%", volume: 1100, spark: [16, 17, 18, 20, 21, 22] }, { name: "Duplicate Order",       change: "+11%", volume: 671,  spark: [14, 15, 15, 16, 17, 18] }],
    "Refund Delay":      [{ name: "Bank Processing Delay", change: "+52%", volume: 1640, spark: [6,  10, 16, 24, 34, 46] }, { name: "Manual Review",         change: "+34%", volume: 1280, spark: [8,  10, 14, 20, 28, 34] }, { name: "Partial Refund Error",  change: "+21%", volume: 820,  spark: [14, 15, 16, 18, 21, 22] }, { name: "Refund Not Initiated",  change: "+14%", volume: 380,  spark: [10, 11, 11, 12, 13, 14] }],
    "Card Declined":     [{ name: "Bank Decline",          change: "+36%", volume: 1520, spark: [10, 14, 18, 24, 32, 38] }, { name: "Wrong CVV",             change: "+24%", volume: 1140, spark: [12, 14, 15, 18, 22, 24] }, { name: "Velocity Limit",        change: "+18%", volume: 780,  spark: [8,  10, 12, 14, 16, 18] }, { name: "Expired Card",          change: "+11%", volume: 450,  spark: [16, 16, 17, 17, 18, 18] }],
    "OTP Not Received":  [{ name: "SMS Gateway Delay",     change: "+42%", volume: 920,  spark: [8,  12, 18, 26, 34, 42] }, { name: "Carrier Block",         change: "+28%", volume: 640,  spark: [10, 12, 14, 18, 24, 28] }, { name: "Expired OTP",           change: "+15%", volume: 380,  spark: [14, 15, 16, 17, 18, 19] }, { name: "Wrong Number",          change: "+8%",  volume: 160,  spark: [12, 12, 13, 13, 13, 14] }],
    "Delivery Tracking": [{ name: "Tracking Not Updating", change: "+38%", volume: 820,  spark: [8,  12, 16, 22, 30, 38] }, { name: "Delivery Exception",    change: "+24%", volume: 560,  spark: [10, 12, 14, 16, 20, 24] }, { name: "Wrong Address",         change: "+16%", volume: 280,  spark: [14, 14, 15, 16, 16, 17] }, { name: "Lost Package",          change: "+10%", volume: 140,  spark: [8,  8,  9,  9,  10, 10] }],
};

// ─── Per-L1-topic performing (sub-issues) ────────────────────────────────────
const L1_TOPIC_PERFORMING: Record<string, { name: string; resolutionRate: string; avgTime: string; csat: string }[]> = {
    "Payment Failed":    [{ name: "Card Expired",          resolutionRate: "96%", avgTime: "45s",    csat: "91%" }, { name: "Insufficient Funds",    resolutionRate: "88%", avgTime: "1m 20s", csat: "84%" }, { name: "Gateway Timeout",       resolutionRate: "74%", avgTime: "3m 10s", csat: "74%" }, { name: "3DS Auth Failure",      resolutionRate: "62%", avgTime: "5m 40s", csat: "66%" }],
    "Order Not Created": [{ name: "Duplicate Order",       resolutionRate: "98%", avgTime: "38s",    csat: "95%" }, { name: "Payment Hold",          resolutionRate: "92%", avgTime: "1m 10s", csat: "90%" }, { name: "Inventory Mismatch",    resolutionRate: "84%", avgTime: "2m 30s", csat: "82%" }, { name: "OMS Timeout",           resolutionRate: "68%", avgTime: "4m 20s", csat: "70%" }],
    "Refund Delay":      [{ name: "Refund Not Initiated",  resolutionRate: "90%", avgTime: "1m 5s",  csat: "85%" }, { name: "Partial Refund Error",  resolutionRate: "82%", avgTime: "2m 15s", csat: "78%" }, { name: "Manual Review",         resolutionRate: "64%", avgTime: "5m 40s", csat: "62%" }, { name: "Bank Processing Delay", resolutionRate: "44%", avgTime: "8m 20s", csat: "52%" }],
    "Card Declined":     [{ name: "Wrong CVV",             resolutionRate: "97%", avgTime: "40s",    csat: "93%" }, { name: "Expired Card",          resolutionRate: "95%", avgTime: "48s",    csat: "91%" }, { name: "Velocity Limit",        resolutionRate: "88%", avgTime: "1m 30s", csat: "86%" }, { name: "Bank Decline",          resolutionRate: "74%", avgTime: "3m 10s", csat: "74%" }],
    "OTP Not Received":  [{ name: "Wrong Number",          resolutionRate: "99%", avgTime: "30s",    csat: "97%" }, { name: "Expired OTP",           resolutionRate: "96%", avgTime: "42s",    csat: "94%" }, { name: "SMS Gateway Delay",     resolutionRate: "84%", avgTime: "1m 48s", csat: "86%" }, { name: "Carrier Block",         resolutionRate: "72%", avgTime: "2m 50s", csat: "78%" }],
    "Delivery Tracking": [{ name: "Wrong Address",         resolutionRate: "94%", avgTime: "52s",    csat: "90%" }, { name: "Tracking Not Updating", resolutionRate: "88%", avgTime: "1m 20s", csat: "86%" }, { name: "Delivery Exception",    resolutionRate: "80%", avgTime: "2m 40s", csat: "80%" }, { name: "Lost Package",          resolutionRate: "58%", avgTime: "6m 30s", csat: "64%" }],
};

// ─── Per-L1-topic sub-issue metrics ───────────────────────────────────────────
const L1_TOPIC_METRICS: Record<string, { name: string; resolution: string; repeatCall: string; dropOff: string }[]> = {
    "Payment Failed":    [{ name: "Card Expired",          resolution: "96%", repeatCall: "5%",  dropOff: "4%"  }, { name: "Insufficient Funds",    resolution: "88%", repeatCall: "14%", dropOff: "12%" }, { name: "Gateway Timeout",       resolution: "74%", repeatCall: "24%", dropOff: "28%" }, { name: "3DS Auth Failure",      resolution: "62%", repeatCall: "32%", dropOff: "38%" }],
    "Order Not Created": [{ name: "Duplicate Order",       resolution: "98%", repeatCall: "3%",  dropOff: "2%"  }, { name: "Payment Hold",          resolution: "92%", repeatCall: "9%",  dropOff: "8%"  }, { name: "Inventory Mismatch",    resolution: "84%", repeatCall: "18%", dropOff: "16%" }, { name: "OMS Timeout",           resolution: "68%", repeatCall: "28%", dropOff: "32%" }],
    "Refund Delay":      [{ name: "Refund Not Initiated",  resolution: "90%", repeatCall: "11%", dropOff: "10%" }, { name: "Partial Refund Error",  resolution: "82%", repeatCall: "19%", dropOff: "18%" }, { name: "Manual Review",         resolution: "64%", repeatCall: "34%", dropOff: "36%" }, { name: "Bank Processing Delay", resolution: "44%", repeatCall: "48%", dropOff: "56%" }],
    "Card Declined":     [{ name: "Wrong CVV",             resolution: "97%", repeatCall: "4%",  dropOff: "3%"  }, { name: "Expired Card",          resolution: "95%", repeatCall: "6%",  dropOff: "5%"  }, { name: "Velocity Limit",        resolution: "88%", repeatCall: "13%", dropOff: "12%" }, { name: "Bank Decline",          resolution: "74%", repeatCall: "24%", dropOff: "26%" }],
    "OTP Not Received":  [{ name: "Wrong Number",          resolution: "99%", repeatCall: "2%",  dropOff: "1%"  }, { name: "Expired OTP",           resolution: "96%", repeatCall: "5%",  dropOff: "4%"  }, { name: "SMS Gateway Delay",     resolution: "84%", repeatCall: "16%", dropOff: "16%" }, { name: "Carrier Block",         resolution: "72%", repeatCall: "26%", dropOff: "28%" }],
    "Delivery Tracking": [{ name: "Wrong Address",         resolution: "94%", repeatCall: "7%",  dropOff: "6%"  }, { name: "Tracking Not Updating", resolution: "88%", repeatCall: "13%", dropOff: "12%" }, { name: "Delivery Exception",    resolution: "80%", repeatCall: "21%", dropOff: "20%" }, { name: "Lost Package",          resolution: "58%", repeatCall: "38%", dropOff: "42%" }],
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function MonitoringPage() {
    const [dateRange, setDateRange]       = useState<DateRange>("7d");
    const [channel, setChannel]           = useState<Channel>("All");
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen]   = useState(false);

    const filterKey = `${dateRange}-${channel}`;
    const volMult   = VOL_MULT[dateRange] * CHAN_SPLIT[channel];

    const trendingData   = selectedTopic
        ? (L1_TOPIC_TRENDING[selectedTopic]   ?? TRENDING_BY_FILTER[filterKey]   ?? TRENDING_BY_FILTER["7d-All"])
        : (TRENDING_BY_FILTER[filterKey]      ?? TRENDING_BY_FILTER["7d-All"]);
    const performingData = selectedTopic
        ? (L1_TOPIC_PERFORMING[selectedTopic] ?? PERFORMING_BY_FILTER[filterKey] ?? PERFORMING_BY_FILTER["7d-All"])
        : (PERFORMING_BY_FILTER[filterKey]    ?? PERFORMING_BY_FILTER["7d-All"]);

    const l1Topics = useMemo(() => L1_TOPICS.map(t => ({
        ...t,
        volume: Math.round(t.baseVol * volMult),
    })), [volMult]);

    const topicMetrics = getTopicMetrics(dateRange, channel);


    return (
        <AdminLayout>
            <div className="space-y-6 pb-10">
                {/* Filter Row — date range left, channels right */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0 }}
                    className="flex flex-wrap items-center justify-between gap-2"
                >
                    <div className="flex gap-1.5">
                        {DATE_RANGES.map(d => (
                            <button
                                key={d}
                                onClick={() => { setDateRange(d); setSelectedTopic(null); }}
                                className={cn(
                                    "px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all",
                                    dateRange === d
                                        ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                        : "bg-zinc-900 text-zinc-500 border-white/5 hover:text-white hover:border-white/10"
                                )}
                            >
                                {DATE_LABELS[d]}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-1.5">
                        {CHANNELS.map(c => (
                            <button
                                key={c}
                                onClick={() => { setChannel(c); setSelectedTopic(null); }}
                                className={cn(
                                    "px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all",
                                    channel === c
                                        ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                        : "bg-zinc-900 text-zinc-500 border-white/5 hover:text-white hover:border-white/10"
                                )}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Row 1: Donut | Trending | Performing */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

                    {/* Topic Resolution Donut + L1 topic filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                        className="p-6 md:p-8 rounded-[32px] bg-zinc-950 border border-white/5 space-y-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/10">
                                <Activity className="w-4 h-4 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Topic Resolution</h3>
                                <p className="text-[10px] text-zinc-600 mt-0.5">Click segment to filter topics</p>
                            </div>
                        </div>

                        {/* L1 Topic Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(o => !o)}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all text-left",
                                    selectedTopic ? "border-blue-500/30 bg-blue-500/5" : "border-white/5 hover:border-white/10"
                                )}
                            >
                                <span className={cn("text-xs font-bold truncate", selectedTopic ? "text-blue-400" : "text-zinc-400")}>
                                    {selectedTopic ?? "All Topics"}
                                </span>
                                <ChevronDown className={cn("w-3.5 h-3.5 text-zinc-500 shrink-0 ml-2 transition-transform duration-200", dropdownOpen && "rotate-180")} />
                            </button>
                            {dropdownOpen && (
                                <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-2xl bg-zinc-900 border border-white/10 shadow-2xl overflow-hidden">
                                    <button
                                        onClick={() => { setSelectedTopic(null); setDropdownOpen(false); }}
                                        className={cn("w-full px-3 py-2.5 hover:bg-white/5 transition-colors text-left text-xs font-bold", !selectedTopic ? "text-white bg-white/5" : "text-zinc-400")}
                                    >
                                        All Topics
                                    </button>
                                    {l1Topics.map(t => (
                                        <button
                                            key={t.name}
                                            onClick={() => { setSelectedTopic(t.name); setDropdownOpen(false); }}
                                            className={cn("w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/5 transition-colors text-left border-t border-white/5 text-xs font-bold", selectedTopic === t.name ? "text-blue-400 bg-blue-500/5" : "text-zinc-400")}
                                        >
                                            <span>{t.name}</span>
                                            <span className="text-zinc-600 tabular-nums">{t.volume.toLocaleString()}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Top Topics table */}
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600 mb-3">Top Topics by selected category</p>
                            {/* Column headers */}
                            <div className="flex items-center px-2 pb-2 border-b border-white/5">
                                <span className="flex-1 text-[9px] uppercase tracking-[0.15em] font-black text-zinc-700"></span>
                                <span className="w-20 text-center text-[9px] uppercase tracking-[0.12em] font-black text-zinc-700">Resolution</span>
                                <span className="w-20 text-center text-[9px] uppercase tracking-[0.12em] font-black text-zinc-700">Repeat Call</span>
                                <span className="w-16 text-center text-[9px] uppercase tracking-[0.12em] font-black text-zinc-700">Drop off</span>
                            </div>
                            {/* Rows — sub-topics when a topic is selected, L1 topics otherwise */}
                            {selectedTopic
                                ? (L1_TOPIC_METRICS[selectedTopic] ?? []).map((sub) => (
                                    <div key={sub.name} className="flex items-center px-2 py-2.5 border-b border-white/[0.04]">
                                        <span className="flex-1 text-xs font-bold truncate text-zinc-300">{sub.name}</span>
                                        <span className="w-20 text-center text-xs font-black tabular-nums text-emerald-400">{sub.resolution}</span>
                                        <span className="w-20 text-center text-xs font-black tabular-nums text-amber-400">{sub.repeatCall}</span>
                                        <span className="w-16 text-center text-xs font-black tabular-nums text-red-400">{sub.dropOff}</span>
                                    </div>
                                ))
                                : l1Topics.map((t) => {
                                    const m = topicMetrics[t.name] ?? { resolution: "—", repeatCall: "—", dropOff: "—" };
                                    return (
                                        <div
                                            key={t.name}
                                            className="flex items-center px-2 py-2.5 border-b border-white/[0.04]"
                                        >
                                            <span className="flex-1 text-xs font-bold truncate text-zinc-300">{t.name}</span>
                                            <span className="w-20 text-center text-xs font-black tabular-nums text-emerald-400">{m.resolution}</span>
                                            <span className="w-20 text-center text-xs font-black tabular-nums text-amber-400">{m.repeatCall}</span>
                                            <span className="w-16 text-center text-xs font-black tabular-nums text-red-400">{m.dropOff}</span>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </motion.div>

                    {/* Top Trending Topics */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="p-6 md:p-8 rounded-[32px] bg-zinc-950 border border-white/5 space-y-5"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/10">
                                <TrendingUp className="w-4 h-4 text-amber-500" />
                            </div>
                            <h3 className="text-sm font-bold text-white">Top Trending Topics</h3>
                        </div>
                        <div className="space-y-3">
                            {trendingData.map((t, i) => {
                                const sparkData = t.spark.map((v) => ({ v }));
                                return (
                                    <motion.div
                                        key={`${filterKey}-${t.name}`}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.05 + i * 0.05 }}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 border border-white/5"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-white truncate">{t.name}</p>
                                            <p className="text-[10px] text-zinc-600 mt-0.5 tabular-nums">{t.volume.toLocaleString()} vol</p>
                                        </div>
                                        <div className="w-14 h-8 shrink-0">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={sparkData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                                                    <Line type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/10 px-2 py-1 rounded-lg shrink-0">
                                            {t.change}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Top Performing Topics */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                        className="p-6 md:p-8 rounded-[32px] bg-zinc-950 border border-white/5 space-y-5"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/10">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            </div>
                            <h3 className="text-sm font-bold text-white">Top Performing Topics</h3>
                        </div>
                        <div className="space-y-3">
                            {performingData.map((t, i) => (
                                <motion.div
                                    key={`${filterKey}-${t.name}`}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.05 + i * 0.05 }}
                                    className="p-3 rounded-xl bg-zinc-900/50 border border-white/5 space-y-2"
                                >
                                    <p className="text-xs font-bold text-white">{t.name}</p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/10 px-2 py-0.5 rounded-lg">
                                            {t.resolutionRate} resolved
                                        </span>
                                        <span className="text-[10px] font-bold text-zinc-500 bg-zinc-900 border border-white/5 px-2 py-0.5 rounded-lg">
                                            {t.avgTime}
                                        </span>
                                        <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/10 px-2 py-0.5 rounded-lg">
                                            {t.csat} CSAT
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

            </div>
        </AdminLayout>
    );
}
