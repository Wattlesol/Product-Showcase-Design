import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Star, ShieldCheck, Truck, RefreshCw, ChevronLeft, ChevronRight, ShoppingBag, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { products } from "@/lib/data";
import { useCart } from "@/lib/cart-context";

import { useQuery } from "@tanstack/react-query";

export default function ProductPage() {
  const [, params] = useRoute("/product/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { addItem, items } = useCart();
  const [selectedSize, setSelectedSize] = useState("");

  const { data: inventoryData } = useQuery<Record<string, Record<string, number>>>({
    queryKey: ['inventory'],
    queryFn: async () => {
      const res = await fetch('/api/inventory');
      if (!res.ok) return null as any;
      return res.json() as Promise<Record<string, Record<string, number>>>;
    }
  });

  const product = products.find(p => p.id === Number(params?.id)) || products[0];
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);

  // 0 = Left, 1 = Center, 2 = Right
  const [viewIndex, setViewIndex] = useState(1);
  const [direction, setDirection] = useState(0);

  // Track product view
  useEffect(() => {
    if (product) {
      // @ts-ignore
      const ttq = window.ttq;
      if (ttq) {
        ttq.track("ViewContent", {
          "contents": [
            {
              "content_id": String(product.id),
              "content_type": "product",
              "content_name": product.name,
              "quantity": 1,
              "price": product.price
            }
          ],
          "value": product.price,
          "currency": "PKR"
        });
      }
    }
  }, [product]);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      price: product.price,
      image: selectedVariant.image,
      color: selectedVariant.color,
      size: selectedSize,
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} (${selectedVariant.color}, Size ${selectedSize}) has been added to your cart.`,
    });

    // TikTok Track AddToCart
    // @ts-ignore
    const ttq = window.ttq;
    if (ttq) {
      ttq.track("AddToCart", {
        "contents": [
          {
            "content_id": String(product.id),
            "content_type": "product",
            "content_name": product.name,
            "quantity": 1,
            "price": product.price
          }
        ],
        "value": product.price,
        "currency": "PKR"
      });
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      z: 1,
      x: 0,
      opacity: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      z: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      rotateY: direction < 0 ? 45 : -45,
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const changeView = (newDir: number) => {
    const newIndex = viewIndex + newDir;
    if (newIndex >= 0 && newIndex <= 2) {
      setDirection(newDir);
      setViewIndex(newIndex);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24">

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Image Gallery (Pseudo 3D) */}
          <div className="relative bg-gray-50 rounded-3xl p-12 flex items-center justify-center aspect-square overflow-hidden border border-gray-100 group">

            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={`${selectedVariant.id}-${viewIndex}`}
                src={selectedVariant.images3D[viewIndex]}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                  rotateY: { type: "spring", stiffness: 200, damping: 30 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) {
                    changeView(1); // Swipe left = next view (Right profile)
                  } else if (swipe > swipeConfidenceThreshold) {
                    changeView(-1); // Swipe right = prev view (Left profile)
                  }
                }}
                alt={product.name}
                className="absolute w-[80%] h-[80%] object-contain mix-blend-multiply cursor-grab active:cursor-grabbing transition-transform duration-500 scale-125 sm:scale-140"
              />
            </AnimatePresence>

            {/* View Controls */}
            <div className="absolute bottom-6 flex gap-2">
              {[0, 1, 2].map(idx => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > viewIndex ? 1 : -1);
                    setViewIndex(idx);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${viewIndex === idx ? 'bg-black w-8' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  aria-label={`View ${idx}`}
                />
              ))}
            </div>

            {/* 3D Indicator */}
            <div className="absolute top-6 right-6 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold tracking-widest text-gray-500 shadow-sm border border-black/5">
              360° SWIPE
            </div>

            {/* Arrows */}
            {viewIndex > 0 && (
              <button onClick={() => changeView(-1)} className="absolute left-4 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white text-gray-600 transition opacity-0 group-hover:opacity-100">
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {viewIndex < 2 && (
              <button onClick={() => changeView(1)} className="absolute right-4 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white text-gray-600 transition opacity-0 group-hover:opacity-100">
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center text-yellow-500">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className={`w-4 h-4 ${i <= Math.floor(product.rating) ? 'fill-current' : ''}`} />)}
                </div>
                <span className="text-sm font-medium text-gray-500">({product.rating} / 5.0)</span>
              </div>
              <h1 className="text-4xl font-bold mb-4 tracking-tight">{product.name}</h1>
              <div className="flex items-baseline gap-3 mb-4">
                <p className="text-3xl font-bold text-gray-900">PKR {product.price.toFixed(2)}</p>
                <p className="text-xl text-gray-400 line-through">PKR {product.originalPrice.toFixed(2)}</p>
              </div>
            </div>

            <div className="mb-8 pb-8 border-b border-gray-100">
              <p className="text-gray-600 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            <div className="space-y-6 mb-10">
              <div className="mb-6">
                <label className="block text-sm font-bold uppercase tracking-wider mb-4">Color: <span className="text-gray-500 font-normal">{selectedVariant.color}</span></label>
                <div className="flex gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`w-12 h-12 rounded-full border-2 p-1 transition-all ${selectedVariant.id === variant.id
                        ? 'border-black'
                        : 'border-transparent hover:border-gray-300'
                        }`}
                      title={variant.color}
                    >
                      <span
                        className="block w-full h-full rounded-full border border-gray-200 shadow-sm"
                        style={{ backgroundColor: variant.colorCode }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wider mb-4">Select Size</label>
                <div className="grid grid-cols-4 gap-3">
                  {["6", "7", "8", "9", "10", "11"].map((size) => {
                    const isOutOfStock = inventoryData && inventoryData[selectedVariant.id] && inventoryData[selectedVariant.id][size] <= 0;
                    return (
                      <button
                        key={size}
                        disabled={isOutOfStock}
                        onClick={() => setSelectedSize(size)}
                        className={`h-12 border rounded-xl font-medium transition-all 
                          ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black'}
                          ${isOutOfStock ? 'opacity-30 cursor-not-allowed line-through hover:border-gray-200' : ''}
                        `}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <Button
                  size="lg"
                  className="flex-1 h-16 rounded-2xl text-lg font-bold shadow-xl shadow-black/10 cursor-pointer flex items-center justify-center gap-2"
                  disabled={!selectedSize}
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="w-5 h-5" />
                  {selectedSize ? 'Add to Cart' : 'Select a Size'}
                </Button>

                {items.length > 0 && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 h-16 rounded-2xl text-lg font-bold border-2 border-black hover:bg-black hover:text-white transition-all shadow-xl shadow-black/5 cursor-pointer flex items-center justify-center gap-2"
                    onClick={() => setLocation("/checkout")}
                  >
                    Checkout
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                )}
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