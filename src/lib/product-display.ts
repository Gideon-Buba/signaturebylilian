import type { Product } from "@/server-fns/products";
import type { StoreProduct } from "@/components/ProductCard";

export function toStoreProduct(product: Product): StoreProduct {
  return {
    id: product.id,
    name: product.name,
    size: product.size,
    blurb: product.description,
    price: product.price,
    tag: product.tag,
    image: product.imageUrl,
    benefits: product.benefits,
    inStock: product.inStock,
  };
}
