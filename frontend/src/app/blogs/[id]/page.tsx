'use client';

import { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { blogApi, Blog } from '@/lib/api';
import { motion, useScroll, useSpring } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Clock, Share2, ArrowLeft, Bookmark, Sparkles, Cpu, Facebook, Twitter, Linkedin, Link2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [blog, setBlog] = useState<Blog | null>(null);
    const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const blogs = await blogApi.getAll();
                const foundBlog = blogs.find(b => b.id === parseInt(id));
                setBlog(foundBlog || null);

                // Set some related blogs (excluding current)
                setRelatedBlogs(blogs.filter(b => b.id !== parseInt(id)).slice(0, 3));
            } catch (error) {
                console.error('Error fetching blog:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const calculateReadTime = (content: string) => {
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-8">
                    <div className="w-16 h-16 border-t-2 border-blue-500 rounded-full animate-spin" />
                    <p className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px]">Retrieving Memory Node...</p>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-7xl font-black mb-12 text-white uppercase tracking-tighter">Node Not Found</h1>
                    <Link href="/blogs" className="btn-primary px-12 py-6 inline-flex items-center gap-4">
                        <ArrowLeft size={20} /> RETURN TO ARCHIVE
                    </Link>
                </div>
            </div>
        );
    }

    const readTime = calculateReadTime(blog.content);

    // Schema Data
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": blog.topic,
        "image": `https://images.unsplash.com/photo-${1600000000000 + blog.id % 1000}?auto=format&fit=crop&q=80&w=1200`,
        "author": {
            "@type": "Person",
            "name": "Cortex Agent V.2"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Auregon AI",
            "logo": {
                "@type": "ImageObject",
                "url": "https://auregon-ai.com/logo.png"
            }
        },
        "datePublished": blog.timestamp,
        "description": blog.content.substring(0, 160).replace(/[#*]/g, '')
    };

    return (
        <main className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-blue-500/30">
            <Navbar />

            {/* SEO Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />

            {/* Reading Progress Indicator */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1.5 bg-blue-600 z-[110] origin-left shadow-[0_0_15px_#2563eb]"
                style={{ scaleX }}
            />

            {/* Header / Cover Image Section */}
            <section className="relative pt-60 pb-32 overflow-hidden">
                <div className="container max-w-6xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-12 text-center"
                    >
                        <div className="flex items-center justify-center gap-6">
                            <span className="bg-blue-600/10 border border-blue-500/30 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 flex items-center gap-2">
                                <Sparkles size={14} /> Neural Synthesis V4.2
                            </span>
                        </div>

                        <h1 className="text-6xl md:text-9xl font-black leading-[0.9] tracking-tighter uppercase max-w-5xl mx-auto">
                            {blog.topic}
                        </h1>

                        <div className="flex flex-wrap items-center justify-center gap-12 pt-12 border-t border-white/10 max-w-4xl mx-auto">
                            <div className="flex flex-col items-center">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Principal Author</span>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-500">
                                        <Cpu size={22} />
                                    </div>
                                    <span className="font-black text-sm uppercase tracking-wider">Agent Cortex</span>
                                </div>
                            </div>
                            <div className="w-[1px] h-12 bg-white/10 hidden md:block" />
                            <div className="flex flex-col items-center">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Timestamp</span>
                                <span className="font-black text-sm uppercase tracking-wider text-slate-400">{formatDate(blog.timestamp)}</span>
                            </div>
                            <div className="w-[1px] h-12 bg-white/10 hidden md:block" />
                            <div className="flex flex-col items-center">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Reading Velocity</span>
                                <span className="font-black text-sm uppercase tracking-wider text-blue-500">{readTime} Minute Node</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Image Section */}
            <div className="container max-w-7xl mx-auto px-6 mb-32">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative aspect-[21/9] rounded-[64px] overflow-hidden border border-white/10 shadow-3xl"
                >
                    <img
                        src={`https://images.unsplash.com/photo-${1600000000000 + blog.id % 1000}?auto=format&fit=crop&q=90&w=2000`}
                        alt={blog.topic}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40" />
                </motion.div>
            </div>

            {/* Article Body */}
            <section className="pb-40 relative">
                <div className="container max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                        {/* Sidebar Left: Share Tools */}
                        <aside className="lg:col-span-1 hidden lg:block">
                            <div className="sticky top-40 flex flex-col items-center gap-8">
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600 [writing-mode:vertical-lr] rotate-180">Propagate Node</span>
                                {[Twitter, Linkedin, Facebook, Link2].map((Icon, idx) => (
                                    <button
                                        key={idx}
                                        className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all"
                                    >
                                        <Icon size={20} />
                                    </button>
                                ))}
                            </div>
                        </aside>

                        {/* Main Content Area */}
                        <div className="lg:col-span-8">
                            <div className="prose prose-invert prose-2xl max-w-none 
                                prose-headings:text-white prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter
                                prose-h1:text-7xl prose-h2:text-5xl prose-h2:mt-24 prose-h2:mb-12 prose-h2:pb-8 prose-h2:border-b prose-h2:border-white/5
                                prose-h3:text-3xl prose-h3:mt-12
                                prose-p:text-slate-300 prose-p:leading-[1.9] prose-p:mb-12 prose-p:font-medium
                                prose-strong:text-white prose-strong:font-black
                                prose-blockquote:italic prose-blockquote:border-l-blue-600 prose-blockquote:bg-white/5 prose-blockquote:p-12 prose-blockquote:rounded-[40px]
                                prose-li:text-slate-400 prose-li:font-bold prose-li:mb-4
                                selection:bg-blue-600/30
                            ">
                                <ReactMarkdown>
                                    {blog.content}
                                </ReactMarkdown>
                            </div>
                        </div>

                        {/* Sidebar Right: Metadata / Actions */}
                        <aside className="lg:col-span-3 space-y-12">
                            <div className="bg-white/5 rounded-[40px] p-10 border border-white/10">
                                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40 mb-10">Persistence</h4>
                                <div className="space-y-8">
                                    <button className="flex items-center justify-between w-full p-6 bg-blue-600 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-blue-500 transition-all">
                                        Archive Node <Bookmark size={16} />
                                    </button>
                                    <button className="flex items-center justify-between w-full p-6 bg-white/5 border border-white/10 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-white/10 transition-all">
                                        Download PDF <ArrowRight size={16} className="-rotate-45" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-10 border border-white/5 rounded-[40px]">
                                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40 mb-8">Metadata</h4>
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[9px] font-black text-slate-600 uppercase">System Integrity</span>
                                        <span className="text-emerald-500 font-black text-sm">Verified Node 100%</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[9px] font-black text-slate-600 uppercase">Latency Rate</span>
                                        <span className="text-white font-black text-sm">12ms Synthetic</span>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            {/* Related Posts Section */}
            <section className="py-40 bg-white/[0.02] border-y border-white/5">
                <div className="container max-w-7xl mx-auto px-6">
                    <div className="flex items-end justify-between mb-20">
                        <div>
                            <span className="text-blue-500 font-black uppercase tracking-[0.5em] text-[11px] mb-6 block">Continue Research</span>
                            <h3 className="text-5xl font-black text-white uppercase tracking-tighter">Related <span className="text-blue-400">Insights.</span></h3>
                        </div>
                        <Link href="/blogs" className="hidden md:flex items-center gap-4 text-slate-500 hover:text-white font-black uppercase text-[12px] tracking-widest transition-all group">
                            Explore All <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {relatedBlogs.map((rBlog) => (
                            <Link key={rBlog.id} href={`/blogs/${rBlog.id}`} className="group">
                                <div className="space-y-8">
                                    <div className="relative aspect-[16/10] rounded-[40px] overflow-hidden border border-white/5">
                                        <img
                                            src={`https://images.unsplash.com/photo-${1600000000000 + rBlog.id % 1000}?auto=format&fit=crop&q=80&w=600`}
                                            alt={rBlog.topic}
                                            className="w-full h-full object-cover grayscale-[0.8] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                        />
                                    </div>
                                    <div className="space-y-4 px-2">
                                        <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-500">
                                            <span className="text-blue-500">Case Study</span>
                                            <div className="w-1 h-1 bg-slate-800 rounded-full" />
                                            <span>{formatDate(rBlog.timestamp)}</span>
                                        </div>
                                        <h4 className="text-2xl font-black text-white leading-tight uppercase group-hover:text-blue-400 transition-colors line-clamp-2">{rBlog.topic}</h4>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom Final CTA */}
            <section className="py-40 text-center relative overflow-hidden">
                <div className="container max-w-5xl mx-auto px-6 relative z-10">
                    <h3 className="text-5xl md:text-8xl font-black text-white leading-[0.95] tracking-tighter uppercase mb-12">
                        Build your own <br /> <span className="text-blue-500">Empire.</span>
                    </h3>
                    <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto mb-16 uppercase tracking-tight">
                        Empower your agency with the same neural technology used to synthesize this intelligence node.
                    </p>
                    <Link href="/workspace" className="btn-primary inline-flex items-center gap-6 px-16 py-8">
                        <span className="text-[15px]">INITIALIZE AGENT</span>
                        <ArrowRight size={24} />
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
