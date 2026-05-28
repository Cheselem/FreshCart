"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { SearchInput } from "@/components/product/SearchInput";
import {
  DEFAULT_FILTERS, FilterState, FiltersPanel,
} from "@/components/product/FiltersPanel";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { listProducts } from "@/lib/api";
import type { Category, Product } from "@/lib/types";

export default function CatalogPage() {
  const params = useSearchParams();
  const initialCategory = params.get("category") as Category | null;

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 250); // TRD §4.1

  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    category: initialCategory ?? "",
  });

  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch whenever debounced query or category changes.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    listProducts({ q: debouncedQuery || undefined, category: filters.category || undefined, pageSize: 48 })
      .then((res) => { if (!cancelled) setItems(res.items); })
      .catch(() => { if (!cancelled) setError("Couldn't load the catalog. Retrying soon."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [debouncedQuery, filters.category]);

  // Local client-side filters (price/sort/in-stock) — these are instant
  // and don't trigger a refetch, matching the UX-flow doc §2.2.
  const visible = useMemo(() => {
    let arr = items.filter((p) => p.unit_price <= filters.maxPrice);
    if (filters.inStockOnly) arr = arr.filter((p) => p.stock_quantity > 0);
    if (filters.weighedOnly) arr = arr.filter((p) => p.is_weighed);
    switch (filters.sort) {
      case "price-asc":   arr = [...arr].sort((a, b) => a.unit_price - b.unit_price); break;
      case "price-desc":  arr = [...arr].sort((a, b) => b.unit_price - a.unit_price); break;
      case "rating-desc": arr = [...arr].sort((a, b) => b.rating - a.rating); break;
    }
    return arr;
  }, [items, filters]);

  return (
    <>
      <Header
        searchSlot={
          <SearchInput value={query} onChange={setQuery} placeholder="Search 35,000+ products…" />
        }
      />
      <main className="container py-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">
              {filters.category || "Catalog"}
            </h1>
            <p className="mt-1 text-sm text-stone-600">
              {loading ? "Searching…" : `${visible.length} product${visible.length === 1 ? "" : "s"} found`}
              {debouncedQuery && <> for "<span className="font-medium text-stone-800">{debouncedQuery}</span>"</>}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <FiltersPanel
            value={filters}
            onChange={setFilters}
            onReset={() => setFilters({ ...DEFAULT_FILTERS })}
          />

          <section>
            {error && (
              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
                : visible.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>

            {!loading && visible.length === 0 && (
              <EmptyState onReset={() => { setQuery(""); setFilters({ ...DEFAULT_FILTERS }); }} />
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="card flex flex-col items-center gap-3 p-10 text-center">
      <span className="text-4xl">🍃</span>
      <h3 className="text-lg font-semibold text-stone-900">No matches yet</h3>
      <p className="max-w-md text-sm text-stone-600">
        Try widening your filters or clearing the search to see the full aisle again.
      </p>
      <button onClick={onReset} className="btn-outline">Reset all filters</button>
    </div>
  );
}
