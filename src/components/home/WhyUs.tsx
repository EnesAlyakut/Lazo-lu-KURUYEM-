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
    <section className="py-20 bg-white">
      <div className="container-main">
        <div className="text-center mb-14">
          <h2 className="section-title">Neden FK KURUYEMİŞ?</h2>
          <p className="section-subtitle mx-auto">
            30 yıllık tecrübe ve binlerce mutlu müşterinin güveni
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <div
                key={reason.title}
                className={`p-6 rounded-2xl border ${reason.border} ${reason.bg} hover:shadow-warm transition-all duration-300 hover:-translate-y-1`}
              >
                <div
                  className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm`}
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
