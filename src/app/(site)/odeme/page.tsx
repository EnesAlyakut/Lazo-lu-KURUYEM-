"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { CreditCard, Lock, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { calculateShippingCost, calculateTotalWeight } from "@/lib/shipping";

export const dynamic = "force-dynamic";

const paymentMethods = [
  {
    id: "CREDIT_CARD",
    label: "Kredi Kartı",
    desc: "Visa, Mastercard (iyzico güvenceli)",
    icon: CreditCard,
  },
];

export default function OdemePage() {
  const { items, getTotal, clearCart } = useCartStore();
  const router = useRouter();
  const paymentMethod = "CREDIT_CARD";
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
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
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/siparis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          paymentMethod,
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            productName: i.productName,
            variant: i.variant,
            price: i.price,
            quantity: i.quantity,
            total: i.price * i.quantity,
          })),
          subtotal,
          shippingCost: shipping,
          discount: 0,
          total,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        clearCart();
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

  // Redirect to cart if empty (use effect to avoid SSR issues)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push("/sepet");
    }
  }, [items.length, router, mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Sepetiniz boş, yönlendiriliyorsunuz...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-main">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <span>Sepet</span>
          <ChevronRight size={14} />
          <span className="text-brand-600 font-semibold">Ödeme</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Info */}
              <div className="card p-6">
                <h2 className="font-bold text-gray-900 text-lg mb-5 font-display">
                  Kişisel Bilgiler
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {/* Shipping Address */}
              <div className="card p-6">
                <h2 className="font-bold text-gray-900 text-lg mb-5 font-display">
                  Teslimat Adresi
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {/* Payment Method */}
              <div className="card p-6">
                <h2 className="font-bold text-gray-900 text-lg mb-5 font-display">
                  Ödeme Yöntemi
                </h2>
                <div className="space-y-3">
                  {paymentMethods.map((pm) => {
                    const Icon = pm.icon;
                    return (
                      <label
                        key={pm.id}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
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
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            paymentMethod === pm.id
                              ? "bg-brand-600 text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{pm.label}</p>
                          <p className="text-sm text-gray-500">{pm.desc}</p>
                        </div>
                        <div className="ml-auto">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              paymentMethod === pm.id
                                ? "border-brand-500"
                                : "border-gray-300"
                            }`}
                          >
                            {paymentMethod === pm.id && (
                              <div className="w-2.5 h-2.5 bg-brand-500 rounded-full" />
                            )}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {/* Credit Card Form */}
                {paymentMethod === "CREDIT_CARD" && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-2xl space-y-4">
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
                        maxLength={19}
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
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="input-label">Son Kullanma *</label>
                        <input
                          required
                          type="text"
                          maxLength={5}
                          className="input-field"
                          value={form.cardExpiry}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              cardExpiry: e.target.value
                                .replace(/\D/g, "")
                                .replace(/^(\d{2})/, "$1/"),
                            })
                          }
                          placeholder="AA/YY"
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
                          onChange={(e) =>
                            setForm({
                              ...form,
                              cardCvv: e.target.value.replace(/\D/g, ""),
                            })
                          }
                          placeholder="XXX"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-green-50 p-3 rounded-xl">
                      <Lock size={14} className="text-green-600" />
                      Ödeme bilgileriniz iyzico altyapısı ile güvende tutulmaktadır.
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Right - Summary */}
            <div>
              <div className="card p-6 sticky top-24">
                <h2 className="font-bold text-gray-900 text-lg mb-5 font-display">
                  Sipariş Özeti
                </h2>
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate flex-1 mr-2">
                        {item.productName}
                        {item.variant && (
                          <span className="text-gray-400"> ({item.variant})</span>
                        )}
                        <span className="text-gray-400"> x{item.quantity}</span>
                      </span>
                      <span className="font-medium shrink-0">
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
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Kargo ({totalWeight > 0 ? `${totalWeight.toFixed(1)} kg` : ""})</span>
                    <span>
                      {shipping.toFixed(2)} ₺
                    </span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-xl">
                    <span>Toplam</span>
                    <span className="text-brand-600">{total.toFixed(2)} ₺</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full justify-center mt-6 py-4 text-base rounded-2xl"
                >
                  <Lock size={16} />
                  {submitting ? "İşleniyor..." : "Ödeme Al ve Siparişi Tamamla"}
                </button>

                <p className="text-xs text-gray-400 text-center mt-3">
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
