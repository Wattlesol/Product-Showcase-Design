import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { google } from "googleapis";
import path from "path";
import fs from "fs";
import { currentInventory } from "./inventory";
import nodemailer from "nodemailer";
import { comparePasswords } from "./auth";

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.hostinger.com",
  port: parseInt(process.env.EMAIL_PORT || "465"),
  secure: process.env.EMAIL_PORT === "465",
  auth: {
    user: process.env.EMAIL_USER || "admin@wattlesol.com",
    pass: process.env.EMAIL_PASS || "tepPa9symfofjixqej@",
  },
});

async function sendOrderEmail(orderData: any, shippingData: any, total: number) {
  const orderDetails = orderData
    .map((item: any) => `${item.quantity}x ${item.name} (${item.color}, Size ${item.size}) - PKR ${item.price}`)
    .join("\n");

  const mailOptions = {
    from: `"Lumina Footwear" <${process.env.EMAIL_USER}>`,
    to: "lumilafooter@gmail.com",
    subject: `New Order Received - ${shippingData.firstName} ${shippingData.lastName}`,
    text: `
New Order Details:
------------------
Customer: ${shippingData.firstName} ${shippingData.lastName}
Phone: ${shippingData.phone}
Address: ${shippingData.address}, ${shippingData.city}, ${shippingData.province}
Apartment/Suite: ${shippingData.apartment || "N/A"}

Order Items:
${orderDetails}

Total Price: PKR ${total}
Timestamp: ${new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" })}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Order email sent successfully to lumilafooter@gmail.com");
  } catch (error: any) {
    console.error("Failed to send order email:", error.message);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  console.log(`\n🛣️  REGISTERING API ROUTES`);
  console.log(`================================`);
  
  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Dynamic Product Fetching
  app.get("/api/products", async (_req, res) => {
    try {
      const dbProducts = await storage.getProducts();
      res.json(dbProducts);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(parseInt(req.params.id));
      if (!product) return res.status(404).json({ error: "Product not found" });
      res.json(product);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Serve Image Blobs with Optimization
  app.get("/api/products/image/:variantId/:type", async (req, res) => {
    try {
      const { variantId, type } = req.params;
      const productId = req.query.productId ? parseInt(req.query.productId as string) : undefined;
      const width = req.query.w ? parseInt(req.query.w as string) : undefined;
      
      let image;
      if (productId) {
        image = await storage.getProductImage(productId, variantId, type);
      } else {
        const dbProducts = await storage.getProducts();
        const product = dbProducts.find(p => (p.variants as any[]).some(v => v.id === variantId));
        if (product) {
          image = await storage.getProductImage(product.id, variantId, type);
        }
      }

      if (!image) return res.status(404).send("Image not found");

      // Critical optimization: Resize and compress using sharp
      let finalData = image.data;
      try {
        const sharp = (await import("sharp")).default;
        const pipeline = sharp(image.data);
        
        // Strip EXIF data to save bytes
        pipeline.rotate().strip(); 

        const metadata = await pipeline.metadata();

        // Default optimization: Max width 1200px and aggressive compression
        let resizeWidth = width || (metadata.width && metadata.width > 1200 ? 1200 : null);
        
        if (resizeWidth) {
          pipeline.resize(resizeWidth, null, { 
            withoutEnlargement: true,
            fit: 'inside'
          });
        }
        
        finalData = await pipeline
          .webp({ 
            quality: 60, // Reduced from 75 to 60 for massive savings
            effort: 6,
            smartSubsample: true
          }) 
          .toBuffer();
      } catch (sharpError) {
        console.error("Sharp processing failed for variantId:", variantId, sharpError);
      }

      res.setHeader("Content-Type", "image/webp");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.send(finalData);
    } catch (e) {
      console.error("Image route error:", e);
      res.status(500).send("Error serving image");
    }
  });

  // Tracking Hit
  app.post("/api/track/hit", async (req, res) => {
    try {
      const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const { sessionId, path, referrer, ttclid, utmSource, utmMedium, utmCampaign } = req.body;
      const visit = await storage.createVisit({
        sessionId,
        path,
        ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : String(ipAddress),
        timestamp: new Date().toISOString(),
        referrer,
        ttclid,
        utmSource,
        utmMedium,
        utmCampaign
      });
      res.json(visit);
    } catch (e) {
      res.status(500).json({ error: "Failed to track hit" });
    }
  });

  // Tracking Lead
  app.post("/api/track/lead", async (req, res) => {
    try {
      const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const { sessionId, firstName, lastName, phone, address, city, province, cartItems, totalPrice } = req.body;
      const lead = await storage.updateLead({
        sessionId,
        firstName,
        lastName,
        phone,
        address,
        city,
        province,
        cartItems: JSON.stringify(cartItems),
        totalPrice: String(totalPrice),
        lastUpdated: new Date().toISOString(),
        status: "pending",
        ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : String(ipAddress),
      });
      res.json(lead);
    } catch (e) {
      res.status(500).json({ error: "Failed to track lead" });
    }
  });

  // Tracking Event
  app.post("/api/track/event", async (req, res) => {
    try {
      const { sessionId, eventType, productId, productName, metadata } = req.body;
      const event = await storage.createEvent({
        sessionId,
        eventType,
        productId: String(productId),
        productName,
        timestamp: new Date().toISOString(),
        metadata: metadata ? JSON.stringify(metadata) : null
      });
      res.json(event);
    } catch (e: any) {
      res.status(500).json({ error: "Failed to track event" });
    }
  });

  // Secure Admin Login
  app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await storage.getUserByUsername(username);
    
    if (user && await comparePasswords(password, user.password)) {
      res.json({ success: true, token: "simple-admin-token" });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Admin Stats
  app.get("/api/admin/stats", async (req, res) => {
    const token = req.headers.authorization;
    if (token !== "simple-admin-token") return res.status(401).json({ error: "Unauthorized" });

    const visits = await storage.getVisits();
    const leads = await storage.getLeads();
    const events = await storage.getEvents();
    const orders = await storage.getOrders();

    const now = new Date();
    const fiveMinsAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString();

    const liveUsers = new Set(visits.filter(v => v.timestamp >= fiveMinsAgo).map(v => v.sessionId)).size;
    
    const totalCarts = events.filter(e => e.eventType === "add_to_cart").length;
    const totalViews = events.filter(e => e.eventType === "view_item").length;

    const popularProducts = events
      .filter(e => e.eventType === "view_item")
      .reduce((acc: any, curr) => {
        const id = curr.productId || "unknown";
        if (!acc[id]) acc[id] = { id, name: curr.productName, views: 0, carts: 0 };
        acc[id].views++;
        return acc;
      }, {});

    events
      .filter(e => e.eventType === "add_to_cart")
      .forEach(e => {
        const id = e.productId || "unknown";
        if (popularProducts[id]) popularProducts[id].carts++;
      });

    const ipToSessions: Record<string, Set<string>> = {};
    for (const v of visits) {
      const ip = v.ipAddress || 'unknown';
      if (!ipToSessions[ip]) ipToSessions[ip] = new Set();
      ipToSessions[ip].add(v.sessionId);
    }
    for (const l of leads) {
      if (l.ipAddress) {
        if (!ipToSessions[l.ipAddress]) ipToSessions[l.ipAddress] = new Set();
        ipToSessions[l.ipAddress].add(l.sessionId);
      }
    }

    const mergedJourneys = Object.entries(ipToSessions).map(([ip, sessionSet]) => {
      const sids = Array.from(sessionSet);
      const allVisits = visits.filter(v => sids.includes(v.sessionId));
      const allEvents = events.filter(e => sids.includes(e.sessionId));
      const allLeads  = leads.filter(l => sids.includes(l.sessionId));

      const sortedLeads = [...allLeads].sort((a, b) =>
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      );

      const identityLead = sortedLeads.find(l => l.status === 'ordered' && (l.firstName || l.phone)) || sortedLeads.find(l => l.firstName || l.phone) || sortedLeads[0];

      const parseCart = (raw: string | null | undefined) => {
        if (!raw) return [];
        try { const p = JSON.parse(raw); return Array.isArray(p) && p.length > 0 ? p : []; } catch { return []; }
      };
      
      const activeLead = sortedLeads.find(l => parseCart(l.cartItems).length > 0);
      const currentStatus = sortedLeads[0]?.status || null;
      const startTime = allVisits[0]?.timestamp || allEvents[0]?.timestamp || sortedLeads[sortedLeads.length - 1]?.lastUpdated || new Date().toISOString();
      const name = `${identityLead?.firstName || ''} ${identityLead?.lastName || ''}`.trim() || null;

      return {
        ip,
        sessionIds: sids,
        startTime,
        views: allEvents.filter(e => e.eventType === 'view_item').map(e => e.productName).filter(Boolean),
        eventCarts: allEvents.filter(e => e.eventType === 'add_to_cart').map(e => e.productName).filter(Boolean),
        cartItems: parseCart(activeLead?.cartItems ?? null),
        lead: (identityLead?.phone || name) ? {
          name: name || 'Unknown',
          status: currentStatus,
          phone: identityLead?.phone,
          address: identityLead?.address,
          location: [identityLead?.city, identityLead?.province].filter(Boolean).join(', ')
        } : null
      };
    }).sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    res.json({
      totalVisitors: Object.keys(ipToSessions).length,
      liveUsers,
      abandonedCarts: leads.filter(l => l.status === "pending").length,
      ghostLeads: leads.filter(l => l.status === "pending").length,
      addToCarts: totalCarts,
      productViews: totalViews,
      popularProducts: Object.values(popularProducts).sort((a: any, b: any) => b.views - a.views),
      leads: leads.map(l => ({ ...l, cartItems: l.cartItems ? JSON.parse(l.cartItems) : [] })),
      completedOrders: orders,
      userJourneys: mergedJourneys,
      recentVisits: visits.slice(-100)
    });
  });

  app.get("/api/inventory", (req, res) => {
    res.json(currentInventory);
  });

  app.post("/api/checkout", async (req, res) => {
    try {
      const { order, shipping, totalPrice } = req.body;

      // 1. Decrement inventory
      for (const item of order) {
        if (currentInventory[item.variantId] && currentInventory[item.variantId][item.size] !== undefined) {
          currentInventory[item.variantId][item.size] = Math.max(0, currentInventory[item.variantId][item.size] - item.quantity);
        }
      }

      // 2. Persist order to database
      await storage.createOrder({
        sessionId: shipping.sessionId,
        firstName: shipping.firstName,
        lastName: shipping.lastName,
        phone: shipping.phone,
        address: shipping.address,
        city: shipping.city,
        province: shipping.province,
        cartItems: order,
        totalPrice: parseInt(totalPrice),
        status: "pending"
      });

      res.status(200).json({ success: true, message: "Order received. Processing in background..." });

      // 3. Background tasks
      (async () => {
        try {
          if (shipping && shipping.sessionId) {
            await storage.updateLead({
              sessionId: shipping.sessionId,
              firstName: shipping.firstName,
              lastName: shipping.lastName,
              phone: shipping.phone,
              address: shipping.address,
              city: shipping.city,
              province: shipping.province,
              cartItems: JSON.stringify(order),
              totalPrice: String(totalPrice),
              lastUpdated: new Date().toISOString(),
              status: "pending"
            });
            await storage.markLeadAsOrdered(shipping.sessionId, shipping.phone);
          }

          // Sheets logging
          const spreadsheetId = "141X6rL6v8KIf4Dwrr-uozfZi-Ehs8uJnjHmJuAeoFSM";
          let auth;
          const serviceAccountValue = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

          if (serviceAccountValue) {
            try {
              let configString = serviceAccountValue.trim();
              if (!configString.startsWith("{")) {
                configString = Buffer.from(configString, "base64").toString("utf-8");
              }
              const credentials = JSON.parse(configString);
              auth = new google.auth.GoogleAuth({
                credentials,
                scopes: ["https://www.googleapis.com/auth/spreadsheets"],
              });
            } catch (e) {}
          }

          if (auth) {
            try {
              const sheets = google.sheets({ version: "v4", auth });
              await sheets.spreadsheets.values.append({
                spreadsheetId,
                range: "Sheet1",
                valueInputOption: "USER_ENTERED",
                requestBody: {
                  values: [
                    [
                      new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" }),
                      shipping.firstName,
                      shipping.lastName,
                      shipping.phone,
                      shipping.address,
                      shipping.city,
                      shipping.province,
                      order.map((item: any) => `${item.quantity}x ${item.name} (${item.color}, Size ${item.size})`).join(",\n"),
                      totalPrice
                    ],
                  ],
                },
              });
            } catch (e) {}
          }

          await sendOrderEmail(order, shipping, totalPrice);
        } catch (bgError) {}
      })();

    } catch (error) {
      if (!res.headersSent) {
        res.status(500).json({ success: false, error: "Internal server error" });
      }
    }
  });

  // Admin routes for comments/updates
  app.post("/api/admin/orders/:sessionId/comment", async (req, res) => {
    const token = req.headers.authorization;
    if (token !== "simple-admin-token") return res.status(401).json({ error: "Unauthorized" });
    try {
      const { sessionId } = req.params;
      const { comment, author } = req.body;
      const newComment = await storage.addOrderComment({ sessionId, comment: comment.trim(), author: author || "admin" });
      res.json(newComment);
    } catch (e) { res.status(500).json({ error: "Failed to add comment" }); }
  });

  app.get("/api/admin/orders/:sessionId/comments", async (req, res) => {
    const token = req.headers.authorization;
    if (token !== "simple-admin-token") return res.status(401).json({ error: "Unauthorized" });
    try {
      const comments = await storage.getOrderComments(req.params.sessionId);
      res.json(comments);
    } catch (e) { res.status(500).json({ error: "Failed to get comments" }); }
  });

  app.put("/api/admin/orders/:sessionId", async (req, res) => {
    const token = req.headers.authorization;
    if (token !== "simple-admin-token") return res.status(401).json({ error: "Unauthorized" });
    try {
      const updatedOrder = await storage.updateOrder(req.params.sessionId, req.body);
      res.json(updatedOrder);
    } catch (e) { res.status(500).json({ error: "Failed to update order" }); }
  });

  return httpServer;
}
