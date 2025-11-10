import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
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

export const favorites = mysqlTable("favorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  bouquetId: int("bouquetId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;

/**
 * Table des fleurs avec leurs significations et symbolisme
 */
export const flowers = mysqlTable("flowers", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  scientificName: varchar("scientificName", { length: 150 }),
  symbolism: text("symbolism").notNull(), // Signification principale
  emotions: text("emotions").notNull(), // JSON array des émotions associées
  keywords: text("keywords").notNull(), // JSON array des mots-clés pour le matching
  color: varchar("color", { length: 50 }).notNull(),
  pricePerStem: int("pricePerStem").notNull(), // Prix en centimes
  stock: int("stock").default(100).notNull(),
  imageUrl: text("imageUrl"),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Flower = typeof flowers.$inferSelect;
export type InsertFlower = typeof flowers.$inferInsert;

/**
 * Table des bouquets générés
 */
export const bouquets = mysqlTable("bouquets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  originalMessage: text("originalMessage").notNull(),
  occasion: varchar("occasion", { length: 100 }),
  budget: mysqlEnum("budget", ["economique", "standard", "premium"]).notNull(),
  dominantColors: text("dominantColors"), // JSON array
  style: mysqlEnum("style", ["moderne", "romantique", "champetre", "luxe"]),
  totalPrice: int("totalPrice").notNull(), // Prix en centimes
  explanation: text("explanation"), // Explication du symbolisme
  imageUrl: text("imageUrl"), // URL de l'image générée du bouquet
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Bouquet = typeof bouquets.$inferSelect;
export type InsertBouquet = typeof bouquets.$inferInsert;

/**
 * Table de liaison many-to-many entre bouquets et fleurs
 */
export const bouquetFlowers = mysqlTable("bouquetFlowers", {
  id: int("id").autoincrement().primaryKey(),
  bouquetId: int("bouquetId").references(() => bouquets.id).notNull(),
  flowerId: int("flowerId").references(() => flowers.id).notNull(),
  quantity: int("quantity").default(1).notNull(),
});

export type BouquetFlower = typeof bouquetFlowers.$inferSelect;
export type InsertBouquetFlower = typeof bouquetFlowers.$inferInsert;

/**
 * Table des commandes
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  customerName: varchar("customerName", { length: 200 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 20 }),
  deliveryAddress: text("deliveryAddress").notNull(),
  deliveryDate: timestamp("deliveryDate"),
  personalMessage: text("personalMessage"),
  addVase: int("addVase").default(0).notNull(), // 0 = non, 1 = oui
  vasePrice: int("vasePrice").default(0).notNull(), // Prix en centimes
  totalPrice: int("totalPrice").notNull(), // Prix total en centimes
  status: mysqlEnum("status", ["pending", "confirmed", "preparing", "delivered", "cancelled"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Table des articles de commande
 */
export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").references(() => orders.id).notNull(),
  bouquetId: int("bouquetId").references(() => bouquets.id),
  quantity: int("quantity").default(1).notNull(),
  unitPrice: int("unitPrice").notNull(), // Prix unitaire en centimes
  totalPrice: int("totalPrice").notNull(), // Prix total en centimes
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * Table du panier (cart)
 */
export const cartItems = mysqlTable("cartItems", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  sessionId: varchar("sessionId", { length: 255 }), // Pour les utilisateurs non connectés
  bouquetId: int("bouquetId").references(() => bouquets.id).notNull(),
  quantity: int("quantity").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;