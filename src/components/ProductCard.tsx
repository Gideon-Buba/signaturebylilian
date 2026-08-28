import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

import { useCart } from "@/lib/cart";

export type StoreProduct = {
  id: string;
  name: string;
  size: string | null;
  blurb: string;
  price: number;
  compareAtPrice: number | null;
  tag: "Best Seller" | "New" | "Signature";
  image: string | null;
  benefits: string[];
  inStock: boolean;
};

export function ProductCard({ product }: { product: StoreProduct }) {
  const { addItem } = useCart();

  return (
    <article className="group flex h-full flex-col">
      <Link
        to="/skincare/$productId"
        params={{ productId: product.id }}
        className="relative block overflow-hidden bg-blush/60"
      >
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={912}
            height={1104}
            className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
          />
        )}
        <span className="eyebrow absolute top-4 left-4 bg-background/90 px-3 py-1.5 text-plum">
          {product.tag}
        </span>
        {!product.inStock && (
          <span className="eyebrow absolute top-4 right-4 bg-foreground/90 px-3 py-1.5 text-background">
            Out of Stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col pt-5">
        <Link to="/skincare/$productId" params={{ productId: product.id }}>
          <h3 className="font-serif text-2xl text-foreground transition-colors hover:text-plum">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {product.blurb}
        </p>
        <div className="mt-4 flex items-center justify-between gap-4 pt-1">
          <span className="flex flex-wrap items-baseline gap-x-2">
            {product.compareAtPrice != null && product.compareAtPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                ₦{product.compareAtPrice.toLocaleString()}
              </span>
            )}
            <span className="font-serif text-xl text-foreground">
              ₦{product.price.toLocaleString()}
            </span>
          </span>
          <button
            type="button"
            disabled={!product.inStock}
            onClick={() => {
              addItem({
                productId: product.id,
                name: product.name,
                size: product.size,
                price: product.price,
                image: product.image,
              });
              toast.success("Added to cart", {
                description: `${product.name} — ₦${product.price.toLocaleString()}`,
              });
            }}
            className="eyebrow border border-plum/30 px-4 py-3 text-plum transition-colors hover:bg-plum hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-plum"
          >
            Add to Cart
          </button>
        </div>
        {product.compareAtPrice != null && product.compareAtPrice > product.price && (
          <p className="mt-2 text-xs text-plum">
            Save ₦{(product.compareAtPrice - product.price).toLocaleString()}
          </p>
        )}
      </div>
    </article>
  );
}
