import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding products part 16...");

  const category = await prisma.category.findUnique({
    where: { slug: "corum-kuruyemis" },
  });

  if (!category) {
    console.error("Kategori bulunamadı.");
    return;
  }

  const products = [
    {
      name: "Beyaz Çikolatalı Çıtır Leblebi",
      slug: "beyaz-cikolatali-citir-leblebi",
      description: "Özel beyaz çikolata kaplı ve fırınlanmış çıtır krokan dokulu enfes leblebi.",
      shortDesc: "Beyaz çikolata kaplamalı çıtır",
      basePrice: 500, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Sütlü ve Bitter Çikolatalı Draje",
      slug: "sutlu-ve-bitter-cikolatali-draje",
      description: "Gerçek sütlü ve bitter çikolatanın muhteşem uyumuyla hazırlanmış lüks leblebi drajesi.",
      shortDesc: "Sütlü ve bitter çikolata şöleni",
      basePrice: 600, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Karışık Meyveli Çıtır Leblebi",
      slug: "karisik-meyveli-citir-leblebi",
      description: "Farklı meyve aromalarının pütürlü ve ekstra çıtır hamurla kaplandığı eğlenceli lezzet.",
      shortDesc: "Meyveli pütürlü çıtır",
      basePrice: 500, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Orman Meyveli Çıtır Leblebi",
      slug: "orman-meyveli-citir-leblebi",
      description: "Karadut ve yaban mersini notalarıyla bezenmiş mor benekli ekstra çıtır krokan leblebi.",
      shortDesc: "Mor orman meyvesi lezzeti",
      basePrice: 500, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Kakaolu Çıtır Leblebi",
      slug: "kakaolu-citir-leblebi",
      description: "Yoğun kakao aromalı pütürlü krokan kaplamasıyla çikolata krizlerine birebir çıtır leblebi.",
      shortDesc: "Yoğun kakaolu pütürlü çıtır",
      basePrice: 500, // 1 kg fiyatı
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

  console.log("Onaltıncı parti ürünler başarıyla eklendi!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
