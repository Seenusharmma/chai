'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, CircleDot } from 'lucide-react';
import { useMenu } from '@/lib/hooks/useMenu';
import { useCategories } from '@/lib/hooks/useCategories';
import { Category } from '@/lib/types';
import { cn } from '@/lib/utils/cn';
import { Header } from '@/components/layout/Header';
import { MenuItem } from '@/components/menu/MenuItem';

export default function MenuPage() {
    const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const router = useRouter();

    const { items, isLoading } = useMenu(
        activeCategory === 'all' ? undefined : activeCategory,
        searchQuery
    );

    const { categories: backendCategories, isLoading: categoriesLoading } = useCategories();

    const categories = useMemo(() => {
        const backendCats = backendCategories.length > 0 ? backendCategories : [];
        
        if (backendCats.length === 0) {
            return [
                { id: 'all' as const, label: 'All', icon: CircleDot },
                { id: 'biriyani' as const, label: 'Biriyani', icon: CircleDot },
                { id: 'chicken' as const, label: 'Chicken', icon: CircleDot },
                { id: 'mutton' as const, label: 'Mutton', icon: CircleDot },
                { id: 'egg' as const, label: 'Egg', icon: CircleDot },
                { id: 'veg' as const, label: 'Veg', icon: CircleDot },
                { id: 'rice' as const, label: 'Rice', icon: CircleDot },
                { id: 'roti' as const, label: 'Roti', icon: CircleDot },
                { id: 'roll' as const, label: 'Roll', icon: CircleDot },
                { id: 'soup' as const, label: 'Soup', icon: CircleDot },
                { id: 'noodles' as const, label: 'Noodles', icon: CircleDot },
                { id: 'bread' as const, label: 'Bread', icon: CircleDot },
                { id: 'sandwich' as const, label: 'Sandwich', icon: CircleDot },
                { id: 'burger' as const, label: 'Burger', icon: CircleDot },
                { id: 'momo' as const, label: 'Momo', icon: CircleDot },
                { id: 'salad' as const, label: 'Salad', icon: CircleDot },
                { id: 'tea' as const, label: 'Tea', icon: CircleDot },
                { id: 'coffee' as const, label: 'Coffee', icon: CircleDot },
                { id: 'mocktails' as const, label: 'Mocktails', icon: CircleDot },
                { id: 'maggie' as const, label: 'Maggie', icon: CircleDot },
            ];
        }
        
        return [
            { id: 'all' as const, label: 'All', icon: CircleDot },
            ...backendCats.map((cat: any) => ({
                id: cat.id || cat,
                label: cat.name || cat.label || cat,
                icon: CircleDot,
            }))
        ];
    }, [backendCategories]);

    return (
        <main className="min-h-screen bg-[#1A1410] pb-24 md:pb-0 font-['Outfit']">
            {/* Desktop Header - Fixed */}
            <div className="hidden md:block fixed top-0 left-0 right-0 z-50">
                <Header />
            </div>

            {/* Desktop Content */}
            <div className="hidden md:block pt-20">
                {/* Hero Section */}
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D4A574]/10 via-transparent to-[#8B6F47]/10" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4A574]/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8B6F47]/5 rounded-full blur-3xl" />
                    
                    <div className="container mx-auto px-6 lg:px-8 py-12 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-2xl"
                        >
                            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                                Our <span className="text-[#D4A574]">Menu</span>
                            </h1>
                            <p className="text-[#A89B8F] text-lg mb-8">
                                Discover our carefully crafted selection of premium coffees, delicious pastries, and mouth-watering treats
                            </p>
                            
                            <div className="relative max-w-xl">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A89B8F]" />
                                <input
                                    type="text"
                                    placeholder="Search for your favorite..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-[#2D2520] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-[#6B6560] focus:outline-none focus:ring-2 focus:ring-[#D4A574]/50 transition-all"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Categories */}
                <div className="container mx-auto px-6 lg:px-8 py-8">
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map((cat, index) => (
                            <motion.button
                                key={cat.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => setActiveCategory(cat.id as Category | 'all')}
                                className={cn(
                                    "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300",
                                    activeCategory === cat.id
                                        ? "bg-[#D4A574] text-[#1A1410] shadow-lg shadow-[#D4A574]/20"
                                        : "bg-[#2D2520] text-[#A89B8F] hover:bg-[#3A3230] hover:text-white border border-white/5"
                                )}
                            >
                                <cat.icon className="w-4 h-4" />
                                {cat.label}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Menu Grid */}
                <div className="container mx-auto px-6 lg:px-8 pb-12">
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-[#A89B8F]">
                            {items.length} {items.length === 1 ? 'item' : 'items'} available
                        </p>
                    </div>
                    
                    {isLoading ? (
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="h-[380px] rounded-3xl bg-[#2D2520] animate-pulse" />
                            ))}
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 rounded-full bg-[#2D2520] flex items-center justify-center mx-auto mb-4">
                                <Search className="w-10 h-10 text-[#A89B8F]" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No items found</h3>
                            <p className="text-[#A89B8F]">Try adjusting your search or category</p>
                        </div>
                    ) : (
                        <motion.div 
                            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            layout
                        >
                            <AnimatePresence mode="popLayout">
                                {items.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        layout
                                    >
                                        <MenuItem item={item} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Mobile Header */}
            <div className="sticky top-0 z-50 bg-[#1A1410]/95 backdrop-blur-xl px-4 py-4 md:hidden">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 rounded-full bg-[#2D2520] flex items-center justify-center text-white hover:bg-[#3A3230] transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl font-bold text-white">Our Menu</h1>
                    <button
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                            isSearchOpen ? "bg-[#D4A574] text-white" : "bg-[#2D2520] text-white hover:bg-[#3A3230]"
                        )}
                    >
                        <Search className="w-5 h-5" />
                    </button>
                </div>

                <div className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isSearchOpen ? "max-h-16 mb-4" : "max-h-0"
                )}>
                    <input
                        type="text"
                        placeholder="Search coffee, food..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#2D2520] border-none rounded-2xl py-3 px-4 text-white placeholder:text-[#8E8680] focus:outline-none focus:ring-1 focus:ring-[#D4A574]"
                        autoFocus={isSearchOpen}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id as Category | 'all')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                                activeCategory === cat.id
                                    ? "bg-[#D4A574] text-[#1A1410]"
                                    : "bg-[#2D2520] text-[#A89B8F] hover:text-white"
                            )}
                        >
                            <cat.icon className="w-4 h-4" />
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mobile Menu Grid */}
            <div className="md:hidden container mx-auto">
                <div className="grid grid-cols-2 gap-2 px-2">
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            <MenuItem item={item} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}
