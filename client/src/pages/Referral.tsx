import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Share2, Gift, Users, TrendingUp, Loader2, Facebook, Twitter, Mail, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";


export default function Referral() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [copied, setCopied] = useState(false);

  const { data: referralCode, isLoading: codeLoading } = trpc.referral.getMyCode.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: stats, isLoading: statsLoading } = trpc.referral.getStats.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: referrals, isLoading: referralsLoading } = trpc.referral.getMyReferrals.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const handleCopyCode = () => {
    if (referralCode?.referralCode) {
      navigator.clipboard.writeText(referralCode.referralCode);
      setCopied(true);
      toast.success("Code copié dans le presse-papiers !");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareUrl = `${window.location.origin}?ref=${referralCode?.referralCode || ""}`;

  const handleShare = (platform: string) => {
    const message = `Découvrez Ananas Garden, créez des bouquets personnalisés qui parlent le langage des fleurs ! Utilisez mon code ${referralCode?.referralCode} pour bénéficier d'avantages.`;
    
    let url = "";
    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "email":
        url = `mailto:?subject=${encodeURIComponent("Découvrez Ananas Garden")}&body=${encodeURIComponent(message + "\n\n" + shareUrl)}`;
        break;
    }
    
    if (url) {
      window.open(url, "_blank", "width=600,height=400");
    }
  };

  if (loading || codeLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FAF9F6] to-white">
        <main className="flex-1 flex items-center justify-center pt-24">
          <Loader2 className="w-8 h-8 animate-spin text-[#8B9D83]" />
        </main>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FAF9F6] to-white">
        <main className="flex-1 flex items-center justify-center pt-24">
          <Card className="max-w-md mx-4">
            <CardHeader>
              <CardTitle className="font-playfair text-2xl">Connexion requise</CardTitle>
              <CardDescription>
                Vous devez être connecté pour accéder au programme de parrainage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a href={getLoginUrl()}>
                <Button className="w-full bg-[#8B9D83] hover:bg-[#7A8A72]">
                  Se connecter
                </Button>
              </a>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FAF9F6] to-white">
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-6xl">
          <Button
            variant="ghost"
            onClick={() => setLocation("/dashboard")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au dashboard
          </Button>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#8B9D83]/10 mb-4">
              <Gift className="w-8 h-8 text-[#8B9D83]" />
            </div>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Programme de Parrainage
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Partagez la magie du langage des fleurs avec vos proches et gagnez 100 points de fidélité 
              pour chaque ami qui effectue sa première commande !
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total parrainages</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {statsLoading ? "..." : stats?.total || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Parrainages réussis</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {statsLoading ? "..." : stats?.rewarded || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Points gagnés</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {statsLoading ? "..." : stats?.totalPoints || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                    <Gift className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Referral Code Card */}
          <Card className="mb-12 border-0 shadow-xl bg-gradient-to-br from-[#8B9D83] to-[#7A8A72] text-white">
            <CardHeader>
              <CardTitle className="font-playfair text-2xl text-white">Votre Code de Parrainage</CardTitle>
              <CardDescription className="text-white/80">
                Partagez ce code avec vos amis pour qu'ils bénéficient d'avantages et vous faire gagner des points !
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Code Display */}
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex-1">
                  <p className="text-sm text-white/80 mb-1">Code promo</p>
                  <p className="text-3xl font-bold tracking-wider">
                    {referralCode?.referralCode || "LOADING..."}
                  </p>
                </div>
                <Button
                  onClick={handleCopyCode}
                  variant="secondary"
                  size="lg"
                  className="bg-white text-[#8B9D83] hover:bg-white/90"
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 w-5 h-5" />
                      Copié !
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 w-5 h-5" />
                      Copier
                    </>
                  )}
                </Button>
              </div>

              {/* Share Buttons */}
              <div>
                <p className="text-sm text-white/80 mb-3">Partager sur les réseaux sociaux</p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleShare("facebook")}
                    variant="secondary"
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/20"
                  >
                    <Facebook className="mr-2 w-5 h-5" />
                    Facebook
                  </Button>
                  <Button
                    onClick={() => handleShare("twitter")}
                    variant="secondary"
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/20"
                  >
                    <Twitter className="mr-2 w-5 h-5" />
                    Twitter
                  </Button>
                  <Button
                    onClick={() => handleShare("email")}
                    variant="secondary"
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/20"
                  >
                    <Mail className="mr-2 w-5 h-5" />
                    Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How it Works */}
          <Card className="mb-12 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="font-playfair text-2xl">Comment ça marche ?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[#8B9D83]/10 flex items-center justify-center mx-auto mb-4">
                    <Share2 className="w-8 h-8 text-[#8B9D83]" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">1. Partagez votre code</h3>
                  <p className="text-gray-600 text-sm">
                    Envoyez votre code de parrainage unique à vos amis et votre famille.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[#F4E4E8]/50 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-[#8B9D83]" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">2. Vos amis commandent</h3>
                  <p className="text-gray-600 text-sm">
                    Ils utilisent votre code lors de leur première commande sur Ananas Garden.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">3. Gagnez des points</h3>
                  <p className="text-gray-600 text-sm">
                    Recevez automatiquement 100 points de fidélité pour chaque parrainage réussi !
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Referrals List */}
          {referrals && referrals.length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-playfair text-2xl">Historique de vos parrainages</CardTitle>
                <CardDescription>
                  Suivez l'état de vos parrainages et les points gagnés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {referrals.map((referral) => (
                    <div
                      key={referral.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-[#8B9D83] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#8B9D83]/10 flex items-center justify-center">
                          <Users className="w-5 h-5 text-[#8B9D83]" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            Code: {referral.referralCode}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(referral.createdAt).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {referral.status === "rewarded" && (
                          <span className="text-[#D4AF37] font-semibold">
                            +{referral.pointsAwarded} points
                          </span>
                        )}
                        <Badge
                          className={
                            referral.status === "rewarded"
                              ? "bg-green-100 text-green-800"
                              : referral.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {referral.status === "rewarded"
                            ? "Récompensé"
                            : referral.status === "completed"
                            ? "Complété"
                            : "En attente"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
