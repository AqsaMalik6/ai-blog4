'use client';

import { useState, useEffect, useRef } from 'react';
import WorkspaceSidebar from '@/components/workspace/Sidebar';
import { blogApi, chatApi, Message } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2, Save, Share, Image as ImageIcon, Zap, Target, Key, Hash, FileText, ChevronDown, Terminal, Cpu, ShieldAlert, Binary, Rocket } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast, { Toaster } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function WorkspacePage() {
    const [selectedChatId, setSelectedChatId] = useState<number | undefined>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [topic, setTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    // Advanced Settings State
    const [tone, setTone] = useState('Professional');
    const [audience, setAudience] = useState('General');
    const [keywords, setKeywords] = useState('');
    const [wordCount, setWordCount] = useState('1000');
    const [showAdvanced, setShowAdvanced] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (selectedChatId && selectedChatId !== -1) { loadMessages(selectedChatId); }
        else { setMessages([]); }
    }, [selectedChatId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isGenerating]);

    const loadMessages = async (chatId: number) => {
        try {
            const data = await chatApi.getMessages(chatId);
            setMessages(data);
        } catch (_error) { toast.error('PROTOCOL_ERR: BUFFER_SYNC_FAILED'); }
    };

    const handleGenerate = async () => {
        if (!topic.trim()) { toast.error('PROTOCOL_ERROR: SEED_TOPIC_REQUIRED'); return; }

        setIsGenerating(true);
        const loadingToast = toast.loading('Initializing Neural Research Protocols...', {
            style: { background: '#0e0e16', color: '#00d2ff', border: '1px solid #00d2ff20' }
        });

        try {
            const prompt = `Topic: ${topic}\nTone: ${tone}\nAudience: ${audience}\nKeywords: ${keywords}\nLength: ${wordCount} words`;
            const result = await blogApi.generate(prompt, selectedChatId === -1 ? undefined : selectedChatId);

            if (result.success) {
                toast.dismiss(loadingToast);
                toast.success('SYNTHESIS_PIPELINE_COMPLETE');
                setSelectedChatId(result.chat_id);
                loadMessages(result.chat_id);
            }
        } catch (_error) {
            toast.dismiss(loadingToast);
            toast.error('LINK_INTERRUPTED: RETRY_REQUIRED');
        } finally {
            setIsGenerating(false);
            setTopic('');
        }
    };

    return (
        <div className="flex h-screen bg-bg-dark text-white overflow-hidden font-sans">
            <Toaster position="top-right" />
            <WorkspaceSidebar onSelectChat={(id) => setSelectedChatId(id)} selectedChatId={selectedChatId} />

            <main className="flex-1 flex flex-col relative overflow-hidden bg-bg-dark">
                {/* Immersive Background */}
                <div className="absolute inset-0 grid-background opacity-20 pointer-events-none" />
                <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-accent-blue/5 rounded-full blur-[150px] pointer-events-none" />

                {/* Top Command Bar */}
                <header className="px-10 py-6 border-b border-white/5 flex items-center justify-between glass z-40">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-accent-blue/5 flex items-center justify-center text-accent-blue border border-accent-blue/20 shadow-lg shadow-accent-blue/20">
                            <Binary size={28} className="animate-pulse" />
                        </div>
                        <div>
                            <h1 className="font-black text-xl uppercase tracking-[0.2em]">COMMAND_CENTER_V4</h1>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">Operational Security Level: HIGH</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex gap-10 mr-10 items-center border-r border-white/10 pr-10">
                            <div className="text-right">
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">NODE_LATENCY</p>
                                <p className="text-sm font-mono text-accent-blue font-bold tracking-widest">14ms</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">ENGINE_CORE</p>
                                <p className="text-sm font-mono text-accent-purple font-bold tracking-widest">AI_V16.1</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="w-12 h-12 glass flex items-center justify-center rounded-2xl text-slate-400 hover:text-white hover:border-accent-blue transition-all"><Save size={18} /></button>
                            <button className="w-12 h-12 glass flex items-center justify-center rounded-2xl text-slate-400 hover:text-white hover:border-accent-purple transition-all"><Share size={18} /></button>
                        </div>
                    </div>
                </header>

                {/* Viewport */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-20 md:px-20 space-y-24 custom-scrollbar scroll-smooth relative z-10">
                    <AnimatePresence mode="wait">
                        {!selectedChatId || selectedChatId === -1 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="h-full flex flex-col items-center justify-center text-center max-w-4xl mx-auto"
                            >
                                <div className="w-40 h-40 bg-accent-blue/5 rounded-[56px] flex items-center justify-center text-accent-blue mb-16 border border-accent-blue/20 relative ai-scan-line shadow-xl shadow-accent-blue/10">
                                    <Terminal size={70} className="relative z-10" />
                                    <div className="absolute inset-0 bg-accent-blue/20 blur-[80px] rounded-full" />
                                </div>
                                <h2 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter uppercase leading-none">Initialize <span className="text-gradient">Synthesis.</span></h2>
                                <p className="text-slate-500 text-xl mb-20 max-w-2xl font-bold leading-relaxed tracking-tight">
                                    Input your core mission parameters below. Our autonomous agents will architect a high-authority intelligence node.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                                    {[
                                        { t: 'Future of Neural Architectures', desc: 'Predictive analysis of 2026 AI breakthroughs.' },
                                        { t: 'Brutalist Design in SaaS', desc: 'Visual identity guide for high-end digital agency.' },
                                        { t: 'The AI Search Era (GEO)', desc: 'How to survive the death of traditional SEO.' },
                                        { t: 'Autonomous Agentic Ops', desc: 'Full-cycle automation in marketing workflows.' }
                                    ].map(item => (
                                        <button
                                            key={item.t}
                                            onClick={() => setTopic(item.t)}
                                            className="p-10 glass-card rounded-[40px] border-white/5 hover:border-accent-blue/40 text-left transition-all group relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-150 group-hover:opacity-[0.1] transition-all duration-1000"><Sparkles size={60} /></div>
                                            <p className="text-[10px] text-accent-blue font-black uppercase tracking-[0.4em] mb-6">PRE_CONFIGURED_SEED</p>
                                            <p className="text-2xl font-black mb-3 tracking-tighter transition-colors group-hover:text-accent-blue uppercase">{item.t}</p>
                                            <p className="text-slate-500 text-sm font-bold leading-relaxed">{item.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto space-y-24 pb-60">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={cn("flex flex-col gap-10", msg.role === 'user' ? "items-end" : "items-start")}>
                                        <div className={cn(
                                            "max-w-[95%] p-14 rounded-[60px] shadow-2xl border transition-all duration-700",
                                            msg.role === 'user'
                                                ? "bg-white text-black border-white rounded-tr-none"
                                                : "glass-card border-white/10 rounded-tl-none"
                                        )}>
                                            <div className={cn(
                                                "prose prose-invert max-w-none leading-[1.8] text-xl font-bold tracking-tight",
                                                msg.role === 'user' ? "text-slate-900" : "text-white"
                                            )}>
                                                <ReactMarkdown
                                                    components={{
                                                        h1: ({ ...props }) => <h1 className="text-4xl font-black mb-10 border-l-8 border-accent-blue pl-8 uppercase tracking-tighter" {...props} />,
                                                        h2: ({ ...props }) => <h2 className="text-3xl font-black mb-8 mt-16 uppercase" {...props} />,
                                                        p: ({ ...props }) => <p className="mb-8" {...props} />
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>

                                            {msg.image_url && (
                                                <div className="mt-14 rounded-[40px] overflow-hidden border border-white/10 group relative ai-scan-line shadow-2xl">
                                                    <Image src={msg.image_url} alt="AI Synthesis" width={1000} height={800} className="w-full h-auto object-cover transition-transform duration-[3s] group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-12">
                                                        <button className="bg-accent-blue text-black p-5 rounded-2xl font-black flex items-center gap-3 uppercase text-[12px] tracking-widest"><ImageIcon size={20} /> Download Visual Asset</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 px-10">
                                            <div className={cn("w-2 h-2 rounded-full", msg.role === 'user' ? "bg-white" : "bg-accent-blue shadow-lg shadow-accent-blue")} />
                                            <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em]">
                                                {msg.role} // OFFSET: {new Date(msg.created_at).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {isGenerating && (
                                    <div className="flex flex-col gap-10 items-start">
                                        <div className="glass-card p-20 rounded-[60px] rounded-tl-none border-accent-blue/20 w-full flex flex-col items-center justify-center gap-12 relative overflow-hidden ai-scan-line">
                                            <div className="relative">
                                                <div className="absolute -inset-10 bg-accent-blue/30 rounded-full blur-[60px] animate-pulse" />
                                                <Loader2 className="w-24 h-24 text-accent-blue animate-spin relative z-10" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-white font-black uppercase text-3xl tracking-tighter mb-4 animate-pulse">Architecting Knowledge Node...</p>
                                                <p className="text-accent-purple text-xs font-black uppercase tracking-[0.5em]">System status: Live Web Synthesis Mode Active</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Input Console */}
                <div className="p-8 md:px-20 md:pb-16 absolute bottom-0 left-0 right-0 z-40">
                    <div className="max-w-5xl mx-auto relative group">
                        <div className="absolute -inset-2 bg-gradient-to-r from-accent-blue/40 via-accent-purple/40 to-accent-magenta/40 rounded-[50px] blur-3xl opacity-0 group-focus-within:opacity-30 transition-opacity duration-1000" />

                        <div className="relative glass-card border-white/20 group-focus-within:border-accent-blue/50 p-4 rounded-[50px] shadow-2xl flex flex-col gap-3">

                            {/* Advanced Parameters Expandable */}
                            <AnimatePresence>
                                {showAdvanced && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden border-b border-white/10"
                                    >
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2"><Sparkles size={12} className="text-accent-blue" /> Tone_Matrix</label>
                                                <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xs font-black uppercase focus:outline-none focus:border-accent-blue/50 appearance-none cursor-pointer">
                                                    {['Professional', 'Witty', 'Casual', 'Formal', 'Experimental'].map(t => <option key={t} className="bg-bg-dark">{t}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2"><Target size={12} className="text-accent-purple" /> Target_Audience</label>
                                                <select value={audience} onChange={(e) => setAudience(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xs font-black uppercase focus:outline-none focus:border-accent-purple/50 appearance-none cursor-pointer">
                                                    {['General', 'Technical', 'C-Suite', 'Creators', 'Venture_Scale'].map(t => <option key={t} className="bg-bg-dark">{t}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2"><Hash size={12} className="text-accent-magenta" /> Key_Identifiers</label>
                                                <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="VECTOR, SCALABLE, AI" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xs font-black uppercase focus:outline-none focus:border-accent-magenta/50 placeholder:opacity-30" />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2"><FileText size={12} className="text-white" /> Word_Density</label>
                                                <select value={wordCount} onChange={(e) => setWordCount(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xs font-black uppercase focus:outline-none focus:border-white/50 appearance-none cursor-pointer">
                                                    {['500', '1000', '2500', '5000'].map(t => <option key={t} value={t} className="bg-bg-dark">{t} Tokens</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                    className={cn(
                                        "ml-6 w-14 h-14 rounded-2xl transition-all flex items-center justify-center",
                                        showAdvanced ? "bg-accent-blue/20 text-accent-blue border border-accent-blue/30" : "bg-white/5 text-slate-500 hover:bg-white/10"
                                    )}
                                >
                                    <ChevronDown size={24} className={cn("transition-transform duration-500", showAdvanced && "rotate-180")} />
                                </button>

                                <textarea
                                    rows={1}
                                    placeholder="Execute seed mission [Ctrl + Enter]..."
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleGenerate())}
                                    className="flex-1 bg-transparent border-none focus:ring-0 px-8 py-8 text-white text-xl font-black placeholder:text-slate-800 resize-none max-h-60 uppercase tracking-tight"
                                />

                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !topic.trim()}
                                    className={cn(
                                        "m-4 w-20 h-20 rounded-[30px] transition-all shadow-2xl flex items-center justify-center shrink-0",
                                        isGenerating || !topic.trim()
                                            ? "bg-white/5 text-white/10"
                                            : "bg-white text-black hover:bg-accent-blue hover:text-black hover:scale-105 active:scale-95"
                                    )}
                                >
                                    {isGenerating ? <Loader2 size={32} className="animate-spin" /> : <Rocket size={32} />}
                                </button>
                            </div>
                        </div>

                        {/* Terminal Footer Info */}
                        <div className="flex items-center justify-center gap-12 mt-10">
                            <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.4em] flex items-center gap-3">
                                <span className="w-1.5 h-1.5 bg-accent-blue animate-pulse rounded-full shadow-sm shadow-accent-blue" /> ARCHIVE_CONNECTION: OK
                            </p>
                            <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.4em] flex items-center gap-3">
                                <ShieldAlert size={14} className="text-accent-magenta" /> ENCRYPTION: V8_SABER
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
