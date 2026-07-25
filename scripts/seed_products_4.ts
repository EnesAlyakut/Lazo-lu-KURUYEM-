import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding products part 4...");

  const category = await prisma.category.findUnique({
    where: { slug: "corum-kuruyemis" },
  });

  if (!category) {
    console.error("Kategori bulunamadı.");
    return;
  }

  const products = [
    {
      name: "İri Boy Beyaz Leblebi",
      slug: "iri-boy-beyaz-leblebi",
      description: "Özenle seçilmiş en iri nohutlardan elde edilen birinci sınıf beyaz leblebi.",
      shortDesc: "Ekstra İri Kalite",
      basePrice: 300, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: true,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Süper Karışık Çerez",
      slug: "super-karisik-cerez",
      description: "Çorum leblebisi, taze fıstık ve kuru üzümün en taze ve doyurucu karışımı.",
      shortDesc: "Taze ve Doyurucu",
      basePrice: 400, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: true,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Lüks Karışık Kuruyemiş",
      slug: "luks-karisik-kuruyemis",
      description: "Kaju, badem ve fındık gibi en değerli kuruyemişlerin harmanlandığı lüks karışım.",
      shortDesc: "Premium Karışım (Kaju, Badem)",
      basePrice: 800, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: true,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Cips Fıstık (Soya Soslu)",
      slug: "cips-fistik-soya-soslu",
      description: "Özel soya sosu ve baharatlarla kaplanmış dışı çıtır çıtır, içi taze fıstık.",
      shortDesc: "Eğlenceli atıştırmalık",
      basePrice: 180, // 1 kg fiyatı
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

  console.log("Dördüncü parti ürünler başarıyla eklendi!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
