'use client';

import { motion } from 'framer-motion';
import { MenuItem as MenuItemType } from '@/lib/types';
import { MenuItem } from './MenuItem';

interface MenuGridProps {
    items: MenuItemType[];
    isLoading?: boolean;
}

export function MenuGrid({ items, isLoading }: MenuGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-[400px] rounded-3xl bg-[#2D2520] animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2">
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
    );
}
