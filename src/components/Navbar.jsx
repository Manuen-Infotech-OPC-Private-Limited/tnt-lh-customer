import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Menu, X, Coffee, Users, ZoomIn, Star, Phone, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';
import Logo from '../assets/logoteasntrees-removebg-preview.png';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { cartCount, toggleCart } = useCart();
    const { wishlistItems } = useWishlist();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const prefetchMenu = () => {
        queryClient.prefetchQuery({
            queryKey: ['categories', 'teasntrees'],
            queryFn: () => productService.getCategories('teasntrees'),
            staleTime: 1000 * 60 * 5,
        });

        queryClient.prefetchQuery({
            queryKey: ['products', 'all', '', '', 'teasntrees'],
            queryFn: () => productService.getAllProducts({
                category: 'all',
                q: '',
                search: '',
                brand: 'teasntrees'
            }),
            staleTime: 1000 * 60 * 5,
        });
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b glass-nav border-transparent">
            <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsOpen(false)}>
                        <img
                            src={Logo}
                            alt="Teas N Trees"
                            className="w-auto object-contain transition-transform group-hover:scale-105 duration-300 h-10 md:h-14"
                        />
                    </Link>
                </div>

                {/* Center Spacer */}
                <div className="hidden lg:flex flex-1" />

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center gap-6">
                    <Link 
                        to="/menu" 
                        onMouseEnter={prefetchMenu}
                        className="text-sm font-medium text-slate-700 hover:text-cafe-emerald transition-colors"
                    >
                        Menu
                    </Link>
                    <Link 
                        to="/seasonal" 
                        className="text-sm font-medium text-slate-700 hover:text-cafe-emerald transition-colors animate-pulse-slow flex items-center gap-1.5"
                    >
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        Seasonal
                    </Link>
                    <Link to="/about" className="text-sm font-medium text-slate-700 hover:text-cafe-emerald transition-colors">About</Link>
                    <Link to="/gallery" className="text-sm font-medium text-slate-700 hover:text-cafe-emerald transition-colors">Gallery</Link>
                    <Link to="/reviews" className="text-sm font-medium text-slate-700 hover:text-cafe-emerald transition-colors">Reviews</Link>
                    <Link to="/contact" className="text-sm font-medium text-slate-700 hover:text-cafe-emerald transition-colors">Contact</Link>

                    <Link to="/wishlist" className="relative group">
                        <div className={cn(
                            "absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md transition-transform",
                            wishlistItems.length > 0 ? "scale-100" : "scale-0"
                        )}>
                            {wishlistItems.length}
                        </div>
                        <Heart className="w-6 h-6 text-slate-600 group-hover:text-red-500 transition-colors" />
                    </Link>

                    <button onClick={toggleCart} className="relative group">
                        <div className={cn(
                            "absolute -top-2 -right-2 bg-cafe-orange text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md transition-transform",
                            cartCount > 0 ? "scale-100" : "scale-0"
                        )}>
                            {cartCount}
                        </div>
                        <ShoppingCart className="w-6 h-6 text-slate-600 group-hover:text-cafe-emerald transition-colors" />
                    </button>

                    <Link to="/profile" className="flex items-center gap-2 pl-4 border-l border-slate-200">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cafe-emerald to-cafe-teal p-[2px]">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                <User className="w-5 h-5 text-cafe-emerald" />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden p-2 rounded-full hover:bg-slate-100 transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="w-6 h-6 text-slate-700" /> : <Menu className="w-6 h-6 text-slate-700" />}
                </button>
            </div>

            {/* MOBILE MENU */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden overflow-hidden border-t bg-white/95 backdrop-blur-xl border-slate-100"
                    >
                        <div className="p-6 flex flex-col gap-4">
                            <Link 
                                to="/menu" 
                                onMouseEnter={prefetchMenu}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-800" 
                                onClick={() => setIsOpen(false)}
                            >
                                <Coffee className="w-5 h-5 text-cafe-emerald" />
                                <span className="font-medium">Menu</span>
                            </Link>
                            <Link 
                                to="/seasonal" 
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-800" 
                                onClick={() => setIsOpen(false)}
                            >
                                <Sparkles className="w-5 h-5 text-amber-500" />
                                <span className="font-medium">Seasonal</span>
                            </Link>
                            <Link to="/about" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-800" onClick={() => setIsOpen(false)}>
                                <Users className="w-5 h-5 text-blue-500" />
                                <span className="font-medium">About Us</span>
                            </Link>
                            <Link to="/gallery" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all text-slate-800" onClick={() => setIsOpen(false)}>
                                <ZoomIn className="w-6 h-6 text-purple-500" />
                                <span className="font-semibold text-base">Gallery</span>
                            </Link>
                            <Link to="/reviews" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all text-slate-800" onClick={() => setIsOpen(false)}>
                                <Star className="w-6 h-6 text-yellow-500" />
                                <span className="font-semibold text-base">Reviews</span>
                            </Link>
                            <Link to="/contact" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all text-slate-800" onClick={() => setIsOpen(false)}>
                                <Phone className="w-6 h-6 text-green-500" />
                                <span className="font-semibold text-base">Contact</span>
                            </Link>
                            <Link to="/wishlist" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all text-slate-800" onClick={() => setIsOpen(false)}>
                                <Heart className="w-6 h-6 text-red-500" />
                                <span className="font-semibold text-base">Wishlist ({wishlistItems.length})</span>
                            </Link>
                            <button
                                type="button"
                                onClick={() => { setIsOpen(false); toggleCart(); }}
                                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all group w-full text-left text-slate-800"
                            >
                                <ShoppingCart className="w-6 h-6 text-cafe-orange" />
                                <span className="font-semibold text-base">Cart ({cartCount})</span>
                            </button>
                            <Link to="/profile" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all text-slate-800" onClick={() => setIsOpen(false)}>
                                <User className="w-6 h-6 text-cafe-teal" />
                                <span className="font-semibold text-base">Profile</span>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
