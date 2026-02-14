'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, TrendingUp, Menu, X, Coffee, ShoppingCart, Clock, CheckCircle, Check, Users, History, Archive, DollarSign, Receipt } from 'lucide-react';
import Image from 'next/image';
import { useMenu } from '@/lib/hooks/useMenu';
import { useAdminOrders } from '@/lib/hooks/useAdminOrders';
import { Badge } from '@/components/ui/Badge';
import { Header } from '@/components/layout/Header';
import { FoodUploadForm } from '@/components/admin/FoodUploadForm';
import { FoodEditForm } from '@/components/admin/FoodEditForm';
import { AdminUsers } from '@/components/admin/AdminUsers';
import { useUserRole } from '@/lib/request/UserContext';

export default function AdminDashboard() {
    const { items, refetch } = useMenu();
    const { orders, updateOrderStatus, deleteOrder, pendingOrders } = useAdminOrders();
    const { isSuperAdmin } = useUserRole();
    const [activeTab, setActiveTab] = useState<'items' | 'orders' | 'users' | 'history' | 'account'>('orders');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
    const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);

    const completedOrders = orders.filter(o => o.status === 'completed');
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
    
    const stats = [
        { icon: TrendingUp, label: 'Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, change: '+15%' },
        { icon: ShoppingCart, label: 'Orders', value: completedOrders.length.toString(), change: '+8%' },
    ];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">Pending</Badge>;
            case 'accepted':
                return <Badge className="bg-blue-500/20 text-blue-400 text-xs">Accepted</Badge>;
            case 'declined':
                return <Badge className="bg-red-500/20 text-red-400 text-xs">Declined</Badge>;
            case 'completed':
                return <Badge className="bg-green-500/20 text-green-400 text-xs">Completed</Badge>;
            default:
                return null;
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            await fetch(`${API_URL}/menu/${itemId}`, { method: 'DELETE' });
            refetch();
            setDeletingItemId(null);
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    return (
        <main className="min-h-screen bg-[#1A1410] flex flex-col">
            {/* Desktop Header - Fixed */}
            <div className="hidden md:block">
                <Header />
            </div>

            <div className="flex-1 flex flex-col md:pt-20">
                {/* Mobile Header */}
                <div className="md:hidden sticky top-0 z-40 bg-[#1A1410] border-b border-white/5 px-4 py-3">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 hover:bg-white/5 rounded-lg"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-5 h-5 text-white" />
                            ) : (
                                <Menu className="w-5 h-5 text-white" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 px-4 md:px-8 py-6 max-w-7xl mx-auto w-full">
                    {/* Stats Grid - Hidden on Mobile */}
                    <div className="hidden md:grid grid-cols-2 gap-4 mb-6">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="bg-gradient-to-br from-[#2D2520] to-[#1A1410] p-4 rounded-xl border border-white/5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-[#A89B8F] mb-1">{stat.label}</p>
                                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-lg bg-[#D4A574]/10 flex items-center justify-center">
                                        <stat.icon className="w-5 h-5 text-[#D4A574]" />
                                    </div>
                                </div>
                                <p className="text-xs text-green-400 mt-2">{stat.change} from last month</p>
                            </div>
                        ))}
                    </div>

                    {/* Header with Add Button */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg md:text-xl font-bold text-white">Management</h2>
                        {activeTab === 'items' && (
                            <button
                                onClick={() => setIsFormOpen(true)}
                                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-[#D4A574] to-[#C49564] text-[#1A1410] rounded-lg font-bold text-sm hover:shadow-lg hover:shadow-[#D4A574]/20 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="hidden sm:inline">Add Item</span>
                            </button>
                        )}
                    </div>

                    {/* Tabs - Fixed Width Scroll */}
                    <div className="flex gap-1.5 mb-4 bg-[#2D2520] p-1 rounded-lg overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`flex-1 min-w-[100px] py-2 px-3 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${activeTab === 'orders'
                                ? 'bg-[#D4A574] text-[#1A1410]'
                                : 'text-[#A89B8F]'
                                }`}
                        >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Orders
                            {pendingOrders.length > 0 && (
                                <span className="w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                                    {pendingOrders.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('items')}
                            className={`flex-1 min-w-[100px] py-2 px-3 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${activeTab === 'items'
                                ? 'bg-[#D4A574] text-[#1A1410]'
                                : 'text-[#A89B8F]'
                                }`}
                        >
                            <Coffee className="w-3.5 h-3.5" />
                            Menu
                        </button>
                        {isSuperAdmin && (
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`flex-1 min-w-[100px] py-2 px-3 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${activeTab === 'users'
                                    ? 'bg-[#D4A574] text-[#1A1410]'
                                    : 'text-[#A89B8F]'
                                    }`}
                            >
                                <Users className="w-3.5 h-3.5" />
                                Users
                            </button>
                        )}
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`flex-1 min-w-[100px] py-2 px-3 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${activeTab === 'history'
                                ? 'bg-[#D4A574] text-[#1A1410]'
                                : 'text-[#A89B8F]'
                                }`}
                        >
                            <History className="w-3.5 h-3.5" />
                            History
                        </button>
                        <button
                            onClick={() => setActiveTab('account')}
                            className={`flex-1 min-w-[100px] py-2 px-3 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${activeTab === 'account'
                                ? 'bg-[#D4A574] text-[#1A1410]'
                                : 'text-[#A89B8F]'
                                }`}
                        >
                            <DollarSign className="w-3.5 h-3.5" />
                            Account
                        </button>
                    </div>

                    {/* Orders List - Scrollable */}
                    {activeTab === 'orders' && (
                        <div className="space-y-2.5">
                            {orders.filter(order => order.status !== 'completed').length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="w-12 h-12 rounded-full bg-[#2D2520] flex items-center justify-center mx-auto mb-3">
                                        <ShoppingCart className="w-5 h-5 text-[#A89B8F]" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-white mb-1">No Orders</h3>
                                    <p className="text-[10px] text-[#A89B8F]">Orders will appear here</p>
                                </div>
                            ) : (
                                orders
                                    .filter(order => order.status !== 'completed')
                                    .map((order) => (
                                        <div
                                            key={order.id}
                                            className="bg-[#2D2520] rounded-lg border border-white/5 overflow-hidden"
                                        >
                                            {/* Order Header */}
                                            <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/5">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-white text-xs">#{order.id}</span>
                                                    {getStatusBadge(order.status)}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${order.diningMode === 'dine-in'
                                                        ? 'bg-purple-500/20 text-purple-400'
                                                        : 'bg-orange-500/20 text-orange-400'
                                                        }`}>
                                                        {order.diningMode === 'dine-in' ? 'Dine In' : 'Parcel'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Order Items */}
                                            <div className="px-3 py-2.5 space-y-1">
                                                {order.items.slice(0, 3).map((item, idx) => (
                                                    <div key={idx} className="flex justify-between text-[11px]">
                                                        <span className="text-white">
                                                            <span className="text-[#D4A574]">{item.quantity}x</span> {item.name}
                                                        </span>
                                                        <span className="text-[#A89B8F]">₹{(item.price * item.quantity).toFixed(0)}</span>
                                                    </div>
                                                ))}
                                                {order.items.length > 3 && (
                                                    <p className="text-[10px] text-[#A89B8F]">+{order.items.length - 3} more</p>
                                                )}
                                            </div>

                                            {/* Order Footer */}
                                            <div className="flex items-center justify-between px-3 py-2.5 bg-[#252019]">
                                                <div>
                                                    <p className="text-[10px] text-[#A89B8F]">Customer</p>
                                                    <p className="text-xs text-white">{order.customerName}</p>
                                                    {order.diningMode === 'parcel' && order.phoneNumber && (
                                                        <p className="text-[10px] text-[#D4A574]">{order.phoneNumber}</p>
                                                    )}
                                                    {order.diningMode === 'parcel' && order.address && (
                                                        <p className="text-[10px] text-[#A89B8F] max-w-[150px] truncate">{order.address}</p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-white text-sm">₹{order.total.toFixed(0)}</span>

                                                    {order.status === 'pending' && (
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => updateOrderStatus(order.id, 'accepted')}
                                                                className="flex items-center gap-1 px-2 py-1.5 bg-green-500 text-white text-[10px] font-medium rounded"
                                                            >
                                                                <Check className="w-3 h-3" />
                                                            </button>
                                                            <button
                                                                onClick={() => updateOrderStatus(order.id, 'declined')}
                                                                className="flex items-center gap-1 px-2 py-1.5 bg-red-500 text-white text-[10px] font-medium rounded"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    )}

                                                    {order.status === 'accepted' && (
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => updateOrderStatus(order.id, 'completed')}
                                                                className="flex items-center gap-1 px-2 py-1.5 bg-[#D4A574] text-[#1A1410] text-[10px] font-bold rounded hover:bg-[#C49564] transition-colors"
                                                            >
                                                                <Archive className="w-3 h-3" />
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={() => setDeletingOrderId(order.id)}
                                                                className="flex items-center gap-1 px-2 py-1.5 bg-red-500/20 text-red-400 text-[10px] font-medium rounded hover:bg-red-500/30 transition-colors"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                            )}
                        </div>
                    )}

                    {/* Menu Items - Scrollable Card List */}
                    {activeTab === 'items' && (
                        <div className="space-y-2">
                            {items.map((item) => (
                                <div key={item.id} className="bg-[#2D2520] rounded-lg border border-white/5 p-2.5 flex gap-3">
                                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#1A1410] shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={56}
                                            height={56}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-white text-sm truncate">{item.name}</h3>
                                                <p className="text-[10px] text-[#A89B8F] capitalize">{item.category}</p>
                                            </div>
                                            <span className="font-bold text-[#D4A574] text-sm">₹{item.price.toFixed(0)}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <Badge className="bg-green-500/20 text-green-400 text-[10px]">Active</Badge>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => setEditingItem(item)}
                                                    className="p-1.5 hover:bg-[#D4A574]/10 rounded text-[#A89B8F] hover:text-[#D4A574] transition-colors"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => setDeletingItemId(item.id)}
                                                    className="p-1.5 hover:bg-red-500/10 rounded text-[#A89B8F] hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Users Management */}
                    {activeTab === 'users' && isSuperAdmin && (
                        <AdminUsers />
                    )}

                    {/* Order History */}
                    {activeTab === 'history' && (
                        <div className="space-y-2.5">
                            {orders.filter(order => order.status === 'completed').length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="w-12 h-12 rounded-full bg-[#2D2520] flex items-center justify-center mx-auto mb-3">
                                        <History className="w-5 h-5 text-[#A89B8F]" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-white mb-1">No Order History</h3>
                                    <p className="text-[10px] text-[#A89B8F]">Completed orders will appear here</p>
                                </div>
                            ) : (
                                orders
                                    .filter(order => order.status === 'completed')
                                    .map((order) => (
                                        <div
                                            key={order.id}
                                            className="bg-[#2D2520] rounded-lg border border-white/5 overflow-hidden"
                                        >
                                            <div className="p-3">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="text-white font-semibold text-sm">{order.customerName}</h3>
                                                        <p className="text-[10px] text-[#A89B8F]">{formatDate(order.createdAt)}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {getStatusBadge(order.status)}
                                                        <Badge className="bg-[#D4A574]/20 text-[#D4A574] text-[10px] capitalize">
                                                            {order.diningMode}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {/* Order Items */}
                                                <div className="space-y-1.5 mb-2">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between text-xs">
                                                            <span className="text-[#A89B8F]">
                                                                {item.quantity}x {item.name}
                                                            </span>
                                                            <span className="text-white">₹{(item.price * item.quantity).toFixed(0)}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Contact Info for Parcel Orders */}
                                                {order.diningMode === 'parcel' && (
                                                    <div className="text-[10px] text-[#A89B8F] mb-2 space-y-0.5">
                                                        {order.phoneNumber && <p>📞 {order.phoneNumber}</p>}
                                                        {order.address && <p>📍 {order.address}</p>}
                                                    </div>
                                                )}

                                                {/* Total */}
                                                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                                    <span className="text-xs text-[#A89B8F]">Total</span>
                                                    <span className="text-sm font-bold text-[#D4A574]">₹{order.total.toFixed(0)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                            )}
                        </div>
                    )}

                    {/* Account - Sales & Orders Summary */}
                    {activeTab === 'account' && (
                        <div className="space-y-4">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-[#2D2520] to-[#1A1410] p-4 rounded-xl border border-white/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="w-10 h-10 rounded-lg bg-[#D4A574]/10 flex items-center justify-center">
                                            <Receipt className="w-5 h-5 text-[#D4A574]" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-[#A89B8F] mb-1">Total Orders</p>
                                    <p className="text-2xl font-bold text-white">{orders.filter(o => o.status === 'completed').length}</p>
                                </div>
                                <div className="bg-gradient-to-br from-[#2D2520] to-[#1A1410] p-4 rounded-xl border border-white/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                            <TrendingUp className="w-5 h-5 text-green-400" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-[#A89B8F] mb-1">Total Sales</p>
                                    <p className="text-2xl font-bold text-white">
                                        ₹{orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0).toLocaleString('en-IN')}
                                    </p>
                                </div>
                            </div>

                            {/* Orders breakdown */}
                            <div className="bg-[#2D2520] rounded-xl border border-white/5 p-4">
                                <h3 className="text-sm font-bold text-white mb-4">Orders Breakdown</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-[#A89B8F]">Pending Orders</span>
                                        <span className="text-xs font-bold text-yellow-400">{orders.filter(o => o.status === 'pending').length}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-[#A89B8F]">Accepted Orders</span>
                                        <span className="text-xs font-bold text-blue-400">{orders.filter(o => o.status === 'accepted').length}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-[#A89B8F]">Declined Orders</span>
                                        <span className="text-xs font-bold text-red-400">{orders.filter(o => o.status === 'declined').length}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                        <span className="text-xs text-[#A89B8F]">Completed Orders</span>
                                        <span className="text-xs font-bold text-green-400">{orders.filter(o => o.status === 'completed').length}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Completed Orders Summary */}
                            <div className="bg-[#2D2520] rounded-xl border border-white/5 p-4">
                                <h3 className="text-sm font-bold text-white mb-4">Recent Completed Orders</h3>
                                <div className="space-y-2">
                                    {orders.filter(o => o.status === 'completed').slice(0, 5).map((order) => (
                                        <div key={order.id} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                            <div>
                                                <p className="text-xs text-white">{order.customerName}</p>
                                                <p className="text-[10px] text-[#A89B8F]">{formatDate(order.createdAt)}</p>
                                            </div>
                                            <span className="text-xs font-bold text-[#D4A574]">₹{order.total.toLocaleString('en-IN')}</span>
                                        </div>
                                    ))}
                                    {orders.filter(o => o.status === 'completed').length === 0 && (
                                        <p className="text-xs text-[#A89B8F] text-center py-4">No completed orders yet</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <FoodUploadForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={refetch}
            />

            {/* Edit Modal */}
            {editingItem && (
                <FoodEditForm
                    isOpen={true}
                    onClose={() => setEditingItem(null)}
                    onSuccess={() => {
                        refetch();
                        setEditingItem(null);
                    }}
                    item={editingItem}
                />
            )}

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deletingItemId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setDeletingItemId(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#2D2520] rounded-2xl p-6 max-w-sm w-full border border-white/10"
                        >
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                    <Trash2 className="w-6 h-6 text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Delete Menu Item?</h3>
                                <p className="text-sm text-[#A89B8F] mb-6">
                                    This action cannot be undone. The item will be permanently removed from the menu.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setDeletingItemId(null)}
                                        className="flex-1 py-2.5 px-4 bg-[#1A1410] text-white rounded-lg font-medium hover:bg-[#252019] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleDeleteItem(deletingItemId)}
                                        className="flex-1 py-2.5 px-4 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Order Confirmation Modal */}
            <AnimatePresence>
                {deletingOrderId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setDeletingOrderId(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#2D2520] rounded-2xl p-6 max-w-sm w-full border border-white/10"
                        >
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                    <Trash2 className="w-6 h-6 text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Delete Order?</h3>
                                <p className="text-sm text-[#A89B8F] mb-6">
                                    This will permanently delete this order. The customer will be notified about the cancellation.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setDeletingOrderId(null)}
                                        className="flex-1 py-2.5 px-4 bg-[#1A1410] text-white rounded-lg font-medium hover:bg-[#252019] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            deleteOrder(deletingOrderId);
                                            setDeletingOrderId(null);
                                        }}
                                        className="flex-1 py-2.5 px-4 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
