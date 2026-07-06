"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star, Leaf, TrendingUp } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

interface ProductVariant {
  id: string;
  weight: string;
  price: number;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  images: string[];
  basePrice: number;
  discountPrice?: number | null;
  isNatural: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  category: { name: string; slug: string };
  variants: ProductVariant[];
  reviews?: { rating: number }[];
}

const FALLBACK_IMAGE = "/images/leblebi-urun.png";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCartStore();

  const mainImage = product.images[0] || FALLBACK_IMAGE;
  const price = product.discountPrice || product.basePrice;
  const hasDiscount = !!product.discountPrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - product.discountPrice!) / product.basePrice) * 100)
    : 0;

  const avgRating = product.reviews?.length
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0;

  const cheapestVariant = [...product.variants].sort((a, b) => a.price - b.price)[0];

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      image: mainImage,
      variantId: cheapestVariant?.id,
      variant: cheapestVariant?.weight,
      price: cheapestVariant?.price || price,
      quantity: 1,
    });

    toast.success(`${product.name} sepete eklendi!`);
  };

  return (
    <Link href={`/urunler/${product.slug}`} className="product-card group block">
      <div className="product-card-image">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasDiscount && <span className="badge-discount">-%{discountPercent}</span>}
          {product.isNew && <span className="badge-new">Yeni</span>}
          {product.isBestSeller && (
            <span className="badge-bestseller">
              <TrendingUp size={10} />
              Çok Satan
            </span>
          )}
        </div>

        {product.isNatural && (
          <div className="absolute top-3 right-3">
            <span className="badge-natural">
              <Leaf size={10} />
              Doğal
            </span>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 btn-primary py-2 px-4 text-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 whitespace-nowrap shadow-lg"
        >
          <ShoppingCart size={14} />
          Sepete Ekle
        </button>
      </div>

      <div className="p-4">
        <p className="text-xs text-brand-600 font-medium mb-1">
          {product.category.name}
        </p>
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 font-display text-base">
          {product.name}
        </h3>

        {avgRating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                size={12}
                className={
                  index < Math.round(avgRating)
                    ? "text-amber-400 fill-amber-400"
                    : "text-gray-200 fill-gray-200"
                }
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">
              ({product.reviews?.length})
            </span>
          </div>
        )}

        {product.variants.length > 0 && (
          <div className="flex gap-1 mb-3 flex-wrap">
            {product.variants.slice(0, 3).map((variant) => (
              <span
                key={variant.id}
                className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md"
              >
                {variant.weight}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-end justify-between">
          <div>
            <span className="price-current">{price.toFixed(2)} ₺</span>
            {hasDiscount && (
              <span className="price-original">
                {product.basePrice.toFixed(2)} ₺
              </span>
            )}
            <p className="text-xs text-gray-400 mt-0.5">
              {cheapestVariant?.weight || "500g"} için
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            className="w-9 h-9 bg-brand-600 hover:bg-brand-700 text-white rounded-xl flex items-center justify-center transition-colors shrink-0"
            aria-label="Sepete ekle"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
}
