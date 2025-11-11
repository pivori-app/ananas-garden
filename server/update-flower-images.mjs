import { drizzle } from "drizzle-orm/mysql2";
import { flowers } from "../drizzle/schema.ts";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

// Mapping des noms de fleurs vers des images Unsplash de haute qualité
const flowerImages = {
  "Rose rouge": "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
  "Rose rose": "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&q=80",
  "Rose blanche": "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80",
  "Rose jaune": "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&q=80",
  "Tulipe rouge": "https://images.unsplash.com/photo-1524386416438-98b9b2d4b433?w=800&q=80",
  "Tulipe rose": "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=800&q=80",
  "Tulipe blanche": "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&q=80",
  "Tulipe jaune": "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80",
  "Lys blanc": "https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?w=800&q=80",
  "Lys rose": "https://images.unsplash.com/photo-1597848212624-e30bd5842144?w=800&q=80",
  "Lys orange": "https://images.unsplash.com/photo-1597848212624-e30bd5842144?w=800&q=80",
  "Orchidée blanche": "https://images.unsplash.com/photo-1517281473008-b7c8b6b18f43?w=800&q=80",
  "Orchidée rose": "https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?w=800&q=80",
  "Orchidée violette": "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=800&q=80",
  "Pivoine rose": "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=800&q=80",
  "Pivoine blanche": "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=800&q=80",
  "Pivoine rouge": "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=800&q=80",
  "Tournesol": "https://images.unsplash.com/photo-1597848212624-e30bd5842144?w=800&q=80",
  "Marguerite": "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80",
  "Gerbera rose": "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80",
  "Gerbera orange": "https://images.unsplash.com/photo-1597848212624-e30bd5842144?w=800&q=80",
  "Gerbera rouge": "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
  "Œillet rouge": "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80",
  "Œillet rose": "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&q=80",
  "Œillet blanc": "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&q=80",
  "Hortensia bleu": "https://images.unsplash.com/photo-1597848212624-e30bd5842144?w=800&q=80",
  "Hortensia rose": "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=800&q=80",
  "Hortensia blanc": "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=800&q=80",
  "Iris violet": "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=800&q=80",
  "Iris bleu": "https://images.unsplash.com/photo-1597848212624-e30bd5842144?w=800&q=80",
  "Iris blanc": "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&q=80",
  "Freesia blanc": "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80",
  "Freesia jaune": "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80",
  "Freesia rose": "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&q=80",
  "Bleuet": "https://images.unsplash.com/photo-1597848212624-e30bd5842144?w=800&q=80",
  "Myosotis": "https://images.unsplash.com/photo-1597848212624-e30bd5842144?w=800&q=80",
  "Orchidée": "https://images.unsplash.com/photo-1517281473008-b7c8b6b18f43?w=800&q=80",
  "Pivoine": "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=800&q=80",
  "Gerbera": "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80",
  "Lavande": "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=800&q=80",
  "Iris": "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=800&q=80",
  "Freesia": "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80",
  "Hortensia": "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=800&q=80",
  "Dahlia": "https://images.unsplash.com/photo-1597848212624-e30bd5842144?w=800&q=80",
  "Anémone": "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80",
  "Renoncule": "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&q=80",
  "Muguet": "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&q=80",
  "Jasmin": "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&q=80",
  "Gardénia": "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&q=80",
  "Calla": "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&q=80",
  "Delphinium": "https://images.unsplash.com/photo-1597848212624-e30bd5842144?w=800&q=80",
  "Lisianthus": "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&q=80",
  "Alstroemeria": "https://images.unsplash.com/photo-1597848212624-e30bd5842144?w=800&q=80",
  "Protea": "https://images.unsplash.com/photo-1597848212624-e30bd5842144?w=800&q=80",
  "Amaryllis": "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
  "Gypsophile": "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&q=80",
};

async function updateFlowerImages() {
  try {
    console.log("🌸 Mise à jour des images des fleurs...");
    
    // Récupérer toutes les fleurs
    const allFlowers = await db.select().from(flowers);
    console.log(`📊 ${allFlowers.length} fleurs trouvées dans la base de données`);
    
    let updated = 0;
    let skipped = 0;
    
    for (const flower of allFlowers) {
      const imageUrl = flowerImages[flower.name];
      
      if (imageUrl) {
        await db.update(flowers)
          .set({ imageUrl })
          .where(eq(flowers.id, flower.id));
        
        console.log(`✅ ${flower.name} → Image mise à jour`);
        updated++;
      } else {
        console.log(`⚠️  ${flower.name} → Aucune image trouvée (ignoré)`);
        skipped++;
      }
    }
    
    console.log(`\n✨ Terminé !`);
    console.log(`   - ${updated} fleurs mises à jour`);
    console.log(`   - ${skipped} fleurs ignorées`);
    
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour des images:", error);
    process.exit(1);
  }
}

updateFlowerImages();
