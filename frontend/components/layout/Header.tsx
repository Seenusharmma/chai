
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, User, Shield, Phone } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCart } from '@/lib/hooks/CartContext';
import { useUserRole } from '@/lib/request/UserContext';
import { cn } from '@/lib/utils/cn';

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export function Header() {
    const pathname = usePathname();
    const { itemCount } = useCart();
    const { isAdmin } = useUserRole();

    const navItems = [
        { href: '/', label: 'Home' },
        { href: '/menu', label: 'Menu' },
        { href: '/about', label: 'About Us' },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/5">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/logo.png"
                            alt="OriBon Cafe & Restro Logo"
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                        <span className="text-xl font-bold text-white tracking-wide">OriBon <span className="text-[#D4A574]">Cafe</span></span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'text-sm font-medium transition-colors hover:text-[#D4A574] relative',
                                    pathname === item.href ? 'text-[#D4A574]' : 'text-[#E8C9A0]'
                                )}
                            >
                                {item.label}
                                {pathname === item.href && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute -bottom-8 left-0 right-0 h-1 bg-[#D4A574] rounded-t-full"
                                    />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-1 md:gap-4">
                        {/* Mobile: Contact Icon */}
                        <Link
                            href="/contact"
                            className={cn(
                                'md:hidden p-2 rounded-full transition-colors hover:bg-white/10',
                                pathname === '/contact' ? 'text-[#D4A574]' : 'text-[#E8C9A0]'
                            )}
                        >
                            <Phone className="w-5 h-5" />
                        </Link>

                        {/* Desktop: Search */}
                        <Button variant="ghost" size="icon" className="hidden md:flex">
                            <Search className="w-5 h-5" />
                        </Button>

                        {/* Desktop: Checkout */}
                        <Link href="/checkout" className="hidden md:block">
                            <Button variant="ghost" size="icon" className="relative">
                                <ShoppingBag className="w-5 h-5" />
                                {itemCount > 0 && (
                                    <span className="absolute top-1 right-1 w-4 h-4 bg-[#D4A574] text-white text-[10px] flex items-center justify-center rounded-full">
                                        {itemCount}
                                    </span>
                                )}
                            </Button>
                        </Link>

                        <SignedIn>
                            {/* Desktop: Profile */}
                            <Link href="/profile" className="hidden md:block">
                                <Button variant="ghost" size="icon" className="relative">
                                    <User className="w-5 h-5" />
                                </Button>
                            </Link>

                            {/* Admin - Mobile & Desktop */}
                            {isAdmin && (
                                <Link href="/admin">
                                    <Button variant="ghost" size="icon" className="relative">
                                        <Shield className="w-5 h-5" />
                                    </Button>
                                </Link>
                            )}

                            <div className="hidden md:block ml-2">
                                <UserButton afterSignOutUrl="/" />
                            </div>
                        </SignedIn>

                        <SignedOut>
                            <Link href="/sign-in">
                                <Button className="bg-[#D4A574] text-[#1A1410] hover:bg-[#C49564] font-bold">
                                    Sign In
                                </Button>
                            </Link>
                        </SignedOut>
                    </div>
                </div>
            </div>
        </header>
    );
}
