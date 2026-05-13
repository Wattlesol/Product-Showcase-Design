import img8080BLK_C from "@assets/products/8080_BLK_C.webp";
import img8080BLK_L from "@assets/products/8080_BLK_L.webp";
import img8080BLK_R from "@assets/products/8080_BLK_R.webp";
import img8080BRN_C from "@assets/products/8080_BRN_C.webp";
import img8080BRN_L from "@assets/products/8080_BRN_L.webp";
import img8080BRN_R from "@assets/products/8080_BRN_R.webp";

import img8079BLK_C from "@assets/products/8079_BLK_C.webp";
import img8079BLK_L from "@assets/products/8079_BLK_L.webp";
import img8079BLK_R from "@assets/products/8079_BLK_R.webp";
import img8079BRN_C from "@assets/products/8079_BRN_C.webp";
import img8079BRN_L from "@assets/products/8079_BRN_L.webp";
import img8079BRN_R from "@assets/products/8079_BRN_R.webp";

import img8077BLK_C from "@assets/products/8077_BLK_C.webp";
import img8077BLK_L from "@assets/products/8077_BLK_L.webp";
import img8077BLK_R from "@assets/products/8077_BLK_R.webp";
import img8077BRN_C from "@assets/products/8077_BRN_C.webp";
import img8077BRN_L from "@assets/products/8077_BRN_L.webp";
import img8077BRN_R from "@assets/products/8077_BRN_R.webp";

import img8076BLK_C from "@assets/products/8076_BLK_C.webp";
import img8076BLK_R from "@assets/products/8076_BLK_R.webp";

import img8075BLK_C from "@assets/products/8075_BLK_C.webp";
import img8075BLK_L from "@assets/products/8075_BLK_L.webp";
import img8075BLK_R from "@assets/products/8075_BLK_R.webp";
import img8075BRN_C from "@assets/products/8075_BRN_C.webp";
import img8075BRN_L from "@assets/products/8075_BRN_L.webp";
import img8075BRN_R from "@assets/products/8075_BRN_R.webp";

// Bag Collection Imports
import imgHAC01_C from "@assets/products/HAC-01_C.webp";
import imgHAC01_L from "@assets/products/HAC-01_L.webp";
import imgHAC01_R from "@assets/products/HAC-01_R.webp";
import imgBPT02_C from "@assets/products/BPT-02_C.webp";
import imgBPT02_L from "@assets/products/BPT-02_L.webp";
import imgBPT02_R from "@assets/products/BPT-02_R.webp";
import imgHAT03_C from "@assets/products/HAT-03_C.webp";
import imgHAT03_L from "@assets/products/HAT-03_L.webp";
import imgHAT03_R from "@assets/products/HAT-03_R.webp";
import imgIDT04_C from "@assets/products/IDT-04_C.webp";
import imgIDT04_L from "@assets/products/IDT-04_L.webp";
import imgIDT04_R from "@assets/products/IDT-04_R.webp";
import imgMNT05_C from "@assets/products/MNT-05_C.webp";
import imgMNT05_L from "@assets/products/MNT-05_L.webp";
import imgMNT05_R from "@assets/products/MNT-05_R.webp";
import imgSSC06_C from "@assets/products/SSC-06_C.webp";
import imgSSC06_L from "@assets/products/SSC-06_L.webp";
import imgSSC06_R from "@assets/products/SSC-06_R.webp";
import imgSST07_C from "@assets/products/SST-07_C.webp";
import imgSST07_L from "@assets/products/SST-07_L.webp";
import imgSST07_R from "@assets/products/SST-07_R.webp";
import imgCMT08_C from "@assets/products/CMT-08_C.webp";
import imgCMT08_L from "@assets/products/CMT-08_L.webp";
import imgCMT08_R from "@assets/products/CMT-08_R.webp";

