import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/AdminShell";
import { TreatmentForm } from "@/components/admin/TreatmentForm";
import { requireAdminForRoute } from "@/lib/auth/routeGuard";
import { createTreatmentFn, listTreatmentsFn } from "@/server-fns/treatments";

export const Route = createFileRoute("/admin/treatments/new")({
  head: () => ({
    meta: [{ title: "Add Treatment — Admin — Signature by Lilian" }],
  }),
  beforeLoad: requireAdminForRoute,
  component: NewTreatment,
});

function NewTreatment() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const { data: treatments } = useQuery({
    queryKey: ["admin", "treatments"],
    queryFn: () => listTreatmentsFn(),
  });
  const categoryOptions = useMemo(
    () => Array.from(new Set((treatments ?? []).map((t) => t.category).filter(Boolean))).sort(),
    [treatments],
  );

  return (
    <AdminShell user={user} title="Add Treatment">
      <TreatmentForm
        submitLabel="Create Treatment"
        categoryOptions={categoryOptions}
        onSubmit={async (values) => {
          try {
            await createTreatmentFn({ data: values });
            toast.success("Treatment created");
            await navigate({ to: "/admin/treatments" });
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to create treatment");
          }
        }}
      />
    </AdminShell>
  );
}
