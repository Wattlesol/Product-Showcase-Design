import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Star, ArrowRight, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useState } from "react";
import { products } from "@/lib/data";
import imgBlackShoeNoBg from "@assets/products/8080_BLK_L.webp";

export default function Home() {
  const [, setLocation] = useLocation();
  const [introFinished, setIntroFinished] = useState(false);

  // Mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Map limits for rotation (adjust max rotation degrees here)
  const rotateX = useTransform(mouseY, [-500, 500], [15, -15]);
  const rotateY = useTransform(mouseX, [-500, 500], [-35, 35]);

  // Smooth rotation
  const smoothRotateX = useSpring(rotateX, { damping: 20, stiffness: 100 });
  const smoothRotateY = useSpring(rotateY, { damping: 20, stiffness: 100 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!introFinished) return;
    const { innerWidth, innerHeight } = window;
    const x = e.clientX - innerWidth / 2;
    const y = e.clientY - innerHeight / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden bg-gray-50 pt-16 pb-24 lg:pt-24 lg:pb-32"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          mouseX.set(0);
          mouseY.set(0);
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <span className="inline-block py-1 px-3 rounded-full bg-black/5 text-xs font-medium tracking-wide mb-6 uppercase">
                New Collection 2026
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                Step into <br />
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

            <div className="relative group perspective-[2000px] flex justify-center items-center min-h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-gray-50 rounded-full blur-3xl opacity-50 aspect-square animate-[pulse_4s_ease-in-out_infinite]"></div>

              <motion.div
                className="relative z-10 w-full max-w-lg cursor-grab active:cursor-grabbing"
                style={{
                  rotateX: introFinished ? smoothRotateX : 0,
                  rotateY: introFinished ? smoothRotateY : 0,
                  transformStyle: "preserve-3d"
                }}
              >
                <motion.div
                  animate={{ y: ["-3%", "3%"] }}
                  transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <motion.img
                    src={imgBlackShoeNoBg}
                    alt="Featured 3D Shoe"
                    className="w-full h-auto drop-shadow-[0_25px_35px_rgba(0,0,0,0.4)] object-contain"
                    initial={{ x: 300, scale: 0.2, opacity: 0, rotateY: 45 }}
                    animate={introFinished
                      ? { rotateZ: [-2, 2], scale: 1, opacity: 1, x: 0, rotateY: 0 }
                      : { x: 0, scale: 1, opacity: 1, rotateY: 0 }
                    }
                    transition={
                      introFinished
                        ? { rotateZ: { duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" } }
                        : { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
                    }
                    onAnimationComplete={() => setIntroFinished(true)}
                    whileHover={{ scale: 1.05 }}
                    style={{ transformStyle: "preserve-3d", originX: 0.5, originY: 0.5 }}
                  />
                </motion.div>
              </motion.div>
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
                    src={product.variants[0].image}
                    alt={product.name}
                    className="w-full h-auto object-contain mix-blend-multiply scale-120 group-hover:scale-140 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Quick View
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-sm leading-tight">{product.name}</h3>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-gray-400 line-through">PKR {product.originalPrice.toFixed(2)}</span>
                      <span className="font-bold text-sm">PKR {product.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1.5">
                      {product.variants.map(variant => (
                        <div
                          key={variant.id}
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: variant.colorCode }}
                          title={variant.color}
                        />
                      ))}
                      <span className="text-gray-500 text-xs ml-1">{product.variants.length} Color{product.variants.length !== 1 ? 's' : ''}</span>
                    </div>
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