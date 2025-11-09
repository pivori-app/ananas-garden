import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, Home, Mail } from "lucide-react";

export default function OrderConfirmation() {
  const [, params] = useRoute("/order-confirmation/:id");
  const [, setLocation] = useLocation();
  const orderId = params?.id ? parseInt(params.id) : 0;

  const { data: order, isLoading, error } = trpc.order.getById.useQuery(
    { id: orderId },
    { enabled: orderId > 0 }
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold">Commande non trouvée</h2>
          <Button onClick={() => setLocation("/")}>
            Retour à l'accueil
          </Button>
        </Card>
      </div>
    );
  }

  const totalPrice = order.totalPrice / 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12">
      <div className="container max-w-4xl">
        {/* Success message */}
        <Card className="mb-8 bg-gradient-to-br from-primary/5 to-secondary/5 p-8 text-center">
          <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-12 w-12 text-primary" />
          </div>
          
          <h1 className="mb-2 text-3xl font-bold">Commande confirmée !</h1>
          <p className="mb-6 text-lg text-muted-foreground">
            Merci pour votre commande. Nous avons bien reçu votre demande.
          </p>
          
          <div className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3">
            <span className="text-sm text-muted-foreground">Numéro de commande :</span>
            <span className="text-lg font-bold text-primary">#{order.id}</span>
          </div>
        </Card>

        {/* Order details */}
        <Card className="mb-6 p-8">
          <h2 className="mb-6 text-2xl font-bold">Détails de la commande</h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Customer info */}
            <div>
              <h3 className="mb-3 font-semibold text-muted-foreground">
                Informations client
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">{order.customerName}</span>
                </p>
                <p className="text-muted-foreground">{order.customerEmail}</p>
                {order.customerPhone && (
                  <p className="text-muted-foreground">{order.customerPhone}</p>
                )}
              </div>
            </div>

            {/* Delivery info */}
            <div>
              <h3 className="mb-3 font-semibold text-muted-foreground">
                Livraison
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground whitespace-pre-line">
                  {order.deliveryAddress}
                </p>
                {order.deliveryDate && (
                  <p className="text-muted-foreground">
                    Date souhaitée : {new Date(order.deliveryDate).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {order.personalMessage && (
            <>
              <Separator className="my-6" />
              <div>
                <h3 className="mb-3 font-semibold text-muted-foreground">
                  Message personnalisé
                </h3>
                <p className="italic text-muted-foreground">
                  "{order.personalMessage}"
                </p>
              </div>
            </>
          )}

          <Separator className="my-6" />

          {/* Price summary */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Statut</span>
              <Badge variant="secondary" className="capitalize">
                {order.status === 'pending' ? 'En attente' : order.status}
              </Badge>
            </div>

            {order.addVase === 1 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Vase inclus</span>
                <span className="font-medium">{(order.vasePrice / 100).toFixed(2)} €</span>
              </div>
            )}

            <div className="flex justify-between text-lg font-bold">
              <span>Total payé</span>
              <span className="text-primary">{totalPrice.toFixed(2)} €</span>
            </div>
          </div>
        </Card>

        {/* Next steps */}
        <Card className="mb-6 p-6">
          <h3 className="mb-4 text-lg font-semibold">Prochaines étapes</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <p>
                Un email de confirmation a été envoyé à <strong>{order.customerEmail}</strong>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <p>
                Votre commande sera préparée avec soin et livrée à l'adresse indiquée
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <p>
                Vous recevrez un email de suivi lorsque votre bouquet sera en route
              </p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            onClick={() => setLocation("/")}
            className="sm:w-auto"
          >
            <Home className="mr-2 h-5 w-5" />
            Retour à l'accueil
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => setLocation("/create")}
            className="sm:w-auto"
          >
            Créer un autre bouquet
          </Button>
        </div>
      </div>
    </div>
  );
}
