import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { apiRateLimit } from "@/lib/rateLimit";
import { tooManyRequests } from "@/lib/apiErrors";

const reviewSchema = z.object({
  authorName: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(200).optional().or(z.literal("")),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(5).max(1500),
});

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!apiRateLimit(`review:${ip}`).success) return tooManyRequests();

    const { authorName, email, rating, comment } = reviewSchema.parse(await req.json());
    const product = await prisma.product.findFirst({
      where: { id, isActive: true },
      select: { id: true },
    });
    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
    }

    const review = await prisma.review.create({
      data: {
        productId: id,
        authorName,
        email: email || null,
        rating,
        comment,
        isApproved: false,
      },
      select: { id: true, authorName: true, rating: true, comment: true, createdAt: true },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || "Geçersiz yorum." },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const reviews = await prisma.review.findMany({
    where: { productId: id, isApproved: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, authorName: true, rating: true, comment: true, createdAt: true },
  });
  return NextResponse.json(reviews);
}
