import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import FeaturesBar from "@/components/home/FeaturesBar";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BestSellers from "@/components/home/BestSellers";
import DiscountedProducts from "@/components/home/DiscountedProducts";
import WhyUs from "@/components/home/WhyUs";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import BlogPreview from "@/components/home/BlogPreview";
import { getBlogPosts } from "@/data/blogCatalog";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "FK KURUYEMİŞ | Çorum Hatırası, LüksLeb ve Hediyelik Leblebi",
  },
  description:
    "Çorum Hatırası hediyelik kutuları, LüksLeb leblebi kurabiyeleri ve özel Çorum leblebisi sunumları. Şık ambalaj, taze dolum ve hızlı teslimat.",
};

async function getHomeData() {
  const [categories, featuredProducts, bestSellers, discountedProducts] =
    await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: [{ order: "asc" }, { name: "asc" }],
        include: {
          _count: {
            select: { products: { where: { isActive: true } } },
          },
        },
      }),
      prisma.product.findMany({
        where: { isActive: true, isFeatured: true },
        orderBy: { updatedAt: "desc" },
        take: 8,
        include: {
          category: { select: { name: true, slug: true } },
          variants: { select: { id: true, weight: true, price: true, stock: true } },
          reviews: { select: { rating: true } },
        },
      }),
      prisma.product.findMany({
        where: { isActive: true, isBestSeller: true },
        orderBy: { updatedAt: "desc" },
        take: 8,
        include: {
          category: { select: { name: true, slug: true } },
          variants: { select: { id: true, weight: true, price: true, stock: true } },
          reviews: { select: { rating: true } },
        },
      }),
      prisma.product.findMany({
        where: { isActive: true, discountPrice: { not: null } },
        orderBy: { updatedAt: "desc" },
        take: 4,
        include: {
          category: { select: { name: true, slug: true } },
          variants: { select: { id: true, weight: true, price: true, stock: true } },
          reviews: { select: { rating: true } },
        },
      }),
    ]);

  const blogPosts = getBlogPosts().slice(0, 3);
  const normalizeProduct = (product: (typeof featuredProducts)[number]) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    images: toStringArray(product.images),
    basePrice: product.basePrice,
    discountPrice: product.discountPrice,
    isNatural: product.isNatural,
    isBestSeller: product.isBestSeller,
    isNew: product.isNew,
    category: product.category,
    variants: product.variants,
    reviews: product.reviews,
  });

  return {
    categories,
    featuredProducts: featuredProducts.map(normalizeProduct),
    bestSellers: bestSellers.map(normalizeProduct),
    discountedProducts: discountedProducts.map(normalizeProduct),
    blogPosts,
  };
}

function toStringArray(value: unknown) {
  const images = Array.isArray(value)
    ? value.filter(
        (item): item is string =>
          typeof item === "string" && (item.startsWith("/") || item.startsWith("http"))
      )
    : [];

  return images.length > 0 ? images : ["/images/leblebi-urun.png"];
}

export default async function HomePage() {
  const { featuredProducts, bestSellers, discountedProducts, categories, blogPosts } =
    await getHomeData();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Store",
            name: "FK KURUYEMİŞ",
            description: "Çorum Hatırası hediyelikleri, LüksLeb ürünleri ve leblebi satışı",
            url: process.env.NEXT_PUBLIC_SITE_URL,
            logo: `${process.env.NEXT_PUBLIC_SITE_URL}/images/logo_circular.png`,
            address: {
              "@type": "PostalAddress",
              addressLocality: "Çorum",
              addressCountry: "TR",
            },
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+90-555-123-45-67",
              contactType: "customer service",
              availableLanguage: "Turkish",
            },
          }),
        }}
      />

      <HeroSection />
      <FeaturesBar />
      <CategoriesSection categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <BestSellers products={bestSellers} />
      {discountedProducts.length > 0 && (
        <DiscountedProducts products={discountedProducts} />
      )}
      <WhyUs />
      <TestimonialsSection />
      <BlogPreview posts={blogPosts} />
    </>
  );
}
