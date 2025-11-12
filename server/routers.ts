import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getRecommendationsForUser, getPopularBouquets, getRecommendationsByOccasion, getRecommendationsByBudget } from "./recommendations";
import { createSubscription, cancelSubscription, pauseSubscription, resumeSubscription, getUserSubscriptions } from "./subscriptionManager";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount,
} from "./notificationManager";

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

  testimonials: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().optional().default(20) }))
      .query(async ({ input }) => {
        const { getVisibleTestimonials } = await import("./db");
        return await getVisibleTestimonials(input.limit);
      }),

    create: protectedProcedure
      .input(
        z.object({
          rating: z.number().min(1).max(5),
          comment: z.string(),
          bouquetName: z.string().optional(),
          imageUrl: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { createTestimonial } = await import("./db");
        const testimonialId = await createTestimonial({
          userId: ctx.user.id,
          customerName: ctx.user.name || "Client anonyme",
          ...input,
        });
        return { testimonialId };
      }),

    myTestimonials: protectedProcedure.query(async ({ ctx }) => {
      const { getUserTestimonials } = await import("./db");
      return await getUserTestimonials(ctx.user.id);
    }),
  }),

  subscriptions: router({
    create: protectedProcedure
      .input(
        z.object({
          plan: z.enum(["economique", "standard", "premium"]),
          deliveryDay: z.number().min(1).max(28),
          deliveryAddress: z.string(),
          preferences: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user.email) {
          throw new Error("Email requis pour créer un abonnement");
        }
        return await createSubscription({
          userId: ctx.user.id,
          userEmail: ctx.user.email,
          ...input,
        });
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserSubscriptions(ctx.user.id);
    }),

    cancel: protectedProcedure
      .input(z.object({ subscriptionId: z.number() }))
      .mutation(async ({ input }) => {
        return await cancelSubscription(input.subscriptionId);
      }),

    pause: protectedProcedure
      .input(z.object({ subscriptionId: z.number() }))
      .mutation(async ({ input }) => {
        return await pauseSubscription(input.subscriptionId);
      }),

    resume: protectedProcedure
      .input(z.object({ subscriptionId: z.number() }))
      .mutation(async ({ input }) => {
        return await resumeSubscription(input.subscriptionId);
      }),
  }),

  recommendations: router({
    forUser: protectedProcedure.query(async ({ ctx }) => {
      return await getRecommendationsForUser(ctx.user.id);
    }),
    popular: publicProcedure.query(async () => {
      return await getPopularBouquets(6);
    }),
    byOccasion: publicProcedure
      .input(z.object({ occasion: z.string(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await getRecommendationsByOccasion(input.occasion, input.limit);
      }),
    byBudget: publicProcedure
      .input(z.object({ minPrice: z.number(), maxPrice: z.number(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await getRecommendationsByBudget(input.minPrice, input.maxPrice, input.limit);
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

  notifications: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserNotifications(ctx.user.id);
    }),
    unreadCount: protectedProcedure.query(async ({ ctx }) => {
      return await getUnreadCount(ctx.user.id);
    }),
    markAsRead: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await markNotificationAsRead(input.notificationId, ctx.user.id);
        return { success: true };
      }),
    markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
      await markAllNotificationsAsRead(ctx.user.id);
      return { success: true };
    }),
  }),

  blog: router({
    list: publicProcedure.query(async () => {
      const { getAllBlogPosts } = await import("./db");
      return await getAllBlogPosts();
    }),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const { getBlogPostBySlug } = await import("./db");
        return await getBlogPostBySlug(input.slug);
      }),
    getByCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        const { getBlogPostsByCategory } = await import("./db");
        return await getBlogPostsByCategory(input.category);
      }),
    getRecent: publicProcedure
      .input(z.object({ limit: z.number().default(3) }).optional())
      .query(async ({ input }) => {
        const { getRecentBlogPosts } = await import("./db");
        return await getRecentBlogPosts(input?.limit || 3);
      }),
  }),

  referral: router({
    getMyCode: protectedProcedure.query(async ({ ctx }) => {
      const { getUserReferralCode, createReferralCode } = await import("./db");
      
      // Check if user already has a referral code
      let referral = await getUserReferralCode(ctx.user.id);
      
      // If not, create one
      if (!referral) {
        const code = `ANANAS${ctx.user.id}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        await createReferralCode(ctx.user.id, code);
        referral = await getUserReferralCode(ctx.user.id);
      }
      
      return referral;
    }),
    getMyReferrals: protectedProcedure.query(async ({ ctx }) => {
      const { getUserReferrals } = await import("./db");
      return await getUserReferrals(ctx.user.id);
    }),
    getStats: protectedProcedure.query(async ({ ctx }) => {
      const { getReferralStats } = await import("./db");
      return await getReferralStats(ctx.user.id);
    }),
    trackReferral: publicProcedure
      .input(z.object({ referralCode: z.string(), referredUserId: z.number() }))
      .mutation(async ({ input }) => {
        const { trackReferral } = await import("./db");
        const success = await trackReferral(input.referralCode, input.referredUserId);
        return { success };
      }),
  }),

  // Routes PayPal pour les paiements
  paypal: router({
    createOrder: protectedProcedure
      .input(z.object({
        orderId: z.number(),
        amount: z.string(),
        currency: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { createPayPalOrder } = await import("./paypal");
        const paypalOrder = await createPayPalOrder({
          orderId: input.orderId,
          amount: input.amount,
          currency: input.currency || "EUR",
        });
        
        // Mettre à jour la commande avec l'ID PayPal
        const { updateOrderPayPalId } = await import("./db");
        await updateOrderPayPalId(input.orderId, paypalOrder.id);
        
        return paypalOrder;
      }),
    captureOrder: protectedProcedure
      .input(z.object({
        paypalOrderId: z.string(),
        orderId: z.number(),
      }))
      .mutation(async ({ input }) => {
        const { capturePayPalOrder } = await import("./paypal");
        const captureResult = await capturePayPalOrder(input.paypalOrderId);
        
        // Mettre à jour le statut de paiement de la commande
        const { updateOrderPaymentStatus } = await import("./db");
        await updateOrderPaymentStatus(
          input.orderId,
          captureResult.status === "COMPLETED" ? "completed" : "failed",
          captureResult.payerId,
          captureResult.payerEmail
        );
        
        return captureResult;
      }),
    getOrderDetails: protectedProcedure
      .input(z.object({ paypalOrderId: z.string() }))
      .query(async ({ input }) => {
        const { getPayPalOrderDetails } = await import("./paypal");
        return await getPayPalOrderDetails(input.paypalOrderId);
      }),
  }),

  gallery: router({
    list: publicProcedure.query(async () => {
      const { getAllGalleryItems } = await import("./db");
      return await getAllGalleryItems();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const { getGalleryItemById } = await import("./db");
        return await getGalleryItemById(input.id);
      }),
  }),

  wishlist: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getUserWishlist } = await import("./db");
      return await getUserWishlist(ctx.user.id);
    }),
    add: protectedProcedure
      .input(z.object({ 
        bouquetId: z.number(),
        notes: z.string().optional(),
        notifyOnPromotion: z.number().default(1)
      }))
      .mutation(async ({ input, ctx }) => {
        const { addToWishlist } = await import("./db");
        const wishlistId = await addToWishlist({
          userId: ctx.user.id,
          bouquetId: input.bouquetId,
          notes: input.notes || null,
          notifyOnPromotion: input.notifyOnPromotion,
        });
        return { success: !!wishlistId, wishlistId };
      }),
    remove: protectedProcedure
      .input(z.object({ bouquetId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const { removeFromWishlist } = await import("./db");
        const success = await removeFromWishlist(ctx.user.id, input.bouquetId);
        return { success };
      }),
    check: protectedProcedure
      .input(z.object({ bouquetId: z.number() }))
      .query(async ({ input, ctx }) => {
        const { isInWishlist } = await import("./db");
        const inWishlist = await isInWishlist(ctx.user.id, input.bouquetId);
        return { inWishlist };
      }),
    updateNotes: protectedProcedure
      .input(z.object({ 
        bouquetId: z.number(),
        notes: z.string()
      }))
      .mutation(async ({ input, ctx }) => {
        const { updateWishlistNotes } = await import("./db");
        const success = await updateWishlistNotes(ctx.user.id, input.bouquetId, input.notes);
        return { success };
      }),
  }),

  bouquetRatings: router({
    add: protectedProcedure
      .input(z.object({ 
        bouquetId: z.number(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional()
      }))
      .mutation(async ({ input, ctx }) => {
        const { addBouquetRating, hasUserPurchasedBouquet } = await import("./db");
        
        // Vérifier si l'utilisateur a acheté ce bouquet
        const hasPurchased = await hasUserPurchasedBouquet(ctx.user.id, input.bouquetId);
        
        const ratingId = await addBouquetRating({
          userId: ctx.user.id,
          bouquetId: input.bouquetId,
          rating: input.rating,
          comment: input.comment || null,
          isVerified: hasPurchased ? 1 : 0,
        });
        return { success: !!ratingId, ratingId, isVerified: hasPurchased };
      }),
    list: publicProcedure
      .input(z.object({ bouquetId: z.number() }))
      .query(async ({ input }) => {
        const { getBouquetRatings } = await import("./db");
        return await getBouquetRatings(input.bouquetId);
      }),
    getAverage: publicProcedure
      .input(z.object({ bouquetId: z.number() }))
      .query(async ({ input }) => {
        const { getAverageRating } = await import("./db");
        return await getAverageRating(input.bouquetId);
      }),
    getUserRating: protectedProcedure
      .input(z.object({ bouquetId: z.number() }))
      .query(async ({ input, ctx }) => {
        const { getUserRating } = await import("./db");
        return await getUserRating(ctx.user.id, input.bouquetId);
      }),
  }),

  flowerScanner: router({
    identify: publicProcedure
      .input(z.object({ imageBase64: z.string() }))
      .mutation(async ({ input }) => {
        const { identifyFlower } = await import("./_core/flowerRecognition");
        const result = await identifyFlower(input.imageBase64);
        return result;
      }),
    search: publicProcedure
      .input(z.object({ flowerName: z.string() }))
      .query(async ({ input }) => {
        const { matchFlowerInCatalog } = await import("./_core/flowerRecognition");
        const { getAllFlowers } = await import("./db");
        
        const catalogFlowers = await getAllFlowers();
        const match = matchFlowerInCatalog(input.flowerName, catalogFlowers);
        
        return match;
      }),
    findSimilar: publicProcedure
      .input(z.object({ 
        color: z.string(),
        emotions: z.array(z.string()).optional()
      }))
      .query(async ({ input }) => {
        const { findSimilarFlowers } = await import("./_core/flowerRecognition");
        const { getAllFlowers } = await import("./db");
        
        const catalogFlowers = await getAllFlowers();
        const similar = findSimilarFlowers(input.color, input.emotions, catalogFlowers);
        
        return similar;
      }),
  }),
  scanHistory: router({
    save: protectedProcedure
      .input(z.object({
        imageUrl: z.string(),
        scanType: z.enum(["flower", "bouquet"]),
        result: z.any(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { saveScanToHistory } = await import("./db");
        const scanId = await saveScanToHistory(ctx.user.id, input);
        return { success: !!scanId, scanId };
      }),
    list: protectedProcedure
      .input(z.object({ limit: z.number().optional().default(50) }))
      .query(async ({ input, ctx }) => {
        const { getUserScanHistory } = await import("./db");
        return await getUserScanHistory(ctx.user.id, input.limit);
      }),
    delete: protectedProcedure
      .input(z.object({ scanId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const { deleteScanFromHistory } = await import("./db");
        const success = await deleteScanFromHistory(input.scanId, ctx.user.id);
        return { success };
      }),
  }),
  birthdays: router({
    create: protectedProcedure
      .input(z.object({
        firstName: z.string(),
        lastName: z.string(),
        birthDate: z.date(),
        address: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        preferences: z.string().optional(),
        googleCalendarEventId: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { createBirthdayContact } = await import("./db");
        const contactId = await createBirthdayContact(ctx.user.id, input);
        return { success: !!contactId, contactId };
      }),
    list: protectedProcedure
      .query(async ({ ctx }) => {
        const { getUserBirthdayContacts } = await import("./db");
        return await getUserBirthdayContacts(ctx.user.id);
      }),
    upcoming: protectedProcedure
      .input(z.object({ daysAhead: z.number().optional().default(30) }))
      .query(async ({ input, ctx }) => {
        const { getUpcomingBirthdays } = await import("./db");
        return await getUpcomingBirthdays(ctx.user.id, input.daysAhead);
      }),
    update: protectedProcedure
      .input(z.object({
        contactId: z.number(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        birthDate: z.date().optional(),
        address: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        preferences: z.string().optional(),
        googleCalendarEventId: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { contactId, ...updates } = input;
        const { updateBirthdayContact } = await import("./db");
        const success = await updateBirthdayContact(contactId, ctx.user.id, updates);
        return { success };
      }),
    delete: protectedProcedure
      .input(z.object({ contactId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const { deleteBirthdayContact } = await import("./db");
        const success = await deleteBirthdayContact(input.contactId, ctx.user.id);
        return { success };
      }),
    orders: router({
      create: protectedProcedure
        .input(z.object({
          contactId: z.number(),
          bouquetId: z.number().optional(),
          deliveryDate: z.date(),
          status: z.enum(["pending", "confirmed", "delivered", "cancelled"]).optional(),
          notes: z.string().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
          const { createBirthdayOrder } = await import("./db");
          const orderId = await createBirthdayOrder({ userId: ctx.user.id, ...input });
          return { success: !!orderId, orderId };
        }),
      list: protectedProcedure
        .input(z.object({ contactId: z.number() }))
        .query(async ({ input }) => {
          const { getContactBirthdayOrders } = await import("./db");
          return await getContactBirthdayOrders(input.contactId);
        }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
