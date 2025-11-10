import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, Loader2, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Scanner() {
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    flowers: Array<{ name: string; symbolism: string; confidence: number }>;
    message: string;
  } | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeBouquetMutation = trpc.bouquet.analyzeBouquetImage.useMutation({
    onSuccess: (data) => {
      setResult(data);
      setAnalyzing(false);
      toast.success("Analyse terminée !");
    },
    onError: (error) => {
      toast.error("Erreur lors de l'analyse : " + error.message);
      setAnalyzing(false);
    }
  });

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setCapturedImage(null);
        setResult(null);
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
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!capturedImage) return;
    
    setAnalyzing(true);
    analyzeBouquetMutation.mutate({ imageData: capturedImage });
  };

  const reset = () => {
    setCapturedImage(null);
    setResult(null);
    setAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 font-serif">Scanner de Bouquets</h1>
          <p className="text-lg text-muted-foreground">
            Photographiez un bouquet pour découvrir son message caché
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
            {/* Camera/Image Display */}
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              {!capturedImage && !cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <Camera className="h-16 w-16 text-muted-foreground" />
                  <p className="text-muted-foreground">Aucune image capturée</p>
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
                  alt="Bouquet capturé"
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
              
              {capturedImage && !analyzing && !result && (
                <>
                  <Button onClick={analyzeImage} size="lg" className="gap-2">
                    <Sparkles className="h-5 w-5" />
                    Analyser le bouquet
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
              
              {result && (
                <Button onClick={reset} variant="outline" size="lg">
                  Scanner un autre bouquet
                </Button>
              )}
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-6 pt-6 border-t">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Message émotionnel décodé
                  </h3>
                  <p className="text-2xl font-serif font-bold text-primary">
                    {result.message}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Fleurs identifiées</h3>
                  <div className="grid gap-3">
                    {result.flowers.map((flower, idx) => (
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
            💡 Astuce : Pour de meilleurs résultats, photographiez le bouquet avec un bon éclairage
            et assurez-vous que les fleurs sont bien visibles.
          </p>
        </div>
      </div>
    </div>
  );
}
