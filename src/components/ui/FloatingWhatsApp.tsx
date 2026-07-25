"use client";

import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  const whatsappNumber = "905320000000"; // Update with actual number
  const message = encodeURIComponent("Merhaba, ürünleriniz hakkında bilgi almak istiyorum.");

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
      aria-label="WhatsApp ile iletişime geçin"
    >
      <MessageCircle size={32} />
    </a>
  );
}
