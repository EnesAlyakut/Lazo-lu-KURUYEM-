const BRAND_SUFFIX =
  /\s*\|\s*(?:LAZOĞLU KURUYEMİŞ|FK Kuruyemiş)(?:\s+Blog)?\s*$/i;

export function withoutBrandSuffix(title: string) {
  return title.replace(BRAND_SUFFIX, "").trim();
}
