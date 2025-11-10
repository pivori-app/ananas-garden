import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Calendar, Check, Loader2, Pause, Play, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PLANS = {
  economique: {
    name: "Bouquet Économique",
    price: 29.90,
    description: "Un bouquet simple et élégant chaque mois",
    features: ["5-7 fleurs de saison", "Livraison incluse", "Carte personnalisée"],
  },
  standard: {
    name: "Bouquet Standard",
    price: 49.90,
    description: "Un bouquet généreux avec fleurs de saison",
    features: ["10-15 fleurs variées", "Livraison premium", "Carte + ruban", "Vase offert"],
  },
  premium: {
    name: "Bouquet Premium",
    price: 79.90,
    description: "Un bouquet luxueux avec fleurs rares et exotiques",
    features: ["20+ fleurs premium", "Livraison express", "Emballage luxe", "Vase design", "Chocolats offerts"],
  },
};

export default function Subscriptions() {
  const { user, loading, isAuthenticated } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"economique" | "standard" | "premium">("standard");
  const [deliveryDay, setDeliveryDay] = useState("1");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [preferences, setPreferences] = useState("");

  const { data: subscriptions, isLoading, refetch } = trpc.subscriptions.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const createMutation = trpc.subscriptions.create.useMutation({
    onSuccess: () => {
      toast.success("Abonnement créé avec succès !");
      setIsCreating(false);
      refetch();
    },
    onError: (error) => {
      toast.error(`Erreur : ${error.message}`);
    },
  });

  const cancelMutation = trpc.subscriptions.cancel.useMutation({
    onSuccess: () => {
      toast.success("Abonnement annulé");
      refetch();
    },
  });

  const pauseMutation = trpc.subscriptions.pause.useMutation({
    onSuccess: () => {
      toast.success("Abonnement mis en pause");
      refetch();
    },
  });

  const resumeMutation = trpc.subscriptions.resume.useMutation({
    onSuccess: () => {
      toast.success("Abonnement repris");
      refetch();
    },
  });

  const handleCreateSubscription = () => {
    if (!deliveryAddress.trim()) {
      toast.error("Veuillez entrer une adresse de livraison");
      return;
    }

    createMutation.mutate({
      plan: selectedPlan,
      deliveryDay: parseInt(deliveryDay),
      deliveryAddress,
      preferences,
    });
  };

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
        <h1 className="font-display text-4xl text-charcoal">Abonnements Bouquets</h1>
        <p className="text-charcoal/70 text-center max-w-md">
          Connectez-vous pour gérer vos abonnements bouquets mensuels
        </p>
        <Button asChild className="bg-sage hover:bg-sage/90">
          <a href={getLoginUrl()}>Se connecter</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="container max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl text-charcoal mb-2">Mes Abonnements</h1>
            <p className="text-charcoal/70">Recevez un bouquet personnalisé chaque mois</p>
          </div>

          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button className="bg-sage hover:bg-sage/90">
                <Calendar className="w-4 h-4 mr-2" />
                Nouvel abonnement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Créer un abonnement</DialogTitle>
                <DialogDescription>
                  Choisissez votre formule et recevez un bouquet chaque mois
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Sélection du plan */}
                <div className="space-y-3">
                  <Label>Formule</Label>
                  <div className="grid gap-3">
                    {(Object.keys(PLANS) as Array<keyof typeof PLANS>).map((plan) => (
                      <Card
                        key={plan}
                        className={`cursor-pointer transition-all ${
                          selectedPlan === plan ? "ring-2 ring-sage" : ""
                        }`}
                        onClick={() => setSelectedPlan(plan)}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{PLANS[plan].name}</CardTitle>
                              <CardDescription>{PLANS[plan].description}</CardDescription>
                            </div>
                            <div className="text-right">
                              <div className="font-display text-2xl text-sage">
                                {PLANS[plan].price}€
                              </div>
                              <div className="text-sm text-charcoal/60">/mois</div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {PLANS[plan].features.map((feature, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm">
                                <Check className="w-4 h-4 text-sage" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Jour de livraison */}
                <div className="space-y-2">
                  <Label htmlFor="deliveryDay">Jour de livraison (du mois)</Label>
                  <Select value={deliveryDay} onValueChange={setDeliveryDay}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          Le {day} de chaque mois
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Adresse de livraison */}
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse de livraison</Label>
                  <Textarea
                    id="address"
                    placeholder="123 Rue des Fleurs, 75001 Paris"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Préférences */}
                <div className="space-y-2">
                  <Label htmlFor="preferences">Préférences (optionnel)</Label>
                  <Textarea
                    id="preferences"
                    placeholder="Couleurs préférées, occasions spéciales, allergies..."
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleCreateSubscription}
                  disabled={createMutation.isPending}
                  className="w-full bg-sage hover:bg-sage/90"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    "Créer l'abonnement"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Liste des abonnements */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-sage" />
          </div>
        ) : subscriptions && subscriptions.length > 0 ? (
          <div className="grid gap-6">
            {subscriptions.map((sub) => (
              <Card key={sub.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{PLANS[sub.plan].name}</CardTitle>
                      <CardDescription>
                        Livraison le {sub.deliveryDay} de chaque mois
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
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
                          : sub.status === "cancelled"
                          ? "Annulé"
                          : "Expiré"}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-charcoal/60">Adresse de livraison</div>
                      <div className="text-charcoal">{sub.deliveryAddress}</div>
                    </div>

                    {sub.preferences && (
                      <div>
                        <div className="text-sm text-charcoal/60">Préférences</div>
                        <div className="text-charcoal">{sub.preferences}</div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {sub.status === "active" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => pauseMutation.mutate({ subscriptionId: sub.id })}
                            disabled={pauseMutation.isPending}
                          >
                            <Pause className="w-4 h-4 mr-2" />
                            Mettre en pause
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => cancelMutation.mutate({ subscriptionId: sub.id })}
                            disabled={cancelMutation.isPending}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Annuler
                          </Button>
                        </>
                      )}

                      {sub.status === "paused" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resumeMutation.mutate({ subscriptionId: sub.id })}
                          disabled={resumeMutation.isPending}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Reprendre
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-charcoal/30" />
              <h3 className="font-display text-xl text-charcoal mb-2">Aucun abonnement</h3>
              <p className="text-charcoal/60 mb-6">
                Créez votre premier abonnement pour recevoir un bouquet chaque mois
              </p>
              <Button onClick={() => setIsCreating(true)} className="bg-sage hover:bg-sage/90">
                Créer un abonnement
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
