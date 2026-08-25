import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, RefreshCw, Search, X } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminForRoute } from "@/lib/auth/routeGuard";
import { copyToClipboard } from "@/lib/clipboard";
import { cn } from "@/lib/utils";
import {
  listOrdersFn,
  updateOrderStatusFn,
  type Order,
  type OrderStatus,
  type PaymentStatus,
} from "@/server-fns/orders";

export const Route = createFileRoute("/admin/orders/")({
  head: () => ({
    meta: [{ title: "Orders — Admin — Signature by Lilian" }],
  }),
  beforeLoad: requireAdminForRoute,
  component: OrdersList,
});

const ORDERS_QUERY_KEY = ["admin", "orders"] as const;

const STATUSES: OrderStatus[] = ["pending", "confirmed", "fulfilled", "cancelled"];
const STATUS_FILTERS: (OrderStatus | "all")[] = ["all", ...STATUSES];
const PAYMENT_FILTERS: (PaymentStatus | "all")[] = ["all", "unpaid", "paid", "failed"];

function reference(order: Order) {
  return order.id.slice(0, 8).toUpperCase();
}

function matchesSearch(order: Order, query: string) {
  if (!query) return true;
  const q = query.trim().toLowerCase();
  return (
    order.id.toLowerCase().includes(q) ||
    order.customerName.toLowerCase().includes(q) ||
    order.phone.toLowerCase().includes(q) ||
    (order.email ?? "").toLowerCase().includes(q) ||
    (order.paymentReference ?? "").toLowerCase().includes(q) ||
    order.items.some((i) => i.productName.toLowerCase().includes(q))
  );
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function paymentColor(status: PaymentStatus) {
  if (status === "paid") return "text-emerald-600";
  if (status === "failed") return "text-destructive";
  return "text-muted-foreground";
}

function OrdersList() {
  const { user } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | "all">("all");

  const {
    data: orders,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: () => listOrdersFn(),
  });

  const statusMutation = useMutation({
    mutationFn: (vars: { id: string; status: OrderStatus }) => updateOrderStatusFn({ data: vars }),
    onSuccess: () => {
      toast.success("Order updated");
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const filtered = useMemo(() => {
    return (orders ?? []).filter(
      (o) =>
        matchesSearch(o, search) &&
        (statusFilter === "all" || o.status === statusFilter) &&
        (paymentFilter === "all" || o.paymentStatus === paymentFilter),
    );
  }, [orders, search, statusFilter, paymentFilter]);

  const hasFilters = search.trim() !== "" || statusFilter !== "all" || paymentFilter !== "all";

  return (
    <AdminShell
      user={user}
      title="Orders"
      actions={
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="eyebrow inline-flex items-center gap-2 border border-border px-4 py-2.5 text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
        >
          <RefreshCw className={cn("size-3.5", isFetching && "animate-spin")} />
          Refresh
        </button>
      }
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reference, name, phone, email…"
            className="w-full border border-input bg-background py-2.5 pr-9 pl-9 text-sm text-foreground outline-none focus:border-accent"
          />
          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearch("")}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
            className="border border-input bg-background px-3 py-2.5 text-xs text-foreground outline-none focus:border-accent"
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All statuses" : s}
              </option>
            ))}
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value as PaymentStatus | "all")}
            className="border border-input bg-background px-3 py-2.5 text-xs text-foreground outline-none focus:border-accent"
          >
            {PAYMENT_FILTERS.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All payments" : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && <p className="mt-8 text-sm text-muted-foreground">Loading…</p>}

      {!isLoading && (orders ?? []).length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">No orders yet.</p>
      )}

      {!isLoading && (orders ?? []).length > 0 && (
        <>
          <p className="mt-5 text-xs text-muted-foreground">
            {filtered.length} of {orders?.length ?? 0} order{orders?.length === 1 ? "" : "s"}
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setPaymentFilter("all");
                }}
                className="ml-2 text-accent hover:underline"
              >
                Clear filters
              </button>
            )}
          </p>

          {filtered.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">No orders match your search.</p>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs tracking-[0.12em] text-muted-foreground uppercase">
                    <th className="py-3 pr-4 font-normal">Reference</th>
                    <th className="py-3 pr-4 font-normal">Date</th>
                    <th className="py-3 pr-4 font-normal">Customer</th>
                    <th className="py-3 pr-4 font-normal">Phone</th>
                    <th className="py-3 pr-4 font-normal">Items</th>
                    <th className="py-3 pr-4 font-normal">Total</th>
                    <th className="py-3 pr-4 font-normal">Payment</th>
                    <th className="py-3 pr-4 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => (
                    <Fragment key={order.id}>
                      <tr
                        className="cursor-pointer border-b border-border/60 hover:bg-secondary/40"
                        onClick={() => setExpanded((e) => (e === order.id ? null : order.id))}
                      >
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs text-foreground">
                              {reference(order)}
                            </span>
                            <button
                              type="button"
                              aria-label="Copy reference"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(reference(order), "Reference");
                              }}
                              className="text-muted-foreground transition-colors hover:text-accent"
                            >
                              <Copy className="size-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 pr-4 text-foreground">{order.customerName}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{order.phone}</td>
                        <td className="py-3 pr-4 text-muted-foreground">
                          {order.items.reduce((n, i) => n + i.quantity, 0)} item(s)
                        </td>
                        <td className="py-3 pr-4 text-foreground">
                          ₦{order.subtotal.toLocaleString()}
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={cn("eyebrow text-[10px]", paymentColor(order.paymentStatus))}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 pr-4" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={order.status}
                            disabled={statusMutation.isPending}
                            onChange={(e) =>
                              statusMutation.mutate({
                                id: order.id,
                                status: e.target.value as OrderStatus,
                              })
                            }
                            className="border border-input bg-background px-2 py-1.5 text-xs text-foreground outline-none focus:border-accent"
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                      {expanded === order.id && (
                        <tr className="border-b border-border/60 bg-secondary/20">
                          <td colSpan={8} className="px-5 py-6">
                            <div className="grid gap-8 lg:grid-cols-3">
                              <div>
                                <p className="eyebrow text-muted-foreground">Order</p>
                                <dl className="mt-2 space-y-1.5 text-xs">
                                  <div className="flex justify-between gap-4">
                                    <dt className="text-muted-foreground">Reference</dt>
                                    <dd className="font-mono text-foreground">
                                      {reference(order)}
                                    </dd>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <dt className="text-muted-foreground">Order ID</dt>
                                    <dd className="font-mono break-all text-foreground">
                                      {order.id}
                                    </dd>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <dt className="text-muted-foreground">Placed</dt>
                                    <dd className="text-foreground">
                                      {formatDateTime(order.createdAt)}
                                    </dd>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <dt className="text-muted-foreground">Last updated</dt>
                                    <dd className="text-foreground">
                                      {formatDateTime(order.updatedAt)}
                                    </dd>
                                  </div>
                                </dl>

                                <p className="eyebrow mt-5 text-muted-foreground">Payment</p>
                                <dl className="mt-2 space-y-1.5 text-xs">
                                  <div className="flex justify-between gap-4">
                                    <dt className="text-muted-foreground">Status</dt>
                                    <dd
                                      className={cn("uppercase", paymentColor(order.paymentStatus))}
                                    >
                                      {order.paymentStatus}
                                    </dd>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <dt className="text-muted-foreground">Paystack ref</dt>
                                    <dd className="font-mono break-all text-foreground">
                                      {order.paymentReference ?? "—"}
                                    </dd>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <dt className="text-muted-foreground">Total</dt>
                                    <dd className="text-foreground">
                                      ₦{order.subtotal.toLocaleString()}
                                    </dd>
                                  </div>
                                </dl>
                              </div>

                              <div>
                                <p className="eyebrow text-muted-foreground">Customer</p>
                                <dl className="mt-2 space-y-1.5 text-xs">
                                  <div className="flex justify-between gap-4">
                                    <dt className="text-muted-foreground">Name</dt>
                                    <dd className="text-foreground">{order.customerName}</dd>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <dt className="text-muted-foreground">Phone</dt>
                                    <dd className="text-foreground">
                                      <a href={`tel:${order.phone}`} className="hover:text-accent">
                                        {order.phone}
                                      </a>
                                    </dd>
                                  </div>
                                  {order.email && (
                                    <div className="flex justify-between gap-4">
                                      <dt className="text-muted-foreground">Email</dt>
                                      <dd className="text-foreground">
                                        <a
                                          href={`mailto:${order.email}`}
                                          className="hover:text-accent"
                                        >
                                          {order.email}
                                        </a>
                                      </dd>
                                    </div>
                                  )}
                                </dl>

                                <p className="eyebrow mt-5 text-muted-foreground">
                                  Delivery Address
                                </p>
                                <p className="mt-2 text-xs leading-relaxed text-foreground">
                                  {order.address}
                                </p>

                                {order.notes && (
                                  <>
                                    <p className="eyebrow mt-5 text-muted-foreground">Notes</p>
                                    <p className="mt-2 text-xs leading-relaxed text-foreground">
                                      {order.notes}
                                    </p>
                                  </>
                                )}
                              </div>

                              <div>
                                <p className="eyebrow text-muted-foreground">
                                  Items ({order.items.reduce((n, i) => n + i.quantity, 0)})
                                </p>
                                <ul className="mt-2 space-y-2 text-xs">
                                  {order.items.map((item) => (
                                    <li key={item.id} className="flex justify-between gap-3">
                                      <span className="text-foreground">
                                        {item.productName}
                                        {item.size ? ` (${item.size})` : ""}
                                        <span className="text-muted-foreground">
                                          {" "}
                                          × {item.quantity}
                                        </span>
                                      </span>
                                      <span className="shrink-0 text-foreground">
                                        ₦{(item.unitPrice * item.quantity).toLocaleString()}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </AdminShell>
  );
}
