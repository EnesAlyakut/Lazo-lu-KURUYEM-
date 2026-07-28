"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit,
  Tag,
  Calendar,
  CheckCircle,
  XCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type Coupon = {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrder: number | null;
  maxUses: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: Date | null;
  createdAt: Date;
};

const PAGE_SIZE = 10;

export default function KuponlarClient({ coupons: initialCoupons }: { coupons: Coupon[] }) {
  const router = useRouter();
  const [coupons, setCoupons] = useState(initialCoupons);
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(coupons.length / PAGE_SIZE));
  const paginated = coupons.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/kupon/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
        // Eğer son sayfada tek kupon silindiyse önceki sayfaya git
        const newTotal = coupons.length - 1;
        const newPages = Math.max(1, Math.ceil(newTotal / PAGE_SIZE));
        if (page > newPages) setPage(newPages);
        router.refresh();
      } else {
        alert("Kupon silinemedi.");
      }
    } catch {
      alert("Bir hata oluştu.");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  const getCouponStatus = (coupon: Coupon) => {
    const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
    const isLimitReached = coupon.maxUses && coupon.usedCount >= coupon.maxUses;
    const isEffectivelyActive = coupon.isActive && !isExpired && !isLimitReached;
    return { isExpired, isLimitReached, isEffectivelyActive };
  };

  return (
    <>
      {/* Confirm Modal */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <Trash2 size={18} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Kuponu Sil</h3>
                <p className="text-sm text-gray-500">Bu işlem geri alınamaz.</p>
              </div>
            </div>
            <p className="mb-6 text-sm text-gray-600">
              <span className="font-mono font-bold text-gray-900">
                {coupons.find((c) => c.id === confirmId)?.code}
              </span>{" "}
              kodlu kuponu silmek istediğinize emin misiniz?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 rounded-xl border border-gray-200 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={() => handleDelete(confirmId)}
                disabled={deletingId === confirmId}
                className="flex-1 rounded-xl bg-red-600 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-60"
              >
                {deletingId === confirmId ? "Siliniyor..." : "Evet, Sil"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 pt-20 lg:p-8 lg:pt-8">
        {/* Başlık */}
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
            {paginated.map((coupon) => {
              const { isExpired, isLimitReached, isEffectivelyActive } = getCouponStatus(coupon);
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
                      <button
                        onClick={() => setConfirmId(coupon.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-100"
                      >
                        <Trash2 size={16} />
                      </button>
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
                    <div className="flex items-center justify-between border-t border-gray-200 pt-2 mt-2">
                      <span className="text-gray-500">Durum:</span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${
                          isEffectivelyActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {isEffectivelyActive ? <CheckCircle size={10} /> : <XCircle size={10} />}
                        {isExpired ? "Süresi Doldu" : isLimitReached ? "Limit Doldu" : coupon.isActive ? "Aktif" : "Pasif"}
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
                {paginated.map((coupon) => {
                  const { isExpired, isLimitReached, isEffectivelyActive } = getCouponStatus(coupon);
                  return (
                    <tr key={coupon.id} className="transition-colors hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Tag size={14} className="text-brand-500" />
                          <span className="font-mono text-sm font-bold text-gray-900">{coupon.code}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {coupon.type === "PERCENTAGE" ? "Yüzde" : "Sabit"}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {coupon.type === "PERCENTAGE" ? `%${coupon.value}` : `${coupon.value.toFixed(2)} ₺`}
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
                            isEffectivelyActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                          }`}
                        >
                          {isEffectivelyActive ? <CheckCircle size={11} /> : <XCircle size={11} />}
                          {isExpired ? "Süresi Doldu" : isLimitReached ? "Limit Doldu" : coupon.isActive ? "Aktif" : "Pasif"}
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
                          <button
                            onClick={() => setConfirmId(coupon.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50"
                            aria-label={`${coupon.code} kuponunu sil`}
                          >
                            <Trash2 size={14} />
                          </button>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
              <p className="text-sm text-gray-500">
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, coupons.length)} / {coupons.length} kupon
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      p === page
                        ? "bg-brand-700 text-white"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
