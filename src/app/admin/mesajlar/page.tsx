import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export const metadata: Metadata = {
  title: "İletişim Mesajları | Admin",
};

export default async function AdminMesajlarPage() {
  const mesajlar = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            İletişim Mesajları
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Müşterilerinizden gelen iletişim formu mesajlarını yönetin.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {mesajlar.length === 0 ? (
          <div className="text-center py-10 bg-gray-800/50 rounded-xl border border-gray-700/50">
            <p className="text-gray-400">Henüz hiç mesajınız bulunmuyor.</p>
          </div>
        ) : (
          mesajlar.map((mesaj) => (
            <div
              key={mesaj.id}
              className={`p-5 rounded-xl border transition-colors ${
                mesaj.isRead
                  ? "bg-gray-800/40 border-gray-700/50"
                  : "bg-gray-800 border-brand-500/30"
              }`}
            >
              <div className="flex justify-between items-start mb-3 border-b border-gray-700/50 pb-3">
                <div>
                  <h3 className="font-semibold text-white text-lg">
                    {mesaj.name}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400 mt-1">
                    <span>{mesaj.email}</span>
                    {mesaj.phone && <span>{mesaj.phone}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-medium">
                    {format(mesaj.createdAt, "dd MMMM yyyy HH:mm", {
                      locale: tr,
                    })}
                  </p>
                  {!mesaj.isRead && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-brand-500/20 text-brand-300 text-[10px] uppercase font-bold rounded">
                      Yeni Mesaj
                    </span>
                  )}
                </div>
              </div>

              {mesaj.subject && (
                <p className="text-sm font-semibold text-gray-300 mb-2">
                  Konu: {mesaj.subject}
                </p>
              )}
              
              <div className="text-gray-300 text-sm whitespace-pre-wrap bg-gray-900/50 p-4 rounded-lg border border-gray-700/30">
                {mesaj.message}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
