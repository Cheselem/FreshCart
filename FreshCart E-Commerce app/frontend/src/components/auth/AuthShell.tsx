import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

/**
 * Two-column auth layout: form on the left, marketing panel on the right.
 * Per UX-flow doc §2.1 the gateway can be a route OR a modal — we ship the
 * route version, which gracefully falls back on phones.
 */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-stone-50">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Form */}
        <section className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <Link href="/" className="mb-8 inline-flex items-center gap-2 text-emerald-900">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-700 text-white">
                <Icon name="leaf" size={18} />
              </span>
              <span className="text-lg font-semibold">FreshCart</span>
            </Link>

            <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">{title}</h1>
            <p className="mt-1 text-sm text-stone-600">{subtitle}</p>

            <div className="mt-8 space-y-4">{children}</div>

            <div className="mt-8 text-sm text-stone-600">{footer}</div>
          </div>
        </section>

        {/* Marketing panel */}
        <aside className="relative hidden overflow-hidden bg-emerald-700 lg:flex lg:items-center lg:justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 to-emerald-900" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-lime-400/20 blur-3xl" />
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />

          <div className="relative max-w-md p-12 text-emerald-50">
            <span className="chip-lime">Trusted by 18,000+ households</span>
            <h2 className="mt-5 text-3xl font-bold leading-tight text-white">
              Skip the aisles. Keep your evening.
            </h2>
            <p className="mt-4 text-emerald-100">
              FreshCart members average 38 minutes saved per week and 12% lower
              spend than walking the store — same brands, fresher produce.
            </p>

            <dl className="mt-10 grid grid-cols-2 gap-6 text-emerald-100">
              <div>
                <dt className="text-3xl font-bold text-white">4.9★</dt>
                <dd className="text-sm">App Store rating</dd>
              </div>
              <div>
                <dt className="text-3xl font-bold text-white">120 min</dt>
                <dd className="text-sm">Median delivery window</dd>
              </div>
              <div>
                <dt className="text-3xl font-bold text-white">99.8%</dt>
                <dd className="text-sm">On-time arrivals</dd>
              </div>
              <div>
                <dt className="text-3xl font-bold text-white">35k+</dt>
                <dd className="text-sm">SKUs in catalog</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </main>
  );
}
