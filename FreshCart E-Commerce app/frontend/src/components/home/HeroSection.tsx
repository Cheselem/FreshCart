import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-stone-50 to-lime-50">
      <div className="container relative grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <div className="relative z-10">
          <span className="chip-lime mb-4 inline-flex">
            <Icon name="leaf" size={14} /> Same-day delivery
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-emerald-950 sm:text-5xl lg:text-6xl">
            Groceries that arrive <span className="text-emerald-700">crisp</span>,
            <br className="hidden sm:block" /> not exhausted.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-stone-700">
            Order produce, pantry staples, and household essentials from local
            suppliers — picked the day you order, delivered in the 2-hour window
            you choose. Transparent pricing, even on items sold by weight.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/catalog" className="btn-primary text-base">
              Shop the catalog
              <Icon name="chevron-right" size={18} />
            </Link>
            <Link href="/register" className="btn-outline text-base">
              Create an account
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-600">
            <li className="flex items-center gap-2"><Icon name="check" className="text-emerald-700" /> Free over KSh 3,500</li>
            <li className="flex items-center gap-2"><Icon name="check" className="text-emerald-700" /> Cancel any time</li>
            <li className="flex items-center gap-2"><Icon name="check" className="text-emerald-700" /> Pay with Stripe, PayPal, M-Pesa</li>
          </ul>
        </div>

        {/* Decorative basket illustration (pure SVG, no remote image required) */}
        <div className="relative hidden lg:block">
          <BasketIllustration />
        </div>
      </div>
    </section>
  );
}

function BasketIllustration() {
  return (
    <svg viewBox="0 0 560 460" className="mx-auto h-full w-full max-w-lg drop-shadow-xl">
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d1fae5" />
          <stop offset="100%" stopColor="#ecfdf5" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="basket" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a3e635" />
          <stop offset="100%" stopColor="#65a30d" />
        </linearGradient>
      </defs>
      <circle cx="280" cy="230" r="220" fill="url(#bg)" />
      {/* basket */}
      <path d="M120 260 h320 l-30 140 a30 30 0 0 1-30 24 H180 a30 30 0 0 1-30-24 z" fill="url(#basket)" />
      <rect x="100" y="240" width="360" height="30" rx="10" fill="#047857" />
      {/* lettuce */}
      <ellipse cx="200" cy="240" rx="70" ry="55" fill="#10b981" />
      <ellipse cx="200" cy="225" rx="60" ry="45" fill="#34d399" />
      {/* tomato */}
      <circle cx="290" cy="240" r="45" fill="#ef4444" />
      <path d="M270 200 q20-20 40 0" stroke="#15803d" strokeWidth="6" fill="none" />
      {/* bread */}
      <ellipse cx="370" cy="240" rx="55" ry="35" fill="#d97706" />
      <path d="M325 230 q45-20 90 0" stroke="#92400e" strokeWidth="4" fill="none" />
      {/* avocado */}
      <ellipse cx="150" cy="265" rx="28" ry="38" fill="#15803d" />
      <ellipse cx="150" cy="270" rx="18" ry="26" fill="#bef264" />
      <circle cx="150" cy="275" r="8" fill="#78350f" />
      {/* price tag */}
      <g transform="translate(380,80)">
        <rect x="0" y="0" width="120" height="50" rx="10" fill="#fff" stroke="#a7f3d0" />
        <text x="60" y="22" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="12" fill="#065f46">
          Today, 4–6 PM
        </text>
        <text x="60" y="40" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="14" fontWeight="bold" fill="#047857">
          Free delivery
        </text>
      </g>
    </svg>
  );
}
