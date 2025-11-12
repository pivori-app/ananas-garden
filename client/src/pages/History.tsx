import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Flower2, Sparkles, Trash2, Calendar, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function History() {
  const [, setLocation] = useLocation();
  const [filterType, setFilterType] = useState<"all" | "flower" | "bouquet">("all");
  const [selectedScan, setSelectedScan] = useState<any | null>(null);

  // Récupérer l'historique
  const { data: history, isLoading, refetch } = trpc.scanHistory.list.useQuery({ limit: 50 });

  // Mutation pour supprimer un scan
  const deleteMutation = trpc.scanHistory.delete.useMutation({
    onSuccess: () => {
      toast.success("Scan supprimé de l'historique");
      refetch();
      setSelectedScan(null);
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression : " + error.message);
    }
  });

  // Filtrer l'historique
  const filteredHistory = history?.filter((scan) => {
    if (filterType === "all") return true;
    return scan.scanType === filterType;
  }) || [];

  const handleDelete = (scanId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce scan ?")) {
      deleteMutation.mutate({ scanId });
    }
  };

  const handleViewDetails = (scan: any) => {
    setSelectedScan(scan);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/scanner")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au scanner
          </Button>
          
          <h1 className="text-4xl font-bold mb-4 font-serif">Historique des Scans</h1>
          <p className="text-lg text-muted-foreground">
            Retrouvez toutes vos identifications de fleurs et analyses de bouquets
          </p>
        </div>

        {/* Filters */}
        <Tabs value={filterType} onValueChange={(v) => setFilterType(v as any)} className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all">
              Tous ({history?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="flower" className="gap-2">
              <Flower2 className="h-4 w-4" />
              Fleurs ({history?.filter(s => s.scanType === "flower").length || 0})
            </TabsTrigger>
            <TabsTrigger value="bouquet" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Bouquets ({history?.filter(s => s.scanType === "bouquet").length || 0})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredHistory.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Flower2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Aucun scan trouvé</h3>
              <p className="text-muted-foreground mb-4">
                {filterType === "all" 
                  ? "Vous n'avez pas encore scanné de fleurs ou de bouquets"
                  : `Aucun scan de ${filterType === "flower" ? "fleur" : "bouquet"} trouvé`
                }
              </p>
              <Button onClick={() => setLocation("/scanner")}>
                Scanner maintenant
              </Button>
            </CardContent>
          </Card>
        )}

        {/* History Grid */}
        {!isLoading && filteredHistory.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* List of Scans */}
            <div className="space-y-4">
              {filteredHistory.map((scan) => (
                <Card 
                  key={scan.id} 
                  className={`cursor-pointer transition-colors ${
                    selectedScan?.id === scan.id ? "border-primary" : "hover:border-primary/50"
                  }`}
                  onClick={() => handleViewDetails(scan)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Image Thumbnail */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img 
                          src={scan.imageUrl} 
                          alt="Scan" 
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <Badge variant={scan.scanType === "flower" ? "default" : "secondary"} className="mb-1">
                              {scan.scanType === "flower" ? (
                                <><Flower2 className="h-3 w-3 mr-1" /> Fleur</>
                              ) : (
                                <><Sparkles className="h-3 w-3 mr-1" /> Bouquet</>
                              )}
                            </Badge>
                            <h3 className="font-medium truncate">
                              {scan.scanType === "flower" 
                                ? scan.result.name 
                                : "Analyse de bouquet"
                              }
                            </h3>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(scan.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(scan.createdAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Details Panel */}
            <div className="sticky top-4">
              {selectedScan ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {selectedScan.scanType === "flower" ? (
                        <><Flower2 className="h-5 w-5" /> Identification de fleur</>
                      ) : (
                        <><Sparkles className="h-5 w-5" /> Analyse de bouquet</>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {format(new Date(selectedScan.createdAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Image */}
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <img 
                        src={selectedScan.imageUrl} 
                        alt="Scan" 
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Results for Flower */}
                    {selectedScan.scanType === "flower" && (
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-xl font-serif font-bold mb-1">
                            {selectedScan.result.name}
                          </h4>
                          {selectedScan.result.scientificName && (
                            <p className="text-sm italic text-muted-foreground">
                              {selectedScan.result.scientificName}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {selectedScan.result.confidence}% confiance
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {selectedScan.result.color}
                          </Badge>
                        </div>

                        <p className="text-sm">{selectedScan.result.description}</p>

                        {selectedScan.result.symbolism && (
                          <div>
                            <h5 className="font-medium mb-1">Symbolisme</h5>
                            <p className="text-sm text-muted-foreground">
                              {selectedScan.result.symbolism}
                            </p>
                          </div>
                        )}

                        {selectedScan.result.emotions && selectedScan.result.emotions.length > 0 && (
                          <div>
                            <h5 className="font-medium mb-2">Émotions</h5>
                            <div className="flex flex-wrap gap-1">
                              {selectedScan.result.emotions.map((emotion: string, idx: number) => (
                                <Badge key={idx} variant="secondary" className="capitalize">
                                  {emotion}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Results for Bouquet */}
                    {selectedScan.scanType === "bouquet" && (
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4">
                          <h5 className="text-sm font-medium text-muted-foreground mb-1">
                            Message émotionnel
                          </h5>
                          <p className="text-lg font-serif font-bold text-primary">
                            {selectedScan.result.message}
                          </p>
                        </div>

                        <div>
                          <h5 className="font-medium mb-3">Fleurs identifiées</h5>
                          <div className="space-y-2">
                            {selectedScan.result.flowers.map((flower: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                <div>
                                  <p className="font-medium">{flower.name}</p>
                                  <p className="text-sm text-muted-foreground">{flower.symbolism}</p>
                                </div>
                                <Badge variant="outline">
                                  {Math.round(flower.confidence * 100)}%
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setLocation("/scanner")}
                      >
                        Scanner à nouveau
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => handleDelete(selectedScan.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Flower2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Sélectionnez un scan pour voir les détails
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
