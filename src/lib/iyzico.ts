import type { NormalizedCard } from "@/lib/paymentValidation";

const Iyzipay = require("iyzipay");

interface PaymentItem {
  productId: string;
  productName: string;
  variant?: string;
  price: number;
  quantity: number;
  total: number;
}

interface CreateIyzicoPaymentInput {
  conversationId: string;
  card: NormalizedCard;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  district: string;
  postalCode?: string;
  ip: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  items: PaymentItem[];
}

interface IyzicoPaymentResult {
  status?: string;
  paymentId?: string;
  conversationId?: string;
  errorMessage?: string;
  errorCode?: string;
}

export function hasRealIyzicoConfig() {
  const apiKey = process.env.IYZICO_API_KEY;
  const secretKey = process.env.IYZICO_SECRET_KEY;
  const baseUrl = process.env.IYZICO_BASE_URL || process.env.IYZIPAY_URI;

  return Boolean(
    apiKey &&
      secretKey &&
      baseUrl &&
      !apiKey.includes("sandbox-api-key") &&
      !secretKey.includes("sandbox-secret-key") &&
      !apiKey.includes("demo") &&
      !secretKey.includes("demo") &&
      !baseUrl.includes("sandbox")
  );
}

function toPrice(value: number) {
  return (Math.round(value * 100) / 100).toFixed(2);
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  const name = parts.shift() || fullName;
  const surname = parts.join(" ") || ".";
  return { name, surname };
}

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("90")) return `+${digits}`;
  if (digits.startsWith("0")) return `+9${digits}`;
  return digits ? `+90${digits}` : "+905000000000";
}

function createClient() {
  return new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY,
    secretKey: process.env.IYZICO_SECRET_KEY,
    uri: process.env.IYZICO_BASE_URL || process.env.IYZIPAY_URI,
  });
}

export async function chargeCreditCard(input: CreateIyzicoPaymentInput) {
  if (!hasRealIyzicoConfig()) {
    return {
      ok: false as const,
      message: "Canlı iyzico API bilgileri tanımlı değil. Ödeme alınmadan sipariş oluşturulamaz.",
    };
  }

  const iyzipay = createClient();
  const buyer = splitName(input.customerName);
  const address = `${input.address}, ${input.district}`;

  const basketItems = input.items.map((item) => ({
    id: item.productId,
    name: `${item.productName}${item.variant ? ` (${item.variant})` : ""}`.slice(0, 255),
    category1: "Çorum Hatırası",
    itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
    price: toPrice(item.total),
  }));

  if (input.shippingCost > 0) {
    basketItems.push({
      id: "shipping",
      name: "Kargo",
      category1: "Teslimat",
      itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
      price: toPrice(input.shippingCost),
    });
  }

  const request = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: input.conversationId,
    price: toPrice(input.total),
    paidPrice: toPrice(input.total),
    currency: Iyzipay.CURRENCY.TRY,
    installment: "1",
    basketId: input.conversationId,
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    paymentCard: {
      cardHolderName: input.card.holderName,
      cardNumber: input.card.number,
      expireMonth: input.card.expireMonth,
      expireYear: input.card.expireYear,
      cvc: input.card.cvc,
      registerCard: "0",
    },
    buyer: {
      id: input.customerEmail.toLowerCase(),
      name: buyer.name,
      surname: buyer.surname,
      gsmNumber: formatPhone(input.customerPhone),
      email: input.customerEmail.toLowerCase(),
      identityNumber: process.env.IYZICO_BUYER_IDENTITY_NUMBER || "11111111110",
      registrationAddress: address,
      ip: input.ip,
      city: input.city,
      country: "Turkey",
      zipCode: input.postalCode || "19000",
    },
    shippingAddress: {
      contactName: input.customerName,
      city: input.city,
      country: "Turkey",
      address,
      zipCode: input.postalCode || "19000",
    },
    billingAddress: {
      contactName: input.customerName,
      city: input.city,
      country: "Turkey",
      address,
      zipCode: input.postalCode || "19000",
    },
    basketItems,
  };

  return new Promise<
    | { ok: true; paymentId: string; result: IyzicoPaymentResult }
    | { ok: false; message: string; result?: IyzicoPaymentResult }
  >((resolve) => {
    iyzipay.payment.create(request, (error: Error | null, result: IyzicoPaymentResult) => {
      if (error) {
        resolve({ ok: false, message: "Ödeme sağlayıcısına ulaşılamadı." });
        return;
      }

      if (result?.status === "success" && result.paymentId) {
        resolve({ ok: true, paymentId: result.paymentId, result });
        return;
      }

      resolve({
        ok: false,
        message: result?.errorMessage || "Ödeme onaylanmadı. Kart bilgilerinizi kontrol edin.",
        result,
      });
    });
  });
}
