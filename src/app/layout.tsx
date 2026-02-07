import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#8400D6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: "Kopeo - Compra bebidas en eventos",
  description: "Compra tus bebidas antes de llegar al evento. Escanea, paga y disfruta.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Kopeo - Compra bebidas en eventos",
    description: "Compra tus bebidas antes de llegar al evento. Escanea, paga y disfruta.",
    url: "https://kopeo.app",
    siteName: "Kopeo",
    images: [
      {
        url: "/logo-sin-fondo.png",
        width: 512,
        height: 512,
        alt: "Kopeo Logo",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Kopeo - Compra bebidas en eventos",
    description: "Compra tus bebidas antes de llegar al evento. Escanea, paga y disfruta.",
    images: ["/logo-sin-fondo.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kopeo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <Navbar />
        <main className="pt-16 pb-20 md:pb-0">
          {children}
        </main>
        <CartDrawer />
      </body>
    </html>
  );
}
