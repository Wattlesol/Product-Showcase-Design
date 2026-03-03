import { ArrowRight, Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
    return (
        <footer className="bg-black text-white pt-16 pb-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <span className="font-heading font-bold text-3xl tracking-tighter mb-6 block">LUMINA</span>
                        <p className="text-gray-400 max-w-sm mb-6 leading-relaxed">
                            We design premium footwear for the modern professional. Effortless comfort without compromising on style.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6 tracking-wide">Shop</h4>
                        <ul className="space-y-4">
                            <li><Link href="/"><a className="text-gray-400 hover:text-white transition-colors">Men's Shoes</a></Link></li>
                            <li><Link href="/"><a className="text-gray-400 hover:text-white transition-colors">Accessories</a></Link></li>
                            <li><Link href="/"><a className="text-gray-400 hover:text-white transition-colors">New Arrivals</a></Link></li>
                            <li><Link href="/"><a className="text-gray-400 hover:text-white transition-colors">Sale</a></Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6 tracking-wide">Support</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQs</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Shipping & Returns</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Size Guide</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
                    <p className="text-gray-500 text-sm mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} Lumina Footwear. All rights reserved.
                    </p>
                    <div className="flex space-x-6 text-sm text-gray-500">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
