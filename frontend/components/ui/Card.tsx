'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
    glass?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, hover = false, glass = false, children, ...props }, ref) => {
        const Component = (hover ? motion.div : 'div') as any;

        return (
            <Component
                ref={ref as any} // Type assertion needed for framer-motion compatibility
                className={cn(
                    'rounded-3xl overflow-hidden',
                    glass ? 'glass-effect' : 'bg-[#2D2520]',
                    hover && 'cursor-pointer transition-shadow hover:shadow-xl hover:shadow-[#D4A574]/10',
                    className
                )}
                {...(hover ? {
                    whileHover: { y: -5 },
                    transition: { type: 'spring', stiffness: 300 }
                } : {})}
                {...props}
            >
                {children}
            </Component>
        );
    }
);

Card.displayName = 'Card';

export { Card };
