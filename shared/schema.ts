import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, customType, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Custom bytea type for image blobs
const bytea = customType<{ data: Buffer }>({
  dataType() {
    return 'bytea';
  },
});

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export interface Variant {
  id: string;
  color: string;
  image: string;
  images3D: string[];
  colorCode: string;
}

export interface CartItem {
  id: number;
  variantId: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
}

export const products = pgTable("products", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  price: integer("price").notNull(), // Using integer for PKR
  originalPrice: integer("original_price"),
  rating: text("rating").default("5.0"),
  category: text("category").notNull(),
  description: text("description").notNull(),
  variants: jsonb("variants").$type<Variant[]>().notNull(),
  active: boolean("active").default(true),
});

export const productImages = pgTable("product_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: integer("product_id").notNull(),
  variantId: text("variant_id").notNull(),
  imageType: text("image_type").notNull(), // 'C', 'L', 'R'
  data: bytea("data").notNull(),
  contentType: text("content_type").default("image/webp"),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  province: text("province").notNull(),
  cartItems: jsonb("cart_items").$type<CartItem[]>().notNull(),
  totalPrice: integer("total_price").notNull(),
  status: text("status").notNull().default("pending"),
  timestamp: timestamp("timestamp").default(sql`now()`),
});

export const visits = pgTable("visits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  timestamp: text("timestamp").notNull(),
  path: text("path").notNull(),
  ipAddress: text("ip_address"),
  referrer: text("referrer"),
  ttclid: text("ttclid"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
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
  cartItems: text("cart_items"),
  totalPrice: text("total_price"),
  status: text("status").notNull().default("pending"),
  lastUpdated: text("last_updated").notNull(),
  ipAddress: text("ip_address"),
});

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  eventType: text("event_type").notNull(),
  productId: text("product_id"),
  productName: text("product_name"),
  timestamp: text("timestamp").notNull(),
  metadata: text("metadata"),
});

export const orderComments = pgTable("order_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  comment: text("comment").notNull(),
  author: text("author").default("admin"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProductSchema = createInsertSchema(products);
export const insertOrderSchema = createInsertSchema(orders);
export const insertVisitSchema = createInsertSchema(visits);
export const insertLeadSchema = createInsertSchema(leads);
export const insertEventSchema = createInsertSchema(events);
export const insertOrderCommentSchema = createInsertSchema(orderComments);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type ProductImage = typeof productImages.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Visit = typeof visits.$inferSelect;
export type InsertVisit = z.infer<typeof insertVisitSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type OrderComment = typeof orderComments.$inferSelect;
export type InsertOrderComment = z.infer<typeof insertOrderCommentSchema>;
