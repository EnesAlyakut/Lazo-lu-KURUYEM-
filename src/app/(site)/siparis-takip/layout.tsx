import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sipariş Takibi",
  description: "LZG ile başlayan sipariş numaranızla güncel sipariş durumunuzu sorgulayın.",
};

export default function SiparisTakipLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
