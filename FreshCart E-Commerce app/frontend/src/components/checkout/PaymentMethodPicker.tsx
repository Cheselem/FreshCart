"use client";

import clsx from "clsx";
import { Icon } from "@/components/ui/Icon";

type Provider = "stripe" | "paypal" | "mpesa";

const providers: { value: Provider; title: string; subtitle: string }[] = [
  { value: "stripe", title: "Credit / debit card", subtitle: "Visa, Mastercard, Amex — processed by Stripe" },
  { value: "paypal", title: "PayPal",              subtitle: "You'll be redirected to PayPal to authorize" },
  { value: "mpesa",  title: "M-Pesa",              subtitle: "Pay via Safaricom STK push to your phone" },
];

export function PaymentMethodPicker({
  value,
  onChange,
}: {
  value: Provider;
  onChange: (v: Provider) => void;
}) {
  return (
    <div className="space-y-2">
      {providers.map((p) => {
        const selected = value === p.value;
        return (
          <label
            key={p.value}
            className={clsx(
              "flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition",
              selected
                ? "border-emerald-700 bg-emerald-50 shadow-pop"
                : "border-stone-200 bg-white hover:border-emerald-300"
            )}
          >
            <input
              type="radio"
              name="payment"
              value={p.value}
              checked={selected}
              onChange={() => onChange(p.value)}
              className="h-4 w-4 text-emerald-700 focus:ring-emerald-600"
            />
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-700/10 text-emerald-800">
              <Icon name="credit-card" />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold text-stone-900">{p.title}</span>
              <span className="block text-xs text-stone-500">{p.subtitle}</span>
            </span>
            {selected && (
              <Icon name="check" className="text-emerald-700" />
            )}
          </label>
        );
      })}
    </div>
  );
}
