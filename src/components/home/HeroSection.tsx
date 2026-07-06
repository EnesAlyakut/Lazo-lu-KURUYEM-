"use client";

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[72svh] md:min-h-[78vh] flex items-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero-bg.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/65 to-stone-950/20" />

      {/* Content */}
      <div className="relative container-main py-14 md:py-20 z-10">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 animate-fade-in">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <span className="text-white text-sm font-medium">
              Çorum'dan Gelen Özel Hatıra
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 font-display animate-slide-up">
            Çorum Hatırası{" "}
            <span className="text-amber-400">Hediyelikleri</span>
            <br />
            Kapınıza Kadar
          </h1>

          <p className="text-lg md:text-xl text-white/85 mb-8 leading-relaxed animate-slide-up">
            LüksLeb leblebi kurabiyeleri, premium Çorum Hatırası kutuları,
            karışık drajeler ve özel ambalajlarla şık hediyelik sunumlar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
            <Link
              href="/urunler"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-2xl transition-all duration-200 shadow-warm-lg hover:shadow-warm hover:-translate-y-0.5 text-lg"
            >
              Ürünleri Keşfet
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/urunler?kategori=corum-hatirasi-kutular"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold rounded-2xl border border-white/30 hover:border-white/50 transition-all duration-200 text-lg"
            >
              Çorum Hatırası Kutular
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-x-6 gap-y-4 mt-10 max-w-xl">
            {[
              { value: "1995'ten", label: "Beri" },
              { value: "14+", label: "Özel Ürün" },
              { value: "30.000+", label: "Mutlu Müşteri" },
              { value: "81 İl", label: "Teslimat" },
            ].map((badge) => (
              <div key={badge.label} className="text-center sm:text-left min-w-0">
                <div className="text-xl font-bold text-amber-400 font-display">
                  {badge.value}
                </div>
                <div className="text-white/70 text-xs">{badge.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-0.5 h-8 bg-white/40 rounded-full" />
        <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
      </div>
    </section>
  );
}
