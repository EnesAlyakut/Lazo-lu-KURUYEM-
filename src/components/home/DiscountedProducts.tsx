import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Tag } from "lucide-react";

export default function DiscountedProducts({ products }: { products: any[] }) {
  if (!products.length) return null;
  return (
    <section className="bg-white py-10 sm:py-20">
      <div className="container-main">
        <div className="mb-7 flex flex-col items-center gap-4 text-center sm:mb-12 sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <div className="mb-3 flex items-center justify-center gap-2 sm:justify-start">
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
          <Link href="/urunler?filtre=indirimli" className="btn-secondary w-full max-w-xs gap-2 sm:w-auto">
            Tümünü Gör <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {products.map((p) => {
            const pct = Math.round(
              ((p.basePrice - p.discountPrice) / p.basePrice) * 100
            );
            return (
              <Link
                key={p.id}
                href={`/urunler/${p.slug}`}
                className="card group overflow-hidden"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50 sm:aspect-video">
                  <Image
                    src={p.images[0] || "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400"}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="badge-discount absolute left-2 top-2 sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-base">
                    -%{pct}
                  </div>
                </div>
                <div className="p-2.5 sm:p-4">
                  <h3 className="mb-1.5 line-clamp-2 min-h-[2.5rem] text-[13px] font-bold leading-tight text-gray-900 sm:mb-2 sm:min-h-0 sm:text-base">{p.name}</h3>
                  <div className="flex flex-col items-start gap-0.5 sm:flex-row sm:items-center sm:gap-3 sm:flex-wrap">
                    <span className="price-current">
                      {p.discountPrice.toFixed(2)} ₺
                    </span>
                    <span className="text-xs text-gray-400 line-through sm:text-sm">
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
