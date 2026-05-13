import { db } from "../server/db";
import { products, productImages, users, visits, leads, events } from "../shared/schema";
import { hashPassword } from "../server/auth";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(__dirname, "../attached_assets/products");

const productData = [
    {
        name: "Model 8080 Classic Slip-On",
        price: 3999,
        originalPrice: 6999,
        rating: "4.8",
        category: "Shoes",
        description: "Our flagship slip-on model, featuring premium top-grain leather and a reinforced ergonomic sole for all-day professional wear.",
        variants: [
            { id: "8080-blk", color: "Black", colorCode: "#222222", fileBase: "8080_BLK" },
            { id: "8080-brn", color: "Brown", colorCode: "#5c4033", fileBase: "8080_BRN" },
        ]
    },
    {
        name: "Model 8079 Comfort Loafer",
        price: 3999,
        originalPrice: 6999,
        rating: "4.8",
        category: "Shoes",
        description: "A sophisticated loafer with extra padding and a flexible outsole, perfect for transitioning from office to evening.",
        variants: [
            { id: "8079-blk", color: "Black", colorCode: "#222222", fileBase: "8079_BLK" },
            { id: "8079-brn", color: "Brown", colorCode: "#5c4033", fileBase: "8079_BRN" },
        ]
    },
    {
        name: "Model 8077 Executive Mocc",
        price: 3999,
        originalPrice: 6999,
        rating: "5.0",
        category: "Shoes",
        description: "The ultimate executive choice. Hand-stitched detailing meets a plush interior for a truly luxurious walking experience.",
        variants: [
            { id: "8077-blk", color: "Black", colorCode: "#222222", fileBase: "8077_BLK" },
            { id: "8077-brn", color: "Brown", colorCode: "#5c4033", fileBase: "8077_BRN" },
        ]
    },
    {
        name: "Model 8076 Woven Detail",
        price: 3999,
        originalPrice: 6999,
        rating: "4.6",
        category: "Shoes",
        description: "Unique woven textures set this pair apart. Breathable design without sacrificing structural integrity.",
        variants: [
            { id: "8076-blk", color: "Black", colorCode: "#222222", fileBase: "8076_BLK" },
        ]
    },
    {
        name: "Model 8075 Modern Loafer",
        price: 3999,
        originalPrice: 6999,
        rating: "4.8",
        category: "Shoes",
        description: "A contemporary take on the traditional loafer, featuring a streamlined silhouette and lightweight materials.",
        variants: [
            { id: "8075-blk", color: "Black", colorCode: "#222222", fileBase: "8075_BLK" },
            { id: "8075-brn", color: "Brown", colorCode: "#5c4033", fileBase: "8075_BRN" },
        ]
    },
    {
        name: "Heritage Art Carryall",
        price: 3269,
        originalPrice: 4999,
        rating: "4.9",
        category: "Bags",
        description: "A timeless masterpiece featuring intricate heritage patterns and a spacious interior for all your essentials.",
        variants: [
            { id: "HAC-01", color: "Premium", colorCode: "#8b4513", fileBase: "HAC-01" },
        ]
    },
    {
        name: "Blush Croc Paneled Tote",
        price: 4299,
        originalPrice: 5999,
        rating: "4.8",
        category: "Bags",
        description: "Sophisticated croc-textured panels meet a soft blush palette. The perfect statement piece for modern elegance.",
        variants: [
            { id: "BPT-02", color: "Blush", colorCode: "#e6b3b3", fileBase: "BPT-02" },
        ]
    },
    {
        name: "Honey Amber",
        price: 3899,
        originalPrice: 5499,
        rating: "4.7",
        category: "Bags",
        description: "Warm amber tones in a sleek, compact design. Versatile enough for daily commutes and evening outings.",
        variants: [
            { id: "HAT-03", color: "Amber", colorCode: "#ffbf00", fileBase: "HAT-03" },
        ]
    },
    {
        name: "Indigo Daily Tote",
        price: 6999,
        originalPrice: 8999,
        rating: "5.0",
        category: "Bags",
        description: "Deep indigo premium leather handcrafted for durability and style. Our largest and most premium tote yet.",
        variants: [
            { id: "IDT-04", color: "Indigo", colorCode: "#000080", fileBase: "IDT-04" },
        ]
    },
    {
        name: "Contrast Mocha Tote",
        price: 5289,
        originalPrice: 7499,
        rating: "4.8",
        category: "Bags",
        description: "Beautiful mocha brown with contrasting stitching. A classic look that never goes out of style.",
        variants: [
            { id: "MNT-05", color: "Navy", colorCode: "#191970", fileBase: "MNT-05" },
        ]
    },
    {
        name: "Sandstone Crossbody",
        price: 1788,
        originalPrice: 2999,
        rating: "4.6",
        category: "Bags",
        description: "Lightweight and compact sandstone-colored crossbody bag. Perfect for travel and keeping hands free.",
        variants: [
            { id: "SSC-06", color: "Sandstone", colorCode: "#c2b280", fileBase: "SSC-06" },
        ]
    },
    {
        name: "Saffron Scarf Tote",
        price: 3799,
        originalPrice: 5299,
        rating: "4.7",
        category: "Bags",
        description: "Vibrant saffron tones complemented by a signature silk scarf accent. A unique blend of color and texture.",
        variants: [
            { id: "SST-07", color: "Saffron", colorCode: "#f4c430", fileBase: "SST-07" },
        ]
    },
    {
        name: "Midnight Navy",
        price: 3286,
        originalPrice: 4799,
        rating: "4.8",
        category: "Bags",
        description: "A deep, dark navy finish that exudes professionalism. Reinforced handles and ergonomic design.",
        variants: [
            { id: "CMT-08", color: "Mocha", colorCode: "#7b3f00", fileBase: "CMT-08" },
        ]
    },
];

