"use client";

import { AnimatePresence, motion, type Variants } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { DayNightToggle } from "@/components/env/DayNightToggle";
import { LampArt } from "@/components/lamps/LampArt";
import { IconBag, IconChevron, IconClose, IconSearch } from "@/components/ui/Icons";
import { useFocusTrap } from "@/components/ui/useFocusTrap";
import { NAV } from "@/lib/navigation";
import { PRODUCTS } from "@/lib/products";
import { Logo } from "./Logo";
import { useUI } from "./UIProvider";

const EASE_CURTAIN = [0.76, 0, 0.24, 1] as const;

const list: Variants = {
  open: { transition: { staggerChildren: 0.06, delayChildren: 0.32 } },
  closed: { transition: { staggerChildren: 0.035, staggerDirection: -1 } },
};
const item: Variants = {
  open: { opacity: 1, y: 0, transition: { duration: 0.62, ease: [0.16, 1, 0.3, 1] } },
  closed: { opacity: 0, y: 18, transition: { duration: 0.22, ease: [0.55, 0, 1, 0.45] } },
};

const finishFor = (art: string, i: number) => {
  const p = PRODUCTS.find((x) => x.art === art)!;
  return p.finishes[i] ?? p.finishes[0];
};

export function NavigationMenu() {
  const { panel, close, open } = useUI();
  const { count } = useCart();
  const pathname = usePathname();
  const isOpen = panel === "menu";
  const [active, setActive] = useState(1);
  const [expanded, setExpanded] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, isOpen);

  const group = NAV[active];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="menu"
          id="site-menu"
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-bg text-fg"
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 0.82, ease: EASE_CURTAIN } }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0.56, ease: EASE_CURTAIN, delay: 0.1 } }}
        >
          <div className="wrap flex h-[var(--header-h)] shrink-0 items-center justify-between">
            <Link href="/" onClick={close} aria-label="Vesper — home">
              <Logo />
            </Link>
            <button type="button" onClick={close} className="group inline-flex h-11 items-center gap-3 pl-3" aria-label="Close menu">
              <span className="t-caption hidden sm:inline">Close</span>
              <IconClose className="transition-transform duration-300 group-hover:rotate-90" />
            </button>
          </div>

          <div className="wrap grid flex-1 grid-cols-1 gap-10 pb-10 pt-6 lg:grid-cols-12 lg:gap-8 lg:pt-[4vh]">
            {/* Primary */}
            <motion.ul variants={list} initial="closed" animate="open" exit="closed" className="lg:col-span-6 xl:col-span-5">
              {NAV.map((g, i) => {
                const current = g.href === "/" ? pathname === "/" : pathname.startsWith(g.href);
                return (
                  <motion.li key={g.href} variants={item} className="border-b border-line lg:border-0">
                    <div className="flex items-center justify-between">
                      <Link
                        href={g.href}
                        onClick={close}
                        onMouseEnter={() => setActive(i)}
                        onFocus={() => setActive(i)}
                        aria-current={current ? "page" : undefined}
                        className="group flex items-baseline gap-4 py-2.5 lg:py-[0.35vh]"
                      >
                        <span className="t-caption t-num w-6 text-fg-3">{String(i + 1).padStart(2, "0")}</span>
                        <span
                          className="t-display text-[clamp(2.6rem,11vw,4.2rem)] transition-[opacity,transform] duration-300 lg:translate-x-[var(--nx)] lg:text-[clamp(3.4rem,6.4vw,8.6rem)] lg:opacity-[var(--no)]"
                          style={
                            {
                              "--no": active === i || current ? 1 : 0.35,
                              "--nx": active === i ? "0.12em" : "0em",
                            } as React.CSSProperties
                          }
                        >
                          {g.label}
                        </span>
                      </Link>
                      {g.links.length > 0 && (
                        <button
                          type="button"
                          className="inline-flex h-11 w-11 items-center justify-center lg:hidden"
                          aria-expanded={expanded === i}
                          aria-label={`${g.label} sections`}
                          onClick={() => setExpanded(expanded === i ? null : i)}
                        >
                          <IconChevron className="transition-transform duration-300" style={{ transform: expanded === i ? "rotate(180deg)" : "none" }} />
                        </button>
                      )}
                    </div>
                    <AnimatePresence initial={false}>
                      {expanded === i && (
                        <motion.ul
                          className="overflow-hidden pl-10 lg:hidden"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.34, ease: [0.22, 0.61, 0.36, 1] }}
                        >
                          {g.links.map((l) => (
                            <li key={l.href}>
                              <Link href={l.href} onClick={close} className="block py-2 text-fg-2">
                                {l.label}
                              </Link>
                            </li>
                          ))}
                          <li className="h-3" />
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </motion.ul>

            {/* Secondary — desktop */}
            <motion.div
              className="hidden lg:col-span-2 lg:block xl:col-span-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.55, duration: 0.5 } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <AnimatePresence mode="wait">
                <motion.ul
                  key={active}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.24, ease: [0.22, 0.61, 0.36, 1] }}
                  className="space-y-3 pt-[1.6vw]"
                >
                  {group.links.length ? (
                    <>
                      <li className="t-caption mb-6 text-fg-3">{group.label}</li>
                      {group.links.map((l) => (
                        <li key={l.href}>
                          <Link href={l.href} onClick={close} className="u-link text-fg-2 transition-colors hover:text-fg">
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </>
                  ) : (
                    <li className="t-body max-w-[16em]">
                      {group.label === "Journal"
                        ? "Stories on light, material and the hour after sunset."
                        : group.label === "Contact"
                          ? "Showroom visits, lighting plans and trade enquiries."
                          : "Architectural lighting, designed for day and night."}
                    </li>
                  )}
                </motion.ul>
              </AnimatePresence>
            </motion.div>

            {/* Preview */}
            <motion.div
              className="relative hidden overflow-hidden bg-bg-2 lg:col-span-4 lg:block"
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1, transition: { delay: 0.45, duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={group.art}
                  className="menu-preview absolute inset-0"
                  initial={{ opacity: 0, y: -40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <LampArt art={group.art} finish={finishFor(group.art, group.finish)} cableTop={-400} className="absolute inset-x-[12%] top-0 h-[78%] w-[76%]" />
                </motion.div>
              </AnimatePresence>
              <p className="t-caption absolute bottom-5 left-6 text-fg-3">{group.label}</p>
            </motion.div>
          </div>

          {/* Utility */}
          <motion.div
            className="wrap flex shrink-0 flex-wrap items-center gap-x-6 gap-y-2 border-t border-line py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.7, duration: 0.5 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            <button type="button" onClick={() => open("search")} className="inline-flex h-11 items-center gap-2">
              <IconSearch size={18} /> <span className="t-caption">Search</span>
            </button>
            <button type="button" onClick={() => open("cart")} className="inline-flex h-11 items-center gap-2">
              <IconBag size={18} /> <span className="t-caption">Cart ({count})</span>
            </button>
            <DayNightToggle />
            <a href="mailto:studio@vesper.example" className="t-caption ml-auto hidden text-fg-3 sm:inline">
              studio@vesper.example
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
