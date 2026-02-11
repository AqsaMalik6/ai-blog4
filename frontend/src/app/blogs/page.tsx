'use client';

import { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { blogApi, chatApi, Blog, Chat } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, User, Sparkles, Filter, Clock, Tag, BookOpen, ArrowRight, MessageSquare, History } from 'lucide-react';
import Link from 'next/link';
import { formatDate, cn } from '@/lib/utils';

// Mock categories and additional field logic since backend is basic
const CATEGORIES = ['All', 'AI', 'Technology', 'Innovation', 'Design', 'Marketing'];

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [chats, setChats] = useState<Chat[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 6;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [blogData, chatData] = await Promise.all([
                    blogApi.getAll(),
                    chatApi.getAll()
                ]);
                setBlogs(blogData);
                setChats(chatData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Helper to "assign" a category based on topic for filtering
    const getBlogCategory = (topic: string) => {
        const t = topic.toLowerCase();
        if (t.includes('marketing') || t.includes('seo') || t.includes('growth')) return 'Marketing';
        if (t.includes('design') || t.includes('ui') || t.includes('ux')) return 'Design';
        if (t.includes('ai') || t.includes('neural') || t.includes('agent')) return 'AI';
        if (t.includes('future') || t.includes('insight') || t.includes('innovation')) return 'Innovation';
        return 'Technology';
    };

    const filteredBlogs = useMemo(() => {
        return blogs.filter(blog => {
            const matchesSearch = blog.topic.toLowerCase().includes(searchTerm.toLowerCase());
            const category = getBlogCategory(blog.topic);
            const matchesCategory = selectedCategory === 'All' || category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [blogs, searchTerm, selectedCategory]);

    const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
    const currentBlogs = filteredBlogs.slice((currentPage - 1) * blogsPerPage, currentPage * blogsPerPage);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory]);

    return (
        <main className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
            <Navbar />

            {/* Background elements */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-[-10%] w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 pt-32 pb-24">
                <div className="container max-w-5xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-14">
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-blue-500 font-normal uppercase tracking-[0.6em] text-[9px] mb-6 block"
                        >
                            The Intelligence Archive
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-10"
                        >
                            Explore <br /> <span className="text-blue-500">Every Node.</span>
                        </motion.h1>
                    </div>

                    {/* Chat History Section - NEW */}
                    <div className="mb-24">
                        <div className="flex items-center gap-4 mb-10">
                            <History className="text-blue-500" size={20} />
                            <h2 className="text-2xl font-black uppercase tracking-tighter">Active Sessions</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {chats.slice(0, 4).map((chat, idx) => (
                                <motion.div
                                    key={chat.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Link href={`/old-workspace.html?chat_id=${chat.id}`} className="group block h-full">
                                        <div className="bg-white/5 border border-white/10 rounded-[20px] p-4 h-full flex flex-col hover:bg-white/[0.08] hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden">

                                            <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-150 transition-transform">
                                                <MessageSquare size={80} />
                                            </div>
                                            <span className="text-[10px] font-normal text-blue-500 uppercase tracking-widest mb-4">Chat ID #{chat.id}</span>
                                            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-tight line-clamp-2 leading-tight group-hover:text-blue-400">
                                                {chat.title}
                                            </h3>
                                            <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                                                <span className="text-[10px] font-normal text-slate-500 uppercase tracking-widest">{formatDate(chat.created_at)}</span>
                                                <ArrowRight size={16} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="flex flex-col lg:row items-center justify-between gap-10 mb-20 bg-white/5 p-8 rounded-[40px] border border-white/10 backdrop-blur-xl">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hidden md:block">
                                <Filter size={20} className="text-blue-500" />
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={cn(
                                            "px-6 py-3 rounded-xl font-normal uppercase text-[10px] tracking-widest transition-all",
                                            selectedCategory === cat
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                                : "bg-white/5 text-slate-500 hover:text-white border border-white/5"
                                        )}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="relative w-full lg:max-w-md">
                            <input
                                type="text"
                                placeholder="SEARCH ARCHIVE NODES..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-8 text-white placeholder:text-slate-700 font-normal uppercase text-[11px] tracking-widest focus:border-blue-500/50 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Blog Feed */}
                    {isLoading ? (
                        <div className="h-[400px] flex flex-col items-center justify-center gap-8 text-center pt-20">
                            <div className="w-20 h-20 border-t-2 border-blue-500 rounded-full animate-spin" />
                            <p className="text-blue-500 font-normal uppercase tracking-[0.4em] text-xs">Synchronizing Memory Nodes...</p>
                        </div>
                    ) : currentBlogs.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {currentBlogs.map((blog, idx) => {
                                    const category = getBlogCategory(blog.topic);
                                    return (
                                        <motion.div
                                            key={blog.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: (idx % 3) * 0.1 }}
                                            className="group"
                                        >
                                            <Link href={`/blogs/${blog.id}`} className="block h-full">
                                                <div className="bg-white/5 border border-white/10 rounded-[20px] p-4 h-full flex flex-col hover:bg-white/[0.08] hover:border-blue-500/30 transition-all duration-500">
                                                    {/* Featured Image Replacement */}
                                                    <div className="relative h-40 rounded-[16px] overflow-hidden mb-6 border border-white/5">
                                                        <img
                                                            src={`https://images.unsplash.com/photo-${1600000000000 + blog.id % 1000}?auto=format&fit=crop&q=80&w=800`}
                                                            alt={blog.topic}
                                                            className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                                        />
                                                        <div className="absolute top-6 left-6 px-4 py-2 bg-blue-600 rounded-full">
                                                            <span className="text-[9px] font-normal uppercase tracking-widest text-white">{category}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-6 mb-6">
                                                        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-normal uppercase tracking-widest">
                                                            <Clock size={14} className="text-blue-500" /> {formatDate(blog.timestamp)}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-normal uppercase tracking-widest">
                                                            <User size={14} className="text-blue-500" /> Admin
                                                        </div>
                                                    </div>

                                                    <h3 className="text-lg font-black text-white mb-3 leading-tight uppercase tracking-tight line-clamp-2 group-hover:text-blue-400 transition-colors">
                                                        {blog.topic}
                                                    </h3>

                                                    <p className="text-slate-400 font-normal text-[11px] leading-relaxed line-clamp-3 mb-6 uppercase tracking-tight">
                                                        {blog.content.substring(0, 150).replace(/[#*]/g, '')}...
                                                    </p>

                                                    <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                                                        <span className="text-[11px] font-normal text-slate-500 group-hover:text-white uppercase tracking-widest transition-colors">Node Insight</span>
                                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all">
                                                            <ArrowRight size={20} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-24 flex items-center justify-center gap-6">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => p - 1)}
                                        className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center disabled:opacity-20 hover:border-blue-500/50 transition-all"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <div className="flex items-center gap-3">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={cn(
                                                    "w-14 h-14 rounded-2xl font-normal transition-all",
                                                    currentPage === i + 1
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-white/5 text-slate-500 border border-white/5 hover:bg-white/10"
                                                )}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(p => p + 1)}
                                        className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center disabled:opacity-20 hover:border-blue-500/50 transition-all"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-40 border-2 border-dashed border-white/10 rounded-[64px] bg-white/[0.02]">
                            <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-4">Zero Nodes Found</h2>
                            <p className="text-slate-500 text-xl font-normal uppercase">No intelligence matches your search vector.</p>
                            <button
                                onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                                className="mt-12 text-blue-500 font-normal uppercase text-sm tracking-widest hover:underline"
                            >
                                Clear All Search Vectors
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
