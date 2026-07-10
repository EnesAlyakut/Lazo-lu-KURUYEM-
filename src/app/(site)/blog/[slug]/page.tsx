import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";
import { getBlogPostBySlug } from "@/data/blogCatalog";
import { formatDate } from "@/lib/dateFormat";

interface Props {
  params: { slug: string };
}

function renderContent(content: string) {
  return content
    .trim()
    .split(/\n{2,}/)
    .map((block) => {
      if (block.startsWith("## ")) {
        return `<h2>${block.slice(3)}</h2>`;
      }
      if (block.startsWith("### ")) {
        return `<h3>${block.slice(4)}</h3>`;
      }
      return `<p>${block.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</p>`;
    })
    .join("");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug);

  if (!post) return { title: "Yazı Bulunamadı" };

  return {
    title: post.metaTitle || `${post.title} | LAZOĞLU KURUYEMİŞ Blog`,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: [{ url: post.coverImage }],
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    author: { "@type": "Organization", name: post.authorName },
    publisher: {
      "@type": "Organization",
      name: "LAZOĞLU KURUYEMİŞ",
      logo: { "@type": "ImageObject", url: "/images/logo_circular.png" },
    },
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="min-h-screen bg-white">
        <div className="relative h-64 md:h-96 w-full">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/55" />
        </div>

        <div className="container-main">
          <div className="max-w-3xl mx-auto py-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 text-sm font-medium mb-8"
            >
              <ArrowLeft size={14} />
              Blog'a Dön
            </Link>

            <div className="flex gap-2 mb-4 flex-wrap">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-brand-50 text-brand-600 px-3 py-1 rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-display leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center gap-6 text-sm text-gray-400 mb-8 pb-8 border-b border-gray-100 flex-wrap">
              <span className="flex items-center gap-1.5">
                <User size={14} />
                {post.authorName}
              </span>
              <span>{formatDate(post.publishedAt)}</span>
            </div>

            <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-brand-600 prose-strong:text-gray-900">
              <div
                dangerouslySetInnerHTML={{
                  __html: renderContent(post.content),
                }}
              />
            </div>

            <div className="mt-12 p-6 bg-brand-50 rounded-2xl border border-brand-100 text-center">
              <h3 className="font-bold text-gray-900 mb-2 font-display">
                Çorum Hatırası ürünlerini keşfedin
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Yazıda bahsettiğimiz hediyelik kutular, LüksLeb ürünleri ve
                özel ambalajlar ürün kataloğunda sizi bekliyor.
              </p>
              <Link href="/urunler" className="btn-primary">
                Ürünleri Keşfet
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
