"use client";

import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

type Panel = "menu" | "search" | "cart" | null;

export interface Toast {
  id: number;
  title: string;
  body?: string;
  action?: { label: string; onClick: () => void };
}

interface UIContext {
  panel: Panel;
  open: (p: Exclude<Panel, null>) => void;
  close: () => void;
  toasts: Toast[];
  notify: (t: Omit<Toast, "id">) => void;
  dismiss: (id: number) => void;
}

const Ctx = createContext<UIContext | null>(null);

export const useUI = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useUI outside provider");
  return v;
};

export function UIProvider({ children }: { children: ReactNode }) {
  const [panel, setPanel] = useState<Panel>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seq = useRef(0);
  const pathname = usePathname();

  const open = useCallback((p: Exclude<Panel, null>) => setPanel(p), []);
  const close = useCallback(() => setPanel(null), []);

  // Any route change closes overlays (derived during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setPanel(null);
  }

  // Lock page scroll while an overlay is open.
  useEffect(() => {
    const el = document.documentElement;
    if (panel) {
      const w = window.innerWidth - el.clientWidth;
      el.style.overflow = "hidden";
      el.style.paddingRight = w > 0 ? `${w}px` : "";
    } else {
      el.style.overflow = "";
      el.style.paddingRight = "";
    }
  }, [panel]);

  // Global shortcuts: "/" opens search, Escape closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanel(null);
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(tag)) {
        e.preventDefault();
        setPanel("search");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const notify = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = ++seq.current;
      setToasts((prev) => [...prev.slice(-2), { ...t, id }]);
      window.setTimeout(() => dismiss(id), 4200);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ panel, open, close, toasts, notify, dismiss }), [panel, open, close, toasts, notify, dismiss]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
