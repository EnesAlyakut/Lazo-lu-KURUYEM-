import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Tag } from "lucide-react";

export default function DiscountedProducts({ products }: { products: any[] }) {
  if (!products.length) return null;
  return (
    <section className="py-20 bg-white">
      <div className="container-main">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Tag size={18} className="text-red-500" />
              <span className="text-red-600 font-semibold text-sm uppercase tracking-wider">
                Kampanyalar
              </span>
            </div>
            <h2 className="section-title">İndirimli Ürünler</h2>
            <p className="section-subtitle">
              Sınırlı süre özel fiyatlarla
            </p>
          </div>
          <Link href="/urunler?filtre=indirimli" className="btn-secondary gap-2">
            Tümünü Gör <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => {
            const pct = Math.round(
              ((p.basePrice - p.discountPrice) / p.basePrice) * 100
            );
            return (
              <Link
                key={p.id}
                href={`/urunler/${p.slug}`}
                className="card overflow-hidden group"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={p.images[0] || "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400"}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 badge-discount text-base px-3 py-1">
                    -%{pct}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2">{p.name}</h3>
                  <div className="flex items-center gap-3">
                    <span className="price-current text-xl">
                      {p.discountPrice.toFixed(2)} ₺
                    </span>
                    <span className="text-gray-400 line-through text-sm">
                      {p.basePrice.toFixed(2)} ₺
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
