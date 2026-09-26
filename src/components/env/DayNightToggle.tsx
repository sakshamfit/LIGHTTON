"use client";

import { IconMoon, IconSun } from "@/components/ui/Icons";
import { useEnvironment } from "./EnvironmentProvider";

/**
 * Day/Night control. The track position and icon blend are driven directly by
 * the engine's `--env` variable, so they move continuously with the sky.
 */
export function DayNightToggle({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  const { mode, phase, transitioning, toggle } = useEnvironment();
  const night = mode === "night";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={night}
      aria-label={night ? "Switch to day" : "Switch to night"}
      title={night ? "Return to daylight" : "See the collection after dark"}
      className={`group relative inline-flex h-10 items-center gap-2.5 ${compact ? "px-2" : "pl-2 pr-1"} ${className}`}
    >
      <span className="relative block h-5 w-5">
        <IconSun size={20} className="absolute inset-0" style={{ opacity: "calc(1 - var(--env))", transform: "rotate(calc(var(--env) * 90deg))" }} />
        <IconMoon size={20} className="absolute inset-0" style={{ opacity: "var(--env)" }} />
      </span>
      {!compact && (
        <>
          <span className="t-caption hidden min-w-[5.6em] text-left lg:inline" aria-live="polite">
            {transitioning ? phase : night ? "Night" : "Day"}
          </span>
          <span className="relative hidden h-px w-7 bg-line-strong/40 lg:block" aria-hidden>
            <span
              className="absolute top-1/2 -mt-[3px] h-1.5 w-1.5 rounded-full bg-fg"
              style={{
                left: "calc(var(--env) * (100% - 6px))",
                boxShadow: "0 0 calc(var(--lamp-g) * 10px) calc(var(--lamp-g) * 2px) rgba(255,190,110,calc(var(--lamp-g) * .8))",
              }}
            />
          </span>
        </>
      )}
    </button>
  );
}
