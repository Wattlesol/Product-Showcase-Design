import { motion } from "framer-motion";

export default function TermsConditions() {
    return (
        <div className="min-h-screen bg-white py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-12 tracking-tighter">Terms & Conditions</h1>
                    
                    <div className="prose prose-lg max-w-none text-gray-600 space-y-8">
                        <p>Welcome to Lumina Footwear. By accessing or using our website, you agree to be bound by these Terms & Conditions. Please read them carefully before making a purchase.</p>

                        <section>
                            <h2 className="text-2xl font-bold text-black mb-4">1. Use of Website</h2>
                            <p>You may use our website for personal, non-commercial purposes only. You must not use this website for any fraudulent or illegal activity.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-black mb-4">2. Product Accuracy</h2>
                            <p>We make every effort to display the colors and details of our products as accurately as possible. However, the actual colors you see will depend on your monitor, and we cannot guarantee that your monitor's display of any color will be accurate.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-black mb-4">3. Pricing and Payments</h2>
                            <p>All prices are listed in Pakistani Rupees (PKR). We reserve the right to change prices at any time without prior notice. We currently accept Cash on Delivery and other electronic payment methods as specified at checkout.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-black mb-4">4. Order Acceptance</h2>
                            <p>Lumina Footwear reserves the right to refuse or cancel any order for any reason, including limitations on quantities available for purchase, inaccuracies in product or pricing information, or problems identified by our credit and fraud avoidance department.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-black mb-4">5. Intellectual Property</h2>
                            <p>The content, design, and graphics on this website are owned by Lumina Footwear. You may not reproduce, distribute, or use any part of this website without our prior written consent.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-black mb-4">6. Limitation of Liability</h2>
                            <p>Lumina Footwear shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our products or website.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-black mb-4">7. Governing Law</h2>
                            <p>These terms and conditions are governed by the laws of Pakistan. Any disputes arising from the use of this website will be subject to the exclusive jurisdiction of the courts in Lahore.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-black mb-4">Contact</h2>
                            <p>If you have any questions about our Terms & Conditions, please contact us at 03227838820.</p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
