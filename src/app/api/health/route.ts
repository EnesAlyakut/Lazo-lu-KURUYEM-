import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "LAZOĞLU KURUYEMİŞ API",
      database: "connected",
    });
  } catch (error) {
    console.error("Health check database error:", error);
    return NextResponse.json(
      {
        status: "degraded",
        timestamp: new Date().toISOString(),
        service: "LAZOĞLU KURUYEMİŞ API",
        database: "unavailable",
      },
      { status: 503 }
    );
  }
}
