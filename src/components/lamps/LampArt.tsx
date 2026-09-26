import { useId, type CSSProperties, type ReactNode } from "react";
import type { ArtKey, Finish } from "@/lib/types";
import { BODY, resolveFinish, type GlassDef, type Resolved } from "./materials";

/**
 * Vector product renders.
 *
 * Every fixture is drawn as resolution-independent SVG with physically shaded
 * material gradients, so it stays razor sharp from a 360px phone to a 4K panel.
 * Illumination is layered in three channels driven by CSS custom properties:
 *   .l-on   — source / bulb / lit interior       (var(--lamp))
 *   .l-amb  — light spilled into the environment  (var(--ambient))
 *   .l-grow — ambient radius expansion
 */

export type Mount = "ceiling" | "table" | "floor" | "wall" | "ground";

export const ART_META: Record<ArtKey, { vb: [number, number]; mount: Mount; light: [number, number] }> = {
  ora: { vb: [400, 520], mount: "ceiling", light: [200, 350] },
  vessel: { vb: [400, 520], mount: "ceiling", light: [200, 356] },
  cloche: { vb: [400, 520], mount: "ceiling", light: [200, 200] },
  arc: { vb: [400, 520], mount: "ceiling", light: [200, 320] },
  cage: { vb: [400, 520], mount: "ceiling", light: [200, 300] },
  lantern: { vb: [400, 520], mount: "ceiling", light: [200, 262] },
  knot: { vb: [400, 520], mount: "ceiling", light: [200, 392] },
  cone: { vb: [400, 520], mount: "ceiling", light: [200, 250] },
  globe: { vb: [400, 520], mount: "ceiling", light: [200, 366] },
  teardrop: { vb: [400, 520], mount: "ceiling", light: [200, 350] },
  halo: { vb: [400, 520], mount: "ceiling", light: [200, 300] },
  disc: { vb: [400, 440], mount: "ceiling", light: [200, 90] },
  cap: { vb: [400, 520], mount: "table", light: [200, 306] },
  orb: { vb: [400, 520], mount: "table", light: [200, 360] },
  stem: { vb: [400, 760], mount: "floor", light: [164, 240] },
  tripod: { vb: [400, 760], mount: "floor", light: [200, 240] },
  swing: { vb: [400, 520], mount: "wall", light: [263, 292] },
  globewall: { vb: [400, 520], mount: "wall", light: [238, 260] },
  bollard: { vb: [400, 520], mount: "ground", light: [200, 212] },
  harbour: { vb: [400, 520], mount: "wall", light: [200, 250] },
};

interface Ctx {
  u: string;
  f: Resolved;
  cableTop: number;
}

const url = (u: string, k: string) => `url(#${u}${k})`;
const OFFS = [0, 0.2, 0.45, 0.8, 1];

function Ramp({ id, stops, vertical }: { id: string; stops: string[]; vertical?: boolean }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2={vertical ? 0 : 1} y2={vertical ? 1 : 0}>
      {stops.map((c, i) => (
        <stop key={i} offset={OFFS[i]} stopColor={c} />
      ))}
    </linearGradient>
  );
}

