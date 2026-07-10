import { Truck, Shield, RefreshCw, Clock, Leaf, Award } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Ekonomik Kargo",
    desc: "Ağırlığa göre",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Shield,
    title: "Güvenli Ödeme",
    desc: "256-bit SSL",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: Leaf,
    title: "%100 Doğal",
    desc: "Katkısız ürün",
    color: "text-forest-600",
    bg: "bg-forest-50",
  },
  {
    icon: RefreshCw,
    title: "Kolay İade",
    desc: "14 gün iade",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Clock,
    title: "Hızlı Teslimat",
    desc: "1-3 iş günü",
    color: "text-brand-600",
    bg: "bg-brand-50",
  },
  {
    icon: Award,
    title: "Kalite Garantisi",
    desc: "Taze ürün",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

export default function FeaturesBar() {
  return (
    <section className="border-b border-gray-100 bg-white py-6 sm:py-10">
      <div className="container-main">
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="flex min-h-[118px] flex-col items-center justify-center gap-2 rounded-xl bg-gray-50/70 p-3 text-center transition-colors hover:bg-gray-50 sm:min-h-0 sm:rounded-2xl sm:p-4"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${feature.bg} ${feature.color}`}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold leading-snug text-gray-900 sm:text-sm">
                    {feature.title}
                  </p>
                  <p className="text-[11px] text-gray-500 sm:text-xs">{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
