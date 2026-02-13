import { cn } from '@/lib/utils/cn';

interface BadgeProps {
    className?: string;
    variant?: 'default' | 'outline' | 'secondary';
    children: React.ReactNode;
}

export function Badge({ className, variant = 'default', children }: BadgeProps) {
    const variants = {
        default: 'bg-[#D4A574] text-white',
        outline: 'border border-[#D4A574] text-[#D4A574]',
        secondary: 'bg-[#3A3230] text-[#E8C9A0]',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    );
}
