import { getDb } from "./db";
import { birthdayContacts } from "../drizzle/schema";
import { and, gte, lte, sql } from "drizzle-orm";
import { notifyOwner } from "./_core/notification";

/**
 * Fonction pour vérifier et envoyer les notifications d'anniversaires
 * À appeler quotidiennement via un job CRON
 */
export async function checkAndNotifyUpcomingBirthdays() {
  const db = await getDb();
  if (!db) {
    console.warn("[Birthday Notifications] Database not available");
    return;
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Récupérer tous les contacts
    const contacts = await db.select().from(birthdayContacts);

    const notifications: Array<{
      contact: typeof birthdayContacts.$inferSelect;
      daysUntil: number;
    }> = [];

    // Calculer les jours jusqu'à chaque anniversaire
    for (const contact of contacts) {
      const birthDate = new Date(contact.birthDate);
      const thisYearBirthday = new Date(
        today.getFullYear(),
        birthDate.getMonth(),
        birthDate.getDate()
      );

      // Si l'anniversaire est déjà passé cette année, prendre l'année prochaine
      if (thisYearBirthday < today) {
        thisYearBirthday.setFullYear(today.getFullYear() + 1);
      }

      const daysUntil = Math.floor(
        (thisYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Notifier à 7 jours, 3 jours et 1 jour avant
      if (daysUntil === 7 || daysUntil === 3 || daysUntil === 1) {
        notifications.push({ contact, daysUntil });
      }
    }

    // Envoyer les notifications groupées
    if (notifications.length > 0) {
      const notificationText = notifications
        .map(({ contact, daysUntil }) => {
          const emoji = daysUntil === 1 ? "🎂" : daysUntil === 3 ? "🎁" : "📅";
          return `${emoji} ${contact.firstName} ${contact.lastName} - dans ${daysUntil} jour${daysUntil > 1 ? "s" : ""}`;
        })
        .join("\n");

      const title =
        notifications.length === 1
          ? "Rappel d'anniversaire"
          : `${notifications.length} anniversaires à venir`;

      const content = `${notificationText}\n\nN'oubliez pas de commander un bouquet ! 💐`;

      await notifyOwner({ title, content });

      console.log(
        `[Birthday Notifications] Sent ${notifications.length} notification(s)`
      );
    } else {
      console.log("[Birthday Notifications] No upcoming birthdays to notify");
    }
  } catch (error) {
    console.error("[Birthday Notifications] Error:", error);
  }
}

/**
 * Fonction pour obtenir les anniversaires à venir dans les X prochains jours
 * (utilisée par le frontend pour afficher les alertes)
 */
export async function getUpcomingBirthdays(userId: number, daysAhead: number = 30) {
  const db = await getDb();
  if (!db) {
    console.warn("[Birthday Notifications] Database not available");
    return [];
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Récupérer tous les contacts de l'utilisateur
    const contacts = await db
      .select()
      .from(birthdayContacts)
      .where(sql`${birthdayContacts.userId} = ${userId}`);

    const upcoming = contacts
      .map((contact) => {
        const birthDate = new Date(contact.birthDate);
        const thisYearBirthday = new Date(
          today.getFullYear(),
          birthDate.getMonth(),
          birthDate.getDate()
        );

        // Si l'anniversaire est déjà passé cette année, prendre l'année prochaine
        if (thisYearBirthday < today) {
          thisYearBirthday.setFullYear(today.getFullYear() + 1);
        }

        const daysUntil = Math.floor(
          (thisYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        return { ...contact, daysUntil };
      })
      .filter((contact) => contact.daysUntil <= daysAhead)
      .sort((a, b) => a.daysUntil - b.daysUntil);

    return upcoming;
  } catch (error) {
    console.error("[Birthday Notifications] Error getting upcoming birthdays:", error);
    return [];
  }
}
