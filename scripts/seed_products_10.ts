import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding products part 10...");

  const category = await prisma.category.findUnique({
    where: { slug: "corum-kuruyemis" },
  });

  if (!category) {
    console.error("Kategori bulunamadı.");
    return;
  }

  const products = [
    {
      name: "Soya Soslu Çıtır Leblebi",
      slug: "soya-soslu-citir-leblebi",
      description: "Özel soya sosu ve çıtır hamur kaplamasıyla fırınlanmış leziz leblebi.",
      shortDesc: "Ekstra çıtır kaplama",
      basePrice: 350, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Baharatlı Çubuk Cips",
      slug: "baharatli-cubuk-cips",
      description: "Özel baharatlarla çeşnilenmiş, atıştırmalık çıtır çubuk cips.",
      shortDesc: "Çıtır çubuk lezzeti",
      basePrice: 250, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Ketçaplı Leblebi",
      slug: "ketcapli-leblebi",
      description: "Çocukların ve gençlerin favorisi, tatlı-ekşi ketçap aromalı nefis leblebi.",
      shortDesc: "Tatlı-ekşi ketçap aroması",
      basePrice: 300, // 1 kg fiyatı
      categoryId: category.id,
      isNatural: false,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Yoğurtlu Leblebi",
      slug: "yogurtlu-leblebi",
      description: "Taze leblebilerin enfes yoğurtlu ve hafif şekerli kaplamayla buluşması.",
      shortDesc: "Tatlı ve ferah lezzet",
      basePrice: 400, // 1 kg fiyatı
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

  console.log("Onuncu parti ürünler başarıyla eklendi!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
