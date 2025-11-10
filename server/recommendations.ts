import { eq, and, desc, sql, or } from "drizzle-orm";
import { getDb } from "./db";
import { bouquets, favorites, orders, orderItems } from "../drizzle/schema";

/**
 * Système de recommandations personnalisées basé sur:
 * - L'historique des commandes
 * - Les bouquets favoris
 * - Les occasions précédentes
 */

export async function getRecommendationsForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];

  // 1. Récupérer les favoris de l'utilisateur
  const userFavorites = await db
    .select({ bouquetId: favorites.bouquetId })
    .from(favorites)
    .where(eq(favorites.userId, userId));

  const favoriteBouquetIds = userFavorites.map(f => f.bouquetId);

  // 2. Récupérer l'historique des commandes
  const userOrders = await db
    .select({ bouquetId: orderItems.bouquetId })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(eq(orders.userId, userId));

  const orderedBouquetIds = userOrders.map(o => o.bouquetId).filter(Boolean) as number[];

  // 3. Combiner favoris et commandes
  const userBouquetIds = Array.from(new Set([...favoriteBouquetIds, ...orderedBouquetIds]));

  if (userBouquetIds.length === 0) {
    // Pas d'historique : retourner les bouquets les plus récents
    return db
      .select()
      .from(bouquets)
      .orderBy(desc(bouquets.createdAt))
      .limit(6);
  }

  // 4. Récupérer les détails des bouquets de l'utilisateur
  const userBouquets = await db
    .select()
    .from(bouquets)
    .where(sql`${bouquets.id} IN (${userBouquetIds.join(',')})`);

  // 5. Extraire les occasions préférées
  const preferredOccasions = Array.from(new Set(userBouquets.map(b => b.occasion).filter(Boolean)));
  // Extraire les émotions du message original
  const preferredMessages = userBouquets
    .map(b => b.originalMessage)
    .filter(Boolean)
    .join(' ');

  // 6. Trouver des bouquets similaires
  const recommendations = await db
    .select()
    .from(bouquets)
    .where(
      and(
        // Exclure les bouquets déjà vus
        sql`${bouquets.id} NOT IN (${userBouquetIds.join(',')})`,
        // Filtrer par occasions ou émotions similaires
        preferredOccasions.length > 0
          ? sql`${bouquets.occasion} IN (${preferredOccasions.map(o => `'${o}'`).join(',')})`
          : sql`1=1`
      )
    )
    .orderBy(desc(bouquets.createdAt))
    .limit(6);

  return recommendations;
}

/**
 * Recommandations basées sur une occasion spécifique
 */
export async function getRecommendationsByOccasion(occasion: string, limit: number = 6) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(bouquets)
    .where(eq(bouquets.occasion, occasion))
    .orderBy(desc(bouquets.createdAt))
    .limit(limit);
}

/**
 * Recommandations basées sur un budget
 */
export async function getRecommendationsByBudget(
  minPrice: number,
  maxPrice: number,
  limit: number = 6
) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(bouquets)
    .where(
      and(
        sql`${bouquets.totalPrice} >= ${minPrice}`,
        sql`${bouquets.totalPrice} <= ${maxPrice}`
      )
    )
    .orderBy(desc(bouquets.createdAt))
    .limit(limit);
}

/**
 * Bouquets populaires (les plus commandés)
 */
export async function getPopularBouquets(limit: number = 6) {
  const db = await getDb();
  if (!db) return [];

  // Compter les commandes par bouquet
  const popularBouquetIds = await db
    .select({
      bouquetId: orderItems.bouquetId,
      count: sql<number>`COUNT(*)`.as('count'),
    })
    .from(orderItems)
    .groupBy(orderItems.bouquetId)
    .orderBy(desc(sql`count`))
    .limit(limit);

  if (popularBouquetIds.length === 0) {
    // Pas de commandes : retourner les plus récents
    return db
      .select()
      .from(bouquets)
      .orderBy(desc(bouquets.createdAt))
      .limit(limit);
  }

  const bouquetIds = popularBouquetIds.map(p => p.bouquetId).filter(Boolean) as number[];

  return db
    .select()
    .from(bouquets)
    .where(sql`${bouquets.id} IN (${bouquetIds.join(',')})`);
}
