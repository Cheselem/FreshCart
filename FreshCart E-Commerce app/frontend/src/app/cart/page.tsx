"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { Icon } from "@/components/ui/Icon";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { lines, count } = useCart();

  return (
    <>
      <Header />
      <main className="container py-8">
        <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">Your cart</h1>
        <p className="mt-1 text-sm text-stone-600">
          {count > 0
            ? `${count} item${count === 1 ? "" : "s"} ready for checkout`
            : "Your cart is empty — let's go shopping."}
        </p>

        {count === 0 ? (
          <EmptyCart />
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            <section className="card p-2 sm:p-6">
              {lines.map((line) => (
                <CartLineItem key={line.product.id} line={line} />
              ))}
            </section>

            <OrderSummary
              ctaLabel="Continue to checkout"
              ctaHref="/checkout"
              caption={
                <p className="mt-2 flex items-center gap-2 text-xs text-stone-500">
                  <Icon name="shield" size={14} className="text-emerald-700" />
                  Secured by HTTPS — no card data touches our servers.
                </p>
              }
            />
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

function EmptyCart() {
  return (
    <div className="card mt-8 flex flex-col items-center gap-4 p-12 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-700">
        <Icon name="cart" size={28} />
      </span>
      <h2 className="text-lg font-semibold text-stone-900">Nothing in here yet</h2>
      <p className="max-w-sm text-sm text-stone-600">
        Browse the catalog and tap "Add to cart" to start filling your basket.
      </p>
      <Link href="/catalog" className="btn-primary mt-2">
        Start shopping
      </Link>
    </div>
  );
}
