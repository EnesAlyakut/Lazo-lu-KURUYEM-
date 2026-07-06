import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowRight } from "lucide-react";
import { getBlogPosts } from "@/data/blogCatalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | Çorum Hatırası, LüksLeb ve Hediyelik Leblebi",
  description:
    "Çorum Hatırası hediyelik kutuları, LüksLeb leblebi kurabiyeleri, boş ambalajlar ve kurumsal hediyelikler hakkında yazılar.",
};

export default async function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-brand-600 to-brand-500 py-16">
        <div className="container-main text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <BookOpen size={14} className="text-amber-400" />
            <span className="text-white text-sm">Blog</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-display mb-4">
            Çorum Hatırası Notları
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Hediyelik kutular, LüksLeb lezzetleri, ambalaj seçimi ve Çorum'a
            özel sunum fikirleri
          </p>
        </div>
      </div>

      <div className="container-main py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="card overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="relative aspect-video overflow-hidden bg-brand-50">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <div className="flex gap-2 mb-3 flex-wrap">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-brand-600 transition-colors font-display">
                  {post.title}
                </h2>
                <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-100">
                  <span>{post.authorName}</span>
                  <span className="flex items-center gap-1 text-brand-500 font-medium">
                    Oku <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
