import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { withoutBrandSuffix } from "@/lib/metadata";
import ProductDetailClient from "./ProductDetailClient";

export const revalidate = 60; // Cache product details for 60 seconds

interface Props {
  params: Promise<{ slug: string }>;
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter(
        (item): item is string =>
          typeof item === "string" &&
          (item.startsWith("/") || /^https?:\/\//.test(item))
      )
    : [];
}

async function getProduct(slug: string) {
  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      variants: { orderBy: { price: "asc" } },
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          authorName: true,
          rating: true,
          comment: true,
          createdAt: true,
        },
      },
    },
  });

  return product ? { ...product, images: toStringArray(product.images) } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) return { title: "Urun Bulunamadi" };

  return {
    title: withoutBrandSuffix(product.metaTitle || product.name),
    description:
      product.metaDescription || product.description.substring(0, 155),
    openGraph: {
      title: product.metaTitle || product.name,
      description: product.metaDescription || product.description.substring(0, 155),
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const relatedProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      variants: { orderBy: { price: "asc" } },
      reviews: {
        where: { isApproved: true },
        select: { rating: true },
      },
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  const related = relatedProducts.map((item) => ({
    ...item,
    images: toStringArray(item.images),
  }));

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: { "@type": "Brand", name: "LAZOĞLU KURUYEMİŞ" },
    offers: {
      "@type": "Offer",
      price: (product.discountPrice || product.basePrice).toFixed(2),
      priceCurrency: "TRY",
      availability:
        product.totalStock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    aggregateRating:
      product.reviews.length > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: (
              product.reviews.reduce((sum, review) => sum + review.rating, 0) /
              product.reviews.length
            ).toFixed(1),
            reviewCount: product.reviews.length,
          }
        : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductDetailClient product={product} related={related} />
    </>
  );
}
