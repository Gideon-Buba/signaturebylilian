import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  Archive,
  CalendarClock,
  FileText,
  PackageX,
  ReceiptText,
  TrendingUp,
} from "lucide-react";

import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminForRoute } from "@/lib/auth/routeGuard";
import { getDashboardStatsFn } from "@/server-fns/dashboard";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Admin Dashboard — Signature by Lilian" }],
  }),
  beforeLoad: requireAdminForRoute,
  component: AdminDashboard,
});

function formatPrice(value: number) {
  return `₦${value.toLocaleString()}`;
}

function AdminDashboard() {
  const { user } = Route.useRouteContext();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin", "dashboard-stats"],
    queryFn: () => getDashboardStatsFn(),
  });

  return (
    <AdminShell user={user} title="Dashboard">
      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

      {stats && (
        <div className="space-y-10">
          {/* Top-line metrics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={TrendingUp}
              label="Revenue this month"
              value={formatPrice(stats.revenue.thisMonth)}
              sub={`${formatPrice(stats.revenue.allTime)} all time`}
            />
            <StatCard
              icon={ReceiptText}
              label="Orders needing action"
              value={String(stats.orders.pending)}
              sub={`${stats.orders.total} orders total`}
              href="/admin/orders"
            />
            <StatCard
              icon={CalendarClock}
              label="Pending bookings"
              value={String(stats.bookings.pending)}
              sub={`${stats.bookings.total} requests total`}
              href="/admin/bookings"
            />
            <StatCard
              icon={PackageX}
              label="Out of stock"
              value={String(stats.catalog.outOfStockProducts)}
              sub={`${stats.catalog.activeProducts} products live`}
              href="/admin/products"
            />
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Upcoming bookings */}
            <section>
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl text-foreground">Upcoming appointments</h2>
                <Link to="/admin/bookings" className="text-xs text-accent hover:underline">
                  View all
                </Link>
              </div>
              <div className="mt-4 border border-border">
                {stats.upcomingBookings.length === 0 && (
                  <p className="p-5 text-sm text-muted-foreground">No upcoming requests.</p>
                )}
                {stats.upcomingBookings.map((b, i) => (
                  <div
                    key={b.id}
                    className={`flex items-center justify-between gap-4 px-5 py-3.5 text-sm ${i > 0 ? "border-t border-border/60" : ""}`}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-foreground">{b.customerName}</p>
                      <p className="truncate text-xs text-muted-foreground">{b.treatmentName}</p>
                    </div>
                    <div className="shrink-0 text-right text-xs text-muted-foreground">
                      {b.preferredDate ? new Date(b.preferredDate).toLocaleDateString() : "No date"}
                      {b.preferredTime ? ` · ${b.preferredTime}` : ""}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent orders */}
            <section>
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl text-foreground">Recent orders</h2>
                <Link to="/admin/orders" className="text-xs text-accent hover:underline">
                  View all
                </Link>
              </div>
              <div className="mt-4 border border-border">
                {stats.recentOrders.length === 0 && (
                  <p className="p-5 text-sm text-muted-foreground">No orders yet.</p>
                )}
                {stats.recentOrders.map((o, i) => (
                  <div
                    key={o.id}
                    className={`flex items-center justify-between gap-4 px-5 py-3.5 text-sm ${i > 0 ? "border-t border-border/60" : ""}`}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-foreground">{o.customerName}</p>
                      <p className="truncate text-xs text-muted-foreground capitalize">{o.status}</p>
                    </div>
                    <div className="shrink-0 text-foreground">{formatPrice(o.subtotal)}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Top products */}
          <section>
            <h2 className="font-serif text-xl text-foreground">Best-selling products</h2>
            <div className="mt-4 border border-border">
              {stats.topProducts.length === 0 && (
                <p className="p-5 text-sm text-muted-foreground">No product sales yet.</p>
              )}
              {stats.topProducts.map((p, i) => (
                <div
                  key={p.name}
                  className={`flex items-center justify-between gap-4 px-5 py-3.5 text-sm ${i > 0 ? "border-t border-border/60" : ""}`}
                >
                  <p className="truncate text-foreground">{p.name}</p>
                  <div className="flex shrink-0 gap-6 text-xs text-muted-foreground">
                    <span>{p.unitsSold} sold</span>
                    <span className="text-foreground">{formatPrice(p.revenue)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Content health */}
          <section>
            <h2 className="font-serif text-xl text-foreground">Content &amp; catalog</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <MiniStat
                icon={FileText}
                label="Journal posts"
                value={`${stats.catalog.publishedPosts} published`}
                sub={`${stats.catalog.draftPosts} drafts`}
                href="/admin/journal"
              />
              <MiniStat
                icon={Archive}
                label="Archived products"
                value={String(stats.catalog.archivedProducts)}
                href="/admin/products"
              />
              <MiniStat
                icon={Archive}
                label="Active treatments"
                value={String(stats.catalog.activeTreatments)}
                sub={`${stats.catalog.archivedTreatments} archived`}
                href="/admin/treatments"
              />
            </div>
          </section>
        </div>
      )}
    </AdminShell>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  href?: string;
}) {
  const content = (
    <div className="border border-border p-5 transition-colors hover:border-accent">
      <Icon className="size-5 text-accent" />
      <p className="mt-3 font-serif text-2xl text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground/70">{sub}</p>}
    </div>
  );

  return href ? <Link to={href as "/admin"}>{content}</Link> : content;
}

function MiniStat({
  icon: Icon,
  label,
  value,
  sub,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  href: string;
}) {
  return (
    <Link
      to={href as "/admin"}
      className="flex items-center gap-4 border border-border p-4 transition-colors hover:border-accent"
    >
      <Icon className="size-5 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-sm text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">
          {label}
          {sub ? ` · ${sub}` : ""}
        </p>
      </div>
    </Link>
  );
}
