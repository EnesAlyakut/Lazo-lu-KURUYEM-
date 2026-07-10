import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import { ProductCard } from "@/components/ui/ProductCard";
import { getBlogPosts } from "@/data/blogCatalog";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, Heart } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "LAZOĞLU KURUYEMİŞ | Çorum Hatırası, LüksLeb ve Hediyelik Leblebi",
  },
  description:
    "Çorum Hatırası hediyelik kutuları, LüksLeb leblebi kurabiyeleri ve özel Çorum leblebisi sunumları. Şık ambalaj, taze dolum ve hızlı teslimat.",
};

async function getHomeData() {
  const [categories, featuredProducts, bestSellers, discountedProducts] =
    await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: [{ order: "asc" }, { name: "asc" }],
        include: {
          _count: {
            select: { products: { where: { isActive: true } } },
          },
        },
      }),
      prisma.product.findMany({
        where: { isActive: true, isFeatured: true },
        orderBy: { updatedAt: "desc" },
        take: 8,
        include: {
          category: { select: { name: true, slug: true } },
          variants: { select: { id: true, weight: true, price: true, stock: true } },
          reviews: { select: { rating: true } },
        },
      }),
      prisma.product.findMany({
        where: { isActive: true, isBestSeller: true },
        orderBy: { updatedAt: "desc" },
        take: 4,
        include: {
          category: { select: { name: true, slug: true } },
          variants: { select: { id: true, weight: true, price: true, stock: true } },
          reviews: { select: { rating: true } },
        },
      }),
      prisma.product.findMany({
        where: { isActive: true, discountPrice: { not: null } },
        orderBy: { updatedAt: "desc" },
        take: 4,
        include: {
          category: { select: { name: true, slug: true } },
          variants: { select: { id: true, weight: true, price: true, stock: true } },
          reviews: { select: { rating: true } },
        },
      }),
    ]);

  const blogPosts = getBlogPosts().slice(0, 3);
  const normalizeProduct = (product: (typeof featuredProducts)[number]) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    images: toStringArray(product.images),
    basePrice: product.basePrice,
    discountPrice: product.discountPrice,
    isNatural: product.isNatural,
    isBestSeller: product.isBestSeller,
    isNew: product.isNew,
    category: product.category,
    variants: product.variants,
    reviews: product.reviews,
  });

  return {
    categories,
    featuredProducts: featuredProducts.map(normalizeProduct),
    bestSellers: bestSellers.map(normalizeProduct),
    discountedProducts: discountedProducts.map(normalizeProduct),
    blogPosts,
  };
}

function toStringArray(value: unknown) {
  const images = Array.isArray(value)
    ? value.filter(
        (item): item is string =>
          typeof item === "string" && (item.startsWith("/") || item.startsWith("http"))
      )
    : [];
  return images.length > 0 ? images : ["/images/leblebi-urun.png"];
}

