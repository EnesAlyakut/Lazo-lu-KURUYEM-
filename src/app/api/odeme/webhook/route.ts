import { NextRequest, NextResponse } from "next/server";
import { validatePaytrWebhook } from "@/lib/paytr";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { sendNewOrderPush } from "@/lib/pushNotifications";

export async function POST(req: NextRequest) {
  try {
    // PayTR webhooks are POST forms
    const formData = await req.formData();
    const body: Record<string, string> = {};
    formData.forEach((value, key) => {
      body[key] = value.toString();
    });

    // Validate Signature
    if (!validatePaytrWebhook(body)) {
      console.error("PayTR Webhook: Geçersiz imza!", body);
      return new NextResponse("Geçersiz imza", { status: 400 });
    }

    const {
      merchant_oid,
      status,
      payment_amount,
      payment_type,
      failed_reason_msg,
    } = body;

    const order = await prisma.order.findUnique({
      where: { orderNumber: merchant_oid },
      include: { items: true },
    });

    if (!order) {
      console.error("PayTR Webhook: Sipariş bulunamadı!", merchant_oid);
      return new NextResponse("Sipariş bulunamadı", { status: 404 });
    }

    if (order.paymentStatus === "PAID" || order.paymentStatus === "FAILED") {
      return new NextResponse("OK", { status: 200 });
    }

    if (status === "success") {
      const expectedAmount = Math.round(order.total * 100);
      if (!payment_amount || Number(payment_amount) !== expectedAmount) {
        console.error("PayTR Webhook: Sipariş tutarı eşleşmiyor.", {
          merchant_oid,
          expectedAmount,
          payment_amount,
        });
        return new NextResponse("Geçersiz tutar", { status: 400 });
      }

      const confirmed = await prisma.$transaction(async (tx) => {
        const transition = await tx.order.updateMany({
          where: { id: order.id, paymentStatus: "WAITING" },
          data: {
            status: "CONFIRMED",
            paymentStatus: "PAID",
            iyzipayToken: `PAYTR-${payment_type || "card"}`,
          },
        });

        if (transition.count === 0) return false;

        for (const item of order.items) {
          const productUpdate = await tx.product.updateMany({
            where: { id: item.productId, totalStock: { gte: item.quantity } },
            data: { totalStock: { decrement: item.quantity } },
          });
          if (productUpdate.count !== 1) {
            throw new Error(`Yetersiz ürün stoğu: ${item.productId}`);
          }

          if (item.variant) {
            const variantUpdate = await tx.productVariant.updateMany({
              where: {
                productId: item.productId,
                weight: item.variant,
                stock: { gte: item.quantity },
              },
              data: { stock: { decrement: item.quantity } },
            });
            if (variantUpdate.count !== 1) {
              throw new Error(`Yetersiz varyant stoğu: ${item.productId}/${item.variant}`);
            }
          }
        }

        if (order.couponCode) {
          await tx.coupon.updateMany({
            where: { code: order.couponCode },
            data: { usedCount: { increment: 1 } },
          });
        }

        return true;
      });

      if (confirmed) {
        sendOrderConfirmationEmail({
          to: order.customerEmail,
          customerName: order.customerName,
          orderNumber: order.orderNumber,
          total: order.total,
          items: order.items.map((item) => ({
            productName: item.productName,
            variant: item.variant || undefined,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
          })),
        }).catch(console.error);
        sendNewOrderPush(order).catch(console.error);
      }

      return new NextResponse("OK", { status: 200 });
    } else {
      await prisma.order.updateMany({
        where: { id: order.id, paymentStatus: "WAITING" },
        data: {
          status: "CANCELLED",
          paymentStatus: "FAILED",
          notes:
            (order.notes ? `${order.notes}\n\n` : "") +
            `PayTR Hata: ${failed_reason_msg || "Bilinmiyor"}`,
        },
      });
      return new NextResponse("OK", { status: 200 });
    }
  } catch (err) {
    console.error("PayTR Webhook Hatası:", err);
    return new NextResponse("Sunucu hatası", { status: 500 });
  }
}
