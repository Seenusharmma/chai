'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'icon';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
    children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
        const variants = {
            primary: 'bg-[#D4A574] text-white hover:bg-[#C8956E] shadow-lg shadow-[#D4A574]/20',
            secondary: 'bg-[#3A3230] text-white hover:bg-[#2D2520]',
            outline: 'border-2 border-[#D4A574] text-[#D4A574] hover:bg-[#D4A574] hover:text-white',
            ghost: 'hover:bg-[#3A3230] text-[#E8C9A0]',
            icon: 'bg-[#3A3230] text-white p-2 rounded-full hover:bg-[#D4A574] transition-colors',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-6 py-3 text-base',
            lg: 'px-8 py-4 text-lg',
            icon: 'p-2',
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    'relative inline-flex items-center justify-center rounded-xl font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none',
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';

export { Button };
