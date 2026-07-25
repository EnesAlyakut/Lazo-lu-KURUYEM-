import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendReplyEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { messageId, replyText } = await req.json();

    if (!messageId || !replyText) {
      return NextResponse.json({ message: "Geçersiz veri." }, { status: 400 });
    }

    const message = await prisma.contactMessage.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return NextResponse.json({ message: "Mesaj bulunamadı." }, { status: 404 });
    }

    const sent = await sendReplyEmail({
      to: message.email,
      name: message.name,
      originalMessage: message.message,
      replyMessage: replyText,
    });

    if (!sent) {
      return NextResponse.json({ message: "E-posta gönderilemedi. Sunucu ayarlarınızı kontrol edin." }, { status: 500 });
    }

    if (!message.isRead) {
      await prisma.contactMessage.update({
        where: { id: messageId },
        data: { isRead: true },
      });
    }

    return NextResponse.json({ success: true, message: "Yanıt başarıyla gönderildi." });
  } catch (error) {
    console.error("Reply error:", error);
    return NextResponse.json({ message: "Bir hata oluştu." }, { status: 500 });
  }
}
