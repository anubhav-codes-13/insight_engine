"use client";

import AdminLayout from "@/components/dashboard/AdminLayout";
import { ANALYTICS_STATS } from "@/lib/mockData";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { TrendingUp, Users, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const PIE_DATA = [
    { name: "AI Resolved", value: 78, color: "#3b82f6" },
    { name: "Human Escalated", value: 22, color: "#27272a" },
];

const PERFORMANCE_DATA = [
    { subject: "Resolution Speed", A: 120, fullMark: 150 },
    { subject: "CSAT Accuracy", A: 98, fullMark: 150 },
    { subject: "Automation", A: 86, fullMark: 150 },
    { subject: "Latency", A: 99, fullMark: 150 },
    { subject: "Scalability", A: 130, fullMark: 150 },
];

export default function AnalyticsPage() {
    return (
        <AdminLayout>
            <div className="space-y-8 max-w-7xl mx-auto pb-20">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-white">Advanced Analytics</h1>
                    <p className="text-sm text-zinc-500 font-medium">Deep dive into AI support performance and efficiency metrics.</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Automation Resolution Share */}
                    <div className="p-8 rounded-[32px] bg-zinc-950 border border-white/5 space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">Resolution Distribution</h3>
                            <Target className="w-5 h-5 text-zinc-600" />
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={PIE_DATA}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {PIE_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#000", border: "1px solid #333", borderRadius: "12px", fontSize: "12px" }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-xs text-center text-zinc-500 max-w-xs mx-auto">
                            AI Agents are currently handling <span className="text-white font-bold">78%</span> of all support traffic with zero human intervention.
                        </p>
                    </div>

                    {/* Performance Radar */}
                    <div className="p-8 rounded-[32px] bg-zinc-950 border border-white/5 space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">System Efficiency Radar</h3>
                            <Zap className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="h-64 w-full flex justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={PERFORMANCE_DATA}>
                                    <PolarGrid stroke="#333" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#666", fontSize: 10 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                    <Radar
                                        name="Performance"
                                        dataKey="A"
                                        stroke="#3b82f6"
                                        fill="#3b82f6"
                                        fillOpacity={0.6}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Latency</p>
                                <p className="text-sm font-bold text-emerald-500">OPTIMAL</p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Accuracy</p>
                                <p className="text-sm font-bold text-white">98.4%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Efficiency Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
                    <EfficiencyStat
                        label="Human Hours Saved"
                        value="14,230"
                        description="Equivalent to 88 full-time agents this month."
                        icon={<TrendingUp className="w-4 h-4 text-emerald-500" />}
                    />
                    <EfficiencyStat
                        label="Model Precision"
                        value="99.2%"
                        description="Issue classification accuracy across all categories."
                        icon={<Users className="w-4 h-4 text-blue-500" />}
                    />
                    <EfficiencyStat
                        label="Avg. CPU Utilization"
                        value="34%"
                        description="Edge inference cost efficiency monitoring."
                        icon={<Zap className="w-4 h-4 text-amber-500" />}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}

function EfficiencyStat({ label, value, description, icon }: { label: string, value: string, description: string, icon: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                {icon}
                <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-widest">{label}</h4>
            </div>
            <p className="text-4xl font-bold text-white tracking-tight">{value}</p>
            <p className="text-xs text-zinc-500 leading-relaxed">{description}</p>
        </div>
    );
}
