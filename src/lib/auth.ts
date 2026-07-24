import { jwtVerify, SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET production ortamında zorunludur.");
  }
  return new TextEncoder().encode(secret || "development-only-jwt-secret");
}

export interface JWTPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || "7d")
    .sign(getJwtSecret());
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function getAuthUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set("admin-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
}

export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set("admin-token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
}

/** Guard: API endpoint'leri için admin token doğrulama */
export async function requireAdmin(req: NextRequest): Promise<JWTPayload | null> {
  const token = req.cookies.get("admin-token")?.value;
  if (!token) return null;
  return verifyToken(token);
}
