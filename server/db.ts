import { eq, and, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  flowers, 
  bouquets, 
  bouquetFlowers, 
  cartItems, 
  orders, 
  orderItems,
  favorites,
  loyaltyPoints,
  loyaltyTransactions,
  testimonials,
  blogPosts,
  referrals,
  gallery,
  wishlists,
  bouquetRatings,
  InsertBouquet,
  InsertCartItem,
  InsertOrder,
  InsertOrderItem,
  InsertFavorite,
  InsertTestimonial,
  InsertGalleryItem,
  InsertWishlistItem,
  InsertBouquetRating,
  birthdayContacts,
  birthdayOrders,
  InsertBirthdayContact,
  InsertBirthdayOrder
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Flowers queries
 */
export async function getAllFlowers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(flowers);
}

export async function getFlowerById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(flowers).where(eq(flowers.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function searchFlowersByKeywords(keywords: string[]) {
  const db = await getDb();
  if (!db) return [];
  const allFlowers = await db.select().from(flowers);
  
  // Score each flower based on keyword matches
  const scoredFlowers = allFlowers.map(flower => {
    const flowerKeywords = JSON.parse(flower.keywords) as string[];
    const flowerEmotions = JSON.parse(flower.emotions) as string[];
    
    let score = 0;
    keywords.forEach(keyword => {
      const lowerKeyword = keyword.toLowerCase();
      // Check in keywords
      if (flowerKeywords.some(k => k.toLowerCase().includes(lowerKeyword) || lowerKeyword.includes(k.toLowerCase()))) {
        score += 3;
      }
      // Check in emotions
      if (flowerEmotions.some(e => e.toLowerCase().includes(lowerKeyword) || lowerKeyword.includes(e.toLowerCase()))) {
        score += 2;
      }
      // Check in symbolism
      if (flower.symbolism.toLowerCase().includes(lowerKeyword)) {
        score += 1;
      }
    });
    
    return { flower, score };
  });
  
  // Return flowers with score > 0, sorted by score
  return scoredFlowers
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.flower);
}

export async function updateFlowerStock(flowerId: number, quantity: number) {
  const db = await getDb();
  if (!db) return false;
  
  const flower = await getFlowerById(flowerId);
  if (!flower) return false;
  
  const newStock = flower.stock + quantity;
  if (newStock < 0) return false;
  
  await db.update(flowers).set({ stock: newStock }).where(eq(flowers.id, flowerId));
  return true;
}

/**
 * Bouquets queries
 */
export async function createBouquet(bouquet: InsertBouquet) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.insert(bouquets).values(bouquet);
  return Number(result[0].insertId);
}

export async function getBouquetById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(bouquets).where(eq(bouquets.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function addFlowerToBouquet(bouquetId: number, flowerId: number, quantity: number) {
  const db = await getDb();
  if (!db) return false;
  
  await db.insert(bouquetFlowers).values({
    bouquetId,
    flowerId,
    quantity,
  });
  return true;
}

export async function getBouquetFlowers(bouquetId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      flower: flowers,
      quantity: bouquetFlowers.quantity,
    })
    .from(bouquetFlowers)
    .innerJoin(flowers, eq(bouquetFlowers.flowerId, flowers.id))
    .where(eq(bouquetFlowers.bouquetId, bouquetId));
  
  return result;
}

/**
 * Cart queries
 */
export async function addToCart(item: InsertCartItem) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.insert(cartItems).values(item);
  return Number(result[0].insertId);
}

export async function getCartItems(userId?: number, sessionId?: string) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(cartItems);
  
  if (userId) {
    query = query.where(eq(cartItems.userId, userId)) as any;
  } else if (sessionId) {
    query = query.where(eq(cartItems.sessionId, sessionId)) as any;
  } else {
    return [];
  }
  
  return await query;
}

export async function removeFromCart(cartItemId: number) {
  const db = await getDb();
  if (!db) return false;
  
  await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
  return true;
}

