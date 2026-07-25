import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Çikolata kaplamalı helva ve pişmaniye ürünleri ekleniyor...");

  let category = await prisma.category.findUnique({
    where: { slug: "lokum-helva-ve-pismaniye" },
  });

  if (!category) {
    console.error("Kategori bulunamadı.");
    return;
  }

  const products = [
    {
      name: "Çikolata Kaplamalı Saray Helvası",
      slug: "cikolata-kaplamali-saray-helvasi",
      description: "Adıbelli Şekerleme'den enfes bir lezzet: Geleneksel saray helvasının dışı nefis bitter çikolata ile kaplanmış hali. Ağızda dağılan iç yapısı ve çıtır çikolatasıyla eşsiz bir deneyim.",
      shortDesc: "Çikolata kaplı geleneksel saray helvası",
      basePrice: 250, // 1 kutu fiyatı
      categoryId: category.id,
      isNatural: true,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Çikolata Kaplamalı Pişmaniye",
      slug: "cikolata-kaplamali-pismaniye",
      description: "Adıbelli kalitesiyle, klasik tel tel pişmaniyenin enfes çikolatayla buluşmuş özel üretim (Lüks) versiyonu. Şık kutusunda harika bir ikramlık.",
      shortDesc: "Lüks çikolata kaplı pişmaniye",
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
