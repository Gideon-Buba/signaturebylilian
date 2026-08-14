import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/AdminShell";
import { TreatmentForm } from "@/components/admin/TreatmentForm";
import { requireAdminForRoute } from "@/lib/auth/routeGuard";
import { getTreatmentFn, listTreatmentsFn, updateTreatmentFn } from "@/server-fns/treatments";

export const Route = createFileRoute("/admin/treatments/$treatmentId")({
  head: () => ({
    meta: [{ title: "Edit Treatment — Admin — Signature by Lilian" }],
  }),
  beforeLoad: requireAdminForRoute,
  loader: async ({ params }) => {
    const treatment = await getTreatmentFn({ data: { id: params.treatmentId } });
    return { treatment };
  },
  component: EditTreatment,
});

function EditTreatment() {
  const { user } = Route.useRouteContext();
  const { treatment } = Route.useLoaderData();
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
    <AdminShell user={user} title={`Edit — ${treatment.name}`}>
      <TreatmentForm
        submitLabel="Save Changes"
        categoryOptions={categoryOptions}
        initial={{
          name: treatment.name,
          category: treatment.category,
          description: treatment.description,
          duration: treatment.duration ?? "",
          price: treatment.price != null ? String(treatment.price) : "",
          benefits: treatment.benefits.join("\n"),
          imageUrl: treatment.imageUrl,
          isFeatured: treatment.isFeatured,
          isActive: treatment.isActive,
        }}
        onSubmit={async (values) => {
          try {
            await updateTreatmentFn({ data: { id: treatment.id, patch: values } });
            toast.success("Treatment updated");
            await navigate({ to: "/admin/treatments" });
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update treatment");
          }
        }}
      />
    </AdminShell>
  );
}
