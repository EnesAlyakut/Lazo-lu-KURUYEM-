import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Konya sarması ürünleri ekleniyor...");

  let category = await prisma.category.findUnique({
    where: { slug: "lokum-helva-ve-pismaniye" },
  });

  if (!category) {
    console.error("Kategori bulunamadı.");
    return;
  }

  const products = [
    {
      name: "Vanilyalı Konya Sarması",
      slug: "vanilyali-konya-sarmasi",
      description: "Özkar kalitesiyle, dışı çıtır kadayıf, içi yumuşacık vanilya aromalı nefis lokum dolgulu Konya Sarması. Şık kutusunda (Orta Boy).",
      shortDesc: "İçi vanilyalı dışı kadayıflı lokum",
      basePrice: 250, // 1 kutu fiyatı
      categoryId: category.id,
      isNatural: true,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Kakaolu Konya Sarması",
      slug: "kakaolu-konya-sarmasi",
      description: "Özkar kalitesiyle, dışı nefis çikolata soslu kadayıf kaplamalı, içi kakaolu lokum dolgulu efsane Konya Sarması. Şık kutusunda (Orta Boy).",
      shortDesc: "İçi kakaolu dışı çikolatalı lokum",
      basePrice: 250, // 1 kutu fiyatı
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
              { weight: "1 Kutu", price: prod.basePrice, stock: 50 },
            ],
          },
        },
      });
      console.log("Ürün eklendi:", created.name);
    } else {
      console.log("Ürün zaten mevcut:", existing.name);
    }
  }

  console.log("Konya sarması ekleme işlemi tamamlandı!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
