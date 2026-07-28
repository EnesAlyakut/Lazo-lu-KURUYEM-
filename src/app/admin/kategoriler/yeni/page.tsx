"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Layers, ImageIcon, Upload } from "lucide-react";

export default function YeniKategoriPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    order: 0,
    isActive: true,
    unitType: "GRAMAJ",
  });

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || err.error || "Görsel yüklenemedi");
      }

      const data = await res.json();
      setForm((f) => ({ ...f, image: data.url }));
    } catch (err: any) {
      alert(err.message || "Bir hata oluştu");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/kategoriler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          description: form.description || undefined,
          image: form.image || undefined,
          order: Number(form.order),
          isActive: form.isActive,
          unitType: form.unitType,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || err.error || "Kategori oluşturulamadı");
      }

      router.push("/admin/kategoriler");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/kategoriler"
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={18} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Yeni Kategori Ekle</h1>
          <p className="text-gray-500 text-sm mt-0.5">Ürünlerinizi gruplamak için kategori oluşturun</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Kategori Bilgileri */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Layers size={18} className="text-brand-500" />
            <h2 className="font-semibold text-gray-900">Kategori Bilgileri</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Kategori Adı *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Örn: Leblebi"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                URL Slug *
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">/urunler?kategori=</span>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="leblebi"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Açıklama
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Kategori hakkında kısa açıklama (opsiyonel)"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Birim Tipi
              </label>
              <select
                value={form.unitType}
                onChange={(e) => setForm((f) => ({ ...f, unitType: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent bg-white"
              >
                <option value="GRAMAJ">Gramajlı Satış (Örn: 250g, 500g)</option>
                <option value="ADET">Adetli Satış (Örn: 1 Adet, 2 Adet)</option>
              </select>
              <p className="text-xs text-gray-400 mt-1">Bu kategorideki ürünlerin nasıl satılacağını belirler</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Sıra Numarası
              </label>
              <input
                type="number"
                min="0"
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))}
                placeholder="0"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">Küçük sayı › önce gösterilir</p>
            </div>
          </div>
        </div>

        {/* Görsel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <ImageIcon size={18} className="text-brand-500" />
            <h2 className="font-semibold text-gray-900">Kategori Görseli</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Görsel URL
              </label>
              <input
                type="text"
                value={form.image}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                placeholder="https://example.com/gorsel.jpg (opsiyonel)"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                veya Bilgisayardan Seç
              </label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Upload size={16} />
                {uploadingImage ? "Yükleniyor..." : "Görsel Seç"}
              </button>
            </div>
          </div>
          {form.image && (
            <div className="mt-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.image}
                alt="Önizleme"
                className="w-32 h-32 object-cover rounded-xl border border-gray-200"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <p className="text-xs text-gray-400 mt-1">Önizleme</p>
            </div>
          )}
        </div>

        {/* Durum */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Durum</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                className="sr-only"
              />
              <div
                className={`w-12 h-6 rounded-full transition-colors ${
                  form.isActive ? "bg-brand-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform mt-0.5 ml-0.5 ${
                    form.isActive ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                {form.isActive ? "Aktif" : "Pasif"}
              </p>
              <p className="text-xs text-gray-400">
                {form.isActive
                  ? "Kategori sitede görünür"
                  : "Kategori sitede gizli"}
              </p>
            </div>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <Link
            href="/admin/kategoriler"
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            ıptal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-semibold hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Save size={16} />
            {loading ? "Kaydediliyor..." : "Kategoriyi Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}
