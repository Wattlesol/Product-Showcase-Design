import { ArrowRight, Facebook, Instagram, Music } from "lucide-react";
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
                            <a href="https://www.instagram.com/lumina._shoes?igsh=MWtyOTNua291emkzbQ==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="https://www.facebook.com/share/18bjgzd3i2/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="https://www.tiktok.com/@lumina.shoes?_r=1&_t=ZS-96JZPHAH79E" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors" title="TikTok">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-.13 1.95-.12 3.9-.12 5.85 0 2.21-.75 4.41-2.23 6.04-1.49 1.63-3.7 2.63-5.88 2.63-2.18 0-4.39-1-5.88-2.63-1.48-1.63-2.23-3.83-2.23-6.04 0-2.21.75-4.41 2.23-6.04 1.49-1.63 3.7-2.63 5.88-2.63.14 0 .28 0 .42.01v4.07c-.14-.01-.28-.01-.42-.01-1.39 0-2.79.64-3.73 1.67-.94 1.03-1.42 2.44-1.42 3.84 0 1.4.48 2.81 1.42 3.84.94 1.03 2.34 1.67 3.73 1.67 1.39 0 2.79-.64 3.73-1.67.94-1.03 1.42-2.44 1.42-3.84 0-3.67-.01-7.34-.01-11.01 0-.17.02-.34.03-.51.01-.17.03-.34.03-.51z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6 tracking-wide">Shop</h4>
                        <ul className="space-y-4">
                            <li><a href="/#shoes-collection" className="text-gray-400 hover:text-white transition-colors">Men's Shoes</a></li>
                            <li><a href="/#bags-collection" className="text-gray-400 hover:text-white transition-colors">Bags</a></li>
                            <li><Link href="/"><a className="text-gray-400 hover:text-white transition-colors">New Arrivals</a></Link></li>
                            <li><Link href="/"><a className="text-gray-400 hover:text-white transition-colors">Sale</a></Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6 tracking-wide">Support</h4>
                        <ul className="space-y-4">
                            <li><Link href="/contact"><a className="text-gray-400 hover:text-white transition-colors">Contact Us</a></Link></li>
                            <li><Link href="/faq"><a className="text-gray-400 hover:text-white transition-colors">FAQs</a></Link></li>
                            <li><Link href="/shipping-policy"><a className="text-gray-400 hover:text-white transition-colors">Shipping & Returns</a></Link></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Size Guide</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
                    <p className="text-gray-500 text-sm mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} Lumina Footwear. All rights reserved.
                    </p>
                    <div className="flex space-x-6 text-sm text-gray-500">
                        <Link href="/privacy-policy"><a className="hover:text-white transition-colors">Privacy Policy</a></Link>
                        <Link href="/terms-conditions"><a className="hover:text-white transition-colors">Terms of Service</a></Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
