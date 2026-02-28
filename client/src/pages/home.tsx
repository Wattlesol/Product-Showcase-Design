import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Star, ArrowRight, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";
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
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Header Promo */}
      <div className="bg-black text-white py-2 px-4 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Free express shipping on all orders this week</p>
      </div>
      
      {/* Navigation */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-2xl tracking-tighter cursor-pointer" onClick={() => setLocation("/")}>LUMINA</span>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
            <a href="#collection" className="hover:text-black transition-colors">Collection</a>
            <a href="/shop" className="hover:text-black transition-colors">Men</a>
            <a href="/shop" className="hover:text-black transition-colors">Accessories</a>
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
                <Button size="lg" className="rounded-full h-14 px-8 text-base shadow-lg cursor-pointer" data-testid="button-shop-now" onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}>
                  Shop The Collection
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-gray-50 rounded-full blur-3xl opacity-50 aspect-square animate-pulse"></div>
              <img 
                src={img8080BRN} 
                alt="Featured Shoe" 
                className="relative z-10 w-full h-auto drop-shadow-2xl hover:-translate-y-2 transition-transform duration-500 mix-blend-multiply"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section id="collection" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tighter">Signature Collection</h2>
              <p className="text-gray-500 max-w-2xl">Masterfully crafted for unparalleled support.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {products.map((product) => (
              <div key={product.id} className="group cursor-pointer" onClick={() => setLocation(`/product/${product.id}`)}>
                <div className="relative aspect-[4/3] bg-gray-50 rounded-3xl mb-4 overflow-hidden flex items-center justify-center p-6 border border-gray-100 group-hover:bg-gray-100 transition-all duration-500">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-auto object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Quick View
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-lg tracking-tight">{product.name}</h3>
                    <span className="font-bold">{product.price}</span>
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
    </div>
  );
}