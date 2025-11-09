import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, ShoppingCart, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function Cart() {
  const [, setLocation] = useLocation();
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('session_id') || '';
    }
    return '';
  });

  const { data: cartItems, isLoading, refetch } = trpc.cart.list.useQuery(
    { sessionId },
    { enabled: !!sessionId }
  );

  const removeFromCart = trpc.cart.remove.useMutation({
    onSuccess: () => {
      toast.success("Article retiré du panier");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la suppression");
    }
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12">
        <div className="container max-w-4xl">
          <Card className="p-12 text-center">
            <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="mb-4 text-2xl font-bold">Votre panier est vide</h2>
            <p className="mb-6 text-muted-foreground">
              Créez votre premier bouquet personnalisé pour commencer
            </p>
            <Button onClick={() => setLocation("/create")} size="lg">
              Créer un bouquet
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + (item.bouquet?.totalPrice || 0) * item.quantity;
  }, 0) / 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12">
      <div className="container max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continuer mes achats
        </Button>

        <h1 className="mb-8 text-4xl font-bold">Mon panier</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart items */}
          <div className="space-y-4 lg:col-span-2">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-6">
                <div className="flex gap-6">
                  {/* Bouquet preview */}
                  <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
                    <ShoppingCart className="h-8 w-8 text-primary" />
                  </div>

                  {/* Bouquet info */}
                  <div className="flex-1">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">Bouquet personnalisé</h3>
                        {item.bouquet?.occasion && (
                          <p className="text-sm text-muted-foreground">
                            {item.bouquet.occasion}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart.mutate({ cartItemId: item.id })}
                        disabled={removeFromCart.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <p className="mb-3 text-sm italic text-muted-foreground line-clamp-2">
                      "{item.bouquet?.originalMessage}"
                    </p>

                    {/* Flowers in bouquet */}
                    {item.flowers && item.flowers.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {item.flowers.map((f, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-muted px-3 py-1 text-xs"
                          >
                            {f.quantity}× {f.flower.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Quantité:</span>
                        <span className="font-semibold">{item.quantity}</span>
                      </div>
                      <p className="text-lg font-bold text-primary">
                        {((item.bouquet?.totalPrice || 0) * item.quantity / 100).toFixed(2)} €
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 p-6">
              <h2 className="mb-6 text-xl font-bold">Récapitulatif</h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Sous-total ({cartItems.length} article{cartItems.length > 1 ? 's' : ''})
                  </span>
                  <span className="font-medium">{totalPrice.toFixed(2)} €</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Livraison</span>
                  <span className="font-medium">Calculée à l'étape suivante</span>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="mb-6 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{totalPrice.toFixed(2)} €</span>
              </div>

              <Button
                size="lg"
                className="w-full h-14 text-lg"
                onClick={() => setLocation("/checkout")}
              >
                Passer la commande
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Livraison gratuite à partir de 50€
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
