import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Helva kategorisi oluşturuluyor ve ürün ekleniyor...");

  let category = await prisma.category.findUnique({
    where: { slug: "lokum-helva-ve-pismaniye" },
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: "Lokum, Helva ve Pişmaniye",
        slug: "lokum-helva-ve-pismaniye",
        description: "Geleneksel tatlılarımız; lokum, saray helvası, çekme helva ve pişmaniye çeşitleri",
        image: "",
      },
    });
    console.log("Yeni kategori oluşturuldu: Lokum, Helva ve Pişmaniye");
  }

  const productName = "Orta Boy Antep Fıstıklı Çekme Helva";
  const productSlug = "orta-boy-antep-fistikli-cekme-helva";

  const existingProduct = await prisma.product.findUnique({
    where: { slug: productSlug },
  });

  if (!existingProduct) {
    const created = await prisma.product.create({
      data: {
        name: productName,
        slug: productSlug,
        description: "Adıbelli markasının eşsiz lezzetiyle, ağızda dağılan, nefis tel tel Antep fıstıklı ve kakaolu çekme helva/pişmaniye karışımı. Şık kutusunda (Orta Boy).",
        shortDesc: "Kutu içi Antep fıstıklı çekme helva",
        basePrice: 200, // 1 kutu fiyatı
        categoryId: category.id,
        isNatural: true,
        isFeatured: true,
        isActive: true,
        images: "[]",
        variants: {
          create: [
            { weight: "1 Kutu", price: 200, stock: 50 },
          ],
        },
      },
    });
    console.log("Ürün başarıyla eklendi:", created.name);
  } else {
    console.log("Ürün zaten mevcut:", existingProduct.name);
  }

  console.log("Helva ekleme işlemi tamamlandı!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
