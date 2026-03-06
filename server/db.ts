import pkg from 'pg';
const { Pool: PGPool } = pkg;
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
import "dotenv/config";

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set. Ensure the database is provisioned.");
}

export const pool = new PGPool({ connectionString: process.env.DATABASE_URL });
export const db = drizzlePg(pool, { schema });
