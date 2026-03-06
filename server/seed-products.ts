import { storage } from "./storage";

const productData = [
    {
        id: 1,
        name: "Model 8080 Classic Slip-On",
        price: 4999.00,
        originalPrice: 6999.00,
        rating: 4.8,
        description: "Our flagship slip-on model, featuring premium top-grain leather and a reinforced ergonomic sole for all-day professional wear.",
    },
    {
        id: 2,
        name: "Model 8079 Comfort Loafer",
        price: 4999.00,
        originalPrice: 6999.00,
        rating: 4.8,
        description: "A sophisticated loafer with extra padding and a flexible outsole, perfect for transitioning from office to evening.",
    },
    {
        id: 3,
        name: "Model 8077 Executive Mocc",
        price: 4999.00,
        originalPrice: 6999.00,
        rating: 5.0,
        description: "The ultimate executive choice. Hand-stitched detailing meets a plush interior for a truly luxurious walking experience.",
    },
    {
        id: 4,
        name: "Model 8076 Woven Detail",
        price: 4999.00,
        originalPrice: 6999.00,
        rating: 4.6,
        description: "Unique woven textures set this pair apart. Breathable design without sacrificing structural integrity.",
    },
    {
        id: 5,
        name: "Model 8075 Modern Loafer",
        price: 4999.00,
        originalPrice: 6999.00,
        rating: 4.8,
        description: "A contemporary take on the traditional loafer, featuring a streamlined silhouette and lightweight materials.",
    },
];

async function seed() {
    console.log("Seeding products...");
    for (const p of productData) {
        await storage.createProduct({
            id: String(p.id),
            name: p.name,
            price: String(p.price),
            originalPrice: String(p.originalPrice),
            description: p.description,
            stock: "100",
            metadata: JSON.stringify({
                rating: p.rating
            })
        });
    }
    console.log("Seeding completed!");
    process.exit(0);
}

seed().catch(err => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
