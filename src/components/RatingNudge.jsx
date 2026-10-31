import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, MessageSquareHeart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RatingNudge = ({ orderId }) => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible || !orderId) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed bottom-6 right-6 z-50 max-w-sm w-full"
            >
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 relative overflow-hidden group">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full opacity-10 bg-emerald-500 group-hover:scale-110 transition-transform duration-700" />
                    
                    <button 
                        onClick={() => setIsVisible(false)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex gap-4">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-emerald-50 text-emerald-600">
                            <MessageSquareHeart className="w-8 h-8" />
                        </div>
                        
                        <div className="flex-1">
                            <h4 className="text-lg font-bold text-slate-800 mb-1">
                                Enjoyed your visit?
                            </h4>
                            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                                Your feedback helps us serve you better. Rate your recent order!
                            </p>

                            <div className="flex items-center gap-2 mb-6">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <motion.button
                                        key={s}
                                        whileHover={{ scale: 1.2, rotate: 10 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => navigate(`/track-order/${orderId}`)}
                                        className="text-yellow-400"
                                    >
                                        <Star className="w-6 h-6 fill-yellow-400" />
                                    </motion.button>
                                ))}
                            </div>

                            <button
                                onClick={() => navigate(`/track-order/${orderId}`)}
                                className="w-full py-3 rounded-xl text-white font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95 bg-emerald-600 hover:bg-emerald-700"
                            >
                                Share Feedback <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default RatingNudge;
