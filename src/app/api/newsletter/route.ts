import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRateLimit } from "@/lib/rateLimit";
import { newsletterSchema } from "@/lib/validations";
import { tooManyRequests, handleError } from "@/lib/apiErrors";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    const rl = apiRateLimit(ip);
    if (!rl.success) return tooManyRequests();

    const body = await req.json();
    const { email } = newsletterSchema.parse(body);

    await prisma.newsletter.upsert({
      where: { email: email.toLowerCase().trim() },
      update: { isActive: true },
      create: { email: email.toLowerCase().trim() },
    });

    return NextResponse.json({ success: true, message: "Başarıyla abone oldunuz!" });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: error.errors[0]?.message }, { status: 400 });
    }
    return handleError(error);
  }
}
