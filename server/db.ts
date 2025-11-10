import { eq, and, desc } from "drizzle-orm";
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
  InsertBouquet,
  InsertCartItem,
  InsertOrder,
  InsertOrderItem,
  InsertFavorite
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
