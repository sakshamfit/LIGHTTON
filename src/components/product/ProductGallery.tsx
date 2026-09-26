"use client";

import { AnimatePresence, motion } from "motion/react";
import { ViewTransition } from "react";
import { ART_META, LampArt } from "@/components/lamps/LampArt";
import { IconArrowLeft, IconArrowRight } from "@/components/ui/Icons";
import type { Finish, Product } from "@/lib/types";

export const VIEWS = [
  { id: "studio", label: "Studio" },
  { id: "lit", label: "After dark" },
  { id: "detail", label: "Detail" },
  { id: "situ", label: "In situ" },
] as const;
export type ViewId = (typeof VIEWS)[number]["id"];

/** Fixture framed for the product page. Pendants hang from the very top edge. */
function Fixture({ product, finish, zoom = 1 }: { product: Product; finish: Finish; zoom?: number }) {
  const { mount, light } = ART_META[product.art];
  const [w, h] = ART_META[product.art].vb;
  const ceiling = mount === "ceiling";
  // Zoom around the light source for the detail crop.
  const origin = `${(light[0] / w) * 100}% ${(light[1] / h) * 100 - 20}%`;
  return (
    <div
      className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-soft)]"
      style={{ transform: `scale(${zoom})`, transformOrigin: origin }}
    >
      <LampArt
        art={product.art}
        finish={finish}
        cableTop={ceiling ? -2000 : 0}
        className="absolute"
        style={
          ceiling
            ? { left: "4%", width: "92%", top: 0, height: "96%" }
            : mount === "wall"
              ? { left: "4%", width: "92%", top: "8%", height: "80%" }
              : { left: "4%", width: "92%", bottom: "6%", height: "86%" }
        }
        title={`${product.name} in ${finish.name}`}
      />
    </div>
  );
}

function Situ({ product, finish }: { product: Product; finish: Finish }) {
  const mount = ART_META[product.art].mount;
  return (
    <div className="absolute inset-0 overflow-hidden bg-bg-2">
      {/* floor */}
      <div className="absolute inset-x-0 bottom-0 h-[20%]" style={{ background: "color-mix(in srgb, var(--bg-2) 82%, var(--fg))" }} />
      {mount === "ceiling" && (
        <>
          <div className="absolute left-[18%] right-[18%] top-[64%] h-[1.6%] bg-inv" />
          <div className="absolute left-[22%] top-[65.6%] h-[14.4%] w-[1.2%] bg-inv" />
          <div className="absolute right-[22%] top-[65.6%] h-[14.4%] w-[1.2%] bg-inv" />
          <LampArt art={product.art} finish={finish} cableTop={-2000} className="absolute left-[27%] top-0 h-[62%] w-[46%]" align="xMidYMax meet" />
        </>
      )}
      {(mount === "table" || mount === "wall") && (
        <>
          <div className="absolute left-[14%] right-[14%] top-[62%] h-[18%] bg-inv" />
          <LampArt
            art={product.art}
            finish={finish}
            className={mount === "table" ? "absolute left-[30%] top-[22%] h-[40%] w-[40%]" : "absolute left-[26%] top-[12%] h-[38%] w-[48%]"}
            align={mount === "table" ? "xMidYMax meet" : undefined}
          />
        </>
      )}
      {(mount === "floor" || mount === "ground") && (
        <>
          <div className="absolute bottom-[20%] left-[8%] h-[24%] w-[34%] rounded-t-[40%] bg-inv opacity-90" />
          <LampArt art={product.art} finish={finish} className="absolute bottom-[19%] right-[14%] h-[70%] w-[44%]" align="xMidYMax meet" />
        </>
      )}
    </div>
  );
}

export function ProductGallery({
  product,
  finish,
  view,
  setView,
}: {
  product: Product;
  finish: Finish;
  view: ViewId;
  setView: (v: ViewId) => void;
}) {
  const i = VIEWS.findIndex((v) => v.id === view);
  const step = (d: number) => setView(VIEWS[(i + d + VIEWS.length) % VIEWS.length].id);

  return (
    <div className="relative h-full w-full">
      <ViewTransition name={`product-${product.slug}`} share="morph" default="none">
        <motion.div
          className="relative h-full w-full overflow-hidden"
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={view}
              className={`absolute inset-0 ${view === "lit" ? "lit" : ""}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
              style={view === "lit" ? { background: "radial-gradient(120% 90% at 50% 40%, #1c1b1a 0%, #111112 70%)" } : undefined}
            >
              {view === "situ" ? (
                <Situ product={product} finish={finish} />
              ) : (
                <Fixture product={product} finish={finish} zoom={view === "detail" ? 1.6 : 1} />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </ViewTransition>

      {/* Reference B: black control block, bottom-left */}
      <div className="absolute bottom-0 left-0 z-10 flex items-stretch">
        <div className="flex bg-inv text-inv-fg">
          <button type="button" onClick={() => step(-1)} className="inline-flex h-14 w-14 items-center justify-center transition-opacity hover:opacity-70 md:h-[clamp(56px,5vw,96px)] md:w-[clamp(64px,6vw,120px)]" aria-label="Previous view">
            <IconArrowLeft />
          </button>
          <button type="button" onClick={() => step(1)} className="inline-flex h-14 w-14 items-center justify-center transition-opacity hover:opacity-70 md:h-[clamp(56px,5vw,96px)] md:w-[clamp(64px,6vw,120px)]" aria-label="Next view">
            <IconArrowRight />
          </button>
        </div>
        <div className="flex items-center gap-3 pl-4 transition-colors duration-500" role="tablist" aria-label="Product views" style={view === "lit" ? { ["--fg" as string]: "#f4ede2", ["--fg-3" as string]: "#8f877c" } : undefined}>
          {VIEWS.map((v, k) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={v.id === view}
              onClick={() => setView(v.id)}
              className={`t-caption h-10 transition-colors ${v.id === view ? "text-fg" : "hidden text-fg-3 hover:text-fg sm:inline"}`}
            >
              <span className="t-num mr-1.5 opacity-60">{String(k + 1).padStart(2, "0")}</span>
              {v.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
