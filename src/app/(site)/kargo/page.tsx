import InfoPage from "@/components/ui/InfoPage";

export const metadata = { title: "Kargo Bilgisi" };

export default function KargoPage() {
  return (
    <InfoPage
      title="Kargo ve Teslimat"
      intro="Kargo bedeli, ürünlerin toplam ağırlığına göre ödeme ekranında otomatik hesaplanır."
      sections={[
        { title: "Hazırlık", content: "Ödemesi doğrulanan siparişler özenle paketlenerek taşıyıcıya teslim edilir." },
        { title: "Teslimat adresi", content: "Gecikme yaşanmaması için ad, telefon, il, ilçe ve açık adres bilgilerinizi eksiksiz girin." },
        { title: "Hasar kontrolü", content: "Teslim sırasında pakette belirgin hasar varsa taşıyıcı görevlisiyle tutanak tutturun ve sipariş numaranızla bize ulaşın." },
      ]}
    />
  );
}
