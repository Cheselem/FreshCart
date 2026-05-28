"use client";
import { useEffect, useState } from "react";

/**
 * Hold a debounced copy of `value` for `delay` ms.
 * Per TRD §4.1, the catalog search input enforces a 250 ms window
 * before firing /api/v1/products/search.
 */
export function useDebouncedValue<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}
