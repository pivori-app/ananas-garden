import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Mic, MicOff, Loader2, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";

type Step = 1 | 2 | 3 | 4;

const occasions = [
  "Anniversaire",
  "Mariage",
  "Amour",
  "Amitié",
  "Excuses",
  "Félicitations",
  "Remerciements",
  "Réconciliation",
  "Autre"
];

const budgets = [
  { value: "economique" as const, label: "Économique", price: "30-50€" },
  { value: "standard" as const, label: "Standard", price: "50-80€" },
  { value: "premium" as const, label: "Premium", price: "80€+" }
];

const colors = [
  { value: "rouge", label: "Rouge", hex: "#DC2626" },
  { value: "rose", label: "Rose", hex: "#EC4899" },
  { value: "blanc", label: "Blanc", hex: "#F3F4F6" },
  { value: "jaune", label: "Jaune", hex: "#EAB308" },
  { value: "orange", label: "Orange", hex: "#F97316" },
  { value: "violet", label: "Violet", hex: "#9333EA" },
  { value: "bleu", label: "Bleu", hex: "#3B82F6" }
];

const styles = [
  { value: "moderne" as const, label: "Moderne", description: "Épuré et contemporain" },
  { value: "romantique" as const, label: "Romantique", description: "Doux et élégant" },
  { value: "champetre" as const, label: "Champêtre", description: "Naturel et rustique" },
  { value: "luxe" as const, label: "Luxe", description: "Raffiné et opulent" }
];

