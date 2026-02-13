'use client';

import { motion } from 'framer-motion';
import { Clock, Receipt, TrendingUp, Trash2, Coffee, ChevronRight, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useHistory } from '@/lib/hooks/useHistory';
import { Navigation } from '@/components/layout/Navigation';
import { Header } from '@/components/layout/Header';

export default function HistoryPage() {
  const { orderHistory, totalSpent, totalOrders, clearHistory, isLoaded, isLoggedIn } = useHistory();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'accepted': // Map accepted to processing color
      case 'processing':
        return 'bg-blue-500/10 text-blue-500';
      case 'declined':
      case 'cancelled':
        return 'bg-red-500/10 text-red-500';
      case 'delivered':
      case 'completed':
        return 'bg-green-500/10 text-green-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  if (!isLoaded) {
    return null;
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#1A1410] pb-24 md:pb-8">
        <div className="hidden md:block fixed top-0 left-0 right-0 z-50">
          <Header />
        </div>

        <div className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/5 md:hidden">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between h-20">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-5 h-5 text-white" />
                <span className="text-lg font-bold text-white">Order History</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-24 md:pt-8 px-4 md:px-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-full bg-[#2D2520] flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-[#A89B8F]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Sign In Required</h3>
            <p className="text-[#A89B8F] mb-6">Please sign in to view your order history</p>
            <Link href="/sign-in">
              <button className="bg-[#D4A574] text-[#1A1410] px-6 py-3 rounded-xl font-bold">
                Sign In
              </button>
            </Link>
          </motion.div>
        </div>
        <Navigation />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#1A1410] pb-24 md:pb-8">
      {/* Desktop Header - Fixed */}
      <div className="hidden md:block fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/5 md:hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5 text-white" />
              <span className="text-lg font-bold text-white">Order History</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="pt-24 md:pt-8 px-4 md:px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          <div className="bg-gradient-to-br from-[#2D2520] to-[#3A3230] rounded-2xl p-5 border border-white/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#D4A574]/10 flex items-center justify-center">
                <Receipt className="w-5 h-5 text-[#D4A574]" />
              </div>
              <span className="text-[#A89B8F] text-sm">Total Orders</span>
            </div>
            <p className="text-3xl font-bold text-white">{totalOrders}</p>
          </div>

          <div className="bg-gradient-to-br from-[#2D2520] to-[#3A3230] rounded-2xl p-5 border border-white/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#D4A574]/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#D4A574]" />
              </div>
              <span className="text-[#A89B8F] text-sm">Total Spent</span>
            </div>
            <p className="text-3xl font-bold text-white">₹{totalSpent.toFixed(2)}</p>
          </div>
        </motion.div>

        {orderHistory.length > 0 && (
          <div className="flex justify-end mb-4">
            <button
              onClick={clearHistory}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear History
            </button>
          </div>
        )}

        <div className="space-y-4">
          {orderHistory.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 rounded-full bg-[#2D2520] flex items-center justify-center mx-auto mb-4">
                <Clock className="w-10 h-10 text-[#A89B8F]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Orders Yet</h3>
              <p className="text-[#A89B8F]">Your order history will appear here</p>
            </motion.div>
          ) : (
            orderHistory.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#2D2520] rounded-2xl overflow-hidden border border-white/5"
              >
                <div className="p-4 md:p-5 border-b border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#D4A574]/10 flex items-center justify-center">
                        <Coffee className="w-5 h-5 text-[#D4A574]" />
                      </div>
                      <div>
                        <p className="font-bold text-white">Order #{order.id}</p>
                        <p className="text-xs text-[#A89B8F]">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-[#D4A574] font-medium">{item.quantity}x</span>
                          <span className="text-white truncate max-w-[200px]">{item.name}</span>
                        </div>
                        <span className="text-[#A89B8F]">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-xs text-[#A89B8F]">+{order.items.length - 3} more items</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="text-[#A89B8F] text-sm">Total</span>
                    <span className="text-xl font-bold text-white">₹{order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="px-4 md:px-5 py-3 bg-[#252019] flex items-center justify-between cursor-pointer hover:bg-[#2A2520] transition-colors">
                  <span className="text-sm text-[#D4A574] font-medium">View Details</span>
                  <ChevronRight className="w-5 h-5 text-[#D4A574]" />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
      <Navigation />
    </main>
  );
}
