import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

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
    <section className="py-20 bg-brand-50">
      <div className="container-main">
        <div className="text-center mb-12">
          <h2 className="section-title">Kategoriler</h2>
          <p className="section-subtitle mx-auto">
            Çorum Hatırası hediyelikleri ve LüksLeb lezzetlerini keşfedin
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/urunler?kategori=${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] shadow-product hover:shadow-product-hover transition-all duration-300"
            >
              <Image
                src={cat.image || "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400"}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-lg font-display">
                  {cat.name}
                </h3>
                {cat._count && (
                  <p className="text-white/70 text-sm">
                    {cat._count.products} ürün
                  </p>
                )}
                <div className="flex items-center gap-1 text-amber-400 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span>Keşfet</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
