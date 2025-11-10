import Stripe from "stripe";
import { ENV } from "./_core/env";
import { getDb } from "./db";
import { subscriptions } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: "2025-10-29.clover",
});

/**
 * Plans d'abonnement disponibles
 */
export const SUBSCRIPTION_PLANS = {
  economique: {
    name: "Bouquet Économique",
    price: 2990, // 29.90€
    description: "Un bouquet simple et élégant chaque mois",
  },
  standard: {
    name: "Bouquet Standard",
    price: 4990, // 49.90€
    description: "Un bouquet généreux avec fleurs de saison",
  },
  premium: {
    name: "Bouquet Premium",
    price: 7990, // 79.90€
    description: "Un bouquet luxueux avec fleurs rares et exotiques",
  },
};

/**
 * Créer un abonnement Stripe
 */
export async function createSubscription(params: {
  userId: number;
  userEmail: string;
  plan: "economique" | "standard" | "premium";
  deliveryDay: number;
  deliveryAddress: string;
  preferences?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  const planDetails = SUBSCRIPTION_PLANS[params.plan];

  // Créer ou récupérer le customer Stripe
  const customers = await stripe.customers.list({
    email: params.userEmail,
    limit: 1,
  });

  let customer: Stripe.Customer;
  if (customers.data.length > 0) {
    customer = customers.data[0];
  } else {
    customer = await stripe.customers.create({
      email: params.userEmail,
      metadata: {
        userId: params.userId.toString(),
      },
    });
  }

  // Créer le produit et le prix dans Stripe
  const product = await stripe.products.create({
    name: planDetails.name,
    description: planDetails.description,
    metadata: {
      plan: params.plan,
    },
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: planDetails.price,
    currency: "eur",
    recurring: {
      interval: "month",
    },
  });

  // Créer l'abonnement Stripe
  const stripeSubscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: price.id }],
    metadata: {
      userId: params.userId.toString(),
      deliveryDay: params.deliveryDay.toString(),
      deliveryAddress: params.deliveryAddress,
      preferences: params.preferences || "",
    },
  });

  // Enregistrer l'abonnement dans la base de données
  const result = await db.insert(subscriptions).values({
    userId: params.userId,
    stripeSubscriptionId: stripeSubscription.id,
    stripeCustomerId: customer.id,
    plan: params.plan,
    status: "active",
    price: planDetails.price,
    deliveryDay: params.deliveryDay,
    deliveryAddress: params.deliveryAddress,
    preferences: params.preferences,
    currentPeriodStart: (stripeSubscription as any).current_period_start ? new Date((stripeSubscription as any).current_period_start * 1000) : undefined,
    currentPeriodEnd: (stripeSubscription as any).current_period_end ? new Date((stripeSubscription as any).current_period_end * 1000) : undefined,
  });

  return {
    subscriptionId: Number(result[0].insertId),
    stripeSubscriptionId: stripeSubscription.id,
  };
}

/**
 * Annuler un abonnement
 */
export async function cancelSubscription(subscriptionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.id, subscriptionId))
    .limit(1);

  if (!subscription || !subscription.stripeSubscriptionId) {
    throw new Error("Subscription not found");
  }

  // Annuler dans Stripe (à la fin de la période)
  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });

  // Mettre à jour le statut
  await db
    .update(subscriptions)
    .set({
      status: "cancelled",
      cancelledAt: new Date(),
    })
    .where(eq(subscriptions.id, subscriptionId));

  return true;
}

/**
 * Mettre en pause un abonnement
 */
export async function pauseSubscription(subscriptionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.id, subscriptionId))
    .limit(1);

  if (!subscription || !subscription.stripeSubscriptionId) {
    throw new Error("Subscription not found");
  }

  // Mettre en pause dans Stripe
  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    pause_collection: {
      behavior: "void",
    },
  });

  // Mettre à jour le statut
  await db
    .update(subscriptions)
    .set({ status: "paused" })
    .where(eq(subscriptions.id, subscriptionId));

  return true;
}

/**
 * Reprendre un abonnement en pause
 */
export async function resumeSubscription(subscriptionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.id, subscriptionId))
    .limit(1);

  if (!subscription || !subscription.stripeSubscriptionId) {
    throw new Error("Subscription not found");
  }

  // Reprendre dans Stripe
  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    pause_collection: null as any,
  });

  // Mettre à jour le statut
  await db
    .update(subscriptions)
    .set({ status: "active" })
    .where(eq(subscriptions.id, subscriptionId));

  return true;
}

/**
 * Récupérer les abonnements d'un utilisateur
 */
export async function getUserSubscriptions(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId));
}
