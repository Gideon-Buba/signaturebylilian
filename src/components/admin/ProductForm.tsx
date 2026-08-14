import { useState } from "react";
import { toast } from "sonner";

import { uploadImageFn } from "@/server-fns/uploads";

export type ProductFormValues = {
  name: string;
  size: string;
  description: string;
  price: string;
  tag: "Best Seller" | "New" | "Signature";
  benefits: string;
  inStock: boolean;
  imageUrl: string | null;
};

const TAGS: ProductFormValues["tag"][] = ["New", "Best Seller", "Signature"];

export function ProductForm({
  initial,
  onSubmit,
  submitLabel,
}: {
  initial?: Partial<ProductFormValues>;
  onSubmit: (values: {
    name: string;
    size?: string;
    description: string;
    price: number;
    tag: ProductFormValues["tag"];
    benefits: string[];
    inStock: boolean;
    imageUrl?: string;
  }) => Promise<void>;
  submitLabel: string;
}) {
  const [values, setValues] = useState<ProductFormValues>({
    name: initial?.name ?? "",
    size: initial?.size ?? "",
    description: initial?.description ?? "",
    price: initial?.price ?? "",
    tag: initial?.tag ?? "New",
    benefits: initial?.benefits ?? "",
    inStock: initial?.inStock ?? true,
    imageUrl: initial?.imageUrl ?? null,
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
      formData.set("folder", "products");
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
        const price = Number(values.price);
        if (!values.name.trim()) {
          toast.error("Name is required");
          return;
        }
        if (!Number.isFinite(price) || price < 0) {
          toast.error("Enter a valid price");
          return;
        }

        const trimmedSize = values.size.trim();

        setSubmitting(true);
        try {
          await onSubmit({
            name: values.name.trim(),
            description: values.description,
            price,
            tag: values.tag,
            benefits: values.benefits
              .split("\n")
              .map((b) => b.trim())
              .filter(Boolean),
            inStock: values.inStock,
            ...(trimmedSize && { size: trimmedSize }),
            ...(values.imageUrl && { imageUrl: values.imageUrl }),
          });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <label className="grid gap-2">
        <span className="eyebrow text-muted-foreground">Product image</span>
        <div className="flex items-center gap-4">
          {values.imageUrl ? (
            <img
              src={values.imageUrl}
              alt="Product preview"
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
          <span className="eyebrow text-muted-foreground">Size (optional)</span>
          <input
            value={values.size}
            placeholder="e.g. 300g, 50ml"
            onChange={(e) => setValues((v) => ({ ...v, size: e.target.value }))}
            className="border border-input bg-background px-4 py-3.5 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="eyebrow text-muted-foreground">Description</span>
        <textarea
          rows={3}
          value={values.description}
          onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
          className="border border-input bg-background px-4 py-3.5 text-sm text-foreground outline-none focus:border-accent"
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="eyebrow text-muted-foreground">Price (₦)</span>
          <input
            required
            type="number"
            min={0}
            step={1}
            value={values.price}
            onChange={(e) => setValues((v) => ({ ...v, price: e.target.value }))}
            className="border border-input bg-background px-4 py-3.5 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>
        <label className="grid gap-2">
          <span className="eyebrow text-muted-foreground">Tag</span>
          <select
            value={values.tag}
            onChange={(e) =>
              setValues((v) => ({ ...v, tag: e.target.value as ProductFormValues["tag"] }))
            }
            className="border border-input bg-background px-4 py-3.5 text-sm text-foreground outline-none focus:border-accent"
          >
            {TAGS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="grid gap-2">
        <span className="eyebrow text-muted-foreground">Benefits (one per line)</span>
        <textarea
          rows={3}
          value={values.benefits}
          placeholder={"Deep hydration\nSoftens skin\nRich, whipped texture"}
          onChange={(e) => setValues((v) => ({ ...v, benefits: e.target.value }))}
          className="border border-input bg-background px-4 py-3.5 text-sm text-foreground outline-none focus:border-accent"
        />
      </label>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={values.inStock}
          onChange={(e) => setValues((v) => ({ ...v, inStock: e.target.checked }))}
          className="size-4"
        />
        <span className="text-sm text-foreground">In stock</span>
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
