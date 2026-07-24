import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { unauthorized, handleError, notFound } from "@/lib/apiErrors";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, context: Params) {
  try {
    const { id } = await context.params;
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const body = await req.json();
    const { isApproved } = body;

    if (typeof isApproved !== "boolean") {
      return NextResponse.json({ message: "Geçersiz veri" }, { status: 400 });
    }

    const review = await prisma.review.update({
      where: { id },
      data: { isApproved },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(req: NextRequest, context: Params) {
  try {
    const { id } = await context.params;
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) return notFound("Yorum bulunamadı.");

    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Yorum silindi." });
  } catch (error) {
    return handleError(error);
  }
}
