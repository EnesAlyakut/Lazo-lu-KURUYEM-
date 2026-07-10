import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Leaf, ShieldCheck, Heart, Award, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "LAZOĞLU KURUYEMİŞ olarak doğanın en taze ve en doğal lezzetlerini en saf haliyle sofranıza ulaştırıyoruz.",
};

export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-brand-500 selection:text-white pb-20">
      
      {/* Clean & Breathtaking Hero */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0">
          <Image 
            src="/images/hero-bg.jpg" 
            alt="Lazoğlu Kuruyemiş Tarladan Sofraya" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <p className="text-amber-300 font-semibold tracking-[0.2em] uppercase text-sm mb-6 animate-fade-in">
            1995'ten Bugüne
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white font-display leading-[1.1] drop-shadow-lg">
            Doğanın Bize Sunduğu <br />
            <span className="text-amber-100 italic font-serif">En Saf Lezzet</span>
          </h1>
        </div>
      </section>

      {/* Elegant Stats */}
      <section className="container-main -mt-16 relative z-20">
        <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-8 sm:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100/80">
            {[
              { num: "30+", label: "Yıllık Deneyim" },
              { num: "50B", label: "Mutlu Müşteri" },
              { num: "%100", label: "Doğal Ürün" },
              { num: "81", label: "İle Teslimat" },
            ].map((stat, i) => (
              <div key={i} className="text-center px-2">
                <p className="text-3xl sm:text-4xl font-bold text-gray-900 font-display mb-1">{stat.num}</p>
                <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Story - Magazine Style Minimalist */}
      <section className="py-24 sm:py-32">
        <div className="container-main max-w-5xl">
          <div className="flex flex-col md:flex-row gap-12 md:gap-24">
            
            <div className="md:w-1/3">
              <div className="sticky top-32">
                <div className="w-12 h-1 bg-brand-500 mb-6" />
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-display mb-4">
                  Hikayemiz
                </h2>
                <p className="text-gray-500 leading-relaxed">
                  Çorum'un bereketli topraklarında başlayan, tutkuyla kavrulan bir yolculuk.
                </p>
              </div>
            </div>

            <div className="md:w-2/3 prose prose-lg prose-stone max-w-none">
              <p className="text-xl sm:text-2xl text-gray-800 font-medium leading-relaxed mb-10">
                LAZOĞLU Kuruyemiş olarak yolculuğumuza, doğanın bize sunduğu en taze ve en doğal lezzetleri en saf haliyle sofralarınıza ulaştırma hayaliyle başladık.
              </p>
              
              <div className="space-y-8 text-gray-600 leading-loose">
                <p>
                  Kuruyemişin sadece bir atıştırmalık değil, aynı zamanda bir kültür, bir sohbet eşlikçisi ve bir sağlık kaynağı olduğuna inanıyoruz. Yılların verdiği tecrübe ve kuruyemişin merkezi Çorum'un bereketli topraklarından aldığımız güçle, her bir nohudu özenle seçiyor, her bir çekirdeği tam kıvamında kavuruyoruz.
                </p>
                <p>
                  Bizim için <strong>'tazelik'</strong> sadece bir kelime değil, markamızın en temel sözüdür. Ürünlerimizi hazırlarken geleneksel yöntemleri modern hijyen standartlarıyla birleştiriyor, doğallıktan asla ödün vermiyoruz.
                </p>
                <div className="bg-brand-50/50 p-8 rounded-2xl border border-brand-100 my-10">
                  <p className="text-brand-900 font-medium italic text-lg m-0">
                    "Ailemize yedirmeyeceğimiz hiçbir ürünü sizin sofranıza göndermiyoruz. En taze leblebiden, en çıtır fındığa kadar sağlığı kapınıza getiriyoruz."
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Clean Photo Break */}
      <section className="container-main max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative h-[400px] rounded-[2rem] overflow-hidden group">
            <Image src="/images/hakkimizda-bg.png" alt="Üretim" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
          </div>
          <div className="relative h-[400px] rounded-[2rem] overflow-hidden group">
            <Image src="/images/kuru-kayisi.jpg" alt="Ürünler" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
          </div>
        </div>
      </section>

      {/* Minimalist Values */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="container-main max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 font-display">Neden Biz?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {[
              { icon: Leaf, title: "Doğallıktan Ödün Vermeyiz", desc: "Hiçbir ürünümüzde yapay renklendirici, koruyucu veya kimyasal katkı maddesi bulunmaz. Doğanın verdiğini aynı saflıkta sunarız." },
              { icon: ShieldCheck, title: "Tazelik Garantisi", desc: "Aylarca rafta bekleyen ürünleri değil, siparişinize özel hazırlanan ve paketlenen en taze kuruyemişleri yersiniz." },
              { icon: Heart, title: "Tutkuyla Hazırlarız", desc: "30 yılı aşkın süredir aynı heyecanla, her bir siparişi kendi ailemize hazırlıyormuş gibi özenle paketleriz." },
              { icon: Award, title: "Birinci Sınıf Kalite", desc: "Hasat zamanı en iyi tarlaları seçer, eleklerden sadece birinci sınıf, en iri ve en kaliteli mahsulleri geçiririz." },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Minimalist CTA */}
      <section className="container-main max-w-4xl pb-12">
        <div className="bg-stone-900 rounded-[3rem] p-12 sm:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/20 blur-[80px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-600/20 blur-[80px] rounded-full" />
          
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-display mb-6">
              Bu Lezzeti Denemeye Hazır Mısınız?
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              Hemen şimdi taptaze siparişinizi verin, Çorum'un en özel kuruyemişleri kapınıza gelsin.
            </p>
            <Link
              href="/urunler"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-stone-900 font-bold rounded-full hover:scale-105 transition-transform duration-300 shadow-xl"
            >
              Mağazaya Git <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
