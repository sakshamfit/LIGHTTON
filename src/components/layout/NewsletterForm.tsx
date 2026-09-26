"use client";

import { useState } from "react";
import { IconArrowLong, IconCheck } from "@/components/ui/Icons";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");
  return (
    <form
      className="mt-10 max-w-[420px]"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setState(/^\S+@\S+\.\S+$/.test(email) ? "done" : "error");
      }}
    >
      <label htmlFor="nl-email" className="t-caption text-fg-3">
        Evening letter — new pieces, twice a season
      </label>
      {state === "done" ? (
        <p className="mt-4 flex items-center gap-2 border-b border-line pb-3">
          <IconCheck size={18} /> Thank you. The next letter will find you.
        </p>
      ) : (
        <div className="relative mt-1">
          <input
            id="nl-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setState("idle");
            }}
            placeholder="Email address"
            className="field pr-12"
            aria-invalid={state === "error"}
            aria-describedby={state === "error" ? "nl-err" : undefined}
            autoComplete="email"
          />
          <button type="submit" className="absolute bottom-1 right-0 inline-flex h-11 w-11 items-center justify-center" aria-label="Subscribe">
            <IconArrowLong size={18} />
          </button>
          {state === "error" && (
            <p id="nl-err" className="t-small mt-2 text-[#b4442f]">
              Please enter a valid email address.
            </p>
          )}
        </div>
      )}
    </form>
  );
}
