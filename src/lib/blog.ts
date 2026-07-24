import { getBlogPosts } from "@/data/blogCatalog";
import { prisma } from "@/lib/prisma";

export interface PublicBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  authorName: string;
  tags: string[];
  publishedAt: Date;
  updatedAt: Date;
  metaTitle: string;
  metaDescription: string;
  content: string;
}

function normalizeTags(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((tag): tag is string => typeof tag === "string")
    : [];
}

export async function getPublicBlogPosts(): Promise<PublicBlogPost[]> {
  const databasePosts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });

  const normalizedDatabasePosts: PublicBlogPost[] = databasePosts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || "",
    coverImage: post.coverImage || "/images/hero-bg.jpg",
    authorName: post.authorName,
    tags: normalizeTags(post.tags),
    publishedAt: post.publishedAt || post.createdAt,
    updatedAt: post.updatedAt,
    metaTitle: post.metaTitle || post.title,
    metaDescription: post.metaDescription || post.excerpt || "",
    content: post.content,
  }));

  const databaseSlugs = new Set(normalizedDatabasePosts.map((post) => post.slug));
  const catalogPosts = getBlogPosts().filter((post) => !databaseSlugs.has(post.slug));

  return [...normalizedDatabasePosts, ...catalogPosts].sort(
    (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
  );
}

export async function getPublicBlogPostBySlug(slug: string) {
  const posts = await getPublicBlogPosts();
  return posts.find((post) => post.slug === slug);
}
