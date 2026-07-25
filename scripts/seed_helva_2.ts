import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Yeni helva ve pişmaniye ürünleri ekleniyor...");

  let category = await prisma.category.findUnique({
    where: { slug: "lokum-helva-ve-pismaniye" },
  });

  if (!category) {
    console.error("Kategori bulunamadı.");
    return;
  }

  const products = [
    {
      name: "Antep Fıstıklı Çekme Helva (Lüks)",
      slug: "luks-antep-fistikli-cekme-helva",
      description: "Helvacıoğlu kalitesiyle, Osmanlı'dan günümüze geleneksel lezzet. İçi bol Antep fıstığı parçacıklı, ağızda dağılan nefis çekme helva. Şık sunumlu kutusunda.",
      shortDesc: "Bol fıstıklı geleneksel çekme helva",
      basePrice: 300, // 1 kutu fiyatı
      categoryId: category.id,
      isNatural: true,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Çikolatalı Pişmaniye",
      slug: "cikolatali-pismaniye",
      description: "Adıbelli ustalarının elinden, dışı nefis bitter çikolata kaplı, içi tel tel dökülen efsane pişmaniye topları. Özel kutusunda enfes lezzet.",
      shortDesc: "Çikolata kaplı pişmaniye topları",
      basePrice: 200, // 1 kutu fiyatı
      categoryId: category.id,
      isNatural: true,
      isFeatured: true,
      isActive: true,
    }
  ];

  for (const prod of products) {
    const existing = await prisma.product.findUnique({
      where: { slug: prod.slug },
    });

    if (!existing) {
      const created = await prisma.product.create({
        data: {
          ...prod,
          images: "[]",
          variants: {
            create: [
              { weight: "1 Kutu", price: prod.basePrice, stock: 50 },
            ],
          },
        },
      });
      console.log("Ürün eklendi:", created.name);
    } else {
      console.log("Ürün zaten mevcut:", existing.name);
    }
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
