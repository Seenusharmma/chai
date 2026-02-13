'use client';

import { useCart } from '@/lib/hooks/CartContext';
import { Button } from '../ui/Button';

export function OrderSummary() {
    const { subtotal, tax, total } = useCart();

    return (
        <div className="bg-[#2D2520] rounded-3xl p-6 md:p-8 space-y-6">
            <h3 className="font-heading text-2xl font-bold text-white">Order Summary</h3>

            <div className="space-y-3 pb-6 border-b border-white/5">
                <div className="flex justify-between text-[#A89B8F]">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#A89B8F]">
                    <span>Service Fee (10%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#D4A574]">
                    <span>Delivery Fee</span>
                    <span>Free</span>
                </div>
            </div>

            <div className="flex justify-between items-end">
                <div>
                    <span className="text-sm text-[#A89B8F]">Total Amount</span>
                    <p className="font-heading text-3xl font-bold text-white">₹{total.toFixed(2)}</p>
                </div>
            </div>

            <Button className="w-full text-lg py-6" size="lg">
                Confirm Order
            </Button>

            <p className="text-xs text-center text-[#A89B8F]">
                Secure checkout powered by Stripe
            </p>
        </div>
    );
}
