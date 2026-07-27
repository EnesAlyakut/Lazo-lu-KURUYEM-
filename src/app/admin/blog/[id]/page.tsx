"use client";

import { ChangeEvent, useRef, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Save,
  FileText,
  ImageIcon,
  Tag,
  Eye,
  EyeOff,
  Upload,
  X,
  Trash2,
} from "lucide-react";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    coverImage: "",
    isPublished: false,
    metaTitle: "",
    metaDescription: "",
    authorName: "LAZOĞLU KURUYEMİŞ",
    tags: [] as string[],
  });

  useEffect(() => {
    async function loadPost() {
      try {
        const res = await fetch(`/api/blog/${id}`);
        if (!res.ok) throw new Error("Blog yazısı bulunamadı.");
        const data = await res.json();
        
        setForm({
          title: data.title || "",
          slug: data.slug || "",
          content: data.content || "",
          excerpt: data.excerpt || "",
          coverImage: data.coverImage || "",
          isPublished: data.isPublished ?? false,
          metaTitle: data.metaTitle || "",
          metaDescription: data.metaDescription || "",
          authorName: data.authorName || "LAZOĞLU KURUYEMİŞ",
          tags: Array.isArray(data.tags) ? data.tags : [],
        });
      } catch (err) {
        toast.error("Yazı yüklenirken hata oluştu.");
        router.push("/admin/blog");
      } finally {
        setInitialLoading(false);
      }
    }
    loadPost();
  }, [id, router]);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const handleTitleChange = (val: string) => {
    setForm((current) => ({ ...current, title: val, slug: slugify(val) }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm((current) => ({ ...current, tags: [...current.tags, tag] }));
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setForm((current) => ({ ...current, tags: current.tags.filter((item) => item !== tag) }));
  };

  const handleCoverUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Lütfen bir görsel dosyası seçin.");
      event.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploadingCover(true);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || data.message || "Görsel yüklenemedi.");
        return;
      }

      setForm((current) => ({ ...current, coverImage: data.url }));
      toast.success("Kapak görseli eklendi.");
    } catch {
      toast.error("Görsel yüklenirken bağlantı hatası oluştu.");
    } finally {
      setUploadingCover(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.content.trim()) {
      toast.error("İçerik alanı boş bırakılamaz.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Blog yazısı güncellenemedi");
      }

      toast.success("Blog yazısı güncellendi.");
      router.push("/admin/blog");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu blog yazısını silmek istediğinize emin misiniz?")) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Silinemedi");
      toast.success("Blog yazısı silindi.");
      router.push("/admin/blog");
      router.refresh();
    } catch {
      toast.error("Silme işlemi başarısız.");
      setDeleting(false);
    }
  };

  const wordCount = form.content.split(/\s+/).filter(Boolean).length;

  if (initialLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl p-6 pt-20 lg:p-8 lg:pt-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blog"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 transition-colors hover:bg-gray-50"
            aria-label="Geri dön"
          >
            <ArrowLeft size={18} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Yazıyı Düzenle</h1>
            <p className="mt-0.5 text-sm text-gray-500">Mevcut içeriği güncelleyin</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
        >
          <Trash2 size={16} />
          {deleting ? "Siliniyor..." : "Yazıyı Sil"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          className={`flex items-center justify-between rounded-2xl border p-4 ${
            form.isPublished ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"
          }`}
        >
          <div className="flex items-center gap-3">
            {form.isPublished ? (
              <Eye size={18} className="text-green-600" />
            ) : (
              <EyeOff size={18} className="text-amber-600" />
            )}
            <div>
              <p className={`text-sm font-semibold ${form.isPublished ? "text-green-800" : "text-amber-800"}`}>
                {form.isPublished ? "Yayında" : "Taslak"}
              </p>
              <p className={`mt-0.5 text-xs ${form.isPublished ? "text-green-600" : "text-amber-600"}`}>
                {form.isPublished
                  ? "Bu yazı şu an sitede herkes tarafından görülebilir"
                  : "Bu yazı sadece yöneticiler tarafından görülebilir"}
              </p>
            </div>
          </div>
          <label className="flex cursor-pointer items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              {form.isPublished ? "Yayınla" : "Taslak"}
            </span>
            <div className="relative">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => setForm((current) => ({ ...current, isPublished: e.target.checked }))}
                className="sr-only"
              />
              <div className={`h-6 w-12 rounded-full transition-colors ${form.isPublished ? "bg-green-500" : "bg-gray-300"}`}>
                <div
                  className={`ml-0.5 mt-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    form.isPublished ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </div>
            </div>
          </label>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <FileText size={18} className="text-brand-500" />
            <h2 className="font-semibold text-gray-900">Yazı Bilgileri</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Başlık *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Örn: Leblebinin Faydaları"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">URL Slug *</label>
              <div className="flex items-center gap-2">
                <span className="shrink-0 text-sm text-gray-400">/blog/</span>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm((current) => ({ ...current, slug: e.target.value }))}
                  placeholder="leblebinin-faydalari"
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 font-mono text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Özet</label>
              <textarea
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm((current) => ({ ...current, excerpt: e.target.value }))}
                placeholder="Blog listesinde gösterilecek kısa özet"
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Yazar</label>
              <input
                type="text"
                value={form.authorName}
                onChange={(e) => setForm((current) => ({ ...current, authorName: e.target.value }))}
                placeholder="LAZOĞLU KURUYEMİŞ"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-brand-500" />
              <h2 className="font-semibold text-gray-900">İçerik *</h2>
            </div>
            <span className="text-xs text-gray-400">{wordCount} kelime</span>
          </div>
          <textarea
            required
            rows={18}
            value={form.content}
            onChange={(e) => setForm((current) => ({ ...current, content: e.target.value }))}
            placeholder="İçeriğinizi buraya yazın..."
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 font-mono text-sm leading-relaxed focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <ImageIcon size={18} className="text-brand-500" />
            <h2 className="font-semibold text-gray-900">Kapak Görseli</h2>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleCoverUpload}
            className="hidden"
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="url"
              value={form.coverImage}
              onChange={(e) => setForm((current) => ({ ...current, coverImage: e.target.value }))}
              placeholder="https://example.com/kapak-gorsel.jpg"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingCover}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Upload size={16} />
              {uploadingCover ? "Yükleniyor..." : "Değiştir"}
            </button>
          </div>
          {form.coverImage && (
            <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.coverImage}
                  alt="Kapak önizleme"
                  className="max-h-56 w-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
                <button
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, coverImage: "" }))}
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm transition-colors hover:bg-white"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <Tag size={18} className="text-brand-500" />
            <h2 className="font-semibold text-gray-900">Etiketler</h2>
          </div>
          <div className="mb-3 flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Etiket yazın, Enter'a basın"
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            <button
              type="button"
              onClick={addTag}
              className="rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
            >
              Ekle
            </button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm text-brand-700"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-brand-400 transition-colors hover:text-brand-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 font-semibold text-gray-900">SEO</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Meta Başlık</label>
              <input
                type="text"
                value={form.metaTitle}
                onChange={(e) => setForm((current) => ({ ...current, metaTitle: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Meta Açıklama</label>
              <textarea
                rows={2}
                value={form.metaDescription}
                onChange={(e) => setForm((current) => ({ ...current, metaDescription: e.target.value }))}
                maxLength={160}
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
              <p className="mt-1 text-right text-xs text-gray-400">{form.metaDescription.length}/160</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pb-8">
          <Link
            href="/admin/blog"
            className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            İptal
          </Link>
          <button
            type="submit"
            disabled={loading || uploadingCover}
            className="flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={16} />
            {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}
