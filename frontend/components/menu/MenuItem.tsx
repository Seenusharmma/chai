'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, CircleDot } from 'lucide-react';
import { MenuItem as MenuItemType } from '@/lib/types';
import { Card } from '../ui/Card';
import { AddToCartButton } from '../cart/AddToCartButton';

interface MenuItemProps {
    item: MenuItemType;
}

export function MenuItem({ item }: MenuItemProps) {
    return (
        <div className="flex flex-col gap-3">
            {/* Image Container */}
            <div className="relative aspect-[4/5] w-full rounded-[30px] overflow-hidden bg-[#2A2420]">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                />

                {/* Veg/Non-Veg Badge */}
                <div className="absolute top-3 left-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        item.isVeg 
                            ? 'bg-green-500/90' 
                            : 'bg-red-500/90'
                    }`}>
                        <CircleDot className="w-3 h-3 text-white" />
                    </div>
                </div>

                {/* Plus Button Overlay */}
                <div className="absolute bottom-3 right-3">
                    <AddToCartButton
                        item={item}
                        size="sm"
                        className="!w-10 !h-10 !rounded-full !bg-[#8B5E3C] hover:!bg-[#6F4E37] shadow-lg"
                    />
                </div>
            </div>

            {/* Details */}
            <div className="px-1">
                <h3 className="text-white font-bold text-base mb-1 truncate">{item.name}</h3>
                <p className="text-[#8E8680] text-xs line-clamp-2 mb-2 leading-tight min-h-[2.5em]">
                    {item.description}
                </p>
                <p className="text-[#D4A574] font-bold text-sm">₹{item.price.toFixed(2)}</p>
            </div>
        </div>
    );
}
