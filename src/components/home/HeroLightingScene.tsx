"use client";

import { animate, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createStore, readStorage, writeStorage } from "@/lib/store";
import { useEnvironment } from "@/components/env/EnvironmentProvider";
import { LampArt } from "@/components/lamps/LampArt";
import { IconArrowLong } from "@/components/ui/Icons";
import { productBySlug } from "@/lib/products";

/**
 * Signature entrance (spec §08):
 *   01 background   700ms  @0
 *   02 typography   650ms  @180   fade + y12→0
 *   03 cable        enters from above with the fixture (attached)
 *   04 lamp drop   1350ms  @350   slow deceleration, minimal overshoot
 *   05 settle       450ms  @1700  tiny pendulum settle around the ceiling point
 *   06 bulb        1200ms  @2050  opacity + halo
 *   07 ambient     1600ms  @2200  radial spread into the room
 */

type Unit = {
  slug: string;
  finish: number;
  className: string;
  delay: number;
  drop: number;
};

// Positions are expressed per breakpoint; the wrapper spans from the ceiling (hero top) to the fixture.
const UNITS: Unit[] = [
  {
    slug: "cone-glass-pendant",
    finish: 0,
    delay: 0.5,
    drop: 1.25,
    className: "left-[2%] w-[38vw] h-[40%] md:left-[13%] md:w-[20vw] md:h-[50%] xl:left-[15.5%] xl:w-[18vw]",
  },
  {
    slug: "vessel-pendant",
    finish: 0,
    delay: 0.35,
    drop: 1.35,
    className: "left-[26%] w-[52vw] h-[60%] md:left-[26%] md:w-[29vw] md:h-[76%] xl:left-[28%] xl:w-[27vw] z-[2]",
  },
  {
    slug: "cloche-pendant",
    finish: 0,
    delay: 0.62,
    drop: 1.2,
    className: "left-[62%] w-[36vw] h-[33%] md:left-[45%] md:w-[18vw] md:h-[42%] xl:left-[46%] xl:w-[16.5vw]",
  },
];

// First read marks the hero as seen for the rest of the session.
const heroSeen = createStore<boolean | null>(() => {
  const seen = !!readStorage("vesper.hero", "session");
  writeStorage("vesper.hero", "1", "session");
  return seen;
});

