import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Loader2, Heart, Trash2, Bell, BellOff, ShoppingCart, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

export default function Wishlist() {
  const { user, loading: authLoading } = useAuth();
  const [editingNotes, setEditingNotes] = useState<number | null>(null);
  const [notes, setNotes] = useState("");

  const { data: wishlistItems, isLoading, refetch } = trpc.wishlist.list.useQuery(undefined, {
    enabled: !!user,
  });
  
  type WishlistItem = NonNullable<typeof wishlistItems>[number];

  const removeMutation = trpc.wishlist.remove.useMutation({
    onSuccess: () => {
      toast.success("Bouquet retiré de la liste de souhaits");
      refetch();
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });

  const updateNotesMutation = trpc.wishlist.updateNotes.useMutation({
    onSuccess: () => {
      toast.success("Notes mises à jour");
      setEditingNotes(null);
      refetch();
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour des notes");
    },
  });

  const handleRemove = (bouquetId: number) => {
    if (confirm("Voulez-vous vraiment retirer ce bouquet de votre liste de souhaits ?")) {
      removeMutation.mutate({ bouquetId });
    }
  };

  const handleSaveNotes = (bouquetId: number) => {
    updateNotesMutation.mutate({ bouquetId, notes });
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 via-cream-50 to-blush-50">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-rose-500" />
              Liste de Souhaits
            </CardTitle>
            <CardDescription>
              Connectez-vous pour accéder à votre liste de souhaits
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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-sage-50 via-cream-50 to-blush-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="h-10 w-10 text-rose-500 fill-rose-500" />
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-charcoal">
                Ma Liste de Souhaits
              </h1>
            </div>
            <p className="text-lg text-charcoal/70">
              Retrouvez tous vos bouquets préférés et recevez des notifications lors des promotions
            </p>
          </div>
        </div>
      </section>

      {/* Wishlist Content */}
      <section className="py-16">
        <div className="container max-w-6xl">
          {wishlistItems && wishlistItems.length > 0 ? (
            <div className="grid gap-6">
              {wishlistItems.map((item: WishlistItem) => (
                <Card key={item.id} className="overflow-hidden border-sage-200 hover:shadow-lg transition-shadow">
                  <div className="grid md:grid-cols-[300px_1fr] gap-6">
                    {/* Image */}
                    <div className="relative h-64 md:h-auto overflow-hidden">
                      {item.bouquet?.imageUrl ? (
                        <img
                          src={item.bouquet.imageUrl}
                          alt={item.bouquet.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-sage-100 flex items-center justify-center">
                          <Heart className="h-16 w-16 text-sage-300" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-serif font-bold text-charcoal mb-2">
                            {item.bouquet?.name || "Bouquet"}
                          </h3>
                          {item.bouquet?.description && (
                            <p className="text-charcoal/70 mb-3">{item.bouquet.description}</p>
                          )}
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="bg-sage-50">
                              {item.bouquet?.price ? `${item.bouquet.price} €` : "Prix non disponible"}
                            </Badge>
                            {item.notifyOnPromotion === 1 && (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                <Bell className="h-3 w-3 mr-1" />
                                Notifications actives
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-rose-500 hover:bg-rose-50"
                            onClick={() => handleRemove(item.bouquetId)}
                            disabled={removeMutation.isPending}
                          >
                            {removeMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Notes Section */}
                      <div className="mt-auto">
                        {editingNotes === item.id ? (
                          <div className="space-y-3">
                            <Textarea
                              placeholder="Ajoutez vos notes personnelles..."
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              className="min-h-[100px]"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleSaveNotes(item.bouquetId)}
                                disabled={updateNotesMutation.isPending}
                              >
                                {updateNotesMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : null}
                                Enregistrer
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingNotes(null)}
                              >
                                Annuler
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            {item.notes ? (
                              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-3">
                                <div className="flex items-start gap-2">
                                  <StickyNote className="h-4 w-4 text-amber-600 mt-1 flex-shrink-0" />
                                  <p className="text-sm text-charcoal/80">{item.notes}</p>
                                </div>
                              </div>
                            ) : null}
                            <div className="flex gap-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingNotes(item.id);
                                  setNotes(item.notes || "");
                                }}
                              >
                                <StickyNote className="h-4 w-4 mr-2" />
                                {item.notes ? "Modifier les notes" : "Ajouter des notes"}
                              </Button>
                              <Button asChild size="sm">
                                <Link href={`/bouquet/${item.bouquetId}`}>
                                  <ShoppingCart className="h-4 w-4 mr-2" />
                                  Commander
                                </Link>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 text-xs text-charcoal/50">
                        Ajouté le {new Date(item.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-16">
              <CardContent>
                <Heart className="h-16 w-16 text-sage-300 mx-auto mb-4" />
                <h3 className="text-xl font-serif font-bold text-charcoal mb-2">
                  Votre liste de souhaits est vide
                </h3>
                <p className="text-charcoal/60 mb-6">
                  Parcourez notre catalogue et ajoutez vos bouquets préférés
                </p>
                <Button asChild>
                  <Link href="/catalog">Découvrir nos bouquets</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
