import { NextRequest, NextResponse } from "next/server";
import { apiRateLimit } from "@/lib/rateLimit";
import { tooManyRequests } from "@/lib/apiErrors";
import { sendContactMessage } from "@/lib/email";
import { z } from "zod";

const iletisimSchema = z.object({
  name: z.string().min(2, "Ad soyad en az 2 karakter olmalıdır.").max(100),
  email: z.string().email("Geçerli bir e-posta giriniz."),
  phone: z.string().max(20).optional(),
  subject: z.string().max(100).optional(),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalıdır.").max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    const rl = apiRateLimit(ip);
    if (!rl.success) return tooManyRequests();

    const body = await req.json();
    const data = iletisimSchema.parse(body);

    const sent = await sendContactMessage(data);
    if (!sent) {
      return NextResponse.json(
        { message: "İletişim e-postası yapılandırılmamış. Lütfen telefon veya WhatsApp üzerinden ulaşın." },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Mesajınız alındı! En kısa sürede size döneceğiz.",
    });
  } catch (error: any) {
    if (error?.errors) {
      return NextResponse.json(
        { message: error.errors[0]?.message || "Geçersiz veri." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Sunucu hatası oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
