import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Star, ArrowRight, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import img8080BRN from "@assets/8080_-_8_BRN_1772297418005.png";
import img8080BLK from "@assets/8080_-_8_BKL_1772297418005.png";
import img8079BRN from "@assets/8079_-_8_BRN_1772297418006.png";
import img8079BLK from "@assets/8079_-_8_BLK_1772297418006.png";
import img8077BLK from "@assets/8077_-_9_BLK_1772297418006.png";
import img8077BRN from "@assets/8077_-_8_BRN_1772297418006.png";
import img8076BLK from "@assets/8076_-_8_BLK_1772297418006.png";
import img8075BRN from "@assets/8075_-_8_BRN_1772297418006.png";
import img8075BLK from "@assets/8075_-_8_BLK_1772297418006.png";

const products = [
  { id: 1, name: "Model 8080 Classic Slip-On", color: "Brown", price: "$89.00", image: img8080BRN, rating: 4.8 },
  { id: 2, name: "Model 8080 Classic Slip-On", color: "Black", price: "$89.00", image: img8080BLK, rating: 4.9 },
  { id: 3, name: "Model 8079 Comfort Loafer", color: "Brown", price: "$95.00", image: img8079BRN, rating: 4.7 },
  { id: 4, name: "Model 8079 Comfort Loafer", color: "Black", price: "$95.00", image: img8079BLK, rating: 4.8 },
  { id: 5, name: "Model 8077 Executive Mocc", color: "Black", price: "$110.00", image: img8077BLK, rating: 5.0 },
  { id: 6, name: "Model 8077 Executive Mocc", color: "Brown", price: "$110.00", image: img8077BRN, rating: 4.9 },
  { id: 7, name: "Model 8076 Woven Detail", color: "Black", price: "$105.00", image: img8076BLK, rating: 4.6 },
  { id: 8, name: "Model 8075 Modern Loafer", color: "Brown", price: "$99.00", image: img8075BRN, rating: 4.7 },
  { id: 9, name: "Model 8075 Modern Loafer", color: "Black", price: "$99.00", image: img8075BLK, rating: 4.8 },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-2xl tracking-tighter">LUMINA</span>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
            <a href="#new-arrivals" className="hover:text-black transition-colors">New Arrivals</a>
            <a href="#collection" className="hover:text-black transition-colors">Collection</a>
            <a href="#about" className="hover:text-black transition-colors">About Us</a>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative" data-testid="button-cart">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-black rounded-full"></span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-50 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <span className="inline-block py-1 px-3 rounded-full bg-black/5 text-xs font-medium tracking-wide mb-6 uppercase">
                New Collection 2026
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                Step into <br/>
                <span className="text-gray-400">Effortless</span> Comfort
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
                Handcrafted premium slip-on shoes designed for the modern professional. Experience unmatched all-day comfort without compromising on style.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="rounded-full h-14 px-8 text-base shadow-lg cursor-pointer" data-testid="button-shop-now">
                  Shop The Collection
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-base cursor-pointer" data-testid="button-view-lookbook">
                  View Lookbook
                </Button>
              </div>
              
              <div className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-yellow-500 mb-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-sm font-medium text-gray-600">Loved by 10,000+ customers</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-gray-50 rounded-full blur-3xl opacity-50 aspect-square animate-pulse"></div>
              <img 
                src={img8080BRN} 
                alt="Featured Shoe" 
                className="relative z-10 w-full h-auto drop-shadow-2xl hover:-translate-y-2 transition-transform duration-500 mix-blend-multiply"
              />
              {/* Floating badges */}
              <div className="absolute top-10 right-10 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl z-20 animate-bounce" style={{animationDuration: '3s'}}>
                <p className="text-sm font-bold">Premium Leather</p>
                <p className="text-xs text-gray-500">100% Genuine</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-black">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Free Express Shipping</h3>
                <p className="text-sm text-gray-500">On all orders over $150</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-black">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Secure Checkout</h3>
                <p className="text-sm text-gray-500">100% protected payments</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-black">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Easy Returns</h3>
                <p className="text-sm text-gray-500">30-day money back guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section id="collection" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Signature Collection</h2>
              <p className="text-gray-600 max-w-2xl">
                Explore our full range of masterfully crafted footwear. Every pair is designed to provide unparalleled support and sophisticated style.
              </p>
            </div>
            <Button variant="outline" className="rounded-full cursor-pointer">View All Products</Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {products.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="relative aspect-[4/3] bg-gray-50 rounded-2xl mb-4 overflow-hidden flex items-center justify-center p-6 border border-transparent group-hover:border-gray-200 transition-colors">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-auto object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex justify-center">
                    <Button className="w-full rounded-full shadow-lg" data-testid={`button-add-cart-${product.id}`}>
                      Add to Cart
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <span className="font-medium">{product.price}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <p className="text-gray-500">{product.color}</p>
                    <div className="flex items-center text-gray-400">
                      <Star className="w-3.5 h-3.5 fill-current text-yellow-500 mr-1" />
                      {product.rating}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-black text-white rounded-t-[3rem] mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Elevate your everyday step.</h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have discovered the perfect balance of luxury, durability, and comfort.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-white text-black hover:bg-gray-100 rounded-full h-14 px-8 text-base cursor-pointer" data-testid="button-footer-shop">
              Shop Now
            </Button>
            <Button size="lg" variant="outline" className="border-gray-700 text-white hover:bg-gray-800 rounded-full h-14 px-8 text-base cursor-pointer" data-testid="button-footer-about">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-12 border-t border-gray-800 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <span className="font-heading font-bold text-2xl text-white tracking-tighter block mb-4">LUMINA</span>
            <p className="max-w-sm mb-6">Crafting premium, comfortable footwear for those who demand the best in both style and everyday wearability.</p>
            <p className="text-sm">© 2026 Lumina Footwear. All rights reserved.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Bestsellers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Slip-ons</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Loafers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}