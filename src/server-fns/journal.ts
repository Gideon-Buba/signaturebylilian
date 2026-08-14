import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/session";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type JournalPost = {
  id: string;
  title: string;
  slug: string;
  category: "Skincare" | "Wellness";
  excerpt: string;
  body: string;
  coverImageUrl: string | null;
  readTime: string | null;
  status: "draft" | "published";
  publishedAt: string | null;
};

type JournalPostRow = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  body: string;
  cover_image_url: string | null;
  read_time: string | null;
  status: string;
  published_at: string | null;
};

function fromRow(row: JournalPostRow): JournalPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category as JournalPost["category"],
    excerpt: row.excerpt,
    body: row.body,
    coverImageUrl: row.cover_image_url,
    readTime: row.read_time,
    status: row.status as JournalPost["status"],
    publishedAt: row.published_at,
  };
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const journalInput = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().trim().min(1).optional(),
  category: z.enum(["Skincare", "Wellness"]),
  excerpt: z.string().default(""),
  body: z.string().default(""),
  coverImageUrl: z.string().url().optional(),
  readTime: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const listJournalPostsFn = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("journal_posts")
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as JournalPostRow[]).map(fromRow);
});

export const getJournalPostFn = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { data: row, error } = await supabase
      .from("journal_posts")
      .select("*")
      .eq("slug", data.slug)
      .single();

    if (error) throw new Error(error.message);
    return fromRow(row as JournalPostRow);
  });

export const createJournalPostFn = createServerFn({ method: "POST" })
  .validator(journalInput)
  .handler(async ({ data }) => {
    await requireAdmin();
    const supabase = getSupabaseServerClient();

    const { data: row, error } = await supabase
      .from("journal_posts")
      .insert({
        title: data.title,
        slug: data.slug || slugify(data.title),
        category: data.category,
        excerpt: data.excerpt,
        body: data.body,
        cover_image_url: data.coverImageUrl ?? null,
        read_time: data.readTime ?? null,
        status: data.status,
        published_at: data.status === "published" ? new Date().toISOString() : null,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return fromRow(row as JournalPostRow);
  });

export const updateJournalPostFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid(), patch: journalInput.partial() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const supabase = getSupabaseServerClient();
    const { title, slug, category, excerpt, body, coverImageUrl, readTime, status } = data.patch;

    const update: Record<string, unknown> = {};
    if (title !== undefined) update["title"] = title;
    if (slug !== undefined) update["slug"] = slug;
    if (category !== undefined) update["category"] = category;
    if (excerpt !== undefined) update["excerpt"] = excerpt;
    if (body !== undefined) update["body"] = body;
    if (coverImageUrl !== undefined) update["cover_image_url"] = coverImageUrl;
    if (readTime !== undefined) update["read_time"] = readTime;

    if (status !== undefined) {
      update["status"] = status;
      if (status === "published") {
        // Only stamp published_at the first time a post goes live — a later
        // edit shouldn't bump its publish date.
        const { data: existing } = await supabase
          .from("journal_posts")
          .select("published_at")
          .eq("id", data.id)
          .single();
        if (!existing?.published_at) {
          update["published_at"] = new Date().toISOString();
        }
      } else {
        update["published_at"] = null;
      }
    }

    const { data: row, error } = await supabase
      .from("journal_posts")
      .update(update)
      .eq("id", data.id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return fromRow(row as JournalPostRow);
  });

// Journal posts have no archive flag — deleting one removes the row outright.
export const deleteJournalPostFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("journal_posts").delete().eq("id", data.id);

    if (error) throw new Error(error.message);
    return { success: true as const };
  });
