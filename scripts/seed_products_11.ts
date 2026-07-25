import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding products part 11...");

  const category = await prisma.category.findUnique({
    where: { slug: "corum-kuruyemis" },
  });

  if (!category) {
    console.error("Kategori bulunamadı.");
    return;
  }

  const products = [
    {
      name: "Susamlı Fıstık",
      slug: "susamli-fistik",
      description: "Çıtır çıtır susamla kaplanmış, ballı kavrulmuş enfes yer fıstığı.",
      shortDesc: "Susamlı ballı lezzet",
      basePrice: 300, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Ekstra Çıtır Cips Fıstık",
      slug: "ekstra-citir-cips-fistik",
      description: "Dışı ekstra çıtır cips kaplı, içi taze kavrulmuş leziz atıştırmalık fıstık.",
      shortDesc: "Ekstra çıtır kaplama",
      basePrice: 200, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Özel Kavrulmuş Lüks Çerez",
      slug: "ozel-kavrulmus-luks-cerez",
      description: "Badem, kaju, fındık ve fıstıktan oluşan tam kıvamında kavrulmuş ekstra lüks karışım.",
      shortDesc: "Tam kıvamında kavrulmuş",
      basePrice: 800, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: true,
      isFeatured: true,
      isBestSeller: true,
      isActive: true,
    },
    {
      name: "Meyveli Atom Karışım",
      slug: "meyveli-atom-karisim",
      description: "Kuru meyveler (incir, kayısı, erik, üzüm) ve lüks kuruyemişlerin efsanevi atom buluşması.",
      shortDesc: "Meyve ve kuruyemiş şöleni",
      basePrice: 750, // 1 kg fiyatı
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

  console.log("Onbirinci parti ürünler başarıyla eklendi!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
