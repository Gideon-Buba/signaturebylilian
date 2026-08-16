import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/session";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type Product = {
  id: string;
  name: string;
  size: string | null;
  description: string;
  price: number;
  tag: "Best Seller" | "New" | "Signature";
  imageUrl: string | null;
  galleryUrls: string[];
  benefits: string[];
  inStock: boolean;
  isArchived: boolean;
  sortOrder: number;
};

type ProductRow = {
  id: string;
  name: string;
  size: string | null;
  description: string;
  price: number;
  tag: string;
  image_url: string | null;
  gallery_urls: string[];
  benefits: string[];
  in_stock: boolean;
  is_archived: boolean;
  sort_order: number;
};

function fromRow(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    size: row.size,
    description: row.description,
    price: row.price,
    tag: row.tag as Product["tag"],
    imageUrl: row.image_url,
    galleryUrls: row.gallery_urls ?? [],
    benefits: row.benefits,
    inStock: row.in_stock,
    isArchived: row.is_archived,
    sortOrder: row.sort_order,
  };
}

const productInput = z.object({
  name: z.string().min(1, "Name is required"),
  size: z.string().trim().min(1).optional(),
  description: z.string().default(""),
  price: z.number().int().nonnegative(),
  tag: z.enum(["Best Seller", "New", "Signature"]).default("New"),
  imageUrl: z.string().url().optional(),
  galleryUrls: z.array(z.string().url()).default([]),
  benefits: z.array(z.string()).default([]),
  inStock: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const listProductsFn = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data as ProductRow[]).map(fromRow);
});

export const getProductFn = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { data: row, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", data.id)
      .single();

    if (error) throw new Error(error.message);
    return fromRow(row as ProductRow);
  });

export const createProductFn = createServerFn({ method: "POST" })
  .validator(productInput)
  .handler(async ({ data }) => {
    await requireAdmin();
    const supabase = getSupabaseServerClient();

    const { data: row, error } = await supabase
      .from("products")
      .insert({
        name: data.name,
        size: data.size ?? null,
        description: data.description,
        price: data.price,
        tag: data.tag,
        image_url: data.imageUrl ?? null,
        gallery_urls: data.galleryUrls,
        benefits: data.benefits,
        in_stock: data.inStock,
        sort_order: data.sortOrder,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return fromRow(row as ProductRow);
  });

export const updateProductFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid(), patch: productInput.partial() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const supabase = getSupabaseServerClient();
    const { name, size, description, price, tag, imageUrl, galleryUrls, benefits, inStock, sortOrder } =
      data.patch;

    const update: Record<string, unknown> = {};
    if (name !== undefined) update["name"] = name;
    if (size !== undefined) update["size"] = size;
    if (description !== undefined) update["description"] = description;
    if (price !== undefined) update["price"] = price;
    if (tag !== undefined) update["tag"] = tag;
    if (imageUrl !== undefined) update["image_url"] = imageUrl;
    if (galleryUrls !== undefined) update["gallery_urls"] = galleryUrls;
    if (benefits !== undefined) update["benefits"] = benefits;
    if (inStock !== undefined) update["in_stock"] = inStock;
    if (sortOrder !== undefined) update["sort_order"] = sortOrder;

    const { data: row, error } = await supabase
      .from("products")
      .update(update)
      .eq("id", data.id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return fromRow(row as ProductRow);
  });

// Soft delete — archives the product instead of destroying the row, so past
// orders or references to it don't break.
export const deleteProductFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .from("products")
      .update({ is_archived: true })
      .eq("id", data.id);

    if (error) throw new Error(error.message);
    return { success: true as const };
  });

export const restoreProductFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .from("products")
      .update({ is_archived: false })
      .eq("id", data.id);

    if (error) throw new Error(error.message);
    return { success: true as const };
  });
