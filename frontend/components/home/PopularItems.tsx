'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useMenu } from '@/lib/hooks/useMenu';
import { MenuItem } from '../menu/MenuItem';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export function PopularItems() {
    const { popularItems, isLoading } = useMenu();

    if (isLoading) return null;

    return (
        <section className="py-20 bg-[#1A1410]">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="font-heading text-4xl font-bold text-white mb-4">
                            Popular <span className="text-[#D4A574]">Now</span>
                        </h2>
                        <p className="text-[#A89B8F]">Customer favorites you must try</p>
                    </div>

                    <div className="flex gap-2">
                        <button className="swiper-prev-btn w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-[#D4A574] hover:border-[#D4A574] transition-colors">
                            ←
                        </button>
                        <button className="swiper-next-btn w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-[#D4A574] hover:border-[#D4A574] transition-colors">
                            →
                        </button>
                    </div>
                </div>

                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={24}
                    slidesPerView={1}
                    navigation={{
                        prevEl: '.swiper-prev-btn',
                        nextEl: '.swiper-next-btn',
                    }}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000 }}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                        1280: { slidesPerView: 4 },
                    }}
                    className="pb-12"
                >
                    {popularItems.map((item) => (
                        <SwiperSlide key={item.id} className="h-auto">
                            <MenuItem item={item} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