export default function CreateBouquet() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<Step>(1);
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [occasion, setOccasion] = useState<string>("");
  const [budget, setBudget] = useState<"economique" | "standard" | "premium">("standard");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [style, setStyle] = useState<"moderne" | "romantique" | "champetre" | "luxe">("moderne");
  
  const recognitionRef = useRef<any>(null);
  
  const generateBouquet = trpc.bouquet.generate.useMutation({
    onSuccess: (data) => {
      toast.success("Votre bouquet a été créé !");
      setLocation(`/bouquet/${data.bouquetId}`);
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la création du bouquet");
    }
  });

  // Web Speech API setup
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'fr-FR';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setMessage(prev => prev + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        toast.error("Erreur de reconnaissance vocale");
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast.error("La reconnaissance vocale n'est pas supportée par votre navigateur");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
      toast.info("Parlez maintenant...");
    }
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const handleNext = () => {
    if (step === 1 && !message.trim()) {
      toast.error("Veuillez saisir ou dicter votre message");
      return;
    }
    if (step < 4) {
      setStep((step + 1) as Step);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
    }
  };

  const handleGenerate = () => {
    generateBouquet.mutate({
      message,
      budget,
      dominantColors: selectedColors.length > 0 ? selectedColors : undefined,
      style,
      occasion: occasion || undefined
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12">
      <div className="container max-w-4xl">
        {/* Progress indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex flex-1 items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                    s <= step
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted bg-background text-muted-foreground"
                  }`}
                >
                  {s}
                </div>
                {s < 4 && (
                  <div
                    className={`h-0.5 flex-1 transition-all ${
                      s < step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between text-sm text-muted-foreground">
            <span>Message</span>
            <span>Affinage</span>
            <span>Style</span>
            <span>Génération</span>
          </div>
        </div>

        <Card className="p-8 md:p-12">
          {/* Step 1: Message */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="mb-2 text-3xl font-bold">Exprimez vos émotions</h2>
                <p className="text-muted-foreground">
                  Dites ou écrivez ce que vous ressentez
                </p>
              </div>

              <div className="space-y-4">
                <Label htmlFor="message">Votre message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Je t'aime, Félicitations, Je suis désolé, Merci pour tout..."
                  className="min-h-[200px] text-lg"
                />
                
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant={isRecording ? "destructive" : "outline"}
                    size="lg"
                    onClick={toggleRecording}
                    className="gap-2"
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="h-5 w-5" />
                        Arrêter l'enregistrement
                      </>
                    ) : (
                      <>
                        <Mic className="h-5 w-5" />
                        Dicter vocalement
                      </>
                    )}
                  </Button>
                </div>
                
                {isRecording && (
                  <p className="text-center text-sm text-muted-foreground animate-pulse">
                    Enregistrement en cours...
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Occasion & Budget */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="mb-2 text-3xl font-bold">Affinez votre bouquet</h2>
                <p className="text-muted-foreground">
                  Précisez l'occasion et votre budget
                </p>
              </div>

              <div className="space-y-4">
                <Label>Occasion (optionnel)</Label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {occasions.map((occ) => (
                    <Button
                      key={occ}
                      type="button"
                      variant={occasion === occ ? "default" : "outline"}
                      onClick={() => setOccasion(occ === occasion ? "" : occ)}
                      className="h-auto py-3"
                    >
                      {occ}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Budget</Label>
                <RadioGroup value={budget} onValueChange={(v: any) => setBudget(v)}>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {budgets.map((b) => (
                      <Label
                        key={b.value}
                        htmlFor={b.value}
                        className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-6 transition-all ${
                          budget === b.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem value={b.value} id={b.value} className="sr-only" />
                        <span className="text-lg font-semibold">{b.label}</span>
                        <span className="text-sm text-muted-foreground">{b.price}</span>
                      </Label>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Step 3: Colors & Style */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="mb-2 text-3xl font-bold">Personnalisez le style</h2>
                <p className="text-muted-foreground">
                  Choisissez les couleurs et le style de votre bouquet
                </p>
              </div>

              <div className="space-y-4">
                <Label>Couleurs dominantes (optionnel)</Label>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => toggleColor(color.value)}
                      className={`flex items-center gap-2 rounded-full border-2 px-4 py-2 transition-all ${
                        selectedColors.includes(color.value)
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div
                        className="h-5 w-5 rounded-full border-2 border-foreground/20"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-sm font-medium">{color.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Style</Label>
                <RadioGroup value={style} onValueChange={(v: any) => setStyle(v)}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {styles.map((s) => (
                      <Label
                        key={s.value}
                        htmlFor={s.value}
                        className={`flex cursor-pointer flex-col gap-2 rounded-lg border-2 p-6 transition-all ${
                          style === s.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem value={s.value} id={s.value} className="sr-only" />
                        <span className="text-lg font-semibold">{s.label}</span>
                        <span className="text-sm text-muted-foreground">{s.description}</span>
                      </Label>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Step 4: Review & Generate */}
          {step === 4 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="mb-2 text-3xl font-bold">Récapitulatif</h2>
                <p className="text-muted-foreground">
                  Vérifiez vos choix avant de générer votre bouquet
                </p>
              </div>

              <div className="space-y-4 rounded-lg bg-muted/50 p-6">
                <div>
                  <h3 className="mb-2 font-semibold text-muted-foreground">Votre message</h3>
                  <p className="italic">"{message}"</p>
                </div>
                
                {occasion && (
                  <div>
                    <h3 className="mb-2 font-semibold text-muted-foreground">Occasion</h3>
                    <p>{occasion}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="mb-2 font-semibold text-muted-foreground">Budget</h3>
                  <p className="capitalize">{budget}</p>
                </div>
                
                {selectedColors.length > 0 && (
                  <div>
                    <h3 className="mb-2 font-semibold text-muted-foreground">Couleurs</h3>
                    <div className="flex gap-2">
                      {selectedColors.map((c) => {
                        const color = colors.find(col => col.value === c);
                        return (
                          <div
                            key={c}
                            className="h-8 w-8 rounded-full border-2 border-foreground/20"
                            style={{ backgroundColor: color?.hex }}
                            title={color?.label}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="mb-2 font-semibold text-muted-foreground">Style</h3>
                  <p className="capitalize">{style}</p>
                </div>
              </div>

              <div className="text-center">
                <Button
                  size="lg"
                  onClick={handleGenerate}
                  disabled={generateBouquet.isPending}
                  className="h-14 px-8 text-lg"
                >
                  {generateBouquet.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Générer mon bouquet
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-8 flex justify-between border-t pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Précédent
            </Button>
            
            {step < 4 && (
              <Button onClick={handleNext}>
                Suivant
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
