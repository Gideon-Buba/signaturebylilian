import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminForRoute } from "@/lib/auth/routeGuard";
import { deleteJournalPostFn, listJournalPostsFn } from "@/server-fns/journal";

export const Route = createFileRoute("/admin/journal/")({
  head: () => ({
    meta: [{ title: "Journal — Admin — Signature by Lilian" }],
  }),
  beforeLoad: requireAdminForRoute,
  component: JournalList,
});

const JOURNAL_QUERY_KEY = ["admin", "journal"] as const;

function JournalList() {
  const { user } = Route.useRouteContext();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: JOURNAL_QUERY_KEY,
    queryFn: () => listJournalPostsFn(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteJournalPostFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Post deleted");
      queryClient.invalidateQueries({ queryKey: JOURNAL_QUERY_KEY });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <AdminShell
      user={user}
      title="Journal"
      actions={
        <Link
          to="/admin/journal/new"
          className="eyebrow bg-plum px-5 py-3 text-primary-foreground transition-colors hover:bg-magenta"
        >
          Write Post
        </Link>
      }
    >
      {isLoading && <p className="mt-8 text-sm text-muted-foreground">Loading…</p>}

      {!isLoading && (posts ?? []).length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">No posts yet.</p>
      )}

      {!isLoading && (posts ?? []).length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs tracking-[0.12em] text-muted-foreground uppercase">
                <th className="py-3 pr-4 font-normal">Title</th>
                <th className="py-3 pr-4 font-normal">Category</th>
                <th className="py-3 pr-4 font-normal">Status</th>
                <th className="py-3 pr-4 font-normal">Published</th>
                <th className="py-3 pr-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(posts ?? []).map((p) => (
                <tr key={p.id} className="border-b border-border/60">
                  <td className="py-3 pr-4 text-foreground">{p.title}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{p.category}</td>
                  <td className="py-3 pr-4 text-muted-foreground capitalize">{p.status}</td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        to="/admin/journal/$postId"
                        params={{ postId: p.id }}
                        className="text-accent hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete "${p.title}"? This can't be undone.`)) {
                            deleteMutation.mutate(p.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        Delete
                      </button>
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
