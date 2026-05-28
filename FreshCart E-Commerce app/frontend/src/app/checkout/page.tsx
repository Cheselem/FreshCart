"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { DeliverySlotPicker } from "@/components/checkout/DeliverySlotPicker";
import { SubstitutionRuleSelect } from "@/components/checkout/SubstitutionRuleSelect";
import { PaymentMethodPicker } from "@/components/checkout/PaymentMethodPicker";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { useCart } from "@/context/CartContext";
import { generateDeliverySlots } from "@/lib/mock-data";
import { checkout, ApiError } from "@/lib/api";
import type { DeliverySlot, SubstitutionRule } from "@/lib/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, clear } = useCart();
  const slots = useMemo(() => generateDeliverySlots(), []);

  // Form state
  const [address, setAddress] = useState({
    fullName: "", street: "", apt: "", city: "", postal: "", phone: "", notes: "",
  });
  const [slot, setSlot] = useState<DeliverySlot | null>(slots[0] ?? null);
  const [substitution, setSubstitution] = useState<SubstitutionRule>("CHOOSE_ALTERNATIVE");
  const [payment, setPayment] = useState<"stripe" | "paypal" | "mpesa">("stripe");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Force a delivery slot, address line, and city — matches FR-010.
  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!address.fullName.trim()) next.fullName = "Required.";
    if (!address.street.trim())   next.street   = "Required.";
    if (!address.city.trim())     next.city     = "Required.";
    if (!/^\+?[0-9\s\-]{7,}$/.test(address.phone)) next.phone = "Enter a valid phone.";
    if (!slot)                     next.slot    = "Pick a delivery window.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onPlaceOrder() {
    setServerError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await checkout({
        items: lines.map((l) => ({ product_id: l.product.id, quantity: l.quantity })),
        substitution_rule: substitution,
        delivery_slot: slot!.iso,
        payment_method: payment,
      });
      // Per spec §2.4, server returns a payment-gateway URL that the
      // client redirects to. In mock mode that URL is /orders/success.
      clear();
      router.push(`${res.payment_gateway_url}${res.payment_gateway_url.includes("?") ? "&" : "?"}order=${res.order_id}`);
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 422
          ? "Some items are out of stock. Please review your cart."
          : "Couldn't reach the payment gateway. Try again in a moment.";
      setServerError(message);
      setSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <>
        <Header />
        <main className="container py-16">
          <div className="card mx-auto max-w-md p-10 text-center">
            <h1 className="text-xl font-semibold">Your cart is empty</h1>
            <p className="mt-2 text-sm text-stone-600">
              Add items first, then we'll bring you back here.
            </p>
            <Link href="/catalog" className="btn-primary mt-6 inline-flex">
              Go to catalog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container py-8">
        <CheckoutStepper step={1} />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <Section
              num={1}
              title="Delivery address"
              caption="Where should we drop your order?"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Full name"
                  name="fullName"
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  error={errors.fullName}
                />
                <Input
                  label="Phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 555 123 4567"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  error={errors.phone}
                />
                <Input
                  label="Street address"
                  name="street"
                  className="sm:col-span-2"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  error={errors.street}
                />
                <Input
                  label="Apartment / unit (optional)"
                  name="apt"
                  value={address.apt}
                  onChange={(e) => setAddress({ ...address, apt: e.target.value })}
                />
                <Input
                  label="City"
                  name="city"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  error={errors.city}
                />
                <Input
                  label="Postal code"
                  name="postal"
                  value={address.postal}
                  onChange={(e) => setAddress({ ...address, postal: e.target.value })}
                  className="sm:col-span-2"
                />
                <Input
                  label="Delivery instructions (optional)"
                  name="notes"
                  placeholder="Leave at the front desk, code #4283…"
                  className="sm:col-span-2"
                  value={address.notes}
                  onChange={(e) => setAddress({ ...address, notes: e.target.value })}
                />
              </div>
            </Section>

            <Section
              num={2}
              title="Delivery window"
              caption="2-hour blocks — capacity updates in real time."
            >
              <DeliverySlotPicker
                slots={slots}
                value={slot?.iso ?? null}
                onChange={setSlot}
              />
              {errors.slot && (
                <p className="mt-2 text-xs text-red-600">{errors.slot}</p>
              )}
            </Section>

            <Section
              num={3}
              title="If something is out of stock…"
              caption="FR-014 — required before checkout."
            >
              <SubstitutionRuleSelect
                value={substitution}
                onChange={setSubstitution}
              />
            </Section>

            <Section
              num={4}
              title="Payment method"
              caption="You'll be redirected to the provider — we never store card numbers."
            >
              <PaymentMethodPicker value={payment} onChange={setPayment} />
            </Section>

            {serverError && (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {serverError}
              </div>
            )}
          </div>

          <OrderSummary
            extraFee={slot?.surcharge ?? 0}
            ctaLabel={`Pay ${payment === "mpesa" ? "with M-Pesa" : payment === "paypal" ? "with PayPal" : "securely"}`}
            ctaLoading={submitting}
            onCta={onPlaceOrder}
            caption={
              <p className="mt-2 flex items-center gap-2 text-xs text-stone-500">
                <Icon name="shield" size={14} className="text-emerald-700" />
                256-bit TLS · PCI-DSS providers
              </p>
            }
          />
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({
  num, title, caption, children,
}: {
  num: number;
  title: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card p-6">
      <header className="mb-4 flex items-start gap-3">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-700 text-sm font-semibold text-white">
          {num}
        </span>
        <div>
          <h2 className="text-base font-semibold text-stone-900">{title}</h2>
          {caption && <p className="text-xs text-stone-500">{caption}</p>}
        </div>
      </header>
      {children}
    </section>
  );
}

function CheckoutStepper({ step }: { step: number }) {
  const steps = ["Cart", "Checkout", "Payment", "Confirmation"];
  return (
    <ol className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
      {steps.map((label, i) => (
        <li key={label} className="flex items-center gap-2">
          <span
            className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold ${
              i <= step ? "bg-emerald-700 text-white" : "bg-stone-200 text-stone-600"
            }`}
          >
            {i + 1}
          </span>
          <span className={i === step ? "font-semibold text-stone-900" : ""}>{label}</span>
          {i < steps.length - 1 && <Icon name="chevron-right" size={14} className="text-stone-300" />}
        </li>
      ))}
    </ol>
  );
}
