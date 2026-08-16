import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/AdminShell";
import { JournalForm } from "@/components/admin/JournalForm";
import { requireAdminForRoute } from "@/lib/auth/routeGuard";
import { createJournalPostFn } from "@/server-fns/journal";

export const Route = createFileRoute("/admin/journal/new")({
  head: () => ({
    meta: [{ title: "Write Post — Admin — Signature by Lilian" }],
  }),
  beforeLoad: requireAdminForRoute,
  component: NewJournalPost,
});

function NewJournalPost() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();

  return (
    <AdminShell user={user} title="Write Post">
      <JournalForm
        submitLabel="Create Post"
        onSubmit={async (values) => {
          try {
            await createJournalPostFn({ data: values });
            toast.success("Post created");
            await navigate({ to: "/admin/journal" });
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to create post");
          }
        }}
      />
    </AdminShell>
  );
}
