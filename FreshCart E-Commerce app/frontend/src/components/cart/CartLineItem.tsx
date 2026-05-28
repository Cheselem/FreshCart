"use client";

import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { useCart } from "@/context/CartContext";
import { formatPrice, lineSubtotal } from "@/lib/format";
import type { CartLine } from "@/lib/types";

export function CartLineItem({ line }: { line: CartLine }) {
  const { setQty, remove } = useCart();
  const step = line.product.is_weighed ? 0.25 : 1;

  return (
    <article className="flex gap-4 border-b border-stone-100 py-5 last:border-0">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-100">
        <Image
          src={line.product.image_url}
          alt={line.product.name}
          fill
          sizes="80px"
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold text-stone-900">{line.product.name}</h4>
            <p className="text-xs text-stone-500">
              {line.product.brand && <>{line.product.brand} • </>}
              {line.product.is_weighed
                ? `${formatPrice(line.product.unit_price)} / kg`
                : `${formatPrice(line.product.unit_price)} each`}
            </p>
            {line.product.is_weighed && (
              <Badge tone="amber" className="mt-1.5">Estimated by weight</Badge>
            )}
          </div>

          <button
            onClick={() => remove(line.product.id)}
            className="text-stone-400 hover:text-red-600"
            aria-label="Remove from cart"
          >
            <Icon name="trash" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center rounded-xl border border-stone-200 bg-white">
            <button
              onClick={() => setQty(line.product.id, line.quantity - step)}
              className="grid h-9 w-9 place-items-center text-stone-700 hover:bg-stone-50"
              aria-label="Decrease"
            >
              <Icon name="minus" size={16} />
            </button>
            <span className="min-w-[60px] px-2 text-center font-semibold text-stone-900">
              {line.product.is_weighed
                ? `${line.quantity.toFixed(2)} kg`
                : line.quantity}
            </span>
            <button
              onClick={() => setQty(line.product.id, line.quantity + step)}
              className="grid h-9 w-9 place-items-center text-stone-700 hover:bg-stone-50"
              aria-label="Increase"
            >
              <Icon name="plus" size={16} />
            </button>
          </div>
          <span className="text-base font-bold text-emerald-900">
            {formatPrice(lineSubtotal(line))}
          </span>
        </div>
      </div>
    </article>
  );
}
