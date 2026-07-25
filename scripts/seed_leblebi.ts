import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Leblebi ürünleri ekleniyor...");

  let category = await prisma.category.findUnique({
    where: { slug: "leblebi" },
  });

  if (!category) {
    console.error("Kategori bulunamadı. Lütfen önce 'leblebi' kategorisini oluşturun.");
    return;
  }

  const products = [
    // Kullanıcının özel fiyat belirlediği ürünler
    {
      name: "Leblebi Kurabiyesi",
      slug: "leblebi-kurabiyesi",
      description: "Çorum'un meşhur sarı leblebilerinden çekilip hazırlanan, ağızda dağılan enfes ve katkısız geleneksel leblebi kurabiyesi.",
      shortDesc: "Ağızda dağılan meşhur leblebi kurabiyesi",
      basePrice: 150, // 1 Paket fiyatı
      variants: [{ weight: "1 Paket", price: 150, stock: 50 }],
      categoryId: category.id,
      isNatural: true,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Çikolatalı Leblebi Kurabiyesi",
      slug: "cikolatali-leblebi-kurabiyesi",
      description: "Geleneksel leblebi kurabiyesinin enfes çikolata parçacıklarıyla buluştuğu modern ve nefis bir lezzet şöleni.",
      shortDesc: "Çikolatalı nefis leblebi kurabiyesi",
      basePrice: 125, // 1 Paket fiyatı
      variants: [{ weight: "1 Paket", price: 125, stock: 50 }],
      categoryId: category.id,
      isNatural: false,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Leblebi Kreması",
      slug: "leblebi-kremasi",
      description: "Kahvaltıların yeni favorisi! %100 doğal Çorum leblebisinden üretilen, sürülebilir harika bir lezzet olan Leblebi Kreması.",
      shortDesc: "Sürülebilir doğal leblebi kreması",
      basePrice: 250, // 1 Kavanoz fiyatı
      variants: [{ weight: "1 Kavanoz", price: 250, stock: 40 }],
      categoryId: category.id,
      isNatural: true,
      isFeatured: true,
      isActive: true,
    },

    // Kalan standart leblebiler (Çorum geneli orta-üst segment fiyat araştırması baz alınarak)
    {
      name: "Meşhur Çorum Sarı Leblebisi",
      slug: "meshur-corum-sari-leblebisi",
      description: "Odun ateşinde özenle kavrulmuş, iri boy ve taptaze Çorum'un efsanevi sarı leblebisi. Lüks kalite.",
      shortDesc: "İri boy, odun ateşinde kavrulmuş",
      basePrice: 200, 
      variants: [
        { weight: "250g", price: 50, stock: 100 },
        { weight: "500g", price: 100, stock: 100 },
        { weight: "1kg", price: 200, stock: 100 }
      ],
      categoryId: category.id,
      isNatural: true,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Çifte Kavrulmuş Tuzlu Leblebi",
      slug: "cifte-kavrulmus-tuzlu-leblebi",
      description: "Ekstra kavrulmuş ve tam kararında tuzlanmış, çay saatlerinin vazgeçilmezi çıtır çıtır tuzlu leblebi.",
      shortDesc: "Ekstra kavrulmuş tuzlu leblebi",
      basePrice: 220, 
      variants: [
        { weight: "250g", price: 55, stock: 100 },
        { weight: "500g", price: 110, stock: 100 },
        { weight: "1kg", price: 220, stock: 100 }
      ],
      categoryId: category.id,
      isNatural: true,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Beyaz Leblebi",
      slug: "beyaz-leblebi",
      description: "Klasik ve hafif lezzet arayanlar için taptaze nohuttan üretilen sade beyaz leblebi.",
      shortDesc: "Taze kavrulmuş hafif lezzet",
      basePrice: 180, 
      variants: [
        { weight: "250g", price: 45, stock: 100 },
        { weight: "500g", price: 90, stock: 100 },
        { weight: "1kg", price: 180, stock: 100 }
      ],
      categoryId: category.id,
      isNatural: true,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Çıtır Soslu Leblebi",
      slug: "citir-soslu-leblebi",
      description: "Özel baharatlar ve soya sosuyla kaplanmış, atıştırmalık saatleriniz için bağımlılık yapan çıtır leblebi.",
      shortDesc: "Özel soya sosuyla kaplanmış",
      basePrice: 230, 
      variants: [
        { weight: "250g", price: 57.5, stock: 100 },
        { weight: "500g", price: 115, stock: 100 },
        { weight: "1kg", price: 230, stock: 100 }
      ],
      categoryId: category.id,
      isNatural: false,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Şekerli Leblebi",
      slug: "sekerli-leblebi",
      description: "Renkli ve çıtır şeker kaplamasıyla hem çocukların hem büyüklerin severek tükettiği tatlı leblebi.",
      shortDesc: "Çıtır şeker kaplamalı",
      basePrice: 190, 
      variants: [
        { weight: "250g", price: 47.5, stock: 100 },
        { weight: "500g", price: 95, stock: 100 },
        { weight: "1kg", price: 190, stock: 100 }
      ],
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
          name: prod.name,
          slug: prod.slug,
          description: prod.description,
          shortDesc: prod.shortDesc,
          basePrice: prod.basePrice,
          categoryId: prod.categoryId,
          isNatural: prod.isNatural,
          isFeatured: prod.isFeatured,
          isActive: prod.isActive,
          images: "[]",
          variants: {
            create: prod.variants,
          },
        },
      });
      console.log("Ürün eklendi:", created.name);
    } else {
      console.log("Ürün zaten mevcut:", existing.name);
    }
  }

  console.log("Leblebi ürünleri başarıyla eklendi!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
