import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowRight, User, Clock } from "lucide-react";
import { getPublicBlogPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | Çorum Hatırası, LüksLeb ve Hediyelik Leblebi",
  description:
    "Çorum Hatırası hediyelik kutuları, LüksLeb leblebi kurabiyeleri, boş ambalajlar ve kurumsal hediyelikler hakkında yazılar.",
};

export default async function BlogPage() {
  const posts = await getPublicBlogPosts();
  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      {/* Magazine Hero Section */}
      <section className="relative pt-12 pb-16 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[30rem] h-[30rem] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container-main relative z-10 text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-50 text-brand-700 font-semibold text-sm mb-6 shadow-sm border border-brand-100">
            <BookOpen size={16} />
            <span className="tracking-wide">Lazoğlu Blog</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 font-display mb-6">
            Lezzet ve Gelenek <br/> <span className="text-brand-600">Üzerine Notlar</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Kuruyemişin incelikleri, taze kalma sırları, hediye kutusu seçimi ve yöresel lezzetlerimiz hakkında bilmeniz gereken her şey.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="container-main relative z-10">
            <Link 
              href={`/blog/${featuredPost.slug}`}
              className="group block relative rounded-[2.5rem] overflow-hidden bg-white shadow-2xl border border-gray-100 hover:shadow-warm-lg transition-all duration-500"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative aspect-video lg:aspect-auto lg:h-[500px] overflow-hidden">
                  <Image 
                    src={featuredPost.coverImage} 
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                </div>
                
                <div className="p-8 sm:p-12 flex flex-col justify-center bg-white relative">
                  <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-50 rounded-full blur-3xl opacity-50" />
                  <div className="flex flex-wrap gap-2 mb-6">
                    {featuredPost.tags.map(tag => (
                      <span key={tag} className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1.5 rounded-xl">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-display mb-6 group-hover:text-brand-600 transition-colors leading-tight">
                    {featuredPost.title}
                  </h2>
                  
                  <p className="text-gray-600 text-lg mb-8 line-clamp-3 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                      <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                        <User size={14} className="text-brand-500" />
                        <span>{featuredPost.authorName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                        <Clock size={14} className="text-brand-500" />
                        <span>5 dk okuma</span>
                      </div>
                    </div>
                    <span className="flex items-center gap-2 text-brand-600 font-bold bg-brand-50 hover:bg-brand-100 px-5 py-2.5 rounded-xl transition-colors">
                      Makaleyi Oku <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}
      </section>

      {/* Article Grid */}
      <section className="container-main pt-8">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-2xl font-bold text-gray-900 font-display">Tüm Yazılar</h3>
          <div className="h-px bg-gray-200 flex-1 ml-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {regularPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-4 left-4 flex gap-1">
                  {post.tags.slice(0, 1).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-bold text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="p-6 sm:p-8 flex-1 flex flex-col">
                <h4 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-brand-600 transition-colors font-display leading-snug">
                  {post.title}
                </h4>
                
                <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-400 pt-5 border-t border-gray-100/80">
                  <span className="font-medium text-gray-700 flex items-center gap-1.5">
                    <User size={14} className="text-brand-400" />
                    {post.authorName}
                  </span>
                  <span className="font-medium flex items-center gap-1.5">
                    <Clock size={14} className="text-gray-300" />
                    5 dk okuma
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
