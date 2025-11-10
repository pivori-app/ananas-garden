import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import {
  Calendar,
  Heart,
  Loader2,
  Package,
  ShoppingBag,
  Star,
  Trophy,
  Gift,
} from "lucide-react";
import { Link } from "wouter";
import ReviewForm from "@/components/ReviewForm";

export default function Dashboard() {
  const { user, loading, isAuthenticated } = useAuth();

  const { data: orders } = trpc.orders.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: favorites } = trpc.favorites.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: loyaltyData } = trpc.loyalty.getPoints.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: subscriptions } = trpc.subscriptions.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: testimonials } = trpc.testimonials.myTestimonials.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-sage" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <h1 className="font-display text-4xl text-charcoal">Mon Compte</h1>
        <p className="text-charcoal/70 text-center max-w-md">
          Connectez-vous pour accéder à votre tableau de bord
        </p>
        <Button asChild className="bg-sage hover:bg-sage/90">
          <a href={getLoginUrl()}>Se connecter</a>
        </Button>
      </div>
    );
  }

  const activeSubscriptions = subscriptions?.filter((s) => s.status === "active") || [];
  const totalOrders = orders?.length || 0;
  const totalSpent = orders?.reduce((sum, order) => sum + order.totalPrice, 0) || 0;
  const loyaltyPoints = loyaltyData?.points || 0;

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl text-charcoal mb-2">
            Bonjour, {user?.name || "Client"}
          </h1>
          <p className="text-charcoal/70">Bienvenue dans votre espace personnel</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commandes</CardTitle>
              <Package className="h-4 w-4 text-charcoal/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-charcoal">{totalOrders}</div>
              <p className="text-xs text-charcoal/60">Total des commandes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dépenses</CardTitle>
              <ShoppingBag className="h-4 w-4 text-charcoal/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-charcoal">{totalSpent.toFixed(2)}€</div>
              <p className="text-xs text-charcoal/60">Total dépensé</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Points Fidélité</CardTitle>
              <Trophy className="h-4 w-4 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gold">{loyaltyPoints}</div>
              <p className="text-xs text-charcoal/60">
                {(loyaltyPoints / 10).toFixed(2)}€ de réduction
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Abonnements</CardTitle>
              <Calendar className="h-4 w-4 text-charcoal/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-charcoal">{activeSubscriptions.length}</div>
              <p className="text-xs text-charcoal/60">Abonnements actifs</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="orders">Commandes</TabsTrigger>
            <TabsTrigger value="favorites">Favoris</TabsTrigger>
            <TabsTrigger value="loyalty">Fidélité</TabsTrigger>
            <TabsTrigger value="subscriptions">Abonnements</TabsTrigger>
            <TabsTrigger value="referral">Parrainage</TabsTrigger>
            <TabsTrigger value="testimonials">Avis</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mes Commandes</CardTitle>
                <CardDescription>Historique de vos commandes de bouquets</CardDescription>
              </CardHeader>
              <CardContent>
                {orders && orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium">Commande #{order.id}</div>
                          <div className="text-sm text-charcoal/60">
                            {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{order.totalPrice.toFixed(2)}€</div>
                          <div
                            className={`text-sm ${
                              order.status === "delivered"
                                ? "text-green-600"
                                : order.status === "pending"
                                ? "text-yellow-600"
                                : "text-charcoal/60"
                            }`}
                          >
                            {order.status === "delivered"
                              ? "Livrée"
                              : order.status === "pending"
                              ? "En cours"
                              : order.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-charcoal/60">
                    Aucune commande pour le moment
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mes Favoris</CardTitle>
                <CardDescription>Vos bouquets préférés</CardDescription>
              </CardHeader>
              <CardContent>
                {favorites && favorites.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {favorites.map((fav) => (
                      <Link key={fav.favorite.id} href={`/bouquet/${fav.favorite.bouquetId}`}>
                        <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-medium">Bouquet #{fav.favorite.bouquetId}</div>
                              <div className="text-sm text-charcoal/60">
                                Ajouté le {new Date(fav.favorite.createdAt).toLocaleDateString("fr-FR")}
                              </div>
                            </div>
                            <Heart className="w-5 h-5 fill-rose text-rose" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-charcoal/60">
                    Aucun favori pour le moment
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Loyalty Tab */}
          <TabsContent value="loyalty" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Programme de Fidélité</CardTitle>
                <CardDescription>Vos points et récompenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-gradient-to-br from-gold/10 to-sage/10 rounded-lg">
                    <Trophy className="w-12 h-12 mx-auto mb-4 text-gold" />
                    <div className="text-4xl font-bold text-gold mb-2">{loyaltyPoints}</div>
                    <div className="text-charcoal/70">Points disponibles</div>
                    <div className="text-sm text-charcoal/60 mt-2">
                      = {(loyaltyPoints / 10).toFixed(2)}€ de réduction
                    </div>
                  </div>

                  <Button asChild className="w-full bg-sage hover:bg-sage/90">
                    <Link href="/loyalty-points">Voir les détails</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mes Abonnements</CardTitle>
                <CardDescription>Vos abonnements bouquets mensuels</CardDescription>
              </CardHeader>
              <CardContent>
                {subscriptions && subscriptions.length > 0 ? (
                  <div className="space-y-4">
                    {subscriptions.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium capitalize">{sub.plan}</div>
                          <div className="text-sm text-charcoal/60">
                            Livraison le {sub.deliveryDay} du mois
                          </div>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-sm ${
                            sub.status === "active"
                              ? "bg-green-100 text-green-700"
                              : sub.status === "paused"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {sub.status === "active"
                            ? "Actif"
                            : sub.status === "paused"
                            ? "En pause"
                            : "Annulé"}
                        </div>
                      </div>
                    ))}
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/subscriptions">Gérer mes abonnements</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-charcoal/30" />
                    <p className="text-charcoal/60 mb-4">Aucun abonnement actif</p>
                    <Button asChild className="bg-sage hover:bg-sage/90">
                      <Link href="/subscriptions">Créer un abonnement</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referral Tab */}
          <TabsContent value="referral" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Programme de Parrainage</CardTitle>
                <CardDescription>Invitez vos amis et gagnez des points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Gift className="w-16 h-16 mx-auto mb-4 text-sage" />
                  <h3 className="text-xl font-semibold mb-2">Parrainez vos amis</h3>
                  <p className="text-charcoal/70 mb-6 max-w-md mx-auto">
                    Gagnez 100 points de fidélité pour chaque ami qui effectue sa première commande avec votre code !
                  </p>
                  <Link href="/referral">
                    <Button className="bg-sage hover:bg-sage/90">
                      Accéder au programme
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials" className="space-y-4">
            {/* Review Form */}
            <ReviewForm onSuccess={() => window.location.reload()} />

            {/* My Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Mes Avis</CardTitle>
                <CardDescription>Vos témoignages publiés</CardDescription>
              </CardHeader>
              <CardContent>
                {testimonials && testimonials.length > 0 ? (
                  <div className="space-y-4">
                    {testimonials.map((testimonial) => (
                      <div key={testimonial.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex gap-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < testimonial.rating
                                    ? "fill-gold text-gold"
                                    : "text-charcoal/20"
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-xs text-charcoal/60">
                            {new Date(testimonial.createdAt).toLocaleDateString("fr-FR")}
                          </div>
                        </div>
                        <p className="text-charcoal/80 italic">"{testimonial.comment}"</p>
                        {testimonial.bouquetName && (
                          <div className="text-sm text-charcoal/60 mt-2">
                            {testimonial.bouquetName}
                          </div>
                        )}
                        {testimonial.imageUrl && (
                          <img
                            src={testimonial.imageUrl}
                            alt="Photo du bouquet"
                            className="mt-3 rounded-lg max-w-xs w-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-charcoal/60">
                    Aucun avis publié pour le moment
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
