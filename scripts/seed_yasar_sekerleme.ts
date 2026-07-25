import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Yaşar Şekerleme ürünleri ekleniyor...");

  let category = await prisma.category.findUnique({
    where: { slug: "lokum-helva-ve-pismaniye" },
  });

  if (!category) {
    console.error("Kategori bulunamadı.");
    return;
  }

  const products = [
    {
      name: "Çizgili Akide Şekeri",
      slug: "cizgili-akide-sekeri-yasar",
      description: "1969'dan beri kalitesinden ödün vermeyen Yaşar Şekerleme'den klasikleşmiş çizgili (nane/meyve aromalı) enfes akide şekeri. Geleneksel lezzet, nostaljik tat.",
      shortDesc: "Geleneksel çizgili akide şekeri",
      basePrice: 300,
      categoryId: category.id,
      isNatural: true,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Mevlana ve Elvan Şekeri (Sade)",
      slug: "mevlana-elvan-sekeri-sade-yasar",
      description: "Yaşar Şekerleme'den, ağızda eriyen yumuşacık yapısıyla efsanevi beyaz sade Mevlana ve Elvan şekeri. Çayınızın, kahvenizin en güzel eşlikçisi.",
      shortDesc: "Sade beyaz Mevlana şekeri",
      basePrice: 300,
      categoryId: category.id,
      isNatural: true,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Mevlana ve Elvan Şekeri (Meyveli)",
      slug: "mevlana-elvan-sekeri-meyveli-yasar",
      description: "Yaşar Şekerleme ustalığıyla üretilmiş, her bir renginde farklı bir meyve aroması saklı olan yumuşacık renkli Mevlana ve Elvan şekeri.",
      shortDesc: "Renkli meyve aromalı Mevlana şekeri",
      basePrice: 300,
      categoryId: category.id,
      isNatural: true,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Susamlı Akide Şekeri",
      slug: "susamli-akide-sekeri-yasar",
      description: "Kavrulmuş taptaze susamların, geleneksel Yaşar Şekerleme akidesiyle buluştuğu efsane lezzet. Çıtır çıtır, enfes susamlı akide şekeri.",
      shortDesc: "Bol susamlı geleneksel akide",
      basePrice: 300,
      categoryId: category.id,
      isNatural: true,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Karışık Akide Şekeri",
      slug: "karisik-akide-sekeri-yasar",
      description: "Yaşar Şekerleme'nin usta ellerinden çıkan, birbirinden lezzetli meyve aromalarının ve klasik tatların bir araya geldiği karışık akide şekeri paketi.",
      shortDesc: "Meyveli karışık akide şekeri",
      basePrice: 300,
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
              { weight: "1 Paket", price: prod.basePrice, stock: 50 },
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
