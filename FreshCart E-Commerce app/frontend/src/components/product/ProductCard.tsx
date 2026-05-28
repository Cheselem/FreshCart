"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { useCart } from "@/context/CartContext";
import { formatPrice, formatWeight, unitLabel } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const { add, lines, setQty, remove } = useCart();
  const line = lines.find((l) => l.product.id === product.id);
  const inCart = !!line;
  const step = product.is_weighed ? 0.25 : 1;
  const outOfStock = product.stock_quantity <= 0;

  const badgeMap: Record<string, { tone: "lime" | "emerald" | "amber"; label: string }> = {
    organic: { tone: "lime",    label: "Organic" },
    local:   { tone: "emerald", label: "Local" },
    sale:    { tone: "amber",   label: "Sale" },
    new:     { tone: "lime",    label: "New" },
  };

  return (
    <article className="card group relative overflow-hidden">
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />
        {product.badges?.length ? (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1">
            {product.badges.map((b) => (
              <Badge key={b} tone={badgeMap[b].tone}>
                {badgeMap[b].label}
              </Badge>
            ))}
          </div>
        ) : null}
        {product.is_weighed && (
          <Badge tone="stone" className="absolute right-3 top-3 bg-white/90">
            By weight
          </Badge>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-1.5 p-4">
        {product.brand && (
          <span className="text-xs uppercase tracking-wide text-stone-500">
            {product.brand}
          </span>
        )}
        <h3 className="text-sm font-semibold text-stone-900 line-clamp-2">
          {product.name}
        </h3>

        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-lg font-bold text-emerald-900">
            {formatPrice(product.unit_price)}
          </span>
          <span className="text-xs text-stone-500">{unitLabel(product)}</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-stone-500">
          <Icon name="star" size={14} className="text-amber-500" />
          <span>{product.rating.toFixed(1)}</span>
          <span aria-hidden>•</span>
          <span>
            {outOfStock
              ? "Out of stock"
              : product.is_weighed
                ? `${formatWeight(product.stock_quantity)} left`
                : `${product.stock_quantity} in stock`}
          </span>
        </div>

        {/* Add / qty stepper */}
        <div className="mt-3">
          {!inCart ? (
            <button
              type="button"
              disabled={outOfStock}
              onClick={() => add(product)}
              className="btn-accent w-full"
            >
              <Icon name="plus" size={16} />
              Add to cart
            </button>
          ) : (
            <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-1">
              <button
                onClick={() =>
                  line!.quantity <= step
                    ? remove(product.id)
                    : setQty(product.id, line!.quantity - step)
                }
                className="grid h-9 w-9 place-items-center rounded-lg bg-white text-emerald-800 hover:bg-emerald-100"
                aria-label="Decrease"
              >
                <Icon name="minus" size={16} />
              </button>
              <span className="font-semibold text-emerald-900">
                {product.is_weighed
                  ? `${line!.quantity.toFixed(2)} kg`
                  : `${line!.quantity}`}
              </span>
              <button
                onClick={() => add(product)}
                className="grid h-9 w-9 place-items-center rounded-lg bg-white text-emerald-800 hover:bg-emerald-100"
                aria-label="Increase"
              >
                <Icon name="plus" size={16} />
              </button>
            </div>
          )}
        </div>

        {product.is_weighed && inCart && (
          <p className="mt-1 text-[11px] italic text-stone-500">
            Estimated cost based on weight — adjusted at fulfillment.
          </p>
        )}
      </div>
    </article>
  );
}
