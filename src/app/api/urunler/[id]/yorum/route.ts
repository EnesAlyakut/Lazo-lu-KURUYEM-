import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { authorName, email, rating, comment } = await req.json();

    if (!authorName || !comment || !rating) {
      return NextResponse.json(
        { error: "Ad, yorum ve puan zorunludur." },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Puan 1-5 arasında olmalıdır." },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        productId: params.id,
        authorName,
        email,
        rating: parseInt(rating),
        comment,
        isApproved: false,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const reviews = await prisma.review.findMany({
    where: { productId: params.id, isApproved: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reviews);
}
