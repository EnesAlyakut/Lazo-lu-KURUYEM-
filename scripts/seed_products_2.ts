import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding products part 2...");

  const category = await prisma.category.findUnique({
    where: { slug: "corum-kuruyemis" },
  });

  if (!category) {
    console.error("Kategori bulunamadı. Lütfen önce ilk scripti çalıştırın.");
    return;
  }

  const products = [
    {
      name: "Beyaz Leblebi",
      slug: "beyaz-leblebi",
      description: "Çorum'un özenle seçilmiş nohutlarından üretilen klasik beyaz leblebi.",
      shortDesc: "Klasik Çorum Lezzeti",
      basePrice: 280, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: true,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Çifte Kavrulmuş Sarı Leblebi",
      slug: "cifte-kavrulmus-sari-leblebi",
      description: "Odun ateşinde çifte kavrularak hazırlanan çıtır çıtır ekstra lezzetli sarı leblebi.",
      shortDesc: "Ekstra çıtır, çifte kavrulmuş",
      basePrice: 420, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: true,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Soslu Çıtır Leblebi",
      slug: "soslu-citir-leblebi",
      description: "Özel baharat karışımı ve çıtır kaplamasıyla harmanlanmış enfes soslu leblebi.",
      shortDesc: "Baharatlı ve çıtır",
      basePrice: 300, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Renkli Leblebi Şekeri",
      slug: "renkli-leblebi-sekeri",
      description: "Çocukların ve tatlı sevenlerin favorisi, çıtır şeker kaplı renkli leblebiler.",
      shortDesc: "Tatlı bir atıştırmalık",
      basePrice: 280, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: true,
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

  console.log("İkinci parti ürünler başarıyla eklendi!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
