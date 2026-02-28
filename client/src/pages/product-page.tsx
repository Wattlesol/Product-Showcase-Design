import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, ArrowLeft, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { useState } from "react";
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
  { id: 1, name: "Model 8080 Classic Slip-On", color: "Brown", price: 89.00, image: img8080BRN, rating: 4.8, description: "Our flagship slip-on model, featuring premium top-grain leather and a reinforced ergonomic sole for all-day professional wear." },
  { id: 2, name: "Model 8080 Classic Slip-On", color: "Black", price: 89.00, image: img8080BLK, rating: 4.9, description: "Our flagship slip-on model in classic black, featuring premium top-grain leather and a reinforced ergonomic sole." },
  { id: 3, name: "Model 8079 Comfort Loafer", color: "Brown", price: 95.00, image: img8079BRN, rating: 4.7, description: "A sophisticated loafer with extra padding and a flexible outsole, perfect for transitioning from office to evening." },
  { id: 4, name: "Model 8079 Comfort Loafer", color: "Black", price: 95.00, image: img8079BLK, rating: 4.8, description: "A sophisticated loafer in jet black with extra padding and a flexible outsole." },
  { id: 5, name: "Model 8077 Executive Mocc", color: "Black", price: 110.00, image: img8077BLK, rating: 5.0, description: "The ultimate executive choice. Hand-stitched detailing meets a plush interior for a truly luxurious walking experience." },
  { id: 6, name: "Model 8077 Executive Mocc", color: "Brown", price: 110.00, image: img8077BRN, rating: 4.9, description: "Hand-stitched executive moccasin in rich brown leather with a plush, comfortable interior." },
  { id: 7, name: "Model 8076 Woven Detail", color: "Black", price: 105.00, image: img8076BLK, rating: 4.6, description: "Unique woven textures set this pair apart. Breathable design without sacrificing structural integrity." },
  { id: 8, name: "Model 8075 Modern Loafer", color: "Brown", price: 99.00, image: img8075BRN, rating: 4.7, description: "A contemporary take on the traditional loafer, featuring a streamlined silhouette and lightweight materials." },
  { id: 9, name: "Model 8075 Modern Loafer", color: "Black", price: 99.00, image: img8075BLK, rating: 4.8, description: "Contemporary black loafer with a streamlined silhouette, perfect for modern professional wardrobes." },
];

export default function ProductPage() {
  const [, params] = useRoute("/product/:id");
  const [, setLocation] = useLocation();
  const [selectedSize, setSelectedSize] = useState("");
  
  const product = products.find(p => p.id === Number(params?.id)) || products[0];

  const handleCheckout = () => {
    localStorage.setItem('checkout_item', JSON.stringify({
      ...product,
      size: selectedSize
    }));
    setLocation("/checkout");
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      <nav className="border-b border-gray-100 h-16 flex items-center bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between">
          <Button variant="ghost" onClick={() => setLocation("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Button>
          <span className="font-heading font-bold text-xl tracking-tighter">LUMINA</span>
          <div className="w-24"></div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Image */}
          <div className="bg-gray-50 rounded-3xl p-12 flex items-center justify-center aspect-square overflow-hidden border border-gray-100">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-auto object-contain mix-blend-multiply hover:scale-110 transition-transform duration-700"
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center text-yellow-500">
                  {[1,2,3,4,5].map(i => <Star key={i} className={`w-4 h-4 ${i <= Math.floor(product.rating) ? 'fill-current' : ''}`} />)}
                </div>
                <span className="text-sm font-medium text-gray-500">({product.rating} / 5.0)</span>
              </div>
              <h1 className="text-4xl font-bold mb-4 tracking-tight">{product.name}</h1>
              <p className="text-3xl font-light text-gray-900">${product.price.toFixed(2)}</p>
            </div>

            <div className="mb-8 pb-8 border-b border-gray-100">
              <p className="text-gray-600 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            <div className="space-y-6 mb-10">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider mb-4">Select Size</label>
                <div className="grid grid-cols-4 gap-3">
                  {["7", "8", "9", "10", "11", "12"].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-12 border rounded-xl font-medium transition-all ${
                        selectedSize === size 
                        ? 'border-black bg-black text-white' 
                        : 'border-gray-200 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  size="lg" 
                  className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl shadow-black/10 cursor-pointer"
                  disabled={!selectedSize}
                  onClick={handleCheckout}
                >
                  {selectedSize ? 'Proceed to Checkout' : 'Select a Size'}
                </Button>
              </div>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="w-5 h-5 text-gray-400" />
                <span className="text-xs font-medium uppercase tracking-tighter">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RefreshCw className="w-5 h-5 text-gray-400" />
                <span className="text-xs font-medium uppercase tracking-tighter">30-Day Returns</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gray-400" />
                <span className="text-xs font-medium uppercase tracking-tighter">Secure Order</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}