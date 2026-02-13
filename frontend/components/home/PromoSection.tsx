'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/Button';

export function PromoSection() {
    return (
        <section className="py-20 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="relative rounded-[2.5rem] bg-[#2D2520] overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="p-12 lg:p-20 flex flex-col justify-center relative z-10">
                            <span className="text-[#D4A574] font-medium tracking-wide uppercase mb-4">Limited Offer</span>
                            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
                                Get 50% Off<br />
                                your first order
                            </h2>
                            <p className="text-[#A89B8F] mb-8 max-w-md">
                                Use code <span className="text-white font-bold">AREGANO</span> at checkout to unlock this exclusive welcome offer.
                            </p>

                            <Button size="lg" className="self-start">
                                Claim Offer Now
                            </Button>
                        </div>

                        <div className="relative h-[400px] lg:h-auto min-h-[400px]">
                            <Image
                                src="/images/promo-bg.jpg"
                                alt="Coffee Promo"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#2D2520] via-[#2D2520]/50 to-transparent lg:via-transparent" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
