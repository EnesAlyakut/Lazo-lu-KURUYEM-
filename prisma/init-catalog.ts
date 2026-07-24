import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const productCount = await prisma.product.count();
  await prisma.$disconnect();

  if (productCount > 0) {
    console.log(`Katalog zaten hazır (${productCount} ürün); başlangıç senkronu atlandı.`);
    return;
  }

  console.log("Boş veritabanı algılandı; başlangıç kataloğu yükleniyor.");
  await import("./sync-catalog");
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
