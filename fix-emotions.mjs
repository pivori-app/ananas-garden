import { drizzle } from "drizzle-orm/mysql2";
import { flowers } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

async function cleanEmotionsAndColors() {
  console.log("🔧 Nettoyage des émotions et couleurs...");

  // Récupérer toutes les fleurs
  const allFlowers = await db.select().from(flowers);

  console.log(`📊 ${allFlowers.length} fleurs à traiter`);

  for (const flower of allFlowers) {
    let needsUpdate = false;
    const updates = {};

    // Nettoyer les émotions
    if (flower.emotions) {
      let cleanEmotions = flower.emotions;
      
      // Retirer les crochets et guillemets
      cleanEmotions = cleanEmotions
        .replace(/^\[|\]$/g, '') // Retirer [ et ] au début/fin
        .replace(/"/g, '') // Retirer tous les guillemets
        .replace(/'/g, '') // Retirer tous les apostrophes simples
        .split(',')
        .map(e => e.trim())
        .join(', ');

      if (cleanEmotions !== flower.emotions) {
        updates.emotions = cleanEmotions;
        needsUpdate = true;
        console.log(`  ✓ ${flower.name}: "${flower.emotions}" → "${cleanEmotions}"`);
      }
    }

    // Nettoyer les couleurs
    if (flower.color) {
      let cleanColors = flower.color;
      
      // Retirer les crochets et guillemets
      cleanColors = cleanColors
        .replace(/^\[|\]$/g, '')
        .replace(/"/g, '')
        .replace(/'/g, '')
        .split(',')
        .map(c => c.trim())
        .join(', ');

      if (cleanColors !== flower.color) {
        updates.color = cleanColors;
        needsUpdate = true;
      }
    }

    // Mettre à jour si nécessaire
    if (needsUpdate) {
      await db.update(flowers)
        .set(updates)
        .where(eq(flowers.id, flower.id));
    }
  }

  console.log("✅ Nettoyage terminé !");
}

// Import eq depuis drizzle-orm
import { eq } from "drizzle-orm";

cleanEmotionsAndColors()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur:", error);
    process.exit(1);
  });
