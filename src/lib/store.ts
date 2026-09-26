/**
 * Minimal external store for browser-persisted state, consumed with
 * `useSyncExternalStore`. The server (and hydration pass) sees a fixed server
 * snapshot; the client reads the real value right after — no mismatch, no
 * setState-in-effect.
 */
export function createStore<T>(init: () => T) {
  let value: T;
  let loaded = false;
  const listeners = new Set<() => void>();
  const get = () => {
    if (!loaded) {
      value = init();
      loaded = true;
    }
    return value;
  };
  const set = (next: T | ((prev: T) => T)) => {
    value = typeof next === "function" ? (next as (p: T) => T)(get()) : next;
    loaded = true;
    listeners.forEach((l) => l());
  };
  const subscribe = (l: () => void) => {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  };
  return { get, set, subscribe };
}

const noop = () => () => {};
/** `true` once rendering on the client after hydration. */
export const hydratedStore = { subscribe: noop, get: () => true, server: () => false };

export function readStorage(key: string, storage: "local" | "session" = "local"): string | null {
  try {
    return (storage === "local" ? localStorage : sessionStorage).getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string, storage: "local" | "session" = "local") {
  try {
    (storage === "local" ? localStorage : sessionStorage).setItem(key, value);
  } catch {}
}
