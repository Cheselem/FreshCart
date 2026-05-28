"use client";

import clsx from "clsx";
import type { SubstitutionRule } from "@/lib/types";

const options: { value: SubstitutionRule; title: string; body: string }[] = [
  { value: "CHOOSE_ALTERNATIVE", title: "Pick an alternative", body: "Our shopper substitutes a similar brand of equal or higher value." },
  { value: "CONTACT_BUYER",      title: "Text me",              body: "We'll message you to confirm before substituting anything." },
  { value: "REFUND",             title: "Refund missing items", body: "Skip substitutes and refund the difference to your card." },
];

export function SubstitutionRuleSelect({
  value,
  onChange,
}: {
  value: SubstitutionRule;
  onChange: (v: SubstitutionRule) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {options.map((o) => {
        const selected = value === o.value;
        return (
          <label
            key={o.value}
            className={clsx(
              "cursor-pointer rounded-xl border p-4 transition",
              selected
                ? "border-emerald-700 bg-emerald-50 shadow-pop"
                : "border-stone-200 bg-white hover:border-emerald-300"
            )}
          >
            <input
              type="radio"
              name="substitution"
              value={o.value}
              checked={selected}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            <span className="block text-sm font-semibold text-stone-900">{o.title}</span>
            <span className="mt-1 block text-xs text-stone-600">{o.body}</span>
          </label>
        );
      })}
    </div>
  );
}
