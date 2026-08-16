import { createFileRoute, Link } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminForRoute } from "@/lib/auth/routeGuard";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Admin Dashboard — Signature by Lilian" }],
  }),
  beforeLoad: requireAdminForRoute,
  component: AdminDashboard,
});

const sections = [
  {
    to: "/admin/products" as const,
    title: "Products",
    copy: "Add, edit and archive skincare products — pricing, sizes, descriptions and photos.",
  },
  {
    to: "/admin/treatments" as const,
    title: "Spa Menu",
    copy: "Manage Oasis treatments and services — grouped by category, with featured highlights.",
  },
  {
    to: "/admin/journal" as const,
    title: "Journal",
    copy: "Write and publish skincare and wellness articles with the rich text editor.",
  },
  {
    to: "/admin/orders" as const,
    title: "Orders",
    copy: "Review incoming skincare orders, customer details, and update order status.",
  },
];

function AdminDashboard() {
  const { user } = Route.useRouteContext();

  return (
    <AdminShell user={user} title="Dashboard">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className="block border border-border p-6 transition-colors hover:border-accent"
          >
            <h2 className="font-serif text-xl text-foreground">{s.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.copy}</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
