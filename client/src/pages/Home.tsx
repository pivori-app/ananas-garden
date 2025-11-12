import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Heart, MessageCircle, Flower2, Camera } from "lucide-react";

export default function Home() {
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Le langage des fleurs réinventé
            </div>
            
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground md:text-7xl">
              Ananas Garden
            </h1>
            
            <p className="mb-4 text-2xl text-muted-foreground md:text-3xl">
              Exprimez vos émotions avec des bouquets personnalisés
            </p>
            
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
              Dites-nous ce que vous ressentez, et nous créerons pour vous un bouquet unique qui parle le langage des fleurs. 
              Chaque fleur est choisie pour son symbolisme et sa signification émotionnelle.
            </p>
            
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="gap-2" onClick={() => window.location.href = "/create"}>
                <Sparkles className="h-5 w-5" />
                Créer mon bouquet
              </Button>
              
              <Button variant="outline" size="lg" className="gap-2" onClick={() => window.location.href = "/catalog"}>
                <Flower2 className="h-5 w-5" />
                Explorer les fleurs
              </Button>
              
              <Button variant="outline" size="lg" className="gap-2" onClick={() => window.location.href = "/scanner"}>
                <Camera className="h-5 w-5" />
                Scanner un bouquet
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
      </section>

      {/* How it works */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="mb-4 text-4xl font-bold tracking-tight">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-muted-foreground">
              Quatre étapes simples pour créer votre bouquet parfait
            </p>
          </div>
          
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "1",
                title: "Votre message",
                description: "Écrivez ou dictez ce que vous ressentez : amour, gratitude, excuses, joie...",
                icon: MessageCircle,
                color: "text-primary"
              },
              {
                step: "2",
                title: "Personnalisation",
                description: "Choisissez l'occasion, votre budget, les couleurs et le style de votre bouquet",
                icon: Sparkles,
                color: "text-secondary"
              },
              {
                step: "3",
                title: "Génération",
                description: "Notre intelligence analyse vos émotions et compose un bouquet symbolique unique",
                icon: Flower2,
                color: "text-accent"
              },
              {
                step: "4",
                title: "Commande",
                description: "Découvrez la signification de chaque fleur, personnalisez et commandez",
                icon: Heart,
                color: "text-primary"
              }
            ].map((item) => (
              <Card key={item.step} className="relative overflow-hidden p-6 transition-all hover:shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                
                <div className="mb-2 text-sm font-semibold text-muted-foreground">
                  Étape {item.step}
                </div>
                
                <h3 className="mb-3 text-xl font-semibold">
                  {item.title}
                </h3>
                
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
                
                {/* Decorative number */}
                <div className="absolute -right-4 -top-4 text-8xl font-bold text-muted/5">
                  {item.step}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/30 py-20 md:py-32">
        <div className="container">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">
                Analyse émotionnelle
              </h3>
              <p className="text-muted-foreground">
                Notre technologie d'IA comprend vos émotions et sélectionne les fleurs qui expriment parfaitement vos sentiments
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary/20">
                <Flower2 className="h-8 w-8 text-secondary-foreground" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">
                Langage des fleurs
              </h3>
              <p className="text-muted-foreground">
                Chaque fleur a une signification unique. Nous utilisons ce langage millénaire pour créer des compositions chargées de sens
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
                <Heart className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">
                Bouquets uniques
              </h3>
              <p className="text-muted-foreground">
                Chaque bouquet est unique, créé spécialement pour vous et la personne à qui vous l'offrez
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <Card className="mx-auto max-w-4xl overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-12 text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight">
              Prêt à exprimer vos émotions ?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Créez votre premier bouquet personnalisé en quelques minutes
            </p>
            <Button size="lg" className="gap-2" onClick={() => window.location.href = "/create"}>
              <Sparkles className="h-5 w-5" />
              Commencer maintenant
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
}
