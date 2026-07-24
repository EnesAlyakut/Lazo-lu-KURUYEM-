"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const number =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^0-9]/g, "") ||
    "905424415632";
  const message = encodeURIComponent(
    "Merhaba LAZOĞLU KURUYEMİŞ! Ürünleriniz hakkında bilgi almak istiyorum."
  );
  const url = `https://wa.me/${number}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 animate-float"
      aria-label="WhatsApp ile iletişime geç"
    >
      <MessageCircle size={26} fill="white" />
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-300 rounded-full animate-ping" />
    </a>
  );
}
