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
  // put application routes here
  // prefix all routes with /api

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

  return httpServer;
}
