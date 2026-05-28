"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Icon } from "@/components/ui/Icon";
import { getOrder } from "@/lib/api";
import type { OrderStatus } from "@/lib/types";

const STAGES: { key: OrderStatus; label: string; icon: "credit-card" | "check" | "package" | "truck" }[] = [
  { key: "PENDING_PAYMENT",   label: "Verifying payment",  icon: "credit-card" },
  { key: "CONFIRMED",         label: "Order confirmed",    icon: "check" },
  { key: "PACKED",            label: "Packed at the hub",  icon: "package" },
  { key: "OUT_FOR_DELIVERY",  label: "Out for delivery",   icon: "truck" },
  { key: "DELIVERED",         label: "Delivered",          icon: "check" },
];

export default function OrderSuccessPage() {
  const params = useSearchParams();
  const orderId = params.get("order") ?? "demo-order";
  const provider = params.get("provider") ?? "stripe";

  const [status, setStatus] = useState<OrderStatus>("PENDING_PAYMENT");

  /**
   * Short-polling per UX-flow §2.5: every 3 s, ask the backend for the
   * current order status until we reach DELIVERED. The mock API
   * advances the state deterministically, so this also doubles as a
   * demo of the transition animation.
   */
  useEffect(() => {
    let stop = false;
    const tick = async () => {
      try {
        const order = await getOrder(orderId);
        if (!stop) setStatus(order.status);
      } catch { /* swallow; will retry next tick */ }
      if (!stop && status !== "DELIVERED") setTimeout(tick, 3000);
    };
    tick();
    return () => { stop = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const stageIdx = STAGES.findIndex((s) => s.key === status);

  return (
    <>
      <Header />
      <main className="container py-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Icon name="check" size={32} />
          </span>
          <h1 className="mt-4 text-3xl font-bold text-stone-900">
            {status === "PENDING_PAYMENT"
              ? "Verifying your payment…"
              : "Thanks for your order!"}
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Order <span className="font-medium text-stone-900">#{orderId}</span> · paid with{" "}
            <span className="font-medium capitalize text-stone-900">{provider}</span>
          </p>
        </div>

        <ol className="mx-auto mt-12 max-w-3xl space-y-4">
          {STAGES.map((s, i) => {
            const done = i < stageIdx;
            const active = i === stageIdx;
            return (
              <li
                key={s.key}
                className={[
                  "flex items-start gap-4 rounded-2xl border p-4 transition",
                  done   && "border-emerald-200 bg-emerald-50/60",
                  active && "border-emerald-700 bg-white shadow-pop",
                  !done && !active && "border-stone-200 bg-white",
                ].filter(Boolean).join(" ")}
              >
                <span
                  className={[
                    "grid h-10 w-10 shrink-0 place-items-center rounded-full",
                    done   && "bg-emerald-600 text-white",
                    active && "bg-emerald-700 text-white animate-pulse",
                    !done && !active && "bg-stone-100 text-stone-500",
                  ].filter(Boolean).join(" ")}
                >
                  <Icon name={s.icon} />
                </span>
                <div className="flex-1">
                  <h3 className={`text-sm font-semibold ${active ? "text-emerald-900" : "text-stone-900"}`}>
                    {s.label}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {done
                      ? "Completed"
                      : active
                        ? "In progress — this page polls every 3 seconds."
                        : "Pending"}
                  </p>
                </div>
                {done && <Icon name="check" className="text-emerald-700" />}
              </li>
            );
          })}
        </ol>

        <div className="mx-auto mt-10 flex max-w-3xl items-center justify-between rounded-2xl bg-stone-100 px-6 py-4 text-sm">
          <span className="text-stone-700">
            We'll text you when your order leaves the hub.
          </span>
          <Link href="/catalog" className="btn-outline">Continue shopping</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
