import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { unauthorized, handleError, notFound } from "@/lib/apiErrors";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: Params) {
  try {
    const { id } = await context.params;
    const post = await prisma.blogPost.findUnique({
      where: { id },
    });
    if (!post) return notFound();
    return NextResponse.json(post);
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(req: NextRequest, context: Params) {
  try {
    const { id } = await context.params;
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const body = await req.json();
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) return notFound();

    let publishedAt = existing.publishedAt;
    if (body.isPublished && !existing.isPublished) {
      publishedAt = new Date();
    } else if (!body.isPublished) {
      publishedAt = null;
    }

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        excerpt: body.excerpt,
        coverImage: body.coverImage,
        isPublished: body.isPublished ?? false,
        publishedAt,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        tags: body.tags ?? [],
        authorName: body.authorName ?? "LAZOĞLU KURUYEMİŞ",
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(req: NextRequest, context: Params) {
  try {
    const { id } = await context.params;
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}
