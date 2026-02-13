import React from 'react';
import { menuItems as PRODUCTS } from '../../lib/data/menu';
import { MenuItem as Product } from '../../lib/types';
import { AddToCartButton } from '../cart/AddToCartButton';

interface HomeScreenProps {
    onOrderNow: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onOrderNow }) => {
    return (
        <div className="animate-in fade-in duration-500 max-w-7xl mx-auto md:pb-20">
            {/* Hero Section */}
            <section className="relative px-6 pt-8 pb-0 md:py-24 md:px-12 overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-0 md:min-h-[70vh]">
                <div className="relative z-10 max-w-xs md:max-w-lg md:w-1/2">
                    <h2 className="text-4xl md:text-7xl font-extrabold leading-tight mb-4 md:mb-6 tracking-tight">
                        Fresh <span className="text-primary">Coffee</span>. <br />
                        <span className='text-[#D4A574]'>Delicious</span> Food.
                    </h2>
                    <p className="text-stone-400 text-sm md:text-lg mb-6 md:mb-8 leading-relaxed max-w-md">
                        Experience the finest artisanal blends and chef-curated treats delivered to your door.
                    </p>
                    <button
                        onClick={onOrderNow}
                        className="bg-primary hover:bg-primary/90 border-y-2 hover:border-y-amber-600 text-white px-8 py-4 md:px-10 md:py-5 rounded-xl md:rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20 active:scale-95 group text-base md:text-lg"
                    >
                        Order Now
                        <span className="material-icons-round text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                </div>

                {/* Floating Coffee Image - Absolute on Mobile, Relative/Flex on Desktop */}
                <div className="absolute -right-12 top-4 w-64 h-64 md:static md:w-1/2 md:h-auto md:flex md:justify-end pointer-events-none md:pointer-events-auto opacity-90 animate-bounce transition-all duration-1000" style={{ animationDuration: '3s' }}>
                    <div className="relative w-full h-full md:w-[500px] md:h-[500px]">
                        <img
                            alt="Floating Coffee"
                            className="w-full h-full object-contain drop-shadow-2xl rounded-full"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9RlZ7-a53d-f44K8-AB2zYnpzSDXAf4rvjOQOg-X1WPbrzu6TReeBINpt_mhD5rLHWjhYjx_Rsl4YW7Xnqq8rnHRSATHfq1d5SCoTlQgBnAgf-xMSDlH5PpKyHaiLdpLBT24hZsHuRLTDWKcrXnOif2yeZ3nTSxISZgEOsjradeikdflTNN1wAgTVIK9a-nV7Ad1PpJel0l2bTcP83sgU7J5NqJJs0kkwlngf621E6RGCqdxnh-ICRdwBHv0poMUvqAOajnmZ6oti"
                        />
                    </div>
                </div>
            </section>

            {/* Rewards Banner */}
            <section className="px-6 md:px-12 mb-8 md:mb-20 pt-32 md:pt-0"> {/* Added pt-32 on mobile to clear the absolute image if needed, or stick to original spacing if content flows under. Original had mb-8 and next section. But wait, absolute image might overlap if we don't space. Original code had normal flow. Let's stick to original spacing. */}
                {/* Wait, original code: Hero was px-6 py-8. Image was absolute. Banner was px-6 mb-8. 
             If image is absolute -right-12 top-4, it overlaps the Hero text? No, max-w-xs on text keeps it left. 
             Does it overlap the next section? No, it's inside Hero section relative container.
             So standard flow is fine. I will remove pt-32.
         */}
            </section>

            <section className="px-6 md:px-12 -mt-6 md:mt-0 mb-8 md:mb-20 relative z-20">
                <div className="bg-primary/10 hover:bg-primary/15 transition-colors cursor-pointer rounded-2xl md:rounded-3xl p-4 md:p-10 border border-primary/20 flex items-center justify-between max-w-5xl mx-auto backdrop-blur-sm">
                    <div className="flex items-center gap-3 md:gap-8">
                        <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            <span className="material-icons-round text-2xl md:text-4xl">stars</span>
                        </div>
                        <div>
                            <h4 className="text-sm md:text-2xl font-bold mb-0 md:mb-1">You have 250 points</h4>
                            <p className="text-xs md:text-base text-stone-500">Redeem for a free Espresso</p>
                        </div>
                    </div>
                    <span className="material-icons-round text-primary text-2xl md:text-4xl">chevron_right</span>
                </div>
            </section>

            {/* Popular Items Grid */}
            <section className="px-6 md:px-12 pb-20 md:pb-24">
                <div className="flex items-center justify-between mb-6 md:mb-12">
                    <h3 className="text-xl md:text-3xl font-bold">Popular Now</h3>
                    <div className="flex gap-2">
                        <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-primary"></span>
                        <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-primary/20"></span>
                        <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-primary/20"></span>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                    {PRODUCTS.slice(0, 4).map(product => (
                        <div key={product.id} className="bg-white/5 border border-primary/5 rounded-2xl md:rounded-3xl p-3 md:p-5 shadow-sm group hover:border-primary/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
                            <div className="relative mb-3 md:mb-5 h-32 md:h-64 rounded-xl md:rounded-2xl overflow-hidden bg-black/20">
                                <img
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                    src={product.image}
                                />
                                <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-black/40 backdrop-blur-md px-1.5 py-0.5 md:px-3 md:py-1.5 rounded-lg md:rounded-xl flex items-center gap-1">
                                    <span className="material-icons-round text-[12px] md:text-sm text-yellow-400">star</span>
                                    <span className="text-[10px] md:text-xs text-white font-bold">{product.rating}</span>
                                </div>
                            </div>
                            <h4 className="font-bold text-sm md:text-lg mb-1 truncate">{product.name}</h4>
                            <p className="text-[10px] md:text-sm text-stone-500 mb-3 md:mb-4 line-clamp-2 min-h-[2.5em]">{product.description}</p>
                            <div className="flex items-center justify-between mt-auto">
                                <span className="text-primary font-bold text-sm md:text-lg">₹{product.price.toFixed(2)}</span>
                                <AddToCartButton item={product} size="md" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomeScreen;
