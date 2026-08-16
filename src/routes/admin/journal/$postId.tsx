import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/AdminShell";
import { JournalForm } from "@/components/admin/JournalForm";
import { requireAdminForRoute } from "@/lib/auth/routeGuard";
import { getJournalPostByIdFn, updateJournalPostFn } from "@/server-fns/journal";

export const Route = createFileRoute("/admin/journal/$postId")({
  head: () => ({
    meta: [{ title: "Edit Post — Admin — Signature by Lilian" }],
  }),
  beforeLoad: requireAdminForRoute,
  loader: async ({ params }) => {
    const post = await getJournalPostByIdFn({ data: { id: params.postId } });
    return { post };
  },
  component: EditJournalPost,
});

function EditJournalPost() {
  const { user } = Route.useRouteContext();
  const { post } = Route.useLoaderData();
  const navigate = useNavigate();

  return (
    <AdminShell user={user} title={`Edit — ${post.title}`}>
      <JournalForm
        submitLabel="Save Changes"
        initial={{
          title: post.title,
          category: post.category,
          excerpt: post.excerpt,
          body: post.body,
          readTime: post.readTime ?? "",
          status: post.status,
          coverImageUrl: post.coverImageUrl,
        }}
        onSubmit={async (values) => {
          try {
            await updateJournalPostFn({ data: { id: post.id, patch: values } });
            toast.success("Post updated");
            await navigate({ to: "/admin/journal" });
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update post");
          }
        }}
      />
    </AdminShell>
  );
}
