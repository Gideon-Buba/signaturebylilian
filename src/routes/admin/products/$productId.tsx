import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdminForRoute } from "@/lib/auth/routeGuard";
import { getProductFn, updateProductFn } from "@/server-fns/products";

export const Route = createFileRoute("/admin/products/$productId")({
  head: () => ({
    meta: [{ title: "Edit Product — Admin — Signature by Lilian" }],
  }),
  beforeLoad: requireAdminForRoute,
  loader: async ({ params }) => {
    const product = await getProductFn({ data: { id: params.productId } });
    return { product };
  },
  component: EditProduct,
});

function EditProduct() {
  const { user } = Route.useRouteContext();
  const { product } = Route.useLoaderData();
  const navigate = useNavigate();

  return (
    <AdminShell user={user} title={`Edit — ${product.name}`}>
      <ProductForm
        submitLabel="Save Changes"
        initial={{
          name: product.name,
          size: product.size ?? "",
          description: product.description,
          price: String(product.price),
          tag: product.tag,
          benefits: product.benefits.join("\n"),
          inStock: product.inStock,
          imageUrl: product.imageUrl,
          galleryUrls: product.galleryUrls,
        }}
        onSubmit={async (values) => {
          try {
            await updateProductFn({ data: { id: product.id, patch: values } });
            toast.success("Product updated");
            await navigate({ to: "/admin/products" });
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update product");
          }
        }}
      />
    </AdminShell>
  );
}
