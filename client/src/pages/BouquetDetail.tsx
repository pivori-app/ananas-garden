import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShoppingCart, ArrowLeft, Sparkles, Heart } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import BouquetVisualizer from "@/components/BouquetVisualizer";
import { toast } from "sonner";

export default function BouquetDetail() {
  const [, params] = useRoute("/bouquet/:id");
  const [, setLocation] = useLocation();
  const bouquetId = params?.id ? parseInt(params.id) : 0;
  const { isAuthenticated } = useAuth();
  
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      let sid = localStorage.getItem('session_id');
      if (!sid) {
        sid = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('session_id', sid);
      }
      return sid;
    }
    return '';
  });

  const { data, isLoading, error } = trpc.bouquet.getById.useQuery(
    { id: bouquetId },
    { enabled: bouquetId > 0 }
  );

  const { data: favoriteCheck } = trpc.favorites.check.useQuery(
    { bouquetId },
    { enabled: isAuthenticated && bouquetId > 0 }
  );
  const isFavorite = favoriteCheck?.isFavorite || false;

  const addFavoriteMutation = trpc.favorites.add.useMutation({
    onSuccess: () => {
      toast.success("Ajouté aux favoris !");
      window.location.reload();
    },
  });

  const removeFavoriteMutation = trpc.favorites.remove.useMutation({
    onSuccess: () => {
      toast.success("Retiré des favoris");
      window.location.reload();
    },
  });

  const toggleFavorite = () => {
    if (!isAuthenticated) {
      toast.error("Connectez-vous pour sauvegarder vos favoris");
      return;
    }
    if (isFavorite) {
      removeFavoriteMutation.mutate({ bouquetId });
    } else {
      addFavoriteMutation.mutate({ bouquetId });
    }
  };

  const addToCart = trpc.cart.add.useMutation({
    onSuccess: () => {
      toast.success("Bouquet ajouté au panier !");
      setLocation("/cart");
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de l'ajout au panier");
    }
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data || !data.bouquet) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold">Bouquet non trouvé</h2>
          <Button onClick={() => setLocation("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
        </Card>
      </div>
    );
  }

  const { bouquet, flowers } = data;
  const totalPrice = bouquet.totalPrice / 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12">
      <div className="container max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left column: Bouquet visualization */}
          <Card className="p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Votre bouquet</h2>
              <Badge variant="secondary" className="text-lg">
                {totalPrice.toFixed(2)} €
              </Badge>
            </div>

            {/* Bouquet visualization */}
            <div className="mb-6 flex items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-8">
              <BouquetVisualizer
                flowers={flowers.map(f => ({
                  name: f.flower.name,
                  color: f.flower.color,
                  quantity: f.quantity
                }))}
                size="large"
              />
            </div>

            {/* Flowers list */}
            <div className="space-y-3">
              <h3 className="font-semibold">Composition :</h3>
              {flowers.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {item.quantity}×
                    </div>
                    <div>
                      <p className="font-medium">{item.flower.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.flower.color}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {((item.flower.pricePerStem * item.quantity) / 100).toFixed(2)} €
                  </p>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Budget</span>
                <span className="capitalize font-medium">{bouquet.budget}</span>
              </div>
              {bouquet.style && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Style</span>
                  <span className="capitalize font-medium">{bouquet.style}</span>
                </div>
              )}
              {bouquet.occasion && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Occasion</span>
                  <span className="font-medium">{bouquet.occasion}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Right column: Symbolism & Actions */}
          <div className="space-y-6">
            {/* Original message */}
            <Card className="p-6">
              <h3 className="mb-3 font-semibold text-muted-foreground">
                Votre message
              </h3>
              <p className="italic text-lg">"{bouquet.originalMessage}"</p>
            </Card>

            {/* Symbolism explanation */}
            <Card className="p-6">
              <h3 className="mb-4 text-xl font-bold">
                Le langage de votre bouquet
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                {bouquet.explanation}
              </p>
            </Card>

            {/* Flower meanings */}
            <Card className="p-6">
              <h3 className="mb-4 text-xl font-bold">
                Signification de chaque fleur
              </h3>
              <div className="space-y-4">
                {flowers.map((item, index) => (
                  <div key={index}>
                    <h4 className="mb-1 font-semibold text-primary">
                      {item.flower.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {item.flower.symbolism}
                    </p>
                    {item.flower.description && (
                      <p className="mt-1 text-sm text-muted-foreground/80">
                        {item.flower.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Add to cart button */}
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
              <div className="mb-4 flex items-baseline justify-between">
                <span className="text-lg font-semibold">Prix total</span>
                <span className="text-3xl font-bold text-primary">
                  {totalPrice.toFixed(2)} €
                </span>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14"
                  onClick={toggleFavorite}
                  disabled={addFavoriteMutation.isPending || removeFavoriteMutation.isPending}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
                </Button>
                <Button
                  size="lg"
                  className="flex-1 h-14 text-lg"
                  onClick={() => addToCart.mutate({ bouquetId, sessionId })}
                  disabled={addToCart.isPending}
                >
                {addToCart.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Ajout en cours...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Ajouter au panier
                  </>
                )}
              </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
