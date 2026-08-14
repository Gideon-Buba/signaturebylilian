import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminForRoute } from "@/lib/auth/routeGuard";
import { deleteProductFn, listProductsFn, restoreProductFn } from "@/server-fns/products";

export const Route = createFileRoute("/admin/products/")({
  head: () => ({
    meta: [{ title: "Products — Admin — Signature by Lilian" }],
  }),
  beforeLoad: requireAdminForRoute,
  component: ProductsList,
});

const PRODUCTS_QUERY_KEY = ["admin", "products"] as const;

function ProductsList() {
  const { user } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"active" | "archived">("active");

  const { data: products, isLoading } = useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: () => listProductsFn(),
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => deleteProductFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Product archived");
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const restoreMutation = useMutation({
    mutationFn: (id: string) => restoreProductFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Product restored");
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const filtered = (products ?? []).filter((p) =>
    tab === "active" ? !p.isArchived : p.isArchived,
  );

  return (
    <AdminShell
      user={user}
      title="Products"
      actions={
        <Link
          to="/admin/products/new"
          className="eyebrow bg-plum px-5 py-3 text-primary-foreground transition-colors hover:bg-magenta"
        >
          Add Product
        </Link>
      }
    >
      <div className="flex gap-2 border-b border-border">
        {(["active", "archived"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`eyebrow -mb-px border-b-2 px-4 py-3 transition-colors ${
              tab === t
                ? "border-accent text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "active" ? "Active" : "Archived"}
          </button>
        ))}
      </div>

      {isLoading && <p className="mt-8 text-sm text-muted-foreground">Loading…</p>}

      {!isLoading && filtered.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">
          {tab === "active" ? "No active products yet." : "No archived products."}
        </p>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs tracking-[0.12em] text-muted-foreground uppercase">
                <th className="py-3 pr-4 font-normal">Image</th>
                <th className="py-3 pr-4 font-normal">Name</th>
                <th className="py-3 pr-4 font-normal">Price</th>
                <th className="py-3 pr-4 font-normal">Tag</th>
                <th className="py-3 pr-4 font-normal">Stock</th>
                <th className="py-3 pr-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border/60">
                  <td className="py-3 pr-4">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="size-12 rounded object-cover"
                      />
                    ) : (
                      <div className="size-12 rounded bg-secondary" />
                    )}
                  </td>
                  <td className="py-3 pr-4 text-foreground">
                    {p.name}
                    {p.size && <span className="text-muted-foreground"> ({p.size})</span>}
                  </td>
                  <td className="py-3 pr-4 text-foreground">₦{p.price.toLocaleString()}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{p.tag}</td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {p.inStock ? "In stock" : "Out of stock"}
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        to="/admin/products/$productId"
                        params={{ productId: p.id }}
                        className="text-accent hover:underline"
                      >
                        Edit
                      </Link>
                      {tab === "active" ? (
                        <button
                          type="button"
                          onClick={() => archiveMutation.mutate(p.id)}
                          disabled={archiveMutation.isPending}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          Archive
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => restoreMutation.mutate(p.id)}
                          disabled={restoreMutation.isPending}
                          className="text-muted-foreground hover:text-accent"
                        >
                          Restore
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
