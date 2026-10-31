import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Copy, Check, Sparkles, Zap } from 'lucide-react';
import { cartService } from '../services/cartService';

const CouponTicker = ({ showFirstOrder = false }) => {
    const [coupons, setCoupons] = useState([]);
    const [current, setCurrent] = useState(0);
    const [copied, setCopied] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const res = await cartService.getAvailableCoupons('teasntrees');
                if (res.success && res.data?.length) {
                    const filtered = res.data.filter(c => showFirstOrder || !c.firstOrderOnly);
                    setCoupons(filtered);
                }
            } catch (err) {
                console.error('Failed to load coupons', err);
            }
        };
        fetchCoupons();
    }, [showFirstOrder]);

    useEffect(() => {
        if (coupons.length <= 1 || isHovered) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % coupons.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [coupons.length, isHovered]);

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!coupons.length) return null;

    const coupon = coupons[current];

    const formatDiscount = (c) => {
        if (c.discountType === 'flat') return `₹${c.discountAmount} OFF`;
        return `${c.discountAmount}% OFF`;
    };

    return (
        <section className="py-10 px-4">
            <div className="max-w-4xl mx-auto relative">
                <motion.div
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="relative bg-white rounded-[1.5rem] overflow-hidden border border-slate-200 shadow-sm"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={coupon.code}
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            transition={{ duration: 0.6, ease: "circOut" }}
                            className="flex flex-col md:flex-row items-center"
                        >
                            <div className="w-full md:w-1/3 bg-gradient-to-br from-emerald-600 to-teal-500 p-8 flex flex-col items-center justify-center text-white relative overflow-hidden">
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 opacity-10 pointer-events-none"
                                >
                                    <Sparkles className="absolute top-0 left-0 w-32 h-32" />
                                    <Sparkles className="absolute bottom-0 right-0 w-32 h-32" />
                                </motion.div>

                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl mb-4">
                                        <Zap className="w-8 h-8 fill-white" />
                                    </div>
                                    <span className="text-4xl font-black tracking-tighter drop-shadow-lg font-sans">
                                        {formatDiscount(coupon)}
                                    </span>
                                    <p className="text-[10px] uppercase tracking-[0.3em] font-black opacity-80 mt-2">Limited Offer</p>
                                </div>
                            </div>

                            <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="text-center md:text-left">
                                    <div className="inline-flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest mb-1">
                                        <Tag className="w-3.5 h-3.5" /> Special Perk
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800">{coupon.description || 'Special Discount on your order'}</h3>
                                    {coupon.minOrderAmount > 0 && (
                                        <p className="text-xs text-slate-400 mt-1">Min. order amount: ₹{coupon.minOrderAmount}</p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleCopy(coupon.code)}
                                        className="flex items-center gap-2 px-5 py-3 rounded-xl border border-dashed border-emerald-500 bg-emerald-50 text-emerald-700 font-mono font-bold text-sm hover:bg-emerald-100 transition-colors"
                                    >
                                        <span>{coupon.code}</span>
                                        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};

export default CouponTicker;
