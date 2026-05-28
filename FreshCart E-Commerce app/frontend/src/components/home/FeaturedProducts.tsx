import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

export function FeaturedProducts() {
  // pick a mix of weighed + packaged
  const featured = MOCK_PRODUCTS.filter((p) =>
    ["FP-BAN-001", "FP-AVO-014", "BK-SDG-003", "DE-EGG-012", "BV-CFE-011", "FP-SPI-022", "PN-OIL-009", "MS-SAL-005"].includes(p.sku)
  );

  return (
    <section className="container pb-14">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-emerald-950 sm:text-3xl">
            This week's freshest
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            Hand-picked by our merchandisers, restocked daily.
          </p>
        </div>
        <Link href="/catalog" className="btn-ghost">All products →</Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {featured.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
