import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface OrderEmailData {
  to: string;
  customerName: string;
  orderNumber: string;
  total: number;
  items: Array<{
    productName: string;
    variant?: string;
    quantity: number;
    price: number;
    total: number;
  }>;
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const { to, customerName, orderNumber, total, items } = data;

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #f0e6d3;">${item.productName}${item.variant ? ` (${item.variant})` : ""}</td>
        <td style="padding: 10px; border-bottom: 1px solid #f0e6d3; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #f0e6d3; text-align: right;">${item.total.toFixed(2)} ₺</td>
      </tr>
    `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html lang="tr">
    <head><meta charset="UTF-8"></head>
    <body style="font-family: 'Inter', Arial, sans-serif; background: #fdf8ed; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #3d1708, #bc6513); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">FK KURUYEMİŞ</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0;">Siparişiniz Alındı!</p>
        </div>
        
        <!-- Body -->
        <div style="padding: 30px;">
          <p style="color: #333; font-size: 16px;">Merhaba <strong>${customerName}</strong>,</p>
          <p style="color: #666;">Siparişiniz başarıyla alındı. Sipariş numaranız: <strong style="color: #d4841a;">${orderNumber}</strong></p>
          
          <!-- Order Items -->
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #fdf8ed;">
                <th style="padding: 10px; text-align: left; color: #333;">Ürün</th>
                <th style="padding: 10px; text-align: center; color: #333;">Adet</th>
                <th style="padding: 10px; text-align: right; color: #333;">Tutar</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 15px 10px; font-weight: bold; font-size: 16px;">Toplam</td>
                <td style="padding: 15px 10px; font-weight: bold; font-size: 18px; text-align: right; color: #d4841a;">${total.toFixed(2)} ₺</td>
              </tr>
            </tfoot>
          </table>
          
          <div style="background: #fdf8ed; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0; color: #666; font-size: 14px;">Siparişiniz 1-3 iş günü içinde kargoya verilecektir.</p>
            <p style="margin: 8px 0 0; color: #666; font-size: 14px;">Sorularınız için: +90 555 123 45 67</p>
          </div>
          
          <p style="color: #999; font-size: 13px; text-align: center; margin-top: 30px;">
            FK KURUYEMİŞ | Çorum, Türkiye<br>
            <a href="mailto:info@fkkuruyemis.com" style="color: #d4841a;">info@fkkuruyemis.com</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "FK KURUYEMİŞ <noreply@fkkuruyemis.com>",
      to,
      subject: `Siparişiniz Alındı - #${orderNumber} | FK KURUYEMİŞ`,
      html,
    });
  } catch (error) {
    console.error("Email send error:", error);
  }
}
