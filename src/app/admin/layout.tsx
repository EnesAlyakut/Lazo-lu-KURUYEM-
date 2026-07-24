import type { Metadata } from "next";
import AdminLayoutWrapper from "./AdminLayoutWrapper";

export const metadata: Metadata = {
  title: {
    default: "Yönetim Paneli",
    template: "%s | Yönetim Paneli",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
