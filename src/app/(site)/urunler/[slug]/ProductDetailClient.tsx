"use client";

import { useState } from "react";
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
  const { addItem } = useCartStore();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [reviewForm, setReviewForm] = useState({
    authorName: "",
    email: "",
    rating: 5,
    comment: "",
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  const price = selectedVariant?.price || product.discountPrice || product.basePrice;
  const hasDiscount = !!product.discountPrice && !selectedVariant;
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
        toast.success("Yorumunuz incelemeye alÄ±ndÄ±, teÅŸekkÃ¼r ederiz!");
        setReviewForm({ authorName: "", email: "", rating: 5, comment: "" });
      } else {
        toast.error("Bir hata oluÅŸtu, lÃ¼tfen tekrar deneyin.");
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
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-brand-600">Ana Sayfa</Link>
            <ChevronRight size={14} />
            <Link href="/urunler" className="hover:text-brand-600">ÃœrÃ¼nler</Link>
            <ChevronRight size={14} />
            <Link
              href={`/urunler?kategori=${product.category.slug}`}
              className="hover:text-brand-600"
            >
              {product.category.name}
            </Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-main py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-product mb-4">
              <Image
                src={product.images[activeImage] || "/images/leblebi-urun.png"}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {product.isNatural && (
                <div className="absolute top-4 left-4">
                  <span className="badge-natural">
                    <Leaf size={12} />
                    %100 DoÄŸal
                  </span>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      i === activeImage
                        ? "border-brand-500 shadow-warm"
                        : "border-gray-200 hover:border-brand-300"
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
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
              <button className="btn-icon" aria-label="PaylaÅŸ">
                <Share2 size={16} />
              </button>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4 font-display">
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
                  {avgRating.toFixed(1)} ({product.reviews.length} deÄŸerlendirme)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-end gap-3 mb-6">
              <span className="text-4xl font-bold text-brand-600">
                {price.toFixed(2)} ₺
              </span>
              {hasDiscount && (
                <span className="text-xl text-gray-400 line-through mb-1">
                  {product.basePrice.toFixed(2)} ₺
                </span>
              )}
            </div>

            {/* Variant Selection */}
            {product.variants.length > 0 && (
              <div className="mb-6">
                <p className="font-semibold text-gray-700 mb-3">
                  SeÃ§enek SeÃ§in:
                  <span className="text-brand-600 ml-2">{selectedVariant?.weight}</span>
                </p>
                <div className="flex gap-3 flex-wrap">
                  {product.variants.map((v: any) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-xl border-2 font-semibold text-sm transition-all ${
                        selectedVariant?.id === v.id
                          ? "border-brand-500 bg-brand-50 text-brand-700"
                          : "border-gray-200 text-gray-700 hover:border-brand-300"
                      } ${v.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={v.stock === 0}
                    >
                      {v.weight}
                      <span className="ml-2 text-brand-600">{v.price.toFixed(2)} ₺</span>
                      {v.stock === 0 && (
                        <span className="ml-1 text-red-400 text-xs">(TÃ¼kendi)</span>
                      )}
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
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 btn-primary text-base py-4 rounded-2xl"
              >
                <ShoppingCart size={20} />
                Sepete Ekle
              </button>
              <button className="btn-icon w-14 h-14 rounded-2xl" aria-label="Favorilere ekle">
                <Heart size={20} />
              </button>
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-brand-50 rounded-2xl border border-brand-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck size={16} className="text-brand-500" />
                <span>AÄŸÄ±rlÄ±ÄŸa gÃ¶re uygun kargo</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield size={16} className="text-brand-500" />
                <span>GÃ¼venli Ã¶deme</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} className="text-brand-500" />
                <span>1-3 iÅŸ gÃ¼nÃ¼ teslimat</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield size={16} className="text-brand-500" />
                <span>{product.isNatural ? "%100 doÄŸal Ã¼rÃ¼n" : "Premium ambalaj"}</span>
              </div>
            </div>

            {/* Product Info */}
            <div className="mt-6 space-y-3">
              {product.origin && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={14} className="text-brand-500" />
                  <span>
                    <strong>MenÅŸei:</strong> {product.origin}
                  </span>
                </div>
              )}
              {product.production && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Factory size={14} className="text-brand-500" />
                  <span>
                    <strong>Ãœretim:</strong> {product.production}
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

        {/* Description & Reviews Tabs */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 font-display">
            ÃœrÃ¼n AÃ§Ä±klamasÄ±
          </h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>

        {/* Reviews */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 font-display">
            DeÄŸerlendirmeler ({product.reviews.length})
          </h2>

          {product.reviews.length > 0 ? (
            <div className="space-y-4 mb-8">
              {product.reviews.map((review: any) => (
                <div
                  key={review.id}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-2">
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
              HenÃ¼z deÄŸerlendirme yapÄ±lmamÄ±ÅŸ. Ä°lk deÄŸerlendirmeyi siz yapÄ±n!
            </p>
          )}

          {/* Review Form */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-bold text-gray-900 mb-4">DeÄŸerlendirme Yaz</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">AdÄ±nÄ±z *</label>
                  <input
                    type="text"
                    required
                    value={reviewForm.authorName}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, authorName: e.target.value })
                    }
                    className="input-field"
                    placeholder="AdÄ±nÄ±zÄ± girin"
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
                  placeholder="ÃœrÃ¼n hakkÄ±ndaki dÃ¼ÅŸÃ¼ncelerinizi paylaÅŸÄ±n..."
                />
              </div>
              <button
                type="submit"
                disabled={submittingReview}
                className="btn-primary"
              >
                {submittingReview ? "GÃ¶nderiliyor..." : "DeÄŸerlendirme GÃ¶nder"}
              </button>
            </form>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">
              Benzer ÃœrÃ¼nler
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

