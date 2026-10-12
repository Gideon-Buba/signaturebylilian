import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

import { Reveal } from "@/components/Reveal";
import { useCart } from "@/lib/cart";
import { verifyPaymentFn } from "@/server-fns/payments";

export const Route = createFileRoute("/checkout/callback")({
  head: () => ({ meta: [{ title: "Payment — Signature by Lilian" }] }),
  validateSearch: z.object({ order: z.string().uuid().optional() }),
  component: PaymentCallback,
});

type Outcome = "checking" | "paid" | "pending" | "failed" | "error";

function PaymentCallback() {
  const { order } = Route.useSearch();
  const { clear } = useCart();
  const [outcome, setOutcome] = useState<Outcome>(order ? "checking" : "error");
  const [message, setMessage] = useState("");
  const started = useRef(false);

  const check = () => {
    if (!order) return;
    setOutcome("checking");
    verifyPaymentFn({ data: { orderId: order } })
      .then((result) => {
        if (result.status === "paid") clear();
        setOutcome(result.status);
      })
      .catch((error: unknown) => {
        setMessage(error instanceof Error ? error.message : "");
        setOutcome("error");
      });
  };

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reference = order?.slice(0, 8);

  const copy: Record<Outcome, { eyebrow: string; title: string; body: string }> = {
    checking: {
      eyebrow: "One moment",
      title: "Confirming your payment",
      body: "Please don't close this page.",
    },
    paid: {
      eyebrow: "Order Received",
      title: "Payment received",
      body: "Thank you — your payment was successful and your order is confirmed. We'll reach out to arrange delivery.",
    },
    pending: {
      eyebrow: "Almost there",
      title: "Payment still processing",
      body: "Your bank hasn't confirmed the payment yet. Bank transfers can take a few minutes. Check again shortly, and we'll also confirm it automatically once it lands.",
    },
    failed: {
      eyebrow: "Payment not completed",
      title: "That payment didn't go through",
      body: "You haven't been charged for this order. You can return to checkout and try again, or contact us on WhatsApp to pay another way.",
    },
    error: {
      eyebrow: "Something went wrong",
      title: "We couldn't confirm your payment",
      body:
        message ||
        "If money left your account, please contact us with your order reference and we'll sort it out right away.",
    },
  };
  const c = copy[outcome];

  return (
    <section className="mx-auto max-w-[1440px] px-5 py-24 text-center lg:px-10">
      <Reveal>
        <p className="eyebrow text-magenta">{c.eyebrow}</p>
        <h1 className="mt-4 font-serif text-4xl text-foreground lg:text-5xl">{c.title}</h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">{c.body}</p>
        {reference && (
          <p className="mt-4 text-xs tracking-[0.18em] text-muted-foreground uppercase">
            Order reference: {reference}
          </p>
        )}
        {outcome === "paid" && (
          <p className="mx-auto mt-5 max-w-sm text-sm text-muted-foreground italic">
            Please note this number for your transaction.
          </p>
        )}

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {outcome === "paid" && (
            <Link
              to="/skincare"
              className="eyebrow bg-plum px-8 py-4 text-primary-foreground transition-colors hover:bg-magenta"
            >
              Continue Shopping
            </Link>
          )}
          {(outcome === "pending" || outcome === "error") && order && (
            <button
              type="button"
              onClick={check}
              className="eyebrow bg-plum px-8 py-4 text-primary-foreground transition-colors hover:bg-magenta"
            >
              Check Again
            </button>
          )}
          {outcome === "failed" && (
            <Link
              to="/cart"
              className="eyebrow bg-plum px-8 py-4 text-primary-foreground transition-colors hover:bg-magenta"
            >
              Back to Cart
            </Link>
          )}
          {(outcome === "failed" || outcome === "error" || outcome === "pending") && (
            <a
              href="https://wa.me/2349046004543"
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow border border-border px-8 py-4 text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              WhatsApp Us
            </a>
          )}
        </div>
      </Reveal>
    </section>
  );
}
