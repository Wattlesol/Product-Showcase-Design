import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const visits = pgTable("visits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  timestamp: text("timestamp").notNull(),
  path: text("path").notNull(),
  ipAddress: text("ip_address"),
  referrer: text("referrer"),
  ttclid: text("ttclid"), // TikTok Click ID
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
});

export const products = pgTable("products", {
  id: text("id").primaryKey(), // Using string IDs like SHOE-001
  name: text("name").notNull(),
  price: text("price").notNull(),
  originalPrice: text("original_price"),
  description: text("description"),
  category: text("category").default("Shoes"),
  stock: text("stock").default("100"),
  metadata: text("metadata"), // For variants/images JSON
});

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  province: text("province"),
  cartItems: text("cart_items"), // JSON string
  totalPrice: text("total_price"),
  status: text("status").notNull().default("pending"), // pending, ordered
  lastUpdated: text("last_updated").notNull(),
  ipAddress: text("ip_address"),
});

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  eventType: text("event_type").notNull(), // view_item, add_to_cart
  productId: text("product_id"),
  productName: text("product_name"),
  timestamp: text("timestamp").notNull(),
  metadata: text("metadata"), // JSON string
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertVisitSchema = createInsertSchema(visits);
export const insertLeadSchema = createInsertSchema(leads);
export const insertEventSchema = createInsertSchema(events);
export const insertProductSchema = createInsertSchema(products);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Visit = typeof visits.$inferSelect;
export type InsertVisit = z.infer<typeof insertVisitSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
