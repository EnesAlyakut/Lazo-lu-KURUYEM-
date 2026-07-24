import InfoPage from "@/components/ui/InfoPage";

export const metadata = { title: "Sık Sorulan Sorular" };

export default function SssPage() {
  return (
    <InfoPage
      title="Sık Sorulan Sorular"
      intro="Sipariş, ödeme ve teslimatla ilgili en sık sorulan soruları burada yanıtladık."
      sections={[
        { title: "Ödeme güvenli mi?", content: "Evet. Kart bilgileriniz sitemizde tutulmaz; ödeme PayTR güvenli ödeme ekranında ve 3D Secure desteğiyle gerçekleştirilir." },
        { title: "Siparişim ne zaman hazırlanır?", content: "Ödemesi onaylanan siparişler stok ve çalışma saatlerine göre en kısa sürede hazırlanır. Kargoya verildiğinde sipariş durumu güncellenir." },
        { title: "Hasarlı ürün gelirse ne yapmalıyım?", content: "Paketi ve ürünü gösteren fotoğraflarla birlikte sipariş numaranızı iletişim sayfasından iletin. Talebiniz incelenerek size dönüş yapılır." },
      ]}
    />
  );
}
