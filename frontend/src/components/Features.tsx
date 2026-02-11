'use client';

import { motion } from 'framer-motion';
import { Cpu, Brain, Sparkles, Target, Zap, Globe, Share2, Shield, Search, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Features() {
    const features = [
        {
            title: 'Neural Web Synthesis',
            desc: 'Autonomous agents scan thousands of digital nodes to build a factual foundation.',
            icon: Brain,
            color: 'text-accent-blue',
            bg: 'bg-accent-blue/5',
        },
        {
            title: 'Dynamic GEO Context',
            desc: 'Optimize for Next-Gen search by aligning content with intent and authority.',
            icon: Target,
            color: 'text-accent-purple',
            bg: 'bg-accent-purple/5',
        },
        {
            title: 'Holographic Visuals',
            desc: 'Every node generates custom-branded neural imagery with high-def precision.',
            icon: Zap,
            color: 'text-accent-magenta',
            bg: 'bg-accent-magenta/5',
        }
    ];

    return (
        <section id="features" className="py-24 relative bg-bg-dark overflow-hidden">
            <div className="container max-w-5xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-accent-blue font-black uppercase tracking-[0.5em] text-[11px] mb-8 block"
                    >
                        Intelligence Core
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tighter uppercase"
                    >
                        Harness AI Consulting to <br />
                        <span className="text-gradient">Accelerate Growth.</span>
                    </motion.h2>
                </div>

                {/* Grid Visual (Screenshot 3 Style) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 rounded-[32px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <div className="relative glass-card p-8 rounded-[24px] border-white/10 transition-all duration-700 bg-bg-surface/40 hover:translate-y-[-10px]">
                                <div className={cn("w-14 h-14 rounded-[16px] flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110", feature.bg)}>
                                    <feature.icon className={cn("w-7 h-7", feature.color)} />
                                </div>
                                <h3 className="text-xl font-black text-white mb-4 tracking-tight uppercase">{feature.title}</h3>
                                <p className="text-slate-500 text-sm font-normal leading-relaxed">{feature.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Massive Branding Row (Screenshot 2 influence) */}
                <div className="mt-24 pt-16 border-t border-white/5">
                    <p className="text-center text-[9px] text-slate-600 font-black uppercase tracking-[0.5em] mb-10">Trusted by 120+ Global Agencies</p>
                    <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all">
                        {['Retool', 'Remote', 'Arc', 'Raycast', 'Runway'].map((brand) => (
                            <span key={brand} className="text-xl font-black text-white italic tracking-tighter">{brand}</span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
