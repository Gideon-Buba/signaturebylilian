import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdminForRoute } from "@/lib/auth/routeGuard";
import { createProductFn } from "@/server-fns/products";

export const Route = createFileRoute("/admin/products/new")({
  head: () => ({
    meta: [{ title: "Add Product — Admin — Signature by Lilian" }],
  }),
  beforeLoad: requireAdminForRoute,
  component: NewProduct,
});

function NewProduct() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();

  return (
    <AdminShell user={user} title="Add Product">
      <ProductForm
        submitLabel="Create Product"
        onSubmit={async (values) => {
          try {
            await createProductFn({ data: values });
            toast.success("Product created");
            await navigate({ to: "/admin/products" });
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to create product");
          }
        }}
      />
    </AdminShell>
  );
}
