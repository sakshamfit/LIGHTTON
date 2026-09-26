"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * One observer for the whole site: any element with `data-reveal` fades in once
 * when it reaches 85% of the viewport. Children of `data-reveal-stagger` get
 * 70ms stagger (capped at 8 per sequence).
 */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.01 },
    );
    const scan = (root: ParentNode) => {
      root.querySelectorAll<HTMLElement>("[data-reveal-stagger]").forEach((group) => {
        [...group.querySelectorAll<HTMLElement>(":scope > [data-reveal]")].forEach((el, i) => {
          el.style.setProperty("--reveal-delay", `${(i % 8) * 70}ms`);
        });
      });
      root.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
    };
    scan(document);
    const mo = new MutationObserver((muts) => {
      for (const m of muts) m.addedNodes.forEach((n) => n instanceof HTMLElement && scan(n.parentElement ?? n));
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);
  return null;
}
