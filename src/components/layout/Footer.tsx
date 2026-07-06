"use client";

import Link from "next/link";
import Image from "next/image";
import NewsletterForm from "@/components/ui/NewsletterForm";
import {
  Phone,
  MapPin,
  Instagram,
  Facebook,
  MessageCircle,
} from "lucide-react";

const footerLinks = {
  urunler: [
    { name: "LüksLeb Kurabiyeleri", href: "/urunler?kategori=luksleb-kurabiyeleri" },
    { name: "Çorum Hatırası Kutular", href: "/urunler?kategori=corum-hatirasi-kutular" },
    { name: "Karışık Hediyelikler", href: "/urunler?kategori=karisik-hediyelikler" },
    { name: "Boş Ambalajlar", href: "/urunler?kategori=bos-ambalajlar" },
    { name: "Hatıra Ürünleri", href: "/urunler?kategori=hatira-urunleri" },
  ],
  kurumsal: [
    { name: "Hakkımızda", href: "/hakkimizda" },
    { name: "Blog", href: "/blog" },
    { name: "İletişim", href: "/iletisim" },
    { name: "İade Politikası", href: "/iade-politikasi" },
    { name: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
  ],
  musteri: [
    { name: "Sepetim", href: "/sepet" },
    { name: "Sipariş Takibi", href: "/siparis-takip" },
    { name: "Sık Sorulan Sorular", href: "/sss" },
    { name: "Kargo Bilgisi", href: "/kargo" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-gray-300">
      {/* Newsletter Banner */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-500 py-12">
        <div className="container-main text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 font-display">
            Kampanyalardan Haberdar Olun
          </h2>
          <p className="text-brand-200 mb-6">
            İlk alışverişinizde %10 indirim kazanın!
          </p>
          <NewsletterForm />
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand Info */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <Image
                    src="/images/logo_circular.png"
                    alt="FK KURUYEMİŞ Logo"
                    width={48}
                    height={48}
                    className="object-contain brightness-0 invert"
                  />
                </div>
                <div>
                  <span className="text-xl font-bold text-white font-display">
                    FK KURUYEMİŞ
                  </span>
                  <p className="text-brand-400 text-sm">Doğal & Taze</p>
                </div>
              </Link>
              <p className="text-sm leading-relaxed mb-6 text-gray-400 max-w-xs">
                1995'ten bu yana Çorum'un eşsiz leblebileri, Çorum Hatırası
                hediyelikleri ve LüksLeb özel ürünleri sizinle. Şık ambalaj,
                taze dolum ve hızlı teslimat garantisi.
              </p>
              <div className="space-y-3">
                <a
                  href="tel:+905058898828"
                  className="flex items-center gap-2 text-sm hover:text-brand-400 transition-colors"
                >
                  <Phone size={14} className="text-brand-500" />
                  0 (505) 889 88 28
                </a>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin
                    size={14}
                    className="text-brand-500 mt-0.5 shrink-0"
                  />
                  Çöplü Mah. Camikebir 3. Sokak — Çorum
                </div>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <a
                  href="https://www.instagram.com/fkkuruyemiss?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 hover:bg-pink-600 rounded-xl flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={16} />
                </a>
                <a
                  href="https://www.facebook.com/p/FK-Kuruyemi%C5%9F-Fatih-Karaku%C5%9F-61585467575881/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={16} />
                </a>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(
                    /[^0-9]/g,
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 hover:bg-green-600 rounded-xl flex items-center justify-center transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle size={16} />
                </a>
              </div>
            </div>

            {/* Products */}
            <div>
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
                Ürünler
              </h3>
              <ul className="space-y-2">
                {footerLinks.urunler.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-brand-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Corporate */}
            <div>
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
                Kurumsal
              </h3>
              <ul className="space-y-2">
                {footerLinks.kurumsal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-brand-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer */}
            <div>
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
                Müşteri Hizmetleri
              </h3>
              <ul className="space-y-2">
                {footerLinks.musteri.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-brand-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-3 bg-gray-800 rounded-xl">
                <p className="text-xs text-gray-400 font-medium mb-1">
                  Çalışma Saatleri
                </p>
                <p className="text-xs text-white">Hafta içi & Cumartesi: 09:00 - 20:00</p>
                <p className="text-xs text-gray-500">Pazar: Kapalı</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="container-main flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()} FK KURUYEMİŞ. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className="text-xs text-gray-600">
              Güvenli ödeme ile korunuyorsunuz
            </span>
            <div className="flex gap-2">
              {["Visa", "MC", "Iyzico"].map((pay) => (
                <span
                  key={pay}
                  className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400 font-mono"
                >
                  {pay}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
