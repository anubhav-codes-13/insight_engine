"use client";

import AdminLayout from "@/components/dashboard/AdminLayout";
import { Bell, ShieldAlert, BadgeInfo, AlertTriangle, CircleDashed, Terminal, History } from "lucide-react";
import { ShieldAlert as Shield, Info, AlertTriangle as Warning, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const ALERTS = [
    { id: "1", type: "critical", msg: "Payment Failures Spiking (300% increase)", time: "2m ago", system: "API-GATEWAY-01" },
    { id: "2", type: "warning", msg: "Login Latency above 500ms", time: "15m ago", system: "AUTH-SERVICE" },
    { id: "3", type: "info", msg: "SLM Model v2.1 successfully deployed to US-EAST", time: "1h ago", system: "MODEL-ORCHESTRATOR" },
    { id: "4", type: "info", msg: "Daily report generated and emailed to stakeholders", time: "4h ago", system: "REPORTING-ENGINE" },
    { id: "5", type: "warning", msg: "Database connection pool at 85% capacity", time: "6h ago", system: "DB-CLUSTER-MAIN" },
];

export default function AlertsPage() {
    return (
        <AdminLayout>
            <div className="space-y-8 max-w-7xl mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">System Alerts</h1>
                        <p className="text-sm text-zinc-500 font-medium">Real-time monitoring and incident reporting.</p>
                    </div>
                    <button className="px-4 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-zinc-200 transition-colors">
                        Clear All Alerts
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {ALERTS.map((alert) => (
                            <div key={alert.id} className="p-6 rounded-[24px] bg-zinc-950 border border-white/5 flex items-start gap-6 group hover:border-white/10 transition-all">
                                <div className={cn(
                                    "p-3 rounded-2xl shrink-0 shadow-lg",
                                    alert.type === "critical" ? "bg-red-500/10 text-red-500 shadow-red-500/5" :
                                        alert.type === "warning" ? "bg-amber-500/10 text-amber-500 shadow-amber-500/5" :
                                            "bg-blue-500/10 text-blue-500 shadow-blue-500/5"
                                )}>
                                    {alert.type === "critical" ? <Shield className="w-5 h-5" /> :
                                        alert.type === "warning" ? <Warning className="w-5 h-5" /> :
                                            <Info className="w-5 h-5" />}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-bold text-white">{alert.msg}</p>
                                        <span className="text-[10px] font-mono text-zinc-600">{alert.time}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                                            <Terminal className="w-3 h-3" />
                                            {alert.system}
                                        </div>
                                        <div className="h-1 w-1 rounded-full bg-zinc-700" />
                                        <button className="text-[10px] text-blue-500 font-bold hover:underline">View Logs</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-8">
                        <div className="p-8 rounded-[32px] bg-zinc-950 border border-white/5 space-y-6">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <Activity className="w-4 h-4 text-emerald-500" />
                                Live Feed
                            </h3>
                            <div className="space-y-6">
                                <FeedItem status="resolved" msg="Payment Error resolved automatically" time="1m ago" />
                                <FeedItem status="escalated" msg="Refund request escalated to human" time="4m ago" />
                                <FeedItem status="resolved" msg="Login lock cleared via AI verification" time="12m ago" />
                                <FeedItem status="pending" msg="AI analyzing checkout timeout cluster" time="now" />
                            </div>
                        </div>

                        <div className="p-8 rounded-[32px] bg-gradient-to-tr from-zinc-900 to-black border border-white/5">
                            <h3 className="font-bold text-white mb-4">Integrations</h3>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-pointer">
                                    <span className="text-xs font-bold">SL</span>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-pointer">
                                    <span className="text-xs font-bold">PR</span>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-pointer">
                                    <span className="text-xs font-bold">TS</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function FeedItem({ status, msg, time }: { status: "resolved" | "escalated" | "pending", msg: string, time: string }) {
    return (
        <div className="flex gap-4 relative">
            <div className="absolute left-[11px] top-6 bottom-[-24px] w-[2px] bg-zinc-900/50 last:hidden" />
            <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center shrink-0 border border-black z-10",
                status === "resolved" ? "bg-emerald-500 shadow-lg shadow-emerald-500/20" :
                    status === "escalated" ? "bg-amber-500 shadow-lg shadow-amber-500/20" :
                        "bg-zinc-800 animate-pulse"
            )}>
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            <div>
                <p className="text-xs font-bold text-zinc-300">{msg}</p>
                <p className="text-[10px] text-zinc-600">{time}</p>
            </div>
        </div>
    );
}
