/**
 * Produits et prix pour Ananas Garden
 * Les bouquets sont créés dynamiquement, donc nous n'avons pas besoin de produits prédéfinis
 * Nous créons les produits Stripe à la volée lors du checkout
 */

export interface BouquetProduct {
  name: string;
  description: string;
  amount: number; // en centimes
  currency: string;
}

export function createBouquetProduct(bouquet: {
  id: number;
  occasion?: string | null;
  explanation: string;
  totalPrice: number;
}): BouquetProduct {
  return {
    name: bouquet.occasion || `Bouquet personnalisé #${bouquet.id}`,
    description: bouquet.explanation.substring(0, 500), // Stripe limite à 500 caractères
    amount: bouquet.totalPrice,
    currency: "eur",
  };
}
