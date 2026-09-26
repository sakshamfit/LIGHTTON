"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { createStore, hydratedStore, readStorage, writeStorage } from "@/lib/store";
import { productBySlug } from "@/lib/products";
import type { CartLine, Finish, Product, SizeOption } from "@/lib/types";

const KEY = "vesper.cart.v1";

export interface ResolvedLine extends CartLine {
  product: Product;
  finishDef: Finish;
  sizeDef: SizeOption;
  unit: number;
  total: number;
}

interface CartContext {
  lines: ResolvedLine[];
  count: number;
  subtotal: number;
  ready: boolean;
  add: (slug: string, finish: string, size: string, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const Ctx = createContext<CartContext | null>(null);

export const useCart = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart outside provider");
  return v;
};

export const lineKey = (slug: string, finish: string, size: string) => `${slug}|${finish}|${size}`;

function resolve(l: CartLine): ResolvedLine | null {
  const product = productBySlug(l.slug);
  if (!product) return null;
  const finishDef = product.finishes.find((f) => f.id === l.finish);
  const sizeDef = product.sizes.find((s) => s.id === l.size);
  if (!finishDef || !sizeDef) return null;
  return { ...l, product, finishDef, sizeDef, unit: sizeDef.price, total: sizeDef.price * l.qty };
}

export const MAX_QTY = 20;

const EMPTY: CartLine[] = [];

function loadCart(): CartLine[] {
  try {
    const saved = JSON.parse(readStorage(KEY) || "[]") as CartLine[];
    return Array.isArray(saved) ? saved.filter((l) => resolve(l)) : [];
  } catch {
    return [];
  }
}

const cartStore = createStore<CartLine[]>(loadCart);
const setRaw = (next: CartLine[] | ((prev: CartLine[]) => CartLine[])) => {
  cartStore.set(next);
  writeStorage(KEY, JSON.stringify(cartStore.get()));
};

export function CartProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(cartStore.subscribe, cartStore.get, () => EMPTY);
  const ready = useSyncExternalStore(hydratedStore.subscribe, hydratedStore.get, hydratedStore.server);

  // Keep tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => e.key === KEY && cartStore.set(loadCart());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const add = useCallback((slug: string, finish: string, size: string, qty = 1) => {
    const key = lineKey(slug, finish, size);
    setRaw((prev) => {
      const hit = prev.find((l) => l.key === key);
      if (hit) return prev.map((l) => (l.key === key ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l));
      return [...prev, { key, slug, finish, size, qty: Math.min(MAX_QTY, qty) }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setRaw((prev) =>
      qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)),
    );
  }, []);

  const remove = useCallback((key: string) => setRaw((prev) => prev.filter((l) => l.key !== key)), []);
  const clear = useCallback(() => setRaw([]), []);

  const value = useMemo(() => {
    const lines = raw.map(resolve).filter((l): l is ResolvedLine => !!l);
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.total, 0),
      ready,
      add,
      setQty,
      remove,
      clear,
    };
  }, [raw, ready, add, setQty, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
