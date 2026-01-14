import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Vendor agreements table - stores all signed vendor partnership agreements
 */
export const agreements = mysqlTable("agreements", {
  id: int("id").autoincrement().primaryKey(),
  
  // Agreement type
  agreementType: mysqlEnum("agreementType", ["tours", "restaurant"]).notNull(),
  
  // Vendor information
  vendorName: varchar("vendorName", { length: 255 }).notNull(),
  vendorAddress: text("vendorAddress").notNull(),
  vendorRegistrationNo: varchar("vendorRegistrationNo", { length: 100 }),
  vendorEmail: varchar("vendorEmail", { length: 320 }).notNull(),
  vendorPhone: varchar("vendorPhone", { length: 50 }).notNull(),
  vendorWhatsapp: varchar("vendorWhatsapp", { length: 50 }),
  contactPersonName: varchar("contactPersonName", { length: 255 }).notNull(),
  contactPersonTitle: varchar("contactPersonTitle", { length: 100 }),
  
  // Partnership level
  partnershipLevel: varchar("partnershipLevel", { length: 50 }).notNull(),
  
  // Signature data
  vendorSignature: text("vendorSignature"), // Base64 encoded signature image
  signedAt: timestamp("signedAt"),
  
  // Agreement status
  status: mysqlEnum("status", ["draft", "pending", "signed", "delivered"]).default("pending").notNull(),
  
  // PDF storage
  pdfUrl: text("pdfUrl"),
  pdfKey: varchar("pdfKey", { length: 255 }),
  
  // Delivery tracking
  emailSent: boolean("emailSent").default(false),
  emailSentAt: timestamp("emailSentAt"),
  whatsappSent: boolean("whatsappSent").default(false),
  whatsappSentAt: timestamp("whatsappSentAt"),
  
  // Effective date
  effectiveDate: timestamp("effectiveDate"),
  
  // Metadata
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Agreement = typeof agreements.$inferSelect;
export type InsertAgreement = typeof agreements.$inferInsert;
