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

  return databasePosts.map((post) => ({
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
}

export async function getPublicBlogPostBySlug(slug: string) {
  const posts = await getPublicBlogPosts();
  return posts.find((post) => post.slug === slug);
}
