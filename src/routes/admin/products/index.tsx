import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/AdminShell";
import { BulkActionsBar } from "@/components/admin/BulkActionsBar";
import { ViewToggle, type ViewMode } from "@/components/admin/ViewToggle";
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
  const [view, setView] = useState<ViewMode>("list");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { data: products, isLoading } = useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: () => listProductsFn(),
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
  }

  const archiveMutation = useMutation({
    mutationFn: (id: string) => deleteProductFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Product archived");
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const restoreMutation = useMutation({
    mutationFn: (id: string) => restoreProductFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Product restored");
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const bulkArchiveMutation = useMutation({
    mutationFn: (ids: string[]) => Promise.all(ids.map((id) => deleteProductFn({ data: { id } }))),
    onSuccess: (_data, ids) => {
      toast.success(`${ids.length} product${ids.length === 1 ? "" : "s"} archived`);
      setSelected(new Set());
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const bulkRestoreMutation = useMutation({
    mutationFn: (ids: string[]) =>
      Promise.all(ids.map((id) => restoreProductFn({ data: { id } }))),
    onSuccess: (_data, ids) => {
      toast.success(`${ids.length} product${ids.length === 1 ? "" : "s"} restored`);
      setSelected(new Set());
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const filtered = (products ?? []).filter((p) =>
    tab === "active" ? !p.isArchived : p.isArchived,
  );

  function toggleTab(t: "active" | "archived") {
    setTab(t);
    setSelected(new Set());
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) =>
      prev.size === filtered.length ? new Set() : new Set(filtered.map((p) => p.id)),
    );
  }

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
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border">
        <div className="flex gap-2">
          {(["active", "archived"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggleTab(t)}
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
        <div className="mb-2">
          <ViewToggle value={view} onChange={setView} />
        </div>
      </div>

      <BulkActionsBar count={selected.size} onClear={() => setSelected(new Set())}>
        {tab === "active" ? (
          <button
            type="button"
            onClick={() => bulkArchiveMutation.mutate(Array.from(selected))}
            disabled={bulkArchiveMutation.isPending}
            className="eyebrow border border-border px-4 py-2.5 text-foreground transition-colors hover:border-destructive hover:text-destructive"
          >
            Archive selected
          </button>
        ) : (
          <button
            type="button"
            onClick={() => bulkRestoreMutation.mutate(Array.from(selected))}
            disabled={bulkRestoreMutation.isPending}
            className="eyebrow border border-border px-4 py-2.5 text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            Restore selected
          </button>
        )}
      </BulkActionsBar>

      {isLoading && <p className="mt-8 text-sm text-muted-foreground">Loading…</p>}

      {!isLoading && filtered.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">
          {tab === "active" ? "No active products yet." : "No archived products."}
        </p>
      )}

      {!isLoading && filtered.length > 0 && view === "list" && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs tracking-[0.12em] text-muted-foreground uppercase">
                <th className="w-10 py-3 pr-4 font-normal">
                  <input
                    type="checkbox"
                    aria-label="Select all"
                    checked={selected.size === filtered.length}
                    onChange={toggleAll}
                    className="size-4"
                  />
                </th>
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
                    <input
                      type="checkbox"
                      aria-label={`Select ${p.name}`}
                      checked={selected.has(p.id)}
                      onChange={() => toggleOne(p.id)}
                      className="size-4"
                    />
                  </td>
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

      {!isLoading && filtered.length > 0 && view === "grid" && (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="relative border border-border p-4 transition-colors hover:border-accent/60"
            >
              <input
                type="checkbox"
                aria-label={`Select ${p.name}`}
                checked={selected.has(p.id)}
                onChange={() => toggleOne(p.id)}
                className="absolute top-3 left-3 z-10 size-4"
              />
              <div className="aspect-square overflow-hidden rounded bg-secondary">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="size-full object-cover" />
                ) : (
                  <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              <p className="mt-3 text-foreground">
                {p.name}
                {p.size && <span className="text-muted-foreground"> ({p.size})</span>}
              </p>
              <div className="mt-1 flex items-center justify-between text-sm">
                <span className="text-foreground">₦{p.price.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">{p.tag}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {p.inStock ? "In stock" : "Out of stock"}
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <Link
                  to="/admin/products/$productId"
                  params={{ productId: p.id }}
                  className="text-sm text-accent hover:underline"
                >
                  Edit
                </Link>
                {tab === "active" ? (
                  <button
                    type="button"
                    onClick={() => archiveMutation.mutate(p.id)}
                    disabled={archiveMutation.isPending}
                    className="text-sm text-muted-foreground hover:text-destructive"
                  >
                    Archive
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => restoreMutation.mutate(p.id)}
                    disabled={restoreMutation.isPending}
                    className="text-sm text-muted-foreground hover:text-accent"
                  >
                    Restore
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
