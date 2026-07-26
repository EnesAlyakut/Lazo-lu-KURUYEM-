import Link from "next/link";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  _count?: { products: number };
}

export default function CategoriesSection({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <section className="bg-bg-primary py-12 sm:py-24">
      <div className="container-main">
        <div className="mb-10 text-center sm:mb-16">
          <h2 className="section-title text-gray-900 font-display font-bold">Kategoriler</h2>
          <p className="section-subtitle mx-auto text-gray-500">
            Çorum Hatırası hediyelikleri ve LüksLeb lezzetlerini keşfedin
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/urunler?kategori=${cat.slug}`}
              className="group flex flex-col bg-white rounded-3xl p-3 border border-brand-50 shadow-sm transition-all duration-300 hover:shadow-warm hover:-translate-y-1.5 hover:border-brand-200"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl mb-4 bg-gray-50 shadow-inner">
                <Image
                  src={cat.image ? (cat.image.startsWith('http') || cat.image.startsWith('/') ? cat.image : `/${cat.image}`) : "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400"}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>

              <div className="px-1 pb-2 text-center flex flex-col items-center justify-center flex-1">
                <h3 className="text-[15px] sm:text-[17px] font-bold text-gray-900 font-display transition-colors group-hover:text-brand-600 line-clamp-2 leading-snug">
                  {cat.name}
                </h3>
                {cat._count !== undefined && (
                  <p className="text-xs text-gray-500 mt-2 font-medium bg-brand-50 text-brand-700 px-3 py-1 rounded-full">
                    {cat._count.products} Çeşit
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
