import fs from "fs";
import path from "path";
import "dotenv/config";
import { storage } from "./storage";

async function migrate() {
    const dbPath = path.join(process.cwd(), "server", "db.json");
    if (!fs.existsSync(dbPath)) {
        console.log("No db.json found. Skipping migration.");
        return;
    }

    try {
        const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
        console.log("Starting migration from db.json...");

        if (data.users) {
            for (const user of data.users) {
                const existing = await storage.getUserByUsername(user.username);
                if (!existing) {
                    await storage.createUser(user);
                    console.log(`Migrated user: ${user.username}`);
                }
            }
        }

        if (data.visits) {
            for (const visit of data.visits) {
                await storage.createVisit(visit);
            }
            console.log(`Migrated ${data.visits.length} visits.`);
        }

        if (data.leads) {
            for (const lead of data.leads) {
                await storage.updateLead(lead);
            }
            console.log(`Migrated ${data.leads.length} leads.`);
        }

        console.log("Migration completed successfully.");
        // Optionally rename the file to avoid re-migration
        // fs.renameSync(dbPath, dbPath + ".bak");
    } catch (e) {
        console.error("Migration failed:", e);
    }
}

migrate();
