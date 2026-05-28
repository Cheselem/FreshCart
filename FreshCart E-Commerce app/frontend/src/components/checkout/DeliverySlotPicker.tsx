"use client";

import { Icon } from "@/components/ui/Icon";
import { formatPrice } from "@/lib/format";
import type { DeliverySlot } from "@/lib/types";
import clsx from "clsx";

interface Props {
  slots: DeliverySlot[];
  value: string | null;
  onChange: (slot: DeliverySlot) => void;
}

export function DeliverySlotPicker({ slots, value, onChange }: Props) {
  // group by day-label
  const groups = slots.reduce<Record<string, DeliverySlot[]>>((acc, s) => {
    const day = s.label.split(",")[0];
    acc[day] = acc[day] ? [...acc[day], s] : [s];
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {Object.entries(groups).map(([day, daySlots]) => (
        <section key={day}>
          <header className="mb-2 flex items-center gap-2 text-sm font-semibold text-stone-800">
            <Icon name="clock" size={16} className="text-emerald-700" />
            {day}
          </header>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {daySlots.map((s) => {
              const selected = value === s.iso;
              const sold = s.remaining <= 0;
              return (
                <button
                  key={s.iso}
                  type="button"
                  disabled={sold}
                  onClick={() => onChange(s)}
                  className={clsx(
                    "rounded-xl border px-3 py-3 text-left text-sm transition",
                    selected
                      ? "border-emerald-700 bg-emerald-50 text-emerald-900 shadow-pop"
                      : "border-stone-200 bg-white text-stone-800 hover:border-emerald-300 hover:bg-emerald-50/40",
                    sold && "opacity-40 cursor-not-allowed"
                  )}
                >
                  <div className="font-semibold">{s.label.split(",")[1].trim()}</div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-stone-500">
                    <span>{sold ? "Sold out" : `${s.remaining} left`}</span>
                    {s.surcharge > 0 ? (
                      <span className="text-amber-700">+{formatPrice(s.surcharge)}</span>
                    ) : (
                      <span className="text-emerald-700">Free</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
