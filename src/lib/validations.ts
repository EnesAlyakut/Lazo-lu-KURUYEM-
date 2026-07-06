/**
 * Merkezi validation şemaları (Zod)
 * API endpoint'leri ve form doğrulama için kullanılır.
 */
import { z } from "zod";

// ============================================================
// AUTH
// ============================================================
export const loginSchema = z.object({
  email: z
    .string({ required_error: "Kullanıcı adı veya E-posta zorunludur." }),
  password: z
    .string({ required_error: "şifre zorunludur." })
    .min(6, "şifre en az 6 karakter olmalıdır."),
});

// ============================================================
// SIPARIS (Order)
// ============================================================
export const siparisSchema = z.object({
  customerName: z
    .string({ required_error: "Ad soyad zorunludur." })
    .min(2, "Ad soyad en az 2 karakter olmalıdır.")
    .max(100),
  customerEmail: z
    .string({ required_error: "E-posta zorunludur." })
    .email("Geçerli bir e-posta giriniz."),
  customerPhone: z
    .string({ required_error: "Telefon zorunludur." })
    .min(10, "Geçerli bir telefon numarası giriniz.")
    .max(20),
  address: z
    .string({ required_error: "Adres zorunludur." })
    .min(10, "Adres en az 10 karakter olmalıdır.")
    .max(500),
  city: z.string({ required_error: "şehir zorunludur." }).min(2).max(100),
  district: z.string({ required_error: "ılçe zorunludur." }).min(2).max(100),
  postalCode: z.string().max(10).optional(),
  notes: z.string().max(1000).optional(),
  paymentMethod: z.enum(["CREDIT_CARD"]),
  cardHolder: z
    .string({ required_error: "Kart üzerindeki isim zorunludur." })
    .trim()
    .min(3, "Kart üzerindeki isim geçerli değil.")
    .max(100),
  cardNumber: z
    .string({ required_error: "Kart numarası zorunludur." })
    .min(12, "Kart numarası geçerli değil.")
    .max(23, "Kart numarası geçerli değil."),
  cardExpiry: z
    .string({ required_error: "Son kullanma tarihi zorunludur." })
    .regex(/^\d{2}\/\d{2}$/, "Son kullanma tarihi AA/YY formatında olmalıdır."),
  cardCvv: z
    .string({ required_error: "CVV zorunludur." })
    .regex(/^\d{3,4}$/, "CVV geçerli değil."),
  couponCode: z.string().max(50).optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        productName: z.string(),
        variantId: z.string().optional(),
        variant: z.string().optional(),
        price: z.number().positive(),
        quantity: z.number().int().positive(),
        total: z.number().positive(),
      })
    )
    .min(1, "Sepet boş olamaz."),
  subtotal: z.number().nonnegative(),
  shippingCost: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  total: z.number().positive(),
});

// ============================================================
// NEWSLETTER
// ============================================================
export const newsletterSchema = z.object({
  email: z
    .string({ required_error: "E-posta zorunludur." })
    .email("Geçerli bir e-posta giriniz."),
});

// ============================================================
// KUPON (Coupon)
// ============================================================
export const kuponDogrulaSchema = z.object({
  code: z.string().min(1).max(50),
  cartTotal: z.number().nonnegative(),
});

// ============================================================
// URUN (Product) - Admin create/update
// ============================================================
export const urunSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).optional(),
  description: z.string().min(10).max(5000),
  shortDesc: z.string().max(500).optional(),
  origin: z.string().max(200).optional(),
  production: z.string().max(200).optional(),
  freshness: z.string().max(200).optional(),
  images: z.array(z.string().url()).min(1, "En az 1 görsel gerekli."),
  basePrice: z.number().positive(),
  discountPrice: z.number().positive().optional().nullable(),
  isNatural: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isActive: z.boolean().default(true),
  totalStock: z.number().int().nonnegative().default(0),
  categoryId: z.string().min(1, "Kategori seçiniz."),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
});

// ============================================================
// BLOG POST - Admin create/update
// ============================================================
export const blogPostSchema = z.object({
  title: z.string().min(5).max(300),
  slug: z.string().min(5).max(300).optional(),
  content: z.string().min(50),
  excerpt: z.string().max(500).optional(),
  coverImage: z.string().url().optional().nullable(),
  isPublished: z.boolean().default(false),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
  tags: z.array(z.string()).default([]),
  authorName: z.string().default("FK KURUYEMİŞ"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SiparisInput = z.infer<typeof siparisSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type UrunInput = z.infer<typeof urunSchema>;
export type BlogPostInput = z.infer<typeof blogPostSchema>;
