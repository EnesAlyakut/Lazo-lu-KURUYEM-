import type { Metadata } from "next";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: {
    default: "Yönetim Paneli | FK KURUYEMİŞ",
    template: "%s | Yönetim Paneli",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="min-h-screen flex-1 lg:ml-64">{children}</main>
    </div>
  );
}
