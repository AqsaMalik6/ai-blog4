'use client';

import { motion } from 'framer-motion';
import { Bot, Command, Code2, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative pt-20 pb-24 overflow-hidden bg-black min-h-[75vh] flex flex-col items-center">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#3b82f6]/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#8b5cf6]/5 rounded-full blur-[100px]" />
                <div className="absolute inset-0 grid-background opacity-20" />
            </div>

            <div className="container max-w-5xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tighter mb-5 max-w-2xl"
                >
                    AI that builds with you
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="text-base text-gray-300 max-w-lg mx-auto leading-relaxed"
                >
                    An Agentic AI blogging system that researches, writes, edits, and optimizes content automatically.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex justify-center mt-12"
                >
                    <Link href="/old-workspace.html" className="px-8 py-3 rounded-full font-black uppercase tracking-widest text-[10px] bg-white text-black transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_15px_30px_rgba(255,255,255,0.1)]">
                        WORKSPACE PAGE
                    </Link>
                </motion.div>


                {/* Sub-link */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-slate-500 text-sm font-medium mb-24"
                >
                </motion.p>

                {/* Mockup Container */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="relative w-full group"
                >
                    {/* Intense Colorful Aura Background */}
                    <div className="absolute -inset-10 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-purple-500/20 opacity-50 blur-[100px] group-hover:opacity-70 transition-opacity duration-1000" />

                    {/* The Mockup Wrapper */}
                    <div className="relative rounded-2xl border border-white/10 bg-[#0d1117]/90 shadow-2xl overflow-hidden backdrop-blur-xl">
                        {/* Tab-bar like VS Code */}
                        <div className="h-12 border-b border-white/5 flex items-center px-4 bg-black/40 gap-4">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
                            </div>
                            <div className="h-4 w-1px bg-white/5" />
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-md border border-white/5">
                                <Code2 size={12} className="text-blue-400" />
                                <span className="text-[10px] font-mono text-slate-400">runner-service.ts</span>
                            </div>
                        </div>

                        {/* Editor Body */}
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] h-[380px]">
                            {/* Left: Code Editor Area */}
                            <div className="p-8 font-mono text-sm leading-relaxed overflow-hidden border-r border-white/5 bg-[#0d1117]">
                                <div className="flex gap-6">
                                    <div className="text-slate-700 text-right space-y-1 select-none">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => <div key={n}>{n}</div>)}
                                    </div>
                                    <div className="space-y-1 text-slate-400">
                                        <div><span className="text-purple-400">import</span> {'{'} <span className="text-blue-400">type</span> <span className="text-yellow-400">Runner</span> {'}'} <span className="text-purple-400">from</span> <span className="text-emerald-400">'@prisma/client'</span>;</div>
                                        <div><span className="text-purple-400">import</span> <span className="text-blue-400">prisma</span> <span className="text-purple-400">from</span> <span className="text-emerald-400">'@/lib/data/prisma'</span>;</div>
                                        <div className="h-4" />
                                        <div><span className="text-purple-400">export interface</span> <span className="text-yellow-400">RunnerService</span> {'{'}</div>
                                        <div>  <span className="text-blue-400">getById</span>(id: <span className="text-blue-400">number</span>): <span className="text-yellow-400">Promise</span>{'<'}<span className="text-yellow-400">Runner</span> | <span className="text-blue-400">null</span>{'>'};</div>
                                        <div>{'}'}</div>
                                        <div className="h-4" />
                                        <div><span className="text-purple-400">const</span> <span className="text-blue-400">runnerService</span>: <span className="text-yellow-400">RunnerService</span> = {'{'}</div>
                                        <div className="bg-white/5 -mx-4 px-4 py-1 border-y border-white/5">
                                            <span className="text-blue-400 ml-4">getById</span>: <span className="text-purple-400">async</span> (id: <span className="text-blue-400">number</span>) ={'>'} {'{'}
                                        </div>
                                        <div className="relative">
                                            <span className="text-purple-400 ml-8">return await</span><span className="text-slate-200"> prisma.runner.</span><span className="text-blue-400">findUnique</span>({'...'});
                                            {/* Cursor Animation */}
                                            <motion.div
                                                animate={{ opacity: [0, 1, 0] }}
                                                transition={{ duration: 0.8, repeat: Infinity }}
                                                className="absolute top-0 right-0 w-[2px] bg-blue-400 h-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: AI Chat Interface */}
                            <div className="bg-black/40 p-10 flex flex-col h-full relative backdrop-blur-xl">
                                <div className="flex items-center gap-3 mb-10 pb-4 border-b border-white/5">
                                    <Bot size={18} className="text-blue-400" />
                                    <span className="font-black text-[9px] uppercase tracking-[0.3em] text-slate-500">CO_PILOT_CORE</span>
                                </div>

                                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
                                        <div className="relative w-24 h-24 rounded-3xl bg-black border border-white/5 flex items-center justify-center text-blue-400 shadow-2xl">
                                            <Bot size={48} className="drop-shadow-[0_0_15px_#3b82f6]" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="font-black text-white uppercase text-[12px] tracking-widest">Edit with Copilot</h4>
                                        <p className="text-slate-500 text-[11px] leading-relaxed max-w-[200px]">Generating enterprise-grade AI intelligence from the command center.</p>
                                    </div>
                                </div>

                                <div className="mt-auto px-5 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group-hover:border-blue-500/30 transition-colors">
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Ask a question...</span>
                                    <div className="flex items-center gap-2">
                                        <div className="px-1.5 py-0.5 rounded border border-white/10 text-[9px] font-mono text-slate-600">Cmd</div>
                                        <div className="px-1.5 py-0.5 rounded border border-white/10 text-[9px] font-mono text-slate-600">I</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Bot Icon - Absolute Ref to Image */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute right-[-2%] bottom-[15%] z-[60] pointer-events-none hidden xl:block"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500/40 blur-3xl rounded-full scale-150 animate-pulse" />
                            <div className="relative w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full p-[2px] shadow-2xl">
                                <div className="bg-black w-full h-full rounded-full flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3),transparent_70%)]" />
                                    <Bot size={60} className="text-blue-400 relative z-10 drop-shadow-[0_0_20px_#3b82f6]" />

                                    {/* AI Scan Pulse */}
                                    <motion.div
                                        animate={{ top: ['100%', '-100%'] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-x-0 h-1 bg-blue-400/50 blur-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
