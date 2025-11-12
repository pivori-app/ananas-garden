import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Loader2, Sparkles, Flower2, CheckCircle2, XCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Scanner() {
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<"bouquet" | "flower">("flower");
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  
  // Résultats pour analyse de bouquet
  const [bouquetResult, setBouquetResult] = useState<{
    flowers: Array<{ name: string; symbolism: string; confidence: number }>;
    message: string;
  } | null>(null);
  
  // Résultats pour identification de fleur
  const [flowerResult, setFlowerResult] = useState<{
    name: string;
    scientificName?: string;
    color: string;
    description: string;
    confidence: number;
    emotions?: string[];
    symbolism?: string;
    catalogMatch?: { id: number; name: string; scientificName: string | null } | null;
    similarFlowers?: Array<{ id: number; name: string; scientificName: string | null; color: string }>;
  } | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mutation pour analyser un bouquet complet
  const analyzeBouquetMutation = trpc.bouquet.analyzeBouquetImage.useMutation({
    onSuccess: (data) => {
      setBouquetResult(data);
      setAnalyzing(false);
      toast.success("Analyse du bouquet terminée !");
    },
    onError: (error) => {
      toast.error("Erreur lors de l'analyse : " + error.message);
      setAnalyzing(false);
    }
  });

  // Mutation pour identifier une fleur individuelle
  const identifyFlowerMutation = trpc.flowerScanner.identify.useMutation({
    onSuccess: async (data) => {
      // Rechercher la fleur dans le catalogue
      const catalogMatch = data.confidence > 50 
        ? await searchInCatalog(data.name)
        : null;
      
      // Rechercher des fleurs similaires
      const similarFlowers = data.confidence > 30
        ? await findSimilar(data.color, data.emotions)
        : [];
      
      setFlowerResult({
        ...data,
        catalogMatch,
        similarFlowers,
      });
      setAnalyzing(false);
      
      if (data.confidence > 70) {
        toast.success(`Fleur identifiée : ${data.name} !`);
      } else if (data.confidence > 30) {
        toast.info("Identification partielle. Vérifiez les résultats.");
      } else {
        toast.error("Impossible d'identifier la fleur. Essayez une photo plus claire.");
      }
    },
    onError: (error) => {
      toast.error("Erreur lors de l'identification : " + error.message);
      setAnalyzing(false);
    }
  });

  // Rechercher la fleur dans le catalogue
  const searchInCatalog = async (flowerName: string) => {
    try {
      const result = await trpc.flowerScanner.search.query({ flowerName });
      return result;
    } catch (error) {
      console.error("Erreur lors de la recherche dans le catalogue:", error);
      return null;
    }
  };

  // Trouver des fleurs similaires
  const findSimilar = async (color: string, emotions?: string[]) => {
    try {
      const result = await trpc.flowerScanner.findSimilar.query({ color, emotions });
      return result;
    } catch (error) {
      console.error("Erreur lors de la recherche de fleurs similaires:", error);
      return [];
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setCapturedImage(null);
        setBouquetResult(null);
        setFlowerResult(null);
      }
    } catch (error) {
      toast.error("Impossible d'accéder à la caméra. Veuillez autoriser l'accès.");
      console.error("Camera error:", error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg", 0.9);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
        setBouquetResult(null);
        setFlowerResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!capturedImage) return;
    
    setAnalyzing(true);
    
    if (mode === "bouquet") {
      analyzeBouquetMutation.mutate({ imageData: capturedImage });
    } else {
      identifyFlowerMutation.mutate({ imageBase64: capturedImage });
    }
  };

  const reset = () => {
    setCapturedImage(null);
    setBouquetResult(null);
    setFlowerResult(null);
    setAnalyzing(false);
  };

  const handleModeChange = (newMode: string) => {
    setMode(newMode as "bouquet" | "flower");
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 font-serif">Scanner Floral</h1>
          <p className="text-lg text-muted-foreground">
            Identifiez des fleurs ou analysez des bouquets complets avec l'IA
          </p>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Analyse Florale par IA
            </CardTitle>
            <CardDescription>
              Notre intelligence artificielle identifie les fleurs et décode leur signification émotionnelle
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            {/* Mode Selection */}
            <Tabs value={mode} onValueChange={handleModeChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="flower" className="gap-2">
                  <Flower2 className="h-4 w-4" />
                  Identifier une fleur
                </TabsTrigger>
                <TabsTrigger value="bouquet" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Analyser un bouquet
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Camera/Image Display */}
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              {!capturedImage && !cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  {mode === "flower" ? (
                    <>
                      <Flower2 className="h-16 w-16 text-muted-foreground" />
                      <p className="text-muted-foreground">Photographiez une fleur</p>
                    </>
                  ) : (
                    <>
                      <Camera className="h-16 w-16 text-muted-foreground" />
                      <p className="text-muted-foreground">Photographiez un bouquet</p>
                    </>
                  )}
                </div>
              )}
              
              {cameraActive && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}
              
              {capturedImage && (
                <img
                  src={capturedImage}
                  alt="Image capturée"
                  className="w-full h-full object-cover"
                />
              )}
              
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-3 justify-center">
              {!cameraActive && !capturedImage && (
                <>
                  <Button onClick={startCamera} size="lg" className="gap-2">
                    <Camera className="h-5 w-5" />
                    Ouvrir la caméra
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-5 w-5" />
                    Importer une photo
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </>
              )}
              
              {cameraActive && (
                <>
                  <Button onClick={capturePhoto} size="lg" className="gap-2">
                    <Camera className="h-5 w-5" />
                    Capturer
                  </Button>
                  <Button onClick={stopCamera} variant="outline" size="lg">
                    Annuler
                  </Button>
                </>
              )}
              
              {capturedImage && !analyzing && !bouquetResult && !flowerResult && (
                <>
                  <Button onClick={analyzeImage} size="lg" className="gap-2">
                    <Sparkles className="h-5 w-5" />
                    {mode === "flower" ? "Identifier la fleur" : "Analyser le bouquet"}
                  </Button>
                  <Button onClick={reset} variant="outline" size="lg">
                    Recommencer
                  </Button>
                </>
              )}
              
              {analyzing && (
                <div className="flex items-center gap-2 text-primary">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Analyse en cours...</span>
                </div>
              )}
              
              {(bouquetResult || flowerResult) && (
                <Button onClick={reset} variant="outline" size="lg">
                  Scanner à nouveau
                </Button>
              )}
            </div>

            {/* Results for Flower Identification */}
            {flowerResult && (
              <div className="space-y-6 pt-6 border-t">
                <div className={`rounded-lg p-6 ${
                  flowerResult.confidence > 70 
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200"
                    : flowerResult.confidence > 30
                    ? "bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200"
                    : "bg-gradient-to-r from-red-50 to-rose-50 border border-red-200"
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-serif font-bold mb-1">
                        {flowerResult.name}
                      </h3>
                      {flowerResult.scientificName && (
                        <p className="text-sm italic text-muted-foreground">
                          {flowerResult.scientificName}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {flowerResult.confidence > 70 ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      ) : flowerResult.confidence > 30 ? (
                        <Sparkles className="h-6 w-6 text-amber-600" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-600" />
                      )}
                      <Badge variant={flowerResult.confidence > 70 ? "default" : "secondary"}>
                        {flowerResult.confidence}% confiance
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-sage-700 mb-3">{flowerResult.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Couleur :</span>{" "}
                      <span className="capitalize">{flowerResult.color}</span>
                    </div>
                    {flowerResult.symbolism && (
                      <div className="col-span-2">
                        <span className="font-medium">Symbolisme :</span>{" "}
                        {flowerResult.symbolism}
                      </div>
                    )}
                    {flowerResult.emotions && flowerResult.emotions.length > 0 && (
                      <div className="col-span-2">
                        <span className="font-medium">Émotions :</span>{" "}
                        <div className="flex flex-wrap gap-1 mt-1">
                          {flowerResult.emotions.map((emotion, idx) => (
                            <Badge key={idx} variant="outline" className="capitalize">
                              {emotion}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Catalog Match */}
                {flowerResult.catalogMatch && (
                  <Card className="border-primary/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        Disponible dans notre catalogue !
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Cette fleur est disponible : <strong>{flowerResult.catalogMatch.scientificName || flowerResult.catalogMatch.name}</strong>
                      </p>
                      <Button 
                        onClick={() => setLocation(`/catalog`)}
                        className="w-full"
                      >
                        Voir dans le catalogue
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Similar Flowers */}
                {flowerResult.similarFlowers && flowerResult.similarFlowers.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Fleurs similaires dans notre catalogue</h3>
                    <div className="grid gap-2">
                      {flowerResult.similarFlowers.map((flower) => (
                        <Card key={flower.id} className="cursor-pointer hover:border-primary/50 transition-colors"
                          onClick={() => setLocation(`/catalog`)}>
                          <CardContent className="p-3 flex items-center justify-between">
                            <div>
                              <p className="font-medium">{flower.name}</p>
                              <p className="text-xs text-muted-foreground italic">{flower.scientificName}</p>
                              <p className="text-xs text-muted-foreground capitalize">{flower.color}</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              Voir →
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Results for Bouquet Analysis */}
            {bouquetResult && (
              <div className="space-y-6 pt-6 border-t">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Message émotionnel décodé
                  </h3>
                  <p className="text-2xl font-serif font-bold text-primary">
                    {bouquetResult.message}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Fleurs identifiées</h3>
                  <div className="grid gap-3">
                    {bouquetResult.flowers.map((flower, idx) => (
                      <Card key={idx}>
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <p className="font-medium">{flower.name}</p>
                            <p className="text-sm text-muted-foreground">{flower.symbolism}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-primary">
                              {Math.round(flower.confidence * 100)}% confiance
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            💡 Astuce : Pour de meilleurs résultats, photographiez {mode === "flower" ? "la fleur" : "le bouquet"} avec un bon éclairage
            et assurez-vous que {mode === "flower" ? "la fleur est bien visible et centrée" : "les fleurs sont bien visibles"}.
          </p>
        </div>
      </div>
    </div>
  );
}
