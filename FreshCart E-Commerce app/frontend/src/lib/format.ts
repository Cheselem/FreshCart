import type { CartLine, Product } from "./types";

export const TAX_RATE = 0.085;        // 8.5%, mirrors FR-011
export const DELIVERY_FEE = 250;      // KSh, flat (overridable by slot.surcharge)

const currency = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatPrice(value: number): string {
  return currency.format(value);
}

export function unitLabel(p: Product): string {
  if (p.unit_label) return p.unit_label;
  return p.is_weighed ? "per kg" : "each";
}

export function lineSubtotal(line: CartLine): number {
  // unit_price is per-unit or per-kg; for both cases qty * price is correct.
  return round2(line.product.unit_price * line.quantity);
}

export function cartTotals(lines: CartLine[], deliveryFee = DELIVERY_FEE) {
  const subtotal = round2(lines.reduce((s, l) => s + lineSubtotal(l), 0));
  const tax = round2(subtotal * TAX_RATE);
  const total = round2(subtotal + tax + (lines.length ? deliveryFee : 0));
  return { subtotal, tax, deliveryFee: lines.length ? deliveryFee : 0, total };
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function formatWeight(kg: number): string {
  if (kg < 1) return `${Math.round(kg * 1000)} g`;
  return `${kg.toFixed(2)} kg`;
}
