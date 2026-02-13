'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check } from 'lucide-react';
import { useCart } from '@/lib/hooks/CartContext';
import { useCartContext } from './CartContext';
import { MenuItem } from '@/lib/types';

interface AddToCartButtonProps {
  item: MenuItem;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AddToCartButton({ item, size = 'md', className = '' }: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();
  const { showToast, setIsCartOpen } = useCartContext();

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(item);
    showToast(`${item.name} added to cart`, 'success');
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={handleAddToCart}
      className={`
        ${sizes[size]} rounded-lg md:rounded-xl flex items-center justify-center
        shadow-md shadow-primary/30 transition-all
        ${isAdded 
          ? 'bg-green-500 text-white' 
          : 'bg-primary text-white hover:bg-primary-dark'
        }
        ${className}
      `}
    >
      <AnimatePresence mode="wait">
        {isAdded ? (
          <motion.div
            key="check"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <Check className={iconSizes[size]} />
          </motion.div>
        ) : (
          <motion.div
            key="plus"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <Plus className={iconSizes[size]} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