function Defs({ u, f }: { u: string; f: Resolved }) {
  const g = f.glass;
  return (
    <defs>
      <Ramp id={`${u}b`} stops={f.body} />
      <Ramp id={`${u}t`} stops={f.trim} />
      <Ramp id={`${u}cap`} stops={BODY.brass} />
      <linearGradient id={`${u}g`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor={g.edge} />
        <stop offset="0.16" stopColor={g.fill} />
        <stop offset="0.5" stopColor={g.fill} stopOpacity="0.7" />
        <stop offset="0.84" stopColor={g.fill} />
        <stop offset="1" stopColor={g.edge} />
      </linearGradient>
      <radialGradient id={`${u}warm`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#fffaf0" />
        <stop offset="0.35" stopColor="#ffe2a8" />
        <stop offset="0.75" stopColor="#ffb866" stopOpacity="0.85" />
        <stop offset="1" stopColor="#ff9a40" stopOpacity="0.6" />
      </radialGradient>
      <radialGradient id={`${u}halo`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#fff1d6" stopOpacity="0.95" />
        <stop offset="0.18" stopColor="#ffd9a0" stopOpacity="0.6" />
        <stop offset="0.45" stopColor="#ffb870" stopOpacity="0.2" />
        <stop offset="1" stopColor="#ff9f50" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${u}amb`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0.000" stopColor="#ffbd78" stopOpacity="0.4200" />
        <stop offset="0.083" stopColor="#ffbd78" stopOpacity="0.3468" />
        <stop offset="0.167" stopColor="#ffbd78" stopOpacity="0.2812" />
        <stop offset="0.250" stopColor="#ffbd78" stopOpacity="0.2230" />
        <stop offset="0.333" stopColor="#ffbd78" stopOpacity="0.1721" />
        <stop offset="0.417" stopColor="#ffbd78" stopOpacity="0.1283" />
        <stop offset="0.500" stopColor="#ffbd78" stopOpacity="0.0914" />
        <stop offset="0.583" stopColor="#ffbd78" stopOpacity="0.0612" />
        <stop offset="0.667" stopColor="#ffbd78" stopOpacity="0.0375" />
        <stop offset="0.750" stopColor="#ffbd78" stopOpacity="0.0199" />
        <stop offset="0.833" stopColor="#ffbd78" stopOpacity="0.0082" />
        <stop offset="0.917" stopColor="#ffbd78" stopOpacity="0.0018" />
        <stop offset="1.000" stopColor="#ffbd78" stopOpacity="0.0000" />
      </radialGradient>
      <linearGradient id={`${u}cone`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#ffd9a6" stopOpacity="0.34" />
        <stop offset="0.5" stopColor="#ffc486" stopOpacity="0.1" />
        <stop offset="1" stopColor="#ffb870" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={`${u}coneUp`} x1="0" x2="0" y1="1" y2="0">
        <stop offset="0" stopColor="#ffd9a6" stopOpacity="0.3" />
        <stop offset="1" stopColor="#ffb870" stopOpacity="0" />
      </linearGradient>
      <radialGradient id={`${u}opal`} cx="0.38" cy="0.34" r="0.78">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.45" stopColor="#f2f3f4" />
        <stop offset="0.82" stopColor="#d5d9dd" />
        <stop offset="1" stopColor="#bfc4c9" />
      </radialGradient>
      <radialGradient id={`${u}opalLit`} cx="0.45" cy="0.42" r="0.72">
        <stop offset="0" stopColor="#fffdf7" />
        <stop offset="0.45" stopColor="#ffeccb" />
        <stop offset="0.82" stopColor="#ffcd8a" />
        <stop offset="1" stopColor="#f1a95a" />
      </radialGradient>
      <radialGradient id={`${u}shadow`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#000" stopOpacity="0.26" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

/* ─── shared parts ─────────────────────────────────────────── */

function Cable({ c, y2, x = 200, w = 1.7, color }: { c: Ctx; y2: number; x?: number; w?: number; color?: string }) {
  return <line x1={x} x2={x} y1={c.cableTop} y2={y2} strokeWidth={w} style={{ stroke: color ?? "var(--cable)" }} />;
}

function Ambient({ u, cx, cy, r = 330 }: { u: string; cx: number; cy: number; r?: number }) {
  return <circle className="l-amb l-grow" cx={cx} cy={cy} r={r} fill={url(u, "amb")} />;
}

function Halo({ u, cx, cy, rx, ry }: { u: string; cx: number; cy: number; rx: number; ry?: number }) {
  return <ellipse className="l-on" cx={cx} cy={cy} rx={rx} ry={ry ?? rx} fill={url(u, "halo")} />;
}

/**
 * Soft light pool: an elliptical radial falloff anchored at the opening.
 * No hard edges — reads as light in air rather than a drawn triangle.
 */
function Beam({ u, id, cx, cy, w, h, up }: { u: string; id: string; cx: number; cy: number; w: number; h: number; up?: boolean }) {
  const gid = `${u}beam${id}`;
  const sx = w / h;
  return (
    <>
      <defs>
        <radialGradient
          id={gid}
          gradientUnits="userSpaceOnUse"
          cx={cx}
          cy={cy}
          r={h}
          gradientTransform={`translate(${cx} ${cy}) scale(${sx} 1) translate(${-cx} ${-cy})`}
        >
          <stop offset="0" stopColor="#ffdcaa" stopOpacity="0.46" />
          <stop offset="0.22" stopColor="#ffcf94" stopOpacity="0.24" />
          <stop offset="0.55" stopColor="#ffc07a" stopOpacity="0.08" />
          <stop offset="1" stopColor="#ffb870" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${gid}f`} x1="0" x2="0" y1={up ? 1 : 0} y2={up ? 0 : 1}>
          <stop offset="0" stopColor="#000" />
          <stop offset="0.14" stopColor="#fff" />
        </linearGradient>
        <mask id={`${gid}m`} maskContentUnits="objectBoundingBox">
          <rect width="1" height="1" fill={`url(#${gid}f)`} />
        </mask>
      </defs>
      <rect
        className="l-amb"
        x={cx - w}
        y={up ? cy - h : cy}
        width={w * 2}
        height={h}
        fill={`url(#${gid})`}
        mask={`url(#${gid}m)`}
      />
    </>
  );
}

/** Warm rim light on dark bodies — only visible once the room is lit, keeps silhouettes legible at night. */
function Rim({ d }: { d: string }) {
  return <path d={d} className="l-amb" fill="none" stroke="#ffcf9a" strokeOpacity={0.28} strokeWidth={1.3} />;
}

const SHAPES = {
  st: "M-8 18 C-8 34 -30 44 -30 70 C-30 94 -16 108 0 108 C16 108 30 94 30 70 C30 44 8 34 8 18 Z",
  globe: "M-8 18 L-8 30 A38 38 0 1 0 8 30 L8 18 Z",
  a60: "M-7 16 C-7 26 -22 32 -22 50 C-22 64 -12 72 0 72 C12 72 22 64 22 50 C22 32 7 26 7 16 Z",
};
const FILAMENT = {
  st: { supports: "M-3 18 L-9 58 M3 18 L9 58", wire: "M-9 58 C-12 80 -3 86 0 72 C3 86 12 80 9 58", c: 66, halo: 96 },
  globe: {
    supports: "M-3 18 L-10 62 M3 18 L10 62",
    wire: "M-10 62 c2.5 -7 5 7 7.5 0 c2.5 -7 5 7 7.5 0 c2.5 -7 5 7 5 0",
    c: 66,
    halo: 110,
  },
  a60: { supports: "M-3 16 L-7 42 M3 16 L7 42", wire: "M-7 42 C-7 50 -2 50 0 44 C2 50 7 50 7 42", c: 46, halo: 80 },
};

function Bulb({
  u,
  x,
  y,
  s = 1,
  kind = "st",
  up = false,
  glass,
}: {
  u: string;
  x: number;
  y: number;
  s?: number;
  kind?: keyof typeof SHAPES;
  up?: boolean;
  glass?: GlassDef;
}) {
  const fl = FILAMENT[kind];
  const gFill = glass?.fill ?? "rgba(255,255,255,0.2)";
  const gStroke = glass?.stroke ?? "rgba(60,48,36,0.38)";
  return (
    <g transform={`translate(${x} ${y}) scale(${s} ${up ? -s : s})`}>
      <circle className="l-on" cy={fl.c} r={fl.halo} fill={url(u, "halo")} />
      <rect x={-9} y={0} width={18} height={18} rx={2} fill={url(u, "cap")} />
      <path d="M-9 5 H9 M-9 9.5 H9 M-9 14 H9" stroke="rgba(0,0,0,0.28)" strokeWidth={0.8} />
      <path d={SHAPES[kind]} fill={gFill} stroke={gStroke} strokeWidth={0.9} />
      <path d={SHAPES[kind]} className="l-on" fill={url(u, "warm")} />
      <path d={fl.supports} stroke="rgba(120,104,86,0.8)" strokeWidth={0.8} fill="none" />
      <path d={fl.wire} stroke="#6b4a2a" strokeWidth={1.1} fill="none" strokeLinecap="round" />
      <g className="l-on">
        <path d={fl.wire} stroke="#ffb659" strokeOpacity={0.55} strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d={fl.wire} stroke="#fff4d6" strokeWidth={1.5} fill="none" strokeLinecap="round" />
      </g>
      <path
        d={kind === "globe" ? "M-24 52 C-28 62 -27 76 -20 86" : kind === "a60" ? "M-15 42 C-17 50 -15 58 -10 63" : "M-20 56 C-24 66 -23 80 -16 90"}
        stroke="rgba(255,255,255,0.75)"
        strokeWidth={2.2}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

/* ─── fixtures ─────────────────────────────────────────────── */

const DRAW: Record<ArtKey, (c: Ctx) => ReactNode> = {
  ora: (c) => {
    const { u, f } = c;
    const wood = f.trimKey === "oak" || f.trimKey === "walnut";
    return (
      <>
        <Ambient u={u} cx={200} cy={370} />
        <Beam u={u} id="a" cx={200} cy={344} w={230} h={250} />
        <Cable c={c} y2={150} />
        <rect x={194} y={142} width={12} height={12} rx={1.5} fill={url(u, "t")} />
        <path d="M190 152 H210 C212 174 238 191 298 204 H102 C162 191 188 174 190 152 Z" fill={url(u, "t")} />
        {wood && (
          <path
            d="M196 160 C198 176 214 188 246 197 M204 158 C207 174 226 186 268 198 M194 170 C188 182 168 192 136 199"
            stroke="rgba(70,40,15,0.2)"
            strokeWidth={0.9}
            fill="none"
          />
        )}
        <path
          d="M102 204 C70 212 56 240 58 280 C60 316 78 336 104 342 H296 C322 336 340 316 342 280 C344 240 330 212 298 204 Z"
          fill={url(u, "b")}
        />
        <Rim d="M102 204 C70 212 56 240 58 280 C60 316 78 336 104 342 H296 C322 336 340 316 342 280 C344 240 330 212 298 204" />
        <path d="M104 205 H296" stroke="rgba(0,0,0,0.3)" strokeWidth={1.4} />
        <path d="M92 236 C84 262 86 300 102 326" stroke="rgba(255,255,255,0.1)" strokeWidth={6} fill="none" strokeLinecap="round" />
        <ellipse cx={200} cy={342} rx={96} ry={6} fill={f.body[4]} />
        <ellipse className="l-on" cx={200} cy={342} rx={96} ry={6} fill={url(u, "warm")} />
        <Halo u={u} cx={200} cy={350} rx={170} ry={48} />
      </>
    );
  },

  vessel: (c) => {
    const { u, f } = c;
    return (
      <>
        <Ambient u={u} cx={200} cy={380} />
        <Beam u={u} id="a" cx={200} cy={352} w={200} h={240} />
        <Cable c={c} y2={118} />
        <rect x={193} y={110} width={14} height={14} rx={2} fill={url(u, "t")} />
        <path
          d="M191 122 H209 C210 160 226 206 252 250 C274 288 281 320 270 350 H130 C119 320 126 288 148 250 C174 206 190 160 191 122 Z"
          fill={url(u, "b")}
        />
        <Rim d="M191 122 C190 160 174 206 148 250 C126 288 119 320 130 350 M209 122 C210 160 226 206 252 250 C274 288 281 320 270 350" />
        {/* hand-beaten facets */}
        <g fill="none" strokeLinecap="round">
          <path d="M176 236 C166 266 154 300 150 338" stroke="rgba(255,255,255,0.09)" strokeWidth={7} />
          <path d="M196 170 C194 210 190 260 190 336" stroke="rgba(255,255,255,0.05)" strokeWidth={5} />
          <path d="M218 214 C230 250 246 290 250 338" stroke="rgba(0,0,0,0.12)" strokeWidth={6} />
        </g>
        <ellipse cx={200} cy={350} rx={70} ry={7} fill={f.inner} />
        <ellipse cx={200} cy={351.5} rx={62} ry={4.5} fill="rgba(0,0,0,0.25)" />
        <ellipse className="l-on" cx={200} cy={350} rx={70} ry={7} fill={url(u, "warm")} />
        <Halo u={u} cx={200} cy={358} rx={140} ry={46} />
      </>
    );
  },

  cloche: (c) => {
    const { u, f } = c;
    const glass =
      "M160 176 C160 148 178 132 200 132 C222 132 240 148 240 176 C242 240 250 292 262 330 C264 338 258 344 248 344 H152 C142 344 136 338 138 330 C150 292 158 240 160 176 Z";
    return (
      <>
        <Ambient u={u} cx={200} cy={240} r={340} />
        <Beam u={u} id="a" cx={200} cy={340} w={200} h={240} />
        <Cable c={c} y2={96} />
        <rect x={184} y={94} width={32} height={40} rx={3} fill={url(u, "t")} />
        <rect x={180} y={126} width={40} height={9} rx={2} fill={url(u, "t")} />
        <Bulb u={u} x={200} y={134} s={0.95} />
        <path d={glass} fill={url(u, "g")} stroke={f.glass.stroke} strokeWidth={1} />
        <path d={glass} className="l-on" fill={f.glass.lit} />
        <g fill="none" strokeLinecap="round">
          <path d="M170 176 C171 160 180 148 192 142" stroke="rgba(255,255,255,0.8)" strokeWidth={2.4} />
          <path d="M167 206 C166 250 160 290 150 326" stroke="rgba(255,255,255,0.42)" strokeWidth={5} />
          <path d="M236 200 C238 250 244 290 252 324" stroke="rgba(0,0,0,0.07)" strokeWidth={3} />
        </g>
        <ellipse cx={200} cy={343} rx={55} ry={3.5} fill="none" stroke={f.glass.stroke} strokeWidth={0.8} />
      </>
    );
  },

  arc: (c) => {
    const { u, f } = c;
    return (
      <>
        <defs>
          <clipPath id={`${u}below`}>
            <rect x={0} y={285} width={400} height={300} />
          </clipPath>
        </defs>
        <Ambient u={u} cx={200} cy={340} />
        <Beam u={u} id="a" cx={200} cy={290} w={270} h={290} />
        <Cable c={c} y2={150} />
        <rect x={189} y={146} width={22} height={50} rx={2} fill={url(u, "t")} />
        <rect x={184} y={186} width={32} height={10} rx={2} fill={url(u, "t")} />
        <path
          d="M178 196 H222 C242 204 300 242 352 276 C359 281 356 288 346 288 H54 C44 288 41 281 48 276 C100 242 158 204 178 196 Z"
          fill={url(u, "b")}
        />
        <path d="M184 202 C150 222 104 250 66 274" stroke="rgba(255,255,255,0.13)" strokeWidth={3} fill="none" strokeLinecap="round" />
        <Rim d="M178 196 C158 204 100 242 48 276 M222 196 C242 204 300 242 352 276" />
        <ellipse cx={200} cy={288} rx={148} ry={7.5} fill={f.inner} />
        <ellipse className="l-on" cx={200} cy={288} rx={148} ry={7.5} fill={url(u, "warm")} opacity={0.9} />
        <g clipPath={`url(#${u}below)`}>
          <rect x={192} y={262} width={16} height={34} rx={2} fill={url(u, "t")} />
          <Bulb u={u} x={200} y={278} s={1.02} />
        </g>
      </>
    );
  },

  cage: (c) => {
    const { u } = c;
    const lat = [-80, -40, 0, 40, 80];
    return (
      <>
        <Ambient u={u} cx={200} cy={300} r={360} />
        <Cable c={c} y2={180} />
        <path d="M188 178 H212 L217 192 H183 Z" fill={url(u, "t")} />
        <Bulb u={u} x={200} y={232} s={0.95} kind="globe" />
        <g fill="none" stroke={url(u, "t")} strokeWidth={2.2}>
          <circle cx={200} cy={300} r={112} />
          {[84, 50, 16].map((rx) => (
            <ellipse key={rx} cx={200} cy={300} rx={rx} ry={112} />
          ))}
          {lat.map((yy) => {
            const rx = Math.sqrt(112 * 112 - yy * yy);
            return <ellipse key={yy} cx={200} cy={300 + yy} rx={rx} ry={rx * 0.13} strokeWidth={1.6} />;
          })}
        </g>
        <circle cx={200} cy={190} r={5} fill={url(u, "t")} />
        <circle cx={200} cy={412} r={4.5} fill={url(u, "t")} />
      </>
    );
  },

  lantern: (c) => {
    const { u, f } = c;
    const frame = f.body[2];
    const links: ReactNode[] = [];
    for (let y = Math.max(c.cableTop, -600), i = 0; y < 146; y += 11, i++) {
      links.push(
        i % 2 === 0 ? (
          <ellipse key={i} cx={200} cy={y + 5.5} rx={3.4} ry={6.4} fill="none" stroke={frame} strokeWidth={1.6} />
        ) : (
          <rect key={i} x={199.2} y={y} width={1.6} height={11} fill={frame} />
        ),
      );
    }
    return (
      <>
        <Ambient u={u} cx={200} cy={268} r={360} />
        {links}
        <circle cx={200} cy={151} r={5} fill="none" stroke={frame} strokeWidth={2} />
        <path d="M200 156 L252 200 H148 Z" fill={url(u, "b")} />
        <rect x={144} y={199} width={112} height={8} rx={1} fill={url(u, "b")} />
        <path d="M156 207 H244 L236 330 H164 Z" fill={url(u, "g")} />
        <Bulb u={u} x={200} y={212} s={0.8} />
        <path d="M156 207 H244 L236 330 H164 Z" className="l-on" fill={f.glass.lit} />
        <g fill="none" stroke={frame} strokeLinejoin="round">
          <path d="M156 207 H244 L236 330 H164 Z" strokeWidth={5} />
          <path d="M200 207 V330" strokeWidth={3.5} />
          <path d="M160 300 H240" strokeWidth={2} />
        </g>
        <path d="M168 216 L172 296" stroke="rgba(255,255,255,0.38)" strokeWidth={3} strokeLinecap="round" />
        <path d="M160 330 H240 L226 346 H174 Z" fill={url(u, "b")} />
        <circle cx={200} cy={354} r={4.5} fill={frame} />
      </>
    );
  },

  knot: (c) => {
    const { u, f } = c;
    const base = f.inner;
    const dark = f.inner === "#3b3a38" ? "#1c1b1a" : "#86603a";
    const d = `M200 ${c.cableTop} V112 C200 150 236 146 238 172 C240 198 208 208 192 198 C174 186 178 160 196 158 C214 156 220 180 212 200 C206 214 200 222 200 246 V300`;
    return (
      <>
        <defs>
          <pattern id={`${u}rope`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
            <rect width="6" height="6" fill={base} />
            <rect width="2.4" height="6" fill={dark} />
          </pattern>
        </defs>
        <Ambient u={u} cx={200} cy={392} r={340} />
        <path d={d} stroke={url(u, "rope")} strokeWidth={11} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} stroke="rgba(0,0,0,0.18)" strokeWidth={11} fill="none" strokeDasharray="0" transform="translate(2.5 0)" opacity={0.35} />
        <rect x={189} y={296} width={22} height={34} rx={3} fill={url(u, "b")} />
        <Bulb u={u} x={200} y={322} s={1.05} kind="globe" />
      </>
    );
  },

  cone: (c) => {
    const { u, f } = c;
    const g = "M180 198 H220 L276 332 C278 338 274 342 266 342 H134 C126 342 122 338 124 332 Z";
    return (
      <>
        <Ambient u={u} cx={200} cy={270} r={340} />
        <Beam u={u} id="a" cx={200} cy={338} w={210} h={240} />
        <Cable c={c} y2={150} color={f.trimKey === "white" ? "#c4c6c8" : undefined} />
        <rect x={188} y={146} width={24} height={56} rx={4} fill={url(u, "t")} />
        <Bulb u={u} x={200} y={196} s={1} kind="a60" />
        <path d={g} fill={url(u, "g")} stroke={f.glass.stroke} strokeWidth={1} />
        <path d={g} className="l-on" fill={f.glass.lit} />
        <path d="M184 208 L140 326" stroke="rgba(255,255,255,0.5)" strokeWidth={3} strokeLinecap="round" />
        <path d="M222 214 L262 326" stroke="rgba(255,255,255,0.18)" strokeWidth={2} strokeLinecap="round" />
      </>
    );
  },

  globe: (c) => {
    const { u, f } = c;
    return (
      <>
        <Ambient u={u} cx={200} cy={366} r={340} />
        <Cable c={c} y2={200} w={2.2} />
        <rect x={187} y={194} width={26} height={44} rx={3} fill={url(u, "t")} />
        <Bulb u={u} x={200} y={236} s={1.9} kind="globe" glass={f.glass} />
      </>
    );
  },

  teardrop: (c) => {
    const { u, f } = c;
    return (
      <>
        <Ambient u={u} cx={200} cy={352} r={340} />
        <Cable c={c} y2={200} w={2.2} />
        <rect x={188} y={194} width={24} height={44} rx={3} fill={url(u, "t")} />
        <Bulb u={u} x={200} y={236} s={1.8} glass={f.glass} />
      </>
    );
  },

  halo: (c) => {
    const { u, f } = c;
    const cx = 200,
      cy = 330,
      rx = 150,
      ry = 30;
    const bulbs = [200, 260, 320, 20, 80, 140].map((deg) => {
      const a = (deg * Math.PI) / 180;
      return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a), back: Math.sin(a) < 0 };
    });
    const one = (b: (typeof bulbs)[number], i: number) => (
      <g key={i}>
        <rect x={b.x - 6} y={b.y - 18} width={12} height={16} rx={1.5} fill={url(u, "b")} />
        <Bulb u={u} x={b.x} y={b.y - 18} s={b.back ? 0.48 : 0.58} up />
      </g>
    );
    return (
      <>
        <Ambient u={u} cx={200} cy={290} r={380} />
        <path d="M168 0 H232 V6 C232 13 224 18 212 18 H188 C176 18 168 13 168 6 Z" fill={url(u, "b")} />
        <g stroke={f.body[2]} strokeWidth={1.3}>
          <line x1={196} y1={18} x2={58} y2={330} />
          <line x1={204} y1={18} x2={342} y2={330} />
          <line x1={198} y1={18} x2={140} y2={357} />
          <line x1={202} y1={18} x2={262} y2={357} />
        </g>
        <path d={`M${cx - rx} ${cy} A${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`} fill="none" stroke={url(u, "t")} strokeWidth={10} />
        {bulbs.filter((b) => b.back).map(one)}
        <path d={`M${cx - rx} ${cy} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy}`} fill="none" stroke={url(u, "t")} strokeWidth={11} />
        <path
          d={`M${cx - rx + 4} ${cy + 5} A${rx - 4} ${ry - 2} 0 0 0 ${cx + rx - 4} ${cy + 5}`}
          fill="none"
          stroke="rgba(0,0,0,0.22)"
          strokeWidth={2}
        />
        {bulbs.filter((b) => !b.back).map(one)}
      </>
    );
  },

  disc: (c) => {
    const { u } = c;
    const dome = "M50 44 H350 C350 92 284 124 200 124 C116 124 50 92 50 44 Z";
    return (
      <>
        <Ambient u={u} cx={200} cy={170} r={380} />
        <Beam u={u} id="a" cx={200} cy={110} w={300} h={360} />
        <rect x={62} y={0} width={276} height={12} fill={url(u, "t")} />
        <rect x={70} y={12} width={260} height={32} fill={url(u, "b")} />
        <path d={dome} fill={url(u, "opal")} />
        <path d={dome} className="l-on" fill={url(u, "opalLit")} />
        <path d="M50 44 H350" stroke="rgba(0,0,0,0.12)" strokeWidth={1.2} />
        <Halo u={u} cx={200} cy={110} rx={240} ry={90} />
      </>
    );
  },

  cap: (c) => {
    const { u, f } = c;
    return (
      <>
        <Ambient u={u} cx={200} cy={340} r={320} />
        <ellipse className="l-amb" cx={200} cy={498} rx={200} ry={24} fill={url(u, "amb")} />
        <Beam u={u} id="a" cx={200} cy={308} w={200} h={200} />
        <ellipse cx={200} cy={504} rx={112} ry={9} fill={url(u, "shadow")} />
        <path
          d="M130 492 C130 484 162 479 200 479 C238 479 270 484 270 492 V495 C270 502 238 507 200 507 C162 507 130 502 130 495 Z"
          fill={url(u, "b")}
        />
        <path d="M192 481 L195 302 H205 L208 481 Z" fill={url(u, "b")} />
        <path
          d="M92 298 C92 222 140 178 200 178 C260 178 308 222 308 298 C308 305 304 308 297 308 H103 C96 308 92 305 92 298 Z"
          fill={url(u, "b")}
        />
        <path d="M126 236 C142 206 168 192 196 188" stroke="rgba(255,255,255,0.24)" strokeWidth={6} fill="none" strokeLinecap="round" />
        <Rim d="M92 298 C92 222 140 178 200 178 C260 178 308 222 308 298" />
        <ellipse cx={200} cy={306} rx={104} ry={5.5} fill={f.inner} />
        <ellipse className="l-on" cx={200} cy={306} rx={104} ry={5.5} fill={url(u, "warm")} />
        <Halo u={u} cx={200} cy={318} rx={170} ry={50} />
      </>
    );
  },

  orb: (c) => {
    const { u } = c;
    return (
      <>
        <Ambient u={u} cx={200} cy={360} r={360} />
        <ellipse className="l-amb" cx={200} cy={498} rx={210} ry={26} fill={url(u, "amb")} />
        <ellipse cx={200} cy={500} rx={96} ry={8} fill={url(u, "shadow")} />
        <rect x={148} y={462} width={104} height={36} rx={2} fill={url(u, "t")} />
        <ellipse cx={200} cy={462} rx={52} ry={5} fill="rgba(255,255,255,0.18)" />
        <Halo u={u} cx={200} cy={360} rx={220} />
        <circle cx={200} cy={360} r={104} fill={url(u, "opal")} />
        <circle className="l-on" cx={200} cy={360} r={104} fill={url(u, "opalLit")} />
        <ellipse cx={160} cy={318} rx={22} ry={13} fill="rgba(255,255,255,0.55)" transform="rotate(-32 160 318)" />
      </>
    );
  },

  stem: (c) => {
    const { u, f } = c;
    return (
      <>
        <Ambient u={u} cx={170} cy={280} r={360} />
        <ellipse className="l-amb" cx={180} cy={744} rx={200} ry={22} fill={url(u, "amb")} />
        <Beam u={u} id="a" cx={164} cy={240} w={210} h={510} />
        <ellipse cx={262} cy={750} rx={70} ry={7} fill={url(u, "shadow")} />
        <path d="M262 730 V214 C262 164 236 132 196 132 H176" stroke={f.body[2]} strokeWidth={6} fill="none" strokeLinecap="round" />
        <path d="M262 400 V600" stroke="rgba(255,255,255,0.12)" strokeWidth={2} transform="translate(-1.4 0)" />
        <path
          d="M206 738 C206 730 232 726 262 726 C292 726 318 730 318 738 V742 C318 748 292 752 262 752 C232 752 206 748 206 742 Z"
          fill={url(u, "b")}
        />
        <circle cx={172} cy={132} r={5} fill={f.body[2]} />
        <path d="M150 130 H182 L214 228 C216 236 211 240 204 240 H124 C117 240 112 236 114 228 Z" fill={url(u, "b")} />
        <ellipse cx={164} cy={240} rx={44} ry={4.5} fill={f.inner} />
        <ellipse className="l-on" cx={164} cy={240} rx={44} ry={4.5} fill={url(u, "warm")} />
        <Halo u={u} cx={164} cy={252} rx={110} ry={38} />
      </>
    );
  },

  tripod: (c) => {
    const { u } = c;
    const drum = "M124 150 H276 L298 334 H102 Z";
    return (
      <>
        <Ambient u={u} cx={200} cy={250} r={400} />
        <Beam u={u} id="u" cx={200} cy={150} w={190} h={180} up />
        <Beam u={u} id="d" cx={200} cy={334} w={250} h={420} />
        <ellipse className="l-amb" cx={200} cy={746} rx={200} ry={20} fill={url(u, "amb")} />
        <ellipse cx={200} cy={748} rx={130} ry={7} fill={url(u, "shadow")} />
        <path d="M199 368 L203 706 L197 706 Z" fill={url(u, "t")} opacity={0.75} />
        <path d="M194 364 L96 744 L105 746 L201 370 Z" fill={url(u, "t")} />
        <path d="M206 364 L304 744 L295 746 L199 370 Z" fill={url(u, "t")} />
        <rect x={190} y={330} width={20} height={40} rx={3} fill={url(u, "cap")} />
        <path d={drum} fill={url(u, "b")} />
        <g opacity={0.9}>
          <path d={drum} className="l-on" fill={url(u, "opalLit")} />
        </g>
        <g stroke="rgba(120,100,70,0.1)" strokeWidth={1}>
          {[140, 164, 188, 212, 236, 260].map((x) => (
            <line key={x} x1={x} y1={152} x2={x + (x - 200) * 0.14} y2={332} />
          ))}
        </g>
        <ellipse cx={200} cy={150} rx={76} ry={5} fill="rgba(0,0,0,0.12)" />
        <ellipse cx={200} cy={334} rx={98} ry={6} fill="rgba(0,0,0,0.1)" />
        <Halo u={u} cx={200} cy={242} rx={170} ry={150} />
      </>
    );
  },

  swing: (c) => {
    const { u, f } = c;
    const metal = f.trim[2];
    return (
      <>
        <Ambient u={u} cx={263} cy={320} r={320} />
        <Beam u={u} id="a" cx={263} cy={292} w={170} h={240} />
        <rect x={64} y={196} width={22} height={104} rx={3} fill={url(u, "t")} />
        <path d="M86 248 H190 L260 198" stroke={metal} strokeWidth={5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={88} cy={248} r={6} fill={metal} />
        <circle cx={190} cy={248} r={6.5} fill={metal} />
        <circle cx={262} cy={194} r={5.5} fill={metal} />
        <path d="M250 188 H276 L318 282 C320 288 316 292 310 292 H216 C210 292 206 288 208 282 Z" fill={url(u, "b")} />
        <path d="M252 196 L226 270" stroke="rgba(255,255,255,0.2)" strokeWidth={3} strokeLinecap="round" />
        <ellipse cx={263} cy={292} rx={51} ry={5} fill={f.inner} />
        <ellipse className="l-on" cx={263} cy={292} rx={51} ry={5} fill={url(u, "warm")} />
        <Halo u={u} cx={263} cy={304} rx={120} ry={40} />
      </>
    );
  },

  globewall: (c) => {
    const { u } = c;
    return (
      <>
        <Ambient u={u} cx={238} cy={260} r={340} />
        <ellipse cx={92} cy={260} rx={10} ry={52} fill={url(u, "t")} />
        <rect x={92} y={253} width={56} height={14} fill={url(u, "t")} />
        <rect x={138} y={242} width={18} height={36} rx={3} fill={url(u, "t")} />
        <Halo u={u} cx={238} cy={260} rx={210} />
        <circle cx={238} cy={260} r={94} fill={url(u, "opal")} />
        <circle className="l-on" cx={238} cy={260} r={94} fill={url(u, "opalLit")} />
        <ellipse cx={204} cy={222} rx={20} ry={12} fill="rgba(255,255,255,0.55)" transform="rotate(-32 204 222)" />
      </>
    );
  },

  bollard: (c) => {
    const { u } = c;
    return (
      <>
        <Ambient u={u} cx={200} cy={260} r={300} />
        <ellipse className="l-amb" cx={200} cy={502} rx={220} ry={28} fill={url(u, "amb")} />
        <Beam u={u} id="a" cx={200} cy={256} w={210} h={254} />
        <ellipse cx={200} cy={504} rx={90} ry={7} fill={url(u, "shadow")} />
        <rect x={160} y={150} width={80} height={350} fill={url(u, "b")} />
        <rect x={164} y={170} width={72} height={86} fill="#0c0c0d" />
        <rect x={164} y={170} width={72} height={86} className="l-on" fill={url(u, "warm")} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={160} y={174 + i * 14} width={80} height={6.5} fill={url(u, "b")} />
        ))}
        <rect x={152} y={136} width={96} height={18} rx={2} fill={url(u, "b")} />
        <rect x={150} y={494} width={100} height={8} fill={url(u, "b")} />
        <Halo u={u} cx={200} cy={250} rx={130} ry={60} />
      </>
    );
  },

  harbour: (c) => {
    const { u, f } = c;
    const frame = f.body[2];
    const body = "M160 184 H240 L232 310 H168 Z";
    return (
      <>
        <Ambient u={u} cx={200} cy={250} r={340} />
        <rect x={80} y={148} width={18} height={92} rx={2} fill={url(u, "b")} />
        <path d="M98 172 C150 172 190 156 200 132 V150" stroke={frame} strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d="M156 178 L200 150 L244 178 Z" fill={url(u, "b")} />
        <rect x={150} y={176} width={100} height={8} fill={url(u, "b")} />
        <path d={body} fill={url(u, "g")} />
        <Bulb u={u} x={200} y={188} s={0.74} />
        <path d={body} className="l-on" fill={f.glass.lit} />
        <g fill="none" stroke={frame} strokeLinejoin="round">
          <path d={body} strokeWidth={5} />
          <path d="M200 184 V310" strokeWidth={3} />
        </g>
        <path d="M168 194 L174 298" stroke="rgba(255,255,255,0.32)" strokeWidth={3} strokeLinecap="round" />
        <path d="M166 310 H234 L226 326 H174 Z" fill={url(u, "b")} />
      </>
    );
  },
};

export interface LampArtProps {
  art: ArtKey;
  finish: Finish;
  className?: string;
  style?: CSSProperties;
  /** y (in art units) where the suspension cable begins; negative values extend it above the frame. */
  cableTop?: number;
  /** Override alignment within the box. */
  align?: string;
  title?: string;
}

export function LampArt({ art, finish, className, style, cableTop = 0, align, title }: LampArtProps) {
  const u = "l" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const f = resolveFinish(finish);
  const { vb, mount } = ART_META[art];
  const par =
    align ?? (mount === "ceiling" ? "xMidYMin meet" : mount === "wall" ? "xMidYMid meet" : "xMidYMax meet");
  return (
    <svg
      viewBox={`0 0 ${vb[0]} ${vb[1]}`}
      preserveAspectRatio={par}
      className={className}
      style={{ overflow: "visible", ...style }}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <Defs u={u} f={f} />
      {DRAW[art]({ u, f, cableTop })}
    </svg>
  );
}
