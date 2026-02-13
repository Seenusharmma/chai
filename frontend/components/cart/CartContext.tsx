'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ShoppingBag } from 'lucide-react';
import { MenuItem } from '@/lib/types';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface CartContextType {
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  showToast: (message: string, type?: ToastType) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within CartProvider');
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  return (
    <CartContext.Provider value={{ isCartOpen, setIsCartOpen, showToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </CartContext.Provider>
  );
}

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast }: { toast: Toast }) {
  const icons = {
    success: <Check className="w-5 h-5" />,
    error: <X className="w-5 h-5" />,
    info: <ShoppingBag className="w-5 h-5" />,
  };

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-[#D4A574]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={`${colors[toast.type]} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[280px]`}
    >
      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
        {icons[toast.type]}
      </div>
      <span className="font-medium">{toast.message}</span>
    </motion.div>
  );
}
