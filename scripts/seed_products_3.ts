import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding products part 3...");

  const category = await prisma.category.findUnique({
    where: { slug: "corum-kuruyemis" },
  });

  if (!category) {
    console.error("Kategori bulunamadı. Lütfen önce ilk scripti çalıştırın.");
    return;
  }

  const products = [
    {
      name: "Klasik Karışık Çerez",
      slug: "klasik-karisik-cerez",
      description: "Leblebi, fıstık ve kuru üzümün uyumuyla hazırlanan ekonomik ve lezzetli klasik karışım.",
      shortDesc: "Ekonomik ve lezzetli karışım",
      basePrice: 350, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: true,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Sarı Kuru Üzüm (Sultaniye)",
      slug: "sari-kuru-uzum-sultaniye",
      description: "Özenle kurutulmuş, tatlı ve besleyici doğal çekirdeksiz sarı Sultaniye kuru üzüm.",
      shortDesc: "Doğal çekirdeksiz tat",
      basePrice: 280, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: true,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Siyah Kuru Üzüm",
      slug: "siyah-kuru-uzum",
      description: "Kan yapıcı özelliğiyle bilinen, güneşte kurutulmuş doğal ve iri taneli siyah üzüm.",
      shortDesc: "Enerji ve şifa kaynağı",
      basePrice: 350, // 1 kg fiyatı
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

  console.log("Üçüncü parti ürünler başarıyla eklendi!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
