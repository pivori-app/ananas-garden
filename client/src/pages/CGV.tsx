import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function CGV() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-rose-50 py-12">
      <div className="container max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <Card className="border-sage-200 p-8 md:p-12">
          <h1 className="mb-8 font-serif text-4xl font-bold text-sage-900">
            Conditions Générales de Vente
          </h1>

          <div className="prose prose-sage max-w-none space-y-6 text-sage-700">
            <p className="text-sm text-sage-500">
              Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
            </p>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-sage-900">1. Objet</h2>
              <p>
                Les présentes conditions générales de vente (CGV) régissent les relations contractuelles entre Ananas Garden, ci-après dénommé "le Vendeur", et toute personne physique ou morale, ci-après dénommée "le Client", souhaitant effectuer un achat via le site internet ananas-garden.fr.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-sage-900">2. Produits et Services</h2>
              <p>
                Ananas Garden propose à la vente des bouquets de fleurs personnalisés, créés selon les émotions et messages exprimés par le Client. Chaque bouquet est composé de fleurs fraîches sélectionnées pour leur symbolisme et leur qualité.
              </p>
              <p>
                Les photographies et descriptions des produits présentés sur le site sont les plus fidèles possibles, mais ne peuvent assurer une similitude parfaite avec le produit livré, notamment en raison de la nature vivante des fleurs.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-sage-900">3. Prix</h2>
              <p>
                Les prix de nos produits sont indiqués en euros toutes taxes comprises (TTC). Le Vendeur se réserve le droit de modifier ses prix à tout moment, étant toutefois entendu que le prix figurant au catalogue le jour de la commande sera le seul applicable au Client.
              </p>
              <p>
                Les frais de livraison sont offerts pour toute commande supérieure à 50€. En dessous de ce montant, des frais de livraison de 7,50€ s'appliquent.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-sage-900">4. Commande</h2>
              <p>
                Le Client passe commande sur le site internet en suivant le processus de commande en ligne. La vente ne sera considérée comme définitive qu'après l'envoi au Client de la confirmation de l'acceptation de la commande par le Vendeur par courrier électronique et après encaissement par celui-ci de l'intégralité du prix.
              </p>
              <p>
                Toute commande vaut acceptation des prix et descriptions des produits disponibles à la vente. Toute contestation sur ce point interviendra dans le cadre d'un éventuel échange et des garanties ci-dessous mentionnées.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-sage-900">5. Paiement</h2>
              <p>
                Le paiement s'effectue en ligne par carte bancaire via notre prestataire de paiement sécurisé Stripe. Les informations de paiement sont cryptées et ne sont jamais stockées sur nos serveurs.
              </p>
              <p>
                Les cartes bancaires acceptées sont : Visa, Mastercard, American Express.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-sage-900">6. Livraison</h2>
              <p>
                Les bouquets sont livrés à l'adresse indiquée par le Client lors de la commande. Les délais de livraison sont généralement de 24 à 48 heures ouvrées à compter de la validation de la commande, selon la disponibilité des fleurs et la zone géographique.
              </p>
              <p>
                En cas d'absence du destinataire, le livreur laissera un avis de passage. Le bouquet sera alors conservé 48 heures en point relais. Passé ce délai, le bouquet sera considéré comme refusé et aucun remboursement ne sera effectué.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-sage-900">7. Droit de rétractation</h2>
              <p>
                Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne peut être exercé pour les contrats de fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés, ainsi que pour les biens susceptibles de se détériorer ou de se périmer rapidement.
              </p>
              <p>
                Les bouquets de fleurs étant des produits personnalisés et périssables, aucun droit de rétractation ne peut être exercé.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-sage-900">8. Garanties</h2>
              <p>
                Tous nos produits bénéficient de la garantie légale de conformité et de la garantie des vices cachés, prévues par les articles 1641 et suivants du Code civil. En cas de non-conformité d'un produit vendu, il pourra être retourné, échangé ou remboursé.
              </p>
              <p>
                Toute réclamation doit être effectuée dans les 24 heures suivant la réception du bouquet, accompagnée de photographies.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-sage-900">9. Programme de fidélité</h2>
              <p>
                Ananas Garden propose un programme de fidélité permettant aux Clients de cumuler des points à chaque achat (1 point par euro dépensé). Ces points peuvent être utilisés pour obtenir des réductions sur les commandes futures (100 points = 10€ de réduction).
              </p>
              <p>
                Les points n'ont pas de date d'expiration et sont attachés au compte utilisateur. Ils ne sont ni transférables ni échangeables contre de l'argent.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-sage-900">10. Données personnelles</h2>
              <p>
                Les informations recueillies font l'objet d'un traitement informatique destiné à la gestion des commandes et de la relation client. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant.
              </p>
              <p>
                Pour plus d'informations, consultez notre <a href="/politique-confidentialite" className="text-sage-600 underline hover:text-sage-900">Politique de confidentialité</a>.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-sage-900">11. Propriété intellectuelle</h2>
              <p>
                Tous les éléments du site ananas-garden.fr sont et restent la propriété intellectuelle et exclusive du Vendeur. Personne n'est autorisé à reproduire, exploiter, rediffuser, ou utiliser à quelque titre que ce soit, même partiellement, des éléments du site qu'ils soient logiciels, visuels ou sonores.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-sage-900">12. Droit applicable et juridiction compétente</h2>
              <p>
                Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. À défaut, les tribunaux français seront seuls compétents.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-bold text-sage-900">13. Contact</h2>
              <p>
                Pour toute question relative aux présentes CGV, vous pouvez nous contacter :
              </p>
              <ul className="list-inside list-disc space-y-1">
                <li>Par email : contact@ananas-garden.fr</li>
                <li>Par téléphone : +33 1 23 45 67 89</li>
                <li>Par courrier : 123 Rue des Fleurs, 75001 Paris, France</li>
              </ul>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}
