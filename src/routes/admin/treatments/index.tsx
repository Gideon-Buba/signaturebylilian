import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminForRoute } from "@/lib/auth/routeGuard";
import {
  deleteTreatmentFn,
  listTreatmentsFn,
  restoreTreatmentFn,
} from "@/server-fns/treatments";

export const Route = createFileRoute("/admin/treatments/")({
  head: () => ({
    meta: [{ title: "Spa Menu — Admin — Signature by Lilian" }],
  }),
  beforeLoad: requireAdminForRoute,
  component: TreatmentsList,
});

const TREATMENTS_QUERY_KEY = ["admin", "treatments"] as const;

function TreatmentsList() {
  const { user } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"active" | "archived">("active");
  const [category, setCategory] = useState<string>("All");

  const { data: treatments, isLoading } = useQuery({
    queryKey: TREATMENTS_QUERY_KEY,
    queryFn: () => listTreatmentsFn(),
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => deleteTreatmentFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Treatment archived");
      queryClient.invalidateQueries({ queryKey: TREATMENTS_QUERY_KEY });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const restoreMutation = useMutation({
    mutationFn: (id: string) => restoreTreatmentFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Treatment restored");
      queryClient.invalidateQueries({ queryKey: TREATMENTS_QUERY_KEY });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const categories = useMemo(() => {
    const set = new Set((treatments ?? []).map((t) => t.category).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [treatments]);

  const filtered = (treatments ?? []).filter((t) => {
    if (tab === "active" ? t.isArchived : !t.isArchived) return false;
    if (category !== "All" && t.category !== category) return false;
    return true;
  });

  return (
    <AdminShell
      user={user}
      title="Spa Menu"
      actions={
        <Link
          to="/admin/treatments/new"
          className="eyebrow bg-plum px-5 py-3 text-primary-foreground transition-colors hover:bg-magenta"
        >
          Add Treatment
        </Link>
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border">
        <div className="flex gap-2">
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
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mb-2 border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <p className="mt-8 text-sm text-muted-foreground">Loading…</p>}

      {!isLoading && filtered.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">
          {tab === "active" ? "No active treatments yet." : "No archived treatments."}
        </p>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs tracking-[0.12em] text-muted-foreground uppercase">
                <th className="py-3 pr-4 font-normal">Name</th>
                <th className="py-3 pr-4 font-normal">Category</th>
                <th className="py-3 pr-4 font-normal">Price</th>
                <th className="py-3 pr-4 font-normal">Featured</th>
                <th className="py-3 pr-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-border/60">
                  <td className="py-3 pr-4 text-foreground">{t.name}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{t.category}</td>
                  <td className="py-3 pr-4 text-foreground">
                    {t.price != null ? `₦${t.price.toLocaleString()}` : "Contact for pricing"}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{t.isFeatured ? "Yes" : ""}</td>
                  <td className="py-3 pr-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        to="/admin/treatments/$treatmentId"
                        params={{ treatmentId: t.id }}
                        className="text-accent hover:underline"
                      >
                        Edit
                      </Link>
                      {tab === "active" ? (
                        <button
                          type="button"
                          onClick={() => archiveMutation.mutate(t.id)}
                          disabled={archiveMutation.isPending}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          Archive
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => restoreMutation.mutate(t.id)}
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
