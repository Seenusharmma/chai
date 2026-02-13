'use client';

import { ChevronLeft, Utensils, PlusCircle, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { CartItem } from '@/components/cart/CartItem';
import { useCart } from '@/lib/hooks/CartContext';
import { useHistory } from '@/lib/hooks/useHistory';
import { useAdminOrders } from '@/lib/hooks/useAdminOrders';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { cn } from '@/lib/utils/cn';
import { createOrder } from '@/lib/api';

export default function CheckoutPage() {
    const { user } = useUser();
    const { cart, itemCount, subtotal, tax, total, clearCart } = useCart();
    const { addOrder } = useHistory();
    // const { addOrder: addAdminOrder } = useAdminOrders(); // Removed usage
    const router = useRouter();
const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [diningMode, setDiningMode] = useState<'dine-in' | 'parcel'>('dine-in');
    const [customerName, setCustomerName] = useState('');
    const [numberOfPeople, setNumberOfPeople] = useState('');
    const [isOrdering, setIsOrdering] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    const handlePlaceOrder = async () => {
        if (diningMode === 'dine-in') {
            if (!customerName) {
                alert('Please enter your name');
                return;
            }
            if (!numberOfPeople) {
                alert('Please enter number of people');
                return;
            }
        } else if (diningMode === 'parcel') {
            if (!customerName) {
                alert('Please enter your name');
                return;
            }
            if (!phoneNumber) {
                alert('Please enter your phone number');
                return;
            }
            if (!address) {
                alert('Please enter your delivery address');
                return;
            }
        }

        setIsOrdering(true);

        try {
            const orderData = {
                orderType: diningMode,
                items: cart.map(item => ({
                    itemId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                totalAmount: total,
                customerName: diningMode === 'parcel' ? customerName : `${customerName} - Table for ${numberOfPeople}`,
                phoneNumber: diningMode === 'parcel' ? phoneNumber : undefined,
                address: diningMode === 'parcel' ? address : undefined,
                userEmail: user?.primaryEmailAddress?.emailAddress || 'guest@example.com'
            };

            await createOrder(orderData);

            // Legacy local storage updates (optional, keeping for safety if backend fails, but duplicate logic)
            // addOrder(cart, subtotal, tax, total); 
            // addAdminOrder(cart, subtotal, tax, total, customerName, diningMode);

            clearCart();
            setOrderPlaced(true);
            setTimeout(() => {
                router.push('/history');
            }, 2000);
        } catch (error) {
            console.error('Failed to place order:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setIsOrdering(false);
        }
    };

    if (orderPlaced) {
        return (
            <main className="min-h-screen bg-[#1A1410] flex flex-col items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <h1 className="font-heading text-3xl font-bold text-white mb-4">Order Placed!</h1>
                    <p className="text-[#A89B8F] mb-8">Your order has been successfully placed</p>
                </div>
            </main>
        )
    }

    if (itemCount === 0) {
        return (
            <main className="min-h-screen bg-[#1A1410] flex flex-col items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="font-heading text-3xl font-bold text-white mb-4">Your cart is empty</h1>
                    <Link href="/menu">
                        <Button>Browse Menu</Button>
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-[#1A1410] pb-32 md:pb-0 font-['Outfit']">
            {/* Desktop Header - Fixed */}
            <div className="hidden md:block fixed top-0 left-0 right-0 z-50">
                <Header />
            </div>

            {/* Desktop Content */}
            <div className="hidden md:block pt-20">
            </div>

            {/* Mobile Header */}
            <div className="sticky top-0 z-50 bg-[#1A1410] px-4 py-4 flex items-center justify-between mb-4 md:hidden">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 rounded-full bg-[#2D2520] flex items-center justify-center text-white hover:bg-[#3A3230] transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold text-white">Checkout</h1>
                <div className="w-10" /> {/* Spacer for centering */}
            </div>

            <div className="container mx-auto px-4 space-y-8">
                {/* Your Order */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-white">Your Order</h2>
                        <Link href="/menu" className="text-[#8B5E3C] text-sm hover:underline">Add more</Link>
                    </div>
                    <div className="space-y-2">
                        {cart.map((item) => (
                            <CartItem key={item.id} item={item} />
                        ))}
                    </div>
                </section>

                {/* Dining Toggle */}
                <section className="bg-[#2D2520] p-1.5 rounded-2xl flex relative">
                    {/* Sliding Background */}
                    <div
                        className={cn(
                            "absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#8B5E3C] rounded-xl transition-all duration-300",
                            diningMode === 'parcel' ? "left-[calc(50%+3px)]" : "left-1.5"
                        )}
                    />

                    <button
                        onClick={() => setDiningMode('dine-in')}
                        className={cn(
                            "flex-1 py-3 text-center text-sm font-medium relative z-10 transition-colors",
                            diningMode === 'dine-in' ? "text-white" : "text-[#8E8680]"
                        )}
                    >
                        Dine In
                    </button>
                    <button
                        onClick={() => setDiningMode('parcel')}
                        className={cn(
                            "flex-1 py-3 text-center text-sm font-medium relative z-10 transition-colors",
                            diningMode === 'parcel' ? "text-white" : "text-[#8E8680]"
                        )}
                    >
                        Parcel
                    </button>
                </section>

                {/* Customer Details */}
                <section>
                    <h2 className="text-lg font-bold text-white mb-4">Customer Details</h2>
                    <div className="space-y-4">
                        {diningMode === 'dine-in' && (
                            <>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#8E8680] uppercase tracking-wider">Your Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. John Doe"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        className="w-full bg-[#2D2520] border-none rounded-xl px-4 py-3.5 text-white placeholder:text-[#5A524C] focus:ring-1 focus:ring-[#8B5E3C]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#8E8680] uppercase tracking-wider">Number of People</label>
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="e.g. 2"
                                        value={numberOfPeople}
                                        onChange={(e) => setNumberOfPeople(e.target.value)}
                                        className="w-full bg-[#2D2520] border-none rounded-xl px-4 py-3.5 text-white placeholder:text-[#5A524C] focus:ring-1 focus:ring-[#8B5E3C]"
                                    />
                                </div>
                            </>
                        )}

                        {diningMode === 'parcel' && (
                            <>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#8E8680] uppercase tracking-wider">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Julianne Moore"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        className="w-full bg-[#2D2520] border-none rounded-xl px-4 py-3.5 text-white placeholder:text-[#5A524C] focus:ring-1 focus:ring-[#8B5E3C]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#8E8680] uppercase tracking-wider">Phone Number</label>
                                    <input
                                        type="tel"
                                        placeholder="e.g. +1 234 567 890"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="w-full bg-[#2D2520] border-none rounded-xl px-4 py-3.5 text-white placeholder:text-[#5A524C] focus:ring-1 focus:ring-[#8B5E3C]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#8E8680] uppercase tracking-wider">Delivery Address</label>
                                    <div className="relative">
                                        <textarea
                                            placeholder="Enter your full address or live location"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="w-full bg-[#2D2520] border-none rounded-xl px-4 py-3.5 pr-12 text-white placeholder:text-[#5A524C] focus:ring-1 focus:ring-[#8B5E3C] min-h-[100px] resize-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (navigator.geolocation) {
                                                    navigator.geolocation.getCurrentPosition(
                                                        (position) => {
                                                            const { latitude, longitude } = position.coords;
                                                            setAddress(`https://maps.google.com/?q=${latitude},${longitude}`);
                                                        },
                                                        () => {
                                                            alert('Unable to get your location. Please enter manually.');
                                                        }
                                                    );
                                                } else {
                                                    alert('Geolocation is not supported by your browser.');
                                                }
                                            }}
                                            className="absolute bottom-3 right-3 p-2 bg-[#8B5E3C] rounded-lg text-white hover:bg-[#6F4E37] transition-colors"
                                            title="Get current location"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10" />
                                                <circle cx="12" cy="12" r="3" />
                                                <line x1="12" y1="2" x2="12" y2="6" />
                                                <line x1="12" y1="18" x2="12" y2="22" />
                                                <line x1="2" y1="12" x2="6" y2="12" />
                                                <line x1="18" y1="12" x2="22" y2="12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {diningMode === 'dine-in' && (
                            <div className="bg-[#2D2520]/50 border border-[#8B5E3C]/20 rounded-xl p-4 flex gap-3">
                                <Utensils className="w-5 h-5 text-[#8B5E3C] shrink-0 mt-0.5" />
                                <p className="text-xs text-[#8E8680] leading-relaxed">
                                    Selecting 'Dine In' will reserve a table for the specified number of people automatically upon arrival.
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Payment Method */}
                <section>
                    <h2 className="text-lg font-bold text-white mb-4">Payment Method</h2>
                    <button className="w-full border border-dashed border-[#8E8680]/30 rounded-xl py-4 flex items-center justify-center gap-2 text-[#8E8680] hover:bg-[#2D2520] transition-colors">
                        <PlusCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Add another payment method</span>
                    </button>
                </section>

                {/* Bottom Summary Sheet */}
                <div className="space-y-4 pt-4">
                    <div className="space-y-3 pb-6 border-b border-white/5">
                        <div className="flex justify-between text-[#8E8680] text-sm">
                            <span>Subtotal</span>
                            <span className="text-white font-medium">₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[#8E8680] text-sm">
                            <span>Service Fee</span>
                            <span className="text-white font-medium">₹{tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[#D4A574] text-sm font-medium">
                            <span>Delivery Fee</span>
                            <span>Free</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                        <span className="text-white font-bold text-lg">Total Amount</span>
                        <span className="text-[#D4A574] font-bold text-xl">₹{total.toFixed(2)}</span>
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        disabled={isOrdering}
                        className="w-full bg-[#8B5E3C] text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-[#6F4E37] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isOrdering ? (
                            <>Processing...</>
                        ) : (
                            <>
                                Confirm Order
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </main>
    );
}
