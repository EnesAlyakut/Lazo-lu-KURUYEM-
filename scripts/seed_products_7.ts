import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding products part 7...");

  const category = await prisma.category.findUnique({
    where: { slug: "corum-kuruyemis" },
  });

  if (!category) {
    console.error("Kategori bulunamadı.");
    return;
  }

  const products = [
    {
      name: "Dakota Ay Çekirdeği",
      slug: "dakota-ay-cekirdegi",
      description: "İri taneli, taptaze kavrulmuş yerli Dakota cinsi siyah ay çekirdeği.",
      shortDesc: "İri taneli taze",
      basePrice: 200, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: true,
      isFeatured: false,
      isBestSeller: true,
      isActive: true,
    },
    {
      name: "Kırmızı Erik Kurusu",
      slug: "kirmizi-erik-kurusu",
      description: "Doğal yollarla kurutulmuş, mayhoş tatlı ve bol vitaminli kırmızı erik kurusu.",
      shortDesc: "Mayhoş ve vitaminli",
      basePrice: 600, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: true,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Soslu Kavrulmuş Mısır",
      slug: "soslu-kavrulmus-misir",
      description: "Özel baharat sosuyla kavrulmuş, ekstra çıtır mısır çerezi.",
      shortDesc: "Çıtır çıtır lezzet",
      basePrice: 300, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Turna Yemişi (Cranberry)",
      slug: "turna-yemisi-cranberry",
      description: "Antioksidan deposu, lezzetli ve taze ithal kırmızı turna yemişi (Cranberry).",
      shortDesc: "Antioksidan deposu",
      basePrice: 450, // 1 kg fiyatı
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

  console.log("Yedinci parti ürünler başarıyla eklendi!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
