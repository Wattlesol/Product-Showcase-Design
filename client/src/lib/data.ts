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

export const products = [
    {
        id: 1,
        name: "Model 8080 Classic Slip-On",
        price: 4999.00,
        originalPrice: 6999.00,
        rating: 4.8,
        description: "Our flagship slip-on model, featuring premium top-grain leather and a reinforced ergonomic sole for all-day professional wear.",
        variants: [
            { id: "8080-blk", color: "Black", image: img8080BLK_C, images3D: [img8080BLK_L, img8080BLK_C, img8080BLK_R], colorCode: "#222222" },
            { id: "8080-brn", color: "Brown", image: img8080BRN_C, images3D: [img8080BRN_L, img8080BRN_C, img8080BRN_R], colorCode: "#5c4033" },
        ]
    },
    {
        id: 2,
        name: "Model 8079 Comfort Loafer",
        price: 4999.00,
        originalPrice: 6999.00,
        rating: 4.8,
        description: "A sophisticated loafer with extra padding and a flexible outsole, perfect for transitioning from office to evening.",
        variants: [
            { id: "8079-blk", color: "Black", image: img8079BLK_C, images3D: [img8079BLK_L, img8079BLK_C, img8079BLK_R], colorCode: "#222222" },
            { id: "8079-brn", color: "Brown", image: img8079BRN_C, images3D: [img8079BRN_L, img8079BRN_C, img8079BRN_R], colorCode: "#5c4033" },
        ]
    },
    {
        id: 3,
        name: "Model 8077 Executive Mocc",
        price: 4999.00,
        originalPrice: 6999.00,
        rating: 5.0,
        description: "The ultimate executive choice. Hand-stitched detailing meets a plush interior for a truly luxurious walking experience.",
        variants: [
            { id: "8077-blk", color: "Black", image: img8077BLK_C, images3D: [img8077BLK_L, img8077BLK_C, img8077BLK_R], colorCode: "#222222" },
            { id: "8077-brn", color: "Brown", image: img8077BRN_C, images3D: [img8077BRN_L, img8077BRN_C, img8077BRN_R], colorCode: "#5c4033" },
        ]
    },
    {
        id: 4,
        name: "Model 8076 Woven Detail",
        price: 4999.00,
        originalPrice: 6999.00,
        rating: 4.6,
        description: "Unique woven textures set this pair apart. Breathable design without sacrificing structural integrity.",
        variants: [
            { id: "8076-blk", color: "Black", image: img8076BLK_C, images3D: [img8076BLK_C, img8076BLK_C, img8076BLK_R], colorCode: "#222222" },
        ]
    },
    {
        id: 5,
        name: "Model 8075 Modern Loafer",
        price: 4999.00,
        originalPrice: 6999.00,
        rating: 4.8,
        description: "A contemporary take on the traditional loafer, featuring a streamlined silhouette and lightweight materials.",
        variants: [
            { id: "8075-blk", color: "Black", image: img8075BLK_C, images3D: [img8075BLK_L, img8075BLK_C, img8075BLK_R], colorCode: "#222222" },
            { id: "8075-brn", color: "Brown", image: img8075BRN_C, images3D: [img8075BRN_L, img8075BRN_C, img8075BRN_R], colorCode: "#5c4033" },
        ]
    },
];
