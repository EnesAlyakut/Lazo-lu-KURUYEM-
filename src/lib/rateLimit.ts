/**
 * Basit in-memory rate limiter.
 * Production'da Redis tabanlı bir çözüm tercih edilmeli (upstash/ratelimit gibi).
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

interface RateLimitOptions {
  /** ızin verilen istek sayısı */
  limit: number;
  /** Pencere süresi (ms) */
  windowMs: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(
  key: string,
  options: RateLimitOptions = { limit: 10, windowMs: 60_000 }
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + options.windowMs });
    return { success: true, remaining: options.limit - 1, resetAt: now + options.windowMs };
  }

  if (entry.count >= options.limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { success: true, remaining: options.limit - entry.count, resetAt: entry.resetAt };
}

/** Login gibi kritik endpoint'ler için daha sıkı limit */
export function loginRateLimit(ip: string): RateLimitResult {
  return rateLimit(`login:${ip}`, { limit: 5, windowMs: 15 * 60_000 }); // 5 deneme / 15dk
}

/** Genel API rate limit */
export function apiRateLimit(ip: string): RateLimitResult {
  return rateLimit(`api:${ip}`, { limit: 60, windowMs: 60_000 }); // 60 istek / dk
}
