import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function MentionsLegales() {
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
            Mentions Légales
          </h1>

          <div className="prose prose-sage max-w-none space-y-6 text-sage-700">
            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-sage-900">1. Éditeur du site</h2>
              <p>
                Le site ananas-garden.fr est édité par :
              </p>
              <ul className="list-none space-y-1">
                <li><strong>Raison sociale :</strong> Ananas Garden SARL</li>
                <li><strong>Siège social :</strong> 123 Rue des Fleurs, 75001 Paris, France</li>
                <li><strong>SIRET :</strong> 123 456 789 00012</li>
                <li><strong>Capital social :</strong> 10 000 €</li>
                <li><strong>Email :</strong> contact@ananas-garden.fr</li>
                <li><strong>Téléphone :</strong> +33 1 23 45 67 89</li>
                <li><strong>Directeur de la publication :</strong> Jean Dupont</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-sage-900">2. Hébergement</h2>
              <p>
                Le site est hébergé par :
              </p>
              <ul className="list-none space-y-1">
                <li><strong>Raison sociale :</strong> Manus Technologies</li>
                <li><strong>Adresse :</strong> Manus.im</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-sage-900">3. Propriété intellectuelle</h2>
              <p>
                L'ensemble du contenu de ce site (textes, images, vidéos, logos, icônes, etc.) est la propriété exclusive d'Ananas Garden, sauf mention contraire. Toute reproduction, distribution, modification, adaptation, retransmission ou publication de ces différents éléments est strictement interdite sans l'accord exprès par écrit d'Ananas Garden.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-sage-900">4. Données personnelles</h2>
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.
              </p>
              <p>
                Pour exercer ces droits, vous pouvez nous contacter à l'adresse : contact@ananas-garden.fr
              </p>
              <p>
                Pour plus d'informations, consultez notre <a href="/politique-confidentialite" className="text-sage-600 underline hover:text-sage-900">Politique de confidentialité</a>.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-sage-900">5. Cookies</h2>
              <p>
                Le site utilise des cookies pour améliorer l'expérience utilisateur et réaliser des statistiques de visite. Vous pouvez configurer votre navigateur pour refuser les cookies, mais certaines fonctionnalités du site pourraient ne plus être accessibles.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-sage-900">6. Limitation de responsabilité</h2>
              <p>
                Ananas Garden ne saurait être tenu responsable des dommages directs ou indirects résultant de l'accès au site ou de l'utilisation de celui-ci, notamment en cas d'interruption, de dysfonctionnement, de retard de transmission, de virus informatique ou de perte de données.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-sage-900">7. Droit applicable</h2>
              <p>
                Les présentes mentions légales sont régies par le droit français. En cas de litige et à défaut d'accord amiable, le litige sera porté devant les tribunaux français conformément aux règles de compétence en vigueur.
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}
