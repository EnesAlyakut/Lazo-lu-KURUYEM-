import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding products...");

  // Kategori oluştur veya bul
  let category = await prisma.category.findUnique({
    where: { slug: "corum-kuruyemis" },
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: "Çorum Kuruyemiş",
        slug: "corum-kuruyemis",
        description: "Çorum'un meşhur taze kavrulmuş kuruyemişleri",
        isActive: true,
      },
    });
    console.log("Kategori oluşturuldu:", category.name);
  }

  const products = [
    {
      name: "Karışık Çerez (Özel)",
      slug: "karisik-cerez-ozel",
      description: "Leblebi, kuru üzüm ve fıstık içeren enerji deposu özel karışım çerez.",
      shortDesc: "Enerji deposu karışık çerez",
      basePrice: 450, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: true,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Sarı Leblebi ve Kuru Üzüm",
      slug: "sari-leblebi-kuru-uzum",
      description: "Çorum'un meşhur sarı leblebisi ile taze kuru üzümün muhteşem uyumu.",
      shortDesc: "Geleneksel lezzet",
      basePrice: 380, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: true,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Susamlı Fıstık",
      slug: "susamli-fistik",
      description: "Taze kavrulmuş yer fıstığının çıtır susam kaplamasıyla lezzet şöleni.",
      shortDesc: "Çıtır lezzet",
      basePrice: 300, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Çorum Sarı Leblebi",
      slug: "corum-sari-leblebi",
      description: "Odun ateşinde çifte kavrulmuş, coğrafi işaretli meşhur Çorum sarı leblebisi.",
      shortDesc: "Meşhur Çorum Leblebisi",
      basePrice: 400, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: true,
      isFeatured: true,
      isBestSeller: true,
      isActive: true,
    },
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
