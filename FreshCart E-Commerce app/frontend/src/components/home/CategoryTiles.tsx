import Link from "next/link";
import { CATEGORIES } from "@/lib/mock-data";

export function CategoryTiles() {
  return (
    <section className="container py-14">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-emerald-950 sm:text-3xl">Shop by aisle</h2>
          <p className="mt-1 text-sm text-stone-600">
            Eight tightly curated departments, restocked every morning.
          </p>
        </div>
        <Link href="/catalog" className="hidden btn-ghost sm:inline-flex">
          See full catalog →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {CATEGORIES.map((c) => (
          <Link
            key={c.name}
            href={`/catalog?category=${encodeURIComponent(c.name)}`}
            className="card group relative flex flex-col gap-3 overflow-hidden p-5 transition hover:-translate-y-0.5 hover:shadow-pop"
          >
            <span className="text-4xl">{c.emoji}</span>
            <div>
              <h3 className="text-base font-semibold text-stone-900">{c.name}</h3>
              <p className="text-xs text-stone-500">{c.tagline}</p>
            </div>
            <span className="absolute right-4 top-4 text-stone-300 transition group-hover:translate-x-1 group-hover:text-emerald-700">
              →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
