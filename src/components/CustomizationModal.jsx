import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { cn } from '../lib/utils';

const CustomizationModal = ({ isOpen, onClose, product, onConfirm }) => {
    const [selectedAddons, setSelectedAddons] = useState([]);

    if (!product) return null;

    const addons = product.variants || [];
    const basePrice = product.displayPrice || product.price || 0;
    
    const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    const totalPrice = basePrice + addonsTotal;

    const toggleAddon = (addon) => {
        setSelectedAddons(prev => {
            const exists = prev.find(a => a.name === addon.name);
            if (exists) {
                return prev.filter(a => a.name !== addon.name);
            }
            return [...prev, addon];
        });
    };

    const handleConfirm = () => {
        onConfirm(selectedAddons);
        onClose();
        setSelectedAddons([]);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    {/* Soft Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />

                    {/* Compact Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 400 }}
                        className="relative w-full max-w-[360px] shadow-2xl overflow-hidden flex flex-col bg-white rounded-3xl"
                    >
                        {/* Compact Header */}
                        <div className="p-5 pb-3 flex justify-between items-start border-b border-slate-100">
                            <div className="space-y-0.5">
                                <h3 className="text-lg font-black text-slate-800">
                                    Add Extras
                                </h3>
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                                    {product.name}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* List */}
                        <div className="px-5 py-4 max-h-[300px] overflow-y-auto space-y-2">
                            {addons.map((addon) => {
                                const isSelected = selectedAddons.find(a => a.name === addon.name);
                                return (
                                    <motion.div
                                        key={addon.name}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => toggleAddon(addon)}
                                        className={cn(
                                            "flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all duration-200 border-2",
                                            isSelected
                                                ? "bg-emerald-50 border-emerald-500 shadow-sm"
                                                : "bg-slate-50 border-transparent hover:border-slate-200"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-colors",
                                                isSelected ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300"
                                            )}>
                                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">{addon.name}</span>
                                        </div>
                                        <span className="text-sm font-black text-slate-800">+₹{addon.price}</span>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <span className="text-[10px] text-slate-400 uppercase font-black block">Total</span>
                                <span className="text-xl font-black text-slate-900">₹{totalPrice}</span>
                            </div>
                            <button
                                onClick={handleConfirm}
                                className="px-6 py-3 rounded-2xl font-black text-sm bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20 active:scale-95"
                            >
                                Add to Order
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CustomizationModal;
