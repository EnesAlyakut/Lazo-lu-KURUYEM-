import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Antep Fıstıklı Saray Helvası ekleniyor...");

  let category = await prisma.category.findUnique({
    where: { slug: "lokum-helva-ve-pismaniye" },
  });

  if (!category) {
    console.error("Kategori bulunamadı.");
    return;
  }

  const product = {
    name: "Antep Fıstıklı Saray Helvası",
    slug: "antep-fistikli-saray-helvasi",
    description: "Adıbelli Şekerleme kalitesiyle, altı ve üstü bol Antep fıstığı kaplı, ağızda eriyen muhteşem saray helvası. Eşsiz lezzetiyle çay kahve keyfinize eşlik edecek şık kutusunda.",
    shortDesc: "Bol Antep fıstıklı geleneksel saray helvası",
    basePrice: 250, // 1 kutu fiyatı
    categoryId: category.id,
    isNatural: true,
    isFeatured: true,
    isActive: true,
  };

  const existing = await prisma.product.findUnique({
    where: { slug: product.slug },
  });

  if (!existing) {
    const created = await prisma.product.create({
      data: {
        ...product,
        images: "[]",
        variants: {
          create: [
            { weight: "1 Kutu", price: product.basePrice, stock: 50 },
          ],
        },
      },
    });
    console.log("Ürün eklendi:", created.name);
  } else {
    console.log("Ürün zaten mevcut:", existing.name);
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
