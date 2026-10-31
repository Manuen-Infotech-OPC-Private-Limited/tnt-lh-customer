import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Coffee, Truck, Heart, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import HeroImage from '../assets/TTNoName.png';
import CouponTicker from '../components/CouponTicker';
import RatingNudge from '../components/RatingNudge';
import PromotionBanners from '../components/PromotionBanners';

const CopyButton = ({ code, accentColor = "#059669" }) => {
    const [copied, setCopied] = React.useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(code).catch(() => { });
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleCopy}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-xs font-black transition-all shadow-lg"
            style={{ background: accentColor }}
        >
            {copied ? (
                <><Check className="w-4 h-4" /> Copied!</>
            ) : (
                <><Copy className="w-4 h-4" /> Copy Code</>
            )}
        </motion.button>
    );
};

const HomePage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [showNudge, setShowNudge] = useState(true);
    const [statusData, setStatusData] = useState(null);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const data = await userService.getStatus('teasntrees');
                setStatusData(data);
                setShowNudge(data.showWelcomeBanner);
            } catch (err) {
                console.error("Failed to fetch user status", err);
            }
        };
        fetchStatus();
    }, [isAuthenticated]);

    return (
        <div className="min-h-screen">
            {/* HERO SECTION */}
            <section className="relative pt-32 pb-8 lg:pt-36 lg:pb-10 overflow-hidden">
                {/* Floating Leaves Background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: [0.4, 0.8, 0.4], y: [0, 100], x: [0, 50] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute top-20 left-[10%] text-4xl text-green-300 opacity-60"
                    >🍃</motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: [0.3, 0.6, 0.3], y: [0, 150], x: [0, -30] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 2 }}
                        className="absolute top-40 right-[20%] text-2xl text-green-400 opacity-50"
                    >🍃</motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: [0.5, 0.9, 0.5], y: [0, 80], x: [0, 20] }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 5 }}
                        className="absolute top-10 left-[40%] text-sm text-green-200 opacity-70"
                    >🍃</motion.div>
                </div>

                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="space-y-8 z-10"
                        >
                            <div className="flex flex-col items-start gap-4">
                                <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] text-slate-900">
                                    Welcome to <span className="text-cafe-emerald">Teas N Trees</span>
                                </h1>
                            </div>

                            <p className="text-xl lg:text-2xl text-slate-600 max-w-xl font-medium leading-relaxed">
                                Where nature meets your perfect cup. Authentic Assam teas, artisan coffee, and nature-inspired vibes in Guntur's finest garden sanctuary.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/menu')}
                                    className="px-8 py-4 bg-gradient-to-r from-cafe-emerald to-cafe-teal text-white rounded-2xl font-bold shadow-lg shadow-cafe-emerald/30 hover:shadow-xl transition-all flex items-center gap-2 group text-lg"
                                >
                                    Order Now
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/about')}
                                    className="px-8 py-4 bg-white/80 hover:bg-white text-slate-700 rounded-2xl font-bold border border-slate-200 shadow-sm transition-all text-lg"
                                >
                                    Our Story
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Hero Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative flex justify-center items-center"
                        >
                            <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
                                <motion.div
                                    animate={{ y: [-10, 10, -10] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-full h-full flex items-center justify-center"
                                >
                                    <img
                                        src={HeroImage}
                                        alt="Teas N Trees Cup"
                                        className="w-4/5 h-4/5 object-contain drop-shadow-2xl"
                                    />
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* PROMOTION BANNERS */}
            <PromotionBanners />

            {/* COUPON TICKER */}
            <CouponTicker brand="teasntrees" showFirstOrder={showNudge} />

            {/* WHY CHOOSE US SECTION */}
            <section className="py-20 bg-white relative overflow-hidden">
                <div className="container mx-auto px-4 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose Teas N Trees?</h2>
                        <div className="w-20 h-1.5 bg-gradient-to-r from-cafe-emerald to-cafe-teal rounded-full mx-auto mb-6" />
                        <p className="text-lg text-slate-600">Experience the difference in every cup</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100/50 shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="text-5xl mb-6">🌱</div>
                            <h3 className="text-xl font-bold mb-3 text-slate-800">Sustainable Sourcing</h3>
                            <p className="text-slate-600 leading-relaxed">Fair trade and organic tea and coffee estates from Assam and Coorg</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100/50 shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="text-5xl mb-6">👨‍🍳</div>
                            <h3 className="text-xl font-bold mb-3 text-slate-800">Expert Craftsmanship</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Skilled baristas and tea masters creating perfect authentic beverages
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            className="text-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-100/50 shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="text-5xl mb-6">🍃</div>
                            <h3 className="text-xl font-bold mb-3 text-slate-800">Garden Sanctuary</h3>
                            <p className="text-slate-600 leading-relaxed">Comfortable lush green spaces perfect for dining, work, and relaxation</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            className="text-center bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 border border-amber-100/50 shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="text-5xl mb-6">⚡</div>
                            <h3 className="text-xl font-bold mb-3 text-slate-800">Fresh Daily</h3>
                            <p className="text-slate-600 leading-relaxed">Everything prepared fresh to order with the purest ingredients</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* STATS SECTION */}
            <section className="py-12 bg-slate-50/50">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Star, label: "4.3 Rating", sub: "Trusted by Locals", color: "text-yellow-500" },
                            { icon: Coffee, label: "50+ Varieties", sub: "Tea & Coffee", color: "text-cafe-emerald" },
                            { icon: Truck, label: "30min Delivery", sub: "Fast Delivery", color: "text-cafe-teal" },
                            { icon: Heart, label: "Pure Hygiene", sub: "100% Sanitized", color: "text-red-500" },
                        ].map((stat, idx) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    className="glass-card p-6 flex items-center gap-4 group cursor-default bg-white rounded-2xl"
                                >
                                    <div className={cn("w-12 h-12 rounded-2xl bg-slate-50 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform", stat.color)}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800">{stat.label}</h3>
                                        <p className="text-sm text-slate-500">{stat.sub}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* RATING NUDGE */}
            {statusData?.lastOrderRatingPending && (
                <RatingNudge
                    orderId={statusData.lastOrderRatingPending}
                    brand="teasntrees"
                />
            )}
        </div>
    );
};

export default HomePage;
