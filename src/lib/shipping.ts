export const FREE_SHIPPING_FROM = 500;

export const SHIPPING_METHODS = [
  { id: "standard", label: "Standard delivery", eta: "3–5 working days", price: 25 },
  { id: "express", label: "Express delivery", eta: "1–2 working days", price: 45 },
  { id: "whiteglove", label: "White-glove installation", eta: "Scheduled with our installer", price: 180 },
] as const;

export type ShippingId = (typeof SHIPPING_METHODS)[number]["id"];

export function shippingCost(id: ShippingId, subtotal: number) {
  const m = SHIPPING_METHODS.find((s) => s.id === id)!;
  if (id === "standard" && subtotal >= FREE_SHIPPING_FROM) return 0;
  return m.price;
}

export const TAX_RATE = 0.08;
