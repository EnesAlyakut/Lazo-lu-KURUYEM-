import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding products part 6...");

  const category = await prisma.category.findUnique({
    where: { slug: "corum-kuruyemis" },
  });

  if (!category) {
    console.error("Kategori bulunamadı.");
    return;
  }

  const products = [
    {
      name: "Tuzlu Kavrulmuş Kabak Çekirdeği",
      slug: "tuzlu-kavrulmus-kabak-cekirdegi",
      description: "İnce kabuklu, bol içli ve çıtır çıtır kavrulmuş yerli Nevşehir kabak çekirdeği.",
      shortDesc: "İnce kabuk, bol iç",
      basePrice: 300, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: true,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Kavrulmuş Antep Fıstığı",
      slug: "kavrulmus-antep-fistigi",
      description: "Özel kavrulmuş, anaçlak kalite, iri boy ve bol içli meşhur Antep fıstığı.",
      shortDesc: "İri boy, bol içli",
      basePrice: 750, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: true,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Kavrulmuş Giresun Fındık İçi",
      slug: "kavrulmus-giresun-findik-ici",
      description: "Dünyanın en kaliteli fındıklarından, taze kavrulmuş Giresun kalite tombul fındık içi.",
      shortDesc: "Taze kavrulmuş Giresun kalite",
      basePrice: 600, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: true,
      isFeatured: true,
      isBestSeller: true,
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

  console.log("Altıncı parti ürünler başarıyla eklendi!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
