import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
    {
        question: "What makes Lumina Footwear different from other brands?",
        answer: "Lumina Footwear combines premium materials with ergonomic design. We focus on 'Effortless Comfort' for professionals who spend long hours on their feet. Our shoes are handcrafted with top-grain leather and reinforced soles to ensure durability and style."
    },
    {
        question: "Where are you located and do you have a physical store?",
        answer: "Our main distribution hub is located at 282 Ibl Homes, Jallo, Lahore, Punjab, Pakistan. Currently, we operate primarily as a premium online-first brand, allowing us to offer high-end quality at competitive prices."
    },
    {
        question: "How long does shipping take within Pakistan?",
        answer: "We typically process orders within 24-48 hours. Delivery usually takes 3-5 business days across Pakistan. For major cities like Lahore, Karachi, and Islamabad, you might receive your order even sooner."
    },
    {
        question: "What is your return and exchange policy?",
        answer: "We offer a 7-day hassle-free return and exchange policy. If the size doesn't fit or you're not satisfied with the quality, you can contact our WhatsApp support at 03227838820 to initiate a return. Please ensure the product is unused and in its original packaging."
    },
    {
        question: "Do you offer Cash on Delivery (COD)?",
        answer: "Yes, we offer Cash on Delivery (COD) services all over Pakistan to ensure a secure and trustworthy shopping experience for our customers."
    },
    {
        question: "How do I find my correct shoe size?",
        answer: "We follow standard UK/Pakistan sizing. We recommend checking our Size Guide (available in the footer) for precise measurements. If you're between sizes, we generally recommend going for the larger size for the most comfortable fit."
    },
    {
        question: "Are your handbags made of genuine leather?",
        answer: "Yes, our premium handbags and totes are crafted from high-quality leather and premium synthetic materials designed for durability, featuring reinforced stitching and premium hardware."
    }
];

export default function FAQ() {
    return (
        <div className="min-h-screen bg-white py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter">Frequently Asked Questions</h1>
                    <p className="text-gray-500 text-lg">Everything you need to know about Lumina products and services.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-100 py-2">
                                <AccordionTrigger className="text-left font-bold text-lg hover:no-underline hover:text-gray-600">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 text-base leading-relaxed pt-2 pb-4">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>

                <div className="mt-20 p-8 bg-gray-50 rounded-3xl text-center">
                    <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
                    <p className="text-gray-500 mb-6">Can't find the answer you're looking for? Please chat with our friendly team.</p>
                    <a 
                        href="https://wa.me/923227838820" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-8 py-4 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-colors"
                    >
                        Contact via WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
}
