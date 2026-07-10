"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Başarıyla abone oldunuz! 🎉 İlk siparişinizde %10 indirim kazandınız.");
        setEmail("");
      } else {
        toast.error(data.message || "Bir hata oluştu, tekrar deneyin.");
      }
    } catch {
      toast.error("Bağlantı hatası, lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleNewsletter}
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-posta adresiniz"
        required
        disabled={loading}
        className="min-w-0 flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:border-white focus:bg-white/20 transition-all disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 bg-white text-brand-700 font-bold rounded-xl hover:bg-brand-50 transition-colors shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Gönderiliyor..." : "Abone Ol"}
      </button>
    </form>
  );
}
