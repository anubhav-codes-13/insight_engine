"use client";

import { useState } from "react";
import AdminLayout from "@/components/dashboard/AdminLayout";
import { CLUSTER_DATA, CHANNEL_TRENDS, CHANNEL_STATS, AI_INSIGHTS } from "@/lib/mockData";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
    ArrowUpRight, ArrowDownRight, Activity, Users, Zap, Clock,
    Sparkles, MessageSquare, Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type DateRange = "24h" | "7d" | "30d";
type Channel = "All" | "Chat" | "Call" | "Email";

const CLUSTER_META: Record<string, { change: string; up: boolean; spark: number[] }> = {
    "Payment Failed":    { change: "+19%", up: true,  spark: [38, 42, 40, 45, 50, 55, 58, 62] },
    "Order Not Created": { change: "-15%", up: false, spark: [60, 56, 52, 50, 46, 44, 42, 40] },
    "Refund Delay":      { change: "+11%", up: true,  spark: [30, 31, 33, 32, 35, 36, 38, 40] },
    "Card Declined":     { change: "+22%", up: true,  spark: [28, 30, 32, 36, 38, 42, 46, 50] },
    "OTP Not Received":  { change: "+12%", up: true,  spark: [20, 21, 22, 22, 23, 24, 25, 26] },
    "Delivery Tracking": { change: "+8%",  up: true,  spark: [18, 19, 19, 20, 20, 21, 22, 22] },
    "Checkout Error":    { change: "+42%", up: true,  spark: [12, 16, 20, 26, 32, 38, 44, 50] },
    "Login Problem":     { change: "-4%",  up: false, spark: [22, 22, 21, 21, 20, 20, 19, 19] },
    "App Crash":         { change: "+31%", up: true,  spark: [10, 12, 14, 16, 20, 24, 28, 32] },
    "Coupon Error":      { change: "+6%",  up: true,  spark: [14, 14, 15, 15, 15, 16, 16, 17] },
};

