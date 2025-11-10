import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  flowers: router({
    list: publicProcedure.query(async () => {
      const { getAllFlowers } = await import("./db");
      return await getAllFlowers();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const { getFlowerById } = await import("./db");
        return await getFlowerById(input.id);
      }),
  }),

  favorites: router({
    add: protectedProcedure
      .input(z.object({ bouquetId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const { addFavorite } = await import("./db");
        const favoriteId = await addFavorite(ctx.user.id, input.bouquetId);
        return { success: !!favoriteId, favoriteId };
      }),

    remove: protectedProcedure
      .input(z.object({ bouquetId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const { removeFavorite } = await import("./db");
        const success = await removeFavorite(ctx.user.id, input.bouquetId);
        return { success };
      }),

    list: protectedProcedure
      .query(async ({ ctx }) => {
        const { getUserFavorites } = await import("./db");
        return await getUserFavorites(ctx.user.id);
      }),

    check: protectedProcedure
      .input(z.object({ bouquetId: z.number() }))
      .query(async ({ input, ctx }) => {
        const { isFavorite } = await import("./db");
        const favorite = await isFavorite(ctx.user.id, input.bouquetId);
        return { isFavorite: favorite };
      }),
  }),

  bouquet: router({
    analyze: publicProcedure
      .input(z.object({ message: z.string() }))
      .mutation(async ({ input }) => {
        const { analyzeMessage } = await import("./emotionalAnalysis");
        return await analyzeMessage(input.message);
      }),
    
    analyzeBouquetImage: publicProcedure
      .input(z.object({ imageData: z.string() }))
      .mutation(async ({ input }) => {
        const { analyzeFlowerImage } = await import("./flowerImageAnalysis");
        const analysis = await analyzeFlowerImage(input.imageData);
        return analysis;
      }),
    
    generate: publicProcedure
      .input(z.object({
        message: z.string(),
        budget: z.enum(["economique", "standard", "premium"]),
        dominantColors: z.array(z.string()).optional(),
        style: z.enum(["moderne", "romantique", "champetre", "luxe"]).optional(),
        occasion: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { analyzeMessage, generateBouquetRecommendation } = await import("./emotionalAnalysis");
        const { createBouquet, addFlowerToBouquet } = await import("./db");
        
        // Analyser le message
        const analysis = await analyzeMessage(input.message);
        
        // Générer la recommandation
        const recommendation = await generateBouquetRecommendation(
          analysis,
          input.budget,
          input.dominantColors,
          input.style
        );
        
        // Créer le bouquet en base de données
        const bouquetId = await createBouquet({
          userId: ctx.user?.id,
          originalMessage: input.message,
          occasion: input.occasion || analysis.occasion || undefined,
          budget: input.budget,
          dominantColors: input.dominantColors ? JSON.stringify(input.dominantColors) : undefined,
          style: input.style,
          totalPrice: recommendation.totalPrice,
          explanation: recommendation.explanation,
        });
        
        if (!bouquetId) {
          throw new Error("Failed to create bouquet");
        }
        
        // Ajouter les fleurs au bouquet
        for (const item of recommendation.flowers) {
          await addFlowerToBouquet(bouquetId, item.flower.id, item.quantity);
        }
        
        return {
          bouquetId,
          analysis,
          recommendation,
        };
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const { getBouquetById, getBouquetFlowers } = await import("./db");
        const bouquet = await getBouquetById(input.id);
        if (!bouquet) return null;
        
        const flowers = await getBouquetFlowers(input.id);
        return { bouquet, flowers };
      }),
  }),

  cart: router({
    add: publicProcedure
      .input(z.object({
        bouquetId: z.number(),
        quantity: z.number().min(1).default(1),
        sessionId: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { addToCart } = await import("./db");
        return await addToCart({
          userId: ctx.user?.id,
          sessionId: input.sessionId,
          bouquetId: input.bouquetId,
          quantity: input.quantity,
        });
      }),
    
    list: publicProcedure
      .input(z.object({ sessionId: z.string().optional() }))
      .query(async ({ input, ctx }) => {
        const { getCartItems, getBouquetById, getBouquetFlowers } = await import("./db");
        const items = await getCartItems(ctx.user?.id, input.sessionId);
        
        // Enrichir avec les détails du bouquet
        const enrichedItems = await Promise.all(
          items.map(async (item) => {
            const bouquet = await getBouquetById(item.bouquetId);
            const flowers = await getBouquetFlowers(item.bouquetId);
            return { ...item, bouquet, flowers };
          })
        );
        
        return enrichedItems;
      }),
    
    remove: publicProcedure
      .input(z.object({ cartItemId: z.number() }))
      .mutation(async ({ input }) => {
        const { removeFromCart } = await import("./db");
        return await removeFromCart(input.cartItemId);
      }),
    
    clear: publicProcedure
      .input(z.object({ sessionId: z.string().optional() }))
      .mutation(async ({ input, ctx }) => {
        const { clearCart } = await import("./db");
        return await clearCart(ctx.user?.id, input.sessionId);
      }),
  }),
  payment: router({
    createCheckoutSession: protectedProcedure
      .input(z.object({ orderId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const Stripe = (await import("stripe")).default;
        const { ENV } = await import("./_core/env");
        const { getOrderById } = await import("./db");
        const { createBouquetProduct } = await import("./products");

        const stripe = new Stripe(ENV.stripeSecretKey, {
          apiVersion: "2025-10-29.clover",
        });

        // Récupérer la commande
        const order = await getOrderById(input.orderId);
        if (!order) {
          throw new Error("Commande introuvable");
        }

        // Créer les line items pour Stripe
        const lineItems = order.items.map((item: any) => {
          const product = createBouquetProduct({
            ...item.bouquet,
            explanation: item.bouquet.explanation || "Bouquet personnalisé",
          });
          return {
            price_data: {
              currency: product.currency,
              product_data: {
                name: product.name,
                description: product.description,
              },
              unit_amount: product.amount,
            },
            quantity: item.quantity,
          };
        });

        // Créer la session Stripe Checkout
        const origin = ctx.req.headers.origin || "http://localhost:3000";
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: lineItems,
          mode: "payment",
          success_url: `${origin}/order-confirmation/${input.orderId}?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/checkout`,
          customer_email: ctx.user.email || undefined,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            customer_email: ctx.user.email || "",
            customer_name: ctx.user.name || "",
            order_data: JSON.stringify({ orderId: input.orderId }),
          },
          allow_promotion_codes: true,
        });

        return { url: session.url };
      }),
  }),

  loyalty: router({
    getPoints: protectedProcedure.query(async ({ ctx }) => {
      const { getUserLoyaltyPoints } = await import("./db");
      return await getUserLoyaltyPoints(ctx.user.id);
    }),

    getTransactions: protectedProcedure
      .input(z.object({ limit: z.number().optional().default(20) }))
      .query(async ({ input, ctx }) => {
        const { getLoyaltyTransactions } = await import("./db");
        return await getLoyaltyTransactions(ctx.user.id, input.limit);
      }),

    spendPoints: protectedProcedure
      .input(
        z.object({
          points: z.number().min(1),
          description: z.string(),
          orderId: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { spendLoyaltyPoints } = await import("./db");
        const success = await spendLoyaltyPoints(
          ctx.user.id,
          input.points,
          input.description,
          input.orderId
        );
        if (!success) {
          throw new Error("Points insuffisants ou erreur lors de la dépense");
        }
        return { success: true };
      }),
  }),

  orders: router({
    create: publicProcedure
      .input(z.object({
        customerName: z.string(),
        customerEmail: z.string().email(),
        customerPhone: z.string().optional(),
        deliveryAddress: z.string(),
        deliveryDate: z.string().optional(),
        personalMessage: z.string().optional(),
        addVase: z.boolean().default(false),
        items: z.array(z.object({
          bouquetId: z.number(),
          quantity: z.number(),
        })),
        sessionId: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { createOrder, addOrderItem, getBouquetById, clearCart } = await import("./db");
        
        // Calculer le prix total
        let totalPrice = 0;
        const vasePrice = input.addVase ? 1500 : 0; // 15€ pour un vase
        
        for (const item of input.items) {
          const bouquet = await getBouquetById(item.bouquetId);
          if (bouquet) {
            totalPrice += bouquet.totalPrice * item.quantity;
          }
        }
        
        totalPrice += vasePrice;
        
        // Créer la commande
        const orderId = await createOrder({
          userId: ctx.user?.id,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          deliveryAddress: input.deliveryAddress,
          deliveryDate: input.deliveryDate ? new Date(input.deliveryDate) : undefined,
          personalMessage: input.personalMessage,
          addVase: input.addVase ? 1 : 0,
          vasePrice,
          totalPrice,
        });
        
        if (!orderId) {
          throw new Error("Failed to create order");
        }
        
        // Ajouter les articles
        for (const item of input.items) {
          const bouquet = await getBouquetById(item.bouquetId);
          if (bouquet) {
            await addOrderItem({
              orderId,
              bouquetId: item.bouquetId,
              quantity: item.quantity,
              unitPrice: bouquet.totalPrice,
              totalPrice: bouquet.totalPrice * item.quantity,
            });
          }
        }
        
        // Vider le panier
        await clearCart(ctx.user?.id, input.sessionId);
        
        return { orderId, totalPrice };
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const { getOrderById } = await import("./db");
        return await getOrderById(input.id);
      }),

    list: protectedProcedure
      .query(async ({ ctx }) => {
        const { getUserOrders } = await import("./db");
        return await getUserOrders(ctx.user.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
