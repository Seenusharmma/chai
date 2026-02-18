import Image from 'next/image';

const galleryImages = [
    { src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=600&fit=crop', alt: 'Coffee', height: 200 },
    { src: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop', alt: 'Latte Art', height: 150 },
    { src: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=500&fit=crop', alt: 'Cappuccino', height: 180 },
    { src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=350&fit=crop', alt: 'Cafe', height: 140 },
    { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=500&fit=crop', alt: 'Food Platter', height: 220 },
    { src: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop', alt: 'Breakfast', height: 130 },
    { src: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=400&fit=crop', alt: 'Salad', height: 160 },
    { src: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=350&fit=crop', alt: 'French Toast', height: 150 },
    { src: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=400&h=500&fit=crop', alt: 'Healthy Bowl', height: 200 },
    { src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=350&fit=crop', alt: 'Veggie Bowl', height: 140 },
    { src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop', alt: 'Laptop Coffee', height: 170 },
    { src: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=500&fit=crop', alt: 'Iced Coffee', height: 210 },
    { src: 'https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=400&h=350&fit=crop', alt: 'Tea', height: 150 },
    { src: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop', alt: 'Pancakes', height: 120 },
    { src: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=500&fit=crop', alt: 'Bread Basket', height: 190 },
];

const GallerySection: React.FC = () => {
    return (
        <section className="px-6 md:px-12 pb-20 md:pb-24">
            <div className="flex items-center justify-between mb-6 md:mb-12">
                <h3 className="text-xl md:text-3xl font-bold">Gallery</h3>
                <div className="flex gap-2">
                    <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-primary"></span>
                    <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-primary/20"></span>
                    <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-primary/20"></span>
                </div>
            </div>
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-8 space-y-4 md:space-y-8">
                {galleryImages.map((image, index) => (
                    <div
                        key={index}
                        className="relative rounded-lg overflow-hidden group break-inside-avoid"
                        style={{ height: `${image.height}px` }}
                    >
                        <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default GallerySection;
