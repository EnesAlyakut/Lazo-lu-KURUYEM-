import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import MesajlarClient from "./MesajlarClient";

export const metadata: Metadata = {
  title: "İletişim Mesajları | Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminMesajlarPage() {
  const mesajlar = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-4 pt-20 lg:p-8 lg:pt-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">
            İletişim Mesajları
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Müşterilerinizden gelen iletişim formu mesajlarını yönetin ve yanıtlayın.
          </p>
        </div>
      </div>

      <MesajlarClient initialMessages={mesajlar} />
    </div>
  );
}
