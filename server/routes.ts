import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { google } from "googleapis";
import path from "path";
import fs from "fs";
import { currentInventory } from "./inventory";

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
        const sheets = google.sheets({ version: "v4", auth });

        // Append row to Google Sheets
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: "Sheet1!A:J", // Assuming it's Sheet1
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [
              [
                new Date().toISOString(),
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
      } else {
        console.warn("Google Sheets credentials not found/invalid. Skipping sheet update in dev mode.");
      }

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
