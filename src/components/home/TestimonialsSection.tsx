import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Ayşe Kaya",
    city: "ıstanbul",
    rating: 5,
    text: "Sarı leblebi tam da aradığım gibiydi! Çorum'dan sanki yeni gelmiş gibi taze. Artık düzenli sipariş veriyorum. Kargo da çok hızlı geldi.",
    product: "Sarı Leblebi",
  },
  {
    id: 2,
    name: "Mehmet Yılmaz",
    city: "Ankara",
    rating: 5,
    text: "Antep fıstığı inanılmaz kaliteli! Büyük taneli ve dolgun. Fiyat da piyasaya göre çok makul. Kesinlikle tavsiye ederim.",
    product: "Antep Fıstığı",
  },
  {
    id: 3,
    name: "Fatma Öztürk",
    city: "ızmir",
    rating: 5,
    text: "Hediyelik kutu anneme bayram hediyesi olarak gönderdim. Çok beğendi, paketi de çok şık. Müşteri hizmetleri de çok ilgili.",
    product: "Hediyelik Kutu",
  },
  {
    id: 4,
    name: "Ali Demir",
    city: "Bursa",
    rating: 4,
    text: "Çifte kavrulmuş leblebi gerçekten farklı bir lezzet. Ekstra çıtır ve aromatik. Çayın yanında mükemmel. Tavsiyem: büyük boy alın!",
    product: "Çifte Kavrulmuş",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-main">
        <div className="text-center mb-14">
          <h2 className="section-title">Müşteri Yorumları</h2>
          <p className="section-subtitle mx-auto">
            30.000+ mutlu müşterimizin deneyimleri
          </p>
          <div className="flex items-center justify-center gap-1 mt-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={20} className="text-amber-400 fill-amber-400" />
            ))}
            <span className="ml-2 text-gray-600 font-semibold">
              4.9/5 (2.400+ değerlendirme)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="card p-6 relative">
              <Quote
                size={32}
                className="text-brand-200 absolute top-4 right-4"
              />
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < t.rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-200 fill-gray-200"
                    }
                  />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">
                "{t.text}"
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.city}</p>
                </div>
                <span className="text-xs bg-brand-50 text-brand-600 px-2 py-1 rounded-lg font-medium">
                  {t.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
