"use client";

import AdminLayout from "@/components/dashboard/AdminLayout";
import { TOP_ISSUES, TREND_DATA, ANALYTICS_STATS } from "@/lib/mockData";
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowUpRight, ArrowDownRight, Activity, Users, Zap, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function AdminDashboard() {
    return (
        <AdminLayout>
            <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto pb-12">
                {/* Real-time Alert Banner */}
                <motion.div
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
                </motion.div>

                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <StatCard delay={0} label="Total Support Requests" value={ANALYTICS_STATS.totalRequests} trend="+12.5%" up icon={<Users className="w-4 h-4" />} />
                    <StatCard delay={0.1} label="Avg. Healing Time" value={ANALYTICS_STATS.avgHealingTime} trend="-0.4m" up={false} icon={<Clock className="w-4 h-4" />} />
                    <StatCard delay={0.2} label="CSAT Score" value={ANALYTICS_STATS.csatScore} trend="+2.1%" up icon={<Zap className="w-4 h-4" />} />
                    <StatCard delay={0.3} label="Drop-Off Rate" value={ANALYTICS_STATS.dropOffRate} trend="+0.3%" up={false} icon={<Activity className="w-4 h-4" />} />
                </div>

                {/* Charts & Top Issues */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Trend Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2 p-6 md:p-8 rounded-[32px] bg-zinc-950 border border-white/5 space-y-8"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-white">Resolution Trends</h3>
                                <p className="text-xs text-zinc-500">Volume of automated vs manual issues</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-500">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    AI Resolved
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                                    Escalated
                                </div>
                            </div>
                        </div>
                        <div className="h-64 md:h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={TREND_DATA}>
                                    <defs>
                                        <linearGradient id="colorIssue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", fontSize: "12px", color: "#fff" }}
                                        itemStyle={{ color: "#3b82f6" }}
                                    />
                                    <Area type="monotone" dataKey="issues" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorIssue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Top Issues List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="p-6 md:p-8 rounded-[32px] bg-zinc-950 border border-white/5 flex flex-col"
                    >
                        <h3 className="text-lg font-bold text-white mb-6">Issue Clusters</h3>
                        <div className="space-y-4 flex-1">
                            {TOP_ISSUES.slice(0, 6).map((issue, idx) => (
                                <div key={issue.name} className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/[0.03] transition-all group">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors capitalize">{issue.name}</p>
                                        <p className="text-[10px] text-zinc-500 font-medium">Auto-Healed in {issue.healingTime}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-white tabular-nums">{issue.count.toLocaleString()}</p>
                                        <div className="w-20 h-1 bg-zinc-900 rounded-full mt-1.5 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${(issue.count / TOP_ISSUES[0].count) * 100}%` }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.6 + idx * 0.1, duration: 1 }}
                                                className="h-full bg-blue-600 shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Efficiency Banner */}
                <motion.div
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
                </motion.div>
            </div>
        </AdminLayout>
    );
}

function StatCard({ label, value, trend, up, icon, delay }: { label: string, value: string, trend: string, up: boolean, icon: React.ReactNode, delay: number }) {
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

function MetricRing({ label, value, color, prefix = "" }: { label: string, value: number, color: string, prefix?: string }) {
    return (
        <div className="text-center group">
            <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-4 group-hover:text-white transition-colors">{label}</p>
            <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                    <circle cx="56" cy="56" r="50" fill="none" stroke="#18181b" strokeWidth="8" />
                    <motion.circle
                        initial={{ strokeDashoffset: 314 }}
                        whileInView={{ strokeDashoffset: 314 * (1 - value / 100) }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                        cx="56" cy="56" r="50" fill="none" stroke={color} strokeWidth="8"
                        strokeDasharray={314}
                        strokeLinecap="round"
                    />
                </svg>
                <span className="absolute text-xl font-black text-white">{prefix}{value}%</span>
            </div>
        </div>
    );
}
