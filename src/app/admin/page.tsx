import {
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";

const statusLabels: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: { label: "Bekliyor", color: "text-amber-500", icon: Clock },
  CONFIRMED: { label: "Onaylandı", color: "text-blue-500", icon: CheckCircle },
  PROCESSING: { label: "Hazırlanıyor", color: "text-purple-500", icon: AlertCircle },
  SHIPPED: { label: "Kargoda", color: "text-indigo-500", icon: Package },
  DELIVERED: { label: "Teslim Edildi", color: "text-green-500", icon: CheckCircle },
  CANCELLED: { label: "İptal", color: "text-red-500", icon: XCircle },
};

export const dynamic = "force-dynamic";

async function getDashboardData() {
  try {
    const { prisma } = await import("@/lib/prisma");
    const [
      totalOrders,
      pendingOrders,
      totalRevenue,
      totalProducts,
      recentOrders,
      newsletterCount,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
      prisma.newsletter.count({ where: { isActive: true } }),
    ]);

    return {
      totalOrders,
      pendingOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      totalProducts,
      recentOrders,
      newsletterCount,
      dbError: false,
    };
  } catch {
    return {
      totalOrders: 0,
      pendingOrders: 0,
      totalRevenue: 0,
      totalProducts: 0,
      recentOrders: [],
      newsletterCount: 0,
      dbError: true,
    };
  }
}

export default async function AdminDashboard() {
  const {
    totalOrders,
    pendingOrders,
    totalRevenue,
    totalProducts,
    recentOrders,
    newsletterCount,
    dbError,
  } = await getDashboardData();

  const stats = [
    {
      label: "Toplam Sipariş",
      value: totalOrders,
      icon: ShoppingBag,
      color: "bg-blue-500",
      trend: "+12%",
    },
    {
      label: "Bekleyen Sipariş",
      value: pendingOrders,
      icon: Clock,
      color: "bg-amber-500",
    },
    {
      label: "Toplam Gelir",
      value: `${totalRevenue.toLocaleString("tr-TR")} ₺`,
      icon: TrendingUp,
      color: "bg-green-500",
      trend: "+8%",
    },
    {
      label: "Aktif Ürün",
      value: totalProducts,
      icon: Package,
      color: "bg-purple-500",
    },
    {
      label: "E-Bülten Üyesi",
      value: newsletterCount,
      icon: Users,
      color: "bg-pink-500",
    },
  ];

  return (
    <div className="p-6 pt-20 lg:p-8 lg:pt-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="mt-1 text-gray-500">
          Hoş geldiniz. Güncel istatistikleriniz burada.
        </p>
      </div>

      {dbError && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              Veritabanı Bağlantısı Yok
            </p>
            <p className="mt-0.5 text-xs text-amber-600">
              DATABASE_URL tanımlı değil. Veriler gösterilemiyor. Lütfen .env dosyanızı kontrol edin.
            </p>
          </div>
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon size={18} className="text-white" />
                </div>
                {stat.trend && (
                  <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-600">
                    {stat.trend}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <h2 className="font-bold text-gray-900">Son Siparişler</h2>
          <a
            href="/admin/siparisler"
            className="text-sm font-medium text-brand-600 hover:underline"
          >
            Tümünü Gör ›
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Sipariş No", "Müşteri", "Ürün Sayısı", "Tutar", "Ödeme", "Durum", "Tarih"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order: any) => {
                const status = statusLabels[order.status] || statusLabels.PENDING;
                const StatusIcon = status.icon;
                return (
                  <tr key={order.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <a
                        href={`/admin/siparisler/${order.id}`}
                        className="font-mono text-sm font-semibold text-brand-600 hover:underline"
                      >
                        {order.orderNumber}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {order.customerName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {order.items.length} ürün
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {order.total.toFixed(2)} ₺
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {order.paymentMethod === "CREDIT_CARD"
                        ? "Kredi Kartı"
                        : order.paymentMethod === "BANK_TRANSFER"
                        ? "Havale"
                        : "Kapıda"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1.5 text-xs font-semibold ${status.color}`}>
                        <StatusIcon size={12} />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {recentOrders.length === 0 && (
            <div className="py-12 text-center text-gray-400">
              {dbError ? "Veritabanı bağlantısı kurulamadı." : "Henüz sipariş yok."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
