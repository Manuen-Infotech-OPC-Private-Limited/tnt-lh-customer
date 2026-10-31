import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import frappeFeat from '../assets/frappe_feat.png';

const DEFAULT_BANNERS = [
    {
        id: 'default-1',
        title: "Tnt Frappe",
        subtitle: "SIGNATURE",
        description: "Signature Teas N Trees frappe, cold and refreshing. Our top choice.",
        price: 199,
        bg: frappeFeat,
        accent: "#10b981",
        link: "/menu"
    },
    {
        id: 'default-2',
        title: "Special Masala Nachos",
        subtitle: "BEST SELLER",
        description: "Crispy nachos with special Indian masala toppings and warm melted cheese.",
        price: 249,
        bg: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80&w=1200",
        accent: "#14b8a6",
        link: "/menu"
    }
];

const PromotionBanners = () => {
    const navigate = useNavigate();
    const [banners, setBanners] = useState(DEFAULT_BANNERS);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await api.get('/customer/banners');
                const apiBanners = res.data?.data;
                if (Array.isArray(apiBanners) && apiBanners.length > 0) {
                    const mapped = apiBanners.map(b => ({
                        id: b._id,
                        title: b.title,
                        subtitle: b.subtitle || 'FEATURED',
                        description: b.description || '',
                        price: b.price,
                        bg: b.image,
                        accent: b.accent || '#10b981',
                        link: b.link || '/menu'
                    }));
                    setBanners(mapped);
                }
            } catch (err) {
                // Fallback cleanly to preset banners
                console.warn('Failed to load dynamic banners, using presets', err);
            }
        };

        fetchBanners();
    }, []);

    const next = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);

    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [banners.length]);

    const currentBanner = banners[currentIndex] || banners[0];
    if (!currentBanner) return null;

    return (
        <section className="px-4 pt-0 pb-8">
            <div className="max-w-7xl mx-auto relative group h-[400px] md:h-[500px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentBanner.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, ease: "circOut" }}
                        className="w-full h-full rounded-[40px] overflow-hidden shadow-2xl bg-slate-900 relative"
                    >
                            {/* Background Image with Overlay */}
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${currentBanner.bg})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />

                            {/* Content */}
                            <div className="relative h-full flex flex-col justify-center px-8 md:px-20 max-w-2xl">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full w-fit mb-6 border border-white/20"
                                >
                                    <Sparkles className="w-4 h-4 text-white" />
                                    <span className="text-white font-black text-xs uppercase tracking-[0.2em]">{currentBanner.subtitle}</span>
                                </motion.div>

                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-5xl md:text-7xl font-black text-white mb-4 leading-none tracking-tighter"
                                >
                                    {currentBanner.title}
                                </motion.h2>

                                {currentBanner.description && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-white/80 text-lg md:text-xl mb-8 max-w-md font-medium"
                                    >
                                        {currentBanner.description}
                                    </motion.p>
                                )}

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="flex flex-wrap items-center gap-4"
                                >
                                    <button
                                        onClick={() => navigate(currentBanner.link || '/menu')}
                                        className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-xl active:scale-95 flex items-center gap-3"
                                    >
                                        Check Our Menu <ArrowRight className="w-5 h-5" />
                                    </button>
                                    {currentBanner.price != null && (
                                        <span className="text-white/90 font-bold text-lg bg-black/30 px-5 py-4 rounded-2xl backdrop-blur-sm border border-white/10">
                                            ₹{currentBanner.price}
                                        </span>
                                    )}
                                </motion.div>
                            </div>

                            {/* Slide Indicators */}
                            {banners.length > 1 && (
                                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
                                    {banners.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentIndex(idx)}
                                            className={`h-1.5 rounded-full transition-all duration-500 ${currentIndex === idx ? 'w-10 bg-white' : 'w-2 bg-white/30'}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    {banners.length > 1 && (
                        <>
                            <button
                                onClick={prev}
                                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={next}
                                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}
            </div>
        </section>
    );
};

export default PromotionBanners;
