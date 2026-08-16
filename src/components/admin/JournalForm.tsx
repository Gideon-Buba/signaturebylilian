import { useState } from "react";
import { toast } from "sonner";

import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { uploadImageFn } from "@/server-fns/uploads";

export type JournalFormValues = {
  title: string;
  category: "Skincare" | "Wellness";
  excerpt: string;
  body: string;
  readTime: string;
  status: "draft" | "published";
  coverImageUrl: string | null;
};

const CATEGORIES: JournalFormValues["category"][] = ["Skincare", "Wellness"];

export function JournalForm({
  initial,
  onSubmit,
  submitLabel,
}: {
  initial?: Partial<JournalFormValues>;
  onSubmit: (values: {
    title: string;
    category: JournalFormValues["category"];
    excerpt: string;
    body: string;
    readTime?: string;
    status: JournalFormValues["status"];
    coverImageUrl?: string;
  }) => Promise<void>;
  submitLabel: string;
}) {
  const [values, setValues] = useState<JournalFormValues>({
    title: initial?.title ?? "",
    category: initial?.category ?? "Skincare",
    excerpt: initial?.excerpt ?? "",
    body: initial?.body ?? "",
    readTime: initial?.readTime ?? "",
    status: initial?.status ?? "draft",
    coverImageUrl: initial?.coverImageUrl ?? null,
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("folder", "journal");
      const result = await uploadImageFn({ data: formData });
      setValues((v) => ({ ...v, coverImageUrl: result.url }));
      toast.success("Cover image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <form
      className="grid max-w-3xl gap-6"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!values.title.trim()) {
          toast.error("Title is required");
          return;
        }

        const trimmedReadTime = values.readTime.trim();

        setSubmitting(true);
        try {
          await onSubmit({
            title: values.title.trim(),
            category: values.category,
            excerpt: values.excerpt,
            body: values.body,
            status: values.status,
            ...(trimmedReadTime && { readTime: trimmedReadTime }),
            ...(values.coverImageUrl && { coverImageUrl: values.coverImageUrl }),
          });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <label className="grid gap-2">
        <span className="eyebrow text-muted-foreground">Cover image</span>
        <div className="flex items-center gap-4">
          {values.coverImageUrl ? (
            <img
              src={values.coverImageUrl}
              alt="Cover preview"
              className="h-24 w-32 rounded object-cover"
            />
          ) : (
            <div className="flex h-24 w-32 items-center justify-center rounded bg-secondary text-xs text-muted-foreground">
              No image
            </div>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleCoverChange}
            disabled={uploading}
            className="text-sm text-muted-foreground file:mr-4 file:border-0 file:bg-secondary file:px-4 file:py-2.5 file:text-foreground"
          />
        </div>
        {uploading && <span className="text-xs text-muted-foreground">Uploading…</span>}
      </label>

      <label className="grid gap-2">
        <span className="eyebrow text-muted-foreground">Title</span>
        <input
          required
          value={values.title}
          onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
          className="border border-input bg-background px-4 py-3.5 text-sm text-foreground outline-none focus:border-accent"
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-3">
        <label className="grid gap-2">
          <span className="eyebrow text-muted-foreground">Category</span>
          <select
            value={values.category}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                category: e.target.value as JournalFormValues["category"],
              }))
            }
            className="border border-input bg-background px-4 py-3.5 text-sm text-foreground outline-none focus:border-accent"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          <span className="eyebrow text-muted-foreground">Read time (optional)</span>
          <input
            value={values.readTime}
            placeholder="e.g. 5 min"
            onChange={(e) => setValues((v) => ({ ...v, readTime: e.target.value }))}
            className="border border-input bg-background px-4 py-3.5 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>
        <label className="grid gap-2">
          <span className="eyebrow text-muted-foreground">Status</span>
          <select
            value={values.status}
            onChange={(e) =>
              setValues((v) => ({ ...v, status: e.target.value as JournalFormValues["status"] }))
            }
            className="border border-input bg-background px-4 py-3.5 text-sm text-foreground outline-none focus:border-accent"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
      </div>

      <label className="grid gap-2">
        <span className="eyebrow text-muted-foreground">Excerpt</span>
        <textarea
          rows={2}
          value={values.excerpt}
          placeholder="A short teaser shown on the Journal list page"
          onChange={(e) => setValues((v) => ({ ...v, excerpt: e.target.value }))}
          className="border border-input bg-background px-4 py-3.5 text-sm text-foreground outline-none focus:border-accent"
        />
      </label>

      <label className="grid gap-2">
        <span className="eyebrow text-muted-foreground">Post Content</span>
        <RichTextEditor
          value={values.body}
          onChange={(html) => setValues((v) => ({ ...v, body: html }))}
          placeholder="Write the full post here…"
        />
      </label>

      <button
        type="submit"
        disabled={submitting || uploading}
        className="eyebrow mt-2 w-fit bg-plum px-8 py-4 text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
