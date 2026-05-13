import { motion } from "framer-motion";

export default function ShippingPolicy() {
    return (
        <div className="min-h-screen bg-white py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-12 tracking-tighter">Shipping & Return Policy</h1>
                    
                    <div className="prose prose-lg max-w-none text-gray-600 space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold text-black mb-4">Shipping Information</h2>
                            <p>At Lumina Footwear, we strive to deliver your orders as quickly as possible. We currently offer shipping all across Pakistan.</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Processing Time:</strong> Orders are typically processed within 24 to 48 hours of confirmation.</li>
                                <li><strong>Delivery Time:</strong> Standard delivery takes 3-5 business days. Please note that during sales or holiday seasons, delivery times may be slightly extended.</li>
                                <li><strong>Shipping Charges:</strong> We offer competitive shipping rates. Shipping costs will be calculated and displayed at checkout.</li>
                                <li><strong>Tracking:</strong> Once your order is shipped, you will receive a confirmation message with your tracking details.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-black mb-4">Returns & Exchanges</h2>
                            <p>We want you to be completely satisfied with your purchase. If for any reason you are not happy, we offer a 7-day return and exchange policy.</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Condition:</strong> Products must be returned in their original condition, unused, with all tags attached and in the original packaging.</li>
                                <li><strong>Size Exchanges:</strong> If the size doesn't fit, we offer free size exchanges (subject to availability). Please contact our support team to reserve your new size.</li>
                                <li><strong>Damaged Items:</strong> If you receive a damaged or defective item, please contact us within 24 hours of delivery with photos of the product.</li>
                                <li><strong>Return Process:</strong> To initiate a return, please contact our WhatsApp support at 03227838820. You will be responsible for shipping the item back to our warehouse.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-black mb-4">Refunds</h2>
                            <p>Once we receive and inspect your returned item, we will notify you of the approval or rejection of your refund. Approved refunds will be processed via Bank Transfer or EasyPaisa/JazzCash within 7 business days.</p>
                        </section>

                        <section className="bg-gray-50 p-8 rounded-3xl mt-12">
                            <h2 className="text-xl font-bold text-black mb-2">Need Help?</h2>
                            <p className="mb-0">For any questions regarding shipping or returns, please reach out to us on WhatsApp: <strong>03227838820</strong></p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
