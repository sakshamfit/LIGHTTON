"use client";

import { AnimatePresence, motion } from "motion/react";
import { IconClose } from "@/components/ui/Icons";
import { useUI } from "./UIProvider";

export function Toaster() {
  const { toasts, dismiss } = useUI();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[80] flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6" aria-live="polite">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.2 } }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex w-full max-w-[380px] items-start gap-4 bg-inv px-5 py-4 text-inv-fg shadow-[0_20px_50px_-24px_rgba(0,0,0,.5)]"
            role="status"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{t.title}</p>
              {t.body && <p className="mt-0.5 text-sm opacity-70">{t.body}</p>}
            </div>
            {t.action && (
              <button
                type="button"
                className="t-caption shrink-0 self-center underline underline-offset-4"
                onClick={() => {
                  t.action!.onClick();
                  dismiss(t.id);
                }}
              >
                {t.action.label}
              </button>
            )}
            <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss" className="-mr-1 shrink-0 self-center opacity-60 hover:opacity-100">
              <IconClose size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
