import { motion } from "framer-motion";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-12 tracking-tighter">Privacy Policy</h1>
                    
                    <div className="prose prose-lg max-w-none text-gray-600 space-y-8">
                        <p>At Lumina Footwear, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your personal information when you visit our website or make a purchase.</p>

                        <section>
                            <h2 className="text-2xl font-bold text-black mb-4">Information We Collect</h2>
                            <p>When you visit Lumina Footwear, we collect certain information about your device, your interaction with the site, and information necessary to process your purchases. This includes:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Personal Details:</strong> Name, shipping address, billing address, payment information, email address, and phone number.</li>
                                <li><strong>Device Information:</strong> Browser type, IP address, time zone, and some of the cookies that are installed on your device.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-black mb-4">How We Use Your Information</h2>
                            <p>We use the personal information we collect to fulfill any orders placed through the Site, including:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Processing your payment information and arranging for shipping.</li>
                                <li>Providing you with invoices and/or order confirmations.</li>
                                <li>Communicating with you regarding your order.</li>
                                <li>Screening our orders for potential risk or fraud.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-black mb-4">Data Protection</h2>
                            <p>We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-black mb-4">Updates</h2>
                            <p>We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-black mb-4">Contact Us</h2>
                            <p>For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e‑mail at admin@wattlesol.com or via WhatsApp at 03227838820.</p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
