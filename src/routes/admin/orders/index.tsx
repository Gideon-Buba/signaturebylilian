import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useState } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminForRoute } from "@/lib/auth/routeGuard";
import { listOrdersFn, updateOrderStatusFn, type OrderStatus } from "@/server-fns/orders";

export const Route = createFileRoute("/admin/orders/")({
  head: () => ({
    meta: [{ title: "Orders — Admin — Signature by Lilian" }],
  }),
  beforeLoad: requireAdminForRoute,
  component: OrdersList,
});

const ORDERS_QUERY_KEY = ["admin", "orders"] as const;

const STATUSES: OrderStatus[] = ["pending", "confirmed", "fulfilled", "cancelled"];

function OrdersList() {
  const { user } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data: orders, isLoading } = useQuery({
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

  return (
    <AdminShell user={user} title="Orders">
      {isLoading && <p className="mt-8 text-sm text-muted-foreground">Loading…</p>}

      {!isLoading && (orders ?? []).length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">No orders yet.</p>
      )}

      {!isLoading && (orders ?? []).length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs tracking-[0.12em] text-muted-foreground uppercase">
                <th className="py-3 pr-4 font-normal">Date</th>
                <th className="py-3 pr-4 font-normal">Customer</th>
                <th className="py-3 pr-4 font-normal">Phone</th>
                <th className="py-3 pr-4 font-normal">Items</th>
                <th className="py-3 pr-4 font-normal">Total</th>
                <th className="py-3 pr-4 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {(orders ?? []).map((order) => (
                <Fragment key={order.id}>
                  <tr
                    key={order.id}
                    className="cursor-pointer border-b border-border/60 hover:bg-secondary/40"
                    onClick={() => setExpanded((e) => (e === order.id ? null : order.id))}
                  >
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
                    <tr key={`${order.id}-detail`} className="border-b border-border/60 bg-secondary/20">
                      <td colSpan={6} className="px-4 py-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <p className="eyebrow text-muted-foreground">Delivery Address</p>
                            <p className="mt-1 text-foreground">{order.address}</p>
                            {order.email && (
                              <p className="mt-2 text-muted-foreground">{order.email}</p>
                            )}
                            {order.notes && (
                              <>
                                <p className="eyebrow mt-3 text-muted-foreground">Notes</p>
                                <p className="mt-1 text-foreground">{order.notes}</p>
                              </>
                            )}
                          </div>
                          <div>
                            <p className="eyebrow text-muted-foreground">Items</p>
                            <ul className="mt-1 space-y-1">
                              {order.items.map((item) => (
                                <li key={item.id} className="flex justify-between text-foreground">
                                  <span>
                                    {item.productName}
                                    {item.size ? ` (${item.size})` : ""} × {item.quantity}
                                  </span>
                                  <span>₦{(item.unitPrice * item.quantity).toLocaleString()}</span>
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
    </AdminShell>
  );
}
