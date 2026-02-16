'use client';

import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
}

export function Skeleton({
    className,
    variant = 'rectangular',
    width,
    height,
    ...props
}: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-pulse bg-[#3A3230]',
                variant === 'circular' && 'rounded-full',
                variant === 'text' && 'rounded-md h-4',
                variant === 'rectangular' && 'rounded-2xl',
                className
            )}
            style={{
                width: width ?? '100%',
                height: height ?? '100%',
            }}
            {...props}
        />
    );
}
