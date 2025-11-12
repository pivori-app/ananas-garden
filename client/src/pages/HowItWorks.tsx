import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { 
  MessageCircle, 
  Sparkles, 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  Heart,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export default function HowItWorks() {
  const [, setLocation] = useLocation();

  const steps = [
    {
      icon: MessageCircle,
      title: "1. Exprimez votre émotion",
      description: "Commencez par nous dire ce que vous ressentez ou le message que vous souhaitez transmettre. Utilisez notre scanner émotionnel intelligent ou parcourez notre catalogue de fleurs pour découvrir leur signification dans le langage des fleurs.",
      details: [
        "Décrivez votre émotion en quelques mots (amour, gratitude, amitié...)",
        "Notre IA analyse votre message et identifie les émotions clés",
        "Chaque fleur possède une signification unique dans le langage millénaire des fleurs"
      ],
      color: "bg-pink-50 text-pink-600"
    },
    {
      icon: Sparkles,
      title: "2. Découvrez votre bouquet personnalisé",
      description: "Notre système intelligent sélectionne les fleurs qui correspondent parfaitement à votre message émotionnel. Vous pouvez également personnaliser davantage votre création avec notre configurateur visuel.",
      details: [
        "Visualisez votre bouquet en temps réel avec notre prévisualisation 3D",
        "Ajoutez ou retirez des fleurs selon vos préférences",
        "Choisissez les couleurs, le vase et les accessoires (ruban, chocolats...)",
        "Consultez la signification de chaque fleur dans votre composition"
      ],
      color: "bg-purple-50 text-purple-600"
    },
    {
      icon: ShoppingCart,
      title: "3. Ajoutez au panier",
      description: "Une fois votre bouquet parfait créé, ajoutez-le à votre panier. Vous pouvez créer plusieurs bouquets pour différentes occasions ou destinataires.",
      details: [
        "Modifiez les quantités selon vos besoins",
        "Ajoutez un message personnalisé pour chaque bouquet",
        "Profitez de la livraison gratuite dès 50€ d'achat",
        "Sauvegardez vos créations dans vos favoris pour plus tard"
      ],
      color: "bg-green-50 text-green-600"
    },
    {
      icon: CreditCard,
      title: "4. Finalisez votre commande",
      description: "Renseignez les informations de livraison et choisissez votre mode de paiement sécurisé. Nous acceptons PayPal et les cartes bancaires.",
      details: [
        "Saisissez l'adresse de livraison du destinataire",
        "Choisissez la date de livraison souhaitée",
        "Paiement 100% sécurisé avec PayPal ou carte bancaire",
        "Recevez une confirmation immédiate par email"
      ],
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: Truck,
      title: "5. Livraison express",
      description: "Votre bouquet est préparé avec soin par nos fleuristes experts et livré à l'adresse indiquée. Suivez votre commande en temps réel depuis votre espace client.",
      details: [
        "Préparation artisanale par nos fleuristes partenaires",
        "Emballage soigné pour préserver la fraîcheur des fleurs",
        "Livraison express en 24-48h partout en France",
        "Suivi de commande et notifications par email/SMS"
      ],
      color: "bg-orange-50 text-orange-600"
    },
    {
      icon: Heart,
      title: "6. Émerveillez vos proches",
      description: "Votre destinataire reçoit un bouquet unique chargé d'émotions. Vous pouvez consulter la signification de chaque fleur dans votre espace client et partager votre création.",
      details: [
        "Carte explicative du langage des fleurs incluse",
        "Conseils d'entretien pour prolonger la beauté du bouquet",
        "Partagez votre création sur les réseaux sociaux",
        "Laissez un avis avec photo pour inspirer d'autres clients"
      ],
      color: "bg-red-50 text-red-600"
    }
  ];

  const features = [
    {
      title: "Intelligence Émotionnelle",
      description: "Notre IA analyse vos émotions et sélectionne les fleurs qui correspondent parfaitement à votre message, en s'appuyant sur le langage des fleurs millénaire."
    },
    {
      title: "Personnalisation Totale",
      description: "Configurateur visuel en temps réel pour créer un bouquet 100% unique qui vous ressemble, avec choix des fleurs, couleurs, vases et accessoires."
    },
    {
      title: "Qualité Garantie",
      description: "Fleurs fraîches sélectionnées quotidiennement, préparées par des fleuristes experts et livrées avec soin pour garantir leur beauté."
    },
    {
      title: "Livraison Express",
      description: "Livraison en 24-48h partout en France, gratuite dès 50€ d'achat. Suivi en temps réel et notifications à chaque étape."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <section className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Comment fonctionne Ananas Garden ?
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Découvrez comment transformer vos émotions en bouquets uniques grâce au langage des fleurs
            </p>
            <Button 
              size="lg" 
              onClick={() => setLocation("/scanner")}
              className="h-14 px-8 text-lg"
            >
              Créer mon premier bouquet
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Steps section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className={`flex-shrink-0 w-16 h-16 rounded-full ${step.color} flex items-center justify-center`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                      <p className="text-muted-foreground mb-4">{step.description}</p>
                      <ul className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Pourquoi choisir Ananas Garden ?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="p-6">
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Prêt à créer votre premier bouquet émotionnel ?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Rejoignez des milliers de clients qui ont déjà transmis leurs émotions grâce au langage des fleurs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => setLocation("/scanner")}
                className="h-14 px-8 text-lg"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Scanner mes émotions
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setLocation("/catalog")}
                className="h-14 px-8 text-lg"
              >
                Parcourir le catalogue
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
