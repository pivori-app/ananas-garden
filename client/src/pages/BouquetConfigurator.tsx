import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Plus, Minus, Sparkles, Save } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

interface SelectedFlower {
  flowerId: number;
  name: string;
  price: number;
  quantity: number;
  emotions: string;
  colors: string;
}

export default function BouquetConfigurator() {
  const [, setLocation] = useLocation();
  const [selectedFlowers, setSelectedFlowers] = useState<SelectedFlower[]>([]);
  const [bouquetName, setBouquetName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: flowers } = trpc.flowers.list.useQuery();
  const createBouquetMutation = trpc.bouquet.generate.useMutation({
    onSuccess: (data: { bouquetId: number }) => {
      toast.success("Bouquet personnalisé créé !");
      setLocation(`/bouquet/${data.bouquetId}`);
    },
  });

  const filteredFlowers = flowers?.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addFlower = (flower: any) => {
    const existing = selectedFlowers.find((f) => f.flowerId === flower.id);
    if (existing) {
      setSelectedFlowers(
        selectedFlowers.map((f) =>
          f.flowerId === flower.id ? { ...f, quantity: f.quantity + 1 } : f
        )
      );
    } else {
      setSelectedFlowers([
        ...selectedFlowers,
        {
          flowerId: flower.id,
          name: flower.name,
          price: flower.pricePerStem,
          quantity: 1,
          emotions: flower.emotions,
          colors: flower.colors,
        },
      ]);
    }
    toast.success(`${flower.name} ajoutée au bouquet`);
  };

  const removeFlower = (flowerId: number) => {
    const existing = selectedFlowers.find((f) => f.flowerId === flowerId);
    if (existing && existing.quantity > 1) {
      setSelectedFlowers(
        selectedFlowers.map((f) =>
          f.flowerId === flowerId ? { ...f, quantity: f.quantity - 1 } : f
        )
      );
    } else {
      setSelectedFlowers(selectedFlowers.filter((f) => f.flowerId !== flowerId));
    }
  };

  const totalPrice = selectedFlowers.reduce(
    (sum, f) => sum + f.price * f.quantity,
    0
  );
  const totalFlowers = selectedFlowers.reduce((sum, f) => sum + f.quantity, 0);

  const handleSaveBouquet = () => {
    if (!bouquetName.trim()) {
      toast.error("Veuillez donner un nom à votre bouquet");
      return;
    }
    if (selectedFlowers.length === 0) {
      toast.error("Veuillez ajouter au moins une fleur");
      return;
    }

    const message = `Bouquet personnalisé : ${selectedFlowers.map((f) => `${f.quantity}x ${f.name}`).join(", ")}`;
    
    const budgetCategory = totalPrice < 50 ? "economique" : totalPrice < 100 ? "standard" : "premium";
    
    createBouquetMutation.mutate({
      message,
      occasion: "personnalisé",
      budget: budgetCategory,
      dominantColors: selectedFlowers.map((f) => f.colors.split(",")[0].trim()).filter((c, i, arr) => arr.indexOf(c) === i),
      style: "moderne",
    });
  };

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="container max-w-7xl">
        <div className="mb-8">
          <h1 className="font-display text-4xl text-charcoal mb-2">
            Configurateur de Bouquet
          </h1>
          <p className="text-charcoal/70">
            Composez votre bouquet unique fleur par fleur
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Catalogue de fleurs */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <Label htmlFor="search">Rechercher une fleur</Label>
                  <Input
                    id="search"
                    placeholder="Rose, Tulipe, Lys..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredFlowers?.map((flower) => (
                    <Card
                      key={flower.id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => addFlower(flower)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-charcoal">
                              {flower.name}
                            </h3>
                            <p className="text-sm text-charcoal/70 line-clamp-2 mt-1">
                              {flower.symbolism}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {flower.emotions.split(",").slice(0, 3).map((emotion, i) => (
                                <span
                                  key={i}
                                  className="text-xs bg-sage/20 text-sage px-2 py-1 rounded-full"
                                >
                                  {emotion.trim()}
                                </span>
                              ))}
                            </div>
                            <p className="text-lg font-bold text-sage mt-2">
                              {flower.pricePerStem.toFixed(2)} €
                            </p>
                          </div>
                          <Button size="icon" variant="ghost">
                            <Plus className="w-5 h-5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Aperçu du bouquet */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-sage" />
                  <h2 className="font-semibold text-xl text-charcoal">
                    Votre Bouquet
                  </h2>
                </div>

                <div className="mb-4">
                  <Label htmlFor="bouquet-name">Nom du bouquet</Label>
                  <Input
                    id="bouquet-name"
                    placeholder="Mon bouquet personnalisé"
                    value={bouquetName}
                    onChange={(e) => setBouquetName(e.target.value)}
                  />
                </div>

                {selectedFlowers.length > 0 ? (
                  <div className="space-y-3 mb-4">
                    {selectedFlowers.map((flower) => (
                      <div
                        key={flower.flowerId}
                        className="flex items-center justify-between bg-cream p-3 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-charcoal">{flower.name}</p>
                          <p className="text-sm text-charcoal/70">
                            {flower.price.toFixed(2)} € × {flower.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => removeFlower(flower.flowerId)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center font-semibold">
                            {flower.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => addFlower({ id: flower.flowerId, ...flower })}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-charcoal/50">
                    <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p>Aucune fleur sélectionnée</p>
                    <p className="text-sm">Cliquez sur une fleur pour l'ajouter</p>
                  </div>
                )}

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal/70">Nombre de fleurs</span>
                    <span className="font-semibold">{totalFlowers}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-sage">{totalPrice.toFixed(2)} €</span>
                  </div>
                </div>

                <Button
                  className="w-full mt-4"
                  onClick={handleSaveBouquet}
                  disabled={selectedFlowers.length === 0 || createBouquetMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {createBouquetMutation.isPending ? "Création..." : "Créer mon bouquet"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
