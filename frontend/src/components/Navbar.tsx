'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Sparkles, Menu, X, ArrowRight, Github, Globe, Cpu, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '#about' },
        { name: 'Services', href: '#features' },
        { name: 'Blog', href: '/blogs' },
    ];

    return (
        <nav
            className={cn(
                'fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 py-6',
                isScrolled ? 'py-4' : 'py-8'
            )}
        >
            <motion.div
                className={cn(
                    "max-w-6xl mx-auto flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-500 relative",
                    isScrolled ? "glass shadow-2xl border-white/10" : "bg-transparent border-transparent"
                )}
            >
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group relative">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        <div className="absolute inset-0 bg-accent-blue rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="relative bg-white p-2 rounded-xl border border-accent-blue/30 transition-all duration-500 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-accent-blue to-accent-purple opacity-20" />
                            <Cpu className="w-6 h-6 text-accent-blue relative z-10" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tighter text-white leading-none">
                            AURE<span className="text-accent-blue">GON</span>
                        </span>
                    </div>
                </Link>

                {/* Desktop Menu - Centered Style like Screenshot 2/4/5 */}
                <div className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-[12px] font-bold uppercase tracking-[0.1em] text-white/70 hover:text-accent-blue transition-all"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Right Actions */}
                <div className="hidden md:flex items-center gap-6">
                    <Link
                        href="/old-workspace.html"
                        className="btn-primary flex items-center gap-3 px-6 py-3 text-[10px] group"
                    >
                        <span>WORKSPACE PAGE</span>
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/40 transition-colors">
                            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden text-white p-3 glass rounded-2xl"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </motion.div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="lg:hidden absolute top-32 left-6 right-6 glass p-10 rounded-[40px] flex flex-col gap-6 border border-white/10 z-[60] text-center"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-2xl font-black text-white"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/old-workspace.html"
                            className="btn-primary text-center py-6"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            WORKSPACE PAGE
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>

    );
}
