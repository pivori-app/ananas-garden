import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Gift, TrendingUp, TrendingDown, Sparkles, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function LoyaltyPoints() {
  const [, setLocation] = useLocation();
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  const { data: loyaltyData, isLoading: pointsLoading } = trpc.loyalty.getPoints.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: transactions, isLoading: transactionsLoading } = trpc.loyalty.getTransactions.useQuery(
    { limit: 50 },
    { enabled: isAuthenticated }
  );

  if (authLoading || pointsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    setLocation("/");
    return null;
  }

  const points = loyaltyData?.points || 0;
  const totalEarned = loyaltyData?.totalEarned || 0;
  const totalSpent = loyaltyData?.totalSpent || 0;

  // Calcul du montant de réduction disponible (100 points = 10€)
  const discountAvailable = (points / 100) * 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-rose-50 py-12">
      <div className="container max-w-5xl">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        {/* Header avec solde de points */}
        <Card className="mb-8 overflow-hidden border-sage-200 bg-gradient-to-br from-sage-100 to-rose-100 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 font-serif text-3xl font-bold text-sage-900">
                Programme de Fidélité
              </h1>
              <p className="text-sage-700">
                Gagnez des points à chaque achat et profitez de réductions exclusives
              </p>
            </div>
            <Sparkles className="h-16 w-16 text-gold-500" />
          </div>

          <Separator className="my-6 bg-sage-300" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-white/80 p-6 text-center backdrop-blur">
              <Gift className="mx-auto mb-2 h-8 w-8 text-sage-600" />
              <p className="mb-1 text-sm text-sage-600">Points disponibles</p>
              <p className="font-serif text-4xl font-bold text-sage-900">{points}</p>
              <p className="mt-2 text-xs text-sage-500">
                ≈ {discountAvailable.toFixed(2)} € de réduction
              </p>
            </div>

            <div className="rounded-lg bg-white/80 p-6 text-center backdrop-blur">
              <TrendingUp className="mx-auto mb-2 h-8 w-8 text-green-600" />
              <p className="mb-1 text-sm text-sage-600">Total gagné</p>
              <p className="font-serif text-4xl font-bold text-green-700">{totalEarned}</p>
            </div>

            <div className="rounded-lg bg-white/80 p-6 text-center backdrop-blur">
              <TrendingDown className="mx-auto mb-2 h-8 w-8 text-rose-600" />
              <p className="mb-1 text-sm text-sage-600">Total dépensé</p>
              <p className="font-serif text-4xl font-bold text-rose-700">{totalSpent}</p>
            </div>
          </div>
        </Card>

        {/* Comment ça marche */}
        <Card className="mb-8 border-sage-200 p-6">
          <h2 className="mb-4 font-serif text-2xl font-bold text-sage-900">
            Comment ça marche ?
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-sage-100 font-bold text-sage-700">
                1
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-sage-900">Achetez</h3>
                <p className="text-sm text-sage-600">
                  Gagnez 1 point pour chaque euro dépensé
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-rose-100 font-bold text-rose-700">
                2
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-sage-900">Cumulez</h3>
                <p className="text-sm text-sage-600">
                  Vos points n'expirent jamais
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gold-100 font-bold text-gold-700">
                3
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-sage-900">Profitez</h3>
                <p className="text-sm text-sage-600">
                  100 points = 10€ de réduction
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Historique des transactions */}
        <Card className="border-sage-200 p-6">
          <h2 className="mb-4 font-serif text-2xl font-bold text-sage-900">
            Historique des points
          </h2>

          {transactionsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-sage-600" />
            </div>
          ) : !transactions || transactions.length === 0 ? (
            <p className="py-8 text-center text-sage-500">
              Aucune transaction pour le moment. Passez votre première commande pour gagner des points !
            </p>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between rounded-lg border border-sage-100 p-4 transition-colors hover:bg-sage-50"
                >
                  <div className="flex items-center gap-3">
                    {transaction.type === "earned" || transaction.type === "bonus" ? (
                      <div className="rounded-full bg-green-100 p-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                    ) : (
                      <div className="rounded-full bg-rose-100 p-2">
                        <TrendingDown className="h-5 w-5 text-rose-600" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-sage-900">{transaction.description}</p>
                      <p className="text-sm text-sage-500">
                        {new Date(transaction.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-serif text-xl font-bold ${
                        transaction.points > 0 ? "text-green-700" : "text-rose-700"
                      }`}
                    >
                      {transaction.points > 0 ? "+" : ""}
                      {transaction.points}
                    </p>
                    <Badge
                      variant="outline"
                      className={
                        transaction.type === "earned"
                          ? "border-green-300 text-green-700"
                          : transaction.type === "bonus"
                          ? "border-gold-300 text-gold-700"
                          : "border-rose-300 text-rose-700"
                      }
                    >
                      {transaction.type === "earned"
                        ? "Gagné"
                        : transaction.type === "bonus"
                        ? "Bonus"
                        : "Dépensé"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
