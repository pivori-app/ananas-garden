import { getDb } from "./db";
import { notifications, InsertNotification } from "../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

/**
 * Créer une notification pour un utilisateur
 */
export async function createNotification(notification: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(notifications).values(notification);
  return result;
}

/**
 * Récupérer toutes les notifications d'un utilisateur
 */
export async function getUserNotifications(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

/**
 * Marquer une notification comme lue
 */
export async function markNotificationAsRead(notificationId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(notifications)
    .set({ read: 1 })
    .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)));
}

/**
 * Marquer toutes les notifications comme lues
 */
export async function markAllNotificationsAsRead(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(notifications)
    .set({ read: 1 })
    .where(eq(notifications.userId, userId));
}

/**
 * Compter les notifications non lues
 */
export async function getUnreadCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select()
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.read, 0)));

  return result.length;
}

/**
 * Notification de livraison imminente (3 jours avant)
 */
export async function notifyUpcomingDelivery(userId: number, orderId: number, deliveryDate: Date) {
  return createNotification({
    userId,
    type: "delivery",
    title: "Livraison imminente",
    message: `Votre bouquet sera livré le ${deliveryDate.toLocaleDateString("fr-FR")}`,
    actionUrl: `/order-confirmation/${orderId}`,
  });
}

/**
 * Notification de promotion personnalisée
 */
export async function notifyPromotion(userId: number, title: string, message: string, actionUrl?: string) {
  return createNotification({
    userId,
    type: "promotion",
    title,
    message,
    actionUrl,
  });
}

/**
 * Notification de rappel d'anniversaire
 */
export async function notifyAnniversaryReminder(userId: number, recipientName: string, date: Date) {
  return createNotification({
    userId,
    type: "anniversary",
    title: "Rappel d'anniversaire",
    message: `L'anniversaire de ${recipientName} approche le ${date.toLocaleDateString("fr-FR")}. Pensez à offrir un bouquet !`,
    actionUrl: "/create",
  });
}

/**
 * Notification de parrainage réussi
 */
export async function notifyReferralSuccess(userId: number, points: number) {
  return createNotification({
    userId,
    type: "referral",
    title: "Parrainage réussi !",
    message: `Félicitations ! Vous avez gagné ${points} points grâce à votre parrainage.`,
    actionUrl: "/loyalty-points",
  });
}
