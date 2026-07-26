"use client";

import { useCallback, useState, useEffect } from "react";
import { MessageSquare, Check, X, Trash2, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import dayjs from "dayjs";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const url = filter === "all" ? "/api/admin/reviews" : `/api/admin/reviews?filter=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      toast.error("Yorumlar yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleApproveToggle = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: !currentStatus }),
      });

      if (res.ok) {
        toast.success(currentStatus ? "Yorum onayı kaldırıldı." : "Yorum onaylandı, yayında!");
        fetchReviews();
      } else {
        toast.error("İşlem başarısız.");
      }
    } catch (error) {
      toast.error("Bir hata oluştu.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu yorumu tamamen silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Yorum başarıyla silindi.");
        fetchReviews();
      } else {
        toast.error("Silme işlemi başarısız.");
      }
    } catch (error) {
      toast.error("Bir hata oluştu.");
    }
  };

  return (
    <div className="p-4 pt-20 lg:p-8 lg:pt-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Yorum Onay Sistemi</h1>
          <p className="mt-1 text-sm text-gray-500">Müşterilerden gelen ürün yorumlarını inceleyin ve yönetin.</p>
        </div>

        <div className="flex bg-gray-100/80 rounded-xl p-1 shadow-inner border border-gray-200/50">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${filter === "all" ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5" : "text-gray-500 hover:text-gray-900"}`}
          >
            Tümü
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${filter === "pending" ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5" : "text-gray-500 hover:text-gray-900"}`}
          >
            Bekleyenler
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${filter === "approved" ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5" : "text-gray-500 hover:text-gray-900"}`}
          >
            Onaylılar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Yükleniyor...</div>
        ) : reviews.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-500">
            <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
            <p>Bu filtrede henüz hiç yorum yok.</p>
          </div>
        ) : (
          <>
            {/* Mobil Görünüm */}
            <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="mb-3 flex items-start justify-between border-b border-gray-200 pb-3">
                    <div>
                      <div className="font-semibold text-gray-900">{review.authorName}</div>
                      <div className="mt-1 flex text-amber-400 text-xs">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      {review.isApproved ? (
                        <span className="inline-block rounded bg-green-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-green-700">
                          Yayında
                        </span>
                      ) : (
                        <span className="inline-block rounded bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-700">
                          Bekliyor
                        </span>
                      )}
                      <div className="mt-1 text-[10px] text-gray-400">
                        {dayjs(review.createdAt).format("DD.MM.YYYY HH:mm")}
                      </div>
                    </div>
                  </div>

                  <p className="mb-3 text-sm text-gray-700">{review.comment}</p>

                  <div className="mb-4">
                    {review.product ? (
                      <Link
                        href={`/urunler/${review.product.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline"
                      >
                        {review.product.name}
                        <ExternalLink size={12} />
                      </Link>
                    ) : (
                      <span className="text-xs italic text-gray-400">Ürün silinmiş</span>
                    )}
                  </div>

                  <div className="flex justify-between gap-2 border-t border-gray-200 pt-3">
                    <button
                      onClick={() => handleApproveToggle(review.id, review.isApproved)}
                      className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                        review.isApproved
                          ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {review.isApproved ? (
                        <>
                          <X size={14} /> Gizle
                        </>
                      ) : (
                        <>
                          <Check size={14} /> Onayla
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="flex items-center justify-center rounded-lg bg-red-50 p-2 text-red-500 transition-colors hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Masaüstü Görünüm */}
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Müşteri / Puan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Yorum
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Ürün
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Durum
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {reviews.map((review) => (
                    <tr key={review.id} className="transition-colors hover:bg-gray-50/80">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{review.authorName}</div>
                        <div className="mt-0.5 text-xs text-gray-500">
                          {review.email || "E-posta yok"}
                        </div>
                        <div className="mt-2 flex text-sm text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                          ))}
                        </div>
                        <div className="mt-1 text-[11px] text-gray-400">
                          {dayjs(review.createdAt).format("DD.MM.YYYY HH:mm")}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="max-w-md break-words text-sm text-gray-600">
                          {review.comment}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {review.product ? (
                          <Link
                            href={`/urunler/${review.product.slug}`}
                            target="_blank"
                            className="flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline"
                          >
                            {review.product.name}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        ) : (
                          <span className="italic text-sm text-gray-400">Ürün silinmiş</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {review.isApproved ? (
                          <span className="inline-flex items-center rounded-md border border-green-200/60 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 shadow-sm">
                            Yayında
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-md border border-amber-200/60 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 shadow-sm">
                            Bekliyor
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleApproveToggle(review.id, review.isApproved)}
                            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold shadow-sm transition-all ${
                              review.isApproved
                                ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                            }`}
                            title={review.isApproved ? "Onayı Kaldır (Gizle)" : "Onayla (Yayınla)"}
                          >
                            {review.isApproved ? (
                              <>
                                <X size={14} /> Gizle
                              </>
                            ) : (
                              <>
                                <Check size={14} /> Onayla
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(review.id)}
                            className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                            title="Sil"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
