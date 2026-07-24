import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { getCatalogProductById } from "@/data/productCatalog";
import { badRequest, handleError, tooManyRequests, unauthorized } from "@/lib/apiErrors";
import { requireAdmin } from "@/lib/auth";
import { validateDeliverableEmail } from "@/lib/emailValidation";
import { getPaytrToken } from "@/lib/paytr";
import { validateCouponForCart } from "@/lib/coupons";
import { validateOrderContactFields } from "@/lib/orderValidation";
import { prisma } from "@/lib/prisma";
import { apiRateLimit } from "@/lib/rateLimit";
import { calculateShippingCost, calculateTotalWeight } from "@/lib/shipping";
import { siparisSchema } from "@/lib/validations";

function generateOrderNumber(): string {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
  return `LZG${y}${m}${d}${rand}`;
}

async function ensureCatalogProductInDatabase(productId: string) {
  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      isActive: true,
      totalStock: true,
      name: true,
      basePrice: true,
      discountPrice: true,
      variants: { select: { id: true, weight: true, price: true, stock: true } },
    },
  });

  if (existingProduct) return existingProduct;

  const catalogProduct = getCatalogProductById(productId);
  if (!catalogProduct) return null;

  const existingProductBySlug = await prisma.product.findUnique({
    where: { slug: catalogProduct.slug },
    select: {
      id: true,
      isActive: true,
      totalStock: true,
      name: true,
      basePrice: true,
      discountPrice: true,
      variants: { select: { id: true, weight: true, price: true, stock: true } },
    },
  });

  if (existingProductBySlug) return existingProductBySlug;

  const category = await prisma.category.upsert({
    where: { slug: catalogProduct.category.slug },
    update: {
      name: catalogProduct.category.name,
      description: catalogProduct.category.description,
      image: catalogProduct.category.image,
      order: catalogProduct.category.order,
      isActive: true,
    },
    create: {
      id: catalogProduct.category.id,
      name: catalogProduct.category.name,
      slug: catalogProduct.category.slug,
      description: catalogProduct.category.description,
      image: catalogProduct.category.image,
      order: catalogProduct.category.order,
      isActive: true,
    },
  });

  const product = await prisma.product.create({
    data: {
      id: catalogProduct.id,
      name: catalogProduct.name,
      slug: catalogProduct.slug,
      description: catalogProduct.description,
      shortDesc: catalogProduct.shortDesc,
      origin: catalogProduct.origin,
      production: catalogProduct.production,
      freshness: catalogProduct.freshness,
      images: catalogProduct.images,
      basePrice: catalogProduct.basePrice,
      discountPrice: catalogProduct.discountPrice,
      isNatural: catalogProduct.isNatural,
      isFeatured: catalogProduct.isFeatured,
      isBestSeller: catalogProduct.isBestSeller,
      isNew: catalogProduct.isNew,
      isActive: catalogProduct.isActive,
      totalStock: catalogProduct.totalStock,
      categoryId: category.id,
      metaTitle: catalogProduct.metaTitle,
      metaDescription: catalogProduct.metaDescription,
    },
    select: {
      id: true,
      isActive: true,
      totalStock: true,
      name: true,
      basePrice: true,
      discountPrice: true,
      variants: { select: { id: true, weight: true, price: true, stock: true } },
    },
  });

  await Promise.all(
    catalogProduct.variants.map((variant) =>
      prisma.productVariant.upsert({
        where: { id: variant.id },
        update: {
          weight: variant.weight,
          price: variant.price,
          stock: variant.stock,
          sku: variant.sku,
        },
        create: {
          id: variant.id,
          productId: catalogProduct.id,
          weight: variant.weight,
          price: variant.price,
          stock: variant.stock,
          sku: variant.sku,
        },
      })
    )
  );

  return product;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "127.0.0.1";
    const rl = apiRateLimit(ip);
    if (!rl.success) return tooManyRequests();

    const body = await req.json();
    const data = siparisSchema.parse(body);
    const contactValidation = validateOrderContactFields({
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      city: data.city,
      district: data.district,
      address: data.address,
      postalCode: data.postalCode,
    });

    if (!contactValidation.ok) {
      return badRequest(contactValidation.message);
    }

    const emailValidation = await validateDeliverableEmail(data.customerEmail);

    if (!emailValidation.valid) {
      return badRequest(emailValidation.message);
    }

    const canonicalItems: Array<{
      productId: string;
      productName: string;
      variant?: string;
      price: number;
      quantity: number;
      total: number;
    }> = [];

    for (const item of data.items) {
      const product = await ensureCatalogProductInDatabase(item.productId);
      if (!product || !product.isActive) {
        return badRequest(`"${item.productName}" ürünü artık mevcut değil.`);
      }

      const selectedVariant = item.variantId
        ? product.variants.find((variant) => variant.id === item.variantId)
        : undefined;

      if (item.variantId && !selectedVariant) {
        return badRequest(`"${product.name}" için seçilen ürün seçeneği artık mevcut değil.`);
      }

      if (!item.variantId && product.variants.length > 0) {
        return badRequest(`"${product.name}" için bir ürün seçeneği seçiniz.`);
      }

      const availableStock = selectedVariant?.stock ?? product.totalStock;
      if (item.quantity > availableStock) {
        return badRequest(`"${product.name}" için yeterli stok bulunmuyor.`);
      }

      const unitPrice = selectedVariant?.price ?? product.discountPrice ?? product.basePrice;
      const lineTotal = Math.round(unitPrice * item.quantity * 100) / 100;

      canonicalItems.push({
        productId: product.id,
        productName: product.name,
        variant: selectedVariant?.weight,
        price: unitPrice,
        quantity: item.quantity,
        total: lineTotal,
      });
    }

    const subtotal = Math.round(
      canonicalItems.reduce((sum, item) => sum + item.total, 0) * 100
    ) / 100;
    const shippingCost = calculateShippingCost(calculateTotalWeight(canonicalItems));

    let discount = 0;
    let couponCode: string | undefined;
    if (data.couponCode) {
      const couponValidation = await validateCouponForCart(data.couponCode, subtotal);
      if (!couponValidation.ok) return badRequest(couponValidation.message);
      discount = couponValidation.coupon.discountAmount;
      couponCode = couponValidation.coupon.code;
    }

    const total = Math.round((subtotal + shippingCost - discount) * 100) / 100;
    const submittedAmountsMatch =
      Math.abs(data.subtotal - subtotal) <= 0.01 &&
      Math.abs(data.shippingCost - shippingCost) <= 0.01 &&
      Math.abs(data.discount - discount) <= 0.01 &&
      Math.abs(data.total - total) <= 0.01 &&
      data.items.every((item, index) => {
        const canonical = canonicalItems[index];
        return (
          Math.abs(item.price - canonical.price) <= 0.01 &&
          Math.abs(item.total - canonical.total) <= 0.01
        );
      });

    if (!submittedAmountsMatch) {
      return badRequest("Sepet fiyatları veya kargo tutarı güncellendi. Lütfen sepeti yenileyip tekrar deneyin.");
    }

    const orderNumber = generateOrderNumber();

    // Create the order as PENDING/WAITING before getting the token
    const order = await prisma.order.create({
      data: {
        orderNumber,
        status: "PENDING",
        paymentStatus: "WAITING",
        customerName: contactValidation.normalized.customerName,
        customerEmail: emailValidation.normalizedEmail,
        customerPhone: contactValidation.normalized.customerPhone,
        address: contactValidation.normalized.address,
        city: contactValidation.normalized.city,
        district: contactValidation.normalized.district,
        postalCode: contactValidation.normalized.postalCode || "",
        notes: data.notes,
        // PayTR is the payment provider; the customer's payment method is card.
        // The existing database enum stores card payments as CREDIT_CARD.
        paymentMethod: "CREDIT_CARD",
        subtotal,
        shippingCost,
        discount,
        total,
        couponCode,
        items: {
          create: canonicalItems.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            variant: item.variant,
            price: item.price,
            quantity: item.quantity,
            total: item.total,
          })),
        },
      },
    });

    // Request token from PayTR
    let paytr;
    try {
      paytr = await getPaytrToken({
        orderNumber,
        email: emailValidation.normalizedEmail,
        total,
        items: canonicalItems.map((item) => ({
          name: item.productName,
          price: item.price,
          quantity: item.quantity,
        })),
        customerName: contactValidation.normalized.customerName,
        customerAddress: `${contactValidation.normalized.address}, ${contactValidation.normalized.district}/${contactValidation.normalized.city}`,
        customerPhone: contactValidation.normalized.customerPhone,
        ip,
      });
    } catch (error) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED", paymentStatus: "FAILED" },
      });
      throw error;
    }

    if (paytr.status === "success") {
      return NextResponse.json(
        {
          success: true,
          orderNumber: order.orderNumber,
          orderId: order.id,
          token: paytr.token
        },
        { status: 201 }
      );
    } else {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "CANCELLED",
          paymentStatus: "FAILED",
          notes:
            (order.notes ? `${order.notes}\n\n` : "") +
            `PayTR token hatası: ${paytr.reason || "Bilinmeyen hata"}`,
        },
      });
      return badRequest("Ödeme altyapısı ile iletişim kurulamadı: " + (paytr.reason || "Bilinmeyen hata"));
    }
  } catch (error) {
    if (error instanceof ZodError) {
      const firstMsg = error.errors[0]?.message || "Geçersiz sipariş verisi.";
      return badRequest(firstMsg);
    }
    return handleError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return unauthorized();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("sayfa") || "1"));
    const perPage = Math.min(100, parseInt(searchParams.get("limit") || "20"));
    const status = searchParams.get("status");

    const where = status ? { status: status as any } : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: { select: { id: true, name: true, slug: true, images: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    });
  } catch (error) {
    return handleError(error);
  }
}
