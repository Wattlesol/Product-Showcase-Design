import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useCart } from "@/lib/cart-context";
import CartDrawer from "./CartDrawer";

const Navbar: React.FC = () => {
    const [, setLocation] = useLocation();
    const { totalItems } = useCart();
    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <>
            {/* Header Promo */}
            <div className="bg-black text-white py-2 px-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Free express shipping on all orders this week</p>
            </div>

            <nav className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span
                            className="font-heading font-bold text-2xl tracking-tighter cursor-pointer"
                            onClick={() => setLocation("/")}
                        >
                            LUMINA
                        </span>
                    </div>

                    <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
                        <button onClick={() => setLocation("/")} className="hover:text-black transition-colors">Collection</button>
                        <button onClick={() => setLocation("/blog")} className="hover:text-black transition-colors">Blog</button>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative pr-2"
                            onClick={() => setIsCartOpen(true)}
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                                    {totalItems}
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            </nav>

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
};

export default Navbar;