export async function clearCart(userId?: number, sessionId?: string) {
  const db = await getDb();
  if (!db) return false;
  
  if (userId) {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  } else if (sessionId) {
    await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
  }
  
  return true;
}

/**
 * Orders queries
 */
export async function createOrder(order: InsertOrder) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.insert(orders).values(order);
  return Number(result[0].insertId);
}

export async function addOrderItem(item: InsertOrderItem) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.insert(orderItems).values(item);
  return Number(result[0].insertId);
}

export async function getOrderById(orderId: number) {
  const db = await getDb();
  if (!db) return null;

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order) return null;

  // Récupérer les items de la commande avec les bouquets
  const items = await db
    .select({
      orderItem: orderItems,
      bouquet: bouquets,
    })
    .from(orderItems)
    .leftJoin(bouquets, eq(orderItems.bouquetId, bouquets.id))
    .where(eq(orderItems.orderId, orderId));

  return {
    ...order,
    items: items.map(item => ({
      ...item.orderItem,
      bouquet: item.bouquet!,
    })),
  };
}

export async function getUserOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(orders).where(eq(orders.userId, userId));
}

// ==================== FAVORITES ====================

export async function addFavorite(userId: number, bouquetId: number): Promise<number | null> {
  const db = await getDb();
  if (!db) return null;

  // Vérifier si déjà en favoris
  const existing = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.bouquetId, bouquetId)))
    .limit(1);

  if (existing.length > 0) {
    return existing[0].id;
  }

  const result = await db.insert(favorites).values({
    userId,
    bouquetId,
  });

  return result[0].insertId;
}

export async function removeFavorite(userId: number, bouquetId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  await db
    .delete(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.bouquetId, bouquetId)));

  return true;
}

export async function getUserFavorites(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select({
      favorite: favorites,
      bouquet: bouquets,
    })
    .from(favorites)
    .leftJoin(bouquets, eq(favorites.bouquetId, bouquets.id))
    .where(eq(favorites.userId, userId))
    .orderBy(desc(favorites.createdAt));

  return result;
}

export async function isFavorite(userId: number, bouquetId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.bouquetId, bouquetId)))
    .limit(1);

  return result.length > 0;
}

export async function updateOrderStatus(orderId: number, status: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  await db
    .update(orders)
    .set({ status: status as "pending" | "confirmed" | "preparing" | "delivered" | "cancelled" })
    .where(eq(orders.id, orderId));

  return true;
}

// ==================== LOYALTY POINTS ====================

export async function getUserLoyaltyPoints(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const [result] = await db
    .select()
    .from(loyaltyPoints)
    .where(eq(loyaltyPoints.userId, userId))
    .limit(1);

  return result || null;
}

export async function createLoyaltyAccount(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const result = await db.insert(loyaltyPoints).values({
    userId,
    points: 0,
    totalEarned: 0,
    totalSpent: 0,
  });

  return Number(result[0].insertId);
}

export async function addLoyaltyPoints(
  userId: number,
  points: number,
  type: "earned" | "bonus",
  description: string,
  orderId?: number
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    // Créer ou récupérer le compte de fidélité
    let account = await getUserLoyaltyPoints(userId);
    if (!account) {
      await createLoyaltyAccount(userId);
      account = await getUserLoyaltyPoints(userId);
    }

    if (!account) return false;

    // Mettre à jour les points
    await db
      .update(loyaltyPoints)
      .set({
        points: account.points + points,
        totalEarned: account.totalEarned + points,
      })
      .where(eq(loyaltyPoints.userId, userId));

    // Enregistrer la transaction
    await db.insert(loyaltyTransactions).values({
      userId,
      points,
      type,
      description,
      orderId,
    });

    return true;
  } catch (error) {
    console.error("[Loyalty] Error adding points:", error);
    return false;
  }
}

