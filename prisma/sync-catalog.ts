import { PrismaClient } from "@prisma/client";
import { catalogProducts, getCatalogCategories } from "../src/data/productCatalog";

const prisma = new PrismaClient();

function cleanImages(images: string[]) {
  const validImages = images.filter(
    (image) => typeof image === "string" && (image.startsWith("/") || image.startsWith("http"))
  );

  return validImages.length > 0 ? validImages : ["/images/leblebi-urun.png"];
}

async function main() {
  const categoryIdBySlug = new Map<string, string>();

  for (const catalogCategory of getCatalogCategories()) {
    const category = await prisma.category.upsert({
      where: { slug: catalogCategory.slug },
      update: {
        name: catalogCategory.name,
        description: catalogCategory.description,
        image: catalogCategory.image,
        order: catalogCategory.order,
        isActive: catalogCategory.isActive,
      },
      create: {
        name: catalogCategory.name,
        slug: catalogCategory.slug,
        description: catalogCategory.description,
        image: catalogCategory.image,
        order: catalogCategory.order,
        isActive: catalogCategory.isActive,
      },
    });

    categoryIdBySlug.set(catalogCategory.slug, category.id);
  }

  for (const catalogProduct of catalogProducts) {
    const categoryId = categoryIdBySlug.get(catalogProduct.category.slug);

    if (!categoryId) {
      throw new Error(`${catalogProduct.name} için kategori bulunamadı.`);
    }

    const totalStock =
      catalogProduct.variants.reduce((sum, variant) => sum + variant.stock, 0) ||
      catalogProduct.totalStock;

    const product = await prisma.product.upsert({
      where: { slug: catalogProduct.slug },
      update: {
        name: catalogProduct.name,
        description: catalogProduct.description,
        shortDesc: catalogProduct.shortDesc,
        origin: catalogProduct.origin,
        production: catalogProduct.production,
        freshness: catalogProduct.freshness,
        images: cleanImages(catalogProduct.images),
        basePrice: catalogProduct.basePrice,
        discountPrice: catalogProduct.discountPrice,
        isNatural: catalogProduct.isNatural,
        isFeatured: catalogProduct.isFeatured,
        isBestSeller: catalogProduct.isBestSeller,
        isNew: catalogProduct.isNew,
        isActive: catalogProduct.isActive,
        totalStock,
        categoryId,
        metaTitle: catalogProduct.metaTitle,
        metaDescription: catalogProduct.metaDescription,
      },
      create: {
        name: catalogProduct.name,
        slug: catalogProduct.slug,
        description: catalogProduct.description,
        shortDesc: catalogProduct.shortDesc,
        origin: catalogProduct.origin,
        production: catalogProduct.production,
        freshness: catalogProduct.freshness,
        images: cleanImages(catalogProduct.images),
        basePrice: catalogProduct.basePrice,
        discountPrice: catalogProduct.discountPrice,
        isNatural: catalogProduct.isNatural,
        isFeatured: catalogProduct.isFeatured,
        isBestSeller: catalogProduct.isBestSeller,
        isNew: catalogProduct.isNew,
        isActive: catalogProduct.isActive,
        totalStock,
        categoryId,
        metaTitle: catalogProduct.metaTitle,
        metaDescription: catalogProduct.metaDescription,
      },
    });

    await prisma.productVariant.deleteMany({ where: { productId: product.id } });

    if (catalogProduct.variants.length > 0) {
      await prisma.productVariant.createMany({
        data: catalogProduct.variants.map((variant) => ({
          productId: product.id,
          weight: variant.weight,
          price: variant.price,
          stock: variant.stock,
          sku: variant.sku,
        })),
      });
    }
  }

  console.log(
    `Katalog senkronlandı: ${getCatalogCategories().length} kategori, ${catalogProducts.length} ürün.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
