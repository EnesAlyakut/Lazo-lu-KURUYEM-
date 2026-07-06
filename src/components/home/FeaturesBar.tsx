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
    <section className="py-10 bg-white border-b border-gray-100">
      <div className="container-main">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-default"
              >
                <div
                  className={`w-10 h-10 ${feature.bg} ${feature.color} rounded-xl flex items-center justify-center`}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {feature.title}
                  </p>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
