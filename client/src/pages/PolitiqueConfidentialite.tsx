import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function PolitiqueConfidentialite() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-rose-50 py-12">
      <div className="container max-w-4xl">
        <Button variant="ghost" onClick={() => setLocation("/")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <Card className="border-sage-200 p-8 md:p-12">
          <h1 className="mb-8 font-serif text-4xl font-bold text-sage-900">
            Politique de Confidentialité
          </h1>

          <div className="prose prose-sage max-w-none space-y-6 text-sage-700">
            <p className="text-sm text-sage-500">
              Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
            </p>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-sage-900">1. Introduction</h2>
              <p>
                Ananas Garden accorde une grande importance à la protection de vos données personnelles. Cette politique de confidentialité explique quelles données nous collectons, comment nous les utilisons et quels sont vos droits.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-sage-900">2. Données collectées</h2>
              <p>
                Nous collectons les données suivantes :
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li><strong>Données d'identification :</strong> nom, prénom, adresse email, numéro de téléphone</li>
                <li><strong>Données de livraison :</strong> adresse de livraison, date de livraison souhaitée</li>
                <li><strong>Données de paiement :</strong> informations de carte bancaire (traitées de manière sécurisée par notre prestataire Stripe, nous ne stockons jamais ces données)</li>
                <li><strong>Données de navigation :</strong> adresse IP, type de navigateur, pages visitées, durée de visite</li>
                <li><strong>Données de commande :</strong> historique des achats, bouquets créés, messages personnalisés</li>
                <li><strong>Données du programme de fidélité :</strong> points accumulés, transactions de points</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-sage-900">3. Finalités du traitement</h2>
              <p>
                Vos données personnelles sont utilisées pour :
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Traiter et livrer vos commandes</li>
                <li>Gérer votre compte client et votre programme de fidélité</li>
                <li>Vous envoyer des confirmations de commande et des mises à jour de livraison</li>
                <li>Améliorer nos services et personnaliser votre expérience</li>
                <li>Réaliser des analyses statistiques</li>
                <li>Respecter nos obligations légales</li>
                <li>Prévenir la fraude et assurer la sécurité de notre plateforme</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-sage-900">4. Base légale du traitement</h2>
              <p>
                Le traitement de vos données repose sur :
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li><strong>L'exécution du contrat :</strong> pour traiter vos commandes</li>
                <li><strong>Votre consentement :</strong> pour l'envoi de communications marketing (vous pouvez le retirer à tout moment)</li>
                <li><strong>Notre intérêt légitime :</strong> pour améliorer nos services et prévenir la fraude</li>
                <li><strong>Nos obligations légales :</strong> pour la comptabilité et la fiscalité</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-sage-900">5. Durée de conservation</h2>
              <p>
                Vos données sont conservées pendant :
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li><strong>Données de compte :</strong> jusqu'à la suppression de votre compte + 3 ans</li>
                <li><strong>Données de commande :</strong> 10 ans (obligation comptable)</li>
                <li><strong>Données de paiement :</strong> 13 mois (lutte contre la fraude)</li>
                <li><strong>Données de navigation :</strong> 13 mois maximum</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-sage-900">6. Partage des données</h2>
              <p>
                Vos données peuvent être partagées avec :
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li><strong>Prestataires de paiement :</strong> Stripe (pour le traitement sécurisé des paiements)</li>
                <li><strong>Transporteurs :</strong> pour la livraison de vos commandes</li>
                <li><strong>Hébergeur :</strong> Manus Technologies (pour l'hébergement du site)</li>
                <li><strong>Autorités :</strong> si requis par la loi</li>
              </ul>
              <p>
                Nous ne vendons jamais vos données personnelles à des tiers.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-sage-900">7. Vos droits</h2>
              <p>
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
                <li><strong>Droit de rectification :</strong> corriger vos données inexactes</li>
                <li><strong>Droit à l'effacement :</strong> supprimer vos données (sous certaines conditions)</li>
                <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données</li>
                <li><strong>Droit à la portabilité :</strong> récupérer vos données dans un format structuré</li>
                <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
                <li><strong>Droit de retirer votre consentement :</strong> à tout moment</li>
              </ul>
              <p>
                Pour exercer ces droits, contactez-nous à : contact@ananas-garden.fr
              </p>
              <p>
                Vous pouvez également déposer une réclamation auprès de la CNIL (www.cnil.fr).
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-sage-900">8. Sécurité</h2>
              <p>
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre la perte, l'utilisation abusive, l'accès non autorisé, la divulgation, l'altération ou la destruction.
              </p>
              <p>
                Les paiements sont sécurisés via le protocole SSL et traités par Stripe, certifié PCI-DSS niveau 1.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-sage-900">9. Cookies</h2>
              <p>
                Nous utilisons des cookies pour améliorer votre expérience de navigation. Vous pouvez configurer votre navigateur pour refuser les cookies, mais certaines fonctionnalités du site pourraient ne plus être accessibles.
              </p>
              <p>
                Types de cookies utilisés :
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li><strong>Cookies essentiels :</strong> nécessaires au fonctionnement du site</li>
                <li><strong>Cookies de performance :</strong> pour analyser l'utilisation du site</li>
                <li><strong>Cookies fonctionnels :</strong> pour mémoriser vos préférences</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-sage-900">10. Modifications</h2>
              <p>
                Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications entreront en vigueur dès leur publication sur le site. Nous vous encourageons à consulter régulièrement cette page.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-sage-900">11. Contact</h2>
              <p>
                Pour toute question concernant cette politique de confidentialité ou le traitement de vos données personnelles, contactez-nous :
              </p>
              <ul className="list-none space-y-1">
                <li><strong>Email :</strong> contact@ananas-garden.fr</li>
                <li><strong>Téléphone :</strong> +33 1 23 45 67 89</li>
                <li><strong>Courrier :</strong> 123 Rue des Fleurs, 75001 Paris, France</li>
              </ul>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}
