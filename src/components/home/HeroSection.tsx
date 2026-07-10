"use client";

import Link from "next/link";
import { ArrowRight, Gift, ShieldCheck, Star, Truck } from "lucide-react";
import { useState, useEffect } from "react";

const heroImages = [
  "/images/hero-bg.jpg",
  "/images/hakkimizda-bg.png",
  "/images/karisik-kuruyemis.png",
];

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000); // 6 saniyede bir değişir
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative flex min-h-[620px] items-center overflow-hidden sm:min-h-[76svh] md:min-h-[78vh]">
      {heroImages.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[3000ms] ease-in-out ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url('${src}')` }}
        />
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,12,6,0.74)_0%,rgba(28,15,7,0.82)_48%,rgba(18,11,7,0.94)_100%)] sm:bg-[linear-gradient(90deg,rgba(18,10,5,0.93)_0%,rgba(28,15,7,0.82)_48%,rgba(28,15,7,0.38)_100%)]" />

      <div className="relative z-10 w-full">
        <div className="container-main py-8 sm:py-14 md:py-20">
          <div className="mx-auto max-w-5xl text-center flex flex-col items-center">
            <div className="mx-auto mb-5 inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-2 shadow-lg backdrop-blur-md sm:mb-6 sm:px-4">
              <Star size={14} className="fill-amber-300 text-amber-300" />
              <span className="truncate text-xs font-semibold text-white sm:text-sm">
                Çorum'dan gelen özel hediyelik lezzetler
              </span>
            </div>

            <h1 className="mx-auto mb-4 w-full text-[2.15rem] font-bold leading-[1.2] text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.85)] min-[380px]:text-[2.3rem] sm:mb-6 sm:text-5xl lg:text-[4rem] text-center">
              Çorum Hatırası <span className="text-amber-300">Hediyelikleri</span> Kapınıza Kadar
            </h1>

            <p className="mx-auto mb-6 max-w-2xl text-sm font-medium leading-relaxed text-white/95 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] sm:mb-8 sm:text-lg md:text-xl text-center">
              Taze leblebi, özel drajeler ve şık Çorum Hatırası kutuları. Özenli paketlenir,
              hızlıca kapınıza gelir.
            </p>

            <div className="mx-auto flex max-w-sm flex-col gap-3 justify-center sm:max-w-none sm:flex-row sm:gap-4 w-full">
              <Link
                href="/urunler"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-600 min-[380px]:text-base sm:rounded-2xl sm:px-8 sm:py-4 sm:text-lg"
              >
                Ürünleri Keşfet
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/urunler?kategori=corum-hatirasi-kutular"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-5 py-3 text-sm font-bold text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-md transition-all duration-200 hover:border-white/70 hover:bg-white/20 min-[380px]:text-base sm:rounded-2xl sm:px-8 sm:py-4 sm:text-lg"
              >
                Hediye Kutuları
              </Link>
            </div>

            <div className="mx-auto mt-7 grid max-w-sm grid-cols-3 gap-2 sm:mt-10 sm:max-w-xl sm:grid-cols-3 sm:gap-3 w-full justify-center">
              {[
                { icon: Gift, value: "Özel", label: "Hediye" },
                { icon: ShieldCheck, value: "Güvenli", label: "Ödeme" },
                { icon: Truck, value: "81 İl", label: "Teslimat" },
              ].map((badge) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.label}
                    className="min-w-0 rounded-xl border border-white/20 bg-white/10 px-2.5 py-3 text-center shadow-lg backdrop-blur-md"
                  >
                    <Icon size={16} className="mx-auto mb-1.5 text-amber-300" />
                    <div className="truncate text-sm font-bold leading-none text-white">
                      {badge.value}
                    </div>
                    <div className="mt-1 truncate text-[11px] font-medium leading-none text-white/80">
                      {badge.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
