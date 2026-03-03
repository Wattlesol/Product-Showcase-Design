import { motion } from "framer-motion";
import { products } from "@/lib/data";
import { ShieldCheck, ArrowRight, Star, Heart, Clock, User } from "lucide-react";

export default function Blog() {
    const featuredProduct = products[0]; // 8080 Black

    return (
        <div className="min-h-screen bg-white pb-24">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-gray-50">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-white" />
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block py-1 px-3 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-widest mb-6"
                    >
                        Wellness & Innovation
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight mb-6"
                    >
                        The Ultimate Guide to <span className="text-gray-400 font-medium italic">Medicated Comfortable Shoes</span>: Why Your Feet Deserve Better
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center justify-center gap-6 text-sm text-gray-500 font-medium"
                    >
                        <span className="flex items-center gap-2"><User className="w-4 h-4" /> Dr. Wellness</span>
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> 8 Min Read</span>
                        <span className="flex items-center gap-2 text-yellow-500"><Star className="w-4 h-4 fill-current" /> SEO Expert Choice</span>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <article className="max-w-3xl mx-auto px-4 mt-20 space-y-12">
                <header className="space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight">Understanding the Science of Medicated Footwear</h2>
                    <p className="text-lg text-gray-600 leading-relaxed italic">
                        Did you know that the average person walks over 115,000 miles in their lifetime? That's almost four times around the earth. Yet, many of us ignore the most critical equipment we use every day: our shoes.
                    </p>
                </header>

                <section className="space-y-6">
                    <p className="text-gray-700 leading-relaxed text-lg">
                        In the modern world, <strong>medicated comfortable shoes</strong> have evolved from simple clinical tools into high-performance lifestyle assets. But what exactly defines a medicated shoe, and why is it essential for your health? Unlike standard mass-market footwear, Lumina's signature collection is engineered with therapeutic principles to provide more than just coverage—it provides <em>orthopedic support</em>.
                    </p>

                    <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4">
                            <h3 className="text-xl font-bold">The Lumina 8080 Difference</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Our flagship 8080 model features a precision-molded orthopedic sole that realigns the natural curvature of your foot, reducing stress on the lower back and knees.
                            </p>
                            <ul className="text-sm space-y-2 font-medium">
                                <li className="flex items-center gap-2 text-green-600"><ShieldCheck className="w-4 h-4" /> Anatomical Arch Support</li>
                                <li className="flex items-center gap-2 text-green-600"><ShieldCheck className="w-4 h-4" /> Shock-Absorbent EVA Midsole</li>
                                <li className="flex items-center gap-2 text-green-600"><ShieldCheck className="w-4 h-4" /> Breathable Microfiber Lining</li>
                            </ul>
                        </div>
                        <div className="w-48 h-48 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                            <img src={featuredProduct.variants[0].image} alt="Lumina 8080 Medicated Shoe" className="w-full h-full object-contain mix-blend-multiply" />
                        </div>
                    </div>
                </section>

                <section className="space-y-8">
                    <h2 className="text-2xl font-bold tracking-tight">Top 5 Benefits of Switching to Medicated Comfortable Shoes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { title: "Pain Relief", desc: "Targeted support for plantar fasciitis, bunions, and general heel pain." },
                            { title: "Improved Posture", desc: "Correcting your gait from the ground up to prevent joint fatigue." },
                            { title: "Enhanced Circulation", desc: "Ample room for movement preventing restricted blood flow." },
                            { title: "All-Day Comfort", desc: "Soft-cushion technology for standing and walking long hours." }
                        ].map((benefit, i) => (
                            <div key={i} className="p-6 rounded-2xl border border-gray-100 hover:border-black/10 transition-colors">
                                <Heart className="w-6 h-6 text-red-400 mb-4" />
                                <h4 className="font-bold mb-2">{benefit.title}</h4>
                                <p className="text-sm text-gray-500 leading-relaxed">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="py-12 border-y border-gray-100 italic text-2xl font-medium text-center text-gray-400">
                    "Your feet are the foundation of your body. If the foundation is weak, the entire structure suffers."
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight">How to Choose the Right Medicated Shoe for You</h2>
                    <p className="text-gray-700 leading-relaxed">
                        When searching for the perfect pair, look beyond the aesthetics. A true <strong>medicated comfortable shoe</strong> should offer a combination of depth, width, and stability. Lumina shoes are designed with a wide toe-box to accommodate natural foot expansion, ensuring you never feel restricted.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {products.slice(0, 3).map(p => (
                            <div key={p.id} className="aspect-square bg-gray-50 rounded-2xl p-4 flex items-center justify-center border border-gray-100">
                                <img src={p.variants[0].image} alt={p.name} className="w-full h-auto object-contain mix-blend-multiply" />
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-center text-gray-400 uppercase tracking-widest font-bold">Featured: Our Therapeutic Collection 2026</p>
                </section>

                <footer className="bg-black text-white rounded-[2rem] p-10 md:p-16 space-y-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold">Ready to Step into a Pain-Free Life?</h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            Join thousands of satisfied customers who have reclaimed their mobility with Lumina's medicated comfort technology.
                        </p>
                        <button
                            onClick={() => window.location.href = "/"}
                            className="bg-white text-black px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
                        >
                            Shop Collection <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </footer>
            </article>

            {/* SEO Microdata Placeholder */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "BlogPosting",
                    "headline": "The Ultimate Guide to Medicated Comfortable Shoes",
                    "description": "Expert level guide on selecting medicated comfortable shoes for orthopedic health and pain relief.",
                    "author": {
                        "@type": "Person",
                        "name": "Dr. Wellness"
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "Lumina Footwear"
                    },
                    "mainEntityOfPage": {
                        "@type": "WebPage",
                        "@id": "https://luminafootwear.com/blog"
                    }
                })}
            </script>
        </div>
    );
}
