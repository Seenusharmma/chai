'use client';

import { motion } from 'framer-motion';
import { Check, X, Clock } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

export interface AdminOrder {
    id: string;
    customerName: string;
    customerPhone: string;
    items: OrderItem[];
    note?: string;
    total: number;
    status: string;
    type: string;
    timeAgo: string;
    address?: string;
}

interface AdminOrderCardProps {
    order: AdminOrder;
    onAccept: (id: string) => void;
    onDecline: (id: string) => void;
}

export function AdminOrderCard({ order, onAccept, onDecline }: AdminOrderCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#1E1815] rounded-3xl p-6 border border-[#FFFFFF]/5 shadow-xl relative overflow-hidden group"
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-[#8E8680] font-mono text-sm">#{order.id}</span>
                        <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold bg-red-500/10 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" />
                            {order.timeAgo}
                        </div>
                    </div>
                    <h3 className="text-white text-xl font-bold">{order.customerName}</h3>
                    <p className="text-[#5A524C] text-sm">{order.customerPhone}</p>
                </div>

                <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border",
                    order.type === 'dine-in'
                        ? "bg-[#3E3835] text-[#A89B8F] border-[#5A524C]"
                        : "bg-[#D4A574]/10 text-[#D4A574] border-[#D4A574]/20"
                )}>
                    {order.type}
                </span>
            </div>

            {/* Items */}
            <div className="space-y-3 mb-6">
                {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center group/item">
                        <div className="flex items-center gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded bg-[#2D2520] text-[#8E8680] flex items-center justify-center text-xs font-bold">
                                {item.quantity}
                            </span>
                            <span className="text-[#E8C9A0] text-sm font-medium">{item.name}</span>
                        </div>
                        <span className="text-white text-sm font-bold">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
            </div>

            {/* Note / Address for Parcel */}
            {order.type === 'parcel' && (
                <div className="bg-[#2A2420] rounded-xl p-3 mb-6 space-y-2">
                    {order.customerPhone && (
                        <p className="text-[#D4A574] text-xs">
                            <span className="font-bold">Phone:</span> {order.customerPhone}
                        </p>
                    )}
                    {order.address && (
                        <p className="text-[#D4A574] text-xs">
                            <span className="font-bold">Address:</span> {order.address}
                        </p>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-auto">
                <button
                    onClick={() => onDecline(order.id)}
                    className="flex-1 py-3.5 rounded-xl border border-[#3A3230] text-[#8E8680] font-bold text-sm hover:bg-[#2D2520] hover:text-white transition-colors"
                >
                    Decline
                </button>
                <button
                    onClick={() => onAccept(order.id)}
                    className="flex-[2] py-3.5 rounded-xl bg-[#8B5E3C] text-white font-bold text-sm hover:bg-[#6F4E37] transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                    Accept Order
                    <div className="bg-white/20 rounded-full p-0.5">
                        <Check className="w-3 h-3" />
                    </div>
                </button>
            </div>

        </motion.div>
    );
}
