'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/hooks/CartContext';
import { useCartContext } from './CartContext';

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen } = useCartContext();
  const { cart, updateQuantity, removeItem, subtotal, tax, total, itemCount } = useCart();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#1A1410] z-[70] flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="font-heading text-2xl font-bold text-white flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-[#D4A574]" />
                Your Cart
                {itemCount > 0 && (
                  <span className="text-sm font-normal text-[#A89B8F]">
                    ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                  </span>
                )}
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-12 h-12 text-[#A89B8F]" />
                  </div>
                  <p className="text-[#A89B8F] text-lg mb-2">Your cart is empty</p>
                  <p className="text-[#6B6560] text-sm mb-6">Add some delicious items to get started</p>
                  <Link
                    href="/menu"
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-3 bg-[#D4A574] text-[#1A1410] font-semibold rounded-xl hover:bg-[#C49564] transition-colors"
                  >
                    Browse Menu
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="bg-[#2D2520] rounded-2xl p-4 flex gap-4"
                    >
                      {item.image && (
                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white truncate">{item.name}</h4>
                        <p className="text-sm text-[#A89B8F] capitalize">{item.category}</p>
                        <p className="text-[#D4A574] font-semibold mt-1">₹{item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                        <div className="flex items-center gap-2 bg-[#1A1410] rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-[#A89B8F] hover:text-white transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-white font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-[#A89B8F] hover:text-white transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-[#2D2520]">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-[#A89B8F]">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#A89B8F]">
                    <span>Tax (10%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full py-4 bg-[#D4A574] text-[#1A1410] font-bold text-lg rounded-xl hover:bg-[#C49564] transition-colors text-center"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
