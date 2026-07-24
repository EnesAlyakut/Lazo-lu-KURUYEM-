"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/giris";

  // If we are on the login page, render without sidebar and without margin
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Otherwise, render the normal admin layout
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="min-h-screen flex-1 lg:ml-64">{children}</main>
    </div>
  );
}