export default async function HomePage() {
  const { featuredProducts, bestSellers, discountedProducts, categories, blogPosts } =
    await getHomeData();

  const topCategories = categories.slice(0, 4);

  return (
    <div className="bg-white selection:bg-brand-500 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Store",
            name: "LAZOĞLU KURUYEMİŞ",
            description: "Çorum Hatırası hediyelikleri, LüksLeb ürünleri ve leblebi satışı",
            url: process.env.NEXT_PUBLIC_SITE_URL,
            logo: `${process.env.NEXT_PUBLIC_SITE_URL}/images/logo_circular.png`,
            address: {
              "@type": "PostalAddress",
              streetAddress: "Ulukavak Mahallesi 1, Selçuk Cd. No:18/B",
              postalCode: "19040",
              addressLocality: "Çorum",
              addressRegion: "Çorum Merkez",
              addressCountry: "TR",
            },
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+90-541-649-08-83",
              contactType: "customer service",
              availableLanguage: "Turkish",
            },
          }),
        }}
      />

      <HeroSection />

      {/* --- BREATHTAKING BENTO CATEGORIES --- */}
      <section className="py-24 sm:py-32 relative overflow-hidden bg-bg-primary">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-amber-400/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-brand-500/10 blur-[100px] rounded-full" />
        
        <div className="container-main relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 font-display mb-6">
              Sizin İçin Seçtiklerimiz
            </h2>
            <p className="text-gray-500 text-lg">
              Yılların ustalığıyla hazırlanan, Çorum'un en özel lezzetleri. İster kendinize, ister sevdiklerinize armağan edin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-auto lg:h-[600px]">
            {topCategories[0] && (
              <Link href={`/urunler?kategori=${topCategories[0].slug}`} className="group relative rounded-[2rem] overflow-hidden lg:col-span-2 shadow-sm hover:shadow-2xl transition-all duration-500">
                <Image src={topCategories[0].image || "/images/karisik-kuruyemis.png"} alt={topCategories[0].name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                <div className="absolute bottom-8 left-8 right-8 text-white z-10">
                  <span className="bg-brand-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block shadow-sm text-white">Popüler</span>
                  <h3 className="text-3xl font-bold font-display mb-2 text-white drop-shadow-md">{topCategories[0].name}</h3>
                  <p className="text-white/90 line-clamp-2 max-w-md drop-shadow-sm">{topCategories[0].description}</p>
                </div>
              </Link>
            )}
            
            <div className="grid grid-cols-1 gap-6 lg:col-span-1">
              {topCategories.slice(1, 3).map((cat) => (
                <Link key={cat.id} href={`/urunler?kategori=${cat.slug}`} className="group relative rounded-[2rem] overflow-hidden h-64 lg:h-auto shadow-sm hover:shadow-2xl transition-all duration-500">
                  <Image src={cat.image || "/images/leblebi-urun.png"} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/5" />
                  <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                    <h3 className="text-2xl font-bold font-display text-white drop-shadow-md">{cat.name}</h3>
                    {cat._count && <p className="text-amber-300 text-sm font-medium drop-shadow-sm">{cat._count.products} Çeşit</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- PREMIUM BEST SELLERS SHOWCASE --- */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="container-main">
          <div className="flex flex-col sm:flex-row items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 font-display mb-6">
                Çok Satanlar
              </h2>
              <p className="text-gray-500 text-lg">
                Müşterilerimizin vazgeçemediği, her sofraya yakışan en popüler ürünlerimiz.
              </p>
            </div>
            <Link href="/urunler?filtre=cok-satan" className="inline-flex items-center gap-2 font-bold text-brand-600 hover:text-brand-700 hover:gap-3 transition-all">
              Hepsini Gör <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {bestSellers.map((product) => (
              <div key={product.id} className="hover:-translate-y-2 transition-transform duration-300">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- IMMERSIVE PARALLAX BANNER --- */}
      <section className="relative py-32 sm:py-48 overflow-hidden bg-stone-900">
        <div className="absolute inset-0">
          <Image src="/images/hakkimizda-bg.png" alt="Çorum Leblebisi Fıçı" fill className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/80 to-transparent" />
        </div>
        
        <div className="container-main relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-4xl sm:text-6xl font-bold text-white font-display mb-6 leading-tight">
              Gelenekten Gelen <br />
              <span className="text-amber-400">Eşsiz Lezzet</span>
            </h2>
            <p className="text-gray-300 text-lg sm:text-xl mb-10 leading-relaxed">
              30 yılı aşkın tecrübemizle, Çorum'un en nadide nohutlarını seçiyor, taptaze kavurarak sofralarınıza ulaştırıyoruz. Bizim için her bir leblebi, özenle işlenmiş bir sanat eseridir.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/urunler" className="bg-brand-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-brand-700 transition-colors shadow-lg hover:shadow-brand-500/30">
                Hemen Sipariş Ver
              </Link>
              <Link href="/hakkimizda" className="bg-white/10 backdrop-blur-md text-white font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors border border-white/20">
                Hikayemizi Oku
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- MINIMALIST VALUES (Replacing FeaturesBar & WhyUs) --- */}
      <section className="py-20 sm:py-24 bg-gray-50 border-b border-gray-200/50">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {[
              { icon: Leaf, title: "Doğal & Katkısız", desc: "Tüm ürünlerimiz %100 doğal yollarla hazırlanır, hiçbir katkı maddesi içermez." },
              { icon: Heart, title: "Taptaze Üretim", desc: "Siparişinize özel taze taze paketlenir ve aynı gün kargoya teslim edilir." },
              { icon: ShieldCheck, title: "Güvenli Alışveriş", desc: "256-bit SSL sertifikası ile %100 güvenli ödeme altyapısı." },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center px-6 pt-12 md:pt-0 first:pt-0">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-brand-600 mb-6 transform hover:-translate-y-2 transition-transform duration-300">
                    <Icon size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-500">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- ELEGANT BLOG PREVIEW --- */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="container-main">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 font-display mb-6">
              Lezzet Blogu
            </h2>
            <p className="text-gray-500 text-lg">
              Kuruyemişin püf noktaları, taze kalma sırları ve Çorum kültürüne dair merak edilenler.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                <div className="relative aspect-video rounded-3xl overflow-hidden mb-6">
                  <Image src={post.coverImage} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <div className="flex gap-2 mb-3">
                  {post.tags.slice(0, 1).map(tag => (
                    <span key={tag} className="text-xs font-bold text-brand-600 uppercase tracking-wider">{tag}</span>
                  ))}
                </div>
                <h3 className="text-xl font-bold text-gray-900 font-display mb-3 group-hover:text-brand-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-500 line-clamp-2 mb-4">
                  {post.excerpt}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-brand-600">
                  Devamını Oku <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
