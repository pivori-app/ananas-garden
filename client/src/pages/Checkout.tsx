import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import PayPalButton from "@/components/PayPalButton";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('session_id') || '';
    }
    return '';
  });

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryAddress: '',
    deliveryDate: '',
    personalMessage: '',
    addVase: false
  });

  const { data: cartItems, isLoading: cartLoading } = trpc.cart.list.useQuery(
    { sessionId },
    { enabled: !!sessionId }
  );

  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
  const [showPayPal, setShowPayPal] = useState(false);

  const createOrder = trpc.orders.create.useMutation({
    onSuccess: async (data: any) => {
      toast.success("Commande créée ! Procédez au paiement...");
      setCreatedOrderId(data.orderId);
      setShowPayPal(true);
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la création de la commande");
    }
  });

  if (cartLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    setLocation("/cart");
    return null;
  }

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.bouquet?.totalPrice || 0) * item.quantity;
  }, 0) / 100;

  const vasePrice = formData.addVase ? 15 : 0;
  const deliveryFee = subtotal >= 50 ? 0 : 7.5;
  const totalPrice = subtotal + vasePrice + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName || !formData.customerEmail || !formData.deliveryAddress) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const items = cartItems.map(item => ({
      bouquetId: item.bouquetId,
      quantity: item.quantity
    }));

    createOrder.mutate({
      ...formData,
      items,
      sessionId
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12">
      <div className="container max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => setLocation("/cart")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au panier
        </Button>

        <h1 className="mb-8 text-4xl font-bold">Finaliser la commande</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Checkout form */}
            <div className="space-y-6 lg:col-span-2">
              {/* Contact information */}
              <Card className="p-6">
                <h2 className="mb-6 text-xl font-bold">Informations de contact</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="Jean Dupont"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      placeholder="jean.dupont@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                </div>
              </Card>

              {/* Delivery information */}
              <Card className="p-6">
                <h2 className="mb-6 text-xl font-bold">Informations de livraison</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Adresse de livraison *</Label>
                    <Textarea
                      id="address"
                      required
                      value={formData.deliveryAddress}
                      onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                      placeholder="123 Rue de la Paix, 75001 Paris"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="deliveryDate">Date de livraison souhaitée</Label>
                    <Input
                      id="deliveryDate"
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message personnalisé (optionnel)</Label>
                    <Textarea
                      id="message"
                      value={formData.personalMessage}
                      onChange={(e) => setFormData({ ...formData, personalMessage: e.target.value })}
                      placeholder="Ajoutez un message qui accompagnera votre bouquet..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </Card>

              {/* Options */}
              <Card className="p-6">
                <h2 className="mb-6 text-xl font-bold">Options supplémentaires</h2>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="vase"
                    checked={formData.addVase}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, addVase: checked as boolean })
                    }
                  />
                  <div className="flex-1">
                    <Label htmlFor="vase" className="cursor-pointer font-medium">
                      Ajouter un vase élégant (+15€)
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Un vase en verre de qualité pour mettre en valeur votre bouquet
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6 p-6">
                <h2 className="mb-6 text-xl font-bold">Récapitulatif</h2>

                {/* Cart items summary */}
                <div className="mb-4 space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Bouquet × {item.quantity}
                      </span>
                      <span className="font-medium">
                        {((item.bouquet?.totalPrice || 0) * item.quantity / 100).toFixed(2)} €
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Price breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span className="font-medium">{subtotal.toFixed(2)} €</span>
                  </div>

                  {formData.addVase && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Vase</span>
                      <span className="font-medium">{vasePrice.toFixed(2)} €</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Livraison</span>
                    <span className="font-medium">
                      {deliveryFee === 0 ? (
                        <span className="text-primary">Gratuite</span>
                      ) : (
                        `${deliveryFee.toFixed(2)} €`
                      )}
                    </span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="mb-6 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{totalPrice.toFixed(2)} €</span>
                </div>

                {!showPayPal ? (
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-14 text-lg"
                    disabled={createOrder.isPending}
                  >
                    {createOrder.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Traitement...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        Confirmer la commande
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 text-green-700 rounded-lg text-center">
                      <CheckCircle2 className="mx-auto h-8 w-8 mb-2" />
                      <p className="font-medium">Commande créée !</p>
                      <p className="text-sm">Procédez au paiement avec PayPal</p>
                    </div>
                    {createdOrderId && (
                      <PayPalButton
                        orderId={createdOrderId}
                        amount={totalPrice.toFixed(2)}
                        currency="EUR"
                        onSuccess={(paypalOrderId) => {
                          toast.success("🎉 Paiement réussi !");
                          setTimeout(() => {
                            setLocation(`/order-confirmation?orderId=${createdOrderId}`);
                          }, 1500);
                        }}
                        onError={(error) => {
                          console.error("Erreur PayPal:", error);
                        }}
                      />
                    )}
                  </div>
                )}

                {subtotal < 50 && (
                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    Ajoutez {(50 - subtotal).toFixed(2)} € pour la livraison gratuite
                  </p>
                )}
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
