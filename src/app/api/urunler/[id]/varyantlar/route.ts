import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { unauthorized, handleError } from "@/lib/apiErrors";

/** POST /api/urunler/[id]/varyantlar - Admin only */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const body = await req.json();

    const variant = await prisma.productVariant.create({
      data: {
        productId: params.id,
        weight: body.weight,
        price: body.price,
        stock: body.stock ?? 0,
      },
    });

    // Toplam stoku güncelle
    const totalStock = await prisma.productVariant.aggregate({
      where: { productId: params.id },
      _sum: { stock: true },
    });

    await prisma.product.update({
      where: { id: params.id },
      data: { totalStock: totalStock._sum.stock ?? 0 },
    });

    return NextResponse.json(variant, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

/** GET /api/urunler/[id]/varyantlar - Public */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const variants = await prisma.productVariant.findMany({
      where: { productId: params.id },
      orderBy: { price: "asc" },
    });
    return NextResponse.json(variants);
  } catch (error) {
    return handleError(error);
  }
}
