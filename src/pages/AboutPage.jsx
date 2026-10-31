import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Coffee, Users, Heart, Sun, UserCheck, Truck, ShoppingBag, Utensils, Wifi, Moon, CreditCard, Car, Baby } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="min-h-screen pt-24 pb-20 bg-slate-50">
            {/* Hero Section */}
            <div className="container mx-auto px-4 lg:px-8 mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative rounded-3xl overflow-hidden h-[400px] md:h-[500px] shadow-2xl"
                >
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-block px-4 py-1.5 rounded-full bg-cafe-emerald/20 border-cafe-emerald/30 text-emerald-300 border backdrop-blur-md font-bold text-sm mb-4"
                        >
                            Since 2023
                        </motion.span>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                            Brewing Memories,<br /> One Cup at a Time.
                        </h1>
                        <p className="text-lg md:text-xl text-slate-200 max-w-2xl">
                            Where nature meets your perfect cup - discover our story, services, and what makes our garden sanctuary special.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Our Story */}
            <div className="container mx-auto px-4 lg:px-8 mb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl font-bold text-slate-800">Our Story</h2>
                        <div className="w-20 h-1.5 bg-gradient-to-r from-cafe-emerald to-cafe-teal rounded-full" />
                        <p className="text-slate-600 leading-relaxed text-lg">
                            Teas N Trees began with a simple idea: to create a sanctuary where people can pause, reflect, and enjoy the finest teas and coffees amidst the hustle of city life.
                        </p>
                        <p className="text-slate-600 leading-relaxed text-lg">
                            We believe in Little Happiness. It's found in the aroma of freshly brewed chai, the crunch of a warm bite, and the warmth of a friendly smile in our lush garden cafe.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative rounded-3xl overflow-hidden shadow-xl aspect-video md:aspect-square"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1000"
                            alt="Cafe Interior"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </div>
            </div>

            {/* Core Values */}
            <div className="bg-white py-20 mb-20 border-y border-slate-100">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Values</h2>
                        <div className="w-20 h-1.5 bg-gradient-to-r from-cafe-emerald to-cafe-teal rounded-full mx-auto mb-6" />
                        <p className="text-slate-600">The guiding principles behind every beverage we brew and every plate we serve.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { icon: Leaf, title: "Nature First", desc: "100% natural ingredients sourced responsibly from regional estates." },
                            { icon: Coffee, title: "Artisan Craft", desc: "Every cup brewed with precision, passion, and single-origin care." },
                            { icon: Users, title: "Community", desc: "A welcoming, inclusive space for everyone to connect and relax." },
                            { icon: Heart, title: "Pure Quality", desc: "No artificial flavors, preservatives, or shortcuts in our kitchen." }
                        ].map((v, i) => {
                            const Icon = v.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-8 rounded-2xl bg-slate-50 text-center hover:shadow-lg transition-all"
                                >
                                    <div className="w-14 h-14 bg-emerald-100 text-cafe-emerald rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <Icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-3">{v.title}</h3>
                                    <p className="text-slate-500 leading-relaxed text-sm">{v.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Amenities Section */}
            <div className="container mx-auto px-4 lg:px-8 mb-20">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-slate-800 mb-4">Cafe Amenities</h2>
                    <div className="w-20 h-1.5 bg-gradient-to-r from-cafe-emerald to-cafe-teal rounded-full mx-auto mb-6" />
                    <p className="text-slate-600">Designed for your comfort, convenience, and complete relaxation.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { icon: Wifi, title: "High-Speed WiFi", desc: "Fast fiber internet for work and browsing" },
                        { icon: Sun, title: "Garden Seating", desc: "Lush outdoor green courtyard" },
                        { icon: Car, title: "Ample Parking", desc: "Dedicated parking space for your vehicle" },
                        { icon: CreditCard, title: "Contactless Pay", desc: "UPI, Cards, and Digital Wallet support" }
                    ].map((amenity, i) => {
                        const Icon = amenity.icon;
                        return (
                            <div key={i} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-cafe-emerald flex items-center justify-center shrink-0">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">{amenity.title}</h4>
                                    <p className="text-xs text-slate-400 mt-0.5">{amenity.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
