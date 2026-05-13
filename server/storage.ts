import { 
  type User, type InsertUser, 
  type Visit, type InsertVisit, 
  type Lead, type InsertLead, 
  type Event, type InsertEvent, 
  type Product, type InsertProduct, 
  type ProductImage, 
  type Order, type InsertOrder,
  type OrderComment, type InsertOrderComment, 
  users, visits, leads, events, products, productImages, orders, orderComments 
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import { hashPassword } from "./auth";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Visits
  createVisit(visit: InsertVisit): Promise<Visit>;
  getVisits(): Promise<Visit[]>;

  // Leads
  updateLead(lead: InsertLead): Promise<Lead>;
  getLeads(): Promise<Lead[]>;
  getLeadBySession(sessionId: string): Promise<Lead | undefined>;
  markLeadAsOrdered(sessionId: string): Promise<void>;

  // Events
  createEvent(event: InsertEvent): Promise<Event>;
  getEvents(): Promise<Event[]>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Product Images
  saveProductImage(image: Omit<ProductImage, "id">): Promise<ProductImage>;
  getProductImage(productId: number, variantId: string, type: string): Promise<ProductImage | undefined>;

  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrders(): Promise<Order[]>;

  // Order Comments
  addOrderComment(comment: InsertOrderComment): Promise<OrderComment>;
  getOrderComments(sessionId: string): Promise<OrderComment[]>;
  updateOrder(sessionId: string, data: Partial<InsertLead>): Promise<Lead>;

  // Cleanup
  clearTrackingData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await hashPassword(insertUser.password);
    const [user] = await db.insert(users).values({ ...insertUser, password: hashedPassword }).returning();
    return user;
  }

  async createVisit(insertVisit: any): Promise<Visit> {
    const [visit] = await db.insert(visits).values(insertVisit).returning();
    return visit;
  }

  async getVisits(): Promise<Visit[]> {
    return await db.select().from(visits);
  }

  async updateLead(insertLead: any): Promise<Lead> {
    const existing = await this.getLeadBySession(insertLead.sessionId);
    if (existing) {
      const finalStatus = existing.status === "ordered" ? "ordered" : (insertLead.status || "pending");
      const [updated] = await db.update(leads)
        .set({ ...insertLead, status: finalStatus })
        .where(eq(leads.sessionId, insertLead.sessionId))
        .returning();
      return updated;
    } else {
      const [newLead] = await db.insert(leads).values(insertLead).returning();
      return newLead;
    }
  }

  async getLeads(): Promise<Lead[]> {
    return await db.select().from(leads);
  }

  async getLeadBySession(sessionId: string): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.sessionId, sessionId));
    return lead;
  }

  async markLeadAsOrdered(sessionId: string): Promise<void> {
    await db.update(leads)
      .set({ status: "ordered" })
      .where(eq(leads.sessionId, sessionId));
  }

  async createEvent(insertEvent: any): Promise<Event> {
    const [event] = await db.insert(events).values(insertEvent).returning();
    return event;
  }

  async getEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.active, true));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [productItem] = await db.insert(products).values(insertProduct).returning();
    return productItem;
  }

  // Product Images
  async saveProductImage(image: Omit<ProductImage, "id">): Promise<ProductImage> {
    const [saved] = await db.insert(productImages).values(image).returning();
    return saved;
  }

  async getProductImage(productId: number, variantId: string, type: string): Promise<ProductImage | undefined> {
    const [image] = await db.select()
      .from(productImages)
      .where(
        and(
          eq(productImages.productId, productId),
          eq(productImages.variantId, variantId),
          eq(productImages.imageType, type)
        )
      );
    return image;
  }

  // Orders
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.timestamp));
  }

  // Order Comments
  async addOrderComment(comment: InsertOrderComment): Promise<OrderComment> {
    const [newComment] = await db.insert(orderComments).values(comment).returning();
    return newComment;
  }

  async getOrderComments(sessionId: string): Promise<OrderComment[]> {
    return await db.select().from(orderComments).where(eq(orderComments.sessionId, sessionId)).orderBy(desc(orderComments.createdAt));
  }

  async updateOrder(sessionId: string, data: Partial<InsertLead>): Promise<Lead> {
    const [updated] = await db.update(leads)
      .set(data)
      .where(eq(leads.sessionId, sessionId))
      .returning();
    return updated;
  }

  // Cleanup
  async clearTrackingData(): Promise<void> {
    await db.delete(visits);
    await db.delete(leads);
    await db.delete(events);
  }
}

export const storage = new DatabaseStorage();
