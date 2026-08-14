import { useState } from "react";
import { toast } from "sonner";

import { uploadImageFn } from "@/server-fns/uploads";

export type TreatmentFormValues = {
  name: string;
  category: string;
  description: string;
  duration: string;
  price: string;
  benefits: string;
  imageUrl: string | null;
  isFeatured: boolean;
  isActive: boolean;
};

export function TreatmentForm({
  initial,
  categoryOptions,
  onSubmit,
  submitLabel,
}: {
  initial?: Partial<TreatmentFormValues>;
  categoryOptions: string[];
  onSubmit: (values: {
    name: string;
    category: string;
    description: string;
    duration?: string;
    price?: number;
    benefits: string[];
    imageUrl?: string;
    isFeatured: boolean;
    isActive: boolean;
  }) => Promise<void>;
  submitLabel: string;
}) {
  const [values, setValues] = useState<TreatmentFormValues>({
    name: initial?.name ?? "",
    category: initial?.category ?? "",
    description: initial?.description ?? "",
    duration: initial?.duration ?? "",
    price: initial?.price ?? "",
    benefits: initial?.benefits ?? "",
    imageUrl: initial?.imageUrl ?? null,
    isFeatured: initial?.isFeatured ?? false,
    isActive: initial?.isActive ?? true,
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("folder", "treatments");
      const result = await uploadImageFn({ data: formData });
      setValues((v) => ({ ...v, imageUrl: result.url }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <form
      className="grid max-w-2xl gap-6"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!values.name.trim()) {
          toast.error("Name is required");
          return;
        }
        if (!values.category.trim()) {
          toast.error("Category is required");
          return;
        }

        const trimmedPrice = values.price.trim();
        let price: number | undefined;
        if (trimmedPrice) {
          price = Number(trimmedPrice);
          if (!Number.isFinite(price) || price < 0) {
            toast.error("Enter a valid price, or leave it blank for 'Contact for pricing'");
            return;
          }
        }

        setSubmitting(true);
        try {
          await onSubmit({
            name: values.name.trim(),
            category: values.category.trim(),
            description: values.description,
            benefits: values.benefits
              .split("\n")
              .map((b) => b.trim())
              .filter(Boolean),
            isFeatured: values.isFeatured,
            isActive: values.isActive,
            ...(values.duration.trim() && { duration: values.duration.trim() }),
            ...(price !== undefined && { price }),
            ...(values.imageUrl && { imageUrl: values.imageUrl }),
          });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <label className="grid gap-2">
        <span className="eyebrow text-muted-foreground">Treatment image (optional)</span>
        <div className="flex items-center gap-4">
          {values.imageUrl ? (
            <img
              src={values.imageUrl}
              alt="Treatment preview"
              className="size-24 rounded object-cover"
            />
          ) : (
            <div className="flex size-24 items-center justify-center rounded bg-secondary text-xs text-muted-foreground">
              No image
            </div>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={uploading}
            className="text-sm text-muted-foreground file:mr-4 file:border-0 file:bg-secondary file:px-4 file:py-2.5 file:text-foreground"
          />
        </div>
        {uploading && <span className="text-xs text-muted-foreground">Uploading…</span>}
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="eyebrow text-muted-foreground">Name</span>
          <input
            required
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            className="border border-input bg-background px-4 py-3.5 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>
        <label className="grid gap-2">
          <span className="eyebrow text-muted-foreground">Category</span>
          <input
            required
            list="treatment-categories"
            value={values.category}
            placeholder="e.g. Facial Treatments"
            onChange={(e) => setValues((v) => ({ ...v, category: e.target.value }))}
            className="border border-input bg-background px-4 py-3.5 text-sm text-foreground outline-none focus:border-accent"
          />
          <datalist id="treatment-categories">
            {categoryOptions.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </label>
      </div>

      <label className="grid gap-2">
        <span className="eyebrow text-muted-foreground">Description (optional)</span>
        <textarea
          rows={3}
          value={values.description}
          onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
          className="border border-input bg-background px-4 py-3.5 text-sm text-foreground outline-none focus:border-accent"
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="eyebrow text-muted-foreground">Price (₦, optional)</span>
          <input
            type="number"
            min={0}
            step={1}
            value={values.price}
            placeholder="Leave blank for 'Contact for pricing'"
            onChange={(e) => setValues((v) => ({ ...v, price: e.target.value }))}
            className="border border-input bg-background px-4 py-3.5 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>
        <label className="grid gap-2">
          <span className="eyebrow text-muted-foreground">Duration (optional)</span>
          <input
            value={values.duration}
            placeholder="e.g. 60 min"
            onChange={(e) => setValues((v) => ({ ...v, duration: e.target.value }))}
            className="border border-input bg-background px-4 py-3.5 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="eyebrow text-muted-foreground">Benefits (one per line, optional)</span>
        <textarea
          rows={3}
          value={values.benefits}
          placeholder={"Deep renewal\nVisible glow"}
          onChange={(e) => setValues((v) => ({ ...v, benefits: e.target.value }))}
          className="border border-input bg-background px-4 py-3.5 text-sm text-foreground outline-none focus:border-accent"
        />
      </label>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={values.isFeatured}
            onChange={(e) => setValues((v) => ({ ...v, isFeatured: e.target.checked }))}
            className="size-4"
          />
          <span className="text-sm text-foreground">Featured (shown as a highlight card)</span>
        </label>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={values.isActive}
            onChange={(e) => setValues((v) => ({ ...v, isActive: e.target.checked }))}
            className="size-4"
          />
          <span className="text-sm text-foreground">Active (visible on the site)</span>
        </label>
      </div>

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
