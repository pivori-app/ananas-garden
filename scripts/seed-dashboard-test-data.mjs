import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import {
  users,
  bouquets,
  orders,
  orderItems,
  favorites,
  loyaltyPoints,
  loyaltyTransactions,
  subscriptions,
  testimonials,
  flowers,
} from "../drizzle/schema.ts";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

async function seedTestData() {
  console.log("🌱 Seeding test data for Dashboard...");

  try {
    // 1. Récupérer l'utilisateur actuel (owner)
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.openId, process.env.OWNER_OPEN_ID))
      .limit(1);

    if (!user) {
      console.error("❌ User not found");
      return;
    }

    console.log(`✅ Found user: ${user.name} (ID: ${user.id})`);

    // 2. Créer des fleurs de test si elles n'existent pas
    const existingFlowers = await db.select().from(flowers).limit(1);
    
    if (existingFlowers.length === 0) {
      console.log("📦 Creating test flowers...");
      await db.insert(flowers).values([
        {
          name: "Rose Rouge",
          scientificName: "Rosa",
          meaning: "Amour passionné",
          emotionalTags: JSON.stringify(["amour", "passion", "romance"]),
          color: "rouge",
          seasonality: "toute l'année",
          careInstructions: "Couper les tiges en biseau",
          imageUrl: "/images/flowers/rose-rouge.jpg",
          price: 3.5,
          available: true,
        },
        {
          name: "Tulipe Jaune",
          scientificName: "Tulipa",
          meaning: "Joie et bonheur",
          emotionalTags: JSON.stringify(["joie", "bonheur", "amitié"]),
          color: "jaune",
          seasonality: "printemps",
          careInstructions: "Changer l'eau tous les 2 jours",
          imageUrl: "/images/flowers/tulipe-jaune.jpg",
          price: 2.5,
          available: true,
        },
      ]);
      console.log("✅ Test flowers created");
    }

    // 3. Créer un bouquet de test
    console.log("📦 Creating test bouquet...");
    const [bouquet] = await db
      .insert(bouquets)
      .values({
        userId: user.id,
        originalMessage: "Je t'aime pour toujours, joyeux anniversaire mon amour !",
        occasion: "anniversaire",
        budget: "standard",
        dominantColors: JSON.stringify(["rouge", "rose"]),
        style: "romantique",
        totalPrice: 4599, // Prix en centimes (45.99€)
        explanation: "Un bouquet romantique composé de roses rouges symbolisant l'amour passionné et éternel",
        imageUrl: "/images/bouquets/test-bouquet.jpg",
      })
      .$returningId();

    console.log(`✅ Test bouquet created (ID: ${bouquet.id})`);

    // 4. Créer une commande de test
    console.log("📦 Creating test order...");
    const [order] = await db
      .insert(orders)
      .values({
        userId: user.id,
        customerName: user.name || "Pivori",
        customerEmail: user.email || "pivori@example.com",
        customerPhone: "+33 6 12 34 56 78",
        deliveryAddress: "123 Rue des Fleurs, 75001 Paris, France",
        deliveryDate: new Date("2025-11-10"),
        personalMessage: "Joyeux anniversaire mon amour !",
        addVase: 1,
        vasePrice: 500, // 5€ en centimes
        totalPrice: 5099, // 50.99€ en centimes (45.99 + 5)
        status: "delivered",
        paymentMethod: "card",
        paymentStatus: "completed",
      })
      .$returningId();

    await db.insert(orderItems).values({
      orderId: order.id,
      bouquetId: bouquet.id,
      quantity: 1,
      unitPrice: 4599, // 45.99€ en centimes
      totalPrice: 4599, // 45.99€ en centimes
    });

    console.log(`✅ Test order created (ID: ${order.id})`);

    // 5. Ajouter le bouquet aux favoris
    console.log("📦 Adding bouquet to favorites...");
    await db.insert(favorites).values({
      userId: user.id,
      bouquetId: bouquet.id,
    });
    console.log("✅ Favorite added");

    // 6. Créer des points de fidélité
    console.log("📦 Creating loyalty points...");
    await db.insert(loyaltyPoints).values({
      userId: user.id,
      points: 250,
    });

    await db.insert(loyaltyTransactions).values([
      {
        userId: user.id,
        points: 100,
        type: "earned",
        description: "Points gagnés pour la commande #" + order.id,
        relatedOrderId: order.id,
      },
      {
        userId: user.id,
        points: 150,
        type: "earned",
        description: "Bonus de bienvenue",
      },
    ]);

    console.log("✅ Loyalty points created (250 points)");

    // 7. Créer un abonnement de test
    console.log("📦 Creating test subscription...");
    await db.insert(subscriptions).values({
      userId: user.id,
      stripeSubscriptionId: "sub_test_123456",
      plan: "standard",
      status: "active",
      price: 2999, // 29.99€ en centimes
      deliveryDay: 15,
      deliveryAddress: "123 Rue des Fleurs, 75001 Paris, France",
      preferences: "Roses et tulipes uniquement",
    });

    console.log("✅ Test subscription created");

    // 8. Créer un avis de test
    console.log("📦 Creating test testimonial...");
    await db.insert(testimonials).values({
      userId: user.id,
      bouquetId: bouquet.id,
      rating: 5,
      comment:
        "Absolument magnifique ! Les fleurs étaient fraîches et le bouquet correspondait parfaitement à mes émotions. Service impeccable !",
      isVisible: true,
    });

    console.log("✅ Test testimonial created");

    console.log("\n🎉 All test data created successfully!");
    console.log("\n📊 Summary:");
    console.log("  - 1 bouquet");
    console.log("  - 1 order (delivered)");
    console.log("  - 1 favorite");
    console.log("  - 250 loyalty points");
    console.log("  - 1 active subscription");
    console.log("  - 1 testimonial (5 stars)");
    console.log("\n✨ You can now check the Dashboard to see all tabs populated!");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  }

  process.exit(0);
}

seedTestData();
