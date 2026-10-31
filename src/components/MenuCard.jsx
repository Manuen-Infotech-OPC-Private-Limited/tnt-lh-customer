import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Plus, Heart } from 'lucide-react';
import { cn } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import CustomizationModal from './CustomizationModal';

const MenuCard = ({ product }) => {
    const { addToCart } = useCart();
    const { toggleWishlist: toggleWishlistContext, isInWishlist } = useWishlist();

    const isWishlisted = isInWishlist(product._id);

    // Size Selection State
    const [selectedSize, setSelectedSize] = useState(() => {
        if (product.sizeOptions?.length > 0) {
            return product.sizeOptions[0];
        }
        return null;
    });

    const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);

    // Pricing Logic
    const getDisplayPrice = () => {
        if (selectedSize) return selectedSize.price;
        if (product.displayPrice) return product.displayPrice;
        if (product.price !== undefined && product.price !== null) return product.price;

        if (product.sizeOptions?.length > 0) {
            return Math.min(...product.sizeOptions.map(o => o.price));
        }
        return 0;
    };
    const price = getDisplayPrice();

    const imageUrl = product.image || null;
    const [imageError, setImageError] = useState(false);

    const getTagColor = (tag) => {
        const t = tag.toLowerCase();
        if (t.includes('best') || t.includes('seller')) return "bg-gradient-to-r from-amber-400 to-orange-500 text-white border-transparent";
        if (t.includes('egg') || t.includes('contains')) return "bg-yellow-100 text-yellow-800 border-yellow-200";
        if (t.includes('must') || t.includes('try')) return "bg-rose-100 text-rose-700 border-rose-200";
        if (t.includes('new') || t.includes('intro')) return "bg-purple-100 text-purple-700 border-purple-200";
        if (t.includes('seasonal')) return "bg-emerald-500 text-white border-transparent";
        if (t.includes('spicy') || t.includes('hot')) return "bg-red-100 text-red-700 border-red-200";
        if (t.includes('veg') || t.includes('green')) return "bg-emerald-100 text-emerald-700 border-emerald-200";
        return "bg-white/90 backdrop-blur-md text-slate-700 border-slate-100";
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (product.variants?.length > 0) {
            setIsCustomizationOpen(true);
            return;
        }

        addToCart(product, 1, selectedSize ? { size: selectedSize.size, price: selectedSize.price } : null, []);
    };

    const handleCustomizationConfirm = (selectedAddons) => {
        addToCart(product, 1, selectedSize ? { size: selectedSize.size, price: selectedSize.price } : null, selectedAddons);
    };

    const handleToggleWishlist = (e) => {
        e.stopPropagation();
        toggleWishlistContext(product);
    };

    const handleSizeSelect = (e, sizeObj) => {
        e.stopPropagation();
        setSelectedSize(sizeObj);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="group relative cursor-pointer h-auto min-h-[450px]" whileHover="hover">
            <div className="relative h-full transition-transform duration-500 ease-out group-hover:-translate-y-1">
                <div className="glass-card h-full flex flex-col overflow-hidden relative border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white/90 to-white/50 rounded-3xl">
                    <div className="relative h-56 min-h-[14rem] overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
                        {imageUrl && !imageError ? (
                            <img src={imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={() => setImageError(true)} />
                        ) : (
                            <div className="text-slate-300 text-sm font-medium">No Image</div>
                        )}
                        <button onClick={handleToggleWishlist} className={cn("absolute top-3 right-3 p-2 rounded-full transition-all duration-200 shadow-sm z-20", isWishlisted ? "bg-rose-500 text-white" : "bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white")}>
                            <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
                        </button>
                        {(product.averageRating > 0) && (
                            <div className="absolute top-3 left-3 bg-white px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-black shadow-xl z-30 border border-slate-100 text-slate-800">
                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                {product.averageRating.toFixed(1)}
                            </div>
                        )}
                        {(product.tags?.length > 0 || product.isSeasonal) && (
                            <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 max-w-[75%] z-10 items-start">
                                {product.isSeasonal && (
                                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold shadow-sm border uppercase tracking-wider bg-emerald-500 text-white border-transparent">Seasonal</span>
                                )}
                                {product.tags?.map(tag => (
                                    <span key={tag} className={cn("px-2 py-0.5 rounded-lg text-[10px] font-bold shadow-sm border uppercase tracking-wider", getTagColor(tag))}>{tag.replace(/-/g, ' ')}</span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="p-5 flex flex-col flex-1 relative z-10">
                        <div className="flex-1 flex flex-col">
                            <div className="text-[10px] font-bold uppercase tracking-wider mb-1 w-fit px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">{product.category?.name || 'Cafe Specialty'}</div>
                            <h3 className="font-bold text-xl text-slate-800 leading-tight mb-2 group-hover:text-emerald-700 transition-colors">{product.name}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">{product.description}</p>
                            {product.sizeOptions?.length > 0 && (
                                <div className="mt-auto pt-2 border-t border-dashed border-slate-200">
                                    <div className="text-[10px] text-slate-400 font-semibold uppercase mb-1">Select Size</div>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizeOptions.map(o => (
                                            <button key={o.size} onClick={(e) => handleSizeSelect(e, o)} className={cn("text-[10px] px-2 py-1 rounded border transition-all duration-200", selectedSize?.size === o.size ? "bg-slate-800 text-white border-slate-800 shadow-md transform scale-105" : "bg-slate-50 text-slate-600 border-slate-200 hover:border-emerald-500 hover:text-emerald-700")}>{o.size}</button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                            <div>
                                <span className="text-xl font-black text-slate-900">₹{price}</span>
                                {product.sizeOptions?.length > 0 && !selectedSize && <span className="text-xs text-slate-500 ml-1">starts from</span>}
                            </div>
                            <button onClick={handleAddToCart} className="relative overflow-hidden group/btn bg-slate-900 text-white rounded-xl px-4 py-2.5 flex items-center gap-2 font-semibold shadow-xl shadow-slate-200 transition-transform active:scale-95 shrink-0">
                                <span className="relative z-10 flex items-center gap-1.5 transition-colors group-hover/btn:text-white"><Plus className="w-4 h-4" /> Add</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 translate-y-[101%] group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <CustomizationModal
                isOpen={isCustomizationOpen}
                onClose={() => setIsCustomizationOpen(false)}
                product={product}
                onConfirm={handleCustomizationConfirm}
            />
        </motion.div>
    );
};

export default MenuCard;
