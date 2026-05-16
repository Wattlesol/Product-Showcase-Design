import { motion } from "framer-motion";
import { MapPin, Phone, MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTracker } from "@/hooks/use-tracker";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
    const { trackTikTok } = useTracker({ skipHit: true });
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    return (
        <div className="min-h-screen bg-white py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-black/5 text-xs font-medium tracking-wide mb-6 uppercase">
                            Get in Touch
                        </span>
                        <h1 className="text-5xl md:text-6xl font-bold mb-8 tracking-tighter">Let's start a conversation.</h1>
                        <p className="text-gray-500 text-lg mb-12 leading-relaxed">
                            Have a question about our collections or need help with an order? Our team is here to provide personalized support.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0">
                                    <MapPin className="w-6 h-6 text-black" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Our Location</h3>
                                    <p className="text-gray-500">282 Ibl Homes, Jallo, Lahore<br />Punjab, Pakistan</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0">
                                    <Phone className="w-6 h-6 text-black" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Phone Number</h3>
                                    <p className="text-gray-500">03227838820</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0">
                                    <MessageCircle className="w-6 h-6 text-black" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">WhatsApp Support</h3>
                                    <p className="text-gray-500">Available 24/7 for your queries</p>
                                    <Button 
                                        variant="link" 
                                        className="p-0 h-auto text-black font-bold hover:no-underline mt-2"
                                        onClick={() => window.open("https://wa.me/923227838820", "_blank")}
                                    >
                                        Start WhatsApp Chat →
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-50 rounded-[40px] p-12 lg:p-16"
                    >
                        <h2 className="text-3xl font-bold mb-8 tracking-tight">Direct Inquiry</h2>
                        <form className="space-y-6" onSubmit={(e) => {
                            e.preventDefault();
                            setIsSubmitting(true);
                            
                            // TikTok Track CompleteRegistration
                            trackTikTok("CompleteRegistration", {
                                "value": 0,
                                "currency": "PKR"
                            });

                            setTimeout(() => {
                                setIsSubmitting(false);
                                toast({
                                    title: "Message Sent",
                                    description: "We'll get back to you as soon as possible.",
                                });
                            }, 1000);
                        }}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">First Name</label>
                                    <input required className="w-full bg-white border-none rounded-2xl h-14 px-6 focus:ring-2 focus:ring-black transition-all" placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Last Name</label>
                                    <input required className="w-full bg-white border-none rounded-2xl h-14 px-6 focus:ring-2 focus:ring-black transition-all" placeholder="Doe" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address</label>
                                <input required type="email" className="w-full bg-white border-none rounded-2xl h-14 px-6 focus:ring-2 focus:ring-black transition-all" placeholder="john@example.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Message</label>
                                <textarea required className="w-full bg-white border-none rounded-2xl p-6 min-h-[150px] focus:ring-2 focus:ring-black transition-all" placeholder="How can we help you?" />
                            </div>
                            <Button className="w-full h-14 rounded-2xl text-base font-bold" disabled={isSubmitting}>
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
