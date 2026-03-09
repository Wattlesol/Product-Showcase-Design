import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { google } from "googleapis";
import path from "path";
import fs from "fs";
import { currentInventory } from "./inventory";
import nodemailer from "nodemailer";

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
  
  // put application routes here
  // prefix all routes with /api

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    console.log(`💚 [API] GET /api/health - Health check requested`);
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });
  console.log(`✅ Registered: GET /api/health`);

  // NEW: Tracking Hit
  app.post("/api/track/hit", async (req, res) => {
    console.log(`📊 [API] POST /api/track/hit - Tracking page view`);
    try {
      const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const { sessionId, path, referrer, ttclid, utmSource, utmMedium, utmCampaign } = req.body;
      console.log(`   Session: ${sessionId}, Path: ${path}, IP: ${ipAddress}`);
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

  // NEW: Tracking Lead
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

  // NEW: Tracking Event (Add to Cart, View Item)
  app.post("/api/track/event", async (req, res) => {
    try {
      const { sessionId, eventType, productId, productName, metadata } = req.body;
      console.log(`[EVENT DEBUG] Session: ${sessionId}, Type: ${eventType}, Product: ${productName}`);
      const event = await storage.createEvent({
        sessionId,
        eventType,
        productId,
        productName,
        timestamp: new Date().toISOString(),
        metadata: metadata ? JSON.stringify(metadata) : null
      });
      res.json(event);
    } catch (e: any) {
      console.error("[EVENT ERROR] Failed to track event:", e.message);
      res.status(500).json({ error: "Failed to track event" });
    }
  });

  // NEW: Admin Login
  app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;
    // VERY SIMPLE: Default admin check or check storage
    const user = await storage.getUserByUsername(username);
    if (user && user.password === password) {
      // In a real app we'd use sessions/JWT, but for "simple" we'll return success
      res.json({ success: true, token: "simple-admin-token" });
    } else if (username === "admin" && password === "lumina2026") {
      res.json({ success: true, token: "simple-admin-token" });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // NEW: Admin Stats
  app.get("/api/admin/stats", async (req, res) => {
    // Basic auth check placeholder
    const token = req.headers.authorization;
    if (token !== "simple-admin-token") return res.status(401).json({ error: "Unauthorized" });

    const visits = await storage.getVisits();
    const leads = await storage.getLeads();
    const events = await storage.getEvents();

    const now = new Date();
    const fiveMinsAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString();

    const totalVisitors = new Set(visits.map(v => v.sessionId)).size;
    const liveUsers = new Set(visits.filter(v => v.timestamp >= fiveMinsAgo).map(v => v.sessionId)).size;
    const abandonedCarts = leads.filter(l => l.status === "pending").length;

    // Aggregated Analytics
    const totalCarts = events.filter(e => e.eventType === "add_to_cart").length;
    const totalViews = events.filter(e => e.eventType === "view_item").length;

    // A session is "abandoned" if it has an add_to_cart but no "ordered" lead
    const sessionsWithCarts = new Set(events.filter(e => e.eventType === "add_to_cart").map(e => e.sessionId));
    const sessionsWithOrders = new Set(leads.filter(l => l.status === "ordered").map(l => l.sessionId));
    const abandonedTotal = Array.from(sessionsWithCarts).filter(sid => !sessionsWithOrders.has(sid)).length;

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

    // ─── BUILD AN IP → SESSIONS MAP ─────────────────────────────────────────
    // For every visit, map IP to the set of sessionIds seen from that IP.
    const ipToSessions: Record<string, Set<string>> = {};
    for (const v of visits) {
      const ip = v.ipAddress || 'unknown';
      if (!ipToSessions[ip]) ipToSessions[ip] = new Set();
      ipToSessions[ip].add(v.sessionId);
    }
    // Also collect IPs from leads (ghost leads with no visit record)
    for (const l of leads) {
      if (l.ipAddress) {
        if (!ipToSessions[l.ipAddress]) ipToSessions[l.ipAddress] = new Set();
        ipToSessions[l.ipAddress].add(l.sessionId);
      }
    }

    // ─── USER JOURNEYS (merged by IP) ────────────────────────────────────────
    const mergedJourneys = Object.entries(ipToSessions).map(([ip, sessionSet]) => {
      const sids = Array.from(sessionSet);
      const allVisits = visits.filter(v => sids.includes(v.sessionId));
      const allEvents = events.filter(e => sids.includes(e.sessionId));
      const allLeads  = leads.filter(l => sids.includes(l.sessionId));

      // Sort all leads newest first
      const sortedLeads = [...allLeads].sort((a, b) =>
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      );

      // IDENTITY LEAD: tells us WHO this person is (name, phone, address)
      // Prefer any lead that has a real name, ordered > pending
      const identityLead =
        sortedLeads.find(l => l.status === 'ordered' && (l.firstName || l.phone)) ||
        sortedLeads.find(l => l.firstName || l.phone) ||
        sortedLeads[0];

      // ACTIVE LEAD: tells us what's IN THEIR CART RIGHT NOW
      // Prefer most recent lead that has actual cartItems (non-empty JSON array)
      const parseCart = (raw: string | null | undefined) => {
        if (!raw) return [];
        try { const p = JSON.parse(raw); return Array.isArray(p) && p.length > 0 ? p : []; } catch { return []; }
      };
      const activeLead = sortedLeads.find(l => {
        const cart = parseCart(l.cartItems);
        return cart.length > 0;
      });

      // Current overall status: most recent lead's status
      const currentStatus = sortedLeads[0]?.status || null;

      // Earliest known activity
      const startTime = allVisits[0]?.timestamp || allEvents[0]?.timestamp || sortedLeads[sortedLeads.length - 1]?.lastUpdated || new Date().toISOString();

      const name = `${identityLead?.firstName || ''} ${identityLead?.lastName || ''}`.trim() || null;

      return {
        ip,
        sessionIds: sids,
        startTime,
        views: allEvents.filter(e => e.eventType === 'view_item').map(e => e.productName).filter(Boolean),
        eventCarts: allEvents.filter(e => e.eventType === 'add_to_cart').map(e => e.productName).filter(Boolean),
        // Use activeLead for actual cart items (always current state)
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

    // ─── ABANDONED LEADS (deduplicated by phone, then by IP) ─────────────────
    // If the same phone appears multiple times, keep only the most recent lead.
    const pendingLeads = leads.filter(l => l.status === 'pending');
    const seenPhones = new Set<string>();
    const seenLeadIPs = new Set<string>();
    const dedupedAbandonedLeads = pendingLeads
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .filter(l => {
        const phone = l.phone?.trim();
        const ip = l.ipAddress || '';
        if (phone) {
          if (seenPhones.has(phone)) return false;
          seenPhones.add(phone);
        } else if (ip) {
          if (seenLeadIPs.has(ip)) return false;
          seenLeadIPs.add(ip);
        }
        return true;
      });

    // ─── COMPLETED ORDERS (deduplicated by phone number) ─────────────────────
    const orderedLeads = leads.filter(l => l.status === 'ordered');
    const seenOrderPhones = new Set<string>();
    const dedupedOrders = orderedLeads
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .filter(l => {
        const phone = l.phone?.trim();
        if (phone) {
          if (seenOrderPhones.has(phone)) return false;
          seenOrderPhones.add(phone);
        }
        return true;
      });

    res.json({
      totalVisitors: Object.keys(ipToSessions).length, // Unique IPs = unique visitors
      liveUsers,
      abandonedCarts: abandonedTotal,
      ghostLeads: dedupedAbandonedLeads.length,
      addToCarts: totalCarts,
      productViews: totalViews,
      popularProducts: Object.values(popularProducts).sort((a: any, b: any) => b.views - a.views),
      leads: dedupedAbandonedLeads.map(l => ({
        ...l,
        cartItems: l.cartItems ? JSON.parse(l.cartItems) : []
      })),
      completedOrders: dedupedOrders.map(l => ({
        ...l,
        cartItems: l.cartItems ? JSON.parse(l.cartItems) : []
      })),
      userJourneys: mergedJourneys,
      recentVisits: visits.slice(-100)
    });
  });

  app.get("/api/products", async (req, res) => {
    const dbProducts = await storage.getProducts();
    res.json(dbProducts);
  });

  app.get("/api/inventory", (req, res) => {
    res.json(currentInventory);
  });

  app.post("/api/checkout", async (req, res) => {
    try {
      const { order, shipping, totalPrice } = req.body;

      // 1. Decrement inventory (Immediate/Sync-like)
      for (const item of order) {
        if (currentInventory[item.variantId] && currentInventory[item.variantId][item.size] !== undefined) {
          currentInventory[item.variantId][item.size] = Math.max(0, currentInventory[item.variantId][item.size] - item.quantity);
        }
      }

      // 2. Respond to client immediately to prevent Cloudflare Timeout (524)
      res.status(200).json({ success: true, message: "Order received. Processing in background..." });

      // 3. Perform background tasks (Logging & Email) without blocking the response
      (async () => {
        try {
          // ENSURE Lead exists and is marked as ordered ASAP
          if (shipping && shipping.sessionId) {
            console.log(`[CHECKOUT DEBUG] Updating lead for session: ${shipping.sessionId}`);
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
              status: "pending" // updateLead preserves existing status if it was "ordered"
            });
            await storage.markLeadAsOrdered(shipping.sessionId);
          }
          const spreadsheetId = "141X6rL6v8KIf4Dwrr-uozfZi-Ehs8uJnjHmJuAeoFSM";
          // Attempt to load credentials for Sheets
          let auth;
          const serviceAccountValue = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

          if (serviceAccountValue) {
            console.log("[SHEETS DEBUG] Found GOOGLE_SERVICE_ACCOUNT_JSON in environment.");
            try {
              let configString = serviceAccountValue.trim();

              // If it doesn't start with '{', it's likely Base64 encoded
              if (!configString.startsWith("{")) {
                console.log("[SHEETS DEBUG] Attempting Base64 decoding...");
                configString = Buffer.from(configString, "base64").toString("utf-8");
              }

              const credentials = JSON.parse(configString);
              auth = new google.auth.GoogleAuth({
                credentials,
                scopes: ["https://www.googleapis.com/auth/spreadsheets"],
              });
            } catch (error: any) {
              console.error("[SHEETS DEBUG] Error parsing credentials:", error.message);
            }
          }

          if (!auth) {
            const possiblePaths = [
              path.join(process.cwd(), "server", "credentials.json"),
              path.join(process.cwd(), "credentials.json"),
              path.join(path.dirname(process.argv[1]), "server", "credentials.json"),
              path.join(path.dirname(process.argv[1]), "..", "server", "credentials.json"),
              "/etc/secrets/credentials.json",
            ];

            let credsPath = "";
            for (const p of possiblePaths) {
              if (fs.existsSync(p)) {
                credsPath = p;
                break;
              }
            }

            if (credsPath) {
              console.log(`[SHEETS DEBUG] Found credentials.json at: ${credsPath}`);
              try {
                auth = new google.auth.GoogleAuth({
                  keyFile: credsPath,
                  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
                });
              } catch (authError: any) {
                console.error("[SHEETS DEBUG] Auth Configuration Error:", authError.message);
              }
            } else {
              console.error("[SHEETS DEBUG] Credentials NOT FOUND (No env var or file).");
            }
          }

          if (auth) {
            try {
              const sheets = google.sheets({ version: "v4", auth });
              console.log(`Attempting to log order to Sheet: ${spreadsheetId}`);

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
              console.log("Successfully logged order to Google Sheets.");
            } catch (sheetsError: any) {
              console.error("Google Sheets API Runtime Error:", sheetsError.message);
              if (sheetsError.response && sheetsError.response.data) {
                console.error("Detailed API Error:", JSON.stringify(sheetsError.response.data, null, 2));
              }
            }
          } else {
            console.warn("Google Sheets update skipped: No valid credentials found.");
          }

          // Lead status update moved to top of IIFE for reliability

          // Send email fallback
          await sendOrderEmail(order, shipping, totalPrice);

        } catch (bgError: any) {
          console.error("Critical error in background checkout processing:", bgError.message);
        }
      })();

    } catch (error) {
      console.error("Error initiating checkout:", error);
      if (!res.headersSent) {
        res.status(500).json({ success: false, error: "Internal server error" });
      }
    }
  });

  // ─── ORDER MANAGEMENT ROUTES ───────────────────────────────────────────────
  
  // Add comment to order
  app.post("/api/admin/orders/:sessionId/comment", async (req, res) => {
    const token = req.headers.authorization;
    if (token !== "simple-admin-token") return res.status(401).json({ error: "Unauthorized" });
    
    try {
      const { sessionId } = req.params;
      const { comment, author } = req.body;
      
      if (!comment || comment.trim() === "") {
        return res.status(400).json({ error: "Comment is required" });
      }
      
      const newComment = await storage.addOrderComment({
        sessionId,
        comment: comment.trim(),
        author: author || "admin",
      });
      
      res.json(newComment);
    } catch (error: any) {
      console.error("Failed to add comment:", error);
      res.status(500).json({ error: "Failed to add comment" });
    }
  });
  
  // Get comments for order
  app.get("/api/admin/orders/:sessionId/comments", async (req, res) => {
    const token = req.headers.authorization;
    if (token !== "simple-admin-token") return res.status(401).json({ error: "Unauthorized" });
    
    try {
      const { sessionId } = req.params;
      const comments = await storage.getOrderComments(sessionId);
      res.json(comments);
    } catch (error: any) {
      console.error("Failed to get comments:", error);
      res.status(500).json({ error: "Failed to get comments" });
    }
  });
  
  // Update order details
  app.put("/api/admin/orders/:sessionId", async (req, res) => {
    const token = req.headers.authorization;
    if (token !== "simple-admin-token") return res.status(401).json({ error: "Unauthorized" });
    
    try {
      const { sessionId } = req.params;
      const updateData = req.body;
      
      // Validate and sanitize update data
      const allowedFields = ["firstName", "lastName", "phone", "address", "city", "province", "cartItems", "totalPrice", "status"];
      const sanitizedData: any = {};
      
      for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
          sanitizedData[field] = updateData[field];
        }
      }
      
      if (Object.keys(sanitizedData).length === 0) {
        return res.status(400).json({ error: "No valid fields to update" });
      }
      
      const updatedOrder = await storage.updateOrder(sessionId, sanitizedData);
      res.json(updatedOrder);
    } catch (error: any) {
      console.error("Failed to update order:", error);
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  return httpServer;
}
