import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Yeni sade çekme helva ve karışık şekerleme ekleniyor...");

  let category = await prisma.category.findUnique({
    where: { slug: "lokum-helva-ve-pismaniye" },
  });

  if (!category) {
    console.error("Kategori bulunamadı.");
    return;
  }

  const products = [
    {
      name: "Sade Çekme Helva",
      slug: "sade-cekme-helva-helvacioglu",
      description: "Meşhur Kastamonu Helvacıoğlu kalitesiyle, Osmanlı'dan günümüze geleneksel lezzet. Ağızda dağılan yapısıyla eşsiz sade çekme helva. Özel şık kutusunda.",
      shortDesc: "Geleneksel Kastamonu sade çekme helvası",
      basePrice: 250, // 1 kutu fiyatı
      categoryId: category.id,
      isNatural: true,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Karışık Şekerleme (Lezzetin Kalbi)",
      slug: "karisik-sekerleme-lezzetin-kalbi",
      description: "Özkar Şekerleme'den 'Lezzetin Kalbi' serisi. Hindistan cevizli, gül yapraklı, Antep fıstıklı ve pudra şekerli spesiyal sarmaların muhteşem uyumu. Vitray desenli şık hediye kutusunda.",
      shortDesc: "Gül yapraklı ve fıstıklı karışık spesiyal şekerleme",
      basePrice: 250, // 1 kutu fiyatı
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
