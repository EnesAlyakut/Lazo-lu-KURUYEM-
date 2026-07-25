import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding products part 12...");

  const category = await prisma.category.findUnique({
    where: { slug: "corum-kuruyemis" },
  });

  if (!category) {
    console.error("Kategori bulunamadı.");
    return;
  }

  const products = [
    {
      name: "Çakıl Taşı Çikolata",
      slug: "cakil-tasi-cikolata",
      description: "Gerçek çakıl taşı görünümünde, dışı renkli şeker kaplı enfes sütlü çikolata.",
      shortDesc: "Renkli çakıl taşı görünümünde",
      basePrice: 400, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Kokteyl Leblebi Karışımı",
      slug: "kokteyl-leblebi-karisimi",
      description: "Tüm soslu, tatlı ve klasik leblebi çeşitlerinin bulunduğu zengin leblebi kokteyli.",
      shortDesc: "Tüm leblebi çeşitleri bir arada",
      basePrice: 300, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Kokteyl Karışık Çerez",
      slug: "kokteyl-karisik-cerez",
      description: "Badem, kaju, fındık, leblebi ve fıstığın harmanlandığı doyurucu kokteyl çerez.",
      shortDesc: "Klasik ve doyurucu karışım",
      basePrice: 500, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: true,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Renkli Leblebi Şekeri",
      slug: "renkli-leblebi-sekeri",
      description: "Gökkuşağı renklerinde tatlı şeker kaplı çıtır leblebi draje şekeri.",
      shortDesc: "Renkli şeker kaplı leblebi",
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

  console.log("Onikinci parti ürünler başarıyla eklendi!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
