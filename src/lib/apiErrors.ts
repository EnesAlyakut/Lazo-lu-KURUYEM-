/**
 * API error handling utilities.
 * Tüm endpoint'ler için tutarlı hata yanıtları üretir.
 */
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  code?: string;
}

/** 400 Bad Request */
export function badRequest(message: string, errors?: Record<string, string[]>) {
  return NextResponse.json<ApiError>({ message, errors }, { status: 400 });
}

/** 401 Unauthorized */
export function unauthorized(message = "Bu işlem için giriş yapmanız gerekiyor.") {
  return NextResponse.json<ApiError>({ message }, { status: 401 });
}

/** 403 Forbidden */
export function forbidden(message = "Bu işleme yetkiniz yok.") {
  return NextResponse.json<ApiError>({ message }, { status: 403 });
}

/** 404 Not Found */
export function notFound(message = "Kayıt bulunamadı.") {
  return NextResponse.json<ApiError>({ message }, { status: 404 });
}

/** 429 Too Many Requests */
export function tooManyRequests(message = "Çok fazla istek gönderildi. Lütfen bekleyin.") {
  return NextResponse.json<ApiError>({ message }, { status: 429 });
}

/** 500 Internal Server Error */
export function serverError(message = "Sunucu hatası oluştu.") {
  return NextResponse.json<ApiError>({ message }, { status: 500 });
}

/** Zod validation hatalarını parse et */
export function handleZodError(error: ZodError) {
  const errors: Record<string, string[]> = {};
  error.errors.forEach((err) => {
    const key = err.path.join(".");
    if (!errors[key]) errors[key] = [];
    errors[key].push(err.message);
  });
  const firstMessage = error.errors[0]?.message || "Geçersiz veri.";
  return badRequest(firstMessage, errors);
}

/** Global error handler */
export function handleError(error: unknown): NextResponse {
  console.error("[API Error]", error);

  if (error instanceof ZodError) {
    return handleZodError(error);
  }

  if (error instanceof Error) {
    // Prisma unique constraint
    if ((error as any).code === "P2002") {
      return badRequest("Bu kayıt zaten mevcut.");
    }
    // Prisma not found
    if ((error as any).code === "P2025") {
      return notFound();
    }
  }

  return serverError();
}
