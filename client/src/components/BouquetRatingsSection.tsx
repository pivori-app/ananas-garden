import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import RatingStars from "./RatingStars";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

interface BouquetRatingsSectionProps {
  bouquetId: number;
}

export default function BouquetRatingsSection({ bouquetId }: BouquetRatingsSectionProps) {
  const { isAuthenticated } = useAuth();
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);

  const utils = trpc.useUtils();

  // Récupérer la note moyenne
  const { data: averageData } = trpc.bouquetRatings.getAverage.useQuery({ bouquetId });

  // Récupérer toutes les notes
  const { data: ratings, isLoading } = trpc.bouquetRatings.list.useQuery({ bouquetId });

  // Récupérer la note de l'utilisateur connecté
  const { data: userRating } = trpc.bouquetRatings.getUserRating.useQuery(
    { bouquetId },
    { enabled: isAuthenticated }
  );

  // Mutation pour ajouter une note
  const addRating = trpc.bouquetRatings.add.useMutation({
    onSuccess: (data) => {
      toast.success(
        data.isVerified
          ? "Merci pour votre avis vérifié !"
          : "Merci pour votre avis !"
      );
      setShowForm(false);
      setSelectedRating(0);
      setComment("");
      utils.bouquetRatings.list.invalidate({ bouquetId });
      utils.bouquetRatings.getAverage.invalidate({ bouquetId });
      utils.bouquetRatings.getUserRating.invalidate({ bouquetId });
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de l'ajout de la note");
    },
  });

  const handleSubmit = () => {
    if (selectedRating === 0) {
      toast.error("Veuillez sélectionner une note");
      return;
    }

    addRating.mutate({
      bouquetId,
      rating: selectedRating,
      comment: comment.trim() || undefined,
    });
  };

  const handleRatingClick = () => {
    if (!isAuthenticated) {
      toast.info("Connectez-vous pour noter ce bouquet");
      window.location.href = getLoginUrl();
      return;
    }
    setShowForm(true);
  };

  return (
    <Card className="p-6">
      <h3 className="mb-6 text-2xl font-bold">Notes et avis</h3>

      {/* Note moyenne */}
      {averageData && averageData.count > 0 && (
        <div className="mb-6 flex items-center gap-6 rounded-lg bg-gradient-to-br from-amber-50 to-rose-50 p-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-amber-600">
              {averageData.average.toFixed(1)}
            </div>
            <div className="mt-2">
              <RatingStars rating={averageData.average} showCount={false} size="lg" />
            </div>
            <div className="mt-2 text-sm text-sage-600">
              {averageData.count} avis
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-sage-700">
              {averageData.average >= 4.5
                ? "Excellent ! Ce bouquet est très apprécié par nos clients."
                : averageData.average >= 4
                ? "Très bon choix ! Les clients sont satisfaits."
                : averageData.average >= 3
                ? "Bon bouquet avec des avis positifs."
                : "Quelques avis mitigés, consultez les commentaires."}
            </p>
          </div>
        </div>
      )}

      {/* Formulaire de notation */}
      {isAuthenticated && !userRating && !showForm && (
        <Button onClick={handleRatingClick} variant="outline" className="mb-6 w-full">
          Noter ce bouquet
        </Button>
      )}

      {isAuthenticated && userRating && (
        <div className="mb-6 rounded-lg border border-sage-200 bg-sage-50 p-4">
          <div className="flex items-center gap-2 text-sm text-sage-700">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span>Vous avez déjà noté ce bouquet</span>
            {userRating.isVerified === 1 && (
              <Badge variant="secondary" className="ml-auto">
                Achat vérifié
              </Badge>
            )}
          </div>
          <div className="mt-2">
            <RatingStars rating={userRating.rating} showCount={false} />
          </div>
          {userRating.comment && (
            <p className="mt-2 text-sm text-sage-600">{userRating.comment}</p>
          )}
        </div>
      )}

      {showForm && (
        <div className="mb-6 space-y-4 rounded-lg border border-sage-200 bg-white p-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Votre note</label>
            <RatingStars
              rating={selectedRating}
              interactive
              onRatingChange={setSelectedRating}
              showCount={false}
              size="lg"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Votre commentaire (optionnel)
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre expérience avec ce bouquet..."
              rows={4}
              maxLength={500}
            />
            <p className="mt-1 text-xs text-sage-500">
              {comment.length}/500 caractères
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={addRating.isPending || selectedRating === 0}
              className="flex-1"
            >
              {addRating.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi...
                </>
              ) : (
                "Publier mon avis"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setSelectedRating(0);
                setComment("");
              }}
            >
              Annuler
            </Button>
          </div>
        </div>
      )}

      {/* Liste des avis */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : ratings && ratings.length > 0 ? (
        <div className="space-y-4">
          {ratings.map((rating) => (
            <div
              key={rating.id}
              className="rounded-lg border border-sage-100 bg-white p-4"
            >
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sage-900">
                      {rating.user?.name || "Utilisateur"}
                    </span>
                    {rating.isVerified === 1 && (
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Achat vérifié
                      </Badge>
                    )}
                  </div>
                  <RatingStars rating={rating.rating} showCount={false} size="sm" />
                </div>
                <span className="text-xs text-sage-500">
                  {new Date(rating.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
              {rating.comment && (
                <p className="text-sm text-sage-700">{rating.comment}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-sage-600">
          <p>Aucun avis pour ce bouquet pour le moment.</p>
          <p className="mt-2 text-sm">
            Soyez le premier à partager votre expérience !
          </p>
        </div>
      )}
    </Card>
  );
}
