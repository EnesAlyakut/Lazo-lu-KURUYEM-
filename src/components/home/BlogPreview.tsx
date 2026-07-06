import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";

export default function BlogPreview({ posts }: { posts: any[] }) {
  if (!posts.length) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container-main">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={18} className="text-brand-500" />
              <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider">
                Blog
              </span>
            </div>
            <h2 className="section-title">Çorum Hatırası Notları</h2>
            <p className="section-subtitle">
              Hediyelik kutular, LüksLeb lezzetleri ve özel sunum fikirleri
            </p>
          </div>
          <Link href="/blog" className="btn-secondary gap-2">
            Tüm Yazılar <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="card overflow-hidden group"
            >
              <div className="relative aspect-video overflow-hidden bg-brand-50">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen size={40} className="text-brand-300" />
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors font-display">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
                  <span>{post.authorName}</span>
                  {post.publishedAt && (
                    <span>
                      {post.publishedAt
                        ? new Date(post.publishedAt).toISOString().slice(0, 10).split("-").reverse().join(".")
                        : ""}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
