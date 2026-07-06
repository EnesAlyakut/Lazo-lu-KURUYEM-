import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Tag, Calendar, CheckCircle, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kupon Yönetimi" };

export default async function AdminKuponlarPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Kupon Yönetimi</h1>
          <p className="text-gray-500 mt-1">{coupons.length} kupon</p>
        </div>
        <Link href="/admin/kuponlar/yeni" className="btn-primary">
          <Plus size={16} />
          Yeni Kupon
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Kod", "Tür", "Değer", "Min. Sipariş", "Kullanım", "Durum", "Son Tarih", "ışlem"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      {h}
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
                  <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Tag size={14} className="text-brand-500" />
                        <span className="font-mono font-bold text-gray-900 text-sm">
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
                      <span className="text-gray-900 font-medium">{coupon.usedCount}</span>
                      {coupon.maxUses && (
                        <span className="text-gray-400"> / {coupon.maxUses}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                          isEffectivelyActive
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {isEffectivelyActive ? (
                          <CheckCircle size={11} />
                        ) : (
                          <XCircle size={11} />
                        )}
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
                      <Link
                        href={`/admin/kuponlar/${coupon.id}`}
                        className="w-8 h-8 flex items-center justify-center text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={14} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {coupons.length === 0 && (
            <div className="text-center py-12 text-gray-400">Henüz kupon yok.</div>
          )}
        </div>
      </div>
    </div>
  );
}
