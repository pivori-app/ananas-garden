import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  bouquetId: number;
  variant?: "default" | "icon";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function WishlistButton({ 
  bouquetId, 
  variant = "icon",
  size = "icon",
  className 
}: WishlistButtonProps) {
  const { user, isAuthenticated } = useAuth();
  const [isAnimating, setIsAnimating] = useState(false);

  // Check if bouquet is in wishlist
  const { data: isInWishlist, refetch } = trpc.wishlist.check.useQuery(
    { bouquetId },
    { enabled: isAuthenticated }
  );

  // Add to wishlist mutation
  const addMutation = trpc.wishlist.add.useMutation({
    onSuccess: () => {
      toast.success("Ajouté à la liste de souhaits ❤️");
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de l'ajout");
    },
  });

  // Remove from wishlist mutation
  const removeMutation = trpc.wishlist.remove.useMutation({
    onSuccess: () => {
      toast.success("Retiré de la liste de souhaits");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la suppression");
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      toast.info("Connectez-vous pour ajouter à votre liste de souhaits");
      window.location.href = getLoginUrl();
      return;
    }

    // Toggle wishlist status
    if (isInWishlist) {
      removeMutation.mutate({ bouquetId });
    } else {
      addMutation.mutate({ bouquetId });
    }
  };

  const isPending = addMutation.isPending || removeMutation.isPending;

  if (variant === "default") {
    return (
      <Button
        variant={isInWishlist ? "default" : "outline"}
        size={size}
        onClick={handleClick}
        disabled={isPending}
        className={cn(
          "gap-2 transition-all",
          isInWishlist && "bg-rose-500 hover:bg-rose-600",
          isAnimating && "scale-110",
          className
        )}
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-all",
            isInWishlist && "fill-current",
            isAnimating && "animate-ping"
          )}
        />
        {isInWishlist ? "Dans ma liste" : "Ajouter à ma liste"}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "relative transition-all hover:scale-110",
        isAnimating && "scale-125",
        className
      )}
      title={isInWishlist ? "Retirer de la liste de souhaits" : "Ajouter à la liste de souhaits"}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-all",
          isInWishlist ? "fill-rose-500 text-rose-500" : "text-charcoal/60 hover:text-rose-500",
          isAnimating && "animate-bounce"
        )}
      />
      {isInWishlist && (
        <span className="absolute -top-1 -right-1 h-2 w-2 bg-rose-500 rounded-full animate-pulse" />
      )}
    </Button>
  );
}
