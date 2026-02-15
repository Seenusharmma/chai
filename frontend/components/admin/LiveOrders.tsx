'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminOrderCard } from './AdminOrderCard';
import { useAdminOrders } from '@/lib/hooks/useAdminOrders';

export function LiveOrders() {
    const [activeTab, setActiveTab] = useState<'live' | 'processing' | 'ready'>('live');
    const { orders, updateOrderStatus, isLoaded } = useAdminOrders();

    const handleAccept = (id: string) => {
        updateOrderStatus(id, 'accepted');
    };

    const handleDecline = (id: string) => {
        updateOrderStatus(id, 'declined');
    };

    // Helper to calculate time ago
    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        return `${Math.floor(diffInHours / 24)}d ago`;
    };

    // Filter orders based on tab
    // 'live' -> pending
    // 'processing' -> accepted
    // 'ready' -> completed (or maybe we add a 'ready' status later? For now let's map 'accepted' to processing and maybe we need a way to mark ready)
    // The backend only has pending/accepted/declined.
    // Let's assume 'processing' = accepted. 'ready' = completed (if we add it).
    // For now, I'll map 'accepted' to 'processing' tab.

    // Actually, let's keep it simple:
    // Live = pending
    // Processing = accepted
    // Ready = completed (not implemented in backend yet, but UI has it)

    const displayedOrders = orders.filter(order => {
        if (activeTab === 'live') return order.status === 'pending';
        if (activeTab === 'processing') return order.status === 'accepted';
        if (activeTab === 'ready') return order.status === 'completed';
        return false;
    });

    if (!isLoaded) {
        return <div className="text-white text-center py-10">Loading orders...</div>;
    }

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Tabs */}
            <div className="flex p-1 mb-6 bg-[#2D2520] rounded-full">
                <button
                    onClick={() => setActiveTab('live')}
                    className={`flex-1 py-3 text-sm font-bold rounded-full transition-all ${activeTab === 'live'
                        ? 'bg-[#8B5E3C] text-white shadow-lg'
                        : 'text-[#8E8680] hover:text-[#A89B8F]'
                        }`}
                >
                    Live Orders ({orders.filter(o => o.status === 'pending').length})
                </button>
                <button
                    onClick={() => setActiveTab('processing')}
                    className={`flex-1 py-3 text-sm font-bold rounded-full transition-all ${activeTab === 'processing'
                        ? 'bg-[#8B5E3C] text-white shadow-lg'
                        : 'text-[#8E8680] hover:text-[#A89B8F]'
                        }`}
                >
                    Processing ({orders.filter(o => o.status === 'accepted').length})
                </button>
                <button
                    onClick={() => setActiveTab('ready')}
                    className={`flex-1 py-3 text-sm font-bold rounded-full transition-all ${activeTab === 'ready'
                        ? 'bg-[#8B5E3C] text-white shadow-lg'
                        : 'text-[#8E8680] hover:text-[#A89B8F]'
                        }`}
                >
                    Ready ({orders.filter(o => o.status === 'completed').length})
                </button>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {displayedOrders.length > 0 ? (
                        displayedOrders.map((order) => (
                            <AdminOrderCard
                                key={order.id}
                                order={{
                                    id: order.id,
                                    customerName: order.customerName,
                                    customerPhone: order.phoneNumber || 'N/A',
                                    items: order.items.map((i: any) => ({
                                        id: i.itemId || i.id,
                                        name: i.name,
                                        quantity: i.quantity,
                                        price: i.price
                                    })),
                                    total: order.total,
                                    status: order.status,
                                    type: order.diningMode,
                                    timeAgo: getTimeAgo(order.createdAt),
                                    address: order.address,
                                    location: order.location,
                                }}
                                onAccept={handleAccept}
                                onDecline={handleDecline}
                            />
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12 text-[#8E8680]"
                        >
                            No orders in {activeTab}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
