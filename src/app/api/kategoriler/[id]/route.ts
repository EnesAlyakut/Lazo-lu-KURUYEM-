import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { unauthorized, notFound, handleError } from "@/lib/apiErrors";

/** GET /api/kategoriler/[id] */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: true,
            basePrice: true,
            discountPrice: true,
            isActive: true,
          },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) return notFound();

    return NextResponse.json(category);
  } catch (error) {
    return handleError(error);
  }
}

/** PUT /api/kategoriler/[id] - Admin only */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const body = await req.json();

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        image: body.image,
        order: body.order,
        isActive: body.isActive,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    return handleError(error);
  }
}

/** DELETE /api/kategoriler/[id] - Admin only */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) return notFound();

    if (category._count.products > 0) {
      return NextResponse.json(
        { error: "Bu kategoriye ait ürünler olduğu için silinemez. Lütfen önce ürünleri silin veya başka bir kategoriye taşıyın." },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}
