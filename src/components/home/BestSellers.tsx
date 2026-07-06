import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";

const DEMO_BEST_SELLERS = [
  {
    id: "demo-bs-1",
    name: "Çorum Sarı Leblebi",
    slug: "corum-sari-leblebi",
    images: ["/images/leblebi-urun.png"],
    basePrice: 85.00,
    discountPrice: null,
    isNatural: true,
    isBestSeller: true,
    isNew: false,
    category: { name: "Leblebi", slug: "leblebi" },
    variants: [
      { id: "v1", weight: "250g", price: 45.00, stock: 100 },
      { id: "v2", weight: "500g", price: 85.00, stock: 100 },
    ],
    reviews: [{ rating: 5 }, { rating: 5 }, { rating: 5 }, { rating: 4 }],
  },
  {
    id: "demo-bs-2",
    name: "Karışık Kuruyemiş",
    slug: "karisik-kuruyemis",
    images: ["/images/karisik-kuruyemis.png"],
    basePrice: 220.00,
    discountPrice: 185.00,
    isNatural: true,
    isBestSeller: true,
    isNew: false,
    category: { name: "Karışık Paket", slug: "karisik-paket" },
    variants: [
      { id: "v4", weight: "250g", price: 115.00, stock: 80 },
      { id: "v5", weight: "500g", price: 185.00, stock: 60 },
    ],
    reviews: [{ rating: 5 }, { rating: 4 }, { rating: 5 }],
  },
];

export default function BestSellers({ products }: { products: any[] }) {
  const displayProducts = products.length > 0 ? products : DEMO_BEST_SELLERS;

  return (
    <section className="py-20 bg-brand-50">
      <div className="container-main">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={18} className="text-brand-500" />
              <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider">
                Çok Satanlar
              </span>
            </div>
            <h2 className="section-title">En Çok Tercih Edilenler</h2>
            <p className="section-subtitle">
              Müşterilerimizin en çok beğendiği ürünler
            </p>
          </div>
          <Link href="/urunler?filtre=cok-satan" className="btn-secondary gap-2">
            Tümünü Gör <ArrowRight size={16} />
          </Link>
        </div>
        <div className="product-grid">
          {displayProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
