import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Phone, MapPin, Send } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Contact() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simuler l'envoi du formulaire
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Message envoyé !", {
      description: "Nous vous répondrons dans les plus brefs délais.",
    });

    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-rose-50 py-12">
      <div className="container max-w-6xl">
        <Button variant="ghost" onClick={() => setLocation("/")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <h1 className="mb-8 font-serif text-4xl font-bold text-sage-900">Contactez-nous</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Formulaire de contact */}
          <Card className="border-sage-200 p-6 lg:col-span-2">
            <h2 className="mb-6 font-serif text-2xl font-bold text-sage-900">
              Envoyez-nous un message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="mt-2"
                    placeholder="Jean Dupont"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="mt-2"
                    placeholder="jean.dupont@example.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="subject">Sujet *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="mt-2"
                  placeholder="Question sur une commande"
                />
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="mt-2 min-h-[150px]"
                  placeholder="Décrivez votre demande..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-sage-600 hover:bg-sage-700"
              >
                {isSubmitting ? (
                  "Envoi en cours..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Envoyer le message
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Informations de contact */}
          <div className="space-y-6">
            <Card className="border-sage-200 p-6">
              <h2 className="mb-4 font-serif text-xl font-bold text-sage-900">
                Coordonnées
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-sage-100 p-2">
                    <MapPin className="h-5 w-5 text-sage-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sage-900">Adresse</p>
                    <p className="text-sm text-sage-600">
                      123 Rue des Fleurs<br />
                      75001 Paris, France
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-rose-100 p-2">
                    <Phone className="h-5 w-5 text-rose-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sage-900">Téléphone</p>
                    <a
                      href="tel:+33123456789"
                      className="text-sm text-sage-600 hover:text-sage-900"
                    >
                      +33 1 23 45 67 89
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-gold-100 p-2">
                    <Mail className="h-5 w-5 text-gold-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sage-900">Email</p>
                    <a
                      href="mailto:contact@ananas-garden.fr"
                      className="text-sm text-sage-600 hover:text-sage-900"
                    >
                      contact@ananas-garden.fr
                    </a>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-sage-200 p-6">
              <h2 className="mb-4 font-serif text-xl font-bold text-sage-900">
                Horaires d'ouverture
              </h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-sage-600">Lundi - Vendredi</span>
                  <span className="font-semibold text-sage-900">9h - 19h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-600">Samedi</span>
                  <span className="font-semibold text-sage-900">10h - 18h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-600">Dimanche</span>
                  <span className="font-semibold text-sage-900">Fermé</span>
                </div>
              </div>
            </Card>

            <Card className="border-sage-200 bg-gradient-to-br from-sage-100 to-rose-100 p-6">
              <h2 className="mb-2 font-serif text-xl font-bold text-sage-900">
                Besoin d'aide ?
              </h2>
              <p className="mb-4 text-sm text-sage-700">
                Consultez notre FAQ ou contactez notre service client pour toute question.
              </p>
              <p className="text-sm text-sage-600">
                Temps de réponse moyen : <strong className="text-sage-900">24h</strong>
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
