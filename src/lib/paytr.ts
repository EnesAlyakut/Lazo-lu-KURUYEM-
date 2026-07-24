import crypto from "crypto";

export interface PayTrPaymentInput {
  orderNumber: string;
  email: string;
  total: number; // in TL (e.g. 150.50)
  items: Array<{ name: string; price: number; quantity: number }>;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  ip: string;
}

export async function getPaytrToken(input: PayTrPaymentInput) {
  const merchant_id = process.env.PAYTR_MERCHANT_ID;
  const merchant_key = process.env.PAYTR_MERCHANT_KEY;
  const merchant_salt = process.env.PAYTR_MERCHANT_SALT;

  if (!merchant_id || !merchant_key || !merchant_salt) {
    throw new Error("PayTR API bilgileri .env dosyasında bulunamadı.");
  }

  // Multiply total by 100 to get Kurus, ensure integer
  const payment_amount = Math.round(input.total * 100).toString();

  // Format basket: [ ["Item Name", "Price", Quantity] ]
  const user_basket = Buffer.from(
    JSON.stringify(
      input.items.map((item) => [
        item.name.slice(0, 100),
        item.price.toFixed(2),
        item.quantity,
      ])
    ),
    "utf8"
  ).toString("base64");

  const no_installment = "0";
  const max_installment = "0";
  const currency = "TL";
  const test_mode = process.env.PAYTR_TEST_MODE === "1" ? "1" : "0";

  const hash_str = merchant_id + input.ip + input.orderNumber + input.email + payment_amount + user_basket + no_installment + max_installment + currency + test_mode;

  const paytr_token = crypto
    .createHmac("sha256", merchant_key)
    .update(hash_str + merchant_salt)
    .digest("base64");

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  if (process.env.NODE_ENV === "production" && !siteUrl.startsWith("https://")) {
    throw new Error("NEXT_PUBLIC_SITE_URL production ortamında HTTPS adresi olmalıdır.");
  }

  const formData = new URLSearchParams({
    merchant_id,
    user_ip: input.ip,
    merchant_oid: input.orderNumber,
    email: input.email,
    payment_amount,
    paytr_token,
    user_basket,
    debug_on: process.env.PAYTR_DEBUG_ON === "0" ? "0" : "1",
    no_installment,
    max_installment,
    user_name: input.customerName.slice(0, 60),
    user_address: input.customerAddress.slice(0, 400),
    user_phone: input.customerPhone,
    merchant_ok_url: `${siteUrl}/siparis-basarili?order=${input.orderNumber}`,
    merchant_fail_url: `${siteUrl}/odeme?error=paytr_failed`,
    timeout_limit: "30",
    currency,
    test_mode
  });

  try {
    const response = await fetch("https://www.paytr.com/odeme/api/get-token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
      signal: AbortSignal.timeout(20_000),
    });

    if (!response.ok) {
      throw new Error(`PayTR API HTTP ${response.status}`);
    }

    const data = await response.json();
    return data; // Expected: { status: "success", token: "..." } or { status: "failed", reason: "..." }
  } catch (err) {
    console.error("PayTR Token Hatası:", err);
    return { status: "failed", reason: "Sunucu bağlantı hatası." };
  }
}

export function validatePaytrWebhook(body: any): boolean {
  const merchant_key = process.env.PAYTR_MERCHANT_KEY;
  const merchant_salt = process.env.PAYTR_MERCHANT_SALT;

  if (!merchant_key || !merchant_salt) return false;

  // Webhook provides: merchant_oid, status, total_amount, hash
  const hash_str = body.merchant_oid + merchant_salt + body.status + body.total_amount;
  const hash = crypto.createHmac("sha256", merchant_key).update(hash_str).digest();
  const receivedHash = Buffer.from(String(body.hash || ""), "base64");

  return (
    receivedHash.length === hash.length &&
    crypto.timingSafeEqual(receivedHash, hash)
  );
}
