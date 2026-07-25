import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding products part 14...");

  const category = await prisma.category.findUnique({
    where: { slug: "corum-kuruyemis" },
  });

  if (!category) {
    console.error("Kategori bulunamadı.");
    return;
  }

  const products = [
    {
      name: "Elmalı Leblebi Drajesi",
      slug: "elmali-leblebi-drajesi",
      description: "Yeşil elma aromalı, tatlı şeker ve çikolata kaplı nefis yeşil benekli leblebi drajesi.",
      shortDesc: "Elma aromalı yeşil draje",
      basePrice: 600, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Karışık Meyveli Benekli Draje",
      slug: "karisik-meyveli-benekli-draje",
      description: "Tüm meyve aromalarının bir araya geldiği rengarenk, eğlenceli ve lezzetli karışık draje.",
      shortDesc: "Rengarenk meyve şöleni",
      basePrice: 600, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Çilekli Leblebi Drajesi",
      slug: "cilekli-leblebi-drajesi",
      description: "Çilek aromalı pembe şeker kaplı, çıtır leblebiyle bütünleşen enfes tatlı.",
      shortDesc: "Çilek aromalı pembe draje",
      basePrice: 600, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Portakallı Leblebi Drajesi",
      slug: "portakalli-leblebi-drajesi",
      description: "Portakalın ferahlatıcı tadı ile leblebinin çıtırlığını buluşturan turuncu draje.",
      shortDesc: "Portakal aromalı turuncu draje",
      basePrice: 600, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Tiramisu Aromalı Leblebi Drajesi",
      slug: "tiramisu-aromali-leblebi-drajesi",
      description: "Kahve ve karamel notaları barındıran, tiramisu lezzetinde premium kahverengi benekli draje.",
      shortDesc: "Özel kahve & tiramisu aroması",
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

  console.log("Ondördüncü parti ürünler başarıyla eklendi!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
