import { prisma } from "./src/lib/prisma";
import { blogPosts } from "./src/data/blogCatalog";

async function main() {
  console.log("Seeding blog posts...");
  for (const post of blogPosts) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: post.slug }
    });
    
    if (!existing) {
      await prisma.blogPost.create({
        data: {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          authorName: post.authorName,
          tags: post.tags,
          isPublished: post.isPublished,
          publishedAt: post.publishedAt,
          metaTitle: post.metaTitle,
          metaDescription: post.metaDescription,
        }
      });
      console.log(`Created: ${post.title}`);
    } else {
      console.log(`Skipped (already exists): ${post.title}`);
    }
  }
  console.log("Done!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