async function seed() {
    console.log("Starting seeding...");

    // 1. Create Admin User
    console.log("Creating admin user...");
    const hashedPassword = await hashPassword("lumina2026");
    await db.insert(users).values({
        username: "admin",
        password: hashedPassword
    }).onConflictDoUpdate({
        target: users.username,
        set: { password: hashedPassword }
    });

    // 2. Clear tracking data
    console.log("Clearing tracking data...");
    await db.delete(visits);
    await db.delete(leads);
    await db.delete(events);

    // 3. Clear existing products and images
    console.log("Clearing existing products...");
    await db.delete(productImages);
    await db.delete(products);

    // 4. Seed products and images
    for (const p of productData) {
        console.log(`Seeding product: ${p.name}`);
        
        // Prepare variants for the JSON column (removing the fileBase helper)
        const variantsJson = p.variants.map(v => ({
            id: v.id,
            color: v.color,
            colorCode: v.colorCode,
            // These will be reconstructed on the frontend/API
            image: `/api/products/image/${v.id}/C`,
            images3D: [
                `/api/products/image/${v.id}/L`,
                `/api/products/image/${v.id}/C`,
                `/api/products/image/${v.id}/R`
            ]
        }));

        const [insertedProduct] = await db.insert(products).values({
            name: p.name,
            price: p.price,
            originalPrice: p.originalPrice,
            rating: p.rating,
            category: p.category,
            description: p.description,
            variants: variantsJson,
            active: true
        }).returning();

        // Save images as blobs
        for (const v of p.variants) {
            for (const type of ['C', 'L', 'R']) {
                const fileName = `${v.fileBase}_${type}.webp`;
                const filePath = path.join(ASSETS_DIR, fileName);
                
                if (fs.existsSync(filePath)) {
                    console.log(`  Saving image: ${fileName}`);
                    const buffer = fs.readFileSync(filePath);
                    await db.insert(productImages).values({
                        productId: insertedProduct.id,
                        variantId: v.id,
                        imageType: type,
                        data: buffer,
                        contentType: "image/webp"
                    });
                } else {
                    console.warn(`  Warning: File not found ${fileName}`);
                    // For missing L/R, fallback to C if available
                    if (type !== 'C') {
                        const fallbackName = `${v.fileBase}_C.webp`;
                        const fallbackPath = path.join(ASSETS_DIR, fallbackName);
                        if (fs.existsSync(fallbackPath)) {
                            console.log(`  Using fallback for ${type}: ${fallbackName}`);
                            const buffer = fs.readFileSync(fallbackPath);
                            await db.insert(productImages).values({
                                productId: insertedProduct.id,
                                variantId: v.id,
                                imageType: type,
                                data: buffer,
                                contentType: "image/webp"
                            });
                        }
                    }
                }
            }
        }
    }

    console.log("Seeding completed successfully!");
    process.exit(0);
}

seed().catch(err => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
