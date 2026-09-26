/** Wordmark: condensed caps with a small evening star. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-start gap-[0.18em] ${className}`}>
      <span className="font-display text-[clamp(21px,1.5vw,30px)] font-semibold uppercase leading-none tracking-[0.06em]">
        Vesper
      </span>
      <span
        aria-hidden
        className="mt-[0.05em] block h-[5px] w-[5px] rounded-full bg-fg"
        style={{
          boxShadow:
            "0 0 calc(var(--lamp-g) * 8px) calc(var(--lamp-g) * 2px) rgba(255,196,120,calc(var(--lamp-g) * .9))",
        }}
      />
    </span>
  );
}
