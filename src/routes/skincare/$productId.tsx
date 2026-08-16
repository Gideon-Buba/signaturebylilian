import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Minus, Pause, Play, Plus } from "lucide-react";

const AUTOPLAY_INTERVAL_MS = 3500;

import { Reveal } from "@/components/Reveal";
import { useCart } from "@/lib/cart";
import { getProductFn } from "@/server-fns/products";

export const Route = createFileRoute("/skincare/$productId")({
  loader: async ({ params }) => {
    try {
      const product = await getProductFn({ data: { id: params.productId } });
      if (product.isArchived) throw notFound();
      return { product };
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [{ title: `${loaderData.product.name} — Signature by Lilian Skincare` }]
      : [],
  }),
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const images = [
    ...(product.imageUrl ? [product.imageUrl] : []),
    ...product.galleryUrls,
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (images.length < 2 || !playing) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % images.length);
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length, playing]);

  return (
    <section className="mx-auto max-w-[1440px] px-5 py-14 lg:px-10 lg:py-20">
      <nav className="eyebrow text-muted-foreground">
        <Link to="/skincare" className="hover:text-accent">
          Skincare
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-blush/60">
            {images.map((url, i) => (
              <img
                key={url + i}
                src={url}
                alt={product.name}
                width={1000}
                height={1200}
                className="absolute inset-0 size-full object-cover transition-opacity duration-1000 ease-in-out"
                style={{ opacity: i === activeIndex ? 1 : 0 }}
              />
            ))}
            {images.length > 1 && (
              <button
                type="button"
                aria-label={playing ? "Pause slideshow" : "Play slideshow"}
                onClick={() => setPlaying((p) => !p)}
                className="absolute right-4 bottom-4 flex size-10 items-center justify-center rounded-full bg-background/90 text-foreground transition-opacity hover:opacity-90"
              >
                {playing ? (
                  <Pause className="size-4" strokeWidth={1.75} />
                ) : (
                  <Play className="size-4" strokeWidth={1.75} />
                )}
              </button>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {images.map((url, i) => (
                <button
                  key={url + i}
                  type="button"
                  aria-label={`View photo ${i + 1}`}
                  onClick={() => {
                    setActiveIndex(i);
                    setPlaying(false);
                  }}
                  data-active={i === activeIndex}
                  className="size-16 shrink-0 overflow-hidden border border-transparent opacity-70 transition-opacity hover:opacity-100 data-[active=true]:border-plum data-[active=true]:opacity-100"
                >
                  <img src={url} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </Reveal>

        <Reveal delay={100}>
          <span className="eyebrow text-plum">{product.tag}</span>
          <h1 className="mt-3 font-serif text-4xl text-foreground lg:text-5xl">{product.name}</h1>
          {product.size && (
            <p className="mt-2 text-sm text-muted-foreground">{product.size}</p>
          )}
          <p className="mt-6 font-serif text-2xl text-foreground">
            ₦{product.price.toLocaleString()}
          </p>
          <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {product.benefits.length > 0 && (
            <ul className="mt-8 space-y-2">
              {product.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-foreground">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-plum" />
                  {b}
                </li>
              ))}
            </ul>
          )}

          {!product.inStock ? (
            <p className="eyebrow mt-9 inline-block border border-border px-6 py-4 text-muted-foreground">
              Currently Out of Stock
            </p>
          ) : (
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <div className="flex items-center border border-border">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 text-foreground transition-colors hover:text-plum"
                >
                  <Minus className="size-4" strokeWidth={1.5} />
                </button>
                <span className="w-8 text-center text-sm text-foreground">{quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-3 text-foreground transition-colors hover:text-plum"
                >
                  <Plus className="size-4" strokeWidth={1.5} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  addItem(
                    {
                      productId: product.id,
                      name: product.name,
                      size: product.size,
                      price: product.price,
                      image: product.imageUrl,
                    },
                    quantity,
                  );
                  toast.success("Added to cart", {
                    description: `${quantity} × ${product.name} — ₦${(product.price * quantity).toLocaleString()}`,
                  });
                }}
                className="eyebrow bg-plum px-8 py-4 text-primary-foreground transition-colors hover:bg-magenta"
              >
                Add to Cart
              </button>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
