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

    // Exclusive Admin Login
    if (email.toLowerCase().trim() === "lazoglu" && password === "31697286lazoglu") {
      const token = await signToken({
        id: "admin-id-bypass",
        email: "lazoglu",
        name: "Lazoğlu Admin",
        role: "ADMIN",
      });

      const response = NextResponse.json({
        success: true,
        user: { id: "admin-id-bypass", name: "Lazoğlu Admin", email: "lazoglu", role: "ADMIN" },
      });

      setAuthCookie(response, token);
      return response;
    }

    return unauthorized("Geçersiz kullanıcı adı veya şifre.");
  } catch (error) {
    if (error instanceof ZodError) return handleZodError(error);
    console.error("Login error:", error);
    return serverError("Giriş yapılırken hata oluştu.");
  }
}
