import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/session";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type Treatment = {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  benefits: string[];
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
};

type TreatmentRow = {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  benefits: string[];
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
};

function fromRow(row: TreatmentRow): Treatment {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    duration: row.duration,
    price: row.price,
    benefits: row.benefits,
    imageUrl: row.image_url,
    isActive: row.is_active,
    sortOrder: row.sort_order,
  };
}

const treatmentInput = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().default(""),
  duration: z.string().min(1, "Duration is required"),
  price: z.number().int().nonnegative(),
  benefits: z.array(z.string()).default([]),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const listTreatmentsFn = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("treatments")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data as TreatmentRow[]).map(fromRow);
});

export const getTreatmentFn = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { data: row, error } = await supabase
      .from("treatments")
      .select("*")
      .eq("id", data.id)
      .single();

    if (error) throw new Error(error.message);
    return fromRow(row as TreatmentRow);
  });

export const createTreatmentFn = createServerFn({ method: "POST" })
  .validator(treatmentInput)
  .handler(async ({ data }) => {
    await requireAdmin();
    const supabase = getSupabaseServerClient();

    const { data: row, error } = await supabase
      .from("treatments")
      .insert({
        name: data.name,
        description: data.description,
        duration: data.duration,
        price: data.price,
        benefits: data.benefits,
        image_url: data.imageUrl ?? null,
        is_active: data.isActive,
        sort_order: data.sortOrder,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return fromRow(row as TreatmentRow);
  });

export const updateTreatmentFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid(), patch: treatmentInput.partial() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const supabase = getSupabaseServerClient();
    const { name, description, duration, price, benefits, imageUrl, isActive, sortOrder } =
      data.patch;

    const update: Record<string, unknown> = {};
    if (name !== undefined) update["name"] = name;
    if (description !== undefined) update["description"] = description;
    if (duration !== undefined) update["duration"] = duration;
    if (price !== undefined) update["price"] = price;
    if (benefits !== undefined) update["benefits"] = benefits;
    if (imageUrl !== undefined) update["image_url"] = imageUrl;
    if (isActive !== undefined) update["is_active"] = isActive;
    if (sortOrder !== undefined) update["sort_order"] = sortOrder;

    const { data: row, error } = await supabase
      .from("treatments")
      .update(update)
      .eq("id", data.id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return fromRow(row as TreatmentRow);
  });

// Soft delete — archives the treatment instead of destroying the row.
export const deleteTreatmentFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .from("treatments")
      .update({ is_archived: true })
      .eq("id", data.id);

    if (error) throw new Error(error.message);
    return { success: true as const };
  });
