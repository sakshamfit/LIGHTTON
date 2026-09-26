"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useCart, type ResolvedLine } from "@/components/cart/CartProvider";
import { Logo } from "@/components/layout/Logo";
import { LampArt } from "@/components/lamps/LampArt";
import { ProductThumb } from "@/components/product/ProductThumb";
import { IconCheck } from "@/components/ui/Icons";
import { money } from "@/lib/format";
import { productBySlug } from "@/lib/products";
import { SHIPPING_METHODS, TAX_RATE, shippingCost, type ShippingId } from "@/lib/shipping";

const STEPS = ["Information", "Shipping", "Payment", "Review"] as const;

interface Form {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  address2: string;
  city: string;
  postcode: string;
  country: string;
  method: ShippingId;
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  newsletter: boolean;
}

const EMPTY: Form = {
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  address: "",
  address2: "",
  city: "",
  postcode: "",
  country: "United States",
  method: "standard",
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
  newsletter: false,
};

const COUNTRIES = ["United States", "Canada", "United Kingdom", "Germany", "France", "Netherlands", "Portugal", "Australia"];

const luhn = (num: string) => {
  const d = num.replace(/\D/g, "");
  if (d.length < 13) return false;
  let sum = 0;
  for (let i = 0; i < d.length; i++) {
    let n = +d[d.length - 1 - i];
    if (i % 2) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return sum % 10 === 0;
};

function validate(step: number, f: Form): Partial<Record<keyof Form, string>> {
  const e: Partial<Record<keyof Form, string>> = {};
  if (step === 0) {
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email address.";
    if (!f.firstName.trim()) e.firstName = "Required.";
    if (!f.lastName.trim()) e.lastName = "Required.";
    if (f.phone && f.phone.replace(/\D/g, "").length < 7) e.phone = "Enter a valid phone number.";
  }
  if (step === 1) {
    if (f.address.trim().length < 4) e.address = "Enter a street address.";
    if (!f.city.trim()) e.city = "Required.";
    if (f.postcode.trim().length < 3) e.postcode = "Enter a postal code.";
  }
  if (step === 2) {
    if (!f.cardName.trim()) e.cardName = "Name as it appears on the card.";
    if (!luhn(f.cardNumber)) e.cardNumber = "Enter a valid card number.";
    const m = f.expiry.match(/^(\d{2})\s?\/\s?(\d{2})$/);
    if (!m || +m[1] < 1 || +m[1] > 12) e.expiry = "Use MM / YY.";
    else {
      const exp = new Date(2000 + +m[2], +m[1], 1);
      if (exp <= new Date()) e.expiry = "This card has expired.";
    }
    if (!/^\d{3,4}$/.test(f.cvc)) e.cvc = "3 or 4 digits.";
  }
  return e;
}

interface Placed {
  number: string;
  email: string;
  lines: { slug: string; name: string; finish: string; qty: number; total: number; finishId: string }[];
  total: number;
  method: string;
}

export function CheckoutFlow() {
  const { lines, subtotal, clear, ready } = useCart();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState<Placed | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const ship = shippingCost(form.method, subtotal);
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + ship + tax;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, placed]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const next = () => {
    const e = validate(step, form);
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setDir(1);
    setStep((s) => s + 1);
  };
  const back = (to?: number) => {
    setDir(-1);
    setStep((s) => (to ?? s - 1));
  };

  const place = () => {
    setPlacing(true);
    const snapshot: Placed = {
      number: `VSP-${Math.floor(100000 + Math.random() * 899999)}`,
      email: form.email,
      lines: lines.map((l) => ({ slug: l.slug, name: l.product.name, finish: l.finishDef.name, finishId: l.finish, qty: l.qty, total: l.total })),
      total,
      method: SHIPPING_METHODS.find((m) => m.id === form.method)!.label,
    };
    window.setTimeout(() => {
      setPlaced(snapshot);
      clear();
      setPlacing(false);
    }, 1400);
  };

  if (!ready) return <div className="min-h-[70vh]" aria-busy="true" />;

  if (placed) return <Confirmation order={placed} />;

  if (!lines.length) {
    return (
      <div className="wrap flex min-h-[70vh] flex-col items-start justify-center gap-5 pt-[var(--header-h)]">
        <p className="t-caption text-fg-3">Checkout</p>
        <h1 className="t-h1">Your cart is empty.</h1>
        <p className="t-body">Add a fixture to begin checkout.</p>
        <Link href="/shop" className="btn btn-solid mt-2">
          Browse the collection
        </Link>
      </div>
    );
  }

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 24 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d * -16 }),
  };

  return (
    <div className="wrap grid gap-12 pb-[var(--section)] pt-[calc(var(--header-h)+clamp(32px,4vw,72px))] lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-7">
        <h1 className="t-h1">Checkout</h1>
        {/* Steps */}
        <ol className="mt-8 flex gap-1" aria-label="Checkout progress">
          {STEPS.map((s, i) => (
            <li key={s} className="flex-1">
              <button
                type="button"
                disabled={i >= step}
                onClick={() => back(i)}
                className="group w-full text-left disabled:cursor-default"
                aria-current={i === step ? "step" : undefined}
              >
                <span className="block h-px w-full bg-line">
                  <span
                    className="block h-px bg-fg transition-[width] duration-500 ease-[var(--ease-soft)]"
                    style={{ width: i < step ? "100%" : i === step ? "50%" : "0%" }}
                  />
                </span>
                <span className={`t-caption mt-3 flex items-center gap-1.5 ${i <= step ? "text-fg" : "text-fg-3"}`}>
                  {i < step ? <IconCheck size={12} /> : <span className="t-num opacity-60">{i + 1}</span>}
                  <span className="hidden sm:inline">{s}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>

        <form
          ref={formRef}
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (step < 3) next();
            else place();
          }}
          className="relative mt-10"
        >
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={step}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
            >
              {step === 0 && (
                <Section title="Contact">
                  <Field label="Email" name="email" type="email" autoComplete="email" value={form.email} onChange={(v) => set("email", v)} error={errors.email} />
                  <div className="grid gap-x-6 sm:grid-cols-2">
                    <Field label="First name" name="firstName" autoComplete="given-name" value={form.firstName} onChange={(v) => set("firstName", v)} error={errors.firstName} />
                    <Field label="Last name" name="lastName" autoComplete="family-name" value={form.lastName} onChange={(v) => set("lastName", v)} error={errors.lastName} />
                  </div>
                  <Field label="Phone (optional)" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={(v) => set("phone", v)} error={errors.phone} hint="For delivery updates only." />
                  <label className="mt-6 flex cursor-pointer items-center gap-3 text-[0.95em] text-fg-2">
                    <input type="checkbox" checked={form.newsletter} onChange={(e) => set("newsletter", e.target.checked)} className="h-4 w-4 accent-[var(--fg)]" />
                    Send me the evening letter — new pieces, twice a season.
                  </label>
                </Section>
              )}

              {step === 1 && (
                <Section title="Delivery address">
                  <Field label="Street address" name="address" autoComplete="address-line1" value={form.address} onChange={(v) => set("address", v)} error={errors.address} />
                  <Field label="Apartment, suite (optional)" name="address2" autoComplete="address-line2" value={form.address2} onChange={(v) => set("address2", v)} />
                  <div className="grid gap-x-6 sm:grid-cols-3">
                    <Field label="City" name="city" autoComplete="address-level2" value={form.city} onChange={(v) => set("city", v)} error={errors.city} />
                    <Field label="Postal code" name="postcode" autoComplete="postal-code" value={form.postcode} onChange={(v) => set("postcode", v)} error={errors.postcode} />
                    <label className="block pt-2">
                      <span className="t-caption text-fg-3">Country</span>
                      <select name="country" autoComplete="country-name" value={form.country} onChange={(e) => set("country", e.target.value)} className="field cursor-pointer pt-2">
                        {COUNTRIES.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <fieldset className="mt-10">
                    <legend className="t-caption mb-4 text-fg-3">Delivery method</legend>
                    <div className="space-y-2">
                      {SHIPPING_METHODS.map((m) => {
                        const cost = shippingCost(m.id, subtotal);
                        return (
                          <label
                            key={m.id}
                            className={`flex cursor-pointer items-center gap-4 border px-5 py-4 transition-colors ${form.method === m.id ? "border-line-strong" : "border-line hover:border-fg-3"}`}
                          >
                            <input type="radio" name="method" value={m.id} checked={form.method === m.id} onChange={() => set("method", m.id)} className="h-4 w-4 accent-[var(--fg)]" />
                            <span className="flex-1">
                              <span className="block">{m.label}</span>
                              <span className="t-small text-fg-3">{m.eta}</span>
                            </span>
                            <span className="t-num">{cost ? money(cost) : "Complimentary"}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                </Section>
              )}

              {step === 2 && (
                <Section title="Payment">
                  <p className="t-small -mt-2 mb-4 flex items-center gap-2 text-fg-3">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-fg-3" /> Prototype checkout — no payment is taken. Try 4242 4242 4242 4242.
                  </p>
                  <Field label="Name on card" name="cardName" autoComplete="cc-name" value={form.cardName} onChange={(v) => set("cardName", v)} error={errors.cardName} />
                  <Field
                    label="Card number"
                    name="cardNumber"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    value={form.cardNumber}
                    onChange={(v) =>
                      set(
                        "cardNumber",
                        v
                          .replace(/\D/g, "")
                          .slice(0, 19)
                          .replace(/(\d{4})(?=\d)/g, "$1 "),
                      )
                    }
                    error={errors.cardNumber}
                  />
                  <div className="grid grid-cols-2 gap-x-6">
                    <Field
                      label="Expiry (MM / YY)"
                      name="expiry"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      value={form.expiry}
                      onChange={(v) => {
                        const d = v.replace(/\D/g, "").slice(0, 4);
                        set("expiry", d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d);
                      }}
                      error={errors.expiry}
                    />
                    <Field label="Security code" name="cvc" inputMode="numeric" autoComplete="cc-csc" value={form.cvc} onChange={(v) => set("cvc", v.replace(/\D/g, "").slice(0, 4))} error={errors.cvc} />
                  </div>
                </Section>
              )}

              {step === 3 && (
                <Section title="Review">
                  <dl className="divide-y divide-line border-y border-line">
                    {[
                      ["Contact", `${form.firstName} ${form.lastName} · ${form.email}`, 0],
                      ["Deliver to", [form.address, form.address2, `${form.postcode} ${form.city}`, form.country].filter(Boolean).join(", "), 1],
                      ["Method", SHIPPING_METHODS.find((m) => m.id === form.method)!.label, 1],
                      ["Payment", `Card ending ${form.cardNumber.replace(/\D/g, "").slice(-4)}`, 2],
                    ].map(([k, v, s]) => (
                      <div key={k as string} className="grid grid-cols-[110px_1fr_auto] items-baseline gap-4 py-4">
                        <dt className="t-small text-fg-3">{k}</dt>
                        <dd className="t-small">{v}</dd>
                        <button type="button" onClick={() => back(s as number)} className="t-caption u-link text-fg-3 hover:text-fg">
                          Edit
                        </button>
                      </div>
                    ))}
                  </dl>
                  <p className="t-small mt-6 text-fg-3">By placing this order you agree to our terms of sale. This is a demonstration storefront; no order will be fulfilled.</p>
                </Section>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
            {step > 0 ? (
              <button type="button" onClick={() => back()} className="u-link t-caption self-start">
                ← Back to {STEPS[step - 1].toLowerCase()}
              </button>
            ) : (
              <Link href="/cart" className="u-link t-caption self-start">
                ← Return to cart
              </Link>
            )}
            <button type="submit" className="btn btn-solid min-w-[240px]" disabled={placing}>
              {placing ? "Placing order…" : step < 3 ? `Continue to ${STEPS[step + 1].toLowerCase()}` : `Place order · ${money(total)}`}
            </button>
          </div>
        </form>
      </div>

      <Summary lines={lines} subtotal={subtotal} ship={ship} tax={tax} total={total} />
    </div>
  );
}

function Summary({ lines, subtotal, ship, tax, total }: { lines: ResolvedLine[]; subtotal: number; ship: number; tax: number; total: number }) {
  return (
    <aside className="lg:col-span-5" aria-label="Order summary">
      <div className="bg-surface p-6 sm:p-9 lg:sticky lg:top-[calc(var(--header-h)+24px)]">
        <h2 className="t-caption">Order summary</h2>
        <ul className="mt-6 space-y-5">
          {lines.map((l) => (
            <li key={l.key} className="flex items-center gap-4">
              <div className="relative w-16 shrink-0">
                <ProductThumb product={l.product} finish={l.finishDef} tone="panel" className="aspect-[4/5]" pad="tight" />
                <span className="t-num absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-inv px-1 text-[10px] text-inv-fg">{l.qty}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate">{l.product.name}</p>
                <p className="t-small text-fg-3">
                  {l.finishDef.name}
                  {l.product.sizes.length > 1 && ` · ${l.sizeDef.label}`}
                </p>
              </div>
              <p className="t-num t-small">{money(l.total)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-8 space-y-2.5 border-t border-line pt-6 text-[0.95em]">
          <Row k="Subtotal" v={money(subtotal)} />
          <Row k="Delivery" v={ship ? money(ship) : "Complimentary"} />
          <Row k={`Estimated tax (${TAX_RATE * 100}%)`} v={money(tax)} />
          <div className="flex justify-between border-t border-line pt-4 text-[1.2em]">
            <dt>Total</dt>
            <dd className="t-num">{money(total)}</dd>
          </div>
        </dl>
      </div>
    </aside>
  );
}

const Row = ({ k, v }: { k: string; v: string }) => (
  <div className="flex justify-between">
    <dt className="text-fg-2">{k}</dt>
    <dd className="t-num">{v}</dd>
  </div>
);

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="t-h3 mb-4">{title}</legend>
      {children}
    </fieldset>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  hint,
  type = "text",
  ...rest
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: "numeric" | "text" | "tel" | "email";
}) {
  const id = `f-${name}`;
  return (
    <div className="pt-2">
      <label htmlFor={id} className="t-caption text-fg-3">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        className="field pt-2"
        {...rest}
      />
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-err`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="t-small pt-1.5 text-[#b4442f]"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      {hint && !error && (
        <p id={`${id}-hint`} className="t-small pt-1.5 text-fg-3">
          {hint}
        </p>
      )}
    </div>
  );
}

function Confirmation({ order }: { order: Placed }) {
  const first = productBySlug(order.lines[0]?.slug ?? "ora-pendant")!;
  const finish = first.finishes.find((f) => f.id === order.lines[0]?.finishId) ?? first.finishes[0];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
      className="wrap grid gap-12 pb-[var(--section)] pt-[calc(var(--header-h)+clamp(32px,5vw,90px))] lg:grid-cols-12"
    >
      <div className="lg:col-span-6">
        <Logo />
        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.7 }} className="t-h1 mt-10">
          Thank you. Your light is on its way.
        </motion.h1>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}>
          <p className="t-lead mt-6 text-fg-2">
            Order <span className="t-num text-fg">{order.number}</span> is confirmed. A receipt is on its way to {order.email}.
          </p>
          <ul className="mt-10 divide-y divide-line border-y border-line">
            {order.lines.map((l) => (
              <li key={l.slug + l.finish} className="flex justify-between gap-4 py-4">
                <span>
                  {l.name} <span className="text-fg-3">× {l.qty}</span>
                  <span className="t-small block text-fg-3">{l.finish}</span>
                </span>
                <span className="t-num">{money(l.total)}</span>
              </li>
            ))}
            <li className="flex justify-between py-4 text-[1.15em]">
              <span>Total paid</span>
              <span className="t-num">{money(order.total)}</span>
            </li>
          </ul>
          <p className="t-small mt-4 text-fg-3">{order.method}. We’ll email tracking details as soon as your order leaves the studio.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/shop" className="btn btn-solid">
              Continue shopping
            </Link>
            <Link href="/journal/hanging-heights" className="btn btn-outline">
              Installation guide
            </Link>
          </div>
        </motion.div>
      </div>
      <div className="relative min-h-[420px] overflow-hidden bg-bg-2 lg:col-span-5 lg:col-start-8" aria-hidden>
        <motion.div
          className="absolute inset-x-[14%] top-0 h-[80%]"
          initial={{ y: "-40%" }}
          animate={{ y: 0 }}
          transition={{ duration: 1.3, ease: [0.2, 0.75, 0.3, 1] }}
          style={{ ["--lamp" as string]: 1, ["--ambient" as string]: 0.5 }}
        >
          <LampArt art={first.art} finish={finish} cableTop={-2000} className="absolute inset-0 h-full w-full" />
        </motion.div>
      </div>
    </motion.div>
  );
}
