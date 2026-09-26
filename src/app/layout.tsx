import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/components/cart/CartProvider";
import { EnvironmentProvider } from "@/components/env/EnvironmentProvider";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { NavigationMenu } from "@/components/layout/NavigationMenu";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { Toaster } from "@/components/layout/Toaster";
import { UIProvider } from "@/components/layout/UIProvider";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { preloadScript } from "@/lib/environment";
import "./globals.css";

/**
 * Fonts are self-hosted (src/fonts) instead of fetched from Google at build
 * time, so the build works offline and behind proxies. Sources: @fontsource.
 */
const inter = localFont({
  src: "../fonts/inter-tight-latin-wght-normal.woff2",
  variable: "--font-inter-tight",
  weight: "100 900",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});
const barlow = localFont({
  src: [
    { path: "../fonts/barlow-condensed-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/barlow-condensed-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-barlow-condensed",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: { default: "LIGHTTON — Architectural Lighting", template: "%s — LIGHTTON" },
  description:
    "Suspended, standing and wall lighting in brass, glass, oak and enamel. Designed for the day it hangs in and the night it creates.",
};

export const viewport: Viewport = {
  themeColor: "#111112",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${barlow.variable}`} data-mode="night" suppressHydrationWarning>
      {/* Extensions (e.g. Grammarly) inject attributes on <body> before hydration. */}
      <body className="grain flex min-h-dvh flex-col" suppressHydrationWarning>
        {/* Paints night before the first frame — no daylight flash. */}
        <Script id="env-preload" strategy="beforeInteractive">
          {preloadScript()}
        </Script>
        <a href="#main" className="skip-link btn btn-solid btn-sm">
          Skip to content
        </a>
        <div aria-hidden className="atmosphere" />
        <EnvironmentProvider>
          <CartProvider>
            <UIProvider>
              <Header />
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer />
              <NavigationMenu />
              <SearchOverlay />
              <CartDrawer />
              <Toaster />
              <RevealObserver />
            </UIProvider>
          </CartProvider>
        </EnvironmentProvider>
      </body>
    </html>
  );
}
