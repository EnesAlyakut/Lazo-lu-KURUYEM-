"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import { Search, SearchX, SlidersHorizontal, ChevronRight } from "lucide-react";
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
    Object.entries(merged).forEach(([key, value]) => {
      if (value) q.set(key, String(value));
    });
    const query = q.toString();
    return query ? `/urunler?${query}` : "/urunler";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildUrl({ ara: searchTerm.trim() || undefined, sayfa: "1" }));
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="border-b border-border-color bg-white">
        <div className="container-main py-6 sm:py-10">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div className="min-w-0">
              <h1 className="font-display text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
                {activeCategory ? activeCategory.name : "Tüm Ürünlerimiz"}
              </h1>
              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                {totalCount} ürün bulundu
              </p>
            </div>

            <form onSubmit={handleSearch} className="flex w-full gap-2 sm:w-auto md:w-[420px] lg:w-[480px]">
              <div className="relative w-full shadow-sm rounded-xl">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Search size={18} className="text-brand-600" />
                </div>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Hangi ürünü arıyorsunuz?"
                  className="input-field w-full pl-10 py-2.5 text-base bg-white border-2 border-brand-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 transition-all font-medium text-gray-800"
                />
              </div>
              <button type="submit" className="btn-primary shrink-0 px-6 sm:px-8 font-bold shadow-md rounded-xl text-base">
                Ara
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-6 xl:gap-8">
          
          {/* MASAÜSTÜ SOL MENÜ (SIDEBAR) */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl bg-white p-5 shadow-sm border border-brand-50">
              <h3 className="mb-5 flex items-center gap-2 font-bold text-gray-900 text-lg border-b border-brand-50 pb-3">
                <SlidersHorizontal size={18} className="text-brand-600" />
                Filtrele
              </h3>

              <div className="mb-8">
                <p className="mb-4 text-xs font-bold uppercase tracking-wider text-brand-400">
                  Kategoriler
                </p>
                <div className="space-y-1">
                  <Link
                    href={buildUrl({ kategori: undefined, sayfa: "1" })}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-all ${
                      !searchParams.kategori
                        ? "bg-brand-600 font-medium text-white shadow-warm"
                        : "text-gray-600 hover:bg-brand-50 hover:text-brand-700"
                    }`}
                  >
                    Tüm Kategoriler
                    {!searchParams.kategori && <ChevronRight size={14} />}
                  </Link>
                  {categories.map((cat: any) => (
                    <Link
                      key={cat.id}
                      href={buildUrl({ kategori: cat.slug, sayfa: "1" })}
                      className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-all ${
                        searchParams.kategori === cat.slug
                          ? "bg-brand-600 font-medium text-white shadow-warm"
                          : "text-gray-600 hover:bg-brand-50 hover:text-brand-700"
                      }`}
                    >
                      {cat.name}
                      {searchParams.kategori === cat.slug && <ChevronRight size={14} />}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Özel filtreler sağ menüye taşındı */}
            </div>
          </aside>

          {/* MOBİL İÇİN YATAY MENÜLER (Sadece Mobilde Görünür) */}
          <div className="lg:hidden flex flex-col gap-3 mb-6">
            <div className="scrollbar-hide -mx-3 overflow-x-auto px-3">
              <div className="flex snap-x gap-2">
                <Link
                  href={buildUrl({ kategori: undefined, sayfa: "1" })}
                  className={`snap-start whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors ${
                    !searchParams.kategori
                      ? "bg-brand-600 text-white"
                      : "border border-gray-200 bg-white text-gray-600"
                  }`}
                >
                  Tüm Kategoriler
                </Link>
                {categories.map((cat: any) => (
                  <Link
                    key={cat.id}
                    href={buildUrl({ kategori: cat.slug, sayfa: "1" })}
                    className={`snap-start whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors ${
                      searchParams.kategori === cat.slug
                        ? "bg-brand-600 text-white"
                        : "border border-gray-200 bg-white text-gray-600"
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="scrollbar-hide -mx-3 overflow-x-auto px-3">
              <div className="flex snap-x gap-2">
                {filterOptions.map((opt) => (
                  <Link
                    key={opt.value}
                    href={buildUrl({ filtre: opt.value || undefined, sayfa: "1" })}
                    className={`snap-start whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors ${
                      (searchParams.filtre || "") === opt.value
                        ? "bg-brand-600 text-white"
                        : "border border-gray-200 bg-white text-gray-600"
                    }`}
                  >
                    {opt.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            {products.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-[2rem] shadow-sm border border-brand-50">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  <SearchX size={32} />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-700">Ürün bulunamadı</h3>
                <p className="mb-6 text-gray-500">Farklı bir arama veya filtre deneyin</p>
                <Link href="/urunler" className="btn-primary">
                  Tüm Ürünleri Gör
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {products.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="scrollbar-hide mt-10 flex items-center justify-start gap-2 overflow-x-auto pb-2 sm:mt-12 sm:justify-center">
                    {currentPage > 1 && (
                      <Link
                        href={buildUrl({ sayfa: String(currentPage - 1) })}
                        className="btn-secondary px-4 py-2 text-sm"
                      >
                        Önceki
                      </Link>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Link
                        key={page}
                        href={buildUrl({ sayfa: String(page) })}
                        className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition-all ${
                          page === currentPage
                            ? "bg-brand-600 text-white shadow-warm"
                            : "border border-gray-200 bg-white text-gray-700 hover:border-brand-400 hover:bg-brand-50"
                        }`}
                      >
                        {page}
                      </Link>
                    ))}
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

          {/* MASAÜSTÜ SAĞ MENÜ (ÖZEL FİLTRELER) */}
          <aside className="hidden w-56 shrink-0 xl:block">
            <div className="sticky top-24 rounded-2xl bg-white p-5 shadow-sm border border-brand-50">
              <h3 className="mb-5 flex items-center gap-2 font-bold text-gray-900 text-lg border-b border-brand-50 pb-3">
                <SlidersHorizontal size={18} className="text-brand-600" />
                Özel Seçimler
              </h3>
              <div className="space-y-1">
                {filterOptions.map((opt) => (
                  <Link
                    key={opt.value}
                    href={buildUrl({ filtre: opt.value || undefined, sayfa: "1" })}
                    className={`block rounded-xl px-3 py-2 text-sm transition-all ${
                      (searchParams.filtre || "") === opt.value
                        ? "bg-brand-100 font-medium text-brand-800 shadow-sm"
                        : "text-gray-600 hover:bg-brand-50 hover:text-brand-700"
                    }`}
                  >
                    {opt.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
