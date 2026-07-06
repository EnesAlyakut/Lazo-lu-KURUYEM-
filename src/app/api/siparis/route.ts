import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { getCatalogProductById } from "@/data/productCatalog";
import { badRequest, handleError, tooManyRequests, unauthorized } from "@/lib/apiErrors";
import { requireAdmin } from "@/lib/auth";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { chargeCreditCard, hasRealIyzicoConfig } from "@/lib/iyzico";
import { normalizeAndValidateCard } from "@/lib/paymentValidation";
import { prisma } from "@/lib/prisma";
import { apiRateLimit } from "@/lib/rateLimit";
import { siparisSchema } from "@/lib/validations";

function generateOrderNumber(): string {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
  return `FK${y}${m}${d}${rand}`;
}

async function ensureCatalogProductInDatabase(productId: string) {
  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
    select: { isActive: true, totalStock: true, name: true },
  });

  if (existingProduct) return existingProduct;

  const catalogProduct = getCatalogProductById(productId);
  if (!catalogProduct) return null;

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
    select: { isActive: true, totalStock: true, name: true },
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
    const cardValidation = normalizeAndValidateCard({
      cardHolder: data.cardHolder,
      cardNumber: data.cardNumber,
      cardExpiry: data.cardExpiry,
      cardCvv: data.cardCvv,
    });

    if (!cardValidation.ok) {
      return badRequest(cardValidation.message);
    }

    const itemTotal = data.items.reduce((sum, item) => sum + item.total, 0);
    const expectedTotal = Math.round((itemTotal + data.shippingCost - data.discount) * 100) / 100;
    if (Math.abs(expectedTotal - data.total) > 0.01) {
      return badRequest("Sipariş toplamı doğrulanamadı.");
    }

    if (!hasRealIyzicoConfig()) {
      return badRequest("Canlı iyzico API bilgileri tanımlı değil. Ödeme alınmadan sipariş oluşturulamaz.");
    }

    if (data.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: data.couponCode.toUpperCase() },
      });

      if (!coupon || !coupon.isActive) return badRequest("Geçersiz veya süresi dolmuş kupon.");
      if (coupon.expiresAt && coupon.expiresAt < new Date()) return badRequest("Kuponun süresi dolmuş.");
      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return badRequest("Kupon kullanım limiti dolmuş.");
      if (coupon.minOrder && data.subtotal < coupon.minOrder) {
        return badRequest(`Bu kupon için minimum sipariş tutarı ${coupon.minOrder} ₺'dir.`);
      }
    }

    for (const item of data.items) {
      const product = await ensureCatalogProductInDatabase(item.productId);
      if (!product || !product.isActive) {
        return badRequest(`"${item.productName}" ürünü artık mevcut değil.`);
      }
    }

    const orderNumber = generateOrderNumber();
    const payment = await chargeCreditCard({
      conversationId: orderNumber,
      card: cardValidation.card,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      address: data.address,
      city: data.city,
      district: data.district,
      postalCode: data.postalCode,
      ip,
      subtotal: data.subtotal,
      shippingCost: data.shippingCost,
      total: data.total,
      items: data.items,
    });

    if (!payment.ok) {
      return badRequest(payment.message);
    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        status: "CONFIRMED",
        paymentStatus: "PAID",
        customerName: data.customerName,
        customerEmail: data.customerEmail.toLowerCase().trim(),
        customerPhone: data.customerPhone,
        address: data.address,
        city: data.city,
        district: data.district,
        postalCode: data.postalCode || "",
        notes: data.notes,
        paymentMethod: data.paymentMethod,
        subtotal: data.subtotal,
        shippingCost: data.shippingCost,
        discount: data.discount,
        total: data.total,
        iyzipayToken: payment.paymentId,
        couponCode: data.couponCode,
        items: {
          create: data.items.map((item) => ({
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

    if (data.couponCode) {
      await prisma.coupon
        .update({
          where: { code: data.couponCode.toUpperCase() },
          data: { usedCount: { increment: 1 } },
        })
        .catch(console.error);
    }

    sendOrderConfirmationEmail({
      to: data.customerEmail,
      customerName: data.customerName,
      orderNumber,
      total: data.total,
      items: data.items,
    }).catch(console.error);

    return NextResponse.json(
      {
        success: true,
        orderNumber: order.orderNumber,
        orderId: order.id,
      },
      { status: 201 }
    );
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
