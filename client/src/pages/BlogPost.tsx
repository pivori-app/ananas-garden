import { trpc } from "@/lib/trpc";
import { useRoute, Link } from "wouter";
import { Calendar, Clock, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Streamdown } from "streamdown";

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

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";

  const { data: post, isLoading } = trpc.blog.getBySlug.useQuery({ slug }, {
    enabled: !!slug,
  });

  const { data: recentPosts } = trpc.blog.getRecent.useQuery({ limit: 3 });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FAF9F6] to-white">
        <main className="flex-1 flex items-center justify-center pt-24">
          <Loader2 className="w-8 h-8 animate-spin text-[#8B9D83]" />
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FAF9F6] to-white">
        <main className="flex-1 flex items-center justify-center pt-24">
          <div className="text-center">
            <h1 className="font-playfair text-4xl font-bold text-gray-900 mb-4">
              Article introuvable
            </h1>
            <p className="text-gray-600 mb-8">
              Désolé, cet article n'existe pas ou a été supprimé.
            </p>
            <Link href="/blog">
              <Button className="bg-[#8B9D83] hover:bg-[#7A8A72]">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Retour au blog
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FAF9F6] to-white">
      <main className="flex-1 pt-24 pb-16">
        <article className="container max-w-4xl">
          {/* Back Button */}
          <Link href="/blog">
            <Button variant="ghost" className="mb-8 text-[#8B9D83] hover:text-[#8B9D83] hover:bg-[#8B9D83]/10">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Retour au blog
            </Button>
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <Badge className={`mb-4 ${categoryColors[post.category] || "bg-gray-100 text-gray-800"}`}>
              {categoryLabels[post.category] || post.category}
            </Badge>
            
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.publishedAt).toLocaleDateString("fr-FR", { 
                  day: "numeric", 
                  month: "long", 
                  year: "numeric" 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} min de lecture</span>
              </div>
              <span className="text-gray-400">•</span>
              <span>Par {post.authorName}</span>
            </div>

            <p className="text-xl text-gray-600 leading-relaxed">
              {post.excerpt}
            </p>
          </header>

          {/* Cover Image */}
          {post.coverImageUrl && (
            <div className="mb-12 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-16">
            <Streamdown>{post.content}</Streamdown>
          </div>

          {/* Tags */}
          {post.tags && JSON.parse(post.tags).length > 0 && (
            <div className="mb-16 pb-16 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {JSON.parse(post.tags).map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-gray-600">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Recent Posts */}
          {recentPosts && recentPosts.length > 0 && (
            <div>
              <h2 className="font-playfair text-3xl font-bold text-gray-900 mb-8">
                Articles récents
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentPosts.filter(p => p.id !== post.id).slice(0, 3).map((recentPost) => (
                  <Link key={recentPost.id} href={`/blog/${recentPost.slug}`}>
                    <div className="group cursor-pointer">
                      {recentPost.coverImageUrl && (
                        <div className="relative h-40 rounded-lg overflow-hidden mb-3">
                          <img
                            src={recentPost.coverImageUrl}
                            alt={recentPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#8B9D83] transition-colors mb-2">
                        {recentPost.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {recentPost.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
    </div>
  );
}
