import { CheckCircle2, Leaf, Clock, Award, MapPin, Heart } from "lucide-react";

const reasons = [
  {
    icon: Leaf,
    title: "%100 Doğal Ürünler",
    desc: "Hiçbir ürünümüzde yapay katkı maddesi, renklendirici veya koruyucu kullanmıyoruz.",
    color: "text-forest-600",
    bg: "bg-forest-50",
    border: "border-forest-200",
  },
  {
    icon: MapPin,
    title: "Yerli Üreticilerden",
    desc: "Çorum, Malatya, Gaziantep gibi bölgelerdeki güvenilir üreticilerle doğrudan çalışıyoruz.",
    color: "text-brand-600",
    bg: "bg-brand-50",
    border: "border-brand-200",
  },
  {
    icon: Clock,
    title: "Taze Ürün Garantisi",
    desc: "Her sipariş için taze kavrum garantisi veriyoruz. Eski stok asla göndermiyoruz.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    icon: Award,
    title: "30 Yıllık Tecrübe",
    desc: "1995'ten bu yana aynı tutku ve özenle hizmet veriyoruz. Güvenilir marka.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  {
    icon: Heart,
    title: "Müşteri Memnuniyeti",
    desc: "30.000'den fazla mutlu müşterimiz bizi 4.9/5 yıldız ile değerlendiriyor.",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  {
    icon: CheckCircle2,
    title: "Kalite Kontrol",
    desc: "Her parti ürün, sevkiyat öncesinde titizlikle kontrol ediliyor.",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
];

export default function WhyUs() {
  return (
    <section className="bg-white py-10 sm:py-20">
      <div className="container-main">
        <div className="mb-7 text-center sm:mb-14">
          <h2 className="section-title">Neden LAZOĞLU KURUYEMİŞ?</h2>
          <p className="section-subtitle mx-auto">
            30 yıllık tecrübe ve binlerce mutlu müşterinin güveni
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <div
                key={reason.title}
                className={`rounded-xl border p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-warm sm:rounded-2xl sm:p-6 sm:text-left ${reason.border} ${reason.bg}`}
              >
                <div
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm sm:mx-0"
                >
                  <Icon size={22} className={reason.color} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">
                  {reason.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {reason.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
