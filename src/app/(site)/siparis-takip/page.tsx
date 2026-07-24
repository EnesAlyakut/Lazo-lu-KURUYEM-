"use client";

import { FormEvent, useState } from "react";

export default function SiparisTakipPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setResult("");
    try {
      const response = await fetch(`/api/siparis/durum?siparisNo=${encodeURIComponent(orderNumber.trim())}`, {
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok) {
        setResult(data.message || "Sipariş bulunamadı.");
      } else {
        const labels: Record<string, string> = {
          PENDING: "Ödeme bekleniyor",
          CONFIRMED: "Sipariş onaylandı",
          PROCESSING: "Sipariş hazırlanıyor",
          SHIPPED: "Sipariş kargoya verildi",
          DELIVERED: "Sipariş teslim edildi",
          CANCELLED: "Sipariş iptal edildi",
          REFUNDED: "Ödeme iade edildi",
        };
        setResult(labels[data.status] || "Sipariş durumu güncellendi.");
      }
    } catch {
      setResult("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-main max-w-xl">
        <form onSubmit={submit} className="rounded-3xl bg-white p-6 shadow-sm sm:p-10">
          <h1 className="font-display text-3xl font-bold text-gray-900">Sipariş Takibi</h1>
          <p className="mt-3 text-gray-600">Ödeme sonrasında verilen LZG ile başlayan sipariş numarasını girin.</p>
          <label className="input-label mt-8" htmlFor="order-number">Sipariş numarası</label>
          <input
            id="order-number"
            className="input-field uppercase"
            value={orderNumber}
            onChange={(event) => setOrderNumber(event.target.value)}
            placeholder="LZG..."
            required
          />
          <button className="btn-primary mt-5 w-full justify-center" disabled={loading}>
            {loading ? "Sorgulanıyor..." : "Siparişi Sorgula"}
          </button>
          {result && <p className="mt-5 rounded-xl bg-brand-50 p-4 text-center font-medium text-brand-800">{result}</p>}
        </form>
      </div>
    </div>
  );
}
