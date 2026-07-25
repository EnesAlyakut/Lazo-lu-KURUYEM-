import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import CartProvider from "@/components/providers/CartProvider";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://lazoglukuruyemis.com"),
  title: {
    default: "LAZOĞLU KURUYEMİŞ | Çorum Hatırası, LüksLeb ve Hediyelik Leblebi",
    template: "%s | LAZOĞLU KURUYEMİŞ",
  },
  description:
    "Çorum Hatırası hediyelik kutuları, LüksLeb leblebi kurabiyeleri ve özel Çorum leblebisi sunumları. Kapınıza kadar hızlı teslimat.",
  keywords: [
    "leblebi",
    "çorum leblebisi",
    "çorum hatırası",
    "lüksleb",
    "leblebi kurabiyesi",
    "hediyelik kutu",
    "draje kutusu",
    "boş ambalaj",
    "hediyelik kuruyemiş",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://lazoglukuruyemis.com",
    siteName: "LAZOĞLU KURUYEMİŞ",
    title: "LAZOĞLU KURUYEMİŞ | Çorum Hatırası, LüksLeb ve Hediyelik Leblebi",
    description:
      "Çorum Hatırası hediyelikleri, LüksLeb ürünleri ve özel leblebi sunumları.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LAZOĞLU KURUYEMİŞ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LAZOĞLU KURUYEMİŞ",
    description: "Çorum Hatırası hediyelikleri ve LüksLeb ürünleri",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "xB1Dw02SdtgqoDJHBoVoZVlFmz9NhH37OSKbdmSoV7A",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://lazoglukuruyemis.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <CartProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#312119",
                color: "white",
                borderLeft: "4px solid #a38c7c",
                borderRadius: "12px",
                padding: "12px 16px",
                fontSize: "14px",
                fontWeight: "500",
              },
              success: {
                iconTheme: {
                  primary: "#a38c7c",
                  secondary: "white",
                },
              },
            }}
          />
          <FloatingWhatsApp />
        </CartProvider>
      </body>
    </html>
  );
}
