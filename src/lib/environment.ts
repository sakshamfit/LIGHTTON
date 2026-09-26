/**
 * Environmental lighting model.
 *
 * The site does not switch themes — it moves through five atmospheric stops.
 * Every colour token is interpolated along `progress` (0 = day, 1 = night),
 * and the lamps are driven by two separate channels: `lamp` (bulb/source) and
 * `ambient` (light spilled into the room).
 */

export const PHASES = ["Day", "Early dusk", "Dusk", "Evening", "Night"] as const;
export type PhaseName = (typeof PHASES)[number] | "Lamps on";

type Stop = Record<TokenName, string>;

export type TokenName =
  | "bg"
  | "bg-2"
  | "surface"
  | "panel"
  | "fg"
  | "fg-2"
  | "fg-3"
  | "line"
  | "line-strong"
  | "inv"
  | "inv-fg"
  | "cable"
  | "horizon"
  | "sky"
  | "watermark";

/** Colour stops, day → night. All values rgba so they interpolate cleanly. */
export const STOPS: Stop[] = [
  // Day — pale cool white/blue
  {
    bg: "rgba(246,248,250,1)",
    "bg-2": "rgba(228,236,244,1)",
    surface: "rgba(238,241,244,1)",
    panel: "rgba(255,255,255,1)",
    fg: "rgba(22,23,25,1)",
    "fg-2": "rgba(86,92,100,1)",
    "fg-3": "rgba(132,138,146,1)",
    line: "rgba(22,23,25,0.12)",
    "line-strong": "rgba(22,23,25,0.8)",
    inv: "rgba(14,14,15,1)",
    "inv-fg": "rgba(255,255,255,1)",
    cable: "rgba(24,24,26,1)",
    horizon: "rgba(255,255,255,0)",
    sky: "rgba(214,226,238,1)",
    watermark: "rgba(22,40,70,0.045)",
  },
  // Early dusk — luminance begins to fall, faint warmth at the horizon
  {
    bg: "rgba(226,229,236,1)",
    "bg-2": "rgba(208,216,228,1)",
    surface: "rgba(218,222,230,1)",
    panel: "rgba(236,238,243,1)",
    fg: "rgba(20,21,24,1)",
    "fg-2": "rgba(76,82,92,1)",
    "fg-3": "rgba(112,118,128,1)",
    line: "rgba(20,21,24,0.13)",
    "line-strong": "rgba(20,21,24,0.8)",
    inv: "rgba(14,14,15,1)",
    "inv-fg": "rgba(255,255,255,1)",
    cable: "rgba(22,22,24,1)",
    horizon: "rgba(255,190,150,0.22)",
    sky: "rgba(196,204,222,1)",
    watermark: "rgba(22,30,60,0.05)",
  },
  // Dusk — cool ambient, contrast deepens
  {
    bg: "rgba(152,162,180,1)",
    "bg-2": "rgba(138,149,170,1)",
    surface: "rgba(146,156,175,1)",
    panel: "rgba(162,171,188,1)",
    fg: "rgba(14,16,20,1)",
    "fg-2": "rgba(40,46,56,1)",
    "fg-3": "rgba(62,68,80,1)",
    line: "rgba(14,16,20,0.16)",
    "line-strong": "rgba(14,16,20,0.8)",
    inv: "rgba(14,15,18,1)",
    "inv-fg": "rgba(245,244,240,1)",
    cable: "rgba(18,19,22,1)",
    horizon: "rgba(236,160,140,0.2)",
    sky: "rgba(120,132,160,1)",
    watermark: "rgba(10,16,40,0.07)",
  },
  // Evening — dark environment, products become dominant
  {
    bg: "rgba(44,48,58,1)",
    "bg-2": "rgba(38,42,52,1)",
    surface: "rgba(48,52,62,1)",
    panel: "rgba(54,58,68,1)",
    fg: "rgba(236,232,224,1)",
    "fg-2": "rgba(176,178,184,1)",
    "fg-3": "rgba(134,138,146,1)",
    line: "rgba(236,232,224,0.13)",
    "line-strong": "rgba(236,232,224,0.75)",
    inv: "rgba(238,232,222,1)",
    "inv-fg": "rgba(20,20,22,1)",
    cable: "rgba(60,60,64,1)",
    horizon: "rgba(90,80,130,0.18)",
    sky: "rgba(34,38,52,1)",
    watermark: "rgba(236,232,224,0.03)",
  },
  // Night — deep charcoal, warm white type
  {
    bg: "rgba(17,17,18,1)",
    "bg-2": "rgba(22,22,24,1)",
    surface: "rgba(26,26,28,1)",
    panel: "rgba(30,30,32,1)",
    fg: "rgba(244,237,226,1)",
    "fg-2": "rgba(168,160,148,1)",
    "fg-3": "rgba(122,116,108,1)",
    line: "rgba(244,237,226,0.12)",
    "line-strong": "rgba(244,237,226,0.7)",
    inv: "rgba(244,237,226,1)",
    "inv-fg": "rgba(17,17,18,1)",
    cable: "rgba(58,56,54,1)",
    horizon: "rgba(255,170,90,0.04)",
    sky: "rgba(20,20,22,1)",
    watermark: "rgba(244,237,226,0.028)",
  },
];

