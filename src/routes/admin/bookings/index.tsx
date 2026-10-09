import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/AdminShell";
import { BookingsCalendar } from "@/components/admin/BookingsCalendar";
import { requireAdminForRoute } from "@/lib/auth/routeGuard";
import { listBookingsFn, updateBookingStatusFn, type BookingStatus } from "@/server-fns/bookings";

export const Route = createFileRoute("/admin/bookings/")({
  head: () => ({
    meta: [{ title: "Bookings — Admin — Signature by Lilian" }],
  }),
  beforeLoad: requireAdminForRoute,
  component: BookingsList,
});

const BOOKINGS_QUERY_KEY = ["admin", "bookings"] as const;

const STATUSES: BookingStatus[] = ["pending", "confirmed", "completed", "cancelled"];

function BookingsList() {
  const { user } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const [view, setView] = useState<"calendar" | "list">("calendar");

  const { data: bookings, isLoading } = useQuery({
    queryKey: BOOKINGS_QUERY_KEY,
    queryFn: () => listBookingsFn(),
  });

  const statusMutation = useMutation({
    mutationFn: (vars: { id: string; status: BookingStatus }) =>
      updateBookingStatusFn({ data: vars }),
    onSuccess: () => {
      toast.success("Booking updated");
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEY });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <AdminShell
      user={user}
      title="Bookings"
      actions={
        <div className="flex border border-border">
          {(["calendar", "list"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`px-4 py-2 text-xs capitalize transition-colors ${
                view === v
                  ? "bg-accent/10 text-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      }
    >
      {isLoading && <p className="mt-8 text-sm text-muted-foreground">Loading…</p>}

      {!isLoading && (bookings ?? []).length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">No appointment requests yet.</p>
      )}

      {!isLoading && view === "calendar" && (bookings ?? []).length > 0 && (
        <div className="mt-6">
          <BookingsCalendar
            bookings={bookings ?? []}
            busy={statusMutation.isPending}
            onStatusChange={(id, status) => statusMutation.mutate({ id, status })}
          />
        </div>
      )}

      {!isLoading && view === "list" && (bookings ?? []).length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[880px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs tracking-[0.12em] text-muted-foreground uppercase">
                <th className="py-3 pr-4 font-normal">Requested</th>
                <th className="py-3 pr-4 font-normal">Customer</th>
                <th className="py-3 pr-4 font-normal">Contact</th>
                <th className="py-3 pr-4 font-normal">Treatment</th>
                <th className="py-3 pr-4 font-normal">Preferred</th>
                <th className="py-3 pr-4 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {(bookings ?? []).map((b) => (
                <tr key={b.id} className="border-b border-border/60 hover:bg-secondary/40">
                  <td className="py-3 pr-4 text-muted-foreground">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 pr-4 text-foreground">{b.customerName}</td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    <div>{b.phone}</div>
                    {b.email && <div>{b.email}</div>}
                  </td>
                  <td className="py-3 pr-4 text-foreground">{b.treatmentName}</td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {b.preferredDate ? new Date(b.preferredDate).toLocaleDateString() : "—"}
                    {b.preferredTime ? ` · ${b.preferredTime}` : ""}
                  </td>
                  <td className="py-3 pr-4">
                    <select
                      value={b.status}
                      disabled={statusMutation.isPending}
                      onChange={(e) =>
                        statusMutation.mutate({ id: b.id, status: e.target.value as BookingStatus })
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
