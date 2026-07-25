import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Ganik lokumları ekleniyor...");

  let category = await prisma.category.findUnique({
    where: { slug: "lokum-helva-ve-pismaniye" },
  });

  if (!category) {
    console.error("Kategori bulunamadı.");
    return;
  }

  const products = [
    {
      name: "Ganik Kuru Meyveli Lokum",
      slug: "ganik-kuru-meyveli-lokum",
      description: "Çorum'un köklü markası Ganik'ten, içerisinde nefis kuru meyve parçacıkları (incir, kayısı vb.) ve kuruyemişler bulunan özel glutensiz lokum. 750g'lık şık kutusunda (Turkish Delight with Nuts).",
      shortDesc: "Kuru meyveli ve yemişli özel lokum (750g)",
      basePrice: 120, // Çorum piyasası ortalaması
      categoryId: category.id,
      isNatural: true,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Ganik Sade Lokum",
      slug: "ganik-sade-lokum",
      description: "Ganik Şekerleme'nin 1953'ten bugüne değişmeyen geleneksel tarifiyle üretilmiş, yumuşacık glutensiz sade lokum. 750g'lık kutusunda klasik lezzet (Plain Turkish Delight).",
      shortDesc: "Geleneksel sade lokum (750g)",
      basePrice: 100, // Çorum piyasası ortalaması
      categoryId: category.id,
      isNatural: true,
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
              { weight: "750g Kutu", price: prod.basePrice, stock: 40 },
            ],
          },
        },
      });
      console.log("Ürün eklendi:", created.name);
    } else {
      console.log("Ürün zaten mevcut:", existing.name);
    }
  }

  console.log("İşlem tamamlandı!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
