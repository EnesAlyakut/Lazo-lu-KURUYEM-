export interface CatalogBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  authorName: string;
  tags: string[];
  isPublished: boolean;
  publishedAt: Date;
  updatedAt: Date;
  metaTitle: string;
  metaDescription: string;
}

const publishedAt = new Date("2026-07-05T09:00:00.000Z");

export const blogPosts: CatalogBlogPost[] = [
  {
    id: "blog-corum-hatirasi-hediye",
    title: "Çorum Hatırası Hediyelik Kutu Seçerken Nelere Dikkat Edilmeli?",
    slug: "corum-hatirasi-hediyelik-kutu-secerken",
    excerpt:
      "Şık görünen, taşımaya uygun ve içeriğiyle akılda kalan bir Çorum hediyesi hazırlamak için kutu formu, bölme düzeni ve ürün uyumu önemlidir.",
    coverImage: "/images/products/corum-hatirasi-karisik-kutu-siyah.png",
    authorName: "FK KURUYEMİŞ",
    tags: ["Çorum Hatırası", "Hediyelik Kutu", "Leblebi"],
    isPublished: true,
    publishedAt,
    updatedAt: publishedAt,
    metaTitle: "Çorum Hatırası Hediyelik Kutu Seçimi | FK KURUYEMİŞ",
    metaDescription:
      "Çorum Hatırası hediyelik kutu seçerken bölme düzeni, ambalaj kalitesi ve leblebi çeşitlerini nasıl değerlendireceğinizi okuyun.",
    content: `Çorum'dan götürülecek bir hediyenin ilk etkisi ambalajla başlar. Çorum Hatırası kutular bu yüzden sadece leblebi taşıyan bir paket değil, aynı zamanda şehrin hatırasını taşıyan özel bir sunumdur.

## Bölme sayısı kullanım amacını belirler

Dört bölmeli kutular sade ve net bir hediye arayanlar için uygundur. Altı ya da dokuz bölmeli modeller ise farklı leblebi, draje ve çikolatalı seçenekleri aynı kutuda sunmak isteyenler için daha zengin bir görünüm verir.

## Renk ve malzeme hediyenin dilini değiştirir

Siyah-gold kutular daha premium ve kurumsal bir izlenim bırakır. Ahşap görünümlü kutular nostaljik ve sıcak bir his verir. Gold yüzeyli kutular ise özel günlerde daha gösterişli bir sunum isteyenler için öne çıkar.

## İçerik dengesi önemlidir

Klasik sarı leblebi, kavrulmuş leblebi, çikolatalı draje ve renkli drajeler birlikte kullanıldığında kutu hem lezzet hem görünüm açısından daha güçlü durur. Hediyelik seçimde tek tip ürün yerine dengeli bir karışım tercih etmek çoğu zaman daha iyi sonuç verir.

## Boş kutular işletmeler için avantaj sağlar

Kendi dolumunu yapmak isteyen mağazalar, oteller ve kurumsal işletmeler için boş ambalaj modelleri pratik bir çözümdür. Aynı görsel dili koruyarak farklı gramaj ve karışımlar hazırlanabilir.`,
  },
  {
    id: "blog-luksleb-kurabiye",
    title: "LüksLeb Leblebi Kurabiyesi: Çorum Lezzetine Yeni Bir Sunum",
    slug: "luksleb-leblebi-kurabiyesi-corum-lezzeti",
    excerpt:
      "Sade ve çikolatalı LüksLeb kurabiyeleri, leblebiyi modern ambalaj ve kahve yanı sunumuyla yeniden yorumlar.",
    coverImage: "/images/products/luksleb-sade-kurabiye.png",
    authorName: "FK KURUYEMİŞ",
    tags: ["LüksLeb", "Leblebi Kurabiyesi", "Çorum"],
    isPublished: true,
    publishedAt: new Date("2026-07-04T09:00:00.000Z"),
    updatedAt: new Date("2026-07-04T09:00:00.000Z"),
    metaTitle: "LüksLeb Leblebi Kurabiyesi | FK KURUYEMİŞ",
    metaDescription:
      "LüksLeb sade ve çikolatalı leblebi kurabiyelerinin sunum, lezzet ve hediye avantajlarını keşfedin.",
    content: `Leblebi denince akla genellikle klasik kavrulmuş lezzet gelir. LüksLeb leblebi kurabiyesi ise bu tanıdık lezzeti daha modern, daha zarif ve kolay hediye edilebilir bir forma taşır.

## Sade lezzet, net karakter

Sade LüksLeb kurabiyesi, leblebinin hafif kavruk tadını çay ve kahve yanında dengeli şekilde sunar. Oval şeffaf kutusu sayesinde ürün rafta da masada da temiz ve iştah açıcı görünür.

## Çikolatalı seçenek daha yoğun bir tat verir

Çikolatalı LüksLeb seçeneği, leblebi dokusunu kakao aromasıyla birleştirir. Özellikle tatlı sevenler, kahve yanı ikramlar ve küçük hediyelik paketler için güçlü bir alternatiftir.

## Neden 200 gramlık ambalaj?

200 gramlık kutu hem tek seferde tüketilebilir hem de hediye olarak ağır durmayacak kadar pratiktir. Toplu alımlarda birden fazla kutuyla daha düzenli ve kontrollü bir sunum yapılabilir.

## Çorum lezzetini modernleştirir

LüksLeb ürünleri, Çorum leblebisinin bilinirliğini klasik çerez formunun dışına taşır. Bu yüzden hem yerel bir tat arayanlara hem de farklı bir ikram isteyenlere hitap eder.`,
  },
  {
    id: "blog-kurumsal-hediyelik",
    title: "Kurumsal Hediyeliklerde Çorum Hatırası Kutular Neden Tercih Edilir?",
    slug: "kurumsal-hediyelik-corum-hatirasi-kutular",
    excerpt:
      "Müşteri, bayi ve çalışan hediyelerinde Çorum temalı kutular hem yerel kimlik hem de premium sunum sağlar.",
    coverImage: "/images/products/corum-hatirasi-gold-draje-kutu.png",
    authorName: "FK KURUYEMİŞ",
    tags: ["Kurumsal Hediye", "Çorum Hatırası", "Draje"],
    isPublished: true,
    publishedAt: new Date("2026-07-03T09:00:00.000Z"),
    updatedAt: new Date("2026-07-03T09:00:00.000Z"),
    metaTitle: "Kurumsal Hediyelik Çorum Hatırası Kutular | FK KURUYEMİŞ",
    metaDescription:
      "Kurumsal hediyelik seçiminde Çorum Hatırası kutuların ambalaj, içerik ve sunum avantajlarını inceleyin.",
    content: `Kurumsal hediye seçerken ürünün lezzeti kadar ambalajın verdiği mesaj da önemlidir. Çorum Hatırası kutular, yerel kimliği güçlü bir hediye formuna dönüştürür.

## Yerel kimlik akılda kalır

Çorum Saat Kulesi, Çorum Hatırası yazısı ve gold detaylar hediyeyi sıradan bir çerez paketinden ayırır. Hediye alan kişi yalnızca leblebi değil, Çorum'a ait bir hikaye de alır.

## Premium görünüm bütçeyi daha değerli gösterir

Siyah, gold ve ahşap görünümlü kutular ürüne daha güçlü bir vitrin etkisi verir. Bu sayede orta gramajlı bir hediye bile özenli ve prestijli algılanır.

## İçerik özelleştirilebilir

Sade leblebi, kavrulmuş leblebi, çikolatalı draje, renkli draje ve karışık seçenekler aynı kutu ailesinde hazırlanabilir. Böylece farklı alıcı grupları için aynı tasarım dilinde farklı içerikler sunulabilir.

## Toplu siparişlerde düzen kolaylığı sağlar

Boş ambalaj seçenekleri ve bölmeli kutular, kurumsal siparişlerde standart hazırlık yapılmasını kolaylaştırır. Her kutuda aynı görünüm ve aynı ürün dengesi korunabilir.`,
  },
  {
    id: "blog-bos-ambalaj",
    title: "Boş Hediye Kutusu ile Kendi Çorum Hatırası Karışımınızı Hazırlayın",
    slug: "bos-hediye-kutusu-corum-hatirasi-karisimi",
    excerpt:
      "Boş bölmeli kutular, kendi leblebi ve draje karışımını hazırlamak isteyen işletmeler için esnek ve şık bir çözüm sunar.",
    coverImage: "/images/products/corum-hatirasi-bos-6li-yatay.png",
    authorName: "FK KURUYEMİŞ",
    tags: ["Boş Ambalaj", "Hediye Kutusu", "Mağaza Sunumu"],
    isPublished: true,
    publishedAt: new Date("2026-07-02T09:00:00.000Z"),
    updatedAt: new Date("2026-07-02T09:00:00.000Z"),
    metaTitle: "Boş Çorum Hatırası Hediye Kutuları | FK KURUYEMİŞ",
    metaDescription:
      "Boş Çorum Hatırası kutularla mağaza, otel ve kurumsal hediyelik için nasıl karışım hazırlanabileceğini okuyun.",
    content: `Boş hediye kutuları, hazır dolum almak istemeyen ama Çorum Hatırası tasarımından vazgeçmek istemeyen işletmeler için iyi bir alternatiftir.

## Mağaza dolumu için esneklik sağlar

Boş kutular sayesinde her gün taze dolum yapılabilir. Mağazanın elindeki ürün çeşidine göre sade, kavrulmuş, çikolatalı veya renkli drajeli karışımlar hazırlanabilir.

## Bölmeler ürünleri düzenli gösterir

Bölmeli yapı, farklı renk ve dokudaki ürünlerin birbirine karışmasını önler. Bu da kutu açıldığında daha temiz, düzenli ve profesyonel bir görüntü verir.

## Kurumsal taleplere hızlı cevap verir

Toplu siparişlerde müşterinin istediği karışım oranı değişebilir. Boş ambalaj stoklamak, bu taleplere hızlı yanıt vermeyi kolaylaştırır.

## Vitrinde de güçlü durur

Siyah-gold pencereli kutular dolu olmasa bile raf sunumunda premium bir izlenim bırakır. Dolu örneklerle birlikte sergilendiğinde müşterinin ürünü daha kolay hayal etmesini sağlar.`,
  },
  {
    id: "blog-saat-kulesi-biblo",
    title: "Çorum Saat Kulesi Hediyelik Biblo: Şehir Hatırasını Tamamlayan Parça",
    slug: "corum-saat-kulesi-hediyelik-biblo",
    excerpt:
      "Çorum Saat Kulesi temalı hediyelik biblo, leblebi kutularının yanında şehir hatırası etkisini güçlendiren özel bir üründür.",
    coverImage: "/images/products/saat-kulesi-hediyelik.png",
    authorName: "FK KURUYEMİŞ",
    tags: ["Saat Kulesi", "Hatıra Ürünü", "Çorum"],
    isPublished: true,
    publishedAt: new Date("2026-07-01T09:00:00.000Z"),
    updatedAt: new Date("2026-07-01T09:00:00.000Z"),
    metaTitle: "Çorum Saat Kulesi Hediyelik Biblo | FK KURUYEMİŞ",
    metaDescription:
      "Çorum Saat Kulesi hediyelik biblonun mağaza rafı, şehir hatırası ve hediye sunumu içindeki yerini keşfedin.",
    content: `Çorum Saat Kulesi, şehrin en tanınan simgelerinden biridir. Bu simgeyi dekoratif bir hediyelik ürüne dönüştürmek, Çorum'dan götürülen hediyeyi daha kalıcı hale getirir.

## Sadece yiyecek değil, hatıra da sunar

Leblebi kutuları tüketildikten sonra biter; dekoratif biblo ise uzun süre saklanabilir. Bu yüzden Saat Kulesi hediyeliği, leblebi ürünlerinin yanında tamamlayıcı bir parça olarak değerlidir.

## Mağaza rafında dikkat çeker

Canlı sarı gövde, saat kulesi formu ve Çorum vurgusu ürünün rafta hemen fark edilmesini sağlar. Özellikle hediyelik köşelerinde güçlü bir odak noktası oluşturur.

## Kombin hediye yapılabilir

Bir Çorum Hatırası kutu ve Saat Kulesi biblo birlikte sunulduğunda hem lezzet hem de kalıcı obje dengesi kurulur. Şehir dışına gönderilen hediyelerde bu kombin daha anlamlı görünür.

## Çorum kimliğini güçlendirir

Yerel ürünlerde görsel kimlik önemlidir. Saat Kulesi formu, Çorum leblebisiyle aynı hediye dilini paylaşarak markanın şehirle bağını güçlendirir.`,
  },
];

export function getBlogPosts(): CatalogBlogPost[] {
  return blogPosts
    .filter((post) => post.isPublished)
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

export function getBlogPostBySlug(slug: string): CatalogBlogPost | undefined {
  return getBlogPosts().find((post) => post.slug === slug);
}
