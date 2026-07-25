import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding products part 5...");

  const category = await prisma.category.findUnique({
    where: { slug: "corum-kuruyemis" },
  });

  if (!category) {
    console.error("Kategori bulunamadı.");
    return;
  }

  const products = [
    {
      name: "Benekli (Sakız) Leblebi",
      slug: "benekli-sakiz-leblebi",
      description: "Çorum'un geleneksel ustalıkla kavrulmuş, hafif kıtır ve nefis benekli sakız leblebisi.",
      shortDesc: "Geleneksel lezzet",
      basePrice: 350, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: true,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Tuzsuz Çiğ Yer Fıstığı",
      slug: "tuzsuz-cig-yer-fistigi",
      description: "Kabuksuz, tuzsuz ve doğal yer fıstığı. Diyetleriniz için enerji deposu.",
      shortDesc: "Doğal enerji deposu",
      basePrice: 300, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: true,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Doğal Kuru Dut",
      slug: "dogal-kuru-dut",
      description: "Özel seçilmiş, güneşte doğal yollarla kurutulmuş enfes tatlı kuru dut.",
      shortDesc: "Doğal ve çok tatlı",
      basePrice: 450, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: true,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Kavrulmuş Tuzlu Yer Fıstığı",
      slug: "kavrulmus-tuzlu-yer-fistigi",
      description: "Tam kıvamında kavrulmuş, lezzetini artıran hafif tuzlu yer fıstığı.",
      shortDesc: "Taze kavrulmuş lezzet",
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

  console.log("Beşinci parti ürünler başarıyla eklendi!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
