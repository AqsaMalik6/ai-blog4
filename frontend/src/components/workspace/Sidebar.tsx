'use client';

import { useState, useEffect } from 'react';
import { chatApi, Chat } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, History, ChevronLeft, ChevronRight, ShieldCheck, Binary, Zap, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

import Link from 'next/link';

interface SidebarProps {
    onSelectChat: (id: number) => void;
    selectedChatId?: number;
}

export default function WorkspaceSidebar({ onSelectChat, selectedChatId }: SidebarProps) {
    const [chats, setChats] = useState<Chat[]>([]);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => { loadChats(); }, []);

    const loadChats = async () => {
        try {
            const data = await chatApi.getAll();
            setChats(data);
        } catch (_error) { console.error('Error loading chats:', _error); }
    };

    const handleDeleteChat = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        try {
            await chatApi.delete(id);
            setChats(chats.filter(c => c.id !== id));
            toast.success('DATA_NODE_DELETED', {
                style: { background: '#0e0e16', color: '#f000ff', border: '1px solid #f000ff20' }
            });
        } catch (_error) { toast.error('PROTOCOL_ERR: ACTION_FAILED'); }
    };

    return (
        <aside
            className={cn(
                "h-screen bg-bg-surface border-r border-white/5 transition-all duration-700 flex flex-col relative z-50",
                isCollapsed ? "w-28" : "w-96"
            )}
        >
            {/* Collapse Interaction */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white text-black rounded-full p-2 border border-white/10 z-[60] hover:scale-110 active:scale-90 transition-all shadow-lg shadow-white/20"
            >
                {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>

            <div className="p-10 flex flex-col h-full bg-bg-dark/50">
                {/* Header / Brand */}
                <div className="mb-16">
                    <Link href="/" className={cn("flex items-center gap-4 group", isCollapsed && "justify-center")}>
                        <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center border-accent-blue/30 group-hover:rotate-[15deg] transition-transform duration-500">
                            <Cpu className="w-6 h-6 text-accent-blue" />
                        </div>
                        {!isCollapsed && (
                            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
                                AURE<span className="text-accent-blue">GON</span>
                            </span>
                        )}
                    </Link>
                </div>

                {/* Main Action */}
                <div className="mb-14">
                    <button
                        onClick={() => onSelectChat(-1)}
                        className={cn(
                            "w-full flex items-center gap-4 bg-white text-black p-5 rounded-3xl hover:bg-accent-blue transition-all font-black uppercase text-[12px] tracking-widest group shadow-xl",
                            isCollapsed && "justify-center px-0 h-20"
                        )}
                    >
                        <Plus size={24} className="group-hover:rotate-180 transition-transform duration-700" />
                        {!isCollapsed && <span>New Session</span>}
                    </button>
                </div>

                {/* List Container */}
                <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-4">
                    {!isCollapsed && (
                        <div className="flex items-center gap-3 text-slate-700 text-[11px] font-black uppercase tracking-[0.5em] mb-10 pl-2">
                            <Binary size={16} className="text-accent-blue animate-pulse" /> Memory_Vaults
                        </div>
                    )}

                    <AnimatePresence>
                        {chats.map((chat) => (
                            <motion.div
                                key={chat.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={() => onSelectChat(chat.id)}
                                className={cn(
                                    "group flex items-center justify-between p-6 rounded-[32px] cursor-pointer transition-all border",
                                    selectedChatId === chat.id
                                        ? "bg-accent-blue/5 border-accent-blue/30 text-accent-blue scale-[1.02]"
                                        : "hover:bg-white/[0.02] border-transparent text-slate-500 hover:text-white",
                                    isCollapsed && "justify-center"
                                )}
                            >
                                <div className="flex items-center gap-6 truncate">
                                    <div className={cn(
                                        "w-2.5 h-2.5 rounded-full shrink-0",
                                        selectedChatId === chat.id ? "bg-accent-blue shadow-lg shadow-accent-blue/50" : "bg-bg-surface"
                                    )} />
                                    {!isCollapsed && <span className="truncate text-[14px] font-black uppercase tracking-tight">{chat.title || 'Untitled Node'}</span>}
                                </div>

                                {!isCollapsed && (
                                    <button
                                        onClick={(e) => handleDeleteChat(e, chat.id)}
                                        className="opacity-0 group-hover:opacity-100 p-3 hover:bg-accent-magenta/10 hover:text-accent-magenta rounded-2xl transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Footer Hardware Info */}
                <div className="pt-10 border-t border-white/5 mt-10">
                    <div className={cn("flex flex-col gap-6", isCollapsed && "items-center")}>
                        <div className="flex items-center gap-4 text-[10px] font-black text-slate-700 uppercase tracking-widest">
                            <ShieldCheck size={18} className="text-accent-blue" /> {!isCollapsed && "Encryption Active"}
                        </div>
                        {!isCollapsed && (
                            <div className="p-6 glass-card rounded-[32px] border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                                <p className="text-[10px] text-accent-purple font-black uppercase tracking-[0.3em] mb-3">Hardware Bridge</p>
                                <p className="text-white text-xs font-black font-mono tracking-widest uppercase">CORE_SYNC_V4.2</p>
                                <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-2/3 bg-accent-blue animate-pulse" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
}

