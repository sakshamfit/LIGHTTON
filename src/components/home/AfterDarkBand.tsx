"use client";

import Link from "next/link";
import { useState } from "react";
import { useEnvironment } from "@/components/env/EnvironmentProvider";
import { LampArt } from "@/components/lamps/LampArt";
import { IconArrowLong } from "@/components/ui/Icons";
import { productBySlug } from "@/lib/products";

const LINE = [
  { slug: "arc-shade", drop: "34%" },
  { slug: "cloche-pendant", drop: "12%" },
  { slug: "ora-pendant", drop: "42%" },
  { slug: "cage-globe", drop: "20%" },
  { slug: "knot-pendant", drop: "4%" },
];

/**
 * A row of fixtures that can be switched on one by one (hover, focus or tap),
 * inviting the visitor into the full evening transition.
 */
export function AfterDarkBand() {
  const { mode, toggle } = useEnvironment();
  const [on, setOn] = useState<Record<string, boolean>>({});
  const [hover, setHover] = useState<string | null>(null);

  return (
    <section className="section relative overflow-hidden" aria-labelledby="after-dark">
      <div className="wrap grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4" data-reveal>
          <p className="t-caption text-fg-3">Day &amp; night</p>
          <h2 id="after-dark" className="t-h2 mt-3">
            Every fixture is designed twice.
          </h2>
          <p className="t-body mt-6 max-w-[26em]">
            Once for the daylight it hangs in, once for the evening it creates. Switch a lamp on — or let the whole room move
            from day to night.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <button type="button" onClick={toggle} className="btn btn-solid">
              {mode === "night" ? "Return to daylight" : "Let the evening arrive"}
            </button>
            <Link href="/journal/the-hour-after-sunset" className="u-link t-caption inline-flex items-center gap-3">
              Read the story <IconArrowLong size={16} />
            </Link>
          </div>
        </div>

        <ul className="relative grid h-[clamp(360px,42vw,900px)] grid-cols-5 gap-[2vw] lg:col-span-8" data-reveal="fade">
          {LINE.map(({ slug, drop }) => {
            const p = productBySlug(slug)!;
            const lit = on[slug] || hover === slug;
            return (
              <li key={slug} className="relative h-full">
                <button
                  type="button"
                  aria-pressed={!!on[slug]}
                  aria-label={`${on[slug] ? "Switch off" : "Switch on"} ${p.name}`}
                  onClick={() => setOn((s) => ({ ...s, [slug]: !s[slug] }))}
                  onMouseEnter={() => setHover(slug)}
                  onMouseLeave={() => setHover(null)}
                  className="switch-lamp absolute inset-0 w-full"
                  style={{
                    ["--lamp" as string]: `max(var(--lamp-g), ${lit ? 1 : 0})`,
                    ["--ambient" as string]: `max(var(--ambient-g), ${lit ? 0.7 : 0})`,
                  }}
                >
                  <span className="absolute inset-x-[-30%] bottom-[10%]" style={{ top: drop }}>
                    <LampArt art={p.art} finish={p.finishes[0]} cableTop={-3000} className="absolute inset-0 h-full w-full" />
                  </span>
                  <span className="t-caption absolute bottom-0 left-0 text-fg-3">{p.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
