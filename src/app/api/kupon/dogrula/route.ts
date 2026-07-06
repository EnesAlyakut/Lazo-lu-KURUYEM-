import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRateLimit } from "@/lib/rateLimit";
import { tooManyRequests, badRequest, handleError } from "@/lib/apiErrors";
import { ZodError } from "zod";
import { kuponDogrulaSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    const rl = apiRateLimit(ip);
    if (!rl.success) return tooManyRequests();

    const body = await req.json();
    const { code, cartTotal } = kuponDogrulaSchema.parse(body);

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!coupon || !coupon.isActive) {
      return badRequest("Geçersiz kupon kodu.");
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return badRequest("Kuponun süresi dolmuş.");
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return badRequest("Kupon kullanım limiti dolmuş.");
    }

    if (coupon.minOrder && cartTotal < coupon.minOrder) {
      return badRequest(
        `Bu kupon için minimum sipariş tutarı ${coupon.minOrder.toFixed(2)} ₺'dir.`
      );
    }

    const discountAmount =
      coupon.type === "PERCENTAGE"
        ? (cartTotal * coupon.value) / 100
        : Math.min(coupon.value, cartTotal);

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discountAmount: Math.round(discountAmount * 100) / 100,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return badRequest(error.errors[0]?.message || "Geçersiz istek.");
    }
    return handleError(error);
  }
}
