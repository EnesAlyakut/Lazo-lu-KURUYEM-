"use client";

import { useState } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import toast from "react-hot-toast";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

export default function MesajlarClient({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [mesajlar, setMesajlar] = useState(initialMessages);
  const [replyingTo, setReplyingTo] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingTo || !replyText.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/mesajlar/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: replyingTo.id,
          replyText: replyText,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Yanıt başarıyla gönderildi!");
        setMesajlar(mesajlar.map((m) => (m.id === replyingTo.id ? { ...m, isRead: true } : m)));
        setReplyingTo(null);
        setReplyText("");
      } else {
        toast.error(data.message || "Yanıt gönderilemedi.");
      }
    } catch {
      toast.error("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/mesajlar/${id}/read`, {
        method: "POST",
      });
      if (res.ok) {
        setMesajlar(mesajlar.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
      }
    } catch {
      // sessiz hata
    }
  };

  return (
    <div className="grid gap-4 relative">
      {mesajlar.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400">Henüz hiç mesajınız bulunmuyor.</p>
        </div>
      ) : (
        mesajlar.map((mesaj) => (
          <div
            key={mesaj.id}
            className={`p-5 rounded-2xl border transition-colors ${
              mesaj.isRead ? "bg-white border-gray-100 shadow-sm opacity-80" : "bg-white border-brand-200 shadow-md ring-1 ring-brand-100"
            }`}
          >
            <div className="flex justify-between items-start mb-3 border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{mesaj.name}</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                  <span>{mesaj.email}</span>
                  {mesaj.phone && <span>{mesaj.phone}</span>}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 font-medium">
                  {format(new Date(mesaj.createdAt), "dd MMMM yyyy HH:mm", { locale: tr })}
                </p>
                {!mesaj.isRead && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-brand-50 text-brand-700 border border-brand-200 text-[10px] uppercase font-bold rounded">
                    Yeni Mesaj
                  </span>
                )}
              </div>
            </div>

            {mesaj.subject && (
              <p className="text-sm font-semibold text-gray-800 mb-2">Konu: {mesaj.subject}</p>
            )}

            <div className="text-gray-700 text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded-xl border border-gray-100">
              {mesaj.message}
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setReplyingTo(mesaj)}
                className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                Cevapla (E-posta Gönder)
              </button>
              {!mesaj.isRead && (
                <button
                  onClick={() => markAsRead(mesaj.id)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Okundu İşaretle
                </button>
              )}
            </div>
          </div>
        ))
      )}

      {replyingTo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-gray-100 w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Yanıtla: {replyingTo.name}
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Alıcı: <span className="font-medium text-gray-700">{replyingTo.email}</span>
            </p>
            
            <form onSubmit={handleReplySubmit}>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                required
                rows={6}
                disabled={loading}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none mb-5 shadow-inner"
                placeholder="Yanıtınızı buraya yazın..."
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyText("");
                  }}
                  disabled={loading}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-medium shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Gönderiliyor..." : "Gönder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
