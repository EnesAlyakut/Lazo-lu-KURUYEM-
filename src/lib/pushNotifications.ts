import webpush from "web-push";
import { prisma } from "@/lib/prisma";

function configureWebPush() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) return false;
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || "mailto:info@lazoglukuruyemis.com", publicKey, privateKey);
  return true;
}

export async function sendNewOrderPush(order: { id: string; orderNumber: string; customerName: string; total: number }) {
  if (!configureWebPush()) return console.warn("VAPID anahtarları tanımlı değil, sipariş bildirimi gönderilmedi.");
  const subscriptions = await prisma.pushSubscription.findMany();
  const payload = JSON.stringify({
    title: "Yeni siparişiniz var!",
    body: `#${order.orderNumber} • ${order.customerName} • ${order.total.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺`,
    url: `/admin/siparisler/${order.id}`, tag: `order-${order.id}`,
  });
  await Promise.allSettled(subscriptions.map(async (subscription) => {
    try {
      await webpush.sendNotification({ endpoint: subscription.endpoint, keys: { p256dh: subscription.p256dh, auth: subscription.auth } }, payload);
    } catch (error) {
      const statusCode = (error as { statusCode?: number }).statusCode;
      if (statusCode === 404 || statusCode === 410) await prisma.pushSubscription.delete({ where: { id: subscription.id } }).catch(() => undefined);
      else console.error("Push notification error:", error);
    }
  }));
}