export const products = [
    {
        id: 1,
        name: "Model 8080 Classic Slip-On",
        price: 3999.00,
        originalPrice: 6999.00,
        rating: 4.8,
        category: "Shoes",
        description: "Our flagship slip-on model, featuring premium top-grain leather and a reinforced ergonomic sole for all-day professional wear.",
        variants: [
            { id: "8080-blk", color: "Black", image: img8080BLK_C, images3D: [img8080BLK_L, img8080BLK_C, img8080BLK_R], colorCode: "#222222" },
            { id: "8080-brn", color: "Brown", image: img8080BRN_C, images3D: [img8080BRN_L, img8080BRN_C, img8080BRN_R], colorCode: "#5c4033" },
        ]
    },
    {
        id: 2,
        name: "Model 8079 Comfort Loafer",
        price: 3999.00,
        originalPrice: 6999.00,
        rating: 4.8,
        category: "Shoes",
        description: "A sophisticated loafer with extra padding and a flexible outsole, perfect for transitioning from office to evening.",
        variants: [
            { id: "8079-blk", color: "Black", image: img8079BLK_C, images3D: [img8079BLK_L, img8079BLK_C, img8079BLK_R], colorCode: "#222222" },
            { id: "8079-brn", color: "Brown", image: img8079BRN_C, images3D: [img8079BRN_L, img8079BRN_C, img8079BRN_R], colorCode: "#5c4033" },
        ]
    },
    {
        id: 3,
        name: "Model 8077 Executive Mocc",
        price: 3999.00,
        originalPrice: 6999.00,
        rating: 5.0,
        category: "Shoes",
        description: "The ultimate executive choice. Hand-stitched detailing meets a plush interior for a truly luxurious walking experience.",
        variants: [
            { id: "8077-blk", color: "Black", image: img8077BLK_C, images3D: [img8077BLK_L, img8077BLK_C, img8077BLK_R], colorCode: "#222222" },
            { id: "8077-brn", color: "Brown", image: img8077BRN_C, images3D: [img8077BRN_L, img8077BRN_C, img8077BRN_R], colorCode: "#5c4033" },
        ]
    },
    {
        id: 4,
        name: "Model 8076 Woven Detail",
        price: 3999.00,
        originalPrice: 6999.00,
        rating: 4.6,
        category: "Shoes",
        description: "Unique woven textures set this pair apart. Breathable design without sacrificing structural integrity.",
        variants: [
            { id: "8076-blk", color: "Black", image: img8076BLK_C, images3D: [img8076BLK_C, img8076BLK_C, img8076BLK_R], colorCode: "#222222" },
        ]
    },
    {
        id: 5,
        name: "Model 8075 Modern Loafer",
        price: 3999.00,
        originalPrice: 6999.00,
        rating: 4.8,
        category: "Shoes",
        description: "A contemporary take on the traditional loafer, featuring a streamlined silhouette and lightweight materials.",
        variants: [
            { id: "8075-blk", color: "Black", image: img8075BLK_C, images3D: [img8075BLK_L, img8075BLK_C, img8075BLK_R], colorCode: "#222222" },
            { id: "8075-brn", color: "Brown", image: img8075BRN_C, images3D: [img8075BRN_L, img8075BRN_C, img8075BRN_R], colorCode: "#5c4033" },
        ]
    },
    // Hand Bags Collection
    {
        id: 6,
        name: "Heritage Art Carryall",
        price: 3269.00,
        originalPrice: 4999.00,
        rating: 4.9,
        category: "Bags",
        description: "A timeless masterpiece featuring intricate heritage patterns and a spacious interior for all your essentials.",
        variants: [
            { id: "HAC-01", color: "Premium", image: imgHAC01_C, images3D: [imgHAC01_L, imgHAC01_C, imgHAC01_R], colorCode: "#8b4513" },
        ]
    },
    {
        id: 7,
        name: "Blush Croc Paneled Tote",
        price: 4299.00,
        originalPrice: 5999.00,
        rating: 4.8,
        category: "Bags",
        description: "Sophisticated croc-textured panels meet a soft blush palette. The perfect statement piece for modern elegance.",
        variants: [
            { id: "BPT-02", color: "Blush", image: imgBPT02_C, images3D: [imgBPT02_L, imgBPT02_C, imgBPT02_R], colorCode: "#e6b3b3" },
        ]
    },
    {
        id: 8,
        name: "Honey Amber",
        price: 3899.00,
        originalPrice: 5499.00,
        rating: 4.7,
        category: "Bags",
        description: "Warm amber tones in a sleek, compact design. Versatile enough for daily commutes and evening outings.",
        variants: [
            { id: "HAT-03", color: "Amber", image: imgHAT03_C, images3D: [imgHAT03_L, imgHAT03_C, imgHAT03_R], colorCode: "#ffbf00" },
        ]
    },
    {
        id: 9,
        name: "Indigo Daily Tote",
        price: 6999.00,
        originalPrice: 8999.00,
        rating: 5.0,
        category: "Bags",
        description: "Deep indigo premium leather handcrafted for durability and style. Our largest and most premium tote yet.",
        variants: [
            { id: "IDT-04", color: "Indigo", image: imgIDT04_C, images3D: [imgIDT04_L, imgIDT04_C, imgIDT04_R], colorCode: "#000080" },
        ]
    },
    {
        id: 10,
        name: "Contrast Mocha Tote",
        price: 5289.00,
        originalPrice: 7499.00,
        rating: 4.8,
        category: "Bags",
        description: "Beautiful mocha brown with contrasting stitching. A classic look that never goes out of style.",
        variants: [
            { id: "MNT-05", color: "Navy", image: imgMNT05_C, images3D: [imgMNT05_L, imgMNT05_C, imgMNT05_R], colorCode: "#191970" },
        ]
    },
    {
        id: 11,
        name: "Sandstone Crossbody",
        price: 1788.00,
        originalPrice: 2999.00,
        rating: 4.6,
        category: "Bags",
        description: "Lightweight and compact sandstone-colored crossbody bag. Perfect for travel and keeping hands free.",
        variants: [
            { id: "SSC-06", color: "Sandstone", image: imgSSC06_C, images3D: [imgSSC06_L, imgSSC06_C, imgSSC06_R], colorCode: "#c2b280" },
        ]
    },
    {
        id: 12,
        name: "Saffron Scarf Tote",
        price: 3799.00,
        originalPrice: 5299.00,
        rating: 4.7,
        category: "Bags",
        description: "Vibrant saffron tones complemented by a signature silk scarf accent. A unique blend of color and texture.",
        variants: [
            { id: "SST-07", color: "Saffron", image: imgSST07_C, images3D: [imgSST07_L, imgSST07_C, imgSST07_R], colorCode: "#f4c430" },
        ]
    },
    {
        id: 13,
        name: "Midnight Navy",
        price: 3286.00,
        originalPrice: 4799.00,
        rating: 4.8,
        category: "Bags",
        description: "A deep, dark navy finish that exudes professionalism. Reinforced handles and ergonomic design.",
        variants: [
            { id: "CMT-08", color: "Mocha", image: imgCMT08_C, images3D: [imgCMT08_L, imgCMT08_C, imgCMT08_R], colorCode: "#7b3f00" },
        ]
    },
];
