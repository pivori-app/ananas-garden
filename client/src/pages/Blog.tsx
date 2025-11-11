import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Calendar, Clock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";

const categoryLabels: Record<string, string> = {
  "langage-des-fleurs": "Langage des fleurs",
  "conseils": "Conseils",
  "tendances": "Tendances",
  "histoire": "Histoire",
  "diy": "DIY",
};

const categoryColors: Record<string, string> = {
  "langage-des-fleurs": "bg-pink-100 text-pink-800",
  "conseils": "bg-green-100 text-green-800",
  "tendances": "bg-purple-100 text-purple-800",
  "histoire": "bg-amber-100 text-amber-800",
  "diy": "bg-blue-100 text-blue-800",
};

export default function Blog() {
  const { data: posts, isLoading } = trpc.blog.list.useQuery();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FAF9F6] to-white">
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-7xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="font-playfair text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Le Blog Ananas Garden
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez l'univers fascinant du langage des fleurs, des conseils d'entretien, 
              et les dernières tendances florales pour sublimer vos émotions.
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#8B9D83]" />
            </div>
          )}

          {/* Articles Grid */}
          {!isLoading && posts && posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white overflow-hidden">
                  {/* Cover Image */}
                  {post.coverImageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.coverImageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className={categoryColors[post.category] || "bg-gray-100 text-gray-800"}>
                          {categoryLabels[post.category] || post.category}
                        </Badge>
                      </div>
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle className="font-playfair text-2xl group-hover:text-[#8B9D83] transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 line-clamp-2">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.publishedAt).toLocaleDateString("fr-FR", { 
                          day: "numeric", 
                          month: "long", 
                          year: "numeric" 
                        })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime} min</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Link href={`/blog/${post.slug}`}>
                      <Button 
                        variant="ghost" 
                        className="group/btn text-[#8B9D83] hover:text-[#8B9D83] hover:bg-[#8B9D83]/10"
                      >
                        Lire l'article
                        <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && (!posts || posts.length === 0) && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Aucun article disponible pour le moment.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
