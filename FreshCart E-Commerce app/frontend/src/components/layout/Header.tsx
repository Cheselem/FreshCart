"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/format";
import clsx from "clsx";

interface Props {
  /** Optional search-input slot — pages can replace it with a live one. */
  searchSlot?: React.ReactNode;
}

export function Header({ searchSlot }: Props) {
  const { count, totals } = useCart();
  const { isAuthed, email, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="container flex h-16 items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-emerald-900">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-700 text-white">
            <Icon name="leaf" size={18} />
          </span>
          <span className="text-lg tracking-tight">FreshCart</span>
        </Link>

        {/* Search (desktop) */}
        <div className="hidden flex-1 md:block">
          {searchSlot ?? (
            <Link
              href="/catalog"
              className="input flex items-center gap-2 text-stone-400 hover:bg-stone-50"
            >
              <Icon name="search" size={18} />
              Search produce, pantry, bakery…
            </Link>
          )}
        </div>

        {/* Right cluster */}
        <nav className="ml-auto flex items-center gap-2">
          <Link href="/catalog" className="hidden btn-ghost md:inline-flex">
            Catalog
          </Link>

          {isAuthed ? (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-stone-600 max-w-[160px] truncate" title={email!}>
                {email}
              </span>
              <button onClick={signOut} className="btn-outline">Sign out</button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login" className="btn-ghost">Sign in</Link>
              <Link href="/register" className="btn-primary">Get started</Link>
            </div>
          )}

          <Link
            href="/cart"
            className="relative inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 hover:bg-stone-50"
          >
            <Icon name="cart" size={18} />
            <span className="hidden sm:inline">
              {formatPrice(totals.subtotal)}
            </span>
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-lime-400 px-1 text-[11px] font-bold text-emerald-900 ring-2 ring-white">
                {count}
              </span>
            )}
          </Link>

          <button
            className="md:hidden btn-ghost"
            onClick={() => setOpen((o) => !o)}
            aria-label="Open menu"
          >
            <Icon name={open ? "x" : "menu"} />
          </button>
        </nav>
      </div>

      {/* Mobile search */}
      <div className="container pb-3 md:hidden">{searchSlot}</div>

      {/* Mobile drawer */}
      <div
        className={clsx(
          "md:hidden overflow-hidden border-t border-stone-100 bg-white transition-[max-height]",
          open ? "max-h-72" : "max-h-0"
        )}
      >
        <div className="container flex flex-col py-3 text-sm">
          <Link href="/catalog" className="py-2">Catalog</Link>
          {isAuthed ? (
            <>
              <span className="py-2 text-stone-500">{email}</span>
              <button onClick={signOut} className="py-2 text-left text-red-600">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="py-2">Sign in</Link>
              <Link href="/register" className="py-2 font-semibold text-emerald-700">Get started →</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
