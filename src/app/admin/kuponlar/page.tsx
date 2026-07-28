import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Tag, Calendar, CheckCircle, XCircle } from "lucide-react";

import DeleteCouponButton from "@/components/admin/DeleteCouponButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kupon Yönetimi" };

interface PageProps {
  searchParams?: Promise<{
    page?: string;
  }>;
}

export default async function AdminKuponlarPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const [coupons, total] = await Promise.all([
    prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.coupon.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 pt-20 lg:p-8 lg:pt-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Kupon Yönetimi</h1>
          <p className="mt-1 text-gray-500">{coupons.length} kupon</p>
        </div>
        <Link href="/admin/kuponlar/yeni" className="btn-primary">
          <Plus size={16} />
          Yeni Kupon
        </Link>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/* Mobil Görünüm */}
        <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
          {coupons.map((coupon) => {
            const isExpired = coupon.expiresAt && coupon.expiresAt < new Date();
            const isLimitReached = coupon.maxUses && coupon.usedCount >= coupon.maxUses;
            const isEffectivelyActive = coupon.isActive && !isExpired && !isLimitReached;

            return (
              <div key={coupon.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag size={16} className="text-brand-500" />
                    <span className="font-mono text-base font-bold text-gray-900">{coupon.code}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/kuponlar/${coupon.id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-500 transition-colors hover:bg-blue-100"
                    >
                      <Edit size={16} />
                    </Link>
                    <DeleteCouponButton couponId={coupon.id} />
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Değer:</span>
                    <span className="font-semibold text-gray-900">
                      {coupon.type === "PERCENTAGE" ? `%${coupon.value}` : `${coupon.value.toFixed(2)} ₺`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Kullanım:</span>
                    <span>
                      <span className="font-medium text-gray-900">{coupon.usedCount}</span>
                      {coupon.maxUses && <span className="text-gray-400"> / {coupon.maxUses}</span>}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Son Tarih:</span>
                    <span className="text-gray-700">
                      {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString("tr-TR") : "Süresiz"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                    <span className="text-gray-500">Durum:</span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${
                        isEffectivelyActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {isEffectivelyActive ? <CheckCircle size={10} /> : <XCircle size={10} />}
                      {isExpired
                        ? "Süresi Doldu"
                        : isLimitReached
                          ? "Limit Doldu"
                          : coupon.isActive
                            ? "Aktif"
                            : "Pasif"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          {coupons.length === 0 && (
            <div className="py-8 text-center text-gray-400">Henüz kupon yok.</div>
          )}
        </div>

        {/* Masaüstü Görünüm */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Kod", "Tür", "Değer", "Min. Sipariş", "Kullanım", "Durum", "Son Tarih", "İşlem"].map(
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
              {coupons.map((coupon) => {
                const isExpired = coupon.expiresAt && coupon.expiresAt < new Date();
                const isLimitReached = coupon.maxUses && coupon.usedCount >= coupon.maxUses;
                const isEffectivelyActive = coupon.isActive && !isExpired && !isLimitReached;

                return (
                  <tr key={coupon.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Tag size={14} className="text-brand-500" />
                        <span className="font-mono text-sm font-bold text-gray-900">
                          {coupon.code}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {coupon.type === "PERCENTAGE" ? "Yüzde" : "Sabit"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {coupon.type === "PERCENTAGE"
                        ? `%${coupon.value}`
                        : `${coupon.value.toFixed(2)} ₺`}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {coupon.minOrder ? `${coupon.minOrder.toFixed(2)} ₺` : "-"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="font-medium text-gray-900">{coupon.usedCount}</span>
                      {coupon.maxUses && <span className="text-gray-400"> / {coupon.maxUses}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                          isEffectivelyActive
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {isEffectivelyActive ? <CheckCircle size={11} /> : <XCircle size={11} />}
                        {isExpired
                          ? "Süresi Doldu"
                          : isLimitReached
                            ? "Limit Doldu"
                            : coupon.isActive
                              ? "Aktif"
                              : "Pasif"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {coupon.expiresAt ? (
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(coupon.expiresAt).toLocaleDateString("tr-TR")}
                        </div>
                      ) : (
                        "Süresiz"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/kuponlar/${coupon.id}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-500 transition-colors hover:bg-blue-50"
                          aria-label={`${coupon.code} kuponunu düzenle`}
                        >
                          <Edit size={14} />
                        </Link>
                        <DeleteCouponButton couponId={coupon.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {coupons.length === 0 && (
            <div className="py-12 text-center text-gray-400">Henüz kupon yok.</div>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Link
              key={i}
              href={`/admin/kuponlar?page=${i + 1}`}
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition-colors ${
                page === i + 1
                  ? "bg-brand-500 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100 shadow-sm"
              }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
