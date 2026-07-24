import InfoPage from "@/components/ui/InfoPage";

export const metadata = { title: "Mesafeli Satış Sözleşmesi" };

export default function MesafeliSatisSozlesmesiPage() {
  return (
    <InfoPage
      title="Mesafeli Satış Sözleşmesi"
      intro="Bu metin, internet sitesi üzerinden verilen siparişlerin temel satış ve teslimat koşullarını açıklar."
      sections={[
        {
          title: "Satıcı ve ürün bilgileri",
          content:
            "Satıcı: LAZOĞLU KURUYEMİŞ\nAdres: Ulukavak Mahallesi, Selçuk Caddesi No:18/B, Çorum\nÜrünün temel nitelikleri, satış fiyatı, indirim, kargo ve toplam bedel ödeme ekranında sipariş onayından önce gösterilir.",
        },
        {
          title: "Ödeme ve teslimat",
          content:
            "Ödeme PayTR üzerinden kredi kartıyla alınır. Sipariş, ödeme bildirimi doğrulandıktan sonra onaylanır. Teslimat, siparişte belirtilen adrese anlaşmalı taşıyıcı aracılığıyla yapılır.",
        },
        {
          title: "Cayma ve uyuşmazlık",
          content:
            "Cayma hakkı ve istisnaları İade Politikası sayfasında açıklanır. Tüketici, yürürlükteki mevzuat kapsamında Tüketici Hakem Heyeti veya Tüketici Mahkemesine başvurma hakkına sahiptir.",
        },
      ]}
    />
  );
}
