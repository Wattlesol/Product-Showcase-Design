import { Button } from "@/components/ui/button";
import { Star, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useCallback, useEffect, useRef } from "react";
import { useProducts } from "@/hooks/use-products";
import { Product, Variant } from "@shared/schema";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

// Hero slides use direct API endpoint — the server resizes & compresses via sharp
const heroSlides = [
  {
    id: 1,
    title: "Step into Effortless Comfort",
    subtitle: "New Collection 2026",
    description: "Handcrafted premium slip-on shoes designed for the modern professional. Experience unmatched all-day comfort.",
    image: "/api/products/image/8080-blk/L?w=900",
    category: "Shoes",
    target: "shoes-collection"
  },
  {
    id: 2,
    title: "Carry Your Ambition",
    subtitle: "Handbag Series",
    description: "Elegant, durable, and spacious. Our premium leather handbags are crafted for those who move with purpose.",
    image: "/api/products/image/IDT-04/C?w=900",
    category: "Bags",
    target: "bags-collection"
  }
];

// ── Intersection-Observer based lazy mount ─────────────────────────────────
function LazySection({
  children, id, title, subtitle, className
}: {
  children: React.ReactNode;
  id: string;
  title: string;
  subtitle: string;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setMounted(true); observer.disconnect(); } },
      { rootMargin: "500px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} id={id} className={className}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tighter">{title}</h2>
          <p className="text-gray-500 max-w-xl">{subtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {mounted ? children : (
            // Reserve space to prevent CLS
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-gray-100 rounded-3xl animate-pulse" />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

// ── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, setLocation }: { product: Product; setLocation: (url: string) => void }) {
  return (
    <div className="group cursor-pointer" onClick={() => setLocation(`/product/${product.id}`)}>
      <div className="relative aspect-[4/3] bg-gray-100/50 rounded-3xl mb-4 overflow-hidden flex items-center justify-center p-6 border border-gray-100 group-hover:bg-gray-100 transition-colors duration-300">
        <img
          src={`${product.variants[0].image}?w=480`}
          alt={product.name}
          width="480"
          height="360"
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-contain mix-blend-multiply scale-110 group-hover:scale-125 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          Quick View
        </div>
      </div>
      <div>
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-sm leading-tight">{product.name}</h3>
          <div className="flex flex-col items-end">
            {product.originalPrice && (
              <span className="text-[10px] text-gray-400 line-through">PKR {product.originalPrice.toFixed(2)}</span>
            )}
            <span className="font-bold text-sm">PKR {product.price.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-1.5">
            {product.category === "Shoes" && product.variants.map((variant: Variant) => (
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
                : "Premium Edition"}
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

// ── Home Page ─────────────────────────────────────────────────────────────────
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
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  if (isLoading || !products) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const shoes = products.filter(p => p.category === "Shoes");
  const bags = products.filter(p => p.category === "Bags");

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero Slider ── */}
      <section className="relative overflow-hidden bg-gray-50 pt-8">
        <div className="embla" ref={emblaRef}>
          <div className="embla__container flex">
            {heroSlides.map((slide, slideIndex) => (
              <div key={slide.id} className="embla__slide flex-[0_0_100%] min-w-0 relative py-12 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Text */}
                    <div className="max-w-2xl">
                      <span className="inline-block py-1 px-3 rounded-full bg-black/5 text-xs font-medium tracking-wide mb-6 uppercase">
                        {slide.subtitle}
                      </span>
                      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                        {slide.title.split(' ').map((word, i) => (
                          <span key={i} className={i === 2 ? "text-gray-400" : ""}>{word} </span>
                        ))}
                      </h1>
                      <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">{slide.description}</p>
                      <Button
                        size="lg"
                        className="rounded-full h-14 px-8 text-base shadow-lg cursor-pointer"
                        onClick={() => document.getElementById(slide.target)?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        Shop Now <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </div>

                    {/* Hero Image — explicit w/h to prevent CLS, eager for LCP */}
                    <div className="relative flex justify-center items-center min-h-[320px] sm:min-h-[400px]">
                      <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-gray-50 rounded-full blur-3xl opacity-50 aspect-square" />
                      <img
                        src={slide.image}
                        alt={slide.title}
                        width="600"
                        height="600"
                        fetchPriority={slideIndex === 0 ? "high" : "low"}
                        loading={slideIndex === 0 ? "eager" : "lazy"}
                        decoding={slideIndex === 0 ? "sync" : "async"}
                        className="relative z-10 w-full max-w-lg h-auto object-contain mix-blend-multiply drop-shadow-[0_25px_35px_rgba(0,0,0,0.25)]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slider Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${selectedIndex === index ? 'w-6 bg-black' : 'w-2 bg-gray-300'}`}
            />
          ))}
        </div>
      </section>

      {/* ── Trust Badges ── */}
      <div className="py-8 border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Premium Materials", value: "Italian Leather" },
              { label: "Handcrafted", value: "Expert Artisans" },
              { label: "Free Shipping", value: "Worldwide" },
              { label: "Sustainable", value: "Eco-Conscious" }
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center text-center py-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{badge.label}</span>
                <span className="text-sm font-semibold">{badge.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Shoes Collection (lazy-mounted) ── */}
      <LazySection
        id="shoes-collection"
        title="Signature Collection"
        subtitle="Masterfully crafted for unparalleled support."
        className="py-20 bg-white"
      >
        {shoes.map((product) => (
          <ProductCard key={product.id} product={product} setLocation={setLocation} />
        ))}
      </LazySection>

      {/* ── Bags Collection (lazy-mounted) ── */}
      <LazySection
        id="bags-collection"
        title="Handbags Collection"
        subtitle="Elegance meets functionality in every stitch."
        className="py-20 bg-gray-50/50"
      >
        {bags.map((product) => (
          <ProductCard key={product.id} product={product} setLocation={setLocation} />
        ))}
      </LazySection>
    </div>
  );
}