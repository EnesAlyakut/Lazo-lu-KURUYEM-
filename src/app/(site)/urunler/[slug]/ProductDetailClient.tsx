"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Star,
  Leaf,
  MapPin,
  Factory,
  Clock,
  ChevronRight,
  Plus,
  Minus,
  Share2,
  Heart,
  Truck,
  Shield,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { ProductCard } from "@/components/ui/ProductCard";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/dateFormat";

export default function ProductDetailClient({
  product,
  related,
}: {
  product: any;
  related: any[];
}) {
  const addItem = useCartStore((state) => state.addItem);
  const isGiftBox = product.category?.slug === "hediyelik-kutu";
  const hasVariants = !isGiftBox && product.variants && product.variants.length > 0;

  const [selectedVariant, setSelectedVariant] = useState(
    hasVariants ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [reviewForm, setReviewForm] = useState({
    authorName: "",
    email: "",
    rating: 5,
    comment: "",
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!product.images || product.images.length <= 1) return;
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % product.images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [product.images]);

  const price = selectedVariant?.price
    ? selectedVariant.price
    : product.discountPrice || product.basePrice;

  const hasDiscount = !!product.discountPrice && !selectedVariant?.price;

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((s: number, r: any) => s + r.rating, 0) /
        product.reviews.length
      : 0;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      image: product.images[0],
      variantId: selectedVariant?.id,
      variant: selectedVariant?.weight,
      price,
      quantity,
    });
    toast.success(`${product.name} sepete eklendi!`);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/urunler/${product.id}/yorum`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewForm),
      });
      if (res.ok) {
        toast.success("Yorumunuz incelemeye alındı, teşekkür ederiz!");
        setReviewForm({ authorName: "", email: "", rating: 5, comment: "" });
      } else {
        toast.error("Bir hata oluştu, lütfen tekrar deneyin.");
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-main py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500 overflow-x-auto scrollbar-hide whitespace-nowrap pb-1">
            <Link href="/" className="hover:text-brand-600 shrink-0">Ana Sayfa</Link>
            <ChevronRight size={14} className="shrink-0" />
            <Link href="/urunler" className="hover:text-brand-600 shrink-0">Ürünler</Link>
            <ChevronRight size={14} className="shrink-0" />
            <Link
              href={`/urunler?kategori=${product.category.slug}`}
              className="hover:text-brand-600 shrink-0"
            >
              {product.category.name}
            </Link>
            <ChevronRight size={14} className="shrink-0" />
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-main py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-10 sm:mb-16">
          {/* Images */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-product mb-4">
              <Image
                src={product.images[activeImage] || "/images/leblebi-urun.png"}
                alt={product.name}
                fill
                unoptimized={(product.images[activeImage] || "").startsWith("/uploads/")}
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {product.isNatural && (
                <div className="absolute top-4 left-4">
                  <span className="badge-natural">
                    <Leaf size={12} />
                    %100 Doğal
                  </span>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {product.images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      i === activeImage
                        ? "border-brand-500 shadow-warm"
                        : "border-gray-200 hover:border-brand-300"
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill unoptimized={img.startsWith("/uploads/")} className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <Link
                href={`/urunler?kategori=${product.category.slug}`}
                className="text-sm text-brand-600 font-medium hover:underline"
              >
                {product.category.name}
              </Link>
              <button className="btn-icon" aria-label="Paylaş">
                <Share2 size={16} />
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 font-display">
              {product.name}
            </h1>

            {/* Rating */}
            {avgRating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.round(avgRating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-200 fill-gray-200"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {avgRating.toFixed(1)} ({product.reviews.length} değerlendirme)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-end gap-3 mb-6 flex-wrap">
              <span className="text-3xl sm:text-4xl font-bold text-brand-600">
                {price.toFixed(2)} ₺
              </span>
              {hasDiscount && (
                <span className="text-xl text-gray-400 line-through mb-1">
                  {product.basePrice.toFixed(2)} ₺
                </span>
              )}
              {selectedVariant && (
                <span className="text-sm text-gray-500 mb-1">
                  ({selectedVariant.weight})
                </span>
              )}
            </div>

            {/* Gramaj Seçimi - Variantlar varsa göster */}
            {hasVariants && (
              <div className="mb-6">
                <p className="font-semibold text-gray-700 mb-3">Gramaj Seçin:</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant: any) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                        selectedVariant?.id === variant.id
                          ? "border-brand-500 bg-brand-50 text-brand-700"
                          : "border-gray-200 text-gray-600 hover:border-brand-300 hover:bg-gray-50"
                      }`}
                    >
                      <span className="block">{variant.weight}</span>
                      <span className="block text-xs font-bold text-brand-600">
                        {variant.price.toFixed(2)} ₺
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <p className="font-semibold text-gray-700">Adet:</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="qty-btn"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-bold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="qty-btn"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 btn-primary text-base py-4 rounded-2xl"
              >
                <ShoppingCart size={20} />
                Sepete Ekle
              </button>
              <button className="btn-icon w-full sm:w-14 h-12 sm:h-14 rounded-2xl" aria-label="Favorilere ekle">
                <Heart size={20} />
              </button>
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-brand-50 rounded-2xl border border-brand-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck size={16} className="text-brand-500" />
                <span>Ağırlığa göre uygun kargo</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield size={16} className="text-brand-500" />
                <span>Güvenli ödeme</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} className="text-brand-500" />
                <span>1-3 iş günü teslimat</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield size={16} className="text-brand-500" />
                <span>{product.isNatural ? "%100 doğal ürün" : "Premium ambalaj"}</span>
              </div>
            </div>

            {/* Product Info */}
            <div className="mt-6 space-y-3">
              {product.origin && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={14} className="text-brand-500" />
                  <span>
                    <strong>Menşei:</strong> {product.origin}
                  </span>
                </div>
              )}
              {product.production && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Factory size={14} className="text-brand-500" />
                  <span>
                    <strong>Üretim:</strong> {product.production}
                  </span>
                </div>
              )}
              {product.freshness && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={14} className="text-brand-500" />
                  <span>
                    <strong>Tazelik:</strong> {product.freshness}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="card p-4 sm:p-6 mb-8">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Ürün Açıklaması
          </h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>

        {/* Reviews */}
        <div className="card p-4 sm:p-6 mb-8">
          <h2 className="mb-6 text-xl font-bold text-gray-900">
            Değerlendirmeler ({product.reviews.length})
          </h2>

          {product.reviews.length > 0 ? (
            <div className="space-y-4 mb-8">
              {product.reviews.map((review: any) => (
                <div
                  key={review.id}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                >
                  <div className="flex items-start sm:items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-sm">
                        {review.authorName[0].toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-900">
                        {review.authorName}
                      </span>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < review.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-200 fill-gray-200"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 mb-8 italic">
              Henüz değerlendirme yapılmamış. İlk değerlendirmeyi siz yapın!
            </p>
          )}

          {/* Review Form */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="mb-4 font-bold text-gray-900">Değerlendirme Yaz</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Adınız *</label>
                  <input
                    type="text"
                    required
                    value={reviewForm.authorName}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, authorName: e.target.value })
                    }
                    className="input-field"
                    placeholder="Adınızı girin"
                  />
                </div>
                <div>
                  <label className="input-label">E-posta</label>
                  <input
                    type="email"
                    value={reviewForm.email}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, email: e.target.value })
                    }
                    className="input-field"
                    placeholder="E-posta adresiniz"
                  />
                </div>
              </div>
              <div>
                <label className="input-label">Puan *</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: s })}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={28}
                        className={
                          s <= reviewForm.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-200 fill-gray-200"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="input-label">Yorumunuz *</label>
                <textarea
                  required
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, comment: e.target.value })
                  }
                  className="input-field h-28 resize-none"
                  placeholder="Ürün hakkındaki düşüncelerinizi paylaşın..."
                />
              </div>
              <button
                type="submit"
                disabled={submittingReview}
                className="btn-primary"
              >
                {submittingReview ? "Gönderiliyor..." : "Değerlendirme Gönder"}
              </button>
            </form>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Benzer Ürünler
            </h2>
            <div className="product-grid">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
