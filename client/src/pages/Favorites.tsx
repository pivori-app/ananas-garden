import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Heart, Loader2, ShoppingCart, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function Favorites() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { data: favoritesData, isLoading, refetch } = trpc.favorites.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const removeFavoriteMutation = trpc.favorites.remove.useMutation({
    onSuccess: () => {
      toast.success("Retiré des favoris");
      refetch();
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    }
  });

  const addToCartMutation = trpc.cart.add.useMutation({
    onSuccess: () => {
      toast.success("Ajouté au panier !");
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout au panier");
    }
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Connexion requise</CardTitle>
            <CardDescription>
              Vous devez être connecté pour accéder à vos favoris
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href={getLoginUrl()}>Se connecter</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const favorites = favoritesData || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => setLocation("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au dashboard
        </Button>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 font-serif">Mes Favoris</h1>
          <p className="text-muted-foreground">
            Retrouvez tous vos bouquets préférés sauvegardés
          </p>
        </div>

        {favorites.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Aucun favori pour le moment</h3>
              <p className="text-muted-foreground mb-6">
                Commencez à sauvegarder vos bouquets préférés pour les retrouver facilement
              </p>
              <Button asChild>
                <Link href="/create">Créer un bouquet</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map(({ favorite, bouquet }) => {
              if (!bouquet) return null;
              
              return (
                <Card key={favorite.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5">
                    <CardTitle className="text-lg line-clamp-2">
                      {bouquet.occasion || "Bouquet personnalisé"}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {bouquet.explanation}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Budget</span>
                      <span className="font-medium capitalize">{bouquet.budget}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Prix</span>
                      <span className="font-bold text-primary">
                        {(bouquet.totalPrice / 100).toFixed(2)} €
                      </span>
                    </div>

                    {bouquet.style && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Style</span>
                        <span className="font-medium capitalize">{bouquet.style}</span>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <Link href={`/bouquet/${bouquet.id}`}>Voir détails</Link>
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (bouquet.id) {
                            addToCartMutation.mutate({
                              bouquetId: bouquet.id,
                              quantity: 1,
                            });
                          }
                        }}
                        disabled={addToCartMutation.isPending}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (bouquet.id) {
                            removeFavoriteMutation.mutate({ bouquetId: bouquet.id });
                          }
                        }}
                        disabled={removeFavoriteMutation.isPending}
                      >
                        <Heart className="h-4 w-4 fill-current text-red-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
