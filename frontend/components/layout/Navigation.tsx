'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Coffee, ShoppingBag, History, User, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useCart } from '@/lib/hooks/CartContext';
import { useUser, SignInButton, UserButton } from '@clerk/nextjs';

export function Navigation() {
    const pathname = usePathname();
    const { itemCount } = useCart();
    const { isSignedIn, user } = useUser();

    const navItems = [
        { href: '/', icon: Home, label: 'Home' },
        { href: '/menu', icon: Coffee, label: 'Menu' },
        { href: '/checkout', icon: ShoppingBag, label: 'Cart', badge: itemCount > 0 ? itemCount : undefined, isCart: true },
        { href: '/history', icon: History, label: 'History' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            <div className="bg-[#2A2420] rounded-t-[30px] shadow-[0_-4px_20px_rgba(0,0,0,0.3)] h-[80px] relative">
                <div className="flex items-center justify-between px-6 h-full">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        if (item.isCart) {
                            return (
                                <div key={item.href} className="relative -top-8">
                                    <Link
                                        href={item.href}
                                        className="w-16 h-16 rounded-full bg-[#8B5E3C] flex items-center justify-center shadow-lg border-[6px] border-[#1A1410] relative hover:scale-105 transition-transform"
                                    >
                                        <Icon className="w-6 h-6 text-white" />
                                        {item.badge && item.badge > 0 && (
                                            <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#1A1410] translate-x-1 -translate-y-1">
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex flex-col items-center gap-1 transition-colors relative',
                                    isActive ? 'text-white' : 'text-[#8E8680]'
                                )}
                            >
                                <Icon className={cn("w-6 h-6", isActive && "fill-current")} />
                                {isActive && (
                                    <span className="w-1 h-1 rounded-full bg-[#D4A574] absolute -bottom-2" />
                                )}
                            </Link>
                        );
                    })}
                    {isSignedIn && user ? (
                        <Link
                            href="/profile"
                            className={cn(
                                'flex flex-col items-center gap-1 transition-colors relative',
                                pathname === '/profile' ? 'text-white' : 'text-[#8E8680]'
                            )}
                        >
                            {user.imageUrl ? (
                                <img 
                                    src={user.imageUrl} 
                                    alt={user.fullName || 'User'} 
                                    className="w-6 h-6 rounded-full object-cover"
                                />
                            ) : (
                                <User className={cn("w-6 h-6", pathname === '/profile' && "fill-current")} />
                            )}
                            <span className="text-[10px]">{user.firstName || 'Profile'}</span>
                            {pathname === '/profile' && (
                                <span className="w-1 h-1 rounded-full bg-[#D4A574] absolute -bottom-2" />
                            )}
                        </Link>
                    ) : (
                        <SignInButton mode="modal">
                            <button className="flex flex-col items-center gap-1 text-[#8E8680]">
                                <LogIn className="w-6 h-6" />
                                <span className="text-[10px]">Sign In</span>
                            </button>
                        </SignInButton>
                    )}
                </div>
            </div>
        </div>
    );
}
