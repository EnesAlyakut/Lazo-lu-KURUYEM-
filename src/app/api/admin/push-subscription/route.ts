import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { badRequest, handleError, unauthorized } from "@/lib/apiErrors";

export async function POST(req: NextRequest) {
  try {
    if (!(await requireAdmin(req))) return unauthorized();
    const subscription = await req.json();
    const endpoint = String(subscription?.endpoint || "");
    const p256dh = String(subscription?.keys?.p256dh || "");
    const auth = String(subscription?.keys?.auth || "");
    if (!endpoint || !p256dh || !auth) return badRequest("Geçersiz bildirim aboneliği.");
    await prisma.pushSubscription.upsert({ where: { endpoint }, update: { p256dh, auth, userAgent: req.headers.get("user-agent") }, create: { endpoint, p256dh, auth, userAgent: req.headers.get("user-agent") } });
    return NextResponse.json({ success: true });
  } catch (error) { return handleError(error); }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!(await requireAdmin(req))) return unauthorized();
    const { endpoint } = await req.json();
    if (endpoint) await prisma.pushSubscription.deleteMany({ where: { endpoint } });
    return NextResponse.json({ success: true });
  } catch (error) { return handleError(error); }
}
