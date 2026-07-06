/**
 * Server/client safe date formatter.
 * toLocaleDateString("tr-TR") gives different results on Node.js vs browser,
 * causing React hydration mismatches. This function always returns DD.MM.YYYY.
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "";
  try {
    return new Date(date).toISOString().slice(0, 10).split("-").reverse().join(".");
  } catch {
    return "";
  }
}
