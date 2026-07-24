import InfoPage from "@/components/ui/InfoPage";

export const metadata = { title: "İade Politikası" };

export default function IadePolitikasiPage() {
  return (
    <InfoPage
      title="İade ve Cayma Politikası"
      intro="İade ve cayma taleplerinizi sipariş numaranızla birlikte yazılı olarak bize iletebilirsiniz."
      sections={[
        {
          title: "Cayma bildirimi",
          content:
            "Mesafeli satışlarda genel cayma süresi, ürünün tesliminden itibaren 14 gündür. Talebinizi iletişim formu veya e-posta gibi kalıcı veri saklayıcısı üzerinden iletin.",
        },
        {
          title: "Gıda ürünleri",
          content:
            "Çabuk bozulabilen, son kullanma tarihi geçebilecek veya ambalajı açıldıktan sonra sağlık ve hijyen açısından iadesi uygun olmayan ürünlerde mevzuattaki cayma hakkı istisnaları uygulanabilir. Hatalı, eksik veya hasarlı teslimatlar bu kapsamın dışındadır; bize fotoğrafla birlikte bildirin.",
        },
        {
          title: "İade süreci",
          content:
            "Talebiniz incelendikten sonra uygun iade yöntemi ve gönderim bilgileri tarafınıza yazılı olarak bildirilir. Onaylanan geri ödeme, alışverişte kullanılan ödeme aracına uygun biçimde yapılır.",
        },
      ]}
    />
  );
}
