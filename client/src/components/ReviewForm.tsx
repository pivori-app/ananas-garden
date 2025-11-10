import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Star, Upload, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { storagePut } from "../../../server/storage";

interface ReviewFormProps {
  onSuccess?: () => void;
}

export default function ReviewForm({ onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [bouquetName, setBouquetName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const submitReview = trpc.testimonials.create.useMutation({
    onSuccess: () => {
      toast.success("Merci pour votre avis ! Il sera publié après modération.");
      setRating(5);
      setComment("");
      setBouquetName("");
      setImageFile(null);
      setImagePreview(null);
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de l'envoi de l'avis");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 5 MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("Veuillez écrire un commentaire");
      return;
    }

    setUploading(true);

    try {
      let imageUrl: string | undefined;

      // Upload image if provided
      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        
        // In a real implementation, you would upload to S3 here
        // For now, we'll use a placeholder
        toast.info("Upload d'image non implémenté dans cette démo");
        imageUrl = undefined;
      }

      submitReview.mutate({
        rating,
        comment: comment.trim(),
        bouquetName: bouquetName.trim() || undefined,
        imageUrl,
      });
    } catch (error) {
      toast.error("Erreur lors de l'upload de l'image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Laisser un avis</CardTitle>
        <CardDescription>
          Partagez votre expérience avec notre communauté
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-2">
            <Label>Note</Label>
            <div className="flex gap-2">
              {Array.from({ length: 5 }, (_, i) => i + 1).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      value <= (hoverRating || rating)
                        ? "fill-[#D4AF37] text-[#D4AF37]"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Bouquet Name */}
          <div className="space-y-2">
            <Label htmlFor="bouquetName">Nom du bouquet (optionnel)</Label>
            <Input
              id="bouquetName"
              value={bouquetName}
              onChange={(e) => setBouquetName(e.target.value)}
              placeholder="Ex: Bouquet Romantique"
            />
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Votre avis *</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre expérience avec ce bouquet..."
              rows={5}
              required
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Photo du bouquet (optionnel)</Label>
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-w-xs rounded-lg object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#8B9D83] transition-colors cursor-pointer">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Cliquez pour ajouter une photo
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG jusqu'à 5 MB
                  </p>
                </label>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-[#8B9D83] hover:bg-[#7A8A72]"
            disabled={submitReview.isPending || uploading}
          >
            {submitReview.isPending || uploading ? (
              <>
                <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              "Publier mon avis"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