export default function AdminDashboard() {
    const [dateRange, setDateRange] = useState<DateRange>("7d");
    const [channel, setChannel] = useState<Channel>("All");
    const [followUpText, setFollowUpText] = useState("");

    const trendData = CHANNEL_TRENDS[dateRange][channel];
    const stats = CHANNEL_STATS[channel];
    const clusters = CLUSTER_DATA[dateRange][channel];
    const insight = AI_INSIGHTS[dateRange][channel];

    return (
        <AdminLayout>
            <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto pb-12">
                {/* Filter Row */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0 }}
                    className="flex flex-wrap items-center justify-between gap-3"
                >
                    {/* Date Range */}
                    <div className="flex gap-2">
                        {(["24h", "7d", "30d"] as DateRange[]).map((r) => (
                            <button
                                key={r}
                                onClick={() => setDateRange(r)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all",
                                    dateRange === r
                                        ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                        : "bg-zinc-900 text-zinc-500 border-white/5 hover:text-white hover:border-white/10"
                                )}
                            >
                                {r === "24h" ? "24 Hours" : r === "7d" ? "7 Days" : "30 Days"}
                            </button>
                        ))}
                    </div>
                    {/* Channel */}
                    <div className="flex gap-2">
                        {(["All", "Chat", "Call", "Email"] as Channel[]).map((c) => (
                            <button
                                key={c}
                                onClick={() => setChannel(c)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all",
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

                {/* Real-time Alert Banner */}
                {/* <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4"
                >
                    <div className="flex items-center gap-2 text-red-500 shrink-0">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Critical Alert</span>
                    </div>
                    <div className="flex-1 whitespace-nowrap overflow-hidden">
                        <p className="text-xs text-red-200 inline-block animate-marquee md:animate-none">
                            ⚠ Payment Failures Spiking — 300% increase detected in the last 20 minutes. Affecting Region: US-EAST-1.
                        </p>
                    </div>
                </motion.div> */}

                {/* AI Generated Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="p-6 md:p-8 rounded-[32px] bg-zinc-950 border border-blue-500/10 flex gap-4"
                >
                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/10 shrink-0 self-start">
                        <Sparkles className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600">AI Insight</p>
                        <p className="text-sm text-zinc-300 leading-relaxed font-medium">
                            {insight}
                        </p>
                    </div>
                </motion.div>

                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                    <StatCard delay={0.1}  label="Total Support Requests" value={stats.totalRequests}  trend="+12.5%" up           icon={<Users className="w-4 h-4" />} />
                    <StatCard delay={0.13} label="Resolution Rate"         value={stats.resolutionRate} trend="+4.2%"  up           icon={<Activity className="w-4 h-4" />} />
                    <StatCard delay={0.16} label="Avg. Healing Time"       value={stats.avgHealingTime} trend="-0.4m"  up={false}   icon={<Clock className="w-4 h-4" />} />
                    <StatCard delay={0.19} label="CSAT Score"              value={stats.csatScore}      trend="+2.1%"  up           icon={<Zap className="w-4 h-4" />} />
                    <StatCard delay={0.22} label="Drop-Off Rate"           value={stats.dropOffRate}    trend="+0.3%"  up={false}   icon={<Activity className="w-4 h-4" />} />
                </div>

                {/* Customer Call Trends + Issue Clusters */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Trend Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="lg:col-span-2 p-6 md:p-8 rounded-[32px] bg-zinc-950 border border-white/5 space-y-6"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h3 className="text-lg font-bold text-white">Customer Call Trends</h3>
                                <p className="text-xs text-zinc-500 mt-0.5">
                                    Showing: <span className="text-zinc-400 font-semibold">{channel}</span>
                                </p>
                            </div>
                            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
                                <span className="flex items-center gap-1.5 text-blue-500"><span className="w-4 h-0.5 rounded bg-blue-500 inline-block" />Resolution</span>
                                <span className="flex items-center gap-1.5 text-emerald-500"><span className="w-4 h-0.5 rounded bg-emerald-500 inline-block border-dashed" />Volume</span>
                                <span className="flex items-center gap-1.5 text-amber-500"><span className="w-4 h-0.5 rounded bg-amber-500 inline-block" />Escalation</span>
                            </div>
                        </div>
                        <div className="h-64 md:h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData} margin={{ top: 5, right: 48, bottom: 0, left: -10 }}>
                                    <CartesianGrid stroke="#18181b" strokeDasharray="3 3" />
                                    <XAxis dataKey="time" tick={{ fill: "#52525b", fontSize: 10 }} />
                                    {/* Left axis — Volume */}
                                    <YAxis
                                        yAxisId="vol"
                                        orientation="left"
                                        tick={{ fill: "#52525b", fontSize: 10 }}
                                        width={44}
                                        tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                                    />
                                    {/* Right axis — Percentage (0–100) */}
                                    <YAxis
                                        yAxisId="pct"
                                        orientation="right"
                                        domain={[0, 100]}
                                        tick={{ fill: "#52525b", fontSize: 10 }}
                                        width={36}
                                        tickFormatter={(v) => `${v}%`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "rgba(0,0,0,0.85)",
                                            backdropFilter: "blur(12px)",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            borderRadius: "16px",
                                            fontSize: "12px",
                                            color: "#fff",
                                        }}
                                        formatter={(value, name) => {
                                            if (value == null) return ["—", name as string];
                                            return name === "Volume"
                                                ? [Number(value).toLocaleString(), name as string]
                                                : [`${value}%`, name as string];
                                        }}
                                    />
                                    <Line yAxisId="pct" type="monotone" dataKey="resolution" stroke="#3b82f6" strokeWidth={2.5} dot={false} name="Resolution %" />
                                    <Line yAxisId="vol" type="monotone" dataKey="volume"     stroke="#10b981" strokeWidth={2}   dot={false} strokeDasharray="5 4" name="Volume" />
                                    <Line yAxisId="pct" type="monotone" dataKey="escalation" stroke="#f59e0b" strokeWidth={2}   dot={false} strokeDasharray="3 3" name="Escalation %" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Top Issues List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                        className="p-6 md:p-8 rounded-[32px] bg-zinc-950 border border-white/5 flex flex-col"
                    >
                        <h3 className="text-lg font-bold text-white mb-4">Issue Clusters</h3>
                        {/* Column Headers */}
                        <div className="flex items-center justify-between px-3.5 pb-2 border-b border-white/5 mb-1">
                            <span className="text-[10px] uppercase tracking-[0.15em] font-black text-zinc-600 flex-1">Topic</span>
                            <div className="flex items-center gap-3 shrink-0">
                                <span className="text-[10px] uppercase tracking-[0.15em] font-black text-zinc-600 w-12 text-right">Volume</span>
                                <span className="text-[10px] uppercase tracking-[0.15em] font-black text-zinc-600 w-12 text-right">Change</span>
                                <span className="text-[10px] uppercase tracking-[0.15em] font-black text-zinc-600 w-16 text-center">Trend</span>
                            </div>
                        </div>
                        <div className="space-y-1 flex-1">
                            {clusters.map((issue) => {
                                const meta = CLUSTER_META[issue.name] ?? { change: "+0%", up: true, spark: [10, 10, 10, 10, 10, 10, 10, 10] };
                                const sparkData = meta.spark.map((v) => ({ v }));
                                return (
                                    <div key={issue.name} className="flex items-center justify-between px-3.5 py-3 rounded-2xl hover:bg-white/[0.03] transition-all group">
                                        <div className="space-y-0.5 flex-1 min-w-0">
                                            <p className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors truncate">{issue.name}</p>
                                            <p className="text-[10px] text-zinc-600 font-medium">Auto-Healed in {issue.healingTime}</p>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <p className="text-sm font-black text-emerald-400 tabular-nums">{issue.count.toLocaleString()}</p>
                                            <span className={`text-[11px] font-bold tabular-nums w-12 text-right ${meta.up ? "text-emerald-400" : "text-zinc-500"}`}>
                                                {meta.change}
                                            </span>
                                            <div className="w-16 h-8 shrink-0">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={sparkData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                                                        <Line
                                                            type="monotone"
                                                            dataKey="v"
                                                            stroke={meta.up ? "#34d399" : "#71717a"}
                                                            strokeWidth={1.5}
                                                            dot={false}
                                                            isAnimationActive={false}
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>


                {/* Efficiency Banner */}
                {/* <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-8 md:p-12 rounded-[40px] bg-gradient-to-br from-blue-600/10 via-zinc-950 to-purple-600/10 border border-white/5 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none group-hover:bg-blue-600/20 transition-all duration-700" />
                    <div className="grid md:grid-cols-2 gap-12 items-center relative z-10 text-center md:text-left">
                        <div className="space-y-6">
                            <h3 className="text-3xl font-bold text-white leading-tight underline decoration-blue-500/30 decoration-4 underline-offset-8">Cost Optimization Result</h3>
                            <p className="text-zinc-400 leading-relaxed font-medium">
                                Our AI Agent fleet has successfully automated 78.4% of all support volume, leading to a <span className="text-white font-bold">$421,200</span> monthly operational saving.
                            </p>
                            <button className="px-8 py-3.5 rounded-full bg-white text-black text-sm font-black hover:bg-zinc-200 transition-all shadow-xl active:scale-95">
                                Full Efficiency Audit
                            </button>
                        </div>
                        <div className="flex justify-center md:justify-end gap-12">
                            <MetricRing label="Automation" value={78} color="#3b82f6" />
                            <MetricRing label="CSAT Delta" value={14} color="#10b981" prefix="+" />
                        </div>
                    </div>
                </motion.div> */}

                {/* Follow-up Input */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-2 rounded-[28px] bg-zinc-950 border border-white/5 flex items-center gap-3 hover:border-white/10 transition-all focus-within:border-blue-500/30"
                >
                    <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/5 ml-3 shrink-0">
                        <MessageSquare className="w-4 h-4 text-zinc-500" />
                    </div>
                    <input
                        type="text"
                        value={followUpText}
                        onChange={(e) => setFollowUpText(e.target.value)}
                        placeholder="Ask a follow-up question about your support data..."
                        className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none py-3"
                    />
                    <button
                        disabled={!followUpText.trim()}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-[20px] bg-blue-500 text-white text-xs font-bold hover:bg-blue-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed mr-2 shrink-0"
                    >
                        <Send className="w-3.5 h-3.5" />
                        Ask
                    </button>
                </motion.div>
            </div>
        </AdminLayout>
    );
}

function StatCard({ label, value, trend, up, icon, delay }: { label: string; value: string; trend: string; up: boolean; icon: React.ReactNode; delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="p-6 rounded-[28px] bg-zinc-950 border border-white/5 space-y-4 hover:border-white/10 transition-all group shadow-sm hover:shadow-2xl hover:shadow-black/20"
        >
            <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-300">
                    {icon}
                </div>
                <div className={cn("flex items-center gap-1 text-[10px] font-black tracking-widest", up ? "text-emerald-500" : "text-red-500")}>
                    {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trend}
                </div>
            </div>
            <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600 mb-1">{label}</p>
                <p className="text-3xl font-bold text-white tracking-tighter">{value}</p>
            </div>
        </motion.div>
    );
}

