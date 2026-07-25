import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding products part 18...");

  const category = await prisma.category.findUnique({
    where: { slug: "corum-kuruyemis" },
  });

  if (!category) {
    console.error("Kategori bulunamadı.");
    return;
  }

  const products = [
    {
      name: "Beyaz Çikolatalı Fındık Drajesi",
      slug: "beyaz-cikolatali-findik-drajesi",
      description: "Giresun fındığının en kaliteli beyaz çikolatayla ustaca sarıldığı nefis lezzet.",
      shortDesc: "Beyaz çikolatalı fındık",
      basePrice: 600, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Yaban Mersinli Mavi Draje",
      slug: "yaban-mersinli-mavi-draje",
      description: "Nefis yaban mersini aromasıyla tatlandırılmış, göz alıcı mavi renkli tatlı draje.",
      shortDesc: "Yaban mersini aromalı mavi draje",
      basePrice: 600, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Karamelli Sütlü Draje",
      slug: "karamelli-sutlu-draje",
      description: "Karamel ve sütlü çikolatanın ağızda dağılan eşsiz uyumunu sunan lezzetli draje.",
      shortDesc: "Karamel ve sütlü çikolata lezzeti",
      basePrice: 600, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Bitter Çikolatalı Leblebi Drajesi",
      slug: "bitter-cikolatali-leblebi-drajesi",
      description: "Yoğun bitter çikolata sevenler için, çıtır leblebili premium bitter draje.",
      shortDesc: "Yoğun bitter çikolata",
      basePrice: 600, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Mega Lüks Draje Kokteyli",
      slug: "mega-luks-draje-kokteyli",
      description: "Meyveli, renkli, çikolatalı drajeler ile çıtır krokanlı leblebilerin devasa kokteyl şöleni.",
      shortDesc: "Tüm drajeler ve krokanlar bir arada",
      basePrice: 600, // 1 kg fiyatı
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

  console.log("Onsekizinci parti ürünler başarıyla eklendi!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
