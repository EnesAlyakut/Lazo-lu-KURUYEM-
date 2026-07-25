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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Müşteri / Puan</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Yorum</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ürün</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Durum</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{review.authorName}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{review.email || "E-posta yok"}</div>
                      <div className="mt-2 flex text-amber-400 text-sm">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                        ))}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-1">{dayjs(review.createdAt).format("DD.MM.YYYY HH:mm")}</div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 max-w-md break-words">{review.comment}</p>
                    </td>
                    <td className="px-6 py-4">
                      {review.product ? (
                        <Link href={`/urunler/${review.product.slug}`} target="_blank" className="text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1.5">
                          {review.product.name}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Ürün silinmiş</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {review.isApproved ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-green-50 text-green-700 border border-green-200/60 shadow-sm">
                          Yayında
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60 shadow-sm">
                          Bekliyor
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleApproveToggle(review.id, review.isApproved)}
                          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold shadow-sm ${
                            review.isApproved
                              ? "text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200"
                              : "text-green-700 bg-green-50 hover:bg-green-100 border border-green-200"
                          }`}
                          title={review.isApproved ? "Onayı Kaldır (Gizle)" : "Onayla (Yayınla)"}
                        >
                          {review.isApproved ? (
                            <><X size={14} /> Gizle</>
                          ) : (
                            <><Check size={14} /> Onayla</>
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
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
        )}
      </div>
    </div>
  );
}
