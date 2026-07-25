import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Sadece ilk 4 ürünü tutup diğerlerini siliyoruz...");

  // En son eklenen (veya var olan) 4 ürünü seçiyoruz
  const productsToKeep = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' } // İsterseniz bunu değiştirebilirsiniz
  });

  if (productsToKeep.length === 0) {
    console.log("Veritabanında hiç ürün bulunamadı!");
    return;
  }

  const idsToKeep = productsToKeep.map(p => p.id);

  // Kalanları sil
  const toDelete = await prisma.product.findMany({
    where: {
      id: { notIn: idsToKeep }
    }
  });

  if (toDelete.length === 0) {
    console.log(`Zaten ${productsToKeep.length} adet ürün var. Silinecek fazla ürün yok.`);
    return;
  }

  console.log(`${toDelete.length} adet ürün siliniyor... (Geri alınamaz)`);

  // Ürün varyantlarını sil
  await prisma.productVariant.deleteMany({
    where: {
      productId: { notIn: idsToKeep }
    }
  });

  // Ürünleri sil
  const deleteResult = await prisma.product.deleteMany({
    where: {
      id: { notIn: idsToKeep }
    }
  });

  console.log(`✅ ${deleteResult.count} adet ürün başarıyla silindi!`);
  console.log("Mevcut kalan 4 ürün:");
  productsToKeep.forEach(p => console.log(`- ${p.name}`));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
