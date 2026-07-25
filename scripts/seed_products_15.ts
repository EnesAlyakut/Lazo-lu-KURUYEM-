import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding products part 15...");

  const category = await prisma.category.findUnique({
    where: { slug: "corum-kuruyemis" },
  });

  if (!category) {
    console.error("Kategori bulunamadı.");
    return;
  }

  const products = [
    {
      name: "Böğürtlen Aromalı Leblebi Drajesi",
      slug: "bogurtlen-aromali-leblebi-drajesi",
      description: "Nefis böğürtlen aromasıyla tatlandırılmış mor renkli çıtır leblebi draje.",
      shortDesc: "Mor renkli böğürtlen aroması",
      basePrice: 600, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Gökkuşağı Leblebi Şekeri",
      slug: "gokkusagi-leblebi-sekeri",
      description: "Klasik ve canlı renklerden oluşan, her rengin farklı bir neşe kattığı gökkuşağı draje karışımı.",
      shortDesc: "Canlı renkli draje karışımı",
      basePrice: 400, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Tropikal Aromalı Leblebi Drajesi",
      slug: "tropikal-aromali-leblebi-drajesi",
      description: "Mango, ananas ve böğürtlen gibi tropikal meyve notalarına sahip, pastel renkli lüks karışım.",
      shortDesc: "Tropikal meyve notaları",
      basePrice: 600, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Kurabiye Aromalı Leblebi Drajesi",
      slug: "kurabiye-aromali-leblebi-drajesi",
      description: "Damla çikolatalı kurabiye tadında, beyaz üzerine kahverengi benekli enfes leblebi draje.",
      shortDesc: "Çikolata parçacıklı kurabiye tadı",
      basePrice: 600, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Krokanlı Çıtır Leblebi",
      slug: "krokanli-citir-leblebi",
      description: "Karamelize şeker ve özel çıtır kaplamasıyla fırınlanmış çok özel krokanlı leblebi.",
      shortDesc: "Karamelize ekstra çıtır",
      basePrice: 500, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
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
              { weight: "250g", price: prod.basePrice * 0.25, stock: 100 },
              { weight: "500g", price: prod.basePrice * 0.50, stock: 100 },
              { weight: "1kg", price: prod.basePrice, stock: 100 },
            ],
          },
        },
      });
      console.log("Ürün eklendi:", created.name);
    } else {
      console.log("Ürün zaten mevcut:", existing.name);
    }
  }

  console.log("Onbeşinci parti ürünler başarıyla eklendi!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
