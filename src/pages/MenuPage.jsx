import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSocket } from '../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, XCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import CategoryTabs from '../components/CategoryTabs';
import MenuCard from '../components/MenuCard';
import { productService } from '../services/productService';

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

const MenuPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const queryQ = searchParams.get('q') || '';
    const querySearch = searchParams.get('search') || '';

    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState(querySearch);
    const debouncedSearch = useDebounce(searchTerm, 500);

    useEffect(() => {
        if (queryQ) {
            setSearchTerm('');
            setActiveCategory('all');
            if (searchParams.has('search')) {
                const newParams = Object.fromEntries(searchParams);
                delete newParams.search;
                setSearchParams(newParams);
            }
        }
    }, [queryQ]);

    useEffect(() => {
        const urlSearch = searchParams.get('search') || '';
        if (debouncedSearch !== urlSearch) {
            const newParams = Object.fromEntries(searchParams);
            if (debouncedSearch) {
                newParams.search = debouncedSearch;
                delete newParams.q;
            } else {
                delete newParams.search;
            }
            setSearchParams(newParams);
        }
    }, [debouncedSearch]);

    useEffect(() => {
        if (querySearch !== searchTerm && !queryQ) {
            setSearchTerm(querySearch);
        }
    }, [querySearch, queryQ]);

    // Fetch Categories for Teas N Trees
    const { data: rawCategories } = useQuery({
        queryKey: ['categories', 'teasntrees'],
        queryFn: () => productService.getCategories('teasntrees'),
    });

    const categories = [
        { id: 'all', name: 'All' },
        ...(rawCategories || [])
    ];

    // Fetch Products for Teas N Trees
    const { data: products, isLoading, isError } = useQuery({
        queryKey: ['products', activeCategory, queryQ, querySearch, 'teasntrees'],
        queryFn: () => {
            return productService.getAllProducts({
                category: activeCategory,
                q: queryQ,
                search: querySearch,
                brand: 'teasntrees'
            });
        },
    });

    // Real-time updates
    const queryClient = useQueryClient();
    const { socket } = useSocket();
    useEffect(() => {
        if (!socket) return;
        const handleUpdate = () => queryClient.invalidateQueries({ queryKey: ['products'] });
        const events = ['product:created', 'product:updated', 'product:deleted'];
        events.forEach(e => socket.on(e, handleUpdate));
        return () => events.forEach(e => socket.off(e, handleUpdate));
    }, [socket, queryClient]);

    const displayProducts = products || [];

    const clearAll = () => {
        setSearchTerm('');
        setSearchParams({});
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            <div className="h-20" />

            <CategoryTabs
                categories={categories}
                activeCategory={activeCategory}
                onSelect={(cat) => setActiveCategory(cat)}
            />

            <div className="container mx-auto px-4 lg:px-8 py-8">
                {/* Search Feedback Header */}
                {(queryQ || querySearch) && (
                    <div className="mb-6 flex flex-wrap items-center gap-3">
                        {queryQ && (
                            <div className="bg-emerald-50 text-cafe-emerald px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium border border-emerald-200">
                                Global: "{queryQ}"
                                <button onClick={() => setSearchParams({})} className="hover:text-red-500 transition-colors">
                                    <XCircle className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        {querySearch && (
                            <div className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium border border-blue-100">
                                Filtering: "{querySearch}"
                                <button onClick={() => setSearchTerm('')} className="hover:text-red-500 transition-colors">
                                    <XCircle className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Subcategory & Search Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <h2 className="text-2xl font-bold text-slate-800 self-start md:self-center">
                        {activeCategory === 'all' ? 'All Specials' : 'Selected Category'}
                    </h2>

                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Filter current view..."
                            className="w-full bg-white border border-slate-200 rounded-full py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:border-cafe-emerald focus:ring-2 focus:ring-cafe-emerald/20 transition-all shadow-sm"
                        />
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />

                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <XCircle className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {isLoading && (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 text-cafe-emerald animate-spin" />
                    </div>
                )}

                {!isLoading && isError && (
                    <div className="text-center py-12 text-slate-500">
                        Failed to load menu items. Please try refreshing.
                    </div>
                )}

                {/* Products Grid */}
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence mode="popLayout">
                    {displayProducts.map((product) => (
                        <MenuCard key={product._id} product={product} />
                    ))}
                    </AnimatePresence>
                </motion.div>

                {displayProducts.length === 0 && !isLoading && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 max-w-md mx-auto">
                        <div className="text-4xl mb-3">🍃</div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">No items found</h3>
                        <p className="text-slate-500 text-sm mb-6">
                            {(queryQ || querySearch) ? "Try a different search keyword." : "There are no products in this category currently."}
                        </p>
                        <button
                            onClick={clearAll}
                            className="px-6 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-full hover:bg-slate-200 transition-colors"
                        >
                            View All Items
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuPage;