export async function spendLoyaltyPoints(
  userId: number,
  points: number,
  description: string,
  orderId?: number
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    const account = await getUserLoyaltyPoints(userId);
    if (!account || account.points < points) {
      return false; // Pas assez de points
    }

    // Mettre à jour les points
    await db
      .update(loyaltyPoints)
      .set({
        points: account.points - points,
        totalSpent: account.totalSpent + points,
      })
      .where(eq(loyaltyPoints.userId, userId));

    // Enregistrer la transaction
    await db.insert(loyaltyTransactions).values({
      userId,
      points: -points, // Négatif pour dépense
      type: "spent",
      description,
      orderId,
    });

    return true;
  } catch (error) {
    console.error("[Loyalty] Error spending points:", error);
    return false;
  }
}

export async function getLoyaltyTransactions(userId: number, limit: number = 20) {
  const db = await getDb();
  if (!db) return [];

  const transactions = await db
    .select()
    .from(loyaltyTransactions)
    .where(eq(loyaltyTransactions.userId, userId))
    .orderBy(loyaltyTransactions.createdAt)
    .limit(limit);

  return transactions;
}

// ==================== TESTIMONIALS ====================

export async function createTestimonial(testimonial: InsertTestimonial): Promise<number | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(testimonials).values(testimonial);
  return Number(result[0].insertId);
}

export async function getVisibleTestimonials(limit: number = 20) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(testimonials)
    .where(eq(testimonials.isVisible, 1))
    .orderBy(desc(testimonials.createdAt))
    .limit(limit);
}

export async function getUserTestimonials(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(testimonials)
    .where(eq(testimonials.userId, userId))
    .orderBy(desc(testimonials.createdAt));
}

// ============================================
// Blog Posts Functions
// ============================================

export async function getAllBlogPosts() {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.isPublished, 1))
    .orderBy(desc(blogPosts.publishedAt));
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;

  const results = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1);

  return results.length > 0 ? results[0] : null;
}

export async function getBlogPostsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(blogPosts)
    .where(and(
      eq(blogPosts.isPublished, 1),
      eq(blogPosts.category, category as any)
    ))
    .orderBy(desc(blogPosts.publishedAt));
}

export async function getRecentBlogPosts(limit: number = 3) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.isPublished, 1))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit);
}

// ============================================
// Referral Functions
// ============================================

export async function createReferralCode(userId: number, code: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.insert(referrals).values({
      referrerId: userId,
      referralCode: code,
      status: "pending",
    });
    return code;
  } catch (error) {
    console.error("Error creating referral code:", error);
    return null;
  }
}

export async function getReferralByCode(code: string) {
  const db = await getDb();
  if (!db) return null;

  const results = await db
    .select()
    .from(referrals)
    .where(eq(referrals.referralCode, code))
    .limit(1);

  return results.length > 0 ? results[0] : null;
}

export async function getUserReferralCode(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const results = await db
    .select()
    .from(referrals)
    .where(and(
      eq(referrals.referrerId, userId),
      eq(referrals.referredUserId, null as any)
    ))
    .limit(1);

  return results.length > 0 ? results[0] : null;
}

export async function getUserReferrals(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(referrals)
    .where(eq(referrals.referrerId, userId))
    .orderBy(desc(referrals.createdAt));
}

export async function trackReferral(referralCode: string, referredUserId: number) {
  const db = await getDb();
  if (!db) return false;

  try {
    const referral = await getReferralByCode(referralCode);
    if (!referral || referral.referredUserId) return false;

    await db
      .update(referrals)
      .set({
        referredUserId,
        status: "completed",
        completedAt: new Date(),
      })
      .where(eq(referrals.id, referral.id));

    return true;
  } catch (error) {
    console.error("Error tracking referral:", error);
    return false;
  }
}

export async function rewardReferral(referralId: number, points: number) {
  const db = await getDb();
  if (!db) return false;

  try {
    const referral = await db
      .select()
      .from(referrals)
      .where(eq(referrals.id, referralId))
      .limit(1);

    if (referral.length === 0 || referral[0].status === "rewarded") return false;

    // Award points to referrer
    await addLoyaltyPoints(referral[0].referrerId, points, "bonus", `Parrainage réussi - ${points} points bonus`);

    // Update referral status
    await db
      .update(referrals)
      .set({
        status: "rewarded",
        pointsAwarded: points,
      })
      .where(eq(referrals.id, referralId));

    return true;
  } catch (error) {
    console.error("Error rewarding referral:", error);
    return false;
  }
}

