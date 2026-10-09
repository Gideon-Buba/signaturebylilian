import { createFileRoute, Link } from "@tanstack/react-router";
import { Copy, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Reveal } from "@/components/Reveal";
import { useCart } from "@/lib/cart";
import { copyToClipboard } from "@/lib/clipboard";
import { NIGERIAN_STATES } from "@/lib/nigeria-states";
import { createOrderFn } from "@/server-fns/orders";
import { initializePaymentFn } from "@/server-fns/payments";

const title = "Checkout — Signature by Lilian";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title }] }),
  component: CheckoutPage,
});

type PendingOrder = { orderId: string; subtotal: number; email: string };

// TODO: placeholder — replace with Dr Lilian's real bank details.
const BANK_DETAILS = {
  bankName: "Premium Trust Bank",
  accountName: "Signature by Lilian",
  accountNumber: "0160069521",
};

const WHATSAPP_LINK = "https://wa.me/2349046004543";

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<PendingOrder | null>(null);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [starting, setStarting] = useState(false);

  // Hands the customer to Echezona's hosted checkout. They come back to
  // /checkout/callback, which confirms the payment server-side.
  const payOnline = async () => {
    if (!pendingOrder) return;
    setStarting(true);
    try {
      const { paymentUrl } = await initializePaymentFn({
        data: { orderId: pendingOrder.orderId, origin: window.location.origin },
      });
      window.location.assign(paymentUrl);
    } catch (error) {
      setStarting(false);
      toast.error("Couldn't start online payment", {
        description:
          error instanceof Error ? error.message : "Please try again or pay another way.",
      });
    }
  };

  if (pendingOrder) {
    const reference = pendingOrder.orderId.slice(0, 8);
    return (
      <section className="mx-auto max-w-[1440px] px-5 py-24 text-center lg:px-10">
        <Reveal>
          <p className="eyebrow text-magenta">Order Received</p>
          <h1 className="mt-4 font-serif text-4xl text-foreground lg:text-5xl">
            {completed ? "Thank you" : "Complete your payment"}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            {completed
              ? "Your order has been received. We'll confirm your transfer and reach out on the phone number you provided."
              : "Your order is saved. Pay securely online now, or choose to arrange payment with us directly."}
          </p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
              Order reference: {reference}
            </p>
            <button
              type="button"
              onClick={() => copyToClipboard(reference, "Reference")}
              aria-label="Copy order reference"
              className="text-muted-foreground transition-colors hover:text-accent"
            >
              <Copy className="size-3.5" />
            </button>
          </div>
          <p className="mt-6 font-serif text-2xl text-foreground">
            ₦{pendingOrder.subtotal.toLocaleString()}
          </p>

          {completed && (
            <p className="mx-auto mt-5 max-w-sm text-sm text-muted-foreground italic">
              Please note this number for your transaction.
            </p>
          )}

          {completed ? (
            <Link
              to="/skincare"
              className="eyebrow mt-9 inline-block bg-plum px-8 py-4 text-primary-foreground transition-colors hover:bg-magenta"
            >
              Continue Shopping
            </Link>
          ) : showBankDetails ? (
            <div className="mx-auto mt-9 max-w-sm text-left">
              <div className="border border-border bg-card p-6">
                <p className="eyebrow text-muted-foreground">Bank Transfer Details</p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Bank Name</dt>
                    <dd className="text-foreground">{BANK_DETAILS.bankName}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Account Name</dt>
                    <dd className="text-foreground">{BANK_DETAILS.accountName}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Account Number</dt>
                    <dd className="text-foreground">{BANK_DETAILS.accountNumber}</dd>
                  </div>
                </dl>
                <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                  Transfer ₦{pendingOrder.subtotal.toLocaleString()} and share your payment receipt
                  with us on WhatsApp, quoting your order reference.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <a
                    href={`${WHATSAPP_LINK}?text=${encodeURIComponent(
                      `Hi, I just made a bank transfer for order ${reference} (₦${pendingOrder.subtotal.toLocaleString()}). Here's my payment receipt:`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="eyebrow inline-flex items-center justify-center gap-2 border border-border px-3 py-3 text-center text-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    <MessageCircle className="size-4 shrink-0" />
                    WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(reference, "Reference")}
                    className="eyebrow inline-flex items-center justify-center gap-2 border border-border px-3 py-3 text-center text-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    <Copy className="size-4 shrink-0" />
                    Copy Ref
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  clear();
                  setCompleted(true);
                }}
                className="eyebrow mt-5 block w-full bg-plum py-4 text-center text-primary-foreground transition-colors hover:bg-magenta"
              >
                I've Sent the Transfer
              </button>
            </div>
          ) : (
            <div className="mt-9 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={payOnline}
                disabled={starting}
                className="eyebrow block w-full max-w-xs bg-plum px-8 py-4 text-center text-primary-foreground transition-colors hover:bg-magenta disabled:opacity-60 sm:w-auto"
              >
                {starting ? "Redirecting…" : "Pay Online"}
              </button>
              <button
                type="button"
                onClick={() => setShowBankDetails(true)}
                className="eyebrow text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                I'll arrange payment another way
              </button>
            </div>
          )}
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
        <h1 className="mt-4 font-serif text-4xl text-foreground lg:text-5xl">Delivery details</h1>
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
                setPendingOrder({
                  orderId: result.orderId,
                  subtotal: result.subtotal,
                  email:
                    email || `${phone.replace(/\D/g, "") || "guest"}@guest.signaturebylilian.com`,
                });
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
              You'll be able to pay securely online (card or bank transfer) on the next step, or
              arrange payment with us directly.
            </p>
            <button
              type="submit"
              form="checkout-form"
              disabled={submitting}
              className="eyebrow mt-7 block w-full bg-plum py-4 text-center text-primary-foreground transition-colors hover:bg-magenta disabled:opacity-50"
            >
              {submitting ? "Placing Order…" : "Continue to Payment"}
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
