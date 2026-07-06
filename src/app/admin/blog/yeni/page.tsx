"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  FileText,
  ImageIcon,
  Tag,
  Eye,
  EyeOff,
} from "lucide-react";

export default function YeniBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    authorName: "FK KURUYEMÄ°Å",
    tags: [] as string[],
  });

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/ÄŸ/g, "g").replace(/Ã¼/g, "u").replace(/ÅŸ/g, "s")
      .replace(/Ä±/g, "i").replace(/Ã¶/g, "o").replace(/Ã§/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const handleTitleChange = (val: string) => {
    setForm((f) => ({ ...f, title: val, slug: slugify(val) }));
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput("");
  };

  const removeTag = (tag: string) =>
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.content.trim()) return alert("Ä±Ã§erik alanÄ± boÅŸ bÄ±rakÄ±lamaz.");

    setLoading(true);
    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug,
          content: form.content,
          excerpt: form.excerpt || undefined,
          coverImage: form.coverImage || undefined,
          isPublished: form.isPublished,
          metaTitle: form.metaTitle || undefined,
          metaDescription: form.metaDescription || undefined,
          authorName: form.authorName || "FK KURUYEMÄ°Å",
          tags: form.tags,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Blog yazÄ±sÄ± oluÅŸturulamadÄ±");
      }

      router.push("/admin/blog");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Bir hata oluÅŸtu");
    } finally {
      setLoading(false);
    }
  };

  const wordCount = form.content.split(/\s+/).filter(Boolean).length;

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/blog"
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={18} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Yeni Blog YazÄ±sÄ±</h1>
          <p className="text-gray-500 text-sm mt-0.5">Ä±Ã§erik oluÅŸturun ve yayÄ±nlayÄ±n</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* YayÄ±n Durumu Banner */}
        <div
          className={`rounded-2xl p-4 flex items-center justify-between border ${
            form.isPublished
              ? "bg-green-50 border-green-200"
              : "bg-amber-50 border-amber-200"
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
                {form.isPublished ? "YayÄ±nlanacak" : "Taslak olarak kaydedilecek"}
              </p>
              <p className={`text-xs mt-0.5 ${form.isPublished ? "text-green-600" : "text-amber-600"}`}>
                {form.isPublished
                  ? "KaydettiÄŸinizde yazÄ± sitede yayÄ±na girecek"
                  : "Daha sonra yayÄ±nlayabilirsiniz"}
              </p>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm font-medium text-gray-700">
              {form.isPublished ? "YayÄ±nla" : "Taslak"}
            </span>
            <div className="relative">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
                className="sr-only"
              />
              <div
                className={`w-12 h-6 rounded-full transition-colors ${
                  form.isPublished ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform mt-0.5 ml-0.5 ${
                    form.isPublished ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </div>
            </div>
          </label>
        </div>

        {/* Temel Bilgiler */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <FileText size={18} className="text-brand-500" />
            <h2 className="font-semibold text-gray-900">YazÄ± Bilgileri</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                BaÅŸlÄ±k *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Ã–rn: Leblebi'nin FaydalarÄ±"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                URL Slug *
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 shrink-0">/blog/</span>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="leblebi-nin-faydalari"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Ã–zet (Excerpt)
              </label>
              <textarea
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                placeholder="Blog listesinde gÃ¶sterilecek kÄ±sa Ã¶zet (opsiyonel)"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Yazar
                </label>
                <input
                  type="text"
                  value={form.authorName}
                  onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))}
                  placeholder="FK KURUYEMÄ°Å"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Ä±Ã§erik */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-brand-500" />
              <h2 className="font-semibold text-gray-900">Ä±Ã§erik *</h2>
            </div>
            <span className="text-xs text-gray-400">{wordCount} kelime</span>
          </div>
          <textarea
            required
            rows={18}
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            placeholder="Blog yazÄ±nÄ±zÄ±n iÃ§eriÄŸini buraya yazÄ±n...

Markdown formatÄ± desteklenmektedir:
# BaÅŸlÄ±k 1
## BaÅŸlÄ±k 2
**KalÄ±n yazÄ±**
*Ä±talik yazÄ±*
- Madde iÅŸareti
1. NumaralÄ± liste"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent resize-none font-mono leading-relaxed"
          />
        </div>

        {/* Kapak GÃ¶rseli */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <ImageIcon size={18} className="text-brand-500" />
            <h2 className="font-semibold text-gray-900">Kapak GÃ¶rseli</h2>
          </div>
          <input
            type="url"
            value={form.coverImage}
            onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
            placeholder="https://example.com/kapak-gorsel.jpg (opsiyonel)"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
          />
          {form.coverImage && (
            <div className="mt-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.coverImage}
                alt="Kapak Ã¶nizleme"
                className="w-full max-h-48 object-cover rounded-xl border border-gray-200"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <p className="text-xs text-gray-400 mt-1">Kapak gÃ¶rseli Ã¶nizleme</p>
            </div>
          )}
        </div>

        {/* Etiketler */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Tag size={18} className="text-brand-500" />
            <h2 className="font-semibold text-gray-900">Etiketler</h2>
          </div>
          <div className="flex gap-2 mb-3">
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
              placeholder="Etiket yazÄ±n, Enter'a basÄ±n"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Ekle
            </button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-700 text-sm rounded-full border border-brand-200"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-brand-400 hover:text-brand-600 transition-colors"
                  >
                    Ã—
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* SEO */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-5">SEO (Opsiyonel)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta BaÅŸlÄ±k</label>
              <input
                type="text"
                value={form.metaTitle}
                onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))}
                placeholder="BoÅŸ bÄ±rakÄ±rsanÄ±z yazÄ± baÅŸlÄ±ÄŸÄ± kullanÄ±lÄ±r"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta AÃ§Ä±klama</label>
              <textarea
                rows={2}
                value={form.metaDescription}
                onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
                placeholder="Arama sonuÃ§larÄ±nda gÃ¶rÃ¼necek aÃ§Ä±klama (maks. 160 karakter)"
                maxLength={160}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">
                {form.metaDescription.length}/160
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <Link
            href="/admin/blog"
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Ä±ptal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-semibold hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Save size={16} />
            {loading
              ? "Kaydediliyor..."
              : form.isPublished
              ? "YayÄ±nla"
              : "Taslak Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}

