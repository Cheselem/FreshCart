import { Icon } from "@/components/ui/Icon";

const items = [
  {
    icon: "truck", title: "2-hour delivery windows",
    body: "Pick a slot today or tomorrow — we'll be there with a 10-minute on-the-way alert.",
  },
  {
    icon: "leaf", title: "Fresh-first sourcing",
    body: "Local farms and bakeries before national brands. If a peach is bruised, we don't ship it.",
  },
  {
    icon: "shield", title: "Transparent checkout",
    body: "Tax, fees, and weighted-item estimates shown up front — no surprises at the door.",
  },
  {
    icon: "credit-card", title: "Pay your way",
    body: "Stripe, PayPal, and M-Pesa supported. Payment data never touches our servers.",
  },
] as const;

export function PromiseBand() {
  return (
    <section className="bg-emerald-900 text-emerald-50">
      <div className="container grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.title} className="flex gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-800 text-lime-300">
              <Icon name={it.icon} />
            </div>
            <div>
              <h3 className="font-semibold text-white">{it.title}</h3>
              <p className="mt-1 text-sm text-emerald-100/80">{it.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
