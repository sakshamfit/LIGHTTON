"use client";

import { IconMinus, IconPlus } from "@/components/ui/Icons";

export function QtyStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  label,
  size = "md",
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  label: string;
  size?: "sm" | "md";
}) {
  const h = size === "sm" ? "h-9" : "h-12";
  const w = size === "sm" ? "w-9" : "w-11";
  return (
    <div className={`inline-flex items-center border border-line ${h}`} role="group" aria-label={label}>
      <button
        type="button"
        className={`inline-flex ${h} ${w} items-center justify-center transition-colors hover:bg-surface disabled:opacity-30`}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <IconMinus size={14} />
      </button>
      <output className="t-num w-8 text-center text-sm" aria-live="polite" aria-label="Quantity">
        {value}
      </output>
      <button
        type="button"
        className={`inline-flex ${h} ${w} items-center justify-center transition-colors hover:bg-surface disabled:opacity-30`}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <IconPlus size={14} />
      </button>
    </div>
  );
}
