'use client';

import Link from 'next/link';
import { Github, Twitter, Linkedin, MessageCircle, ShieldCheck, Zap, Bot, ArrowRight, Cpu } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-black pt-24 pb-16 border-t border-white/5 relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05)_0%,transparent_50%)]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] -ml-40 -mb-40" />

            <div className="container max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
                    {/* Brand Column */}
                    <div className="lg:col-span-5 space-y-10">
                        <Link href="/" className="flex items-center gap-4 group">
                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-blue-500/50 transition-all duration-500">
                                <Bot className="w-5 h-5 text-blue-400" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-white uppercase">
                                AURE<span className="text-blue-500">GON</span>
                            </span>
                        </Link>
                        <p className="text-base text-gray-300 max-w-md leading-relaxed">
                            Building the future of autonomous content intelligence. Empowering agencies with neural-driven growth.
                        </p>

                        <div className="flex items-center gap-3">
                            {[Github, Twitter, Linkedin, MessageCircle].map((Icon, idx) => (
                                <Link
                                    key={idx}
                                    href="#"
                                    className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-blue-600 transition-all border border-white/5"
                                >
                                    <Icon size={16} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="lg:col-span-2 space-y-10">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">Product</h4>
                        <ul className="space-y-6 text-slate-400 font-bold text-sm">
                            <li><Link href="/workspace" className="hover:text-blue-400 transition-colors">Workspace</Link></li>
                            <li><Link href="/blogs" className="hover:text-blue-400 transition-colors">Blog Feed</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">API</Link></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2 space-y-10">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">Company</h4>
                        <ul className="space-y-6 text-slate-400 font-bold text-sm">
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Legal</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Privacy</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter / CTA */}
                    <div className="lg:col-span-3 space-y-10">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">Initialize</h4>
                        <div className="p-8 bg-blue-600/10 rounded-3xl border border-blue-500/20 space-y-6">
                            <p className="text-white font-bold text-sm">Ready to scale your content engine?</p>
                            <Link href="/workspace" className="flex items-center justify-between w-full px-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-500 transition-colors">
                                Start Free <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex flex-wrap items-center justify-center gap-8">
                        <div className="flex items-center gap-3 text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">
                            <ShieldCheck size={14} className="text-blue-500" /> Secure Protocol
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">
                            <Zap size={14} className="text-purple-500" /> 12ms Latency
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Nodes Active
                        </div>
                    </div>

                    <p className="text-slate-700 text-[10px] font-black uppercase tracking-[0.5em]">
                        &copy; 2026 AUREGON AI. SYSTEM_READY
                    </p>
                </div>
            </div>
        </footer>
    );
}
