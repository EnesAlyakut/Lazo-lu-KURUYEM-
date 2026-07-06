import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Edit, Eye, Package, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

function toStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter(
        (item): item is string =>
          typeof item === "string" &&
          (item.startsWith("/") || /^https?:\/\//.test(item))
      )
    : [];
}

export default async function AdminUrunlerPage() {
  const products = await prisma.product.findMany({
    include: { category: true, variants: true },
    orderBy: { createdAt: "desc" },
  });

  const normalizedProducts = products.map((product) => ({
    ...product,
    images: toStringArray(product.images),
  }));

  return (
    <div className="p-6 pt-20 lg:p-8 lg:pt-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">
            Ürün Yönetimi
          </h1>
          <p className="mt-1 text-gray-500">{normalizedProducts.length} ürün</p>
        </div>
        <Link href="/admin/urunler/yeni" className="btn-primary">
          <Plus size={16} />
          Yeni Ürün Ekle
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Ürün", "Kategori", "Fiyat", "Stok", "Durum", "Özellikler", "İşlem"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {normalizedProducts.map((product) => (
                <tr key={product.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-lg object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                          <Package size={18} />
                        </div>
                      )}
                      <div>
                        <p className="line-clamp-1 text-sm font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-400">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">
                      {product.category.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900">
                      {(product.discountPrice || product.basePrice).toFixed(2)} ₺
                    </p>
                    {product.discountPrice && (
                      <p className="text-xs text-gray-400 line-through">
                        {product.basePrice.toFixed(2)} ₺
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-sm font-semibold ${
                        product.totalStock === 0
                          ? "text-red-500"
                          : product.totalStock < 10
                          ? "text-amber-500"
                          : "text-green-600"
                      }`}
                    >
                      {product.totalStock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        product.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {product.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {product.isBestSeller && (
                        <span className="rounded bg-amber-50 px-1.5 py-0.5 text-xs text-amber-700">
                          Çok Satan
                        </span>
                      )}
                      {product.isFeatured && (
                        <span className="rounded bg-blue-50 px-1.5 py-0.5 text-xs text-blue-700">
                          Öne Çıkan
                        </span>
                      )}
                      {product.isNew && (
                        <span className="rounded bg-purple-50 px-1.5 py-0.5 text-xs text-purple-700">
                          Yeni
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/urunler/${product.id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-500 transition-colors hover:bg-blue-50"
                        title="Düzenle"
                      >
                        <Edit size={14} />
                      </Link>
                      <Link
                        href={`/urunler/${product.slug}`}
                        target="_blank"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-50"
                        title="Sitede Gör"
                      >
                        <Eye size={14} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {normalizedProducts.length === 0 && (
            <div className="py-12 text-center text-gray-400">
              Henüz ürün yok.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
