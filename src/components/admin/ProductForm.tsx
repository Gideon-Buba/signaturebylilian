import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

import { uploadImageFn } from "@/server-fns/uploads";

export type ProductFormValues = {
  name: string;
  size: string;
  description: string;
  price: string;
  compareAtPrice: string;
  tag: "Best Seller" | "New" | "Signature";
  benefits: string;
  inStock: boolean;
  imageUrl: string | null;
  galleryUrls: string[];
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
    compareAtPrice?: number | null;
    tag: ProductFormValues["tag"];
    benefits: string[];
    inStock: boolean;
    imageUrl?: string;
    galleryUrls: string[];
  }) => Promise<void>;
  submitLabel: string;
}) {
  const [values, setValues] = useState<ProductFormValues>({
    name: initial?.name ?? "",
    size: initial?.size ?? "",
    description: initial?.description ?? "",
    price: initial?.price ?? "",
    compareAtPrice: initial?.compareAtPrice ?? "",
    tag: initial?.tag ?? "New",
    benefits: initial?.benefits ?? "",
    inStock: initial?.inStock ?? true,
    imageUrl: initial?.imageUrl ?? null,
    galleryUrls: initial?.galleryUrls ?? [],
  });
  const [uploading, setUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
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

  async function handleGalleryFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setGalleryUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.set("file", file);
        formData.set("folder", "products");
        const result = await uploadImageFn({ data: formData });
        uploaded.push(result.url);
      }
      setValues((v) => ({ ...v, galleryUrls: [...v.galleryUrls, ...uploaded] }));
      toast.success(uploaded.length === 1 ? "Photo uploaded" : `${uploaded.length} photos uploaded`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setGalleryUploading(false);
      e.target.value = "";
    }
  }

  function removeGalleryImage(url: string) {
    setValues((v) => ({ ...v, galleryUrls: v.galleryUrls.filter((u) => u !== url) }));
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

        const trimmedCompareAt = values.compareAtPrice.trim();
        const compareAtPrice = trimmedCompareAt ? Number(trimmedCompareAt) : null;
        if (compareAtPrice != null && (!Number.isFinite(compareAtPrice) || compareAtPrice < 0)) {
          toast.error("Enter a valid compare-at price");
          return;
        }

        const trimmedSize = values.size.trim();

        setSubmitting(true);
        try {
          await onSubmit({
            name: values.name.trim(),
            description: values.description,
            price,
            compareAtPrice,
            tag: values.tag,
            benefits: values.benefits
              .split("\n")
              .map((b) => b.trim())
              .filter(Boolean),
            inStock: values.inStock,
            galleryUrls: values.galleryUrls,
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

      <div className="grid gap-2">
        <span className="eyebrow text-muted-foreground">
          Additional photos (shown on the product page)
        </span>
        <div className="flex flex-wrap gap-3">
          {values.galleryUrls.map((url) => (
            <div key={url} className="group relative size-20">
              <img
                src={url}
                alt="Additional product photo"
                className="size-20 rounded object-cover"
              />
              <button
                type="button"
                aria-label="Remove photo"
                onClick={() => removeGalleryImage(url)}
                className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-foreground text-background opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="size-3" strokeWidth={2} />
              </button>
            </div>
          ))}
          <label className="flex size-20 cursor-pointer flex-col items-center justify-center gap-1 rounded border border-dashed border-input text-center text-[10px] text-muted-foreground hover:border-accent hover:text-accent">
            + Add
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleGalleryFilesChange}
              disabled={galleryUploading}
              className="hidden"
            />
          </label>
        </div>
        {galleryUploading && <span className="text-xs text-muted-foreground">Uploading…</span>}
      </div>

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
          <span className="eyebrow text-muted-foreground">
            Compare-at price (₦, optional)
          </span>
          <input
            type="number"
            min={0}
            step={1}
            placeholder="Original price before discount"
            value={values.compareAtPrice}
            onChange={(e) => setValues((v) => ({ ...v, compareAtPrice: e.target.value }))}
            className="border border-input bg-background px-4 py-3.5 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
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
        disabled={submitting || uploading || galleryUploading}
        className="eyebrow mt-2 w-fit bg-plum px-8 py-4 text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
