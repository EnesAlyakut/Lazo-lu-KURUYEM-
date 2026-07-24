import InfoPage from "@/components/ui/InfoPage";

export const metadata = { title: "Gizlilik Politikası" };

export default function GizlilikPolitikasiPage() {
  return (
    <InfoPage
      title="Gizlilik Politikası"
      intro="Sipariş ve iletişim süreçlerinde paylaştığınız kişisel verileri yalnızca hizmetin yürütülmesi, güvenlik ve yasal yükümlülükler için işleriz."
      sections={[
        {
          title: "İşlenen bilgiler",
          content:
            "Ad soyad, iletişim bilgileri, teslimat adresi, sipariş içeriği ve işlem kayıtları işlenebilir. Kart bilgileriniz sitemizde tutulmaz; ödeme PayTR güvenli ödeme altyapısında gerçekleştirilir.",
        },
        {
          title: "Kullanım ve paylaşım",
          content:
            "Bilgileriniz siparişin hazırlanması, ödeme doğrulaması, teslimat, müşteri desteği ve mevzuat yükümlülükleri için kullanılır. Gerekli olduğu ölçüde ödeme, kargo, e-posta ve altyapı hizmeti sağlayıcılarıyla paylaşılabilir.",
        },
        {
          title: "Saklama ve haklarınız",
          content:
            "Veriler yalnızca amaç ve yasal saklama süreleri boyunca korunur. Verilerinize ilişkin bilgi, düzeltme veya silme taleplerinizi iletişim sayfasından iletebilirsiniz.",
        },
      ]}
    />
  );
}
