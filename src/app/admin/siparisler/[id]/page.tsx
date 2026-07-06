import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  AlertCircle,
} from "lucide-react";
import StatusUpdateForm from "./StatusUpdateForm";

export const dynamic = "force-dynamic";

const statusConfig: Record<
  string,
  { label: string; color: string; bgColor: string; icon: React.ElementType }
> = {
  PENDING: { label: "Bekliyor", color: "text-amber-700", bgColor: "bg-amber-50", icon: Clock },
  CONFIRMED: { label: "Onaylandı", color: "text-blue-700", bgColor: "bg-blue-50", icon: CheckCircle },
  PROCESSING: { label: "Hazırlanıyor", color: "text-purple-700", bgColor: "bg-purple-50", icon: AlertCircle },
  SHIPPED: { label: "Kargoda", color: "text-indigo-700", bgColor: "bg-indigo-50", icon: Truck },
  DELIVERED: { label: "Teslim Edildi", color: "text-green-700", bgColor: "bg-green-50", icon: CheckCircle },
  CANCELLED: { label: "İptal", color: "text-red-700", bgColor: "bg-red-50", icon: XCircle },
  REFUNDED: { label: "İade Edildi", color: "text-gray-700", bgColor: "bg-gray-50", icon: XCircle },
};

const paymentLabels: Record<string, string> = {
  CREDIT_CARD: "Kredi Kartı",
  BANK_TRANSFER: "Havale/EFT",
  CASH_ON_DELIVERY: "Kapıda Ödeme",
};

function toStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter(
        (item): item is string =>
          typeof item === "string" &&
          (item.startsWith("/") || /^https?:\/\//.test(item))
      )
    : [];
}

interface Props {
  params: { id: string };
}

async function getOrder(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, slug: true, images: true },
          },
        },
      },
    },
  });
}

export default async function SiparisDetayPage({ params }: Props) {
  const order = await getOrder(params.id);
  if (!order) notFound();

  const status = statusConfig[order.status] || statusConfig.PENDING;
  const StatusIcon = status.icon;

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <Link
          href="/admin/siparisler"
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors shrink-0"
        >
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 font-mono">#{order.orderNumber}</h1>
          <p className="text-gray-500 mt-0.5 text-sm">
            {new Date(order.createdAt).toLocaleString("tr-TR")}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${status.color} ${status.bgColor}`}
        >
          <StatusIcon size={14} />
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Order Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center gap-2">
              <Package size={16} className="text-gray-500" />
              <h2 className="font-bold text-gray-900">Sipariş Ürünleri</h2>
              <span className="text-sm text-gray-500">({order.items.length} ürün)</span>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => {
                const productImages = toStringArray(item.product?.images);

                return (
                <div key={item.id} className="p-4 flex items-center gap-4">
                  {productImages[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={productImages[0]}
                      alt={item.productName}
                      className="w-14 h-14 rounded-xl object-cover border border-gray-100 shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm line-clamp-1">
                      {item.productName}
                    </p>
                    {item.variant && (
                      <p className="text-xs text-gray-500">{item.variant}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.quantity} adet × {item.price.toFixed(2)} ₺
                    </p>
                  </div>
                  <p className="font-bold text-gray-900 shrink-0">{item.total.toFixed(2)} ₺</p>
                </div>
                );
              })}
            </div>
            {/* Totals */}
            <div className="p-5 border-t border-gray-100 bg-gray-50 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Ara Toplam</span>
                <span>{order.subtotal.toFixed(2)} ₺</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>İndirim</span>
                  <span>-{order.discount.toFixed(2)} ₺</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Kargo</span>
                <span>
                  {order.shippingCost === 0 ? (
                    <span className="text-green-600 font-medium">Ücretsiz</span>
                  ) : (
                    `${order.shippingCost.toFixed(2)} ₺`
                  )}
                </span>
              </div>
              {order.couponCode && (
                <div className="flex justify-between text-sm text-brand-600">
                  <span>Kupon ({order.couponCode})</span>
                  <span className="text-green-600">Uygulandı</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 text-lg pt-2 border-t border-gray-200">
                <span>Toplam</span>
                <span className="text-brand-600">{order.total.toFixed(2)} ₺</span>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-4">Sipariş Durumunu Güncelle</h2>
            <StatusUpdateForm orderId={order.id} currentStatus={order.status} />
          </div>
        </div>

        {/* Right: Info panels */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <User size={16} className="text-gray-500" />
              <h2 className="font-bold text-gray-900">Müşteri Bilgileri</h2>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-gray-900">{order.customerName}</p>
              <a href={`mailto:${order.customerEmail}`} className="block text-brand-600 hover:underline">
                {order.customerEmail}
              </a>
              <a href={`tel:${order.customerPhone}`} className="block text-gray-600">
                {order.customerPhone}
              </a>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={16} className="text-gray-500" />
              <h2 className="font-bold text-gray-900">Teslimat Adresi</h2>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p>{order.address}</p>
              <p>
                {order.district}, {order.city}
                {order.postalCode ? ` - ${order.postalCode}` : ""}
              </p>
              <p>{order.country}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={16} className="text-gray-500" />
              <h2 className="font-bold text-gray-900">Ödeme</h2>
            </div>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Yöntem</span>
                <span className="font-medium text-gray-900">
                  {paymentLabels[order.paymentMethod] || order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Durum</span>
                <span
                  className={`font-medium ${
                    order.paymentStatus === "PAID" ? "text-green-600" : "text-amber-600"
                  }`}
                >
                  {order.paymentStatus === "PAID"
                    ? "Ödendi"
                    : order.paymentStatus === "WAITING"
                    ? "Bekliyor"
                    : order.paymentStatus === "FAILED"
                    ? "Başarısız"
                    : "İade Edildi"}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5">
              <h2 className="font-bold text-amber-800 mb-2 text-sm">Müşteri Notu</h2>
              <p className="text-sm text-amber-700">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
