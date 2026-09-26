import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter_Tight } from "next/font/google";
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

const inter = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});
const barlow = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Vesper — Architectural Lighting", template: "%s — Vesper" },
  description:
    "Suspended, standing and wall lighting in brass, glass, oak and enamel. Designed for the day it hangs in and the night it creates.",
};

export const viewport: Viewport = {
  themeColor: "#f6f8fa",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${barlow.variable}`} data-mode="day" suppressHydrationWarning>
      {/* Extensions (e.g. Grammarly) inject attributes on <body> before hydration. */}
      <body className="grain flex min-h-dvh flex-col" suppressHydrationWarning>
        {/* Paints a stored night mode before first frame — no daylight flash. */}
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
