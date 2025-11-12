import { Button } from "@/components/ui/button";
import { Facebook, Twitter, MessageCircle, Link2, Check } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface SocialShareButtonsProps {
  title: string;
  text: string;
  url?: string;
}

export default function SocialShareButtons({ title, text, url }: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  
  // URL par défaut: URL actuelle
  const shareUrl = url || window.location.href;
  
  // Encoder les paramètres pour les URLs
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(text);

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Lien copié dans le presse-papiers !");
      
      // Réinitialiser l'icône après 2 secondes
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      toast.error("Erreur lors de la copie du lien");
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleFacebookShare}
        className="gap-2"
      >
        <Facebook className="h-4 w-4 text-[#1877F2]" />
        Facebook
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleTwitterShare}
        className="gap-2"
      >
        <Twitter className="h-4 w-4 text-[#1DA1F2]" />
        Twitter
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleWhatsAppShare}
        className="gap-2"
      >
        <MessageCircle className="h-4 w-4 text-[#25D366]" />
        WhatsApp
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        className="gap-2"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-green-600" />
            Copié !
          </>
        ) : (
          <>
            <Link2 className="h-4 w-4" />
            Copier le lien
          </>
        )}
      </Button>
    </div>
  );
}
