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
  host: process.env.EMAIL_HOST || "mail.hostinger.com",
  port: parseInt(process.env.EMAIL_PORT || "465"),
  secure: process.env.EMAIL_PORT === "465",
  auth: {
    user: process.env.EMAIL_USER || "admin@wattlesol.com",
    pass: process.env.EMAIL_PASS || "easyPassword@786",
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

      const spreadsheetId = "141X6rL6v8KIf4Dwrr-uozfZi-Ehs8uJnjHmJuAeoFSM";

      // Attempt to load credentials
      let auth;
      const credsPath = path.join(process.cwd(), "server", "credentials.json");

      if (fs.existsSync(credsPath)) {
        // We use a try/catch here to avoid crashing if credentials are dummy
        try {
          auth = new google.auth.GoogleAuth({
            keyFile: credsPath,
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
          });
        } catch (e) {
          console.error("Credentials error:", e);
        }
      }

      if (auth) {
        try {
          const sheets = google.sheets({ version: "v4", auth });

          // Append row to Google Sheets
          await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: "Sheet1", // Simplified range
            valueInputOption: "USER_ENTERED",
            requestBody: {
              values: [
                [
                  new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" }), // Local time
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
          console.error("Google Sheets API Error:", sheetsError.message);
          if (sheetsError.response && sheetsError.response.data) {
            console.error("Detailed Error Data:", JSON.stringify(sheetsError.response.data));
          }
        }
      } else {
        console.warn("Google Sheets credentials not found/invalid.");
      }

      // Send email fallback
      await sendOrderEmail(order, shipping, totalPrice);

      // Decrement inventory
      for (const item of order) {
        if (currentInventory[item.variantId] && currentInventory[item.variantId][item.size] !== undefined) {
          currentInventory[item.variantId][item.size] = Math.max(0, currentInventory[item.variantId][item.size] - item.quantity);
        }
      }

      res.status(200).json({ success: true, message: "Order processed successfully" });
    } catch (error) {
      console.error("Error processing checkout:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  return httpServer;
}
