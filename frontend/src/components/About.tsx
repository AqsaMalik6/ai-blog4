'use client';

import { motion } from 'framer-motion';
import {
    Users,
    RefreshCcw,
    TrendingUp,
    MessageSquare,
    XCircle,
    CheckCircle2,
    Sparkles,
    Zap,
    Bot
} from 'lucide-react';

export default function About() {
    const features = [
        { icon: TrendingUp, label: 'Scale Traffic' },
        { icon: RefreshCcw, label: 'Retain Readers' },
        { icon: Users, label: 'Increase Engagement' },
        { icon: Zap, label: 'Content Velocity' },
        { icon: MessageSquare, label: 'Semantic SEO' },
    ];

    return (
        <section id="about" className="py-16 bg-[#0a192f] text-white overflow-hidden border-t border-white/5">
            <div className="container max-w-5xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-8"
                    >
                        Put <span className="text-blue-400">every reader</span> first
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-base text-gray-300 max-w-lg mx-auto leading-relaxed"

                    >
                        Make every visitor feel like your content was written just for them with our advanced neural synthesis.
                    </motion.p>
                </div>

                {/* Micro Icons Row */}
                <div className="flex flex-wrap md:flex-nowrap justify-center items-center gap-8 md:gap-12 lg:gap-16 mb-24 max-w-5xl mx-auto">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex flex-col items-center gap-4 text-center group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 group-hover:text-blue-400 group-hover:border-blue-400/50 group-hover:bg-blue-400/10 transition-all duration-300">
                                <feature.icon size={24} />
                            </div>
                            <span className="text-[14px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">
                                {feature.label}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* Comparison Section */}
                <div className="relative max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

                        {/* Negative Side */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/5 rounded-[32px] p-8 border border-white/10"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                <h3 className="font-black text-white uppercase tracking-[0.3em] text-[11px]">Without an AI Agent</h3>
                            </div>
                            <ul className="space-y-6">
                                {[
                                    'Static keyword-stuffed articles.',
                                    'Slow, manual research and drafting.',
                                    'Generic stock images and dry layouts.',
                                    'Limited understanding of user intent.'
                                ].map((text, i) => (
                                    <li key={i} className="flex items-start gap-4 text-white font-normal">
                                        <XCircle size={14} className="shrink-0 mt-0.5 text-red-500/50" />
                                        <span className="text-xs uppercase tracking-tight text-gray-400">{text}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Positive Side - Premium Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="bg-[#0f1d2e] rounded-[40px] shadow-2xl border border-white/10 overflow-hidden transform lg:scale-[1.02]">
                                {/* Character/Avatar Area */}
                                <div className="h-48 bg-gradient-to-b from-blue-600/20 via-blue-500/5 to-transparent flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.3),transparent)]" />

                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                                        <div className="relative w-20 h-20 bg-[#0a192f] rounded-[20px] shadow-2xl border border-white/10 flex items-center justify-center overflow-hidden">
                                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-blue-500/10" />
                                            <Bot size={40} className="text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                        </div>
                                    </div>

                                    <div className="absolute top-4 right-6 text-blue-400/20">
                                        <Sparkles size={32} />
                                    </div>
                                </div>

                                <div className="p-10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.6)] animate-pulse" />
                                        <h3 className="font-black text-white uppercase tracking-[0.4em] text-[9px]">With AI Blog Agent</h3>
                                    </div>

                                    <ul className="space-y-6">
                                        {[
                                            { text: 'Personalizes every paragraph for readers.', color: 'text-white' },
                                            { text: 'Autonomous research across 100+ sources.', color: 'text-white' },
                                            { text: 'Real-time data integration & SEO monitoring.', color: 'text-white' },
                                            { text: 'Generates branded custom neural visuals.', color: 'text-white' }
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 font-normal">
                                                <CheckCircle2 size={16} className="text-blue-400" />
                                                <span className="text-gray-300 text-[10px] leading-tight uppercase tracking-tight">{item.text}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-10 pt-8 border-t border-white/5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                                    <Zap size={18} />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Agent performance</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-blue-400 font-black text-5xl block tracking-tighter">+440%</span>
                                                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Revenue Growth</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </section>
    );
}
