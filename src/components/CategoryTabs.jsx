import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { Coffee } from 'lucide-react';

const CategoryTabs = ({ categories, activeCategory, onSelect }) => {
    return (
        <div className="w-full border-b z-40 sticky top-20 border-black/5 bg-white/60 backdrop-blur-md">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center gap-3 overflow-x-auto py-4 no-scrollbar">
                    {categories.map((cat) => {
                        const categoryId = cat._id || cat.id;
                        const isActive = activeCategory === categoryId;

                        return (
                            <button
                                key={categoryId}
                                onClick={() => onSelect(categoryId)}
                                className={cn(
                                    "relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2",
                                    isActive
                                        ? "text-white shadow-lg shadow-emerald-500/25 scale-105"
                                        : "text-slate-600 hover:bg-white/80 hover:text-emerald-700"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full -z-10"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                                {cat.name === 'All' && <Coffee className="w-4 h-4" />}
                                {cat.name}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CategoryTabs;
