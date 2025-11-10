import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, Quote, Star } from "lucide-react";

export default function Testimonials() {
  const { data: testimonials, isLoading } = trpc.testimonials.list.useQuery({ limit: 20 });

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "fill-gold text-gold" : "text-charcoal/20"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-cream py-16">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl text-charcoal mb-4">
            Témoignages Clients
          </h1>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            Découvrez ce que nos clients pensent de nos bouquets personnalisés
          </p>
        </div>

        {/* Testimonials Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-sage" />
          </div>
        ) : testimonials && testimonials.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Image si disponible */}
                  {testimonial.imageUrl && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img
                        src={testimonial.imageUrl}
                        alt={testimonial.bouquetName || "Bouquet"}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}

                  {/* Quote icon */}
                  <Quote className="w-8 h-8 text-sage/30 mb-3" />

                  {/* Rating */}
                  <div className="mb-3">{renderStars(testimonial.rating)}</div>

                  {/* Comment */}
                  <p className="text-charcoal/80 mb-4 italic">
                    "{testimonial.comment}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-charcoal">
                        {testimonial.customerName}
                      </div>
                      {testimonial.bouquetName && (
                        <div className="text-sm text-charcoal/60">
                          {testimonial.bouquetName}
                        </div>
                      )}
                    </div>
                    {testimonial.isVerified === 1 && (
                      <div className="text-xs bg-sage/10 text-sage px-2 py-1 rounded">
                        Vérifié
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Quote className="w-12 h-12 mx-auto mb-4 text-charcoal/30" />
              <h3 className="font-display text-xl text-charcoal mb-2">
                Aucun témoignage pour le moment
              </h3>
              <p className="text-charcoal/60">
                Soyez le premier à partager votre expérience !
              </p>
            </CardContent>
          </Card>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-charcoal/70 mb-4">
            Vous avez reçu un bouquet Ananas Garden ?
          </p>
          <p className="text-sm text-charcoal/60">
            Partagez votre expérience depuis votre tableau de bord client
          </p>
        </div>
      </div>
    </div>
  );
}
