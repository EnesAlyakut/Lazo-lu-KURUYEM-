import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(
  req: NextRequest,
  context: Params
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const { id } = await context.params;
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) return NextResponse.json({ error: "Kupon bulunamadı" }, { status: 404 });

    return NextResponse.json(coupon);
  } catch (error) {
    return NextResponse.json({ error: "Hata oluştu" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: Params
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();

    const updated = await prisma.coupon.update({
      where: { id },
      data: {
        code: body.code,
        type: body.type,
        value: body.value,
        minOrder: body.minOrder,
        maxUses: body.maxUses,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        isActive: body.isActive,
      },
    });

    return NextResponse.json({ success: true, coupon: updated });
  } catch (error) {
    return NextResponse.json({ error: "Güncelleme hatası" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: Params
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "Kupon ID bulunamadı" }, { status: 400 });
    }

    await prisma.coupon.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Kupon silme hatası:", error);
    return NextResponse.json(
      { error: "Kupon silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
