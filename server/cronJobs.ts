import cron from "node-cron";
import { checkAndNotifyUpcomingBirthdays } from "./birthdayNotifications";

/**
 * Initialiser tous les jobs CRON de l'application
 */
export function initializeCronJobs() {
  // Job quotidien à 9h00 pour vérifier les anniversaires à venir
  // Format: seconde minute heure jour mois jour_semaine
  cron.schedule("0 0 9 * * *", async () => {
    console.log("[CRON] Running daily birthday check at 9:00 AM");
    try {
      await checkAndNotifyUpcomingBirthdays();
    } catch (error) {
      console.error("[CRON] Error in birthday check:", error);
    }
  });

  console.log("[CRON] Birthday notification job scheduled (daily at 9:00 AM)");
}
