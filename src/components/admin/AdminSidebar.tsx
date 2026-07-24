"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  FolderOpen,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  Tag,
  Users,
  X,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";
import AdminNotifications from "@/components/admin/AdminNotifications";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Siparişler", href: "/admin/siparisler", icon: ShoppingBag },
  { label: "Ürünler", href: "/admin/urunler", icon: Package },
  { label: "Kategoriler", href: "/admin/kategoriler", icon: FolderOpen },
  { label: "Görsel Optimize", href: "/admin/gorsel-optimize", icon: ImageIcon },
  { label: "Blog", href: "/admin/blog", icon: BookOpen },
  { label: "Kuponlar", href: "/admin/kuponlar", icon: Tag },
  { label: "E-Bülten", href: "/admin/ebulten", icon: Users },
  { label: "Yorumlar", href: "/admin/yorumlar", icon: MessageSquare },
  { label: "Mesajlar", href: "/admin/mesajlar", icon: MessageSquare },
];

function SidebarContent({
  pathname,
  onLinkClick,
  onLogout,
}: {
  pathname: string;
  onLinkClick: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-800 px-5 py-5">
        <Link
          href="/admin"
          onClick={onLinkClick}
          className="flex min-h-[58px] items-center gap-3 rounded-xl px-1 transition-colors hover:bg-white/[0.03]"
        >
          <div className="relative flex h-[68px] w-[68px] shrink-0 items-center justify-center overflow-hidden rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.25)]">
            <Image
              src="/images/logo_circular.png"
              alt="LAZOĞLU KURUYEMİŞ"
              fill
              className="object-contain"
              sizes="68px"
              priority
              quality={100}
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-bold leading-tight text-white">
              LAZOĞLU KURUYEMİŞ
            </p>
            <p className="mt-1 text-xs leading-none text-brand-300">
              Yönetim Paneli
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={`admin-sidebar-link ${isActive ? "active" : ""}`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-gray-800 p-3">
        <AdminNotifications />
        <Link href="/" target="_blank" className="admin-sidebar-link text-sm">
          <Package size={16} />
          Siteyi Görüntüle
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="admin-sidebar-link w-full text-red-400 hover:bg-red-900/20 hover:text-red-300"
        >
          <LogOut size={16} />
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/cikis", { method: "POST" });
    toast.success("Çıkış yapıldı.");
    router.push("/admin/giris");
  };

  return (
    <>
      <aside className="fixed left-0 top-0 z-50 hidden h-full w-64 bg-gray-900 lg:block">
        <SidebarContent
          pathname={pathname}
          onLinkClick={() => setMobileOpen(false)}
          onLogout={handleLogout}
        />
      </aside>

      <div className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between bg-gray-900 px-4 py-3 shadow-lg lg:hidden">
        <Link href="/admin" className="flex min-w-0 items-center gap-2">
          <div className="relative flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-full shadow-[0_8px_18px_rgba(0,0,0,0.22)]">
            <Image
              src="/images/logo_circular.png"
              alt="LAZOĞLU KURUYEMİŞ"
              fill
              className="object-contain"
              sizes="52px"
              priority
              quality={100}
            />
          </div>
          <span className="truncate text-sm font-bold text-white">
            LAZOĞLU KURUYEMİŞ
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-800 text-white transition-colors hover:bg-gray-700 active:bg-gray-600"
          aria-label="Menü"
        >
          {mounted && mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mounted && mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 transform bg-gray-900 transition-transform duration-300 lg:hidden ${
          mounted && mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent
          pathname={pathname}
          onLinkClick={() => setMobileOpen(false)}
          onLogout={handleLogout}
        />
      </aside>
    </>
  );
}
