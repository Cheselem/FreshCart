"use client";

import { Icon } from "@/components/ui/Icon";
import { CATEGORIES } from "@/lib/mock-data";
import { formatPrice } from "@/lib/format";
import type { Category } from "@/lib/types";

export interface FilterState {
  category: Category | "";
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  weighedOnly: boolean;
  sort: "relevance" | "price-asc" | "price-desc" | "rating-desc";
}

export const DEFAULT_FILTERS: FilterState = {
  category: "",
  minPrice: 0,
  maxPrice: 5000,
  inStockOnly: false,
  weighedOnly: false,
  sort: "relevance",
};

export function FiltersPanel({
  value,
  onChange,
  onReset,
}: {
  value: FilterState;
  onChange: (next: FilterState) => void;
  onReset: () => void;
}) {
  const set = <K extends keyof FilterState>(k: K, v: FilterState[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <aside className="card p-5 lg:sticky lg:top-24">
      <header className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-stone-900">
          <Icon name="filter" size={16} /> Filters
        </h3>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-medium text-emerald-700 hover:underline"
        >
          Reset
        </button>
      </header>

      {/* Category */}
      <section className="mb-6">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
          Category
        </h4>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => set("category", "")}
            className={pillClass(value.category === "")}
          >
            All categories
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => set("category", c.name)}
              className={pillClass(value.category === c.name)}
            >
              <span className="mr-2">{c.emoji}</span>
              {c.name}
            </button>
          ))}
        </div>
      </section>

      {/* Price */}
      <section className="mb-6">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
          Price up to {formatPrice(value.maxPrice)}
        </h4>
        <input
          type="range"
          min={100}
          max={5000}
          step={50}
          value={value.maxPrice}
          onChange={(e) => set("maxPrice", Number(e.target.value))}
          className="w-full accent-emerald-700"
          aria-label="Maximum price"
        />
        <div className="mt-1 flex justify-between text-[11px] text-stone-500">
          <span>{formatPrice(100)}</span>
          <span>{formatPrice(5000)}+</span>
        </div>
      </section>

      {/* Stock & weight */}
      <section className="mb-6 space-y-2 border-t border-stone-100 pt-4">
        <label className="flex items-center gap-3 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={value.inStockOnly}
            onChange={(e) => set("inStockOnly", e.target.checked)}
            className="h-4 w-4 rounded border-stone-300 text-emerald-700 focus:ring-emerald-600"
          />
          In stock only
        </label>
        <label className="flex items-center gap-3 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={value.weighedOnly}
            onChange={(e) => set("weighedOnly", e.target.checked)}
            className="h-4 w-4 rounded border-stone-300 text-emerald-700 focus:ring-emerald-600"
          />
          Sold by weight
        </label>
      </section>

      {/* Sort */}
      <section className="border-t border-stone-100 pt-4">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
          Sort
        </h4>
        <select
          value={value.sort}
          onChange={(e) => set("sort", e.target.value as FilterState["sort"])}
          className="input py-2 text-sm"
        >
          <option value="relevance">Relevance</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="rating-desc">Customer rating</option>
        </select>
      </section>
    </aside>
  );
}

function pillClass(active: boolean) {
  return [
    "flex items-center rounded-xl px-3 py-2 text-left text-sm transition",
    active
      ? "bg-emerald-50 font-semibold text-emerald-800"
      : "text-stone-700 hover:bg-stone-100",
  ].join(" ");
}
