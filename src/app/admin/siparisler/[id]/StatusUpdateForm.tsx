"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Bekliyor" },
  { value: "CONFIRMED", label: "Onaylandı" },
  { value: "PROCESSING", label: "Hazırlanıyor" },
  { value: "SHIPPED", label: "Kargoya Verildi" },
  { value: "DELIVERED", label: "Teslim Edildi" },
  { value: "CANCELLED", label: "İptal Edildi" },
  { value: "REFUNDED", label: "İade Edildi" },
];

interface Props {
  orderId: string;
  currentStatus: string;
}

export default function StatusUpdateForm({ orderId, currentStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (status === currentStatus) {
      toast("Durum değişmedi.", { icon: "ℹ️" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/siparis/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        toast.success("Sipariş durumu güncellendi!");
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.message || "Güncelleme başarısız.");
      }
    } catch {
      toast.error("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-3 items-center">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="flex-1 input-field"
        disabled={loading}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <button
        onClick={handleUpdate}
        disabled={loading || status === currentStatus}
        className="btn-primary py-3 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </div>
  );
}
