import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Hediyelik kutular ekleniyor...");

  let category = await prisma.category.findUnique({
    where: { slug: "hediyelik-kutu" },
  });

  if (!category) {
    console.error("Kategori bulunamadı. Lütfen önce 'hediyelik-kutu' kategorisini oluşturun.");
    return;
  }

  const products = [
    {
      name: "Büyük Boy Ahşap Hediyelik Kutu (İçi Dolu)",
      slug: "buyuk-boy-ahsap-kutu-dolu",
      description: "Lazoğlu Kuruyemiş'e özel tasarımlı, Çorum Hatırası oymalı büyük boy ahşap kutu. İçerisi en taze kuruyemiş, leblebi ve drajelerimizle özenle doldurulmuştur. Harika bir prestij hediyesi.",
      shortDesc: "İçi dolu özel tasarım ahşap kutu",
      basePrice: 500,
      totalStock: 50,
      categoryId: category.id,
      isNatural: false,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Küçük Boy Ahşap Hediyelik Kutu (İçi Dolu)",
      slug: "kucuk-boy-ahsap-kutu-dolu",
      description: "Lazoğlu Kuruyemiş'e özel tasarımlı, Saat Kulesi oymalı 6 bölmeli küçük boy ahşap kutu. Çorum'un meşhur leblebi çeşitleri ve drajelerle dolu mükemmel bir hediye seçeneği.",
      shortDesc: "6 bölmeli, içi dolu ahşap kutu",
      basePrice: 450,
      totalStock: 50,
      categoryId: category.id,
      isNatural: false,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Büyük Boy Ahşap Hediyelik Kutu (Boş)",
      slug: "buyuk-boy-ahsap-kutu-bos",
      description: "Lazoğlu Kuruyemiş'e özel tasarımlı, Çorum Hatırası oymalı büyük boy ahşap kutu. Kendi hediyenizi kendiniz hazırlamak isterseniz içi boş olarak temin edebilirsiniz.",
      shortDesc: "Özel tasarım büyük ahşap kutu",
      basePrice: 200,
      totalStock: 50,
      categoryId: category.id,
      isNatural: false,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Küçük Boy Ahşap Hediyelik Kutu (Boş)",
      slug: "kucuk-boy-ahsap-kutu-bos",
      description: "Lazoğlu Kuruyemiş'e özel tasarımlı, 6 bölmeli küçük boy ahşap kutu. İçini dilediğiniz gibi doldurmak için boş olarak satılmaktadır.",
      shortDesc: "6 bölmeli ahşap boş kutu",
      basePrice: 150,
      totalStock: 50,
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
          // Varyant yok (Hediyelik eşya)
        },
      });
      console.log("Ürün eklendi:", created.name);
    } else {
      console.log("Ürün zaten mevcut:", existing.name);
    }
  }

  console.log("Hediyelik kutular başarıyla eklendi!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
