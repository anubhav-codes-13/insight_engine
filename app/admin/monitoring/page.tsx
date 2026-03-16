"use client";

import { useState } from "react";
import AdminLayout from "@/components/dashboard/AdminLayout";
import {
    TRENDING_TOPICS, TOP_PERFORMING_TOPICS, TOPIC_RESOLUTION_DATA,
    AI_TOOLS, TOKEN_USAGE, MODEL_PERFORMANCE, AI_QUALITY, MONITORING_ALERTS,
    INSIGHTS_TOPICS,
} from "@/lib/mockData";
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import {
    TrendingUp, CheckCircle2, ShieldAlert, AlertTriangle, Info,
    Bot, Gauge, Activity, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function MonitoringPage() {
    const [selectedResolution, setSelectedResolution] = useState<string | null>(null);

    const filteredTopics = selectedResolution
        ? INSIGHTS_TOPICS.filter((t) => {
            if (selectedResolution === "Fully Resolved") return t.rank >= 8;
            if (selectedResolution === "Partial") return t.rank >= 4 && t.rank <= 7;
            return t.rank <= 3;
        })
        : [];

    return (
        <AdminLayout>
            <div className="space-y-6 pb-10">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600 mb-1">AI System</p>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Monitoring</h1>
                    <p className="text-sm text-zinc-500 mt-1">Real-time model health, topic resolution, and AI quality metrics</p>
                </motion.div>

                {/* Row 1: Donut | Trending | Performing */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                    {/* Topic Resolution Donut */}
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
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie
                                    data={TOPIC_RESOLUTION_DATA}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={78}
                                    paddingAngle={4}
                                    dataKey="value"
                                    onClick={(data) =>
                                        setSelectedResolution(
                                            selectedResolution === data.name ? null : data.name
                                        )
                                    }
                                    style={{ cursor: "pointer" }}
                                >
                                    {TOPIC_RESOLUTION_DATA.map((entry, i) => (
                                        <Cell
                                            key={i}
                                            fill={entry.color}
                                            opacity={selectedResolution === null || selectedResolution === entry.name ? 1 : 0.2}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "rgba(0,0,0,0.85)",
                                        backdropFilter: "blur(12px)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: "12px",
                                        fontSize: "12px",
                                        color: "#fff",
                                    }}
                                    formatter={(value) => [`${value}%`, ""]}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-2">
                            {TOPIC_RESOLUTION_DATA.map((d) => (
                                <button
                                    key={d.name}
                                    onClick={() => setSelectedResolution(selectedResolution === d.name ? null : d.name)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 rounded-xl border transition-all text-left",
                                        selectedResolution === d.name
                                            ? "border-white/20 bg-white/5"
                                            : "border-white/5 hover:border-white/10"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                                        <span className="text-xs font-medium text-zinc-300">{d.name}</span>
                                    </div>
                                    <span className="text-xs font-black text-white tabular-nums">{d.value}%</span>
                                </button>
                            ))}
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
                            {TRENDING_TOPICS.map((t, i) => {
                                const sparkData = t.spark.map((v) => ({ v }));
                                return (
                                    <motion.div
                                        key={t.name}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.15 + i * 0.05 }}
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
                            {TOP_PERFORMING_TOPICS.map((t, i) => (
                                <motion.div
                                    key={t.name}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + i * 0.05 }}
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

                {/* Filtered Topic Table (conditional) */}
                <AnimatePresence>
                    {selectedResolution && filteredTopics.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="rounded-[32px] bg-zinc-950 border border-white/5 overflow-hidden"
                        >
                            <div className="p-6 md:p-8 pb-4">
                                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600">
                                    Filtered — {selectedResolution}
                                </p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="px-6 pb-3 text-left text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600">#</th>
                                            <th className="px-6 pb-3 text-left text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600">Topic</th>
                                            <th className="px-6 pb-3 text-center text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600">Volume</th>
                                            <th className="px-6 pb-3 text-center text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600">Drop-off</th>
                                            <th className="px-6 pb-3 text-center text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600">Escalation</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.02]">
                                        {filteredTopics.map((t) => (
                                            <tr key={t.rank} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4 text-center"><span className="text-sm font-black text-zinc-600">#{t.rank}</span></td>
                                                <td className="px-6 py-4 font-bold text-white">{t.name}</td>
                                                <td className="px-6 py-4 text-center tabular-nums text-zinc-300">{t.volume.toLocaleString()}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/10">{t.dropOff}</span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/10">{t.escalation}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="h-6" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Row 2: Model Performance | AI Quality */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    {/* Model Performance Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="p-6 md:p-8 rounded-[32px] bg-zinc-950 border border-white/5 space-y-6"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/5">
                                <Zap className="w-4 h-4 text-zinc-400" />
                            </div>
                            <h3 className="text-sm font-bold text-white">Model Performance</h3>
                        </div>
                        <div className="flex gap-4 text-[10px]">
                            <span className="flex items-center gap-1.5 text-zinc-500"><span className="w-3 h-0.5 rounded bg-amber-500 inline-block" />Latency (ms)</span>
                            <span className="flex items-center gap-1.5 text-zinc-500"><span className="w-3 h-0.5 rounded bg-emerald-500 inline-block" />Accuracy (%)</span>
                        </div>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={MODEL_PERFORMANCE} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                                <CartesianGrid stroke="#18181b" strokeDasharray="3 3" />
                                <XAxis dataKey="time" tick={{ fill: "#52525b", fontSize: 10 }} />
                                <YAxis yAxisId="latency" domain={[0, 800]} tick={{ fill: "#52525b", fontSize: 10 }} width={36} />
                                <YAxis yAxisId="accuracy" orientation="right" domain={[85, 100]} tick={{ fill: "#52525b", fontSize: 10 }} width={36} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "rgba(0,0,0,0.85)",
                                        backdropFilter: "blur(12px)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: "12px",
                                        fontSize: "12px",
                                        color: "#fff",
                                    }}
                                />
                                <Line yAxisId="latency" type="monotone" dataKey="latency" stroke="#f59e0b" strokeWidth={2} dot={false} />
                                <Line yAxisId="accuracy" type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* AI Quality Metrics */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                        className="p-6 md:p-8 rounded-[32px] bg-zinc-950 border border-white/5 space-y-5"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/10">
                                <Activity className="w-4 h-4 text-purple-400" />
                            </div>
                            <h3 className="text-sm font-bold text-white">AI Quality Metrics</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <QualityMetric label="BLEU Score" value={String(AI_QUALITY.bleuScore)} pct={82} color="emerald" />
                            <QualityMetric label="Groundedness" value={AI_QUALITY.groundednessScore} pct={94.6} color="emerald" />
                        </div>
                        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center gap-3">
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[10px] uppercase tracking-[0.15em] font-black text-zinc-600">Hallucination Rate</span>
                                    <span className="text-sm font-black text-amber-400 tabular-nums">{AI_QUALITY.hallucinationRate}</span>
                                </div>
                                <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                                    <div className="h-full w-[14%] bg-amber-500 rounded-full" />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <QualityMetric label="Coherence" value={AI_QUALITY.coherenceScore} pct={96.2} color="blue" />
                            <QualityMetric label="Fluency" value={AI_QUALITY.fluencyScore} pct={97.8} color="blue" />
                        </div>
                    </motion.div>
                </div>

                {/* Row 3: Token Limits | Tools in Use */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    {/* Token Limits */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="p-6 md:p-8 rounded-[32px] bg-zinc-950 border border-white/5 space-y-5"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/5">
                                <Gauge className="w-4 h-4 text-zinc-400" />
                            </div>
                            <h3 className="text-sm font-bold text-white">Token Limits</h3>
                        </div>
                        <div className="space-y-5">
                            {TOKEN_USAGE.map((t, i) => (
                                <TokenBar key={t.model} {...t} delay={0.35 + i * 0.06} />
                            ))}
                        </div>
                    </motion.div>

                    {/* Tools in Use */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                        className="p-6 md:p-8 rounded-[32px] bg-zinc-950 border border-white/5 space-y-5"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/5">
                                <Bot className="w-4 h-4 text-zinc-400" />
                            </div>
                            <h3 className="text-sm font-bold text-white">Tools in Use</h3>
                        </div>
                        <div className="space-y-2">
                            {AI_TOOLS.map((t, i) => (
                                <ToolRow key={t.name} {...t} delay={0.4 + i * 0.05} />
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Row 4: Monitoring Alerts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="p-6 md:p-8 rounded-[32px] bg-zinc-950 border border-white/5 space-y-5"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/10">
                            <ShieldAlert className="w-4 h-4 text-red-500" />
                        </div>
                        <h3 className="text-sm font-bold text-white">System Alerts</h3>
                    </div>
                    <div className="space-y-3">
                        {MONITORING_ALERTS.map((a, i) => (
                            <AlertItem key={a.id} {...a} delay={0.45 + i * 0.05} />
                        ))}
                    </div>
                </motion.div>
            </div>
        </AdminLayout>
    );
}

function QualityMetric({ label, value, pct, color }: { label: string; value: string; pct: number; color: "emerald" | "blue" }) {
    const barColor = color === "emerald" ? "bg-emerald-500" : "bg-blue-500";
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.15em] font-black text-zinc-600">{label}</span>
                <span className="text-sm font-black text-white tabular-nums">{value}</span>
            </div>
            <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={cn("h-full rounded-full", barColor)}
                />
            </div>
        </div>
    );
}

function TokenBar({ model, used, limit, pct, delay }: { model: string; used: number; limit: number; pct: number; delay: number }) {
    const barColor = pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-emerald-500";
    const textColor = pct >= 90 ? "text-red-400" : pct >= 70 ? "text-amber-400" : "text-emerald-400";
    const fmt = (n: number) => n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : `${(n / 1_000).toFixed(0)}K`;
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{model}</span>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-600 tabular-nums">{fmt(used)} / {fmt(limit)}</span>
                    <span className={cn("text-[10px] font-black tabular-nums", textColor)}>{pct}%</span>
                </div>
            </div>
            <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ delay, duration: 0.9, ease: "easeOut" }}
                    className={cn("h-full rounded-full", barColor)}
                />
            </div>
        </div>
    );
}

function ToolRow({ name, type, status, version, delay }: { name: string; type: string; status: string; version: string; delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-colors"
        >
            <div className={cn("w-2 h-2 rounded-full shrink-0", status === "active" ? "bg-emerald-500 animate-pulse" : "bg-zinc-600")} />
            <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{name}</p>
            </div>
            <span className="text-[10px] font-bold text-zinc-500 bg-zinc-900 border border-white/5 px-2 py-0.5 rounded-lg shrink-0">{type}</span>
            <span className="text-[10px] font-mono text-zinc-600 shrink-0">{version}</span>
        </motion.div>
    );
}

function AlertItem({ severity, msg, system, time, delay }: { severity: string; msg: string; system: string; time: string; delay: number }) {
    const config = {
        critical: { icon: <ShieldAlert className="w-4 h-4" />, color: "text-red-500",   bg: "bg-red-500/10",   border: "border-red-500/10"   },
        warning:  { icon: <AlertTriangle className="w-4 h-4" />, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/10" },
        info:     { icon: <Info className="w-4 h-4" />,          color: "text-blue-500",  bg: "bg-blue-500/10",  border: "border-blue-500/10"  },
    }[severity] ?? { icon: <Info className="w-4 h-4" />, color: "text-zinc-500", bg: "bg-zinc-900", border: "border-white/5" };

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
            className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-colors"
        >
            <div className={cn("p-2 rounded-xl border shrink-0", config.bg, config.border, config.color)}>
                {config.icon}
            </div>
            <div className="flex-1 min-w-0 space-y-1">
                <p className="text-sm font-medium text-white leading-snug">{msg}</p>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.15em]">{system}</span>
                    <span className="text-[10px] text-zinc-700">·</span>
                    <span className="text-[10px] text-zinc-600">{time}</span>
                </div>
            </div>
        </motion.div>
    );
}
