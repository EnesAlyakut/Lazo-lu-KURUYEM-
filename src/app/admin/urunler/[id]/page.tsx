"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Hash,
  ImageIcon,
  Info,
  Loader2,
  Package,
  Plus,
  Save,
  Star,
  Tag,
  Trash2,
  Wand2,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Variant {
  weight: string;
  price: number;
  stock: number;
}

interface ProductResponse {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc?: string | null;
  origin?: string | null;
  production?: string | null;
  images: string[];
  basePrice: number;
  discountPrice?: number | null;
  categoryId: string;
  isNatural: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  isActive: boolean;
  totalStock: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
  variants: Variant[];
}

const DEFAULT_WEIGHTS = ["250g", "500g", "1kg"];

export default function UrunDuzenlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    shortDesc: "",
    origin: "",
    production: "",
    basePrice: "",
    discountPrice: "",
    categoryId: "",
    isNatural: true,
    isFeatured: false,
    isBestSeller: false,
    isNew: false,
    isActive: true,
    totalStock: "",
    metaTitle: "",
    metaDescription: "",
  });

  const selectedCategory = categories.find((c) => c.id === form.categoryId);
  const isGiftBox = selectedCategory ? (
    selectedCategory.slug.includes("kutu") ||
    selectedCategory.slug.includes("hediye") ||
    selectedCategory.slug.includes("lokum") ||
    selectedCategory.slug.includes("helva") ||
    selectedCategory.slug.includes("pismaniye") ||
    selectedCategory.slug.includes("ambalaj")
  ) : false;

  // Toplam stok
  const totalStock = isGiftBox
    ? parseInt(form.totalStock, 10) || 0
    : variants.reduce((sum, v) => sum + Number(v.stock), 0);

  useEffect(() => {
    async function loadData() {
      try {
        const [categoryRes, productRes] = await Promise.all([
          fetch("/api/kategoriler?withCount=false"),
          fetch(`/api/urunler/${id}`),
        ]);

        if (!categoryRes.ok || !productRes.ok) {
          throw new Error("Ürün bilgileri yüklenemedi.");
        }

        const [categoryData, product] = (await Promise.all([
          categoryRes.json(),
          productRes.json(),
        ])) as [Category[], ProductResponse];

        setCategories(categoryData);
        setImages(Array.isArray(product.images) ? product.images : []);

        // Eğer mevcut ürünün variantı yoksa ve hediyelik değilse varsayılan ekle
        const cat = categoryData.find((c) => c.id === product.categoryId);
        const isGift = cat ? (
          cat.slug.includes("kutu") ||
          cat.slug.includes("hediye") ||
          cat.slug.includes("lokum") ||
          cat.slug.includes("helva") ||
          cat.slug.includes("pismaniye") ||
          cat.slug.includes("ambalaj")
        ) : false;

        if (!isGift && (!product.variants || product.variants.length === 0)) {
          setVariants(DEFAULT_WEIGHTS.map((w) => ({ weight: w, price: 0, stock: 0 })));
        } else {
          setVariants(product.variants || []);
        }

        setForm({
          name: product.name || "",
          slug: product.slug || "",
          description: product.description || "",
          shortDesc: product.shortDesc || "",
          origin: product.origin || "",
          production: product.production || "",
          basePrice: String(product.basePrice ?? ""),
          discountPrice: product.discountPrice ? String(product.discountPrice) : "",
          categoryId: product.categoryId || "",
          isNatural: product.isNatural ?? true,
          isFeatured: product.isFeatured ?? false,
          isBestSeller: product.isBestSeller ?? false,
          isNew: product.isNew ?? false,
          isActive: product.isActive ?? true,
          totalStock: String(product.totalStock ?? 0),
          metaTitle: product.metaTitle || "",
          metaDescription: product.metaDescription || "",
        });
      } catch (error) {
        alert(error instanceof Error ? error.message : "Ürün bilgileri yüklenemedi.");
        router.push("/admin/urunler");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, router]);

  const addImage = () => {
    if (!imageUrl.trim()) return;
    setImages((c) => [...c, imageUrl.trim()]);
    setImageUrl("");
  };

  const removeImage = (index: number) =>
    setImages((c) => c.filter((_, i) => i !== index));

  const addVariant = () =>
    setVariants((c) => [...c, { weight: "", price: 0, stock: 0 }]);

  const removeVariant = (index: number) =>
    setVariants((c) => c.filter((_, i) => i !== index));

  const updateVariant = (index: number, key: keyof Variant, value: string | number) =>
    setVariants((c) =>
      c.map((v, i) => (i === index ? { ...v, [key]: value } : v))
    );

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingImage(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Görsel yüklenemedi.");
        setImages((c) => [...c, data.url]);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Görsel yüklenemedi.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.categoryId) return alert("Lütfen bir kategori seçin.");
    if (images.length === 0) return alert("En az bir ürün görseli ekleyin.");

    setSaving(true);
    try {
      const response = await fetch(`/api/urunler/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          basePrice: parseFloat(form.basePrice),
          discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : null,
          images,
          totalStock,
          // Adetli ürünlerde varyant gönderilmez
          variants: isGiftBox ? [] : variants,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || error.error || "Ürün güncellenemedi.");
      }

      router.push("/admin/urunler");
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Ürün güncellenemedi.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 pt-20 lg:pt-8 max-w-5xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded-xl" />
          <div className="h-64 bg-gray-100 rounded-2xl" />
          <div className="h-48 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8 max-w-5xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/urunler"
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={18} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ürünü Düzenle</h1>
          <p className="text-gray-500 text-sm mt-0.5">{form.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Temel Bilgiler */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Package size={18} className="text-brand-500" />
            <h2 className="font-semibold text-gray-900">Temel Bilgiler</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Ürün Adı *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Kategori *
              </label>
              <select
                required
                value={form.categoryId}
                onChange={(e) => {
                  const cat = categories.find((c) => c.id === e.target.value);
                  if (cat && (
                    cat.slug.includes("kutu") ||
                    cat.slug.includes("hediye") ||
                    cat.slug.includes("lokum") ||
                    cat.slug.includes("helva") ||
                    cat.slug.includes("pismaniye") ||
                    cat.slug.includes("ambalaj")
                  )) {
                    setVariants([]);
                  } else if (variants.length === 0) {
                    setVariants(DEFAULT_WEIGHTS.map((w) => ({ weight: w, price: 0, stock: 0 })));
                  }
                  setForm((f) => ({ ...f, categoryId: e.target.value }));
                }}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
              >
                <option value="">Kategori Seçin</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {isGiftBox && (
                <p className="mt-1.5 text-xs text-blue-600 flex items-center gap-1">
                  <Hash size={12} />
                  Adetli Ürün: Gramaj yoktur, sadece stok adedi girilir (Örn: Lokum, Helva, Kutu).
                </p>
              )}
              {!isGiftBox && form.categoryId && (
                <p className="mt-1.5 text-xs text-brand-600 flex items-center gap-1">
                  <Tag size={12} />
                  250g, 500g ve 1kg gramaj seçenekleri için fiyat & stok girebilirsiniz.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Taban Fiyat (₺) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={form.basePrice}
                onChange={(e) => setForm((f) => ({ ...f, basePrice: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                İndirimli Fiyat (₺)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.discountPrice}
                onChange={(e) => setForm((f) => ({ ...f, discountPrice: e.target.value }))}
                placeholder="0.00 (opsiyonel)"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
              />
            </div>

            {/* Adetli ürünler: sadece adet */}
            {isGiftBox && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Stok Adedi *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={form.totalStock}
                  onChange={(e) => setForm((f) => ({ ...f, totalStock: e.target.value }))}
                  placeholder="Kaç adet var?"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                />
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Kısa Açıklama
              </label>
              <input
                type="text"
                value={form.shortDesc}
                onChange={(e) => setForm((f) => ({ ...f, shortDesc: e.target.value }))}
                placeholder="Ürünü kısaca tanımlayan bir cümle"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Detaylı Açıklama *
              </label>
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Ürün hakkında detaylı bilgi..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        {/* Ürün Detayları */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Info size={18} className="text-brand-500" />
            <h2 className="font-semibold text-gray-900">Ürün Detayları</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Menşei</label>
              <input
                type="text"
                value={form.origin}
                onChange={(e) => setForm((f) => ({ ...f, origin: e.target.value }))}
                placeholder="Örn: Çorum, Türkiye"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Üretim Yöntemi</label>
              <input
                type="text"
                value={form.production}
                onChange={(e) => setForm((f) => ({ ...f, production: e.target.value }))}
                placeholder="Örn: Geleneksel fırın"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Görseller */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col gap-3 mb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon size={18} className="text-brand-500" />
              <h2 className="font-semibold text-gray-900">Ürün Görselleri</h2>
            </div>
            <Link
              href="/admin/gorsel-optimize"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100"
            >
              <Wand2 size={15} />
              Görsel Optimize
            </Link>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />
          <div className="flex gap-2 mb-4">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
              placeholder="Görsel URL'si yapıştırın (https://...)"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => (imageUrl.trim() ? addImage() : fileInputRef.current?.click())}
              disabled={uploadingImage}
              className="px-4 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-medium hover:bg-brand-600 disabled:opacity-60 transition-colors flex items-center gap-1.5"
            >
              {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {uploadingImage ? "Yükleniyor..." : "Ekle"}
            </button>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            URL boşsa butona basınca bilgisayarından görsel seçebilirsin · JPG, PNG, WebP · Max 5MB
          </p>
          {images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((image, index) => (
                <div key={`${image}-${index}`} className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={`Görsel ${index + 1}`}
                    className="w-full h-24 object-cover rounded-xl border border-gray-200"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/images/logo.png";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <Trash2 size={11} />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 text-[10px] bg-brand-500 text-white px-1.5 py-0.5 rounded-md">
                      Ana
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-6 border-2 border-dashed border-gray-200 rounded-xl">
              Henüz görsel eklenmedi
            </p>
          )}
        </div>

        {/* Gramaj Varyantları — Sadece adetli OLMAYAN kategorilerde */}
        {!isGiftBox && form.categoryId && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Tag size={18} className="text-brand-500" />
                <h2 className="font-semibold text-gray-900">Gramaj & Fiyat Seçenekleri</h2>
              </div>
              <button
                type="button"
                onClick={addVariant}
                className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
              >
                <Plus size={15} /> Seçenek Ekle
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3 mb-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Gramaj</p>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Fiyat (₺)</p>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Stok Adedi</p>
              </div>

              {variants.map((variant, index) => (
                <div key={index} className="grid grid-cols-3 gap-3 items-center">
                  <input
                    type="text"
                    value={variant.weight}
                    onChange={(e) => updateVariant(index, "weight", e.target.value)}
                    placeholder="örn: 250g"
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={variant.price || ""}
                    onChange={(e) => updateVariant(index, "price", parseFloat(e.target.value) || 0)}
                    placeholder="Fiyat"
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={variant.stock || ""}
                      onChange={(e) => updateVariant(index, "stock", parseInt(e.target.value, 10) || 0)}
                      placeholder="Stok"
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                    />
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="w-8 h-8 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-500 mt-3">
              Toplam stok: <span className="font-semibold text-gray-800">{totalStock} adet</span>
            </p>
          </div>
        )}

        {/* Özellikler & Durum */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Star size={18} className="text-brand-500" />
            <h2 className="font-semibold text-gray-900">Özellikler & Durum</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { key: "isActive", label: "Aktif" },
              { key: "isNatural", label: "Doğal" },
              { key: "isFeatured", label: "Öne Çıkan" },
              { key: "isBestSeller", label: "Çok Satan" },
              { key: "isNew", label: "Yeni" },
            ].map(({ key, label }) => (
              <label
                key={key}
                className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
                  form[key as keyof typeof form]
                    ? "border-brand-300 bg-brand-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={form[key as keyof typeof form] as boolean}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))}
                  className="rounded text-brand-500"
                />
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-5">SEO (Opsiyonel)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Başlık</label>
              <input
                type="text"
                value={form.metaTitle}
                onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))}
                placeholder="Google'da görünecek başlık"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Açıklama</label>
              <textarea
                rows={2}
                value={form.metaDescription}
                onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
                placeholder="Arama sonuçlarında görünecek açıklama (maks. 160 karakter)"
                maxLength={160}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <Link
            href="/admin/urunler"
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            İptal
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-semibold hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Save size={16} />
            {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}