export async function getReferralStats(userId: number) {
  const db = await getDb();
  if (!db) return { total: 0, completed: 0, rewarded: 0, totalPoints: 0 };

  const allReferrals = await getUserReferrals(userId);
  
  return {
    total: allReferrals.length,
    completed: allReferrals.filter(r => r.status === "completed" || r.status === "rewarded").length,
    rewarded: allReferrals.filter(r => r.status === "rewarded").length,
    totalPoints: allReferrals.reduce((sum, r) => sum + (r.pointsAwarded || 0), 0),
  };
}

// ============================================
// PayPal Payment Functions
// ============================================

export async function updateOrderPayPalId(orderId: number, paypalOrderId: string): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update order: database not available");
    return;
  }

  try {
    await db
      .update(orders)
      .set({
        paypalOrderId,
        paymentMethod: "paypal",
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));
  } catch (error) {
    console.error("[Database] Failed to update order PayPal ID:", error);
    throw error;
  }
}

export async function updateOrderPaymentStatus(
  orderId: number,
  paymentStatus: "pending" | "completed" | "failed" | "refunded",
  paypalPayerId?: string,
  paypalPayerEmail?: string
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update order: database not available");
    return;
  }

  try {
    const updateData: any = {
      paymentStatus,
      updatedAt: new Date(),
    };

    if (paymentStatus === "completed") {
      updateData.status = "confirmed";
    }

    if (paypalPayerId) {
      updateData.paypalPayerId = paypalPayerId;
    }

    if (paypalPayerEmail) {
      updateData.paypalPayerEmail = paypalPayerEmail;
    }

    await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, orderId));
  } catch (error) {
    console.error("[Database] Failed to update order payment status:", error);
    throw error;
  }
}

// ============================================
// Gallery Functions
// ============================================

export async function getAllGalleryItems() {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(gallery)
    .where(eq(gallery.isVisible, 1))
    .orderBy(gallery.displayOrder, gallery.createdAt);
}

export async function getGalleryItemById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const results = await db
    .select()
    .from(gallery)
    .where(eq(gallery.id, id))
    .limit(1);

  return results.length > 0 ? results[0] : null;
}

export async function createGalleryItem(item: InsertGalleryItem): Promise<number | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(gallery).values(item);
  return Number(result[0].insertId);
}

// ============================================
// Wishlist Functions
// ============================================

export async function getUserWishlist(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select({
      id: wishlists.id,
      bouquetId: wishlists.bouquetId,
      notes: wishlists.notes,
      notifyOnPromotion: wishlists.notifyOnPromotion,
      createdAt: wishlists.createdAt,
      bouquet: bouquets,
    })
    .from(wishlists)
    .leftJoin(bouquets, eq(wishlists.bouquetId, bouquets.id))
    .where(eq(wishlists.userId, userId))
    .orderBy(desc(wishlists.createdAt));
}

export async function addToWishlist(item: InsertWishlistItem): Promise<number | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    // Vérifier si l'item existe déjà
    const existing = await db
      .select()
      .from(wishlists)
      .where(and(
        eq(wishlists.userId, item.userId),
        eq(wishlists.bouquetId, item.bouquetId)
      ))
      .limit(1);

    if (existing.length > 0) {
      return existing[0].id; // Déjà dans la wishlist
    }

    const result = await db.insert(wishlists).values(item);
    return Number(result[0].insertId);
  } catch (error) {
    console.error("[Wishlist] Error adding item:", error);
    return null;
  }
}

export async function removeFromWishlist(userId: number, bouquetId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db
      .delete(wishlists)
      .where(and(
        eq(wishlists.userId, userId),
        eq(wishlists.bouquetId, bouquetId)
      ));
    return true;
  } catch (error) {
    console.error("[Wishlist] Error removing item:", error);
    return false;
  }
}

