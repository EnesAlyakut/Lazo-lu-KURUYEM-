"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import { Search, SearchX, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const filterOptions = [
  { label: "Tümü", value: "" },
  { label: "Çok Satanlar", value: "cok-satan" },
  { label: "Yeni Ürünler", value: "yeni" },
  { label: "İndirimli", value: "indirimli" },
  { label: "Doğal Lezzetler", value: "dogal" },
];

export default function ProductsClient({
  products,
  categories,
  totalCount,
  totalPages,
  currentPage,
  activeCategory,
  searchParams,
}: any) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(searchParams.ara || "");

  const buildUrl = (params: Record<string, string | undefined>) => {
    const merged = { ...searchParams, ...params };
    const q = new URLSearchParams();
    Object.entries(merged).forEach(([k, v]) => {
      // TypeScript hatasını çözen kısım: v değerini metne çeviriyoruz
      if (v) q.set(k, String(v));
    });
    return `/urunler?${q.toString()}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildUrl({ ara: searchTerm, sayfa: "1" }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-main py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-display">
                {activeCategory ? activeCategory.name : "Tüm Ürünler"}
              </h1>
              <p className="text-gray-500 mt-1">{totalCount} ürün bulundu</p>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ürün ara..."
                className="input-field w-48 md:w-64"
              />
              <button type="submit" className="btn-primary px-4">
                <Search size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container-main py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="card p-5 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <SlidersHorizontal size={16} />
                Filtrele
              </h3>

              {/* Categories */}
              <div className="mb-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Kategori
                </p>
                <div className="space-y-1">
                  <Link
                    href="/urunler"
                    className={`block px-3 py-2 rounded-xl text-sm transition-colors ${!searchParams.kategori
                        ? "bg-brand-600 text-white font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    Tüm Kategoriler
                  </Link>
                  {categories.map((cat: any) => (
                    <Link
                      key={cat.id}
                      href={buildUrl({ kategori: cat.slug, sayfa: "1" })}
                      className={`block px-3 py-2 rounded-xl text-sm transition-colors ${searchParams.kategori === cat.slug
                          ? "bg-brand-600 text-white font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Filters */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Filtre
                </p>
                <div className="space-y-1">
                  {filterOptions.map((opt) => (
                    <Link
                      key={opt.value}
                      href={buildUrl({ filtre: opt.value || undefined, sayfa: "1" })}
                      className={`block px-3 py-2 rounded-xl text-sm transition-colors ${(searchParams.filtre || "") === opt.value
                          ? "bg-brand-600 text-white font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      {opt.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filter Bar */}
            <div className="flex gap-2 mb-6 lg:hidden overflow-x-auto pb-2">
              {filterOptions.map((opt) => (
                <Link
                  key={opt.value}
                  href={buildUrl({ filtre: opt.value || undefined, sayfa: "1" })}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${(searchParams.filtre || "") === opt.value
                      ? "bg-brand-600 text-white"
                      : "bg-white text-gray-600 border border-gray-200"
                    }`}
                >
                  {opt.label}
                </Link>
              ))}
            </div>

            {products.length === 0 ? (
              <div className="text-center py-20">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  <SearchX size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  Ürün bulunamadı
                </h3>
                <p className="text-gray-500 mb-6">
                  Farklı bir arama veya filtre deneyin
                </p>
                <Link href="/urunler" className="btn-primary">
                  Tüm Ürünleri Gör
                </Link>
              </div>
            ) : (
              <>
                <div className="product-grid">
                  {products.map((p: any) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    {currentPage > 1 && (
                      <Link
                        href={buildUrl({ sayfa: String(currentPage - 1) })}
                        className="btn-secondary px-4 py-2 text-sm"
                      >
                        Önceki
                      </Link>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <Link
                          key={p}
                          href={buildUrl({ sayfa: String(p) })}
                          className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-colors ${p === currentPage
                              ? "bg-brand-600 text-white"
                              : "bg-white text-gray-700 border border-gray-200 hover:border-brand-400"
                            }`}
                        >
                          {p}
                        </Link>
                      )
                    )}
                    {currentPage < totalPages && (
                      <Link
                        href={buildUrl({ sayfa: String(currentPage + 1) })}
                        className="btn-secondary px-4 py-2 text-sm"
                      >
                        Sonraki
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
