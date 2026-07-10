import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { unauthorized, handleError } from "@/lib/apiErrors";

/** GET /api/blog - Public listing */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("sayfa") || "1"));
    const perPage = Math.min(20, parseInt(searchParams.get("limit") || "9"));
    const tag = searchParams.get("tag");

    const where: Record<string, unknown> = { isPublished: true };
    if (tag) where.tags = { has: tag };

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          publishedAt: true,
          tags: true,
          authorName: true,
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({ posts, total, page, perPage, totalPages: Math.ceil(total / perPage) });
  } catch (error) {
    return handleError(error);
  }
}

/** POST /api/blog - Admin only */
export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const body = await req.json();

    const post = await prisma.blogPost.create({
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        excerpt: body.excerpt,
        coverImage: body.coverImage,
        isPublished: body.isPublished ?? false,
        publishedAt: body.isPublished ? new Date() : null,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        tags: body.tags ?? [],
        authorName: body.authorName ?? "LAZOĞLU KURUYEMİŞ",
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
