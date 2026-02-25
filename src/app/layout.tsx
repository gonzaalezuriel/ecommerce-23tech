import type { Metadata } from "next";

export const dynamic = "force-dynamic";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
import NextAuthProvider from "@/context/next-auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "23Tech - Tecnología de Alto Rendimiento",
  description:
    "Tu tienda online de productos de computación. PCs gaming, notebooks, monitores, teclados, mouse y componentes con envío a todo el país.",
};

import { getCategories } from "@/lib/db/categories";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();

  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>
          <AuthProvider>
            <CartProvider>
              <TooltipProvider>
                <Header categories={categories} />
                <main className="min-h-screen">{children}</main>
                <Footer />
                <Toaster />
              </TooltipProvider>
            </CartProvider>
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
