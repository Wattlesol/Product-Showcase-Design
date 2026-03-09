import { type User, type InsertUser, type Visit, type InsertVisit, type Lead, type InsertLead, type Event, type InsertEvent, type Product, type InsertProduct, type OrderComment, type InsertOrderComment, users, visits, leads, events, products, orderComments } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

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
  createProduct(product: InsertProduct): Promise<Product>;

  // Order Comments
  addOrderComment(comment: InsertOrderComment): Promise<OrderComment>;
  getOrderComments(sessionId: string): Promise<OrderComment[]>;
  updateOrder(sessionId: string, data: Partial<InsertLead>): Promise<Lead>;
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
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createVisit(insertVisit: InsertVisit): Promise<Visit> {
    const [visit] = await db.insert(visits).values(insertVisit).returning();
    return visit;
  }

  async getVisits(): Promise<Visit[]> {
    return await db.select().from(visits);
  }

  async updateLead(insertLead: InsertLead): Promise<Lead> {
    const existing = await this.getLeadBySession(insertLead.sessionId);
    if (existing) {
      // If the lead is already marked as ordered, don't let a partial form sync downgrade it
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

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db.insert(events).values(insertEvent).returning();
    return event;
  }

  async getEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [productItem] = await db.insert(products).values(insertProduct).onConflictDoUpdate({
      target: products.id,
      set: insertProduct
    }).returning();
    return productItem;
  }

  // Order Comments
  async addOrderComment(comment: InsertOrderComment): Promise<OrderComment> {
    const [newComment] = await db.insert(orderComments).values(comment).returning();
    return newComment;
  }

  async getOrderComments(sessionId: string): Promise<OrderComment[]> {
    return await db.select().from(orderComments).where(eq(orderComments.sessionId)).orderBy(desc(orderComments.createdAt));
  }

  async updateOrder(sessionId: string, data: Partial<InsertLead>): Promise<Lead> {
    const [updated] = await db.update(leads)
      .set({ ...data, lastUpdated: new Date().toISOString() })
      .where(eq(leads.sessionId, sessionId))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
