import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { useCart } from "@/lib/cart";

const title = "Your Cart — Signature by Lilian";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title }] }),
  component: CartPage,
});

function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-[1440px] px-5 py-24 text-center lg:px-10">
        <Reveal>
          <p className="eyebrow text-magenta">Your Cart</p>
          <h1 className="mt-4 font-serif text-4xl text-foreground lg:text-5xl">
            Your cart is empty
          </h1>
          <p className="mt-4 text-muted-foreground">
            Browse the collection and add something you'll love.
          </p>
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
        <p className="eyebrow text-magenta">Your Cart</p>
        <h1 className="mt-4 font-serif text-4xl text-foreground lg:text-5xl">Cart</h1>
      </Reveal>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <Reveal>
          <ul className="divide-y divide-border border-y border-border">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-5 py-6">
                <div className="size-24 shrink-0 overflow-hidden bg-blush/60">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-serif text-lg text-foreground">{item.name}</p>
                      {item.size && (
                        <p className="text-xs text-muted-foreground">{item.size}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => removeItem(item.productId)}
                      className="p-1 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <X className="size-4" strokeWidth={1.5} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-border">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-2 text-foreground transition-colors hover:text-plum"
                      >
                        <Minus className="size-3.5" strokeWidth={1.5} />
                      </button>
                      <span className="w-7 text-center text-sm text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-2 text-foreground transition-colors hover:text-plum"
                      >
                        <Plus className="size-3.5" strokeWidth={1.5} />
                      </button>
                    </div>
                    <span className="font-serif text-lg text-foreground">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={100}>
          <div className="border border-border bg-card p-7 lg:p-8">
            <h2 className="font-serif text-2xl text-foreground">Order Summary</h2>
            <div className="mt-6 flex items-center justify-between border-t border-border pt-5 text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-serif text-lg text-foreground">
                ₦{subtotal.toLocaleString()}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Delivery is arranged directly after checkout.
            </p>
            <Link
              to="/checkout"
              className="eyebrow mt-7 block bg-plum py-4 text-center text-primary-foreground transition-colors hover:bg-magenta"
            >
              Proceed to Checkout
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
