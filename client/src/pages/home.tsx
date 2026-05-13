import { Button } from "@/components/ui/button";
import { Star, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import { useProducts } from "@/hooks/use-products";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

// Hero Images
import imgBlackShoeHero from "@assets/products/8080_BLK_L.webp";
import imgBagHero from "@assets/products/IDT-04_C.webp";

const heroSlides = [
  {
    id: 1,
    title: "Step into Effortless Comfort",
    subtitle: "New Collection 2026",
    description: "Handcrafted premium slip-on shoes designed for the modern professional. Experience unmatched all-day comfort.",
    image: imgBlackShoeHero,
    category: "Shoes",
    target: "shoes-collection"
  },
  {
    id: 2,
    title: "Carry Your Ambition",
    subtitle: "Handbag Series",
    description: "Elegant, durable, and spacious. Our premium leather handbags are crafted for those who move with purpose.",
    image: imgBagHero,
    category: "Bags",
    target: "bags-collection"
  }
];

export default function Home() {
  const [, setLocation] = useLocation();
  const { data: products, isLoading } = useProducts();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  // Mouse tracking for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-500, 500], [15, -15]);
  const rotateY = useTransform(mouseX, [-500, 500], [-35, 35]);
  const smoothRotateX = useSpring(rotateX, { damping: 20, stiffness: 100 });
  const smoothRotateY = useSpring(rotateY, { damping: 20, stiffness: 100 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    const x = e.clientX - innerWidth / 2;
    const y = e.clientY - innerHeight / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  if (isLoading || !products) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const shoes = products.filter(p => p.category === "Shoes");
  const bags = products.filter(p => p.category === "Bags");

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Slider */}
      <section className="relative overflow-hidden bg-gray-50 pt-8" onMouseMove={handleMouseMove}>
        <div className="embla" ref={emblaRef}>
          <div className="embla__container flex">
            {heroSlides.map((slide) => (
              <div key={slide.id} className="embla__slide flex-[0_0_100%] min-w-0 relative py-12 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="max-w-2xl">
                      <span className="inline-block py-1 px-3 rounded-full bg-black/5 text-xs font-medium tracking-wide mb-6 uppercase">
                        {slide.subtitle}
                      </span>
                      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                        {slide.title.split(' ').map((word, i) => (
                          <span key={i} className={i === 2 ? "text-gray-400" : ""}>{word} </span>
                        ))}
                      </h1>
                      <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
                        {slide.description}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="rounded-full h-14 px-8 text-base shadow-lg cursor-pointer" onClick={() => document.getElementById(slide.target)?.scrollIntoView({ behavior: 'smooth' })}>
                          Shop Now
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    <div className="relative group perspective-[2000px] flex justify-center items-center min-h-[400px]">
                      <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-gray-50 rounded-full blur-3xl opacity-50 aspect-square animate-[pulse_4s_ease-in-out_infinite]"></div>
                      <motion.div
                        className="relative z-10 w-full max-w-lg"
                        style={{
                          rotateX: smoothRotateX,
                          rotateY: smoothRotateY,
                          transformStyle: "preserve-3d"
                        }}
                      >
                        <motion.img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-auto drop-shadow-[0_25px_35px_rgba(0,0,0,0.3)] object-contain mix-blend-multiply transition-all duration-500 hover:scale-105"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.8 }}
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Slider Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all ${selectedIndex === index ? 'bg-black w-6' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </section>

      {/* Shoes Collection */}
      <section id="shoes-collection" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tighter">Signature Collection</h2>
              <p className="text-gray-500 max-w-2xl">Masterfully crafted for unparalleled support.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {shoes.map((product) => (
              <ProductCard key={product.id} product={product} setLocation={setLocation} />
            ))}
          </div>
        </div>
      </section>

      {/* Bags Collection */}
      <section id="bags-collection" className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tighter">Handbags Collection</h2>
              <p className="text-gray-500 max-w-2xl">Elegance meets functionality in every stitch.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {bags.map((product) => (
              <ProductCard key={product.id} product={product} setLocation={setLocation} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product, setLocation }: { product: any, setLocation: any }) {
  return (
    <div className="group cursor-pointer" onClick={() => setLocation(`/product/${product.id}`)}>
      <div className="relative aspect-[4/3] bg-gray-100/50 rounded-3xl mb-4 overflow-hidden flex items-center justify-center p-6 border border-gray-100 group-hover:bg-gray-100 transition-all duration-500">
        <img
          src={product.variants[0].image}
          alt={product.name}
          className="w-full h-auto object-contain mix-blend-multiply scale-110 group-hover:scale-125 transition-transform duration-700"
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
            {product.category === "Shoes" && product.variants.map((variant: any) => (
              <div
                key={variant.id}
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: variant.colorCode }}
                title={variant.color}
              />
            ))}
            <span className="text-gray-500 text-xs ml-1">
              {product.category === "Shoes" 
                ? `${product.variants.length} Color${product.variants.length !== 1 ? 's' : ''}`
                : "Premium Edition"
              }
            </span>
          </div>
          <div className="flex items-center text-gray-400">
            <Star className="w-3.5 h-3.5 fill-current text-yellow-500 mr-1" />
            {product.rating}
          </div>
        </div>
      </div>
    </div>
  );
}