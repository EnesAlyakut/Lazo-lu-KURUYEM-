import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Eye, Clock, CheckCircle, Package, Truck, XCircle } from "lucide-react";
import type { ElementType } from "react";

export const dynamic = "force-dynamic";

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: ElementType }> = {
  PENDING: { label: "Bekliyor", color: "text-amber-700", bgColor: "bg-amber-50", icon: Clock },
  CONFIRMED: { label: "Onaylandı", color: "text-blue-700", bgColor: "bg-blue-50", icon: CheckCircle },
  PROCESSING: { label: "Hazırlanıyor", color: "text-purple-700", bgColor: "bg-purple-50", icon: Package },
  SHIPPED: { label: "Kargoda", color: "text-indigo-700", bgColor: "bg-indigo-50", icon: Truck },
  DELIVERED: { label: "Teslim Edildi", color: "text-green-700", bgColor: "bg-green-50", icon: CheckCircle },
  CANCELLED: { label: "İptal", color: "text-red-700", bgColor: "bg-red-50", icon: XCircle },
};

const paymentLabels: Record<string, string> = {
  CREDIT_CARD: "Kredi Kartı",
  BANK_TRANSFER: "Havale/EFT",
  CASH_ON_DELIVERY: "Kapıda Ödeme",
};

export default async function AdminSiparislerPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="p-4 pt-20 lg:p-8 lg:pt-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-display">Sipariş Yönetimi</h1>
        <p className="text-gray-500 mt-1">{orders.length} sipariş</p>
      </div>

      {/* Durum Özeti */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 mb-6">
        {Object.entries(statusConfig).map(([key, cfg]) => {
          const count = orders.filter((o) => o.status === key).length;
          const Icon = cfg.icon;
          return (
            <div key={key} className={`${cfg.bgColor} rounded-xl p-3 text-center`}>
              <Icon size={16} className={`${cfg.color} mx-auto mb-1`} />
              <p className={`text-lg font-bold ${cfg.color}`}>{count}</p>
              <p className={`text-[10px] sm:text-xs ${cfg.color} opacity-80 leading-tight`}>{cfg.label}</p>
            </div>
          );
        })}
      </div>

      {/* Mobil: Kart görünümü */}
      <div className="space-y-3 md:hidden">
        {orders.map((order) => {
          const status = statusConfig[order.status] || statusConfig.PENDING;
          const StatusIcon = status.icon;
          return (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Kart başlığı */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                <Link
                  href={`/admin/siparisler/${order.id}`}
                  className="font-mono text-sm text-brand-600 font-bold hover:underline"
                >
                  {order.orderNumber}
                </Link>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${status.color} ${status.bgColor}`}>
                  <StatusIcon size={11} />
                  {status.label}
                </span>
              </div>

              {/* Kart içeriği */}
              <div className="px-4 py-3 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{order.customerName}</p>
                    <p className="text-xs text-gray-400">{order.city}, {order.district}</p>
                    <p className="text-xs text-gray-400">{order.customerPhone}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{order.total.toFixed(2)} ₺</p>
                    <p className="text-xs text-gray-400">{order.items.length} ürün</p>
                    <p className="text-xs text-gray-400 mt-0.5">{paymentLabels[order.paymentMethod] || order.paymentMethod}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString("tr-TR")}{" "}
                    {new Date(order.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <Link
                    href={`/admin/siparisler/${order.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-600 rounded-lg text-xs font-semibold hover:bg-brand-100 transition-colors"
                  >
                    <Eye size={13} />
                    Detay Gör
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
        {orders.length === 0 && (
          <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">
            Henüz sipariş yok.
          </div>
        )}
      </div>

      {/* Masaüstü: Tablo görünümü */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Sipariş No", "Müşteri", "İletişim", "Tutar", "Ödeme", "Durum", "Tarih", "İşlem"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => {
                const status = statusConfig[order.status] || statusConfig.PENDING;
                const StatusIcon = status.icon;
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/siparisler/${order.id}`} className="font-mono text-sm text-brand-600 hover:underline font-bold">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 text-sm">{order.customerName}</p>
                      <p className="text-xs text-gray-400">{order.city}, {order.district}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-600">{order.customerPhone}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[150px]">{order.customerEmail}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-gray-900">{order.total.toFixed(2)} ₺</p>
                      <p className="text-xs text-gray-400">{order.items.length} ürün</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {paymentLabels[order.paymentMethod] || order.paymentMethod}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.color} ${status.bgColor}`}>
                        <StatusIcon size={11} />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                      <br />
                      {new Date(order.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/siparisler/${order.id}`} className="w-8 h-8 flex items-center justify-center text-brand-500 hover:bg-brand-50 rounded-lg transition-colors">
                        <Eye size={14} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="text-center py-12 text-gray-400">Henüz sipariş yok.</div>
          )}
        </div>
      </div>
    </div>
  );
}
