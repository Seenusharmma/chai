export function Footer() {
    return (
        <footer className="bg-[#15100D] text-[#A89B8F] py-8 pb-28 md:pb-8 md:py-12 lg:py-16">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-3 md:mb-4">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#D4A574] to-[#8B6F47] flex items-center justify-center">
                                <span className="text-white font-bold text-xs md:text-sm">A</span>
                            </div>
                            <span className="text-base md:text-lg lg:text-xl font-bold text-white">Aura<span className="text-[#D4A574]">Café</span></span>
                        </div>
                        <p className="text-xs md:text-sm lg:text-base leading-relaxed max-w-xs">
                            Premium coffee & treats.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-2 md:mb-3 text-xs md:text-sm lg:text-base">About</h3>
                        <ul className="space-y-1 md:space-y-2 text-xs md:text-sm lg:text-base">
                            <li><a href="#" className="hover:text-[#D4A574]">Our Story</a></li>
                            <li><a href="#" className="hover:text-[#D4A574]">Careers</a></li>
                            <li><a href="#" className="hover:text-[#D4A574]">FAQ</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-2 md:mb-3 text-xs md:text-sm lg:text-base">Support</h3>
                        <ul className="space-y-1 md:space-y-2 text-xs md:text-sm lg:text-base">
                            <li><a href="#" className="hover:text-[#D4A574]">Contact</a></li>
                            <li><a href="#" className="hover:text-[#D4A574]">Shipping</a></li>
                            <li><a href="#" className="hover:text-[#D4A574]">Returns</a></li>
                        </ul>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <h3 className="text-white font-semibold mb-2 md:mb-3 text-xs md:text-sm lg:text-base">Newsletter</h3>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email"
                                className="bg-[#2D2520] rounded-lg px-3 py-2 md:px-4 md:py-2 lg:px-4 lg:py-3 text-xs md:text-sm w-full focus:outline-none focus:ring-1 focus:ring-[#D4A574]"
                            />
                            <button className="bg-[#D4A574] text-white px-4 py-2 md:px-4 md:py-2 lg:px-6 lg:py-3 rounded-lg text-xs md:text-sm hover:bg-[#C8956E]">
                                Go
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-6 md:mt-8 lg:mt-12 pt-4 md:pt-4 border-t border-white/5 text-center text-xs md:text-sm">
                    <p>&copy; {new Date().getFullYear()} AuraCafé. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
