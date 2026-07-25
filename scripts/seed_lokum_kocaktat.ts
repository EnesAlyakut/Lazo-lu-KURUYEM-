import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Koçaktat lokumları ekleniyor...");

  let category = await prisma.category.findUnique({
    where: { slug: "lokum-helva-ve-pismaniye" },
  });

  if (!category) {
    console.error("Kategori bulunamadı.");
    return;
  }

  const products = [
    {
      name: "Koçaktat Karışık Türk Lokumu",
      slug: "kocaktat-karisik-turk-lokumu",
      description: "Koçaktat kalitesiyle, şık mor tasarım kutusunda sunulan, içerisinde gül yapraklı, fıstıklı ve farklı aromalı çeşitlerin bulunduğu nefis karışık Türk Lokumu.",
      shortDesc: "Özel kutusunda karışık spesiyal lokum",
      basePrice: 300, // 1 kutu fiyatı
      categoryId: category.id,
      isNatural: true,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Koçaktat Meyveli Çeşnili Lokum",
      slug: "kocaktat-meyveli-cesnili-lokum",
      description: "Koçaktat'ın zarif altın sarısı kutusunda, birbirinden lezzetli meyve aromalarıyla ve özel çeşnilerle zenginleştirilmiş spesiyal Türk Lokumu.",
      shortDesc: "Meyve aromalı ve çeşnili lokum paketi",
      basePrice: 300, // 1 kutu fiyatı
      categoryId: category.id,
      isNatural: true,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Koçaktat Özel Türk Lokumu (Kırmızı Kutu)",
      slug: "kocaktat-ozel-turk-lokumu-kirmizi",
      description: "Koçaktat'tan hediye etmeye doyamayacağınız, muhteşem kırmızı yaldızlı kutusunda (450g) sunulan fıstıklı ve özel sarmalardan oluşan premium Türk Lokumu serisi.",
      shortDesc: "Şık kırmızı kutusunda premium lokum",
      basePrice: 300, // 1 kutu fiyatı
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
