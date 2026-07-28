import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const categories = await prisma.$queryRaw`SELECT * FROM categories LIMIT 1`;
    console.log(categories);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