export async function isInWishlist(userId: number, bouquetId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const results = await db
    .select()
    .from(wishlists)
    .where(and(
      eq(wishlists.userId, userId),
      eq(wishlists.bouquetId, bouquetId)
    ))
    .limit(1);

  return results.length > 0;
}

export async function updateWishlistNotes(userId: number, bouquetId: number, notes: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db
      .update(wishlists)
      .set({ notes, updatedAt: new Date() })
      .where(and(
        eq(wishlists.userId, userId),
        eq(wishlists.bouquetId, bouquetId)
      ));
    return true;
  } catch (error) {
    console.error("[Wishlist] Error updating notes:", error);
    return false;
  }
}


// ==========================================
// Bouquet Ratings Helpers
// ==========================================

export async function addBouquetRating(rating: InsertBouquetRating): Promise<number | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    // Vérifier si l'utilisateur a déjà noté ce bouquet
    const existing = await db
      .select()
      .from(bouquetRatings)
      .where(and(
        eq(bouquetRatings.userId, rating.userId),
        eq(bouquetRatings.bouquetId, rating.bouquetId)
      ))
      .limit(1);

    if (existing.length > 0) {
      // Mettre à jour la note existante
      await db
        .update(bouquetRatings)
        .set({
          rating: rating.rating,
          comment: rating.comment,
          updatedAt: new Date()
        })
        .where(eq(bouquetRatings.id, existing[0].id));
      return existing[0].id;
    }

    // Créer une nouvelle note
    const result = await db.insert(bouquetRatings).values(rating);
    return Number(result[0].insertId);
  } catch (error) {
    console.error("[BouquetRatings] Error adding rating:", error);
    return null;
  }
}

export async function getBouquetRatings(bouquetId: number) {
  const db = await getDb();
  if (!db) return [];

  const ratings = await db
    .select({
      id: bouquetRatings.id,
      rating: bouquetRatings.rating,
      comment: bouquetRatings.comment,
      isVerified: bouquetRatings.isVerified,
      createdAt: bouquetRatings.createdAt,
      user: {
        id: users.id,
        name: users.name,
      },
    })
    .from(bouquetRatings)
    .leftJoin(users, eq(bouquetRatings.userId, users.id))
    .where(and(
      eq(bouquetRatings.bouquetId, bouquetId),
      eq(bouquetRatings.isVisible, 1)
    ))
    .orderBy(desc(bouquetRatings.createdAt));

  return ratings;
}

export async function getAverageRating(bouquetId: number): Promise<{ average: number; count: number }> {
  const db = await getDb();
  if (!db) return { average: 0, count: 0 };

  const result = await db
    .select({
      average: sql<number>`AVG(${bouquetRatings.rating})`,
      count: sql<number>`COUNT(*)`,
    })
    .from(bouquetRatings)
    .where(and(
      eq(bouquetRatings.bouquetId, bouquetId),
      eq(bouquetRatings.isVisible, 1)
    ));

  if (result.length === 0 || result[0].count === 0) {
    return { average: 0, count: 0 };
  }

  return {
    average: Math.round(result[0].average * 10) / 10, // Arrondir à 1 décimale
    count: result[0].count,
  };
}

export async function getUserRating(userId: number, bouquetId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(bouquetRatings)
    .where(and(
      eq(bouquetRatings.userId, userId),
      eq(bouquetRatings.bouquetId, bouquetId)
    ))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function hasUserPurchasedBouquet(userId: number, bouquetId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  // Vérifier si l'utilisateur a commandé ce bouquet
  const result = await db
    .select({ id: orderItems.id })
    .from(orderItems)
    .leftJoin(orders, eq(orderItems.orderId, orders.id))
    .where(and(
      eq(orders.userId, userId),
      eq(orderItems.bouquetId, bouquetId),
      eq(orders.paymentStatus, "completed")
    ))
    .limit(1);

  return result.length > 0;
}


// ==========================================
// Scan History Helpers
// ==========================================

export async function saveScanToHistory(
  userId: number,
  scanData: {
    imageUrl: string;
    scanType: "flower" | "bouquet";
    result: any;
  }
): Promise<number | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(scanHistory).values({
      userId,
      imageUrl: scanData.imageUrl,
      scanType: scanData.scanType,
      result: JSON.stringify(scanData.result),
    });
    return Number(result[0].insertId);
  } catch (error) {
    console.error("[ScanHistory] Error saving scan:", error);
    return null;
  }
}

