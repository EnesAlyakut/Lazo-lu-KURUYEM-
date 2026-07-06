import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Eye, Clock, CheckCircle, Package, Truck, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
  PENDING: { label: "Bekliyor", color: "text-amber-700", bgColor: "bg-amber-50", icon: Clock },
  CONFIRMED: { label: "Onaylandı", color: "text-blue-700", bgColor: "bg-blue-50", icon: CheckCircle },
  PROCESSING: { label: "Hazırlanıyor", color: "text-purple-700", bgColor: "bg-purple-50", icon: Package },
  SHIPPED: { label: "Kargoda", color: "text-indigo-700", bgColor: "bg-indigo-50", icon: Truck },
  DELIVERED: { label: "Teslim Edildi", color: "text-green-700", bgColor: "bg-green-50", icon: CheckCircle },
  CANCELLED: { label: "ıptal", color: "text-red-700", bgColor: "bg-red-50", icon: XCircle },
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
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 font-display">
          Sipariş Yönetimi
        </h1>
        <p className="text-gray-500 mt-1">{orders.length} sipariş</p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
        {Object.entries(statusConfig).map(([key, cfg]) => {
          const count = orders.filter((o) => o.status === key).length;
          const Icon = cfg.icon;
          return (
            <div key={key} className={`${cfg.bgColor} rounded-xl p-3 text-center`}>
              <Icon size={16} className={`${cfg.color} mx-auto mb-1`} />
              <p className={`text-lg font-bold ${cfg.color}`}>{count}</p>
              <p className={`text-xs ${cfg.color} opacity-80`}>{cfg.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Sipariş No", "Müşteri", "ıletişim", "Tutar", "Ödeme", "Durum", "Tarih", "ışlem"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => {
                const status = statusConfig[order.status] || statusConfig.PENDING;
                const StatusIcon = status.icon;
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/siparisler/${order.id}`}
                        className="font-mono text-sm text-brand-600 hover:underline font-bold"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 text-sm">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.city}, {order.district}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-600">{order.customerPhone}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[150px]">
                        {order.customerEmail}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-gray-900">{order.total.toFixed(2)} ₺</p>
                      <p className="text-xs text-gray-400">{order.items.length} ürün</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {paymentLabels[order.paymentMethod] || order.paymentMethod}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.color} ${status.bgColor}`}
                      >
                        <StatusIcon size={11} />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                      <br />
                      {new Date(order.createdAt).toLocaleTimeString("tr-TR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/siparisler/${order.id}`}
                        className="w-8 h-8 flex items-center justify-center text-brand-500 hover:bg-brand-50 rounded-lg transition-colors"
                      >
                        <Eye size={14} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              Henüz sipariş yok.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
