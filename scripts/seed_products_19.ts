import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding products part 19...");

  const category = await prisma.category.findUnique({
    where: { slug: "corum-kuruyemis" },
  });

  if (!category) {
    console.error("Kategori bulunamadı.");
    return;
  }

  const products = [
    {
      name: "Lüks Kahveli Draje Karışımı",
      slug: "luks-kahveli-draje-karisimi",
      description: "Kahve çekirdeği, tiramisu ve moka aromalarının bir arada sunulduğu özel çikolatalı kahve draje karışımı.",
      shortDesc: "Premium kahve aromalı karışım",
      basePrice: 600, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Renkli Fasulye Şeker (Jelly Bean)",
      slug: "renkli-fasulye-seker-jelly-bean",
      description: "Her renginde farklı bir meyve aroması saklı, yumuşak içi ve çıtır dış kaplamasıyla fasulye şeker.",
      shortDesc: "Meyveli klasik fasulye şeker",
      basePrice: 400, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Meşhur Çifte Kavrulmuş Sarı Leblebi",
      slug: "meshur-cifte-kavrulmus-sari-leblebi",
      description: "Çorum'un tescilli lezzeti! Geleneksel odun ateşinde ekstra kavrularak elde edilen, çıtır çıtır klasik sarı leblebi.",
      shortDesc: "Çorum'un efsanevi sarı leblebisi",
      basePrice: 300, // 1 kg fiyatı
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

  console.log("Ondokuzuncu parti ürünler başarıyla eklendi!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
