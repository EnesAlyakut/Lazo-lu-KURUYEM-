import Link from "next/link";
import type { ElementType } from "react";
import type { OrderStatus } from "@prisma/client";
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

export const dynamic = "force-dynamic";

const statusLabels: Record<string, { label: string; color: string; icon: ElementType }> = {
  PENDING: { label: "Bekliyor", color: "text-amber-600", icon: Clock },
  CONFIRMED: { label: "Onaylandı", color: "text-blue-600", icon: CheckCircle },
  PROCESSING: { label: "Hazırlanıyor", color: "text-purple-600", icon: AlertCircle },
  SHIPPED: { label: "Kargoda", color: "text-indigo-600", icon: Package },
  DELIVERED: { label: "Teslim Edildi", color: "text-green-600", icon: CheckCircle },
  CANCELLED: { label: "İptal", color: "text-red-600", icon: XCircle },
  REFUNDED: { label: "İade Edildi", color: "text-gray-600", icon: XCircle },
};

const paymentLabels: Record<string, string> = {
  CREDIT_CARD: "Kredi Kartı",
  BANK_TRANSFER: "Havale/EFT",
  CASH_ON_DELIVERY: "Kapıda Ödeme",
};

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatMoney(value: number) {
  return `${value.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ₺`;
}

async function getDashboardData() {
  try {
    const { prisma } = await import("@/lib/prisma");
    const today = startOfToday();
    const excludedRevenueStatuses: OrderStatus[] = ["CANCELLED", "REFUNDED"];
    const paidRevenueWhere = {
      paymentStatus: "PAID" as const,
      status: { notIn: excludedRevenueStatuses },
    };

    const [
      totalOrders,
      pendingOrders,
      todayOrders,
      totalRevenue,
      todayRevenue,
      totalProducts,
      recentOrders,
      newsletterCount,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: { in: ["PENDING", "CONFIRMED", "PROCESSING"] } } }),
      prisma.order.count({ where: { createdAt: { gte: today } } }),
      prisma.order.aggregate({ where: paidRevenueWhere, _sum: { total: true } }),
      prisma.order.aggregate({
        where: { ...paidRevenueWhere, createdAt: { gte: today } },
        _sum: { total: true },
      }),
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
      todayOrders,
      totalRevenue: totalRevenue._sum?.total || 0,
      todayRevenue: todayRevenue._sum?.total || 0,
      totalProducts,
      recentOrders,
      newsletterCount,
      dbError: false,
    };
  } catch (error) {
    console.error("[Admin Dashboard]", error);
    return {
      totalOrders: 0,
      pendingOrders: 0,
      todayOrders: 0,
      totalRevenue: 0,
      todayRevenue: 0,
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
    todayOrders,
    totalRevenue,
    todayRevenue,
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
      detail: `Bugün ${todayOrders} sipariş`,
    },
    {
      label: "Bekleyen İşlem",
      value: pendingOrders,
      icon: Clock,
      color: "bg-amber-500",
      detail: "Bekleyen / onaylanan / hazırlanan",
    },
    {
      label: "Toplam Gelir",
      value: formatMoney(totalRevenue),
      icon: TrendingUp,
      color: "bg-green-500",
      detail: `Bugün ${formatMoney(todayRevenue)}`,
    },
    {
      label: "Aktif Ürün",
      value: totalProducts,
      icon: Package,
      color: "bg-purple-500",
      detail: "Satışta görünen ürünler",
    },
    {
      label: "E-Bülten Üyesi",
      value: newsletterCount,
      icon: Users,
      color: "bg-pink-500",
      detail: "Aktif aboneler",
    },
  ];

  return (
    <div className="p-6 pt-20 lg:p-8 lg:pt-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-500">Sipariş, gelir, ürün ve abone özetiniz burada.</p>
      </div>

      {dbError && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Veritabanı bağlantısı kurulamadı</p>
            <p className="mt-0.5 text-xs text-amber-700">
              Sipariş ve istatistikler okunamıyor. DATABASE_URL ve veritabanı bağlantısını kontrol edin.
            </p>
          </div>
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon size={18} className="text-white" />
                </div>
              </div>
              <p className="truncate text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              <p className="mt-3 min-h-4 text-xs text-gray-400">{stat.detail}</p>
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-5">
          <div>
            <h2 className="font-bold text-gray-900">Son Siparişler</h2>
            <p className="mt-0.5 text-xs text-gray-400">Müşteri siparişi tamamladığında buraya düşer.</p>
          </div>
          <Link href="/admin/siparisler" className="text-sm font-medium text-brand-600 hover:underline">
            Tümünü Gör ›
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50">
              <tr>
                {["Sipariş No", "Müşteri", "Ürün Sayısı", "Tutar", "Ödeme", "Durum", "Tarih"].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => {
                const status = statusLabels[order.status] || statusLabels.PENDING;
                const StatusIcon = status.icon;

                return (
                  <tr key={order.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/siparisler/${order.id}`}
                        className="font-mono text-sm font-semibold text-brand-600 hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                      <p className="max-w-[190px] truncate text-xs text-gray-400">{order.customerEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{order.items.length} ürün</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{formatMoney(order.total)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {paymentLabels[order.paymentMethod] || order.paymentMethod}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${status.color}`}>
                        <StatusIcon size={12} />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                      <br />
                      {new Date(order.createdAt).toLocaleTimeString("tr-TR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
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
