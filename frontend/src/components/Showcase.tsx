'use client';

import { motion } from 'framer-motion';
import {
    FileText,
    Layout,
    Search,
    Zap,
    BarChart3,
    Globe
} from 'lucide-react';

export default function Showcase() {
    const showcases = [
        {
            title: 'Tech Trends 2024',
            category: 'Innovation',
            icon: Zap,
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop'
        },
        {
            title: 'Market Analysis',
            category: 'Finance',
            icon: BarChart3,
            image: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=800&auto=format&fit=crop' // Better finance image
        },
        {
            title: 'Neural Networks',
            category: 'AI Research',
            icon: Globe,
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop'
        },
        {
            title: 'SEO Strategy',
            category: 'Marketing',
            icon: Search,
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'
        },
        {
            title: 'Creative Writing',
            category: 'Arts',
            icon: FileText,
            image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop' // Better writing image
        },
        {
            title: 'UI/UX Design',
            category: 'Design',
            icon: Layout,
            image: 'https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?q=80&w=800&auto=format&fit=crop' // Fixed UI/UX image
        },
    ];

    // Double the list for seamless infinite scroll
    const marqueeItems = [...showcases, ...showcases, ...showcases];

    return (
        <section className="py-24 bg-[#0a192f] overflow-hidden text-white">
            <div className="container max-w-5xl mx-auto px-6 mb-10">
                <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                    <div className="max-w-sm">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter leading-tight mb-8 max-w-4xl"
                        >
                            Powerful Nodes <br />
                            <span className="text-blue-400">Built To Convert.</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-base text-gray-300 max-w-lg leading-relaxed"
                        >
                            Our agent creates semantic clusters and high-converting layouts
                            designed to capture attention and build authority in any niche.
                        </motion.p>
                    </div>

                    <div className="hidden md:block">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <span className="text-[100px] font-black text-blue-400/10 leading-none">50+</span>
                            <div className="absolute top-1/2 left-0 -translate-y-1/2">
                                <p className="text-lg font-black uppercase tracking-widest text-white/80">
                                    Templates & <br /> Designs
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Marquee Section */}
            <div className="relative flex overflow-x-hidden py-10">
                <motion.div
                    animate={{ x: [0, -110 * showcases.length * 4] }}
                    transition={{
                        duration: 35,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="flex gap-8 whitespace-nowrap"
                >
                    {marqueeItems.map((item, idx) => (
                        <div
                            key={idx}
                            className="w-[260px] h-[360px] bg-white/5 rounded-[24px] border border-white/10 p-2 group hover:border-blue-400/50 transition-all duration-500"
                        >
                            <div className="w-full h-full bg-[#0d1624] rounded-[38px] overflow-hidden relative border border-white/5 flex flex-col shadow-2xl">
                                {/* Visual Image Area */}
                                <div className="h-3/5 w-full relative overflow-hidden group">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1624] via-transparent to-transparent" />

                                    {/* Category Badge */}
                                    <div className="absolute top-6 left-6 bg-blue-500/90 backdrop-blur px-5 py-2 rounded-full border border-blue-400/30">
                                        <div className="flex items-center gap-2">
                                            <item.icon size={14} className="text-white" />
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">{item.category}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-black text-white mb-2 tracking-tight group-hover:text-blue-400 transition-colors uppercase">{item.title}</h3>
                                        <p className="text-slate-500 text-[8px] font-normal uppercase tracking-[0.4em]">Optimized Neural Node V.4.2</p>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex -space-x-3">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className="w-10 h-10 rounded-full bg-blue-500/10 border-2 border-[#0d1624] flex items-center justify-center overflow-hidden">
                                                    <div className="w-full h-full bg-gradient-to-br from-blue-400/20 to-purple-400/20" />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Live Deployment</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
