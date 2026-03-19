"use client";

import Link from "next/link";
import { ArrowRight, Bot, BarChart3, ShieldCheck, Zap, Headphones, DollarSign, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Hero Section */}
      <header className="relative w-full py-16 md:py-24 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container relative mx-auto px-6 flex flex-col items-center text-center"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-sm mb-8">
            <Bot className="w-4 h-4 text-blue-400" />
            <span className="text-zinc-400">Next-Gen AI Support Experience</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-4xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent leading-tight md:leading-[1.1]">
            AI-Powered Enterprise <br /> Customer Support
          </motion.h1>

          <motion.p variants={itemVariants} className="max-w-xl text-lg md:text-xl text-zinc-400 mb-12">
            Reduce support costs by up to 80% using intelligent AI agents that resolve issues in seconds, not hours.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/customer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-all group shadow-xl shadow-white/10"
            >
              Try Customer Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-zinc-900 border border-white/10 text-white font-semibold hover:bg-zinc-800 transition-all shadow-xl"
            >
              View Admin Dashboard
            </Link>
          </motion.div>
        </motion.div>
      </header>

      {/* Impact Stats */}
      <section className="py-24 border-b border-white/10 bg-white/5 overflow-hidden">
        <div className="container mx-auto px-6 text-center lg:text-left">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">The Cost of Scale</h2>
              <p className="text-zinc-400 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium">
                Enterprises receive 30k+ support calls per month. At $18 per call, traditional human support models are reaching operational breaking points.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl border border-white/10 bg-black">
                  <span className="block text-zinc-500 text-[10px] mb-1 uppercase tracking-widest font-bold">Monthly Cost</span>
                  <span className="text-3xl font-bold text-red-500">$540,000</span>
                </div>
                <div className="p-6 rounded-3xl border border-white/10 bg-zinc-900 shadow-inner">
                  <span className="block text-zinc-500 text-[10px] mb-1 uppercase tracking-widest font-bold">Cost Per Call</span>
                  <span className="text-3xl font-bold text-white">$18</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative p-1 rounded-[32px] bg-gradient-to-tr from-white/20 via-zinc-500/20 to-transparent"
            >
              <div className="bg-black rounded-[28px] p-8 lg:p-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-500">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">AI Support Cost</h3>
                    <p className="text-zinc-500 text-xs italic">Simulated Resolution Path</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="h-2.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "80%" }}
                      transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                      className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <span className="block text-xs text-zinc-500 font-bold uppercase tracking-wider">AI Resolved</span>
                      <span className="text-2xl font-bold text-white">80% Efficiency</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-xs text-zinc-500 font-bold uppercase tracking-wider">Monthly Saving</span>
                      <span className="text-2xl font-bold text-emerald-400">-$432k</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Enterprise Capabilities</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto font-medium">Beyond simple automation—Resolve AI provides deep insights into your customer behavior.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              delay={0}
              icon={<ShieldCheck className="w-6 h-6 text-blue-500" />}
              title="Smart Issue Detection"
              description="Automatically detects payment gateway failures and bank-side rejections before they become support tickets."
            />
            <FeatureCard
              delay={0.1}
              icon={<Zap className="w-6 h-6 text-amber-500" />}
              title="Real-Time Healing"
              description="Most common issues like payment sync or order delays are resolved automatically by AI agents within 2 minutes."
            />
            <FeatureCard
              delay={0.2}
              icon={<BarChart3 className="w-6 h-6 text-purple-500" />}
              title="Intelligent Insights"
              description="Clustered issue analysis and trend detection to identify systemic problems in real-time."
            />
            <FeatureCard
              delay={0.3}
              icon={<Headphones className="w-6 h-6 text-rose-500" />}
              title="Voice Support"
              description="Integrated Sonic & Ink engines for seamless voice-to-text and text-to-speech support interactions."
            />
            <FeatureCard
              delay={0.4}
              icon={<DollarSign className="w-6 h-6 text-emerald-500" />}
              title="Operations Monitoring"
              description="Track CSAT, Average Healing Time, and Drop-off rates with our premium enterprise dashboard."
            />
            <FeatureCard
              delay={0.5}
              icon={<Activity className="w-6 h-6 text-cyan-500" />}
              title="Agentic Reasoning"
              description="Powered by LangGraph multi-agent orchestration for complex multi-step problem solving."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 border-t border-white/5 bg-black">
        <div className="container mx-auto px-6 text-center lg:text-left lg:flex lg:justify-between lg:items-center">
          <p className="text-zinc-500 text-sm mb-4 lg:mb-0">
            &copy; 2026 Resolve AI. Built for modern enterprise efficiency.
          </p>
          <div className="flex justify-center lg:justify-end gap-8 text-xs font-bold uppercase tracking-widest text-zinc-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="p-8 rounded-[32px] border border-white/5 bg-zinc-900/40 hover:bg-zinc-900/60 hover:border-white/10 transition-all group flex flex-col"
    >
      <div className="mb-6 p-4 rounded-2xl bg-black border border-white/10 w-fit group-hover:scale-110 group-hover:bg-zinc-900 transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-4 text-white">{title}</h3>
      <p className="text-zinc-400 leading-relaxed text-sm font-medium">
        {description}
      </p>
    </motion.div>
  );
}
