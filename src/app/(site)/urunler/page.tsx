import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProductsClient from "./ProductsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tüm Ürünler | Çorum Hatırası, LüksLeb ve Hediyelik Kutular",
  description:
    "LAZOĞLU KURUYEMİŞ ürün kataloğu. Çorum Hatırası kutular, LüksLeb kurabiyeleri, karışık hediyelikler, boş ambalajlar ve hatıra ürünleri.",
};

interface SearchParams {
  kategori?: string;
  filtre?: string;
  ara?: string;
  sayfa?: string;
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

export default async function UrunlerPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { kategori, filtre, ara, sayfa } = searchParams;
  const page = Number.parseInt(sayfa || "1", 10) || 1;
  const perPage = 12;

  const where = {
    isActive: true,
    ...(kategori ? { category: { slug: kategori } } : {}),
    ...(filtre === "cok-satan" ? { isBestSeller: true } : {}),
    ...(filtre === "yeni" ? { isNew: true } : {}),
    ...(filtre === "indirimli" ? { discountPrice: { not: null } } : {}),
    ...(filtre === "dogal" ? { isNatural: true } : {}),
    ...(ara?.trim()
      ? {
          OR: [
            { name: { contains: ara.trim() } },
            { description: { contains: ara.trim() } },
            { shortDesc: { contains: ara.trim() } },
          ],
        }
      : {}),
  };

  const [products, totalCount, categories, activeCategory] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        variants: { orderBy: { price: "asc" } },
        reviews: {
          where: { isApproved: true },
          select: { rating: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
    }),
    kategori
      ? prisma.category.findFirst({
          where: { slug: kategori, isActive: true },
          select: { id: true, name: true, slug: true },
        })
      : Promise.resolve(null),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / perPage));
  const normalizedProducts = products.map((product) => ({
    ...product,
    images: toStringArray(product.images),
  }));

  return (
    <ProductsClient
      products={normalizedProducts}
      categories={categories}
      totalCount={totalCount}
      totalPages={totalPages}
      currentPage={page}
      activeCategory={activeCategory}
      searchParams={searchParams}
    />
  );
}
