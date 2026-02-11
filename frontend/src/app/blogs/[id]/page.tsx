'use client';

import { useState, useEffect, use, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { blogApi, Blog } from '@/lib/api';
import { motion, useScroll, useSpring } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Clock, Download, ArrowLeft, Sparkles, Cpu, ArrowRight, FileText } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [blog, setBlog] = useState<Blog | null>(null);
    const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const contentRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const downloadAsPDF = () => {
        if (!blog || !contentRef.current) return;

        const printWindow = window.open('', '', 'width=800,height=600');
        if (!printWindow) return;

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${blog.topic}</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 20px; }
                    h1 { color: #1e40af; margin-bottom: 10px; }
                    h2 { color: #1e40af; margin-top: 20px; margin-bottom: 10px; }
                    p { margin-bottom: 10px; }
                    .meta { color: #666; font-size: 0.9em; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
                </style>
            </head>
            <body>
                <h1>${blog.topic}</h1>
                <div class="meta">Published on ${formatDate(blog.timestamp)}</div>
                <div>${contentRef.current.innerText}</div>
            </body>
            </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();

        // Trigger print dialog
        setTimeout(() => {
            printWindow.print();
        }, 250);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const blogs = await blogApi.getAll();
                // Fallback to dummy data when backend is empty
                const DUMMY_BLOGS: Blog[] = [
                    { id: 101, topic: 'AI: Emergence of Agentic Systems', content: 'An exploration into agentic AI systems — architectures, capabilities, and early use-cases in automation and decision-making.', timestamp: '2026-02-01T09:00:00.000Z' },
                    { id: 102, topic: 'Agentic AI: Building Autonomous Agents', content: 'Practical guide to designing and deploying agentic AI that can plan, act, and learn in the wild.', timestamp: '2026-01-25T10:30:00.000Z' },
                    { id: 103, topic: 'AI in Healthcare: Augmenting Diagnosis', content: 'How AI models assist clinicians with diagnostics, triage, and personalized treatment suggestions.', timestamp: '2026-01-18T14:15:00.000Z' },
                    { id: 104, topic: 'Creative AI: Tools for Artists', content: 'A look at generative models and their role in creative workflows for design and media production.', timestamp: '2026-01-10T08:45:00.000Z' },
                    { id: 105, topic: 'The Future of Agentic AI', content: 'Speculation and researched predictions about agentic systems, governance, and societal impact.', timestamp: '2025-12-30T18:00:00.000Z' },
                    { id: 106, topic: 'Ethics & Safety for Autonomous Agents', content: 'Design patterns and guardrails to make agentic AI safer and aligned with human values.', timestamp: '2025-12-15T12:00:00.000Z' }
                ];

                const allBlogs = blogs && blogs.length > 0 ? blogs : DUMMY_BLOGS;
                const foundBlog = allBlogs.find(b => b.id === parseInt(id));
                setBlog(foundBlog || null);

                // Set some related blogs (excluding current)
                setRelatedBlogs(allBlogs.filter(b => b.id !== parseInt(id)).slice(0, 3));
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

    return (
        <main className="min-h-screen bg-black text-white overflow-x-hidden">
            <Navbar />

            {/* Reading Progress Indicator */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-[110] origin-left"
                style={{ scaleX }}
            />

            {/* Header Section - Compact */}
            <section className="relative pt-32 pb-16">
                <div className="container max-w-4xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6 text-center"
                    >
                        <div className="flex items-center justify-center gap-4">
                            <span className="bg-blue-600/10 border border-blue-500/30 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-blue-400 flex items-center gap-2">
                                <Sparkles size={12} /> Node Details
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight uppercase max-w-4xl mx-auto">
                            {blog?.topic}
                        </h1>

                        <div className="flex flex-wrap items-center justify-center gap-8 pt-6 text-center">
                            <div className="flex flex-col items-center">
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Created</span>
                                <span className="font-black text-xs uppercase tracking-wider text-slate-400">{blog ? formatDate(blog.timestamp) : ''}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="pb-32">
                <div className="container max-w-4xl mx-auto px-6">
                    <div className="space-y-8">
                        {/* Featured Image - Smaller */}
                        {blog && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative w-full max-w-lg mx-auto"
                            >
                                <div className="aspect-[16/9] rounded-[24px] overflow-hidden border border-white/10 shadow-lg">
                                    <img
                                        src={`https://picsum.photos/seed/blog-${blog.id}/800/450`}
                                        alt={blog.topic}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Content Box */}
                        <div ref={contentRef} id="blog-content" className="bg-white/5 border border-white/10 rounded-[24px] p-8">
                            <div className="prose prose-invert max-w-none
                                prose-headings:text-white prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight
                                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-6
                                prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-4
                                prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-sm
                                prose-strong:text-white prose-strong:font-black
                                prose-blockquote:italic prose-blockquote:border-l-blue-600 prose-blockquote:bg-white/5 prose-blockquote:p-6 prose-blockquote:rounded-lg
                                prose-li:text-slate-400 prose-li:font-normal prose-li:text-sm prose-li:mb-2
                            ">
                                <ReactMarkdown>
                                    {blog?.content || 'Loading...'}
                                </ReactMarkdown>
                            </div>
                        </div>

                        {/* Download Button - Small */}
                        {blog && (
                            <div className="flex justify-center pt-8">
                                <button
                                    onClick={downloadAsPDF}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-lg transition-all"
                                >
                                    <Download size={14} /> Download PDF
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Related Posts - Smaller */}
            {relatedBlogs.length > 0 && (
                <section className="py-32 bg-white/[0.02] border-y border-white/5">
                    <div className="container max-w-4xl mx-auto px-6">
                        <div className="mb-12">
                            <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Related Posts</span>
                            <h3 className="text-3xl font-black text-white uppercase tracking-tight">More <span className="text-blue-400">Insights</span></h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedBlogs.map((rBlog) => (
                                <Link key={rBlog.id} href={`/blogs/${rBlog.id}`} className="group">
                                    <div className="space-y-4">
                                        <div className="relative aspect-[16/10] rounded-[16px] overflow-hidden border border-white/5">
                                            <img
                                                src={`https://picsum.photos/seed/blog-${rBlog.id}/600/400`}
                                                alt={rBlog.topic}
                                                className="w-full h-full object-cover grayscale-[0.8] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-base font-black text-white leading-tight uppercase group-hover:text-blue-400 transition-colors line-clamp-2">{rBlog.topic}</h4>
                                            <p className="text-slate-500 text-xs font-normal">{formatDate(rBlog.timestamp)}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Final CTA */}
            <section className="py-24 text-center">
                <div className="container max-w-4xl mx-auto px-6 space-y-8">
                    <h3 className="text-4xl font-black text-white uppercase tracking-tight">
                        Explore More <br /> <span className="text-blue-500">Intelligence.</span>
                    </h3>
                    <Link href="/blogs" className="inline-flex items-center gap-3 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider rounded-lg transition-all">
                        Back to Archive <ArrowRight size={14} />
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
