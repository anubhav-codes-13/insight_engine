"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Mic, ShieldCheck, Zap, CheckCircle2, AlertCircle, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
    id: string;
    role: "user" | "ai";
    content: string;
    status?: "resolving" | "resolved" | "escalated";
};

const SUGGESTED_ISSUES = [
    "Payment failed but money deducted",
    "Order tracking hasn't updated",
    "I want to request a refund",
    "Login issues with my account",
];

export default function CustomerInterface() {
    const [messages, setMessages] = useState<Message[]>([
        { id: "1", role: "ai", content: "Hello! I'm Resolve AI. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = (text: string) => {
        if (!text.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: getSimulatedResponse(text),
                status: text.toLowerCase().includes("refund") ? "escalated" : "resolved"
            };
            setMessages(prev => [...prev, aiMsg]);
        }, 2000);
    };

    return (
        <div className="flex flex-col h-screen bg-black text-white font-sans selection:bg-blue-500/30">
            {/* Header */}
            <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-white/10 bg-black/80 backdrop-blur-xl z-20">
                <div className="flex items-center gap-3">
                    <Link href="/" className="lg:hidden p-1 hover:bg-white/10 rounded-lg transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-sm tracking-tight leading-none">Resolve AI</p>
                            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1 animate-pulse">Online</p>
                        </div>
                    </div>
                </div>
                <Link href="/" className="hidden lg:block text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/5">
                    Exit Demo
                </Link>
            </header>

            <main className="flex-1 flex overflow-hidden relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(59,130,246,0.05),_transparent)] pointer-events-none" />

                {/* Chat Area */}
                <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full border-x border-white/5 relative z-10">
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-hide">
                        <AnimatePresence initial={false}>
                            {messages.map((m) => (
                                <motion.div
                                    key={m.id}
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={cn("flex gap-3 md:gap-4", m.role === "user" ? "flex-row-reverse" : "flex-row")}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xl",
                                        m.role === "user" ? "bg-zinc-800 border border-white/10" : "bg-blue-600 shadow-blue-500/10"
                                    )}>
                                        {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>
                                    <div className={cn("space-y-2 max-w-[85%] md:max-w-[75%]", m.role === "user" ? "items-end" : "items-start")}>
                                        <div className={cn(
                                            "p-4 rounded-2xl md:rounded-3xl text-sm leading-relaxed font-medium shadow-2xl",
                                            m.role === "user" ? "bg-white text-black" : "bg-zinc-900 border border-white/10 text-zinc-200"
                                        )}>
                                            {m.content}
                                        </div>
                                        {m.status && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className={cn(
                                                    "flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-lg w-fit",
                                                    m.status === "resolved" ? "text-emerald-500 bg-emerald-500/10" : "text-amber-500 bg-amber-500/10"
                                                )}>
                                                {m.status === "resolved" ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                                {m.status.replace("_", " ")}
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex gap-4"
                            >
                                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center animate-pulse">
                                    <Bot className="w-4 h-4" />
                                </div>
                                <div className="px-6 py-4 rounded-3xl bg-zinc-900 border border-white/10 flex gap-1.5 items-center shadow-xl">
                                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <div className="p-4 md:p-8 border-t border-white/10 bg-black/40 backdrop-blur-md">
                        <div className="max-w-3xl mx-auto space-y-6">
                            <div className="flex flex-wrap gap-2">
                                {SUGGESTED_ISSUES.map((issue) => (
                                    <button
                                        key={issue}
                                        onClick={() => handleSend(issue)}
                                        className="text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-full border border-white/5 bg-zinc-900 shadow-lg text-zinc-500 hover:text-white hover:border-white/20 transition-all active:scale-95"
                                    >
                                        {issue}
                                    </button>
                                ))}
                            </div>
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                                    placeholder="Type your message..."
                                    className="w-full bg-zinc-900 border border-white/5 rounded-[24px] px-8 py-5 pr-16 focus:outline-none focus:border-blue-500/50 shadow-2xl transition-all text-sm font-medium focus:ring-4 focus:ring-blue-500/10 placeholder:text-zinc-600"
                                />
                                <button
                                    onClick={() => handleSend(input)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-blue-600 rounded-[18px] hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-95 group-focus-within:bg-blue-500"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Sidebar */}
                <aside className="hidden xl:flex w-96 flex-col bg-zinc-950 p-12 border-l border-white/5 space-y-12 relative z-20">
                    <div className="space-y-8">
                        <div className="text-center space-y-2">
                            <h3 className="font-bold text-xl tracking-tight">Voice Interface</h3>
                            <p className="text-xs text-zinc-500 font-medium">Sonic-Inference Engine Active</p>
                        </div>

                        <div className="flex flex-col items-center gap-8">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative w-40 h-40 rounded-full border border-white/10 bg-zinc-900 flex items-center justify-center group shadow-[0_0_50px_rgba(59,130,246,0.1)] overflow-hidden"
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="absolute inset-0 bg-blue-600 rounded-full"
                                />
                                <Mic className="w-16 h-16 text-blue-500 z-10" />
                            </motion.button>

                            <div className="flex gap-1.5 h-6">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [8, 24, 8] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                                        className="w-1 bg-blue-500/40 rounded-full"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] px-2">Core Infrastructure</h4>
                        <div className="grid gap-3">
                            <StatusCard icon={<ShieldCheck className="w-4 h-4" />} title="Secure Node" text="E2E Encrypted Path" />
                            <StatusCard icon={<Zap className="w-4 h-4" />} title="Latency" text="115ms Inference" color="blue" />
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}

function StatusCard({ icon, title, text, color = "emerald" }: { icon: React.ReactNode, title: string, text: string, color?: "emerald" | "blue" }) {
    return (
        <div className="p-5 rounded-[24px] bg-zinc-900 border border-white/5 flex gap-4 items-center">
            <div className={cn(
                "p-3 rounded-xl",
                color === "emerald" ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
            )}>
                {icon}
            </div>
            <div>
                <p className="font-bold text-xs text-white tracking-tight">{title}</p>
                <p className="text-[10px] text-zinc-500 font-medium">{text}</p>
            </div>
        </div>
    );
}

function getSimulatedResponse(input: string): string {
    const low = input.toLowerCase();
    if (low.includes("payment")) {
        return "I see that your payment was successful but the order confirmation is delayed. This usually happens due to temporary network synchronization between the bank and our gateway. I've automatically verified the transaction and your order will appear in your dashboard within 2 minutes.";
    }
    if (low.includes("tracking") || low.includes("order")) {
        return "Searching for your latest order... I've found it! Your package is currently at the local distribution center and is scheduled for delivery today by 6:00 PM.";
    }
    if (low.includes("refund")) {
        return "I understand you'd like a refund. While I can handle technical issues, my policy requires a human representative to authorize financial reversals. I am escalating your ticket to our senior billing team. They will contact you within 24 hours.";
    }
    if (low.includes("login")) {
        return "I've detected a high number of failed login attempts on your account. For your security, I have temporarily locked the account. Please check your registered email for a verification link to regain access instantly.";
    }
    return "I'm not sure I understand that specific issue. Could you tell me more about it? Or you can choose from the suggested issues below.";
}
