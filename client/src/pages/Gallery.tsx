import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
    description: string | null;
  } | null>(null);

  const { data: galleryItems, isLoading } = trpc.gallery.list.useQuery();

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
            <p className="text-lg text-charcoal/70">
              Découvrez nos créations florales uniques. Chaque bouquet raconte une histoire et exprime des émotions à travers le langage des fleurs.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid - Masonry Layout */}
      <section className="py-16">
        <div className="container">
          {galleryItems && galleryItems.length > 0 ? (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {galleryItems.map((item) => (
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
