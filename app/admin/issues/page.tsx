"use client";

import { useState } from "react";
import AdminLayout from "@/components/dashboard/AdminLayout";
import { TOP_ISSUES } from "@/lib/mockData";
import { BadgeCheck, OctagonAlert, Timer, TrendingUp, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function IssueInsights() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<"All" | "Automated" | "Escalated">("All");

    const filteredIssues = TOP_ISSUES.filter(issue => {
        const matchesSearch = issue.name.toLowerCase().includes(searchQuery.toLowerCase());
        const isAutomated = issue.healingTime !== "Unknown";

        if (filter === "Automated") return matchesSearch && isAutomated;
        if (filter === "Escalated") return matchesSearch && !isAutomated;
        return matchesSearch;
    });

    return (
        <AdminLayout>
            <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto pb-12">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold text-white">Issue Insights</h1>
                        <p className="text-sm text-zinc-500 font-medium">Automated clustering of global support conversations.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 sm:flex-none sm:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search issues..."
                                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all border-none text-white placeholder:text-zinc-600"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value as any)}
                                className="appearance-none bg-zinc-900 border border-white/5 text-white text-xs font-bold uppercase tracking-widest rounded-2xl pl-11 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer hover:bg-zinc-800 transition-colors"
                            >
                                <option value="All">All Issues</option>
                                <option value="Automated">Automated</option>
                                <option value="Escalated">Escalated</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Issue Table Container */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-white/5 bg-zinc-950 rounded-[40px] overflow-hidden shadow-2xl"
                >
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="px-8 py-7 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600">Issue Cluster</th>
                                    <th className="px-6 py-7 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600 text-center">Volume</th>
                                    <th className="px-6 py-7 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600 text-center">Avg Healing</th>
                                    <th className="px-6 py-7 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600">Status</th>
                                    <th className="px-8 py-7 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600 text-right">Trend</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.02]">
                                <AnimatePresence>
                                    {filteredIssues.map((issue, idx) => (
                                        <motion.tr
                                            key={issue.name}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                                        >
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-5">
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-[18px] flex items-center justify-center border border-white/5 transition-transform group-hover:scale-110 shadow-lg",
                                                        issue.count > 4000 ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"
                                                    )}>
                                                        <OctagonAlert className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-zinc-200 group-hover:text-white transition-colors">{issue.name}</p>
                                                        <p className="text-[10px] text-zinc-500 font-bold tracking-widest mt-0.5">SLM-CLASSIFIED</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className="text-sm font-black text-white tabular-nums">{issue.count.toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center justify-center gap-2.5 text-zinc-400">
                                                    <Timer className="w-4 h-4 text-zinc-700" />
                                                    <span className="text-sm font-medium">{issue.healingTime}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className={cn(
                                                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest",
                                                    issue.healingTime !== "Unknown"
                                                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/10"
                                                        : "bg-amber-500/10 text-amber-500 border border-amber-500/10"
                                                )}>
                                                    {issue.healingTime !== "Unknown" ? <BadgeCheck className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                                                    {issue.healingTime !== "Unknown" ? "Automated" : "Escalated"}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-1.5 text-emerald-500 font-black text-xs">
                                                    <TrendingUp className="w-3.5 h-3.5" />
                                                    +{(Math.random() * 5).toFixed(1)}%
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                    {filteredIssues.length === 0 && (
                                        <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                            <td colSpan={5} className="px-8 py-16 text-center text-zinc-500 font-medium">
                                                No issues found matching your filters.
                                            </td>
                                        </motion.tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Insight Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                    <InsightCard
                        title="Gateway Anomaly"
                        content="A 12% increase in HDFC bank declines was detected in the last hour. AI Agents are currently routing traffic to backup nodes."
                        severity="warning"
                        delay={0.1}
                    />
                    <InsightCard
                        title="Scaling Success"
                        content="Automation throughput increased by 40% following the SLM-v4.0 deployment. CSAT remains stable at 92.4%."
                        severity="success"
                        delay={0.2}
                    />
                    <InsightCard
                        title="Friction Point"
                        content="Higher drop-off detected on 'Refund Delay' issues. AI escalation prompt requires manual refinement."
                        severity="info"
                        delay={0.3}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}

function InsightCard({ title, content, severity, delay }: { title: string, content: string, severity: "success" | "warning" | "info", delay: number }) {
    const styles = {
        success: "text-emerald-500 bg-emerald-500/10 border-emerald-500/10",
        warning: "text-amber-500 bg-amber-500/10 border-amber-500/10",
        info: "text-blue-500 bg-blue-500/10 border-blue-500/10",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className="p-8 rounded-[32px] bg-zinc-950 border border-white/5 space-y-4 hover:border-white/20 transition-all group"
        >
            <div className={cn("inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest", styles[severity])}>
                {severity}
            </div>
            <h4 className="font-bold text-white text-lg tracking-tight group-hover:text-blue-500 transition-colors">{title}</h4>
            <p className="text-sm text-zinc-500 leading-relaxed font-semibold">
                {content}
            </p>
        </motion.div>
    );
}
