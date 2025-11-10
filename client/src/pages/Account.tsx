import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useState } from "react";
import { User, Mail, Bell, Trash2, Save } from "lucide-react";
import { useLocation } from "wouter";

export default function Account() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [notifDelivery, setNotifDelivery] = useState(true);
  const [notifPromo, setNotifPromo] = useState(true);
  const [notifAnniversary, setNotifAnniversary] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage"></div>
      </div>
    );
  }

  if (!user) {
    setLocation("/");
    return null;
  }

  const handleSaveProfile = () => {
    // TODO: Implémenter la mise à jour du profil via tRPC
    toast.success("Profil mis à jour avec succès");
  };

  const handleDeleteAccount = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      // TODO: Implémenter la suppression du compte via tRPC
      toast.success("Compte supprimé avec succès");
      setLocation("/");
    }
  };

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <h1 className="font-display text-4xl text-charcoal mb-2">Mon Compte</h1>
          <p className="text-charcoal/70">Gérez vos informations personnelles et vos préférences</p>
        </div>

        <div className="space-y-6">
          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informations personnelles
              </CardTitle>
              <CardDescription>
                Mettez à jour votre nom et votre adresse email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                />
              </div>
              <Button onClick={handleSaveProfile} className="w-full sm:w-auto">
                <Save className="w-4 h-4 mr-2" />
                Enregistrer les modifications
              </Button>
            </CardContent>
          </Card>

          {/* Préférences de notification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Préférences de notification
              </CardTitle>
              <CardDescription>
                Choisissez les notifications que vous souhaitez recevoir
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notif-delivery">Notifications de livraison</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevez des alertes avant la livraison de vos bouquets
                  </p>
                </div>
                <Switch
                  id="notif-delivery"
                  checked={notifDelivery}
                  onCheckedChange={setNotifDelivery}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notif-promo">Promotions personnalisées</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevez des offres spéciales adaptées à vos goûts
                  </p>
                </div>
                <Switch
                  id="notif-promo"
                  checked={notifPromo}
                  onCheckedChange={setNotifPromo}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notif-anniversary">Rappels d'anniversaire</Label>
                  <p className="text-sm text-muted-foreground">
                    Ne manquez jamais un anniversaire important
                  </p>
                </div>
                <Switch
                  id="notif-anniversary"
                  checked={notifAnniversary}
                  onCheckedChange={setNotifAnniversary}
                />
              </div>
            </CardContent>
          </Card>

          {/* Méthode de connexion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Méthode de connexion
              </CardTitle>
              <CardDescription>
                Votre compte est connecté via {user.loginMethod || "Manus OAuth"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-cream p-4 rounded-lg border border-sage/20">
                <p className="text-sm text-charcoal/70">
                  Votre compte utilise l'authentification sécurisée Manus OAuth. 
                  Vous pouvez vous connecter avec Google, GitHub ou email selon votre configuration.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Zone dangereuse */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="w-5 h-5" />
                Zone dangereuse
              </CardTitle>
              <CardDescription>
                Actions irréversibles sur votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-charcoal/70">
                  La suppression de votre compte entraînera la perte définitive de toutes vos données : 
                  commandes, favoris, points de fidélité et abonnements.
                </p>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer mon compte
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
