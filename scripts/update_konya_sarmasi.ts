import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Ürün adları güncelleniyor ve yeni ürün ekleniyor...");

  let category = await prisma.category.findUnique({
    where: { slug: "lokum-helva-ve-pismaniye" },
  });

  if (!category) {
    console.error("Kategori bulunamadı.");
    return;
  }

  // 1. Rename existing "vanilyali-konya-sarmasi" to "Sade Konya Sarması"
  const existingSade = await prisma.product.findUnique({
    where: { slug: "vanilyali-konya-sarmasi" },
  });

  if (existingSade) {
    await prisma.product.update({
      where: { slug: "vanilyali-konya-sarmasi" },
      data: {
        name: "Sade Konya Sarması",
        slug: "sade-konya-sarmasi",
        shortDesc: "İçi sade, dışı kadayıflı lokum",
        description: "Özkar kalitesiyle, dışı çıtır kadayıf, içi yumuşacık sade lokum dolgulu Konya Sarması. Şık kutusunda (Orta Boy).",
      },
    });
    console.log("Eski 'Vanilyalı' ürünün adı 'Sade Konya Sarması' olarak değiştirildi.");
  } else {
    console.log("Eski 'Vanilyalı' ürün bulunamadı. (Belki zaten değiştirilmiştir?)");
  }

  // 2. Add the NEW "Vanilyalı Konya Sarması" (the white one with coconut)
  const newVanilyali = await prisma.product.findUnique({
    where: { slug: "vanilyali-konya-sarmasi" },
  });

  if (!newVanilyali) {
    const created = await prisma.product.create({
      data: {
        name: "Vanilyalı Konya Sarması",
        slug: "vanilyali-konya-sarmasi", // Reusing the slug since the old one is now "sade-konya-sarmasi"
        description: "Özkar kalitesiyle, dışı Hindistan cevizi kaplı, içi enfes vanilyalı lokum dolgulu bembeyaz Konya Sarması. Şık kutusunda (Orta Boy).",
        shortDesc: "Hindistan cevizi kaplı vanilyalı lokum",
        basePrice: 250, // 1 kutu fiyatı
        categoryId: category.id,
        isNatural: true,
        isFeatured: true,
        isActive: true,
        images: "[]",
        variants: {
          create: [
            { weight: "1 Kutu", price: 250, stock: 50 },
          ],
        },
      },
    });
    console.log("Yeni bembeyaz 'Vanilyalı Konya Sarması' başarıyla eklendi:", created.name);
  } else {
    console.log("Vanilyalı Konya Sarması zaten mevcut.");
  }

  console.log("İşlem tamamlandı!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
