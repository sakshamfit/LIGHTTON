"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createStore, readStorage, writeStorage } from "@/lib/store";
import { STORAGE_KEY, TIMELINE, phaseAt, tokensAt, type PhaseName } from "@/lib/environment";

export type Mode = "day" | "night";

interface EnvContext {
  /** The mode the environment is heading toward (or resting in). */
  mode: Mode;
  /** Human name of the current atmospheric phase. */
  phase: PhaseName;
  transitioning: boolean;
  toggle: () => void;
  setMode: (m: Mode) => void;
}

const Ctx = createContext<EnvContext | null>(null);

export const useEnvironment = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useEnvironment outside provider");
  return v;
};

const clamp = (n: number) => Math.min(1, Math.max(0, n));
const easeSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

interface Channel {
  from: number;
  to: number;
  delay: number;
  dur: number;
  ease: (t: number) => number;
}

const modeStore = createStore<Mode>(() => (readStorage(STORAGE_KEY) === "night" ? "night" : "day"));

export function EnvironmentProvider({ children }: { children: ReactNode }) {
  const mode = useSyncExternalStore(modeStore.subscribe, modeStore.get, () => "day" as Mode);
  const [phase, setPhase] = useState<PhaseName>("Day");
  const [transitioning, setTransitioning] = useState(false);

  const cur = useRef({ env: 0, lamp: 0, ambient: 0 });
  const raf = useRef(0);
  const phaseRef = useRef<PhaseName>("Day");

  const apply = useCallback((env: number, lamp: number, ambient: number) => {
    cur.current = { env, lamp, ambient };
    const root = document.documentElement;
    const s = root.style;
    const t = tokensAt(env);
    for (const k in t) s.setProperty(`--${k}`, t[k as keyof typeof t]);
    s.setProperty("--env", env.toFixed(4));
    s.setProperty("--lamp-g", lamp.toFixed(4));
    s.setProperty("--ambient-g", ambient.toFixed(4));
    s.colorScheme = env > 0.6 ? "dark" : "light";
    // While the environment has reached night but the bulbs are still warming, name the ignition phase.
    const p: PhaseName = env > 0.995 && lamp < 0.97 && root.dataset.transition === "night" ? "Lamps on" : phaseAt(env);
    if (p !== phaseRef.current) {
      phaseRef.current = p;
      setPhase(p);
    }
  }, []);

  // Sync the DOM with the persisted mode (already painted pre-hydration by the head script).
  useEffect(() => {
    const night = modeStore.get() === "night";
    apply(night ? 1 : 0, night ? 1 : 0, night ? 1 : 0);
    document.documentElement.dataset.mode = night ? "night" : "day";
    return () => cancelAnimationFrame(raf.current);
  }, [apply]);

  const run = useCallback(
    (target: Mode) => {
      cancelAnimationFrame(raf.current);
      const { env: e0, lamp: l0, ambient: a0 } = cur.current;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const k = window.innerWidth < 768 ? TIMELINE.mobileScale : 1;

      let channels: { env: Channel; lamp: Channel; ambient: Channel };
      if (reduce) {
        const d = TIMELINE.reducedMotion;
        const to = target === "night" ? 1 : 0;
        channels = {
          env: { from: e0, to, delay: 0, dur: d, ease: easeSine },
          lamp: { from: l0, to, delay: 0, dur: d, ease: easeSine },
          ambient: { from: a0, to, delay: 0, dur: d, ease: easeSine },
        };
      } else if (target === "night") {
        const f = TIMELINE.forward;
        const remain = 1 - e0; // resume gracefully if interrupted mid-way
        channels = {
          env: { from: e0, to: 1, delay: 0, dur: f.env[1] * Math.max(remain, 0.15) * k, ease: easeSine },
          lamp: { from: l0, to: 1, delay: f.lamp[0] * remain * k, dur: f.lamp[1] * (1 - l0 * 0.8) * k, ease: easeSine },
          ambient: { from: a0, to: 1, delay: f.ambient[0] * remain * k, dur: f.ambient[1] * (1 - a0 * 0.8) * k, ease: easeOut },
        };
      } else {
        const r = TIMELINE.reverse;
        channels = {
          lamp: { from: l0, to: 0, delay: 0, dur: r.lamp[1] * Math.max(l0, 0.2) * k, ease: easeSine },
          ambient: { from: a0, to: 0, delay: 0, dur: r.ambient[1] * Math.max(a0, 0.2) * k, ease: easeSine },
          env: { from: e0, to: 0, delay: r.env[0] * l0 * k, dur: r.env[1] * Math.max(e0, 0.15) * k, ease: easeSine },
        };
      }

      const root = document.documentElement;
      root.dataset.transition = target;
      setTransitioning(true);
      const start = performance.now();
      const val = (c: Channel, now: number) => {
        const t = clamp((now - start - c.delay) / Math.max(c.dur, 1));
        return c.from + (c.to - c.from) * c.ease(t);
      };
      const end = Math.max(...Object.values(channels).map((c) => c.delay + c.dur));

      const tick = (now: number) => {
        apply(val(channels.env, now), val(channels.lamp, now), val(channels.ambient, now));
        if (now - start < end) {
          raf.current = requestAnimationFrame(tick);
        } else {
          apply(channels.env.to, channels.lamp.to, channels.ambient.to);
          root.dataset.mode = target;
          delete root.dataset.transition;
          setTransitioning(false);
        }
      };
      raf.current = requestAnimationFrame(tick);
    },
    [apply],
  );

  const setMode = useCallback(
    (m: Mode) => {
      modeStore.set(m);
      writeStorage(STORAGE_KEY, m);
      run(m);
    },
    [run],
  );

  const toggle = useCallback(() => setMode(mode === "day" ? "night" : "day"), [mode, setMode]);

  const value = useMemo(() => ({ mode, phase, transitioning, toggle, setMode }), [mode, phase, transitioning, toggle, setMode]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
