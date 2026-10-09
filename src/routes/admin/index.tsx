import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  Archive,
  ArrowDownRight,
  ArrowUpRight,
  CalendarClock,
  FileText,
  Minus,
  PackageX,
  ReceiptText,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminForRoute } from "@/lib/auth/routeGuard";
import { getDashboardStatsFn, type DashboardPeriod } from "@/server-fns/dashboard";

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

const PERIODS: { value: DashboardPeriod; label: string }[] = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "all", label: "All time" },
];

function formatCompact(value: number) {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₦${Math.round(value / 1_000)}k`;
  return `₦${value}`;
}

function AdminDashboard() {
  const { user } = Route.useRouteContext();
  const [period, setPeriod] = useState<DashboardPeriod>("30d");

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin", "dashboard-stats", period],
    queryFn: () => getDashboardStatsFn({ data: { period } }),
    placeholderData: keepPreviousData,
  });

  const periodLabel = PERIODS.find((p) => p.value === period)?.label.toLowerCase() ?? "";
  const vsLabel = period === "all" ? undefined : `vs previous ${periodLabel}`;

  return (
    <AdminShell
      user={user}
      title="Dashboard"
      actions={
        <div className="flex border border-border">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-2 text-xs transition-colors ${
                period === p.value
                  ? "bg-accent/10 text-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      }
    >
      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

      {stats && (
        <div className="space-y-10">
          {/* Top-line metrics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={TrendingUp}
              label={`Revenue · ${periodLabel}`}
              value={formatPrice(stats.revenue.current)}
              trend={<Trend current={stats.revenue.current} previous={stats.revenue.previous} />}
              sub={vsLabel}
            />
            <StatCard
              icon={ReceiptText}
              label="Confirmed orders"
              value={String(stats.orders.current)}
              trend={<Trend current={stats.orders.current} previous={stats.orders.previous} />}
              sub={`${stats.orders.pending} awaiting payment · ${stats.orders.cancelled} cancelled`}
              href="/admin/orders"
            />
            <StatCard
              icon={Wallet}
              label="Average order value"
              value={formatPrice(stats.averageOrderValue.current)}
              trend={
                <Trend
                  current={stats.averageOrderValue.current}
                  previous={stats.averageOrderValue.previous}
                />
              }
              sub={vsLabel}
            />
            <StatCard
              icon={CalendarClock}
              label="Booking requests"
              value={String(stats.bookings.current)}
              trend={<Trend current={stats.bookings.current} previous={stats.bookings.previous} />}
              sub={`${stats.bookings.pending} awaiting confirmation`}
              href="/admin/bookings"
            />
          </div>

          {/* Revenue over time */}
          <section>
            <div className="flex flex-wrap items-end justify-between gap-2">
              <h2 className="font-serif text-xl text-foreground">Revenue over time</h2>
              <p className="text-xs text-muted-foreground">
                {formatPrice(stats.revenue.allTime)} earned all time
                {stats.revenue.awaitingPayment > 0 &&
                  ` · ${formatPrice(stats.revenue.awaitingPayment)} awaiting payment`}
              </p>
            </div>
            <div className="mt-4 h-64 border border-border p-4">
              {stats.revenue.current === 0 ? (
                <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No confirmed revenue in this period yet.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.timeline} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                    <CartesianGrid stroke="var(--border)" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      tickLine={false}
                      axisLine={false}
                      minTickGap={24}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      tickLine={false}
                      axisLine={false}
                      width={48}
                      tickFormatter={formatCompact}
                    />
                    <Tooltip
                      cursor={{ fill: "var(--secondary)" }}
                      contentStyle={{
                        background: "var(--background)",
                        border: "1px solid var(--border)",
                        fontSize: 12,
                      }}
                      formatter={(value: number) => [formatPrice(value), "Revenue"]}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="var(--accent)"
                      maxBarSize={36}
                      isAnimationActive={false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Best sellers */}
            <section>
              <h2 className="font-serif text-xl text-foreground">Best-selling products</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Ranked by revenue · {periodLabel}
              </p>
              <div className="mt-4 border border-border">
                {stats.topProducts.length === 0 && (
                  <p className="p-5 text-sm text-muted-foreground">
                    No product sales in this period.
                  </p>
                )}
                {stats.topProducts.map((p, i) => (
                  <div
                    key={p.name}
                    className={`px-5 py-3.5 text-sm ${i > 0 ? "border-t border-border/60" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="truncate text-foreground">
                        <span className="mr-2 text-xs text-muted-foreground">{i + 1}</span>
                        {p.name}
                      </p>
                      <div className="flex shrink-0 gap-4 text-xs text-muted-foreground">
                        <span>{p.unitsSold} sold</span>
                        <span className="text-foreground">{formatPrice(p.revenue)}</span>
                      </div>
                    </div>
                    <div className="mt-2 h-1 bg-secondary">
                      <div
                        className="h-1 bg-accent"
                        style={{ width: `${Math.max(3, Math.round(p.share * 100))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {stats.unsoldProducts.length > 0 && stats.orders.current > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground">Not selling this period</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {stats.unsoldProducts.map((p) => (
                      <span
                        key={p.id}
                        className="border border-border px-2.5 py-1 text-xs text-muted-foreground"
                      >
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Customers + order mix */}
            <section>
              <h2 className="font-serif text-xl text-foreground">Customers &amp; orders</h2>
              <p className="mt-1 text-xs text-muted-foreground">{periodLabel}</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <MiniStat
                  icon={Users}
                  label="Customers"
                  value={String(stats.customers.unique)}
                  sub={`${stats.customers.returning} returning`}
                  href="/admin/orders"
                />
                <MiniStat
                  icon={Wallet}
                  label="Paid online"
                  value={`${stats.orders.paidOnline} of ${stats.orders.total}`}
                  sub="orders"
                  href="/admin/orders"
                />
              </div>

              <div className="mt-4 border border-border p-5">
                <p className="text-xs text-muted-foreground">Order status</p>
                <StatusBar
                  segments={[
                    { label: "Pending", value: stats.orders.pending, className: "bg-gold" },
                    { label: "Confirmed", value: stats.orders.confirmed, className: "bg-accent" },
                    { label: "Fulfilled", value: stats.orders.fulfilled, className: "bg-plum" },
                    {
                      label: "Cancelled",
                      value: stats.orders.cancelled,
                      className: "bg-muted-foreground/40",
                    },
                  ]}
                />
              </div>

              <div className="mt-4 border border-border">
                <p className="border-b border-border/60 px-5 py-3 text-xs text-muted-foreground">
                  Top customers by spend
                </p>
                {stats.topCustomers.length === 0 && (
                  <p className="p-5 text-sm text-muted-foreground">No customers in this period.</p>
                )}
                {stats.topCustomers.map((c, i) => (
                  <div
                    key={c.phone + c.name}
                    className={`flex items-center justify-between gap-4 px-5 py-3 text-sm ${i > 0 ? "border-t border-border/60" : ""}`}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-foreground">{c.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {c.orders} {c.orders === 1 ? "order" : "orders"} · {c.phone}
                      </p>
                    </div>
                    <span className="shrink-0 text-foreground">{formatPrice(c.spent)}</span>
                  </div>
                ))}
              </div>
            </section>
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

              <div className="mt-4 border border-border">
                <p className="border-b border-border/60 px-5 py-3 text-xs text-muted-foreground">
                  Most requested treatments · {periodLabel}
                </p>
                {stats.topTreatments.length === 0 && (
                  <p className="p-5 text-sm text-muted-foreground">
                    No booking requests in this period.
                  </p>
                )}
                {stats.topTreatments.map((t, i) => (
                  <div
                    key={t.name}
                    className={`flex items-center justify-between gap-4 px-5 py-3 text-sm ${i > 0 ? "border-t border-border/60" : ""}`}
                  >
                    <p className="truncate text-foreground">{t.name}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {t.bookings} {t.bookings === 1 ? "request" : "requests"}
                    </span>
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
                      <p className="truncate text-xs text-muted-foreground capitalize">
                        {o.status} · {new Date(o.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="shrink-0 text-foreground">{formatPrice(o.subtotal)}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>

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
                icon={PackageX}
                label="Out of stock"
                value={String(stats.catalog.outOfStockProducts)}
                sub={`${stats.catalog.activeProducts} live`}
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

function Trend({ current, previous }: { current: number; previous: number | null }) {
  if (previous === null) return null;
  if (previous === 0) {
    return current > 0 ? (
      <span className="text-xs text-accent">New</span>
    ) : (
      <Minus className="size-3.5 text-muted-foreground" />
    );
  }
  const change = Math.round(((current - previous) / previous) * 100);
  if (change === 0) return <span className="text-xs text-muted-foreground">0%</span>;
  const up = change > 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs ${up ? "text-emerald-600" : "text-red-600"}`}
    >
      <Icon className="size-3.5" />
      {Math.abs(change)}%
    </span>
  );
}

function StatusBar({
  segments,
}: {
  segments: { label: string; value: number; className: string }[];
}) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  if (total === 0)
    return <p className="mt-3 text-sm text-muted-foreground">No orders in this period.</p>;
  return (
    <>
      <div className="mt-3 flex h-2 overflow-hidden bg-secondary">
        {segments
          .filter((s) => s.value > 0)
          .map((s) => (
            <div
              key={s.label}
              className={s.className}
              style={{ width: `${(s.value / total) * 100}%` }}
            />
          ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
        {segments.map((s) => (
          <span key={s.label} className="inline-flex items-center gap-1.5">
            <span className={`size-2 ${s.className}`} />
            {s.label} {s.value}
          </span>
        ))}
      </div>
    </>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  href,
  trend,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string | undefined;
  href?: string;
  trend?: ReactNode;
}) {
  const content = (
    <div className="border border-border p-5 transition-colors hover:border-accent">
      <div className="flex items-center justify-between">
        <Icon className="size-5 text-accent" />
        {trend}
      </div>
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
