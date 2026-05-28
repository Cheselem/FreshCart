"use client";

import { formatPrice } from "@/lib/format";
import { useCart } from "@/context/CartContext";

interface Props {
  extraFee?: number;          // slot surcharge, etc.
  ctaLabel?: string;
  ctaHref?: string;
  ctaLoading?: boolean;
  onCta?: () => void;
  caption?: React.ReactNode;
}

export function OrderSummary({
  extraFee = 0, ctaLabel, ctaHref, ctaLoading, onCta, caption,
}: Props) {
  const { totals, count, lines } = useCart();
  const hasWeighed = lines.some((l) => l.product.is_weighed);
  const total = totals.total + extraFee;

  return (
    <aside className="card sticky top-24 flex flex-col gap-3 p-5">
      <h3 className="text-base font-semibold text-stone-900">Order summary</h3>

      <dl className="mt-2 space-y-2 text-sm text-stone-700">
        <Row label={`Subtotal (${count} item${count === 1 ? "" : "s"})`} value={formatPrice(totals.subtotal)} />
        <Row label="Tax (8.5%)" value={formatPrice(totals.tax)} />
        <Row label="Delivery fee" value={formatPrice(totals.deliveryFee)} />
        {extraFee > 0 && (
          <Row label="Express slot surcharge" value={formatPrice(extraFee)} />
        )}
      </dl>

      <hr className="border-stone-200" />

      <div className="flex items-center justify-between text-base font-bold text-emerald-900">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>

      {hasWeighed && (
        <p className="text-[11px] italic text-stone-500">
          Weighed items are estimated. Final billed amount may vary up to ±10%
          based on actual pick weight (FR-015).
        </p>
      )}

      {caption}

      {ctaLabel && (
        ctaHref ? (
          <a href={ctaHref} className="btn-accent mt-2 text-base">
            {ctaLabel}
          </a>
        ) : (
          <button
            type="button"
            onClick={onCta}
            disabled={count === 0 || ctaLoading}
            className="btn-accent mt-2 text-base"
          >
            {ctaLoading && (
              <span
                aria-hidden
                className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              />
            )}
            {ctaLabel}
          </button>
        )
      )}
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-stone-600">{label}</dt>
      <dd className="font-medium text-stone-900">{value}</dd>
    </div>
  );
}
