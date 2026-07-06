"use client";

import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { calculateShippingCost, calculateTotalWeight } from "@/lib/shipping";

export default function SepetPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const subtotal = getTotal();
  const totalWeight = items.length > 0 ? calculateTotalWeight(items) : 0;
  const shippingCost = items.length > 0 ? calculateShippingCost(totalWeight) : 0;
  const total = subtotal - discount + shippingCost;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    try {
      const res = await fetch("/api/kupon/dogrula", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, orderTotal: subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setDiscount(data.discountAmount);
        setCouponApplied(couponCode);
        toast.success(`Kupon uygulandı! ${data.discountAmount.toFixed(2)} ₺ indirim kazandınız.`);
      } else {
        toast.error(data.message || "Geçersiz kupon kodu.");
      }
    } finally {
      setApplyingCoupon(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-20">
          <ShoppingBag size={64} className="text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-700 mb-3 font-display">
            Sepetiniz Boş
          </h1>
          <p className="text-gray-500 mb-8">
            Henüz sepetinize ürün eklemediniz.
          </p>
          <Link href="/urunler" className="btn-primary">
            Alışverişe Başla
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-main">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 font-display">
          Sepetim ({items.length} ürün)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="card p-4 flex gap-4">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                  <Image
                    src={item.image}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/urunler/${item.productSlug}`}
                    className="font-bold text-gray-900 hover:text-brand-600 transition-colors line-clamp-2"
                  >
                    {item.productName}
                  </Link>
                  {item.variant && (
                    <p className="text-sm text-gray-500 mt-1">{item.variant}</p>
                  )}
                  <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="qty-btn w-8 h-8"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="qty-btn w-8 h-8"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-brand-600 text-lg">
                        {(item.price * item.quantity).toFixed(2)} ₺
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Kaldır"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <Link
              href="/urunler"
              className="inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 font-medium"
            >
              ‹ Alışverişe Devam Et
            </Link>
          </div>

          {/* Order Summary */}
          <div>
            <div className="card p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6 font-display">
                Sipariş Özeti
              </h2>

              {/* Coupon */}
              <div className="mb-6">
                <label className="input-label flex items-center gap-2">
                  <Tag size={14} />
                  Kupon Kodu
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="KUPON KOD"
                    className="input-field flex-1"
                    disabled={!!couponApplied}
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={applyingCoupon || !!couponApplied}
                    className="btn-secondary px-4 py-3 shrink-0"
                  >
                    {couponApplied ? "✓" : "Uygula"}
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-green-600 text-xs mt-1 font-medium">
                    ✓ Kupon uygulandı: {couponApplied}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Ara Toplam</span>
                  <span>{subtotal.toFixed(2)} ₺</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>İndirim</span>
                    <span>-{discount.toFixed(2)} ₺</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Kargo ({totalWeight > 0 ? `${totalWeight.toFixed(1)} kg` : ""})</span>
                  <span>
                    {shippingCost.toFixed(2)} ₺
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg">
                  <span>Toplam</span>
                  <span className="text-brand-600">{total.toFixed(2)} ₺</span>
                </div>
              </div>

              <Link
                href="/odeme"
                className="btn-primary w-full justify-center text-base py-4"
              >
                Ödemeye Geç
                <ArrowRight size={18} />
              </Link>

              <p className="text-xs text-gray-400 text-center mt-3">
                Güvenli ödeme • SSL şifreli
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
