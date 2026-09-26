import type { BodyKey, Finish, GlassKey, TrimKey } from "@/lib/types";

/**
 * Cylindrical shading ramps: [edge, highlight, base, shade, far edge].
 * Rendered as horizontal gradients so every body reads as a turned / spun form.
 */
export const BODY: Record<BodyKey, string[]> = {
  black: ["#101011", "#46474a", "#1d1e20", "#111213", "#08080a"],
  chalk: ["#bcb8b1", "#fbfaf7", "#ecebe6", "#d0cdc7", "#aaa69f"],
  clay: ["#8a563f", "#dca080", "#bb7c60", "#955e46", "#6d4131"],
  sage: ["#5b6859", "#b0bdab", "#8c9a88", "#6a7768", "#4a5548"],
  brass: ["#6b4f1f", "#f6e2a4", "#cba65b", "#8f6c2c", "#584117"],
  copper: ["#6a3419", "#f3b891", "#c7774d", "#8c4a28", "#582b14"],
  anthracite: ["#222528", "#62676c", "#3c4044", "#2a2d30", "#18191b"],
  bronze: ["#35261a", "#a6835c", "#6d5238", "#4a3625", "#281c13"],
  white: ["#c9ccce", "#ffffff", "#f3f4f5", "#dcdee0", "#b9bcbf"],
  linen: ["#c7bdab", "#f5f0e6", "#e7e0d2", "#d2c9b8", "#b7ad9b"],
  jute: ["#7e5a33", "#d7b384", "#b58a5a", "#916b42", "#6a4a28"],
  charcoal: ["#1f1f1f", "#565553", "#3b3a38", "#2a2928", "#171717"],
};

export const TRIM: Record<TrimKey, string[]> = {
  oak: ["#94643a", "#e8bb86", "#c8935d", "#a8743f", "#7a512a"],
  walnut: ["#3c2517", "#94644a", "#6a432a", "#4c2f1d", "#2f1d12"],
  brass: BODY.brass,
  black: BODY.black,
  copper: BODY.copper,
  chrome: ["#686d72", "#f7f9fb", "#c3c8cd", "#8a8f94", "#565a5f"],
  white: BODY.white,
};

export interface GlassDef {
  fill: string;
  edge: string;
  stroke: string;
  /** Warm tint added when lit. */
  lit: string;
}

export const GLASS: Record<GlassKey, GlassDef> = {
  clear: { fill: "rgba(236,243,250,0.14)", edge: "rgba(160,178,196,0.42)", stroke: "rgba(40,58,78,0.38)", lit: "rgba(255,214,160,0.34)" },
  smoke: { fill: "rgba(64,66,70,0.40)", edge: "rgba(26,27,30,0.70)", stroke: "rgba(16,16,18,0.55)", lit: "rgba(255,190,120,0.30)" },
  amber: { fill: "rgba(206,134,52,0.30)", edge: "rgba(142,76,22,0.62)", stroke: "rgba(100,52,16,0.55)", lit: "rgba(255,180,90,0.42)" },
  opal: { fill: "#f2f3f4", edge: "#c9ced3", stroke: "rgba(40,48,56,0.18)", lit: "rgba(255,222,172,1)" },
};

export interface Resolved {
  body: string[];
  trim: string[];
  glass: GlassDef;
  glassKey: GlassKey;
  inner: string;
  bodyKey: BodyKey;
  trimKey: TrimKey;
}

export function resolveFinish(f: Finish): Resolved {
  const glassKey = f.glass ?? "clear";
  return {
    body: BODY[f.body],
    trim: TRIM[f.trim],
    glass: GLASS[glassKey],
    glassKey,
    inner: f.inner ?? "#ece6dc",
    bodyKey: f.body,
    trimKey: f.trim,
  };
}
