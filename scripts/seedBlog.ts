import { PrismaClient } from "@prisma/client";
import { blogPosts } from "../src/data/blogCatalog";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding blog posts...");

  for (const post of blogPosts) {
    const exists = await prisma.blogPost.findUnique({
      where: { slug: post.slug },
    });

    if (!exists) {
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
        },
      });
      console.log(`Created post: ${post.title}`);
    } else {
      console.log(`Skipped existing post: ${post.title}`);
    }
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
