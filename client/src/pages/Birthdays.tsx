import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Trash2, Edit, Gift, MapPin, Phone, Mail, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { getLoginUrl } from "@/const";

export default function Birthdays() {
  const { user, loading: authLoading } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    address: "",
    phone: "",
    email: "",
    preferences: "",
  });

  // Queries
  const { data: contacts = [], refetch } = trpc.birthdays.list.useQuery(undefined, {
    enabled: !!user,
  });

  const { data: upcomingBirthdays = [] } = trpc.birthdays.upcoming.useQuery(
    { daysAhead: 30 },
    { enabled: !!user }
  );

  // Mutations
  const createMutation = trpc.birthdays.create.useMutation({
    onSuccess: () => {
      toast.success("Contact ajouté avec succès !");
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error("Erreur : " + error.message);
    },
  });

  const updateMutation = trpc.birthdays.update.useMutation({
    onSuccess: () => {
      toast.success("Contact mis à jour !");
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error("Erreur : " + error.message);
    },
  });

  const deleteMutation = trpc.birthdays.delete.useMutation({
    onSuccess: () => {
      toast.success("Contact supprimé !");
      refetch();
    },
    onError: (error) => {
      toast.error("Erreur : " + error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      birthDate: "",
      address: "",
      phone: "",
      email: "",
      preferences: "",
    });
    setShowForm(false);
    setEditingContact(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ...formData,
      birthDate: new Date(formData.birthDate),
    };

    if (editingContact) {
      updateMutation.mutate({ contactId: editingContact, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (contact: any) => {
    setFormData({
      firstName: contact.firstName,
      lastName: contact.lastName,
      birthDate: format(new Date(contact.birthDate), "yyyy-MM-dd"),
      address: contact.address || "",
      phone: contact.phone || "",
      email: contact.email || "",
      preferences: contact.preferences || "",
    });
    setEditingContact(contact.id);
    setShowForm(true);
  };

  const handleDelete = (contactId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")) {
      deleteMutation.mutate({ contactId });
    }
  };

  const getDaysUntilBirthday = (birthDate: Date) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const thisYearBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());

    if (thisYearBirthday < today) {
      thisYearBirthday.setFullYear(today.getFullYear() + 1);
    }

    return Math.floor((thisYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sage-50 to-white">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Connexion requise</CardTitle>
            <CardDescription>
              Vous devez être connecté pour gérer vos anniversaires
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
    <div className="min-h-screen bg-gradient-to-b from-sage-50 to-white py-12">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-sage-900 mb-2">
            Mes Anniversaires
          </h1>
          <p className="text-lg text-sage-600">
            Ne manquez plus jamais un anniversaire important
          </p>
        </div>

        {/* Upcoming Birthdays Alert */}
        {upcomingBirthdays.length > 0 && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-amber-900">
                <Gift className="h-5 w-5" />
                Anniversaires à venir (30 prochains jours)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {upcomingBirthdays.map((contact: any) => {
                  const daysUntil = getDaysUntilBirthday(new Date(contact.birthDate));
                  return (
                    <div key={contact.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="font-medium">{contact.firstName} {contact.lastName}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(contact.birthDate), "d MMMM", { locale: fr })}
                        </p>
                      </div>
                      <Badge variant={daysUntil <= 7 ? "destructive" : "secondary"}>
                        Dans {daysUntil} jour{daysUntil > 1 ? "s" : ""}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Contact Button */}
        {!showForm && (
          <Button onClick={() => setShowForm(true)} size="lg" className="mb-6 gap-2">
            <Plus className="h-5 w-5" />
            Ajouter un contact
          </Button>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingContact ? "Modifier" : "Ajouter"} un contact</CardTitle>
              <CardDescription>
                Enregistrez les informations pour ne jamais oublier cet anniversaire
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="birthDate">Date d'anniversaire *</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Adresse de livraison</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="preferences">Préférences (fleurs, couleurs, budget...)</Label>
                  <Textarea
                    id="preferences"
                    value={formData.preferences}
                    onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                    rows={2}
                    placeholder="Ex: Aime les roses rouges, budget 50€"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {(createMutation.isPending || updateMutation.isPending) && (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    )}
                    {editingContact ? "Mettre à jour" : "Ajouter"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Contacts List */}
        <div className="grid gap-4">
          {contacts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">
                  Aucun contact enregistré
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Ajoutez votre premier contact pour commencer
                </p>
              </CardContent>
            </Card>
          ) : (
            contacts.map((contact: any) => {
              const daysUntil = getDaysUntilBirthday(new Date(contact.birthDate));
              const isUpcoming = daysUntil <= 30;

              return (
                <Card key={contact.id} className={isUpcoming ? "border-primary/30" : ""}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-semibold">
                            {contact.firstName} {contact.lastName}
                          </h3>
                          {isUpcoming && (
                            <Badge 
                              variant={
                                daysUntil <= 7 
                                  ? "destructive" 
                                  : daysUntil <= 14 
                                  ? "default" 
                                  : "secondary"
                              }
                              className={
                                daysUntil <= 7 
                                  ? "" 
                                  : daysUntil <= 14 
                                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" 
                                  : "bg-green-100 text-green-800 hover:bg-green-200"
                              }
                            >
                              Dans {daysUntil} jour{daysUntil > 1 ? "s" : ""}
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(contact.birthDate), "d MMMM yyyy", { locale: fr })}
                          </div>

                          {contact.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {contact.phone}
                            </div>
                          )}

                          {contact.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {contact.email}
                            </div>
                          )}

                          {contact.address && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {contact.address.substring(0, 50)}...
                            </div>
                          )}
                        </div>

                        {contact.preferences && (
                          <div className="mt-3 p-3 bg-muted rounded-lg">
                            <p className="text-sm">
                              <span className="font-medium">Préférences :</span> {contact.preferences}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        {isUpcoming && (
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-sage hover:bg-sage/90 whitespace-nowrap"
                            onClick={() => {
                              // Rediriger vers la page de création avec pré-remplissage
                              window.location.href = `/create?recipient=${encodeURIComponent(contact.firstName + ' ' + contact.lastName)}&occasion=anniversaire`;
                            }}
                          >
                            <Gift className="h-4 w-4 mr-1" />
                            Commander
                          </Button>
                        )}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(contact)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(contact.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
