"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, Home, ShoppingBag } from "lucide-react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNo = searchParams.get("no");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3 font-display">
          Siparişiniz Alındı!
        </h1>
        {orderNo && (
          <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Sipariş Numaranız</p>
            <p className="text-2xl font-bold text-brand-600 font-mono">{orderNo}</p>
          </div>
        )}
        <p className="text-gray-600 mb-2">
          Siparişiniz başarıyla alındı. Onay e-postası e-posta adresinize
          gönderildi.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Siparişiniz 1-3 iş günü içinde kargoya verilecektir.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-secondary gap-2">
            <Home size={16} />
            Ana Sayfa
          </Link>
          <Link href="/urunler" className="btn-primary gap-2">
            <ShoppingBag size={16} />
            Alışverişe Devam
          </Link>
        </div>
        {orderNo && (
          <Link
            href={`/siparis-takip?no=${orderNo}`}
            className="block mt-4 text-brand-600 hover:underline text-sm font-medium"
          >
            <Package size={14} className="inline mr-1" />
            Siparişimi Takip Et
          </Link>
        )}
      </div>
    </div>
  );
}

export default function SiparisBasariliPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
