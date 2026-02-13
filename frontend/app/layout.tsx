import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { Navigation } from "@/components/layout/Navigation";
import { CartProvider } from "@/lib/hooks/CartContext";
import { CartProvider as UICartProvider } from "@/components/cart/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {

  title: "BarsCafe - Fresh Coffee & Delicious Food",
  description: "Experience premium coffee, artisanal pastries, and delicious food at BarsCafe. Order online for pickup or delivery.",
  keywords: ["coffee shop", "cafe", "coffee", "pastries", "breakfast", "lunch", "food delivery"],
  authors: [{ name: "BarsCafe" }],
  openGraph: {
    title: "BarsCafe - Fresh Coffee & Delicious Food",
    description: "Experience premium coffee, artisanal pastries, and delicious food at BarsCafe.",
    type: "website",
    locale: "en_US",
    siteName: "BarsCafe",
  },
  twitter: {
    card: "summary_large_image",
    title: "BarsCafe - Fresh Coffee & Delicious Food",
    description: "Experience premium coffee, artisanal pastries, and delicious food at BarsCafe.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1A1410",
};

import { ClerkProvider } from '@clerk/nextjs';
import { UserProvider } from "@/lib/request/UserContext";

// ... imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
        variables: {
          colorPrimary: '#D4A574',
          colorBackground: '#1A1410',
          colorText: '#ffffff',
          colorInputBackground: '#2D2520',
          colorInputText: '#ffffff',
        },
      }}
    >
      <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
        <head>
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />
        </head>
        <body className="font-[var(--font-inter)] antialiased" suppressHydrationWarning>

          <QueryProvider>
            <CartProvider>
              <UICartProvider>
                <UserProvider>
                  {children}
                  <Navigation />
                  <CartDrawer />
                </UserProvider>
              </UICartProvider>
            </CartProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
