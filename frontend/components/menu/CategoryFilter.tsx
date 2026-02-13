'use client';

import { motion } from 'framer-motion';
import { Coffee, CupSoda, Croissant, Sandwich, IceCream, Egg } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Category } from '@/lib/types';

interface CategoryFilterProps {
    activeCategory: Category | 'all';
    onSelect: (category: Category | 'all') => void;
}

const categories = [
    { id: 'all', label: 'All', icon: Coffee }, // Using Coffee as default icon for All
    { id: 'coffee', label: 'Coffee', icon: Coffee },
    { id: 'tea', label: 'Tea', icon: CupSoda },
    { id: 'pastry', label: 'Pastry', icon: Croissant },
    { id: 'sandwich', label: 'Food', icon: Sandwich },
    { id: 'dessert', label: 'Dessert', icon: IceCream },
    { id: 'breakfast', label: 'Breakfast', icon: Egg },
] as const;

export function CategoryFilter({ activeCategory, onSelect }: CategoryFilterProps) {
    return (
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-2">
            {categories.map((category) => {
                const isActive = activeCategory === category.id;

                return (
                    <button
                        key={category.id}
                        onClick={() => onSelect(category.id as Category | 'all')}
                        className={cn(
                            'whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-all',
                            isActive
                                ? 'bg-[#8B5E3C] text-white'
                                : 'bg-[#2A2420] text-[#8E8680] hover:bg-[#3A3230]'
                        )}
                    >
                        {category.label}
                    </button>
                );
            })}
        </div>
    );
}
