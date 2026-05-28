"use client";

/**
 * Cart state, kept in client memory + localStorage so it survives a tab
 * refresh and a JWT-expiry redirect (see PRD edge-case mapping).
 *
 * Quantity semantics:
 *   - product.is_weighed === true  → quantity is in kilograms (fractional OK)
 *   - product.is_weighed === false → quantity is unit count (integer)
 *
 * The increment step adapts: 0.25 kg for weighed items, 1 unit otherwise.
 */

import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
  ReactNode,
} from "react";
import type { CartLine, Product } from "@/lib/types";
import { cartTotals } from "@/lib/format";

interface CartState {
  lines: CartLine[];
  count: number;          // # of distinct line items
  totalUnits: number;     // sum of all quantities (units + kg, just for header)
  totals: ReturnType<typeof cartTotals>;
  add: (p: Product, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const CartCtx = createContext<CartState | null>(null);
const STORAGE_KEY = "freshcart.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  // hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
  }, []);

  // persist on every change
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(lines)); } catch {}
  }, [lines]);

  const add = useCallback((p: Product, qty?: number) => {
    const step = p.is_weighed ? 0.25 : 1;
    const inc = qty ?? step;
    setLines((prev) => {
      const existing = prev.find((l) => l.product.id === p.id);
      if (existing) {
        return prev.map((l) =>
          l.product.id === p.id
            ? { ...l, quantity: round(l.quantity + inc, p.is_weighed) }
            : l
        );
      }
      return [...prev, { product: p, quantity: round(inc, p.is_weighed) }];
    });
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    setLines((prev) =>
      prev
        .map((l) =>
          l.product.id === productId
            ? { ...l, quantity: round(Math.max(0, qty), l.product.is_weighed) }
            : l
        )
        .filter((l) => l.quantity > 0)
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.product.id !== productId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartState>(
    () => ({
      lines,
      count: lines.length,
      totalUnits: lines.reduce((s, l) => s + l.quantity, 0),
      totals: cartTotals(lines),
      add, setQty, remove, clear,
    }),
    [lines, add, setQty, remove, clear]
  );

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

function round(n: number, fractional: boolean) {
  return fractional
    ? Math.round(n * 100) / 100      // 0.01 kg precision
    : Math.max(0, Math.round(n));    // whole units
}

export function useCart(): CartState {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
