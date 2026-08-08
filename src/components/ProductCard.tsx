import { Star } from "lucide-react";
import { toast } from "sonner";

import type { Product } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex h-full flex-col">
      <div className="relative overflow-hidden bg-blush/60">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={912}
          height={1104}
          className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
        />
        <span className="eyebrow absolute top-4 left-4 bg-background/90 px-3 py-1.5 text-plum">
          {product.tag}
        </span>
        <button
          type="button"
          onClick={() => toast(product.name, { description: product.blurb })}
          className="eyebrow absolute inset-x-4 bottom-4 bg-background/90 py-3 text-foreground opacity-0 transition-opacity duration-500 group-hover:opacity-100 focus-visible:opacity-100"
        >
          Quick View
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-magenta text-magenta" />
          <span className="text-foreground">{product.rating}</span>
          <span>({product.reviews} reviews)</span>
        </div>
        <h3 className="mt-2 font-serif text-2xl text-foreground">{product.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{product.blurb}</p>
        <div className="mt-4 flex items-center justify-between gap-4 pt-1">
          <span className="font-serif text-xl text-foreground">
            ₦{product.price.toLocaleString()}
          </span>
          <button
            type="button"
            onClick={() =>
              toast.success("Added to cart", {
                description: `${product.name} — ₦${product.price.toLocaleString()}`,
              })
            }
            className="eyebrow border border-plum/30 px-4 py-3 text-plum transition-colors hover:bg-plum hover:text-primary-foreground"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
