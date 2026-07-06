"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Send } from "lucide-react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/iletisim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Mesajınız alındı! En kısa sürede size döneceğiz. 🎉");
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        toast.error(data.message || "Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } catch {
      toast.error("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="input-label">Adınız Soyadınız *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            disabled={loading}
            className="input-field"
            placeholder="Adınız Soyadınız"
          />
        </div>
        <div>
          <label className="input-label">Telefon</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            disabled={loading}
            className="input-field"
            placeholder="0505 889 88 28"
          />
        </div>
      </div>
      <div>
        <label className="input-label">E-posta Adresi *</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          disabled={loading}
          className="input-field"
          placeholder="email@example.com"
        />
      </div>
      <div>
        <label className="input-label">Konu</label>
        <select
          name="subject"
          value={form.subject}
          onChange={handleChange}
          disabled={loading}
          className="input-field"
        >
          <option value="">Konu seçin...</option>
          <option value="siparis">Sipariş Hakkında</option>
          <option value="urun">Ürün Bilgisi</option>
          <option value="toptan">Toptan Satış</option>
          <option value="kargo">Kargo &amp; Teslimat</option>
          <option value="iade">İade &amp; İptal</option>
          <option value="diger">Diğer</option>
        </select>
      </div>
      <div>
        <label className="input-label">Mesajınız *</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          disabled={loading}
          className="input-field h-36 resize-none"
          placeholder="Mesajınızı buraya yazın..."
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full justify-center py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Send size={18} />
        {loading ? "Gönderiliyor..." : "Mesajı Gönder"}
      </button>
    </form>
  );
}
