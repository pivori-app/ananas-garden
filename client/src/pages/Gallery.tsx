import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { X, Loader2, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
    description: string | null;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const { data: galleryItems, isLoading } = trpc.gallery.list.useQuery();
  
  type GalleryItem = NonNullable<typeof galleryItems>[number];

  // Extract unique types
  const types = useMemo(() => {
    if (!galleryItems) return [];
    const uniqueTypes = Array.from(new Set(galleryItems.map((item: GalleryItem) => item.bouquetType).filter(Boolean)));
    return uniqueTypes as string[];
  }, [galleryItems]);

  // Filter gallery items
  const filteredItems = useMemo(() => {
    if (!galleryItems) return [];
    return galleryItems.filter((item: GalleryItem) => {
      const matchesSearch = searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = !selectedType || item.bouquetType === selectedType;
      return matchesSearch && matchesType;
    });
  }, [galleryItems, searchQuery, selectedType]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-sage-50 via-cream-50 to-blush-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-charcoal mb-6">
              Galerie de Réalisations
            </h1>
            <p className="text-lg text-charcoal/70 mb-8">
              Découvrez nos créations florales uniques. Chaque bouquet raconte une histoire et exprime des émotions à travers le langage des fleurs.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-charcoal/40" />
                <Input
                  placeholder="Rechercher un bouquet..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg bg-white/80 backdrop-blur-sm border-sage-200 focus:border-sage-400"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b border-sage-200 bg-white/50">
        <div className="container">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-charcoal/70">
              <Filter className="h-4 w-4" />
              <span className="font-medium">Filtrer par type:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedType === null ? "default" : "outline"}
                className="cursor-pointer hover:bg-sage-100 transition-colors"
                onClick={() => setSelectedType(null)}
              >
                Tous ({galleryItems?.length || 0})
              </Badge>
              {types.map((type) => (
                <Badge
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  className="cursor-pointer hover:bg-sage-100 transition-colors"
                  onClick={() => setSelectedType(type)}
                >
                  {type} ({galleryItems?.filter((item: GalleryItem) => item.bouquetType === type).length || 0})
                </Badge>
              ))}
            </div>
            {(searchQuery || selectedType) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType(null);
                }}
                className="ml-auto text-charcoal/60 hover:text-charcoal"
              >
                Réinitialiser
              </Button>
            )}
          </div>
          <div className="mt-4 text-sm text-charcoal/60">
            {filteredItems.length} résultat{filteredItems.length > 1 ? 's' : ''} trouvé{filteredItems.length > 1 ? 's' : ''}
          </div>
        </div>
      </section>

      {/* Gallery Grid - Masonry Layout */}
      <section className="py-16">
        <div className="container">
          {filteredItems && filteredItems.length > 0 ? (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {filteredItems.map((item: GalleryItem) => (
                <Card
                  key={item.id}
                  className="break-inside-avoid cursor-pointer group overflow-hidden border-sage-200 hover:shadow-xl transition-all duration-300"
                  onClick={() =>
                    setSelectedImage({
                      url: item.imageUrl,
                      title: item.title,
                      description: item.description,
                    })
                  }
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="font-serif text-xl font-bold mb-2">
                          {item.title}
                        </h3>
                        {item.bouquetType && (
                          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                            {item.bouquetType}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-charcoal/60 text-lg">
                Aucune réalisation à afficher pour le moment.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-6 w-6" />
          </Button>

          <div
            className="max-w-6xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
            />
            <div className="mt-6 text-center text-white max-w-2xl">
              <h2 className="text-2xl font-serif font-bold mb-2">
                {selectedImage.title}
              </h2>
              {selectedImage.description && (
                <p className="text-white/80">{selectedImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
