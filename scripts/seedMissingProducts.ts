const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categoryId = 'cms05zrxp0000tcqiqrb5jb4n';

  // Product 1
  const p1 = await prisma.product.upsert({
    where: { slug: 'yeni-mahsul-kalbur-ustu-corum-birincisi-leblebisi' },
    update: {},
    create: {
      name: 'Yeni Mahsul Kalbur Üstü Çorum Birincisi Leblebisi',
      slug: 'yeni-mahsul-kalbur-ustu-corum-birincisi-leblebisi',
      description: 'Yeni mahsul, özenle seçilmiş kalbur üstü meşhur Çorum leblebisi. Tazeliği ve doğallığıyla ön planda. Özenle paketlenip kapınıza kadar taze taze ulaştırılır.',
      shortDesc: 'Yeni mahsul, kalbur üstü taze Çorum leblebisi.',
      origin: 'Çorum',
      production: 'Günlük Kavrum',
      freshness: 'Sipariş üzerine paketlenir',
      images: '["/images/sari-leblebi.jpg"]',
      basePrice: 320,
      discountPrice: 300,
      isNatural: true,
      isFeatured: true,
      isBestSeller: true,
      isNew: true,
      isActive: true,
      totalStock: 200,
      categoryId: categoryId,
      variants: {
        create: [
          { weight: '250g', price: 300, stock: 100, sku: 'kalbur-ustu-250g' },
          { weight: '500g', price: 580, stock: 100, sku: 'kalbur-ustu-500g' }
        ]
      }
    }
  });

  // Product 2
  const p2 = await prisma.product.upsert({
    where: { slug: 'yeni-mahsul-ekstra-corum-birincisi-leblebi' },
    update: {},
    create: {
      name: 'Yeni Mahsul Ekstra Çorum Birincisi Leblebi',
      slug: 'yeni-mahsul-ekstra-corum-birincisi-leblebi',
      description: 'Yeni mahsul ekstra kavrulmuş meşhur Çorum leblebisi. Çifte kavrulmuş tadıyla çıtır çıtır ve her daim taze.',
      shortDesc: 'Ekstra kavrulmuş taze Çorum leblebisi.',
      origin: 'Çorum',
      production: 'Çifte Kavrum',
      freshness: 'Sipariş üzerine paketlenir',
      images: '["/images/cifte-kavrulmus-leblebi.jpg"]',
      basePrice: 300,
      discountPrice: 250,
      isNatural: true,
      isFeatured: true,
      isBestSeller: true,
      isNew: true,
      isActive: true,
      totalStock: 200,
      categoryId: categoryId,
      variants: {
        create: [
          { weight: '250g', price: 250, stock: 100, sku: 'ekstra-birinci-250g' },
          { weight: '500g', price: 480, stock: 100, sku: 'ekstra-birinci-500g' }
        ]
      }
    }
  });

  console.log('Products created successfully:', p1.slug, p2.slug);
}

main().catch(console.error).finally(() => prisma.$disconnect());
