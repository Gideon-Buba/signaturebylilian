import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/session";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type OrderRow = {
  id: string;
  customer_name: string;
  phone: string;
  status: string;
  subtotal: number;
  payment_status: string;
  created_at: string;
};
type OrderItemRow = {
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
};
type BookingRow = {
  id: string;
  customer_name: string;
  treatment_name: string;
  status: string;
  preferred_date: string | null;
  preferred_time: string | null;
  created_at: string;
};
type ProductRow = { id: string; name: string; is_archived: boolean; in_stock: boolean };
type TreatmentRow = { is_archived: boolean; is_active: boolean };
type JournalRow = { status: string };

export type DashboardPeriod = "7d" | "30d" | "90d" | "all";

type Trend = { current: number; previous: number | null };

export type DashboardStats = {
  period: DashboardPeriod;
  revenue: Trend & { allTime: number; awaitingPayment: number };
  orders: Trend & {
    total: number;
    pending: number;
    confirmed: number;
    fulfilled: number;
    cancelled: number;
    /** Orders in the period that were paid online (vs. bank transfer / manual). */
    paidOnline: number;
  };
  averageOrderValue: Trend;
  customers: { unique: number; returning: number };
  bookings: Trend & { total: number; pending: number; confirmed: number };
  /** Revenue and order count per day (or per month for long ranges). */
  timeline: { label: string; revenue: number; orders: number }[];
  timelineUnit: "day" | "month";
  recentOrders: {
    id: string;
    customerName: string;
    status: string;
    subtotal: number;
    createdAt: string;
  }[];
  upcomingBookings: {
    id: string;
    customerName: string;
    treatmentName: string;
    preferredDate: string | null;
    preferredTime: string | null;
    status: string;
  }[];
  topProducts: { name: string; unitsSold: number; revenue: number; share: number }[];
  /** Live products with no sales in the period. */
  unsoldProducts: { id: string; name: string }[];
  topCustomers: { name: string; phone: string; orders: number; spent: number }[];
  topTreatments: { name: string; bookings: number }[];
  catalog: {
    activeProducts: number;
    archivedProducts: number;
    outOfStockProducts: number;
    activeTreatments: number;
    archivedTreatments: number;
    publishedPosts: number;
    draftPosts: number;
  };
};

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function dayKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export const getDashboardStatsFn = createServerFn({ method: "GET" })
  .validator(z.object({ period: z.enum(["7d", "30d", "90d", "all"]).default("30d") }).default({}))
  .handler(async ({ data }): Promise<DashboardStats> => {
    await requireAdmin();
    const supabase = getSupabaseServerClient();
    const period = data.period;

    const [ordersRes, orderItemsRes, bookingsRes, productsRes, treatmentsRes, journalRes] =
      await Promise.all([
        supabase
          .from("orders")
          .select("id, customer_name, phone, status, subtotal, payment_status, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("order_items")
          .select("order_id, product_id, product_name, unit_price, quantity"),
        supabase
          .from("bookings")
          .select(
            "id, customer_name, treatment_name, status, preferred_date, preferred_time, created_at",
          )
          .order("created_at", { ascending: false }),
        supabase.from("products").select("id, name, is_archived, in_stock"),
        supabase.from("treatments").select("is_archived, is_active"),
        supabase.from("journal_posts").select("status"),
      ]);

    if (ordersRes.error) throw new Error(ordersRes.error.message);
    if (orderItemsRes.error) throw new Error(orderItemsRes.error.message);
    if (bookingsRes.error) throw new Error(bookingsRes.error.message);
    if (productsRes.error) throw new Error(productsRes.error.message);
    if (treatmentsRes.error) throw new Error(treatmentsRes.error.message);
    if (journalRes.error) throw new Error(journalRes.error.message);

    const orders = ordersRes.data as OrderRow[];
    const orderItems = orderItemsRes.data as OrderItemRow[];
    const bookings = bookingsRes.data as BookingRow[];
    const products = productsRes.data as ProductRow[];
    const treatments = treatmentsRes.data as TreatmentRow[];
    const journalPosts = journalRes.data as JournalRow[];

    // ---- Period windows ----
    const now = new Date();
    const days = period === "all" ? null : Number(period.replace("d", ""));
    const periodStart = days ? new Date(startOfDay(now).getTime() - (days - 1) * DAY_MS) : null;
    const previousStart =
      days && periodStart ? new Date(periodStart.getTime() - days * DAY_MS) : null;

    const inCurrent = (iso: string) => !periodStart || new Date(iso) >= periodStart;
    const inPrevious = (iso: string) => {
      if (!periodStart || !previousStart) return false;
      const t = new Date(iso);
      return t >= previousStart && t < periodStart;
    };

    // Money counted as earned: not cancelled, and either paid online or
    // confirmed/fulfilled by hand (bank transfers). Pending + unpaid orders are
    // shown separately as "awaiting payment".
    const isEarned = (o: OrderRow) =>
      o.status !== "cancelled" &&
      (o.payment_status === "paid" || o.status === "confirmed" || o.status === "fulfilled");
    const isAwaiting = (o: OrderRow) => o.status === "pending" && o.payment_status !== "paid";

    const sum = (rows: OrderRow[]) => rows.reduce((s, o) => s + o.subtotal, 0);

    const earned = orders.filter(isEarned);
    const earnedCurrent = earned.filter((o) => inCurrent(o.created_at));
    const earnedPrevious = earned.filter((o) => inPrevious(o.created_at));

    const revenueCurrent = sum(earnedCurrent);
    const revenuePrevious = days ? sum(earnedPrevious) : null;

    const aov = (rows: OrderRow[]) => (rows.length ? Math.round(sum(rows) / rows.length) : 0);

    const ordersInPeriod = orders.filter((o) => inCurrent(o.created_at));
    const ordersByStatus = {
      total: ordersInPeriod.length,
      pending: ordersInPeriod.filter((o) => o.status === "pending").length,
      confirmed: ordersInPeriod.filter((o) => o.status === "confirmed").length,
      fulfilled: ordersInPeriod.filter((o) => o.status === "fulfilled").length,
      cancelled: ordersInPeriod.filter((o) => o.status === "cancelled").length,
      paidOnline: ordersInPeriod.filter(
        (o) => o.payment_status === "paid" && o.status !== "cancelled",
      ).length,
    };

    // ---- Customers (phone number is the stable identity for guest checkout) ----
    const customerKey = (o: OrderRow) =>
      o.phone.replace(/\D/g, "") || o.customer_name.toLowerCase();
    const firstOrderAt = new Map<string, string>();
    for (const o of [...earned].reverse()) {
      if (!firstOrderAt.has(customerKey(o))) firstOrderAt.set(customerKey(o), o.created_at);
    }
    const periodCustomers = new Set(earnedCurrent.map(customerKey));
    const returning = [...periodCustomers].filter((k) => {
      const first = firstOrderAt.get(k);
      return first ? !inCurrent(first) : false;
    }).length;

    const spendByCustomer = new Map<
      string,
      { name: string; phone: string; orders: number; spent: number }
    >();
    for (const o of earnedCurrent) {
      const key = customerKey(o);
      const entry = spendByCustomer.get(key) ?? {
        name: o.customer_name,
        phone: o.phone,
        orders: 0,
        spent: 0,
      };
      entry.orders += 1;
      entry.spent += o.subtotal;
      spendByCustomer.set(key, entry);
    }
    const topCustomers = [...spendByCustomer.values()]
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 5);

    // ---- Products (only lines from earned orders inside the period) ----
    const earnedIds = new Set(earnedCurrent.map((o) => o.id));
    const productSales = new Map<string, { unitsSold: number; revenue: number }>();
    const soldProductIds = new Set<string>();
    for (const item of orderItems) {
      if (!earnedIds.has(item.order_id)) continue;
      if (item.product_id) soldProductIds.add(item.product_id);
      const entry = productSales.get(item.product_name) ?? { unitsSold: 0, revenue: 0 };
      entry.unitsSold += item.quantity;
      entry.revenue += item.unit_price * item.quantity;
      productSales.set(item.product_name, entry);
    }
    const totalProductRevenue = [...productSales.values()].reduce((s, v) => s + v.revenue, 0);
    const topProducts = [...productSales.entries()]
      .map(([name, v]) => ({
        name,
        ...v,
        share: totalProductRevenue ? v.revenue / totalProductRevenue : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);
    const unsoldProducts = products
      .filter((p) => !p.is_archived && !soldProductIds.has(p.id))
      .map((p) => ({ id: p.id, name: p.name }))
      .slice(0, 8);

    // ---- Timeline (daily for up to 90 days, monthly for all time) ----
    const timelineUnit: "day" | "month" = period === "all" ? "month" : "day";
    const buckets = new Map<string, { label: string; revenue: number; orders: number }>();
    if (timelineUnit === "day" && periodStart) {
      for (let t = periodStart.getTime(); t <= now.getTime(); t += DAY_MS) {
        const d = new Date(t);
        buckets.set(dayKey(d), {
          label: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
          revenue: 0,
          orders: 0,
        });
      }
    }
    for (const o of [...earnedCurrent].reverse()) {
      const d = new Date(o.created_at);
      const key = timelineUnit === "day" ? dayKey(d) : monthKey(d);
      const bucket = buckets.get(key) ?? {
        label:
          timelineUnit === "day"
            ? d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
            : d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" }),
        revenue: 0,
        orders: 0,
      };
      bucket.revenue += o.subtotal;
      bucket.orders += 1;
      buckets.set(key, bucket);
    }
    const timeline = [...buckets.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v);

    // ---- Bookings ----
    const bookingsInPeriod = bookings.filter((b) => inCurrent(b.created_at));
    const bookingsPrevious = days ? bookings.filter((b) => inPrevious(b.created_at)).length : null;
    const treatmentCounts = new Map<string, number>();
    for (const b of bookingsInPeriod) {
      if (b.status === "cancelled") continue;
      treatmentCounts.set(b.treatment_name, (treatmentCounts.get(b.treatment_name) ?? 0) + 1);
    }
    const topTreatments = [...treatmentCounts.entries()]
      .map(([name, count]) => ({ name, bookings: count }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5);

    const today = dayKey(now);
    const upcomingBookings = bookings
      .filter(
        (b) =>
          (b.status === "pending" || b.status === "confirmed") &&
          (!b.preferred_date || b.preferred_date >= today),
      )
      .sort((a, b) => (a.preferred_date ?? "9999").localeCompare(b.preferred_date ?? "9999"))
      .slice(0, 5)
      .map((b) => ({
        id: b.id,
        customerName: b.customer_name,
        treatmentName: b.treatment_name,
        preferredDate: b.preferred_date,
        preferredTime: b.preferred_time,
        status: b.status,
      }));

    return {
      period,
      revenue: {
        current: revenueCurrent,
        previous: revenuePrevious,
        allTime: sum(earned),
        awaitingPayment: sum(orders.filter(isAwaiting)),
      },
      orders: {
        current: earnedCurrent.length,
        previous: days ? earnedPrevious.length : null,
        ...ordersByStatus,
      },
      averageOrderValue: {
        current: aov(earnedCurrent),
        previous: days ? aov(earnedPrevious) : null,
      },
      customers: { unique: periodCustomers.size, returning },
      bookings: {
        current: bookingsInPeriod.length,
        previous: bookingsPrevious,
        total: bookings.length,
        pending: bookings.filter((b) => b.status === "pending").length,
        confirmed: bookings.filter((b) => b.status === "confirmed").length,
      },
      timeline,
      timelineUnit,
      recentOrders: orders.slice(0, 6).map((o) => ({
        id: o.id,
        customerName: o.customer_name,
        status: o.status,
        subtotal: o.subtotal,
        createdAt: o.created_at,
      })),
      upcomingBookings,
      topProducts,
      unsoldProducts,
      topCustomers,
      topTreatments,
      catalog: {
        activeProducts: products.filter((p) => !p.is_archived).length,
        archivedProducts: products.filter((p) => p.is_archived).length,
        outOfStockProducts: products.filter((p) => !p.is_archived && !p.in_stock).length,
        activeTreatments: treatments.filter((t) => !t.is_archived && t.is_active).length,
        archivedTreatments: treatments.filter((t) => t.is_archived).length,
        publishedPosts: journalPosts.filter((p) => p.status === "published").length,
        draftPosts: journalPosts.filter((p) => p.status === "draft").length,
      },
    };
  });
