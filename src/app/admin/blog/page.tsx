import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, Edit, Eye, EyeOff, Plus } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Blog Yönetimi" };

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 pt-20 lg:p-8 lg:pt-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">
            Blog Yönetimi
          </h1>
          <p className="mt-1 text-gray-500">{posts.length} yazı</p>
        </div>
        <Link href="/admin/blog/yeni" className="btn-primary">
          <Plus size={16} />
          Yeni Yazı
        </Link>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/* Mobil Görünüm */}
        <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
          {posts.map((post) => (
            <div key={post.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="mb-2 flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-bold text-gray-900">{post.title}</p>
                  <p className="mt-0.5 truncate font-mono text-xs text-gray-400">{post.slug}</p>
                </div>
                <div className="ml-3 flex shrink-0 items-center gap-1">
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-500 transition-colors hover:bg-blue-100"
                  >
                    <Edit size={16} />
                  </Link>
                  {post.isPublished && (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100"
                    >
                      <Eye size={16} />
                    </Link>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-600">{post.authorName}</span>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400">
                    <Calendar size={10} />
                    {new Date(post.createdAt).toLocaleDateString("tr-TR")}
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${
                    post.isPublished ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {post.isPublished ? <Eye size={10} /> : <EyeOff size={10} />}
                  {post.isPublished ? "Yayında" : "Taslak"}
                </span>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="py-8 text-center text-gray-400">Henüz blog yazısı yok.</div>
          )}
        </div>

        {/* Masaüstü Görünüm */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Başlık", "Durum", "Yazar", "Tarih", "İşlem"].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post) => (
                <tr key={post.id} className="transition-colors hover:bg-gray-50">
                  <td className="max-w-xs px-4 py-3">
                    <p className="line-clamp-2 text-sm font-medium text-gray-900">
                      {post.title}
                    </p>
                    <p className="mt-0.5 truncate font-mono text-xs text-gray-400">
                      {post.slug}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                        post.isPublished
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {post.isPublished ? <Eye size={10} /> : <EyeOff size={10} />}
                      {post.isPublished ? "Yayında" : "Taslak"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {post.authorName}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar size={11} />
                      {new Date(post.createdAt).toLocaleDateString("tr-TR")}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-500 transition-colors hover:bg-blue-50"
                        title="Düzenle"
                      >
                        <Edit size={14} />
                      </Link>
                      {post.isPublished && (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-50"
                          title="Sitede Gör"
                        >
                          <Eye size={14} />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {posts.length === 0 && (
            <div className="py-12 text-center text-gray-400">
              Henüz blog yazısı yok.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
