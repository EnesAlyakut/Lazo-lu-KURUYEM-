import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding products part 8...");

  const category = await prisma.category.findUnique({
    where: { slug: "corum-kuruyemis" },
  });

  if (!category) {
    console.error("Kategori bulunamadı.");
    return;
  }

  const products = [
    {
      name: "Peynir Soslu Leblebi",
      slug: "peynir-soslu-leblebi",
      description: "Taze Çorum leblebisinin enfes peynir aromasıyla buluştuğu çıtır lezzet.",
      shortDesc: "Peynir aromalı çıtır lezzet",
      basePrice: 300, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Siyah Mürdüm Erik Kurusu",
      slug: "siyah-murdum-erik-kurusu",
      description: "Güneşte kurutulmuş, sindirim dostu ve lif kaynağı doğal siyah mürdüm eriği kurusu.",
      shortDesc: "Doğal lif kaynağı",
      basePrice: 500, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: true,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Taco Soslu Leblebi",
      slug: "taco-soslu-leblebi",
      description: "Meksika taco baharatlarıyla harmanlanmış, hafif baharatlı gurme soslu leblebi.",
      shortDesc: "Gurme Meksika baharatı",
      basePrice: 300, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Acılı Leblebi",
      slug: "acili-leblebi",
      description: "Acı sevenler için özel acı baharat karışımıyla kaplanmış çıtır Çorum leblebisi.",
      shortDesc: "Acı sevenler için",
      basePrice: 300, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: false,
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

  console.log("Sekizinci parti ürünler başarıyla eklendi!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
