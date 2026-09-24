import { ChevronLeft, ChevronRight, Mail, MessageCircle, Phone } from "lucide-react";
import { useMemo, useState } from "react";

import type { Booking, BookingStatus } from "@/server-fns/bookings";

const STATUSES: BookingStatus[] = ["pending", "confirmed", "completed", "cancelled"];

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const STATUS_STYLES: Record<BookingStatus, { pill: string; dot: string }> = {
  pending: { pill: "bg-gold/15 text-foreground", dot: "bg-gold" },
  confirmed: { pill: "bg-accent/15 text-foreground", dot: "bg-accent" },
  completed: { pill: "bg-plum/15 text-foreground", dot: "bg-plum" },
  cancelled: {
    pill: "bg-secondary text-muted-foreground line-through",
    dot: "bg-muted-foreground/40",
  },
};

// preferred_date is a plain YYYY-MM-DD. Building keys by hand avoids the
// UTC-shift bugs of `new Date("2026-09-15")`.
function dayKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatTime(time: string | null) {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  if (h === undefined || m === undefined || Number.isNaN(h) || Number.isNaN(m)) return time;
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
}

function formatLongDate(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  if (!y || !m || !d) return key;
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function whatsappLink(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("0") ? `234${digits.slice(1)}` : digits;
  return `https://wa.me/${intl}`;
}

function byTime(a: Booking, b: Booking) {
  return (a.preferredTime ?? "99:99").localeCompare(b.preferredTime ?? "99:99");
}

export function BookingsCalendar({
  bookings,
  onStatusChange,
  busy,
}: {
  bookings: Booking[];
  onStatusChange: (id: string, status: BookingStatus) => void;
  busy: boolean;
}) {
  const today = new Date();
  const todayKey = dayKey(today);
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(todayKey);
  const [showCancelled, setShowCancelled] = useState(false);

  const visible = useMemo(
    () => bookings.filter((b) => showCancelled || b.status !== "cancelled"),
    [bookings, showCancelled],
  );

  const byDay = useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const b of visible) {
      if (!b.preferredDate) continue;
      const list = map.get(b.preferredDate) ?? [];
      list.push(b);
      map.set(b.preferredDate, list);
    }
    for (const list of map.values()) list.sort(byTime);
    return map;
  }, [visible]);

  const undated = visible.filter((b) => !b.preferredDate);

  // Monday-first grid covering whole weeks around the month.
  const gridStart = new Date(month);
  gridStart.setDate(1 - ((month.getDay() + 6) % 7));
  const cells = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
  const weeks = cells.slice(35).some((d) => d.getMonth() === month.getMonth()) ? 6 : 5;

  const monthCount = visible.filter((b) => {
    if (!b.preferredDate) return false;
    const [y, m] = b.preferredDate.split("-").map(Number);
    return y === month.getFullYear() && m === month.getMonth() + 1;
  }).length;

  const agenda = byDay.get(selected) ?? [];

  const go = (delta: number) =>
    setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1));

  return (
    <div className="grid gap-8 xl:grid-cols-[1.6fr_1fr]">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => go(-1)}
              className="border border-border p-2 text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => go(1)}
              className="border border-border p-2 text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <ChevronRight className="size-4" />
            </button>
            <h2 className="ml-2 font-serif text-2xl text-foreground">
              {month.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
            </h2>
            <span className="text-xs text-muted-foreground">
              {monthCount} {monthCount === 1 ? "appointment" : "appointments"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={showCancelled}
                onChange={(e) => setShowCancelled(e.target.checked)}
                className="size-3.5"
              />
              Show cancelled
            </label>
            <button
              type="button"
              onClick={() => {
                setMonth(new Date(today.getFullYear(), today.getMonth(), 1));
                setSelected(todayKey);
              }}
              className="eyebrow border border-border px-4 py-2 text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              Today
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <div className="min-w-[640px] border-t border-l border-border">
            <div className="grid grid-cols-7">
              {WEEKDAYS.map((w) => (
                <div
                  key={w}
                  className="eyebrow border-r border-b border-border bg-secondary/40 px-3 py-2 text-muted-foreground"
                >
                  {w}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {cells.slice(0, weeks * 7).map((d) => {
                const key = dayKey(d);
                const inMonth = d.getMonth() === month.getMonth();
                const items = byDay.get(key) ?? [];
                const isSelected = key === selected;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelected(key)}
                    className={`flex min-h-28 flex-col items-stretch gap-1 border-r border-b border-border p-1.5 text-left transition-colors hover:bg-secondary/40 ${
                      inMonth ? "" : "bg-secondary/20"
                    } ${isSelected ? "outline outline-2 -outline-offset-2 outline-accent" : ""}`}
                  >
                    <span
                      className={`flex size-6 items-center justify-center self-end text-xs ${
                        key === todayKey
                          ? "rounded-full bg-accent text-accent-foreground"
                          : inMonth
                            ? "text-foreground"
                            : "text-muted-foreground/50"
                      }`}
                    >
                      {d.getDate()}
                    </span>
                    {items.slice(0, 3).map((b) => (
                      <span
                        key={b.id}
                        className={`truncate px-1.5 py-0.5 text-[11px] leading-tight ${STATUS_STYLES[b.status].pill}`}
                      >
                        {b.preferredTime ? `${formatTime(b.preferredTime)} ` : ""}
                        {b.customerName}
                      </span>
                    ))}
                    {items.length > 3 && (
                      <span className="px-1.5 text-[11px] text-muted-foreground">
                        +{items.length - 3} more
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
          {STATUSES.map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5 capitalize">
              <span className={`size-2 ${STATUS_STYLES[s].dot}`} />
              {s}
            </span>
          ))}
        </div>
      </div>

      <aside>
        <h2 className="font-serif text-2xl text-foreground">{formatLongDate(selected)}</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {agenda.length === 0
            ? "Nothing booked for this day."
            : `${agenda.length} ${agenda.length === 1 ? "appointment" : "appointments"}`}
        </p>
        <div className="mt-4 space-y-3">
          {agenda.map((b) => (
            <BookingCard key={b.id} booking={b} busy={busy} onStatusChange={onStatusChange} />
          ))}
        </div>

        {undated.length > 0 && (
          <div className="mt-10">
            <h3 className="font-serif text-xl text-foreground">No date requested</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              These requests didn't pick a day. Reach out to arrange one.
            </p>
            <div className="mt-4 space-y-3">
              {undated.map((b) => (
                <BookingCard key={b.id} booking={b} busy={busy} onStatusChange={onStatusChange} />
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function BookingCard({
  booking: b,
  busy,
  onStatusChange,
}: {
  booking: Booking;
  busy: boolean;
  onStatusChange: (id: string, status: BookingStatus) => void;
}) {
  return (
    <div className="border border-border p-4 text-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-foreground">
            {b.preferredTime && (
              <span className="mr-2 text-accent">{formatTime(b.preferredTime)}</span>
            )}
            {b.customerName}
          </p>
          <p className="mt-0.5 text-muted-foreground">{b.treatmentName}</p>
        </div>
        <select
          value={b.status}
          disabled={busy}
          onChange={(e) => onStatusChange(b.id, e.target.value as BookingStatus)}
          className="shrink-0 border border-input bg-background px-2 py-1.5 text-xs text-foreground capitalize outline-none focus:border-accent"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {b.notes && (
        <p className="mt-3 border-l-2 border-border pl-3 text-muted-foreground">{b.notes}</p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <a href={`tel:${b.phone}`} className="inline-flex items-center gap-1.5 hover:text-accent">
          <Phone className="size-3.5" />
          {b.phone}
        </a>
        <a
          href={whatsappLink(b.phone)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 hover:text-accent"
        >
          <MessageCircle className="size-3.5" />
          WhatsApp
        </a>
        {b.email && (
          <a
            href={`mailto:${b.email}`}
            className="inline-flex items-center gap-1.5 hover:text-accent"
          >
            <Mail className="size-3.5" />
            {b.email}
          </a>
        )}
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground/70">
        Requested {new Date(b.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
