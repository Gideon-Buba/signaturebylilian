import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/session";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 8 * 1024 * 1024; // 8MB

// Accepts a browser File via FormData — createServerFn passes FormData through
// as-is when the validator returns it unchanged.
export const uploadImageFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) throw new Error("Expected multipart form data");
    return data;
  })
  .handler(async ({ data: formData }) => {
    await requireAdmin();

    const file = formData.get("file");
    const folder = z
      .enum(["products", "treatments", "journal"])
      .parse(formData.get("folder") ?? "products");

    if (!(file instanceof File)) {
      throw new Error("No file provided");
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      throw new Error("Only JPEG, PNG or WebP images are allowed");
    }
    if (file.size > MAX_BYTES) {
      throw new Error("Image must be smaller than 8MB");
    }

    const supabase = getSupabaseServerClient();
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage.from("media").upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

    if (error) throw new Error(error.message);

    const { data: publicUrl } = supabase.storage.from("media").getPublicUrl(path);
    return { url: publicUrl.publicUrl, path };
  });

export const deleteImageFn = createServerFn({ method: "POST" })
  .validator(z.object({ path: z.string() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.storage.from("media").remove([data.path]);
    if (error) throw new Error(error.message);
    return { success: true as const };
  });
