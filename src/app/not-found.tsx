import Link from "next/link";
import { Home, SearchX, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <SearchX size={40} />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 font-display mb-3">
          404
        </h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Sayfa Bulunamadı
        </h2>
        <p className="text-gray-500 mb-8">
          Aradığınız sayfa taşınmış veya silinmiş olabilir. Endişelenmeyin, sizi
          doğru yere yönlendiririz!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-secondary gap-2">
            <Home size={16} />
            Ana Sayfa
          </Link>
          <Link href="/urunler" className="btn-primary gap-2">
            <ShoppingBag size={16} />
            Ürünlere Git
          </Link>
        </div>
      </div>
    </div>
  );
}
