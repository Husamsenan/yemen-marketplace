import type { Metadata, Viewport } from "next";
import type React from "react";
import { MarketplaceProvider } from "@/components/MarketplaceProvider";
import { PwaRegister } from "@/components/PwaRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "سوق اليمن | Kleinanzeigen fuer den Jemen",
  description:
    "Mobile-first Kleinanzeigen-Plattform fuer Autos, Immobilien, Jobs, Handys, Solarprodukte und mehr im Jemen.",
  manifest: "/manifest.json",
  keywords: ["Yemen", "Kleinanzeigen", "Marketplace", "سوق اليمن", "بيع وشراء"],
  openGraph: {
    title: "سوق اليمن",
    description: "Schneller, vertrauenswuerdiger Marketplace fuer Menschen im Jemen.",
    type: "website",
    locale: "ar_YE"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f9fc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1724" }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <MarketplaceProvider>{children}</MarketplaceProvider>
        <PwaRegister />
      </body>
    </html>
  );
}
