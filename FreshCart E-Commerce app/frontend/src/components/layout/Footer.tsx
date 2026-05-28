import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

const cols = [
  {
    title: "Shop",
    links: [
      ["Catalog", "/catalog"],
      ["Fresh Produce", "/catalog?category=Fresh+Produce"],
      ["Bakery", "/catalog?category=Bakery"],
      ["Pantry", "/catalog?category=Pantry"],
    ],
  },
  {
    title: "Account",
    links: [
      ["Sign in", "/login"],
      ["Create account", "/register"],
      ["My cart", "/cart"],
      ["Order tracking", "/orders/success"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About FreshCart", "#"],
      ["Sustainability", "#"],
      ["Careers", "#"],
      ["Press", "#"],
    ],
  },
  {
    title: "Help",
    links: [
      ["FAQ", "#"],
      ["Delivery zones", "#"],
      ["Returns & refunds", "#"],
      ["Contact support", "#"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-stone-200 bg-white">
      <div className="container grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 font-semibold text-emerald-900">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-700 text-white">
              <Icon name="leaf" size={18} />
            </span>
            FreshCart
          </div>
          <p className="mt-3 text-sm text-stone-600">
            Groceries delivered fresh — same-day windows, transparent pricing,
            and a cart that knows the difference between a pound and a piece.
          </p>
        </div>

        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="text-sm font-semibold text-stone-900">{c.title}</h4>
            <ul className="mt-3 space-y-2 text-sm text-stone-600">
              {c.links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="hover:text-emerald-700">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-stone-200 py-4">
        <div className="container flex flex-col items-center justify-between gap-2 text-xs text-stone-500 sm:flex-row">
          <span>© {new Date().getFullYear()} FreshCart, Inc. All rights reserved.</span>
          <span className="flex items-center gap-3">
            <Link href="#" className="hover:text-stone-700">Privacy</Link>
            <Link href="#" className="hover:text-stone-700">Terms</Link>
            <Link href="#" className="hover:text-stone-700">Cookies</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
