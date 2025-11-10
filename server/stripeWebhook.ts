import { Request, Response } from "express";
import Stripe from "stripe";
import { ENV } from "./_core/env";

const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: "2025-10-29.clover",
});

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    console.error("[Stripe Webhook] No signature header");
    return res.status(400).send("No signature");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      ENV.stripeWebhookSecret
    );
  } catch (err: any) {
    console.error(`[Stripe Webhook] Signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`[Stripe Webhook] Received event: ${event.type} (${event.id})`);

  // ⚠️ CRITICAL: Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Stripe Webhook] Test event detected, returning verification response");
    return res.json({
      verified: true,
    });
  }

  // Handle real events
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("[Stripe Webhook] Checkout completed:", session.id);

        // Extraire les métadonnées
        const userId = session.metadata?.user_id;
        const customerEmail = session.metadata?.customer_email;
        const orderData = session.metadata?.order_data;

        if (userId && orderData) {
          // Mettre à jour la commande avec le statut "paid"
          const { updateOrderStatus, getOrderById } = await import("./db");
          const { sendOrderConfirmationEmail } = await import("./emailNotifications");
          const parsedOrderData = JSON.parse(orderData);
          await updateOrderStatus(parsedOrderData.orderId, "confirmed");
          
          console.log(`[Stripe Webhook] Order ${parsedOrderData.orderId} marked as confirmed`);

          // Envoyer l'email de confirmation
          const order = await getOrderById(parsedOrderData.orderId);
          if (order) {
            await sendOrderConfirmationEmail({
              customerName: order.customerName,
              customerEmail: order.customerEmail,
              orderId: order.id,
              totalPrice: order.totalPrice,
              items: order.items.map(item => ({
                bouquetName: item.bouquet.occasion || `Bouquet personnalisé #${item.bouquet.id}`,
                quantity: item.quantity,
                price: item.bouquet.totalPrice * item.quantity,
              })),
              deliveryAddress: order.deliveryAddress,
              deliveryDate: order.deliveryDate,
            });
            console.log(`[Stripe Webhook] Confirmation email sent for order ${order.id}`);
          }

          // Attribuer des points de fidélité (1 point par euro dépensé)
          if (order && order.userId) {
            const { addLoyaltyPoints } = await import("./db");
            const pointsToAdd = Math.floor(order.totalPrice / 100); // 1 point par euro
            await addLoyaltyPoints(
              order.userId,
              pointsToAdd,
              "earned",
              `Points gagnés pour la commande #${order.id}`,
              order.id
            );
            console.log(`[Stripe Webhook] ${pointsToAdd} loyalty points added to user ${order.userId}`);
          }
        }

        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("[Stripe Webhook] Payment succeeded:", paymentIntent.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("[Stripe Webhook] Payment failed:", paymentIntent.id);
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("[Stripe Webhook] Error processing event:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}
