import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { unauthorized, notFound, handleError } from "@/lib/apiErrors";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: Params) {
  try {
    const { id } = await context.params;
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const order = await prisma.order.findUnique({
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

    if (!order) return notFound("Sipariş bulunamadı.");
    return NextResponse.json(order);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(req: NextRequest, context: Params) {
  try {
    const { id } = await context.params;
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const { status } = await req.json();

    const validStatuses = [
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "REFUNDED",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: "Geçersiz sipariş durumu." }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(order);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(req: NextRequest, context: Params) {
  try {
    const { id } = await context.params;
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    await prisma.order.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}
