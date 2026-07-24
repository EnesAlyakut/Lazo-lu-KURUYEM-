import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { unauthorized, handleError } from "@/lib/apiErrors";

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter"); // 'pending' or 'approved'

    const where: any = {};
    if (filter === "pending") where.isApproved = false;
    if (filter === "approved") where.isApproved = true;

    const reviews = await prisma.review.findMany({
      where,
      include: {
        product: { select: { name: true, slug: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(reviews);
  } catch (error) {
    return handleError(error);
  }
}