export const TOKENS = Object.keys(STOPS[0]) as TokenName[];

const parse = (c: string) => c.match(/[\d.]+/g)!.map(Number);
const PARSED = STOPS.map((s) => TOKENS.map((t) => parse(s[t])));

const smooth = (t: number) => t * t * (3 - 2 * t);
const SHARP = new Set<TokenName>(["fg", "fg-2", "fg-3", "line", "line-strong", "inv", "inv-fg"]);

/** Interpolated tokens for a given progress (0..1). */
export function tokensAt(progress: number): Record<TokenName, string> {
  const p = Math.min(1, Math.max(0, progress)) * (STOPS.length - 1);
  const i = Math.min(STOPS.length - 2, Math.floor(p));
  const tBase = smooth(p - i);
  // Foreground tokens flip polarity between dusk and evening: compress that
  // crossover into a narrow window so text never lingers at low contrast.
  const tSharp = i === 2 ? smooth(Math.min(1, Math.max(0, (p - i - 0.4) / 0.2))) : tBase;
  const a = PARSED[i];
  const b = PARSED[i + 1];
  const out = {} as Record<TokenName, string>;
  TOKENS.forEach((name, k) => {
    const [r1, g1, b1, a1] = a[k];
    const [r2, g2, b2, a2] = b[k];
    const t = SHARP.has(name) ? tSharp : tBase;
    out[name] = `rgba(${Math.round(r1 + (r2 - r1) * t)},${Math.round(g1 + (g2 - g1) * t)},${Math.round(
      b1 + (b2 - b1) * t,
    )},${+(a1 + (a2 - a1) * t).toFixed(3)})`;
  });
  return out;
}

export function phaseAt(progress: number): PhaseName {
  return PHASES[Math.round(Math.min(1, Math.max(0, progress)) * (PHASES.length - 1))];
}

/**
 * Timeline (ms). Forward = day → night. The environment darkens first; bulbs
 * ignite once evening arrives, then light spreads into the room.
 */
export const TIMELINE = {
  forward: { env: [0, 3400], lamp: [2600, 1600], ambient: [2900, 1500] },
  reverse: { lamp: [0, 1100], ambient: [0, 900], env: [400, 3000] },
  mobileScale: 0.8,
  reducedMotion: 600,
} as const;

export const STORAGE_KEY = "vesper.mode";

/** Serialised into the document head so a stored night mode paints before hydration. */
export function preloadScript() {
  const night = tokensAt(1);
  const decl = Object.entries(night)
    .map(([k, v]) => `s.setProperty('--${k}','${v}');`)
    .join("");
  return `try{if(localStorage.getItem('${STORAGE_KEY}')==='night'){var d=document.documentElement,s=d.style;d.dataset.mode='night';${decl}s.setProperty('--lamp-g','1');s.setProperty('--ambient-g','1');s.setProperty('--env','1');}}catch(e){}`;
}
