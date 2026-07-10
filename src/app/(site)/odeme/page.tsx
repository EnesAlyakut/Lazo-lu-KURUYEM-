"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { CreditCard, Lock, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { calculateShippingCost, calculateTotalWeight } from "@/lib/shipping";
import { validateOrderContactFields } from "@/lib/orderValidation";
import { normalizeAndValidateCard } from "@/lib/paymentValidation";

export const dynamic = "force-dynamic";

const CHECKOUT_COUPON_KEY = "fk-checkout-coupon";

const paymentMethods = [
  {
    id: "CREDIT_CARD",
    label: "Kredi Kartı",
    desc: "Visa, Mastercard ve TROY kartları desteklenir",
    icon: CreditCard,
  },
];

export default function OdemePage() {
  const { items, getTotal, clearCart, hasHydrated } = useCartStore();
  const router = useRouter();
  const paymentMethod = "CREDIT_CARD";
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null);
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    address: "",
    city: "",
    district: "",
    postalCode: "",
    notes: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardHolder: "",
  });

  const subtotal = getTotal();
  const totalWeight = items.length > 0 ? calculateTotalWeight(items) : 0;
  const shipping = items.length > 0 ? calculateShippingCost(totalWeight) : 0;
  const discount = appliedCoupon?.discountAmount || 0;
  const total = subtotal - discount + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const contactValidation = validateOrderContactFields({
      customerName: form.customerName,
      customerEmail: form.customerEmail,
      customerPhone: form.customerPhone,
      city: form.city,
      district: form.district,
      address: form.address,
      postalCode: form.postalCode,
    });

    if (!contactValidation.ok) {
      toast.error(contactValidation.message);
      return;
    }

    const cardValidation = normalizeAndValidateCard({
      cardHolder: form.cardHolder,
      cardNumber: form.cardNumber,
      cardExpiry: form.cardExpiry,
      cardCvv: form.cardCvv,
    });

    if (!cardValidation.ok) {
      toast.error(cardValidation.message);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/siparis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          customerName: contactValidation.normalized.customerName,
          customerEmail: contactValidation.normalized.customerEmail,
          customerPhone: contactValidation.normalized.customerPhone,
          city: contactValidation.normalized.city,
          district: contactValidation.normalized.district,
          address: contactValidation.normalized.address,
          postalCode: contactValidation.normalized.postalCode,
          paymentMethod,
          cardHolder: cardValidation.card.holderName,
          cardNumber: cardValidation.card.number,
          cardCvv: cardValidation.card.cvc,
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            productName: item.productName,
            variant: item.variant,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
          })),
          subtotal,
          shippingCost: shipping,
          discount,
          total,
          couponCode: appliedCoupon?.code || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        clearCart();
        localStorage.removeItem(CHECKOUT_COUPON_KEY);
        toast.success("Siparişiniz alındı! Teşekkür ederiz.");
        router.push(`/siparis-basarili?no=${data.orderNumber}`);
      } else {
        toast.error(data.message || "Bir hata oluştu.");
      }
    } catch {
      toast.error("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !hasHydrated || items.length === 0) return;

    const rawCoupon = localStorage.getItem(CHECKOUT_COUPON_KEY);
    if (!rawCoupon) {
      setAppliedCoupon(null);
      return;
    }

    let cancelled = false;

    async function validateStoredCoupon() {
      try {
        const parsed = JSON.parse(rawCoupon || "{}");
        const code = String(parsed.code || "").trim().toUpperCase();

        if (!code) {
          localStorage.removeItem(CHECKOUT_COUPON_KEY);
          setAppliedCoupon(null);
          return;
        }

        const response = await fetch("/api/kupon/dogrula", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, cartTotal: subtotal }),
        });
        const data = await response.json();

        if (!cancelled && response.ok && data.success && data.coupon) {
          setAppliedCoupon({
            code: data.coupon.code,
            discountAmount: Number(data.coupon.discountAmount || 0),
          });
          return;
        }

        localStorage.removeItem(CHECKOUT_COUPON_KEY);
        if (!cancelled) setAppliedCoupon(null);
      } catch {
        localStorage.removeItem(CHECKOUT_COUPON_KEY);
        if (!cancelled) setAppliedCoupon(null);
      }
    }

    validateStoredCoupon();

    return () => {
      cancelled = true;
    };
  }, [mounted, hasHydrated, items.length, subtotal]);

  useEffect(() => {
    if (mounted && hasHydrated && items.length === 0) {
      router.push("/sepet");
    }
  }, [items.length, router, mounted, hasHydrated]);

  if (!mounted || !hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-400">Sepetiniz boş, yönlendiriliyorsunuz...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-5 sm:py-8">
      <div className="container-main">
        <div className="scrollbar-hide mb-6 flex items-center gap-2 overflow-x-auto pb-1 text-sm text-gray-500 sm:mb-8">
          <span>Sepet</span>
          <ChevronRight size={14} />
          <span className="font-semibold text-brand-600">Ödeme</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
            <div className="space-y-6 lg:col-span-2">
              <div className="card p-4 sm:p-6">
                <h2 className="mb-5 font-display text-lg font-bold text-gray-900">
                  Kişisel Bilgiler
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="input-label">Ad Soyad *</label>
                    <input
                      required
                      type="text"
                      className="input-field"
                      value={form.customerName}
                      onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                      placeholder="Adınız Soyadınız"
                    />
                  </div>
                  <div>
                    <label className="input-label">Telefon *</label>
                    <input
                      required
                      type="tel"
                      className="input-field"
                      value={form.customerPhone}
                      onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                      placeholder="05XX XXX XX XX"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="input-label">E-posta *</label>
                    <input
                      required
                      type="email"
                      className="input-field"
                      value={form.customerEmail}
                      onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="card p-4 sm:p-6">
                <h2 className="mb-5 font-display text-lg font-bold text-gray-900">
                  Teslimat Adresi
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="input-label">Şehir *</label>
                    <input
                      required
                      type="text"
                      className="input-field"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="İstanbul"
                    />
                  </div>
                  <div>
                    <label className="input-label">İlçe *</label>
                    <input
                      required
                      type="text"
                      className="input-field"
                      value={form.district}
                      onChange={(e) => setForm({ ...form, district: e.target.value })}
                      placeholder="Kadıköy"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="input-label">Açık Adres *</label>
                    <textarea
                      required
                      className="input-field h-24 resize-none"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="Mahalle, sokak, bina no, daire no..."
                    />
                  </div>
                  <div>
                    <label className="input-label">Posta Kodu</label>
                    <input
                      type="text"
                      className="input-field"
                      value={form.postalCode}
                      onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                      placeholder="34000"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="input-label">Sipariş Notu</label>
                  <textarea
                    className="input-field h-20 resize-none"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Özel talepleriniz..."
                  />
                </div>
              </div>

              <div className="card p-4 sm:p-6">
                <h2 className="mb-5 font-display text-lg font-bold text-gray-900">
                  Ödeme Yöntemi
                </h2>
                <div className="space-y-3">
                  {paymentMethods.map((pm) => {
                    const Icon = pm.icon;
                    return (
                      <label
                        key={pm.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-3 transition-all sm:gap-4 sm:p-4 ${
                          paymentMethod === pm.id
                            ? "border-brand-500 bg-brand-50"
                            : "border-gray-200 hover:border-brand-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={pm.id}
                          checked={paymentMethod === pm.id}
                          readOnly
                          className="sr-only"
                        />
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                            paymentMethod === pm.id
                              ? "bg-brand-600 text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900">{pm.label}</p>
                          <p className="text-sm text-gray-500">{pm.desc}</p>
                        </div>
                        <div className="ml-auto">
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                              paymentMethod === pm.id ? "border-brand-500" : "border-gray-300"
                            }`}
                          >
                            {paymentMethod === pm.id && (
                              <div className="h-2.5 w-2.5 rounded-full bg-brand-500" />
                            )}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>

                <div className="mt-6 space-y-4 rounded-2xl bg-gray-50 p-4">
                  <div>
                    <label className="input-label">Kart Üzerindeki İsim *</label>
                    <input
                      required
                      type="text"
                      className="input-field"
                      value={form.cardHolder}
                      onChange={(e) => setForm({ ...form, cardHolder: e.target.value })}
                      placeholder="AD SOYAD"
                    />
                  </div>
                  <div>
                    <label className="input-label">Kart Numarası *</label>
                    <input
                      required
                      type="text"
                      maxLength={23}
                      className="input-field"
                      value={form.cardNumber}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          cardNumber: e.target.value
                            .replace(/\D/g, "")
                            .replace(/(.{4})/g, "$1 ")
                            .trim(),
                        })
                      }
                      placeholder="XXXX XXXX XXXX XXXX"
                      inputMode="numeric"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="input-label">Son Kullanma *</label>
                      <input
                        required
                        type="text"
                        maxLength={5}
                        className="input-field"
                        value={form.cardExpiry}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                          const formatted = value.length > 2 ? `${value.slice(0, 2)}/${value.slice(2)}` : value;
                          setForm({ ...form, cardExpiry: formatted });
                        }}
                        placeholder="AA/YY"
                        inputMode="numeric"
                      />
                    </div>
                    <div>
                      <label className="input-label">CVV *</label>
                      <input
                        required
                        type="text"
                        maxLength={4}
                        className="input-field"
                        value={form.cardCvv}
                        onChange={(e) => setForm({ ...form, cardCvv: e.target.value.replace(/\D/g, "") })}
                        placeholder="XXX"
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-green-50 p-3 text-xs text-gray-500">
                    <Lock size={14} className="text-green-600" />
                    Ödeme bilgileriniz güvenli altyapı ile korunur.
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="card p-4 sm:p-6 lg:sticky lg:top-24">
                <h2 className="mb-5 font-display text-lg font-bold text-gray-900">
                  Sipariş Özeti
                </h2>
                <div className="mb-6 space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="mr-2 flex-1 truncate text-gray-600">
                        {item.productName}
                        {item.variant && <span className="text-gray-400"> ({item.variant})</span>}
                        <span className="text-gray-400"> x{item.quantity}</span>
                      </span>
                      <span className="shrink-0 font-medium">
                        {(item.price * item.quantity).toFixed(2)} ₺
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 border-t border-gray-100 pt-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Ara Toplam</span>
                    <span>{subtotal.toFixed(2)} ₺</span>
                  </div>
                  {appliedCoupon && discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Kupon ({appliedCoupon.code})</span>
                      <span>-{discount.toFixed(2)} ₺</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Kargo ({totalWeight > 0 ? `${totalWeight.toFixed(1)} kg` : ""})</span>
                    <span>{shipping.toFixed(2)} ₺</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-3 text-xl font-bold">
                    <span>Toplam</span>
                    <span className="text-brand-600">{total.toFixed(2)} ₺</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary mt-6 w-full justify-center rounded-2xl py-4 text-sm leading-tight sm:text-base"
                >
                  <Lock size={16} />
                  {submitting ? "İşleniyor..." : "Ödeme Al ve Siparişi Tamamla"}
                </button>

                <p className="mt-3 text-center text-xs text-gray-400">
                  Sipariş vererek{" "}
                  <a href="/gizlilik-politikasi" className="underline">
                    gizlilik politikasını
                  </a>{" "}
                  kabul etmiş olursunuz.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
