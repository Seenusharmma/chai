'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/lib/types';
import { Button } from '../ui/Button';
import { useCart } from '@/lib/hooks/CartContext';

interface CartItemProps {
    item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
    const { updateQuantity, removeItem } = useCart();

    return (
        <div className="flex items-center gap-4 py-4 bg-[#2D2520] rounded-2xl p-3 mb-3">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#1A1410] shrink-0">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                />
            </div>

            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white text-sm truncate">{item.name}</h4>
                <p className="text-xs text-[#8E8680] truncate mb-1">{item.description}</p>
                <p className="font-bold text-[#D4A574] text-sm">₹{item.price.toFixed(2)}</p>
            </div>

            <div className="flex items-center bg-[#1A1410] rounded-full px-2 py-1 gap-3 border border-[#3A3230]">
                <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-6 h-6 flex items-center justify-center text-[#8E8680] hover:text-white transition-colors"
                >
                    <Minus className="w-3 h-3" />
                </button>

                <span className="text-sm font-bold text-white w-3 text-center">{item.quantity}</span>

                <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center text-white bg-[#8B5E3C] rounded-full hover:bg-[#6F4E37] transition-colors"
                >
                    <Plus className="w-3 h-3" />
                </button>
            </div>

            <button
                onClick={() => removeItem(item.id)}
                className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-full transition-colors ml-1"
                title="Remove item"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
}
