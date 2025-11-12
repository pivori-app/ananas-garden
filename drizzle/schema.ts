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
  paymentMethod: mysqlEnum("paymentMethod", ["paypal", "stripe", "card"]),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "completed", "failed", "refunded"]).default("pending"),
  paypalOrderId: varchar("paypalOrderId", { length: 255 }), // ID de la commande PayPal
  paypalPayerId: varchar("paypalPayerId", { length: 255 }), // ID du payeur PayPal
  paypalPayerEmail: varchar("paypalPayerEmail", { length: 320 }), // Email du payeur PayPal
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

/**
 * Table des points de fidélité
 */
export const loyaltyPoints = mysqlTable("loyaltyPoints", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id).notNull().unique(),
  points: int("points").default(0).notNull(),
  totalEarned: int("totalEarned").default(0).notNull(),
  totalSpent: int("totalSpent").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LoyaltyPoints = typeof loyaltyPoints.$inferSelect;
export type InsertLoyaltyPoints = typeof loyaltyPoints.$inferInsert;

/**
 * Table des transactions de points de fidélité
 */
export const loyaltyTransactions = mysqlTable("loyaltyTransactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id).notNull(),
  points: int("points").notNull(), // positif pour gain, négatif pour dépense
  type: mysqlEnum("type", ["earned", "spent", "bonus"]).notNull(),
  description: text("description").notNull(),
  orderId: int("orderId").references(() => orders.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LoyaltyTransaction = typeof loyaltyTransactions.$inferSelect;
export type InsertLoyaltyTransaction = typeof loyaltyTransactions.$inferInsert;

/**
 * Table des abonnements bouquets mensuels
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id).notNull(),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }).unique(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  plan: mysqlEnum("plan", ["economique", "standard", "premium"]).notNull(),
  status: mysqlEnum("status", ["active", "cancelled", "paused", "expired"]).default("active").notNull(),
  price: int("price").notNull(), // Prix mensuel en centimes
  deliveryDay: int("deliveryDay").default(1).notNull(), // Jour du mois (1-28)
  deliveryAddress: text("deliveryAddress").notNull(),
  preferences: text("preferences"), // JSON: occasions préférées, couleurs, style
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  cancelledAt: timestamp("cancelledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Table des témoignages clients
 */
export const testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  customerName: varchar("customerName", { length: 200 }).notNull(),
  rating: int("rating").notNull(), // 1-5 étoiles
  comment: text("comment").notNull(),
  bouquetName: varchar("bouquetName", { length: 200 }),
  imageUrl: text("imageUrl"), // Photo du bouquet livré
  isVerified: int("isVerified").default(0).notNull(), // 0 = non vérifié, 1 = vérifié
  isVisible: int("isVisible").default(1).notNull(), // 0 = caché, 1 = visible
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;
/**
 * Table des notifications push
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id).notNull(),
  type: mysqlEnum("type", ["delivery", "promotion", "anniversary", "referral", "system"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  read: int("read").default(0).notNull(), // 0 = unread, 1 = read
  actionUrl: varchar("actionUrl", { length: 512 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Table du programme de parrainage
 */
export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  referrerId: int("referrerId").references(() => users.id).notNull(),
  referredUserId: int("referredUserId").references(() => users.id),
  referralCode: varchar("referralCode", { length: 20 }).notNull().unique(),
  status: mysqlEnum("status", ["pending", "completed", "rewarded"]).default("pending").notNull(),
  pointsAwarded: int("pointsAwarded").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;

/**
 * Table des articles de blog sur le langage des fleurs
 */
export const blogPosts = mysqlTable("blogPosts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(), // Résumé court pour la liste
  content: text("content").notNull(), // Contenu complet en markdown
  coverImageUrl: text("coverImageUrl"),
  category: mysqlEnum("category", ["langage-des-fleurs", "conseils", "tendances", "histoire", "diy"]).notNull(),
  tags: text("tags"), // JSON array
  authorName: varchar("authorName", { length: 200 }).default("Ananas Garden").notNull(),
  readTime: int("readTime").default(5).notNull(), // Temps de lecture en minutes
  isPublished: int("isPublished").default(1).notNull(), // 0 = brouillon, 1 = publié
  publishedAt: timestamp("publishedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * Table de la galerie de réalisations
 */
export const gallery = mysqlTable("gallery", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("imageUrl").notNull(),
  bouquetType: varchar("bouquetType", { length: 100 }), // Type de bouquet (mariage, anniversaire, etc.)
  tags: text("tags"), // JSON array pour filtrage
  isVisible: int("isVisible").default(1).notNull(), // 0 = caché, 1 = visible
  displayOrder: int("displayOrder").default(0).notNull(), // Pour l'ordre d'affichage
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GalleryItem = typeof gallery.$inferSelect;
export type InsertGalleryItem = typeof gallery.$inferInsert;

/**
 * Table de la wishlist (liste de souhaits)
 * Remplace la table favorites existante avec plus de fonctionnalités
 */
export const wishlists = mysqlTable("wishlists", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id).notNull(),
  bouquetId: int("bouquetId").references(() => bouquets.id).notNull(),
  notes: text("notes"), // Notes personnelles de l'utilisateur
  notifyOnPromotion: int("notifyOnPromotion").default(1).notNull(), // 0 = non, 1 = oui
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WishlistItem = typeof wishlists.$inferSelect;
export type InsertWishlistItem = typeof wishlists.$inferInsert;

/**
 * Table des notations de bouquets
 * Permet aux utilisateurs de noter et commenter les bouquets
 */
export const bouquetRatings = mysqlTable("bouquet_ratings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id).notNull(),
  bouquetId: int("bouquetId").references(() => bouquets.id).notNull(),
  rating: int("rating").notNull(), // Note de 1 à 5
  comment: text("comment"), // Commentaire optionnel
  isVerified: int("isVerified").default(0).notNull(), // 0 = non vérifié, 1 = achat vérifié
  isVisible: int("isVisible").default(1).notNull(), // 0 = masqué, 1 = visible
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BouquetRating = typeof bouquetRatings.$inferSelect;
export type InsertBouquetRating = typeof bouquetRatings.$inferInsert;

/**
 * Table de l'historique des scans
 * Stocke les résultats des scans de fleurs et bouquets
 */
export const scanHistory = mysqlTable("scan_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id).notNull(),
  imageUrl: text("imageUrl").notNull(), // URL de l'image scannée
  scanType: mysqlEnum("scanType", ["flower", "bouquet"]).notNull(), // Type de scan
  result: text("result").notNull(), // Résultat JSON du scan
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ScanHistoryItem = typeof scanHistory.$inferSelect;
export type InsertScanHistoryItem = typeof scanHistory.$inferInsert;
