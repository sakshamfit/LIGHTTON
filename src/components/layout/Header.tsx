"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { DayNightToggle } from "@/components/env/DayNightToggle";
import { IconBag, IconSearch } from "@/components/ui/Icons";
import { Logo } from "./Logo";
import { useUI } from "./UIProvider";

export function Header() {
  const { open, panel } = useUI();
  const { count, ready } = useCart();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [bump, setBump] = useState(false);
  const last = useRef(0);
  const prevCount = useRef(count);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      setHidden(y > 240 && y > last.current + 4);
      if (y < last.current - 4 || y < 240) setHidden(false);
      last.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (ready && count > prevCount.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 520);
      prevCount.current = count;
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count, ready]);

  const overHero = pathname === "/" && !scrolled;

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[var(--ease-soft)]"
      style={{ viewTransitionName: "site-header", transform: hidden && !panel ? "translateY(-100%)" : "none" }}
    >
      <div
        className="absolute inset-0 border-b transition-[opacity,border-color] duration-300"
        style={{
          background: "color-mix(in srgb, var(--bg) 88%, transparent)",
          backdropFilter: "saturate(1.4) blur(14px)",
          WebkitBackdropFilter: "saturate(1.4) blur(14px)",
          opacity: overHero ? 0 : 1,
          borderColor: overHero ? "transparent" : "var(--line)",
        }}
        aria-hidden
      />
      <div className="wrap relative grid h-[var(--header-h)] grid-cols-[1fr_auto_1fr] items-center">
        <Link href="/" aria-label="Vesper — home" className="justify-self-start">
          <Logo />
        </Link>

        <button
          type="button"
          onClick={() => open("menu")}
          className="group hidden h-11 items-center gap-3 px-3 md:inline-flex"
          aria-haspopup="dialog"
          aria-expanded={panel === "menu"}
          aria-controls="site-menu"
        >
          <span className="flex w-6 flex-col gap-[5px]" aria-hidden>
            <span className="h-px w-full bg-fg transition-transform duration-200 group-hover:-translate-y-px" />
            <span className="h-px w-2/3 self-center bg-fg transition-[width] duration-200 group-hover:w-full" />
          </span>
          <span className="t-caption">Menu</span>
        </button>
        <span className="md:hidden" />

        <div className="flex items-center justify-self-end gap-0.5 sm:gap-1">
          <nav aria-label="Primary" className="mr-4 hidden items-center gap-7 xl:flex">
            {[
              ["Shop", "/shop"],
              ["Collections", "/collections"],
              ["Journal", "/journal"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="u-link t-caption"
                aria-current={pathname.startsWith(href) ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => open("search")}
            className="inline-flex h-11 w-11 items-center justify-center"
            aria-label="Search (press /)"
          >
            <IconSearch />
          </button>
          <span className="hidden sm:contents">
            <DayNightToggle />
          </span>
          <span className="contents sm:hidden">
            <DayNightToggle compact />
          </span>
          <button
            type="button"
            onClick={() => open("cart")}
            className="relative inline-flex h-11 w-11 items-center justify-center"
            aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
          >
            <IconBag />
            <span
              className="t-num absolute right-0.5 top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-inv px-1 text-[10px] font-medium text-inv-fg transition-[transform,opacity] duration-300"
              style={{
                opacity: ready && count > 0 ? 1 : 0,
                transform: bump ? "scale(1.28)" : "scale(1)",
                transitionTimingFunction: "var(--ease-soft)",
              }}
              aria-hidden
            >
              {count}
            </span>
          </button>
          <button
            type="button"
            onClick={() => open("menu")}
            className="inline-flex h-11 w-11 items-center justify-center md:hidden"
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={panel === "menu"}
            aria-controls="site-menu"
          >
            <span className="flex w-5 flex-col gap-[5px]" aria-hidden>
              <span className="h-px w-full bg-fg" />
              <span className="h-px w-full bg-fg" />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
