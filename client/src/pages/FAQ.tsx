import { HelpCircle, Package, Flower2, CreditCard, RefreshCw, Sparkles } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function FAQ() {
  const faqSections = [
    {
      icon: Package,
      title: "Livraison",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      questions: [
        {
          q: "Quels sont les délais de livraison ?",
          a: "Nous livrons dans un délai de 24 à 48 heures ouvrées pour les commandes passées avant 14h. Pour les occasions spéciales, vous pouvez choisir une date de livraison précise lors de votre commande."
        },
        {
          q: "Dans quelles zones livrez-vous ?",
          a: "Nous livrons dans toute la France métropolitaine. Les frais de livraison varient selon votre localisation et sont calculés automatiquement lors du paiement."
        },
        {
          q: "Comment suivre ma commande ?",
          a: "Vous recevez un email de confirmation avec un numéro de suivi dès l'expédition de votre bouquet. Vous pouvez également consulter l'état de vos commandes dans votre espace client."
        },
        {
          q: "Que faire si je ne suis pas disponible à la livraison ?",
          a: "Notre livreur tentera de vous joindre par téléphone. Si vous êtes absent, il laissera un avis de passage et le bouquet sera déposé chez un voisin ou en point relais selon vos préférences."
        }
      ]
    },
    {
      icon: Flower2,
      title: "Entretien des fleurs",
      color: "text-green-600",
      bgColor: "bg-green-50",
      questions: [
        {
          q: "Comment conserver mon bouquet plus longtemps ?",
          a: "Coupez les tiges en biseau tous les 2-3 jours, changez l'eau quotidiennement, retirez les feuilles immergées et placez le bouquet dans un endroit frais à l'abri du soleil direct et des sources de chaleur."
        },
        {
          q: "Combien de temps dure un bouquet ?",
          a: "Avec un entretien approprié, nos bouquets durent généralement entre 7 et 14 jours. Certaines fleurs comme les roses et les chrysanthèmes peuvent durer jusqu'à 3 semaines."
        },
        {
          q: "Que faire si certaines fleurs fanent rapidement ?",
          a: "Retirez immédiatement les fleurs fanées pour éviter qu'elles n'affectent les autres. Si le problème persiste dans les 48h suivant la livraison, contactez notre service client pour un remplacement."
        },
        {
          q: "Puis-je ajouter de la nourriture pour fleurs ?",
          a: "Oui ! Nous incluons un sachet de nourriture pour fleurs avec chaque bouquet. Dissolvez-le dans l'eau du vase pour prolonger la fraîcheur et la beauté de vos fleurs."
        }
      ]
    },
    {
      icon: Sparkles,
      title: "Personnalisation",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      questions: [
        {
          q: "Puis-je personnaliser mon bouquet ?",
          a: "Absolument ! Utilisez notre configurateur de bouquet pour choisir vos fleurs préférées, les couleurs, le style et même ajouter un message personnalisé. Vous pouvez également nous contacter pour des demandes spéciales."
        },
        {
          q: "Puis-je ajouter un message personnalisé ?",
          a: "Oui, vous pouvez ajouter une carte avec un message personnalisé gratuit (jusqu'à 200 caractères) lors de votre commande. Pour des messages plus longs, contactez-nous."
        },
        {
          q: "Proposez-vous des bouquets pour des événements spéciaux ?",
          a: "Oui ! Nous créons des compositions sur mesure pour mariages, anniversaires, baptêmes, funérailles et tous types d'événements. Contactez notre équipe au moins 2 semaines à l'avance pour les grandes occasions."
        },
        {
          q: "Puis-je choisir un vase spécifique ?",
          a: "Nous proposons une sélection de vases élégants que vous pouvez ajouter à votre commande. Consultez notre catalogue d'accessoires ou contactez-nous pour des demandes particulières."
        }
      ]
    },
    {
      icon: CreditCard,
      title: "Paiement",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      questions: [
        {
          q: "Quels moyens de paiement acceptez-vous ?",
          a: "Nous acceptons les cartes bancaires (Visa, Mastercard, American Express), PayPal et Stripe. Tous les paiements sont sécurisés et cryptés."
        },
        {
          q: "Le paiement est-il sécurisé ?",
          a: "Oui, absolument. Nous utilisons les protocoles de sécurité les plus avancés (SSL/TLS) et ne stockons jamais vos informations bancaires. Tous les paiements sont traités par Stripe et PayPal, leaders mondiaux du paiement en ligne."
        },
        {
          q: "Puis-je payer en plusieurs fois ?",
          a: "Pour les commandes supérieures à 100€, nous proposons le paiement en 3 fois sans frais via notre partenaire Stripe. Cette option apparaît automatiquement lors du paiement."
        },
        {
          q: "Puis-je obtenir une facture ?",
          a: "Oui, une facture est automatiquement générée et envoyée par email après chaque commande. Vous pouvez également la télécharger depuis votre espace client."
        }
      ]
    },
    {
      icon: RefreshCw,
      title: "Retours et remboursements",
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      questions: [
        {
          q: "Quelle est votre politique de retour ?",
          a: "En raison de la nature périssable des fleurs, nous n'acceptons pas les retours. Cependant, si vous n'êtes pas satisfait de votre bouquet, contactez-nous dans les 48h suivant la livraison pour un remplacement ou un remboursement."
        },
        {
          q: "Que faire si mon bouquet arrive endommagé ?",
          a: "Prenez des photos immédiatement et contactez notre service client dans les 24h. Nous vous proposerons un remplacement gratuit ou un remboursement intégral selon votre préférence."
        },
        {
          q: "Puis-je annuler ma commande ?",
          a: "Vous pouvez annuler votre commande gratuitement jusqu'à 24h avant la date de livraison prévue. Au-delà, des frais d'annulation de 50% s'appliquent car le bouquet est déjà en préparation."
        },
        {
          q: "Combien de temps prend un remboursement ?",
          a: "Les remboursements sont traités sous 48h et apparaissent sur votre compte bancaire sous 5 à 10 jours ouvrés selon votre banque."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-sage-50 via-cream-50 to-blush-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <HelpCircle className="h-12 w-12 text-sage-600" />
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-charcoal">
                Questions Fréquentes
              </h1>
            </div>
            <p className="text-lg text-charcoal/70">
              Trouvez rapidement des réponses à vos questions sur la livraison, l'entretien des fleurs, la personnalisation et bien plus encore.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="space-y-8">
            {faqSections.map((section, sectionIndex) => (
              <Card key={sectionIndex} className="overflow-hidden border-sage-200">
                <div className={`${section.bgColor} p-6 border-b border-sage-200`}>
                  <div className="flex items-center gap-3">
                    <div className={`${section.color} bg-white rounded-full p-3`}>
                      <section.icon className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-charcoal">
                      {section.title}
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <Accordion type="single" collapsible className="w-full">
                    {section.questions.map((item, qIndex) => (
                      <AccordionItem key={qIndex} value={`item-${sectionIndex}-${qIndex}`}>
                        <AccordionTrigger className="text-left hover:text-sage-600">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-charcoal/70 leading-relaxed">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </Card>
            ))}
          </div>

          {/* Contact CTA */}
          <Card className="mt-12 bg-gradient-to-br from-sage-50 to-blush-50 border-sage-200">
            <div className="p-8 text-center">
              <h3 className="text-2xl font-serif font-bold text-charcoal mb-3">
                Vous ne trouvez pas votre réponse ?
              </h3>
              <p className="text-charcoal/70 mb-6 max-w-2xl mx-auto">
                Notre équipe est là pour vous aider ! Contactez-nous par email, téléphone ou via notre formulaire de contact.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/contact">Nous contacter</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="tel:+33123456789">+33 1 23 45 67 89</a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="mailto:contact@ananas-garden.fr">contact@ananas-garden.fr</a>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
