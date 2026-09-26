"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { IconCheck } from "@/components/ui/Icons";

const TOPICS = ["A product question", "Lighting plan for a project", "Trade & architects", "Showroom visit", "Order & delivery"];

export function ContactForm() {
  const [f, setF] = useState({ name: "", email: "", topic: TOPICS[0], message: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const x: Record<string, string> = {};
    if (!f.name.trim()) x.name = "Please tell us your name.";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) x.email = "Enter a valid email address.";
    if (f.message.trim().length < 10) x.message = "A few more words, please (10+ characters).";
    setErr(x);
    if (Object.keys(x).length) {
      document.querySelector<HTMLElement>(`[name="${Object.keys(x)[0]}"]`)?.focus();
      return;
    }
    setState("sending");
    window.setTimeout(() => setState("sent"), 900);
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {state === "sent" ? (
        <motion.div key="sent" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-surface p-10" role="status">
          <IconCheck size={28} />
          <p className="t-h2 mt-6">Thank you, {f.name.split(" ")[0]}.</p>
          <p className="t-body mt-3">A member of the studio will reply to {f.email} within one working day.</p>
          <button type="button" className="u-link t-caption mt-8" onClick={() => (setF({ name: "", email: "", topic: TOPICS[0], message: "" }), setState("idle"))}>
            Send another message
          </button>
        </motion.div>
      ) : (
        <motion.form key="form" exit={{ opacity: 0 }} noValidate onSubmit={submit} className="space-y-2">
          {(
            [
              ["name", "Name", "text", "name"],
              ["email", "Email", "email", "email"],
            ] as const
          ).map(([k, label, type, ac]) => (
            <div key={k} className="pt-2">
              <label htmlFor={`c-${k}`} className="t-caption text-fg-3">
                {label}
              </label>
              <input
                id={`c-${k}`}
                name={k}
                type={type}
                autoComplete={ac}
                value={f[k]}
                onChange={(e) => (setF({ ...f, [k]: e.target.value }), setErr({ ...err, [k]: "" }))}
                aria-invalid={!!err[k]}
                aria-describedby={err[k] ? `c-${k}-e` : undefined}
                className="field pt-2"
              />
              {err[k] && (
                <p id={`c-${k}-e`} className="t-small pt-1.5 text-[#b4442f]" role="alert">
                  {err[k]}
                </p>
              )}
            </div>
          ))}
          <div className="pt-2">
            <label htmlFor="c-topic" className="t-caption text-fg-3">
              Topic
            </label>
            <select id="c-topic" name="topic" value={f.topic} onChange={(e) => setF({ ...f, topic: e.target.value })} className="field cursor-pointer pt-2">
              {TOPICS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="pt-2">
            <label htmlFor="c-message" className="t-caption text-fg-3">
              Message
            </label>
            <textarea
              id="c-message"
              name="message"
              rows={5}
              value={f.message}
              onChange={(e) => (setF({ ...f, message: e.target.value }), setErr({ ...err, message: "" }))}
              aria-invalid={!!err.message}
              aria-describedby={err.message ? "c-message-e" : undefined}
              className="field resize-y pt-2"
            />
            {err.message && (
              <p id="c-message-e" className="t-small pt-1.5 text-[#b4442f]" role="alert">
                {err.message}
              </p>
            )}
          </div>
          <div className="pt-8">
            <button type="submit" className="btn btn-solid min-w-[200px]" disabled={state === "sending"}>
              {state === "sending" ? "Sending…" : "Send message"}
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
