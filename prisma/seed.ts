import { PrismaClient, PaymentMethod, CouponType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seed başlıyor...");

  // Eski verileri temizle
  console.log("🧹 Veritabanı temizleniyor...");
  await prisma.review.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.coupon.deleteMany({});
  console.log("✅ Eski veriler temizlendi");

  // Admin kullanıcı
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      email: "admin@admin.com",
      password: hashedPassword,
      name: "FK Admin",
      role: "ADMIN",
    },
  });
  console.log("✅ Admin kullanıcı oluşturuldu");

  // Kategoriler
  const leblebi = await prisma.category.upsert({
    where: { slug: "leblebi" },
    update: {},
    create: {
      name: "Leblebi",
      slug: "leblebi",
      description: "Çorum'un eşsiz leblebileri - doğal ve taze",
      image: "/images/sari-leblebi.jpg",
      order: 1,
    },
  });

  const kuruyemis = await prisma.category.upsert({
    where: { slug: "kuruyemis" },
    update: {},
    create: {
      name: "Kuruyemiş",
      slug: "kuruyemis",
      description: "En taze fındık, ceviz, badem ve daha fazlası",
      image: "/images/antep-fistigi.jpg",
      order: 2,
    },
  });

  const kuruMeyve = await prisma.category.upsert({
    where: { slug: "kuru-meyve" },
    update: {},
    create: {
      name: "Kuru Meyve",
      slug: "kuru-meyve",
      description: "Doğal kurutulmuş meyveler - şekersiz ve sağlıklı",
      image: "/images/kuru-kayisi.jpg",
      order: 3,
    },
  });

  const karisik = await prisma.category.upsert({
    where: { slug: "karisik-paket" },
    update: {},
    create: {
      name: "Karışık Paket",
      slug: "karisik-paket",
      description: "Özel karışım paketlerimiz - hediye için ideal",
      image: "/images/karisik-kuruyemis.png",
      order: 4,
    },
  });

  const hediyelik = await prisma.category.upsert({
    where: { slug: "hediyelik-kutu" },
    update: {},
    create: {
      name: "Hediyelik Kutu",
      slug: "hediyelik-kutu",
      description: "Sevdiklerinize özel hediyelik kuruyemiş kutuları",
      image: "/images/hediyelik-kutu.jpg",
      order: 5,
    },
  });
  console.log("✅ Kategoriler oluşturuldu");

  // Ürünler
  const products = [
    {
      name: "Sarı Leblebi",
      slug: "sari-leblebi",
      description: "Çorum'un meşhur sarı leblebisi. Geleneksel yöntemlerle kavrulmuş, çıtır ve lezzetli. %100 doğal, katkısız.",
      shortDesc: "Çorum'dan gelen eşsiz sarı leblebi",
      origin: "Çorum",
      production: "Geleneksel taş değirmende kavurma",
      freshness: "Hasat sonrası 3 ay içinde kavruluyor",
      images: [
        "/images/sari-leblebi.jpg",
      ],
      basePrice: 89.90,
      discountPrice: 74.90,
      isNatural: true,
      isFeatured: true,
      isBestSeller: true,
      categoryId: leblebi.id,
      totalStock: 150,
      metaTitle: "Sarı Leblebi | Çorum Leblebisi | FK Kuruyemiş",
      metaDescription: "Çorum'un eşsiz sarı leblebisi. Geleneksel yöntemlerle kavrulmuş, %100 doğal. 250g, 500g, 1kg seçenekleriyle sipariş verin.",
    },
    {
      name: "Beyaz Leblebi",
      slug: "beyaz-leblebi",
      description: "Özel kavurma tekniğiyle hazırlanan beyaz leblebi. Daha az kavrulmuş olduğu için yumuşak dokusuyla öne çıkar. Sağlıklı ve besleyici.",
      shortDesc: "Yumuşak dokulu beyaz leblebi",
      origin: "Çorum",
      production: "Özel beyaz kavurma tekniği",
      freshness: "Haftalık taze kavrum",
      images: [
        "/images/beyaz-leblebi.jpg",
      ],
      basePrice: 84.90,
      isNatural: true,
      isBestSeller: true,
      categoryId: leblebi.id,
      totalStock: 120,
    },
    {
      name: "Çifte Kavrulmuş Leblebi",
      slug: "cifte-kavrulmus-leblebi",
      description: "İki kez kavrulan özel leblebi. Ekstra çıtır dokusu ve yoğun aromasıyla vazgeçilmez bir lezzet. Geleneksel Çorum usulü.",
      shortDesc: "Ekstra çıtır, iki kez kavrulmuş",
      origin: "Çorum",
      production: "Çift kavurma - geleneksel yöntem",
      freshness: "Taze kavrum garantisi",
      images: [
        "/images/cifte-kavrulmus-leblebi.jpg",
      ],
      basePrice: 99.90,
      discountPrice: 89.90,
      isNatural: true,
      isFeatured: true,
      categoryId: leblebi.id,
      totalStock: 80,
    },
    {
      name: "Şekerli Leblebi",
      slug: "sekerli-leblebi",
      description: "Tatlı sevenler için özel şekerli leblebi. Çıtır leblebi üzerine ince şeker kaplaması. Çay yanına mükemmel.",
      shortDesc: "İnce şeker kaplı özel leblebi",
      origin: "Çorum",
      production: "El yapımı şeker kaplama",
      freshness: "Taze üretim",
      images: [
        "/images/sekerli-leblebi.jpg",
      ],
      basePrice: 94.90,
      isNatural: false,
      isNew: true,
      categoryId: leblebi.id,
      totalStock: 60,
    },
    {
      name: "Antep Fıstığı",
      slug: "antep-fistigi",
      description: "Gaziantep'in meşhur antep fıstığı. Büyük taneli, dolgun ve lezzetli. %100 doğal, tuzlu seçenek mevcuttur.",
      shortDesc: "Gaziantep'ten büyük taneli antep fıstığı",
      origin: "Gaziantep",
      production: "Doğal kurutma",
      freshness: "Yeni hasat",
      images: [
        "/images/antep-fistigi.jpg",
      ],
      basePrice: 189.90,
      discountPrice: 169.90,
      isNatural: true,
      isFeatured: true,
      isBestSeller: true,
      categoryId: kuruyemis.id,
      totalStock: 90,
    },
    {
      name: "Bademli Karışık Kuruyemiş",
      slug: "bademli-karisik-kuruyemis",
      description: "Badem, ceviz, fındık ve antep fıstığından oluşan zengin karışım. Sağlıklı atıştırmalığın en güzel hali.",
      shortDesc: "4'lü besleyici kuruyemiş karışımı",
      origin: "Türkiye",
      production: "El ile karıştırma",
      freshness: "Haftalık taze",
      images: [
        "/images/karisik-kuruyemis.png",
      ],
      basePrice: 149.90,
      isNatural: true,
      isBestSeller: true,
      categoryId: kuruyemis.id,
      totalStock: 70,
    },
    {
      name: "Kuru Kayısı",
      slug: "kuru-kayisi",
      description: "Malatya'nın dünyaca ünlü kuru kayısısı. Şeker ilave edilmemiş, %100 doğal. Antioksidan deposu.",
      shortDesc: "Malatya'dan doğal kuru kayısı",
      origin: "Malatya",
      production: "Güneşte kurutma",
      freshness: "Yeni hasat",
      images: [
        "/images/kuru-kayisi.jpg",
      ],
      basePrice: 79.90,
      discountPrice: 69.90,
      isNatural: true,
      isFeatured: true,
      categoryId: kuruMeyve.id,
      totalStock: 100,
    },
    {
      name: "Özel Hediyelik Kuruyemiş Kutusu",
      slug: "ozel-hediyelik-kuruyemis-kutusu",
      description: "Sevdiklerinize özel hazırlanmış lüks kuruyemiş kutusu. 5 farklı çeşit kuruyemiş, özel hediye ambalajında. Bayram, doğum günü ve özel günler için ideal.",
      shortDesc: "5 çeşit kuruyemişli lüks hediye kutusu",
      origin: "Türkiye",
      production: "El ile özel hazırlama",
      freshness: "Taze montaj",
      images: [
        "/images/hediyelik-kutu.jpg",
      ],
      basePrice: 249.90,
      discountPrice: 219.90,
      isNatural: true,
      isFeatured: true,
      isNew: true,
      categoryId: hediyelik.id,
      totalStock: 40,
    },
  ];

  for (const productData of products) {
    const { categoryId, ...rest } = productData;
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        ...rest,
        category: { connect: { id: categoryId } },
      },
    });

    // Varyantlar ekle
    const weights = [
      { weight: "250g", multiplier: 0.5 },
      { weight: "500g", multiplier: 1 },
      { weight: "1kg", multiplier: 1.85 },
    ];

    for (const { weight, multiplier } of weights) {
      const variantSku = `${product.slug}-${weight}`;
      await prisma.productVariant.upsert({
        where: { sku: variantSku },
        update: {},
        create: {
          productId: product.id,
          weight,
          price: Math.round((product.discountPrice || product.basePrice) * multiplier * 10) / 10,
          stock: Math.floor(product.totalStock / 3),
          sku: variantSku,
        },
      });
    }
  }
  console.log("✅ Ürünler ve varyantlar oluşturuldu");

  // Blog yazıları
  const blogPosts = [
    {
      title: "Leblebi Nedir? Tarihçesi ve Özellikleri",
      slug: "leblebi-nedir",
      content: `## Leblebi Nedir?

Leblebi, nohutun özel bir kavurma işleminden geçirilmesiyle elde edilen geleneksel bir Türk atıştırmalığıdır. Binlerce yıllık tarihe sahip olan leblebi, Anadolu'nun köklü lezzetleri arasında özel bir yer tutmaktadır.

## Tarihçesi

Leblebi üretimi Anadolu'da M.Ö. 3000'li yıllara kadar dayanmaktadır. Özellikle Çorum ili, leblebi üretiminin merkezi olarak kabul edilmektedir. Çorum leblebisi, coğrafi işaret tescili almış ve dünya genelinde tanınan bir ürün haline gelmiştir.

## Leblebi Çeşitleri

- **Sarı Leblebi**: En yaygın çeşit, yüksek ısıda kavrulan, çıtır ve altın sarısı renginde
- **Beyaz Leblebi**: Daha düşük ısıda kavrulan, yumuşak dokulu
- **Çifte Kavrulmuş**: İki kez kavurma işleminden geçen, ekstra çıtır
- **Şekerli Leblebi**: Leblebi üzerine şeker kaplama yapılan tatlı çeşit

## Besleyici Değerleri

100 gram leblebide:
- Protein: 17-19 gram
- Karbonhidrat: 60-65 gram
- Lif: 10-12 gram
- Demir, çinko ve B vitamini açısından zengin

Leblebi, yüksek protein ve lif içeriğiyle sağlıklı bir atıştırmalık olarak öne çıkar.`,
      excerpt: "Leblebi, nohutun özel kavurma işleminden geçirilmesiyle elde edilen, binlerce yıllık tarihe sahip geleneksel Türk lezzetinin ta kendisi.",
      coverImage: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800",
      isPublished: true,
      publishedAt: new Date("2024-01-15"),
      metaTitle: "Leblebi Nedir? Tarihçesi, Çeşitleri ve Besleyici Değerleri | FK Kuruyemiş Blog",
      metaDescription: "Leblebi nedir, nasıl yapılır? Leblebi tarihçesi, çeşitleri ve besleyici değerleri hakkında kapsamlı bilgi için FK Kuruyemiş Blog'u ziyaret edin.",
      tags: ["leblebi", "çorum leblebisi", "geleneksel lezzetler"],
      readTime: 5,
    },
    {
      title: "Leblebinin Sağlığa Faydaları",
      slug: "leblebi-faydalari",
      content: `## Leblebinin Sağlığa Faydaları

Leblebi, sadece lezzetli değil, aynı zamanda son derece besleyici bir gıdadır. İşte leblebinin sağlığımıza katkıları:

## 1. Yüksek Protein Kaynağı

Leblebi, bitkisel protein kaynakları arasında en zenginlerinden biridir. 100 gramda yaklaşık 17-19 gram protein bulunur. Bu özelliğiyle vejetaryen ve vegan bireyler için mükemmel bir protein kaynağıdır.

## 2. Sindirim Sağlığını Destekler

Leblebinin yüksek lif içeriği, sindirim sistemini destekler ve kabızlığı önler. Bağırsak hareketlerini düzenleyerek sağlıklı bir sindirim için katkıda bulunur.

## 3. Kan Şekerini Dengeler

Düşük glisemik indeksiyle leblebi, kan şekerinin ani yükselmesini önler. Diyabet hastaları için uygun bir atıştırmalık seçeneğidir.

## 4. Kalp Sağlığını Korur

İçerdiği potasyum, magnezyum ve folik asit sayesinde leblebi, kalp sağlığını destekler. Kolesterol düzenleyici etkisiyle bilinir.

## 5. Kemik Sağlığı

Kalsiyum ve fosfor içeriğiyle kemik yoğunluğunu destekler. Osteoporoz riskini azaltmaya yardımcı olur.

## 6. Demir Eksikliğine Karşı

Leblebi, demir açısından zengin bir besindir. Özellikle demir eksikliği anemisi riski taşıyan bireyler için faydalıdır.

## Günlük Tüketim Önerisi

Günde 30-50 gram leblebi tüketimi ideal olarak kabul edilir. Bu miktar yaklaşık bir avuç dolusu kadardır.

**Uyarı**: Aşırı tüketimden kaçının. Yüksek karbonhidrat içeriği nedeniyle porsiyona dikkat edin.`,
      excerpt: "Protein, lif ve mineral deposu leblebi, sindirim sağlığından kalp sağlığına kadar pek çok faydası ile günlük diyetinizin vazgeçilmezi olmalı.",
      coverImage: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800",
      isPublished: true,
      publishedAt: new Date("2024-02-10"),
      metaTitle: "Leblebinin Sağlığa Faydaları | Protein, Lif ve Mineral Deposu | FK Kuruyemiş",
      metaDescription: "Leblebi neden bu kadar sağlıklı? Protein, lif, demir ve daha fazlası. Leblebinin sindirim, kalp ve kemik sağlığına faydalarını keşfedin.",
      tags: ["leblebi faydaları", "sağlıklı beslenme", "protein kaynağı"],
      readTime: 6,
    },
    {
      title: "Çorum Leblebisi Neden Meşhur?",
      slug: "corum-leblebisi-neden-meshur",
      content: `## Çorum Leblebisi Neden Dünyaca Ünlü?

Çorum, Türkiye'nin İç Anadolu bölgesinde yer alan bu şehir, yüzyıllardır leblebi üretiminin kalbi olmuştur. Peki Çorum leblebisini bu kadar özel kılan nedir?

## Coğrafi Koşulların Önemi

Çorum'un iklimi ve toprak yapısı, nohut yetiştiriciliği için ideal koşullar sunar. Bölgenin karasal iklimi, nohutların yavaş ve dengeli olgunlaşmasını sağlar. Bu durum, leblebiye özgün tadını ve dokusunu kazandırır.

## Geleneksel Kavurma Yöntemleri

Çorum'da leblebi üretimi nesiller boyu aktarılan bir gelenektir. Taş değirmenlerinde dönen nohutlar, özel ateş kontrolüyle kavurulur. Bu süreç, fabrika üretimiyle kıyaslanamayacak bir lezzet derinliği yaratır.

## Coğrafi İşaret Tescili

Çorum leblebisi, Türkiye'nin en değerli coğrafi işaretleri arasında yer almaktadır. Bu tescil, ürünün kalitesini ve menşeini güvence altına alır.

## Ekonomik Önemi

Çorum'da 200'den fazla leblebi üreticisi bulunmaktadır. Yıllık üretim 50.000 ton'u aşmakta, ürünler Türkiye'nin 81 iline ve 30'dan fazla ülkeye ihraç edilmektedir.

## FK Kuruyemiş ve Çorum Bağı

Biz FK Kuruyemiş olarak, Çorum'daki güvenilir üreticilerle doğrudan çalışıyoruz. Her leblebimiz, geleneksel yöntemlerle kavruluyor ve tazelik garantisiyle müşterilerimize ulaşıyor.

## Nasıl Anlaşılır?

Gerçek Çorum leblebisinin özellikleri:
- Düzgün, oval bir şekle sahip
- Yüzeyi pürüzsüz ve parlak
- Çıtır bir dokusu var
- Acı aftertaste yok
- Doğal sarı-altın rengi

Çorum leblebisini denemek için hemen sipariş verin!`,
      excerpt: "Çorum leblebisini dünyaca ünlü yapan sırları keşfedin. Toprak yapısı, geleneksel kavurma yöntemleri ve coğrafi işaret tescili ile eşsiz bir lezzet.",
      coverImage: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800",
      isPublished: true,
      publishedAt: new Date("2024-03-05"),
      metaTitle: "Çorum Leblebisi Neden Meşhur? Tarih, Coğrafya ve Lezzet | FK Kuruyemiş",
      metaDescription: "Çorum leblebisini özel yapan nedir? Coğrafi işaret, geleneksel üretim ve Çorum'un eşsiz ikliminin bu lezzete katkısını öğrenin.",
      tags: ["çorum leblebisi", "coğrafi işaret", "leblebi tarihi"],
      readTime: 7,
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }
  console.log("✅ Blog yazıları oluşturuldu");

  // Kuponlar
  await prisma.coupon.upsert({
    where: { code: "HOSGELDIN10" },
    update: {},
    create: {
      code: "HOSGELDIN10",
      type: CouponType.PERCENTAGE,
      value: 10,
      minOrder: 100,
      maxUses: 1000,
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "FK50" },
    update: {},
    create: {
      code: "FK50",
      type: CouponType.FIXED,
      value: 50,
      minOrder: 200,
      maxUses: 500,
      isActive: true,
    },
  });
  console.log("✅ Kuponlar oluşturuldu");

  console.log("\n🎉 Seed tamamlandı!");
  console.log("📧 Admin email: admin@admin.com");
  console.log("🔑 Admin şifre: admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
