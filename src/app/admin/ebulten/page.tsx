import { prisma } from "@/lib/prisma";
import { Mail, Users } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "E-Bülten Yönetimi" };

export default async function AdminEbultenPage() {
  const [subscribers, total, activeTotal] = await Promise.all([
    prisma.newsletter.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.newsletter.count(),
    prisma.newsletter.count({ where: { isActive: true } }),
  ]);

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 font-display">E-Bülten Yönetimi</h1>
        <p className="text-gray-500 mt-1">Abone listesi ve istatistikler</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users size={18} className="text-blue-600" />
            </div>
            <p className="text-gray-500 text-sm">Toplam Abone</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{total}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Mail size={18} className="text-green-600" />
            </div>
            <p className="text-gray-500 text-sm">Aktif Abone</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{activeTotal}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <Mail size={18} className="text-red-500" />
            </div>
            <p className="text-gray-500 text-sm">Pasif Abone</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{total - activeTotal}</p>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Abone Listesi</h2>
          <span className="text-sm text-gray-500">Son 100 kayıt</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["E-posta", "Durum", "Kayıt Tarihi"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{sub.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        sub.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {sub.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {new Date(sub.createdAt).toLocaleDateString("tr-TR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {subscribers.length === 0 && (
            <div className="text-center py-12 text-gray-400">Henüz abone yok.</div>
          )}
        </div>
      </div>
    </div>
  );
}
