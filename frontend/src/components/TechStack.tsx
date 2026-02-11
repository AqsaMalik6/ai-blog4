'use client';

import { motion } from 'framer-motion';
import {
    CheckCircle2,
    Database,
    History,
    Key,
    Cpu
} from 'lucide-react';

export default function TechStack() {
    return (
        <section id="features" className="py-16 bg-[#0a0a0a] text-white overflow-hidden relative">
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.05)_0%,transparent_50%)] pointer-events-none" />

            <div className="container max-w-5xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    {/* Left Side: Professional AI Representation Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-3xl aspect-square lg:aspect-auto lg:h-[450px]"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop"
                            alt="Neural AI Matrix"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                        <div className="absolute bottom-10 left-10 right-10 p-8 glass rounded-3xl border border-white/10">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                                    <Cpu size={20} />
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Active Core Processing</span>
                            </div>
                            <p className="text-white text-sm font-normal leading-tight uppercase opacity-80">Every node is verified across 100+ global data points for maximum authority.</p>
                        </div>
                    </motion.div>

                    {/* Right Side: Text & Features */}
                    <div className="space-y-16">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-blue-500 font-black uppercase tracking-[0.6em] text-[12px] mb-8 block"></span>
                            <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tighter mb-8 max-w-4xl uppercase">
                                Advanced AI <br />
                                <span className="text-blue-500">Orchestration.</span>
                            </h3>
                            <p className="text-base text-gray-300 max-w-lg leading-relaxed">
                                We&apos;ve engineered our AI Blog Agent using the world&apos;s most powerful APIs and SDKs to ensure enterprise-grade reliability and infinite scalability.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-12">
                            {[
                                { title: 'OpenAI Agents SDK', text: 'Full orchestration style agent for complex task reasoning and neural synthesis.', icon: Cpu },
                                { title: 'Gemini Pro Access', text: 'Integrated via secure API keys for deep semantic analysis and content depth.', icon: Key },
                                { title: 'Neural Dashboard', text: 'Clean, professional UI with real-time status monitoring and agent controls.', icon: Database }, // Icon reuse for layout
                                { title: 'Archival Database', text: 'Linked with PostgreSQL to preserve every chat history and deployment node.', icon: Database },
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex flex-col gap-6"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <h4 className="text-base font-black text-white tracking-tight uppercase leading-none">{item.title}</h4>
                                    </div>
                                    <p className="text-slate-500 text-[11px] font-normal leading-relaxed pl-14 uppercase">
                                        {item.text}
                                    </p>
                                </motion.div>
                            ))}
                        </div>


                    </div>
                </div>
            </div>
        </section>
    );
}