export function HeroLightingScene() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { mode, toggle } = useEnvironment();
  // Full choreography on the first visit of a session; a calm, shorter entrance afterwards.
  // Read through an external store so server and client markup stay identical.
  const seen = useSyncExternalStore(heroSeen.subscribe, heroSeen.get, () => null);
  const phase: "pending" | "full" | "quick" = seen === null ? "pending" : seen || reduce ? "quick" : "full";
  const play = phase === "full";

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const lampsY = useTransform(scrollYProgress, [0, 1], [0, -18]);
  const markY = useTransform(scrollYProgress, [0, 1], [0, 14]);

  useEffect(() => {
    const el = ref.current;
    if (!el || phase === "pending") return;
    const set = (k: string) => (v: number) => el.style.setProperty(k, v.toFixed(3));
    const bulbDelay = play ? 2.05 : 0.5;
    const ambDelay = play ? 2.2 : 0.6;
    const a = animate(0, 1, { duration: 1.2, delay: bulbDelay, ease: [0.37, 0, 0.63, 1], onUpdate: set("--hero-lamp") });
    const b = animate(0, 1, { duration: 1.6, delay: ambDelay, ease: [0.22, 0.61, 0.36, 1], onUpdate: set("--hero-amb") });
    return () => {
      a.stop();
      b.stop();
    };
  }, [phase, play]);

  const fade = (delay: number, y = 12) => ({
    initial: { opacity: 0, y },
    animate:
      phase === "pending"
        ? undefined
        : { opacity: 1, y: 0, transition: { duration: play ? 0.65 : 0.5, delay: play ? delay : delay * 0.4, ease: [0.22, 0.61, 0.36, 1] as const } },
  });

  return (
    <motion.section
      ref={ref}
      className="hero-scene relative isolate h-[max(640px,100svh)] overflow-hidden bg-bg-2"
      aria-labelledby="hero-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.7 } }}
    >
      {/* Watermark */}
      <motion.div
        aria-hidden
        style={{ y: markY }}
        className="pointer-events-none absolute inset-x-0 top-[49%] -translate-y-1/2 select-none md:top-[45%]"
      >
        <motion.p
          {...fade(0.1, 0)}
          className="t-display whitespace-nowrap text-center text-[34vw] leading-none md:text-[25vw]"
          style={{ color: "var(--watermark)" }}
        >
          Vesper Vesper
        </motion.p>
      </motion.div>

      {/* Suspended fixtures */}
      <motion.div className="absolute inset-0" style={{ y: lampsY }}>
        {UNITS.map((u, i) => {
          const p = productBySlug(u.slug)!;
          return (
            <motion.div
              key={u.slug}
              className={`absolute top-0 ${u.className}`}
              style={{ transformOrigin: "50% 0%" }}
              initial={{ y: "-110%", rotate: 0 }}
              animate={
                phase === "pending"
                  ? undefined
                  : play
                    ? {
                        y: ["-110%", "0.9%", "0%"],
                        rotate: [0, 0, 0.55, -0.3, 0.12, 0],
                        transition: {
                          y: {
                            duration: u.drop + 0.45,
                            delay: u.delay,
                            times: [0, u.drop / (u.drop + 0.45), 1],
                            ease: [
                              [0.2, 0.75, 0.3, 1],
                              [0.45, 0, 0.55, 1],
                            ],
                          },
                          rotate: { duration: u.drop + 0.6, delay: u.delay, times: [0, 0.7, 0.78, 0.87, 0.94, 1], ease: "easeInOut" },
                        },
                      }
                    : { y: "0%", transition: { duration: reduce ? 0 : 0.9, delay: reduce ? 0 : i * 0.08, ease: [0.16, 1, 0.3, 1] } }
              }
            >
              <div className="hero-sway h-full w-full" style={{ animationDelay: `${3 + i * 1.3}s` }}>
                <LampArt
                  art={p.art}
                  finish={p.finishes[u.finish]}
                  cableTop={-2400}
                  align="xMidYMax meet"
                  className="absolute inset-x-0 bottom-0 h-auto w-full"
                  title={`${p.name} pendant`}
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Wordmark + intro */}
      <div className="wrap pointer-events-none relative z-[3] flex h-full flex-col justify-end pb-[max(9vh,56px)] md:justify-center md:pb-0">
        <div className="pointer-events-auto md:ml-[53%] md:mt-[6vh] xl:ml-[57%]">
          <motion.h1 id="hero-title" {...fade(0.18)} className="t-display text-[clamp(4.2rem,17vw,6rem)] md:text-[clamp(5rem,8.4vw,13rem)]">
            Vesper
          </motion.h1>
          <motion.p {...fade(0.3)} className="t-caption mt-3 text-fg-2 md:mt-4">
            Architectural Light · Collection 2026
          </motion.p>
          <motion.p {...fade(0.42)} className="t-lead mt-6 max-w-[24em] text-fg-2 md:mt-8">
            Objects of light for quiet architecture — calm by day, generous after dark.
          </motion.p>
          <motion.div {...fade(0.54)} className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 md:mt-9">
            <Link href="/shop" className="btn btn-solid">
              Shop the collection
            </Link>
            <button type="button" onClick={toggle} className="u-link t-caption inline-flex h-12 items-center gap-3">
              {mode === "night" ? "Return to daylight" : "See it after dark"} <IconArrowLong size={16} />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Footnotes */}
      <motion.div {...fade(0.9, 0)} className="wrap pointer-events-none absolute inset-x-0 bottom-6 z-[3] hidden items-end justify-between md:flex">
        <Link href="/collections/nocturne" className="pointer-events-auto t-caption u-link text-fg-2">
          New — Nocturne collection
        </Link>
        <span className="t-caption flex items-center gap-3 text-fg-3" aria-hidden>
          <span className="hero-scroll relative block h-10 w-px overflow-hidden bg-line">
            <span className="absolute inset-x-0 top-0 h-1/2 bg-fg" />
          </span>
          Scroll
        </span>
      </motion.div>
    </motion.section>
  );
}