export async function getUserScanHistory(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  const history = await db
    .select()
    .from(scanHistory)
    .where(eq(scanHistory.userId, userId))
    .orderBy(desc(scanHistory.createdAt))
    .limit(limit);

  // Parser le JSON result pour chaque scan
  return history.map((scan) => ({
    ...scan,
    result: JSON.parse(scan.result),
  }));
}

export async function deleteScanFromHistory(scanId: number, userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db
      .delete(scanHistory)
      .where(and(
        eq(scanHistory.id, scanId),
        eq(scanHistory.userId, userId)
      ));
    return true;
  } catch (error) {
    console.error("[ScanHistory] Error deleting scan:", error);
    return false;
  }
}

// ==================== Birthday Contacts ====================

export async function createBirthdayContact(userId: number, contactData: {
  firstName: string;
  lastName: string;
  birthDate: Date;
  address?: string;
  phone?: string;
  email?: string;
  preferences?: string;
  googleCalendarEventId?: string;
}) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(birthdayContacts).values({
      userId,
      ...contactData,
    });
    return Number(result[0].insertId);
  } catch (error) {
    console.error("[BirthdayContacts] Error creating contact:", error);
    return null;
  }
}

export async function getUserBirthdayContacts(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(birthdayContacts)
    .where(eq(birthdayContacts.userId, userId))
    .orderBy(birthdayContacts.birthDate);
}

export async function updateBirthdayContact(contactId: number, userId: number, updates: Partial<InsertBirthdayContact>) {
  const db = await getDb();
  if (!db) return false;

  try {
    await db
      .update(birthdayContacts)
      .set(updates)
      .where(and(
        eq(birthdayContacts.id, contactId),
        eq(birthdayContacts.userId, userId)
      ));
    return true;
  } catch (error) {
    console.error("[BirthdayContacts] Error updating contact:", error);
    return false;
  }
}

export async function deleteBirthdayContact(contactId: number, userId: number) {
  const db = await getDb();
  if (!db) return false;

  try {
    await db
      .delete(birthdayContacts)
      .where(and(
        eq(birthdayContacts.id, contactId),
        eq(birthdayContacts.userId, userId)
      ));
    return true;
  } catch (error) {
    console.error("[BirthdayContacts] Error deleting contact:", error);
    return false;
  }
}

export async function getUpcomingBirthdays(userId: number, daysAhead: number = 30) {
  const db = await getDb();
  if (!db) return [];

  const contacts = await getUserBirthdayContacts(userId);
  const today = new Date();
  const upcoming = contacts.filter((contact) => {
    const birthDate = new Date(contact.birthDate);
    const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    
    // Si l'anniversaire est déjà passé cette année, prendre l'année prochaine
    if (thisYearBirthday < today) {
      thisYearBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    const daysUntil = Math.floor((thisYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil >= 0 && daysUntil <= daysAhead;
  });

  return upcoming;
}

// ==================== Birthday Orders ====================

export async function createBirthdayOrder(orderData: {
  contactId: number;
  userId: number;
  bouquetId?: number;
  deliveryDate: Date;
  status?: "pending" | "confirmed" | "delivered" | "cancelled";
  notes?: string;
}) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(birthdayOrders).values(orderData);
    return Number(result[0].insertId);
  } catch (error) {
    console.error("[BirthdayOrders] Error creating order:", error);
    return null;
  }
}

export async function getContactBirthdayOrders(contactId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(birthdayOrders)
    .where(eq(birthdayOrders.contactId, contactId))
    .orderBy(desc(birthdayOrders.orderDate));
}
