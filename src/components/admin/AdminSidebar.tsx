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
} from "lucide-react";
import toast from "react-hot-toast";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Siparişler", href: "/admin/siparisler", icon: ShoppingBag },
  { label: "Ürünler", href: "/admin/urunler", icon: Package },
  { label: "Kategoriler", href: "/admin/kategoriler", icon: FolderOpen },
  { label: "Görsel Optimize", href: "/admin/gorsel-optimize", icon: ImageIcon },
  { label: "Blog", href: "/admin/blog", icon: BookOpen },
  { label: "Kuponlar", href: "/admin/kuponlar", icon: Tag },
  { label: "E-Bülten", href: "/admin/ebulten", icon: Users },
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
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_10px_25px_rgba(0,0,0,0.25)]">
            <Image
              src="/images/logo_circular.png"
              alt="LAZOĞLU KURUYEMİŞ"
              fill
              className="object-contain p-[3px]"
              sizes="48px"
              priority
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
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_8px_18px_rgba(0,0,0,0.22)]">
            <Image
              src="/images/logo_circular.png"
              alt="LAZOĞLU KURUYEMİŞ"
              fill
              className="object-contain p-[3px]"
              sizes="40px"
              priority
            />
          </div>
          <span className="truncate text-sm font-bold text-white">
            LAZOĞLU KURUYEMİŞ
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="text-white"
          aria-label="Menü"
        >
          {mounted && mobileOpen ? <X size={22} /> : <Menu size={22} />}
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
