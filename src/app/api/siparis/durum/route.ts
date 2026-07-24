import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRateLimit } from "@/lib/rateLimit";
import { badRequest, notFound, tooManyRequests } from "@/lib/apiErrors";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!apiRateLimit(`order-status:${ip}`).success) return tooManyRequests();

  const orderNumber = new URL(req.url).searchParams.get("no")?.trim() || "";
  if (!/^LZG\d{11}$/.test(orderNumber)) {
    return badRequest("Geçersiz sipariş numarası.");
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: { status: true, paymentStatus: true },
  });

  if (!order) return notFound("Sipariş bulunamadı.");
  return NextResponse.json(order);
}
