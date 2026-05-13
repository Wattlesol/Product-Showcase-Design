import { MessageCircle } from "lucide-react";

// Replaced framer-motion with pure CSS animations to reduce JS bundle ~150KB
export default function WhatsAppWidget() {
    const phoneNumber = "923227838820";
    const message = encodeURIComponent("Hello Lumina Footwear! I'm interested in your products.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-[#128C7E] transition-colors duration-300 group"
            style={{ animation: "wa-pop 0.4s ease 1s both" }}
            title="Chat with us on WhatsApp"
        >
            <style>{`
                @keyframes wa-pop {
                    from { transform: scale(0); opacity: 0; }
                    to   { transform: scale(1); opacity: 1; }
                }
            `}</style>
            <MessageCircle className="w-8 h-8 fill-current" />
            <span className="absolute right-full mr-4 bg-white text-black px-4 py-2 rounded-lg text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Chat with us!
            </span>
        </a>
    );
}
