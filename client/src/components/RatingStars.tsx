import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export default function RatingStars({
  rating,
  count,
  size = "md",
  showCount = true,
  interactive = false,
  onRatingChange,
}: RatingStarsProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const handleClick = (newRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= Math.round(rating);
          const isPartial = star === Math.ceil(rating) && rating % 1 !== 0;

          return (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              onClick={() => handleClick(star)}
              className={cn(
                "relative transition-all",
                interactive && "cursor-pointer hover:scale-110",
                !interactive && "cursor-default"
              )}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  "transition-colors",
                  isFilled || isPartial
                    ? "fill-amber-400 text-amber-400"
                    : "fill-none text-sage-300"
                )}
              />
              {isPartial && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${(rating % 1) * 100}%` }}
                >
                  <Star
                    className={cn(
                      sizeClasses[size],
                      "fill-amber-400 text-amber-400"
                    )}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {showCount && count !== undefined && (
        <span className={cn("text-sage-600", textSizeClasses[size])}>
          ({count})
        </span>
      )}

      {showCount && count === undefined && rating > 0 && (
        <span className={cn("font-medium text-sage-900", textSizeClasses[size])}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
