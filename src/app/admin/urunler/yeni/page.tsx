"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Package,
  Tag,
  ImageIcon,
  Info,
  Star,
  Loader2,
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

export default function YeniUrunPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [variants, setVariants] = useState<Variant[]>([
    { weight: "250g", price: 0, stock: 0 },
  ]);

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

  // Seçili kategorinin slug'ı - form state'inden sonra tanımlanmalı
  const selectedCategory = categories.find((c) => c.id === form.categoryId);
  const isGiftBox = selectedCategory?.slug === "hediyelik-kutu";

  useEffect(() => {
    setMounted(true);
    fetch("/api/kategoriler?withCount=false")
      .then((r) => r.json())
      .then((data) => setCategories(data))
      .catch(console.error);
  }, []);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
      .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const handleNameChange = (val: string) => {
    setForm((f) => ({ ...f, name: val, slug: slugify(val) }));
  };

  const addImage = () => {
    if (imageUrl.trim()) {
      setImages((prev) => [...prev, imageUrl.trim()]);
      setImageUrl("");
    }
  };

  const removeImage = (i: number) => setImages((prev) => prev.filter((_, idx) => idx !== i));

  const addVariant = () =>
    setVariants((prev) => [...prev, { weight: "", price: 0, stock: 0 }]);

  const removeVariant = (i: number) =>
    setVariants((prev) => prev.filter((_, idx) => idx !== i));

  const updateVariant = (i: number, key: keyof Variant, val: string | number) =>
    setVariants((prev) =>
      prev.map((v, idx) => (idx === i ? { ...v, [key]: val } : v))
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
        if (!res.ok) throw new Error(data.error || "Yükleme hatası");
        setImages((prev) => [...prev, data.url]);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Görsel yüklenemedi.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const totalStock = isGiftBox
    ? parseInt(form.totalStock, 10) || 0
    : variants.reduce((s, v) => s + Number(v.stock), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId) return alert("Lütfen bir kategori seçin.");
    if (images.length === 0) return alert("En az bir ürün görseli ekleyin.");

    setLoading(true);
    try {
      const res = await fetch("/api/urunler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          basePrice: parseFloat(form.basePrice),
          discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : null,
          images,
          totalStock,
          variants: isGiftBox ? [] : variants,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Hata oluştu");
      }

      router.push("/admin/urunler");
      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
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
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/urunler"
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={18} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Yeni Ürün Ekle</h1>
          <p className="text-gray-500 text-sm mt-0.5">Ürün bilgilerini doldurun ve kaydedin</p>
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
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Örn: Çiğ Leblebi"
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
                placeholder="cig-leblebi"
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
                  const newCatId = e.target.value;
                  const newCat = categories.find((c) => c.id === newCatId);
                  // Hediyelik kutu seçilince varyantları sıfırla
                  if (newCat?.slug === "hediyelik-kutu") {
                    setVariants([]);
                  } else if (variants.length === 0) {
                    setVariants([{ weight: "250g", price: 0, stock: 0 }]);
                  }
                  setForm((f) => ({ ...f, categoryId: newCatId }));
                }}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
              >
                <option value="">Kategori Seçin</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {isGiftBox && (
                <p className="mt-1.5 text-xs text-amber-600 flex items-center gap-1">
                  <span>🎁</span>
                  Hediyelik Kutu kategorisinde gramaj varyantı kullanılmaz.
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
                placeholder="0.00"
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
          <div className="flex items-center gap-2 mb-5">
            <ImageIcon size={18} className="text-brand-500" />
            <h2 className="font-semibold text-gray-900">Ürün Görselleri</h2>
          </div>

          {/* Gizli dosya input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />

          {/* URL + Ekle butonu */}
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
              onClick={() => {
                if (imageUrl.trim()) {
                  addImage();
                } else {
                  fileInputRef.current?.click();
                }
              }}
              disabled={uploadingImage}
              className="px-4 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-medium hover:bg-brand-600 disabled:opacity-60 transition-colors flex items-center gap-1.5"
            >
              {uploadingImage ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              {uploadingImage ? "Yükleniyor..." : "Ekle"}
            </button>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            URL boşsa butona basınca bilgisayarından görsel seçebilirsin · JPG, PNG, WebP · Max 5MB
          </p>

          {/* Görsel önizleme */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`Görsel ${i + 1}`}
                    className="w-full h-24 object-cover rounded-xl border border-gray-200"
                    onError={(e) => (e.currentTarget.src = "/images/placeholder.png")}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <Trash2 size={11} />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 text-[10px] bg-brand-500 text-white px-1.5 py-0.5 rounded-md">
                      Ana
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
          {images.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6 border-2 border-dashed border-gray-200 rounded-xl">
              Henüz görsel eklenmedi
            </p>
          )}
        </div>

        {/* Varyantlar - Hediyelik Kutu kategorisinde gizle */}
        {!isGiftBox && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Tag size={18} className="text-brand-500" />
                <h2 className="font-semibold text-gray-900">Gramaj Varyantları</h2>
              </div>
              <button
                type="button"
                onClick={addVariant}
                className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
              >
                <Plus size={15} /> Varyant Ekle
              </button>
            </div>
            <div className="space-y-3">
              {variants.map((v, i) => (
                <div key={i} className="grid grid-cols-3 gap-3 items-center">
                  <input
                    type="text"
                    value={v.weight}
                    onChange={(e) => updateVariant(i, "weight", e.target.value)}
                    placeholder="250g"
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={v.price || ""}
                    onChange={(e) => updateVariant(i, "price", parseFloat(e.target.value) || 0)}
                    placeholder="Fiyat ₺"
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={v.stock || ""}
                      onChange={(e) => updateVariant(i, "stock", parseInt(e.target.value) || 0)}
                      placeholder="Stok"
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                    />
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(i)}
                        className="w-8 h-8 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-3 gap-3 mt-1">
                <p className="text-xs text-gray-400">Gramaj</p>
                <p className="text-xs text-gray-400">Fiyat (₺)</p>
                <p className="text-xs text-gray-400">Stok Adedi</p>
              </div>
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
              { key: "isActive", label: "Aktif", color: "green" },
              { key: "isNatural", label: "Doğal", color: "emerald" },
              { key: "isFeatured", label: "Öne Çıkan", color: "blue" },
              { key: "isBestSeller", label: "Çok Satan", color: "amber" },
              { key: "isNew", label: "Yeni", color: "purple" },
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
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.checked }))
                  }
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
            disabled={loading}
            className="px-6 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-semibold hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Save size={16} />
            {loading ? "Kaydediliyor..." : "Ürünü Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}
