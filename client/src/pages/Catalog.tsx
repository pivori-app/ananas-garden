import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [emotionFilter, setEmotionFilter] = useState<string>("all");
  const [colorFilter, setColorFilter] = useState<string>("all");

  const { data: flowers, isLoading } = trpc.flowers.list.useQuery();

  // Extract unique emotions and colors from flowers
  const emotions = flowers
    ? Array.from(new Set(flowers.flatMap(f => f.emotions?.split(',').map(e => e.trim()) || [])))
    : [];
  
  const colors = flowers
    ? Array.from(new Set(flowers.flatMap(f => f.color?.split(',').map((c: string) => c.trim()) || [])))
    : [];

  // Filter flowers based on search and filters
  const filteredFlowers = flowers?.filter(flower => {
    const matchesSearch = searchQuery === "" || 
      flower.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flower.symbolism.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesEmotion = emotionFilter === "all" || 
      flower.emotions?.split(',').map(e => e.trim()).includes(emotionFilter);
    
    const matchesColor = colorFilter === "all" || 
      flower.color?.split(',').map((c: string) => c.trim()).includes(colorFilter);

    return matchesSearch && matchesEmotion && matchesColor;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Notre Catalogue de Fleurs
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez la signification de chaque fleur et trouvez celle qui exprime parfaitement vos émotions
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-card rounded-xl p-6 shadow-sm border mb-8">
            <div className="grid gap-4 md:grid-cols-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une fleur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Emotion Filter */}
              <Select value={emotionFilter} onValueChange={setEmotionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par émotion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les émotions</SelectItem>
                  {emotions.map(emotion => (
                    <SelectItem key={emotion} value={emotion}>
                      {emotion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Color Filter */}
              <Select value={colorFilter} onValueChange={setColorFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par couleur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les couleurs</SelectItem>
                  {colors.map(color => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters Display */}
            {(emotionFilter !== "all" || colorFilter !== "all" || searchQuery) && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtres actifs:
                </span>
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Recherche: {searchQuery}
                    <button
                      onClick={() => setSearchQuery("")}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {emotionFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Émotion: {emotionFilter}
                    <button
                      onClick={() => setEmotionFilter("all")}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {colorFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Couleur: {colorFilter}
                    <button
                      onClick={() => setColorFilter("all")}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setEmotionFilter("all");
                    setColorFilter("all");
                  }}
                  className="h-6 text-xs"
                >
                  Réinitialiser
                </Button>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {filteredFlowers?.length || 0} fleur{(filteredFlowers?.length || 0) > 1 ? 's' : ''} trouvée{(filteredFlowers?.length || 0) > 1 ? 's' : ''}
            </p>
          </div>

          {/* Flowers Grid */}
          {filteredFlowers && filteredFlowers.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredFlowers.map((flower) => (
                <Card key={flower.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Image de la fleur */}
                  {flower.imageUrl && (
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                      <img 
                        src={flower.imageUrl} 
                        alt={flower.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl">{flower.name}</CardTitle>
                    <CardDescription className="text-base">
                      {flower.symbolism}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Emotions */}
                    {flower.emotions && (
                      <div>
                        <p className="text-sm font-medium mb-2">Émotions associées</p>
                        <div className="flex flex-wrap gap-1">
                          {flower.emotions.split(',').map((emotion, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {emotion.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Colors */}
                    {flower.color && (
                      <div>
                        <p className="text-sm font-medium mb-2">Couleurs disponibles</p>
                        <div className="flex flex-wrap gap-1">
                          {flower.color.split(',').map((color: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {color.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Price and Stock */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-lg font-semibold text-primary">
                        {flower.pricePerStem.toFixed(2)} €
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {flower.stock > 0 ? (
                          <span className="text-green-600">En stock ({flower.stock})</span>
                        ) : (
                          <span className="text-red-600">Rupture de stock</span>
                        )}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Aucune fleur ne correspond à vos critères de recherche
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setEmotionFilter("all");
                  setColorFilter("all");
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
