import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding products part 17...");

  const category = await prisma.category.findUnique({
    where: { slug: "corum-kuruyemis" },
  });

  if (!category) {
    console.error("Kategori bulunamadı.");
    return;
  }

  const products = [
    {
      name: "Beyaz Badem Şekeri",
      slug: "beyaz-badem-sekeri",
      description: "Taze kavrulmuş iri bademlerin incecik beyaz şeker katmanıyla kaplanmış geleneksel lezzeti.",
      shortDesc: "Geleneksel beyaz badem şekeri",
      basePrice: 600, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Sütlü Çikolatalı Leblebi Drajesi",
      slug: "sutlu-cikolatali-leblebi-drajesi",
      description: "Çorum'un taze leblebilerinin gerçek sütlü çikolatayla ustaca harmanlandığı draje.",
      shortDesc: "Leblebi ve çikolata uyumu",
      basePrice: 500, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Sütlü Çikolatalı Fındık Drajesi",
      slug: "sutlu-cikolatali-findik-drajesi",
      description: "Giresun fındığının en kalitelilerinin bol sütlü çikolata ile sarıldığı lüks draje.",
      shortDesc: "Çikolatalı lüks fındık draje",
      basePrice: 800, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Sütlü Çikolatalı Kuru Üzüm Drajesi",
      slug: "sutlu-cikolatali-kuru-uzum-drajesi",
      description: "Seçme kuru üzümlerin tatlı sütlü çikolata katmanıyla buluştuğu çubuk draje lezzeti.",
      shortDesc: "Çikolata kaplı kuru üzüm",
      basePrice: 450, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Bıldırcın Yumurtası Draje",
      slug: "bildircin-yumurtasi-draje",
      description: "Mermer ve bıldırcın yumurtası deseniyle çok şık görünen, bol lezzetli özel draje.",
      shortDesc: "Özel desenli lüks draje",
      basePrice: 700, // 1 kg fiyatı
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

  console.log("Onyedinci parti ürünler başarıyla eklendi!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
