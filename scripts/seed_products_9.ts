import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding products part 9...");

  const category = await prisma.category.findUnique({
    where: { slug: "corum-kuruyemis" },
  });

  if (!category) {
    console.error("Kategori bulunamadı.");
    return;
  }

  const products = [
    {
      name: "Peynirli Burgu Cips",
      slug: "peynirli-burgu-cips",
      description: "Burgu şeklinde, peynir aromalı, çıtır kuruyemişçi cipsi.",
      shortDesc: "Peynir aromalı burgu çıtır",
      basePrice: 300, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Külah Cips",
      slug: "kulah-cips",
      description: "Külah şeklinde ekstra çıtır ve lezzetli atıştırmalık kuruyemiş cipsi.",
      shortDesc: "Eğlenceli külah formunda",
      basePrice: 300, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Karışık Lüks Cips",
      slug: "karisik-luks-cips",
      description: "Külah, burgu ve diğer aromalı çıtır cipslerin enfes karışımı.",
      shortDesc: "Parti boyu lüks cips",
      basePrice: 300, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Karışık Soslu Leblebi",
      slug: "karisik-soslu-leblebi",
      description: "Peynirli, acılı ve taco soslu taze Çorum leblebilerinin mükemmel harmanı.",
      shortDesc: "Tüm sosların harika uyumu",
      basePrice: 300, // 1 kg fiyatı
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

  console.log("Dokuzuncu parti ürünler başarıyla eklendi!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
