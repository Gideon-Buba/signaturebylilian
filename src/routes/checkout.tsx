import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Reveal } from "@/components/Reveal";
import { useCart } from "@/lib/cart";
import { NIGERIAN_STATES } from "@/lib/nigeria-states";
import { createOrderFn } from "@/server-fns/orders";

const title = "Checkout — Signature by Lilian";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  if (placedOrderId) {
    return (
      <section className="mx-auto max-w-[1440px] px-5 py-24 text-center lg:px-10">
        <Reveal>
          <p className="eyebrow text-magenta">Order Received</p>
          <h1 className="mt-4 font-serif text-4xl text-foreground lg:text-5xl">Thank you</h1>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Your order has been received. We'll reach out on the phone number you provided to
            confirm details and arrange payment — online payment is coming soon.
          </p>
          <p className="mt-2 text-xs tracking-[0.18em] text-muted-foreground uppercase">
            Order reference: {placedOrderId.slice(0, 8)}
          </p>
          <Link
            to="/skincare"
            className="eyebrow mt-9 inline-block bg-plum px-8 py-4 text-primary-foreground transition-colors hover:bg-magenta"
          >
            Continue Shopping
          </Link>
        </Reveal>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-[1440px] px-5 py-24 text-center lg:px-10">
        <Reveal>
          <p className="eyebrow text-magenta">Checkout</p>
          <h1 className="mt-4 font-serif text-4xl text-foreground lg:text-5xl">
            Your cart is empty
          </h1>
          <Link
            to="/skincare"
            className="eyebrow mt-9 inline-block bg-plum px-8 py-4 text-primary-foreground transition-colors hover:bg-magenta"
          >
            Shop Skincare
          </Link>
        </Reveal>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24">
      <Reveal>
        <p className="eyebrow text-magenta">Checkout</p>
        <h1 className="mt-4 font-serif text-4xl text-foreground lg:text-5xl">
          Delivery details
        </h1>
      </Reveal>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <Reveal>
          <form
            id="checkout-form"
            className="grid gap-5"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const formData = new FormData(form);
              const customerName = String(formData.get("name") ?? "").trim();
              const phone = String(formData.get("phone") ?? "").trim();
              const email = String(formData.get("email") ?? "").trim();
              const street = String(formData.get("street") ?? "").trim();
              const city = String(formData.get("city") ?? "").trim();
              const state = String(formData.get("state") ?? "").trim();
              const landmark = String(formData.get("landmark") ?? "").trim();
              const address = [street, city, state, landmark && `Near ${landmark}`]
                .filter(Boolean)
                .join(", ");
              const notes = String(formData.get("notes") ?? "").trim();

              setSubmitting(true);
              try {
                const result = await createOrderFn({
                  data: {
                    customerName,
                    phone,
                    email,
                    address,
                    notes,
                    items: items.map((item) => ({
                      productId: item.productId,
                      productName: item.name,
                      size: item.size,
                      unitPrice: item.price,
                      quantity: item.quantity,
                    })),
                  },
                });
                clear();
                setPlacedOrderId(result.orderId);
              } catch (error) {
                toast.error("Couldn't place order", {
                  description: error instanceof Error ? error.message : "Please try again.",
                });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full Name" name="name" />
              <Field label="Phone Number" name="phone" type="tel" />
            </div>
            <Field label="Email (optional)" name="email" type="email" required={false} />

            <div className="grid gap-5">
              <label className="grid gap-2">
                <span className="eyebrow text-muted-foreground">Street Address</span>
                <textarea
                  required
                  name="street"
                  rows={2}
                  placeholder="House number, street name, area"
                  className="border border-input bg-background px-4 py-3.5 text-sm text-foreground outline-none focus:border-accent"
                />
              </label>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="City / Town" name="city" />
                <label className="grid gap-2">
                  <span className="eyebrow text-muted-foreground">State</span>
                  <select
                    required
                    name="state"
                    defaultValue=""
                    className="border border-input bg-background px-4 py-3.5 text-sm text-foreground outline-none focus:border-accent"
                  >
                    <option value="" disabled>
                      Select state
                    </option>
                    {NIGERIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <Field label="Nearest Landmark (optional)" name="landmark" required={false} />
            </div>

            <label className="grid gap-2">
              <span className="eyebrow text-muted-foreground">Order Notes (optional)</span>
              <textarea
                name="notes"
                rows={3}
                className="border border-input bg-background px-4 py-3.5 text-sm text-foreground outline-none focus:border-accent"
              />
            </label>
          </form>
        </Reveal>

        <Reveal delay={100}>
          <div className="border border-border bg-card p-7 lg:p-8">
            <h2 className="font-serif text-2xl text-foreground">Order Summary</h2>
            <ul className="mt-6 divide-y divide-border border-t border-border">
              {items.map((item) => (
                <li key={item.productId} className="flex justify-between gap-4 py-3 text-sm">
                  <span className="text-foreground">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="text-muted-foreground">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-5">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-serif text-lg text-foreground">
                ₦{subtotal.toLocaleString()}
              </span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Payment is arranged after we confirm your order — online payment is coming soon.
            </p>
            <button
              type="submit"
              form="checkout-form"
              disabled={submitting}
              className="eyebrow mt-7 block w-full bg-plum py-4 text-center text-primary-foreground transition-colors hover:bg-magenta disabled:opacity-50"
            >
              {submitting ? "Placing Order…" : "Place Order"}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = true,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2">
      <span className="eyebrow text-muted-foreground">{label}</span>
      <input
        required={required}
        type={type}
        name={name}
        className="border border-input bg-background px-4 py-3.5 text-sm text-foreground outline-none focus:border-accent"
      />
    </label>
  );
}
