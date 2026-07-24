"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, LoaderCircle, Package, Home, ShoppingBag, XCircle } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

const CHECKOUT_COUPON_KEY = "fk-checkout-coupon";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNo = searchParams.get("no") || searchParams.get("order");
  const clearCart = useCartStore((state) => state.clearCart);
  const [paymentStatus, setPaymentStatus] = useState<"WAITING" | "PAID" | "FAILED">("WAITING");

  useEffect(() => {
    if (!orderNo) {
      setPaymentStatus("FAILED");
      return;
    }

    let cancelled = false;
    let attempts = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const checkPayment = async () => {
      attempts += 1;
      try {
        const response = await fetch(`/api/siparis/durum?no=${encodeURIComponent(orderNo)}`, {
          cache: "no-store",
        });
        const data = await response.json();

        if (cancelled) return;
        if (response.ok && data.paymentStatus === "PAID") {
          setPaymentStatus("PAID");
          clearCart();
          localStorage.removeItem(CHECKOUT_COUPON_KEY);
          return;
        }
        if (response.ok && data.paymentStatus === "FAILED") {
          setPaymentStatus("FAILED");
          return;
        }
      } catch {
        // PayTR bildirimi birkaç saniye gecikebilir; aşağıda yeniden denenecek.
      }

      if (!cancelled && attempts < 15) {
        timeoutId = setTimeout(checkPayment, 2000);
      } else if (!cancelled) {
        setPaymentStatus("FAILED");
      }
    };

    checkPayment();
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [clearCart, orderNo]);

  const isPaid = paymentStatus === "PAID";
  const isFailed = paymentStatus === "FAILED";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
          isPaid ? "bg-green-50" : isFailed ? "bg-red-50" : "bg-amber-50"
        }`}>
          {isPaid ? (
            <CheckCircle size={40} className="text-green-500" />
          ) : isFailed ? (
            <XCircle size={40} className="text-red-500" />
          ) : (
            <LoaderCircle size={40} className="animate-spin text-amber-500" />
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3 font-display">
          {isPaid
            ? "Siparişiniz Alındı!"
            : isFailed
              ? "Ödeme Doğrulanamadı"
              : "Ödemeniz Doğrulanıyor"}
        </h1>
        {orderNo && (
          <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Sipariş Numaranız</p>
            <p className="text-2xl font-bold text-brand-600 font-mono">{orderNo}</p>
          </div>
        )}
        <p className="text-gray-600 mb-2">
          {isPaid
            ? "Ödemeniz onaylandı. Sipariş onayı e-posta adresinize gönderildi."
            : isFailed
              ? "Ödeme onayı alınamadı. Kartınızdan tahsilat yapıldıysa lütfen bizimle iletişime geçin."
              : "PayTR ödeme bildirimi bekleniyor. Lütfen bu sayfayı kapatmayın."}
        </p>
        {isPaid && (
          <p className="text-gray-500 text-sm mb-8">
            Siparişiniz 1-3 iş günü içinde kargoya verilecektir.
          </p>
        )}
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
