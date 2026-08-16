import { createServerFn } from "@tanstack/react-start";

import { requireAdmin } from "@/lib/auth/session";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type OrderRow = { id: string; customer_name: string; status: string; subtotal: number; created_at: string };
type OrderItemRow = { product_name: string; unit_price: number; quantity: number };
type BookingRow = {
  id: string;
  customer_name: string;
  treatment_name: string;
  status: string;
  preferred_date: string | null;
  preferred_time: string | null;
  created_at: string;
};
type ProductRow = { is_archived: boolean; in_stock: boolean };
type TreatmentRow = { is_archived: boolean; is_active: boolean };
type JournalRow = { status: string };

export type DashboardStats = {
  revenue: { allTime: number; thisMonth: number };
  orders: { total: number; pending: number; confirmed: number; fulfilled: number; cancelled: number };
  bookings: { total: number; pending: number; confirmed: number };
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
  topProducts: { name: string; unitsSold: number; revenue: number }[];
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

export const getDashboardStatsFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<DashboardStats> => {
    await requireAdmin();
    const supabase = getSupabaseServerClient();

    const [ordersRes, orderItemsRes, bookingsRes, productsRes, treatmentsRes, journalRes] =
      await Promise.all([
        supabase
          .from("orders")
          .select("id, customer_name, status, subtotal, created_at")
          .order("created_at", { ascending: false }),
        supabase.from("order_items").select("product_name, unit_price, quantity"),
        supabase
          .from("bookings")
          .select("id, customer_name, treatment_name, status, preferred_date, preferred_time, created_at")
          .order("created_at", { ascending: false }),
        supabase.from("products").select("is_archived, in_stock"),
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

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const revenueEligible = orders.filter((o) => o.status !== "cancelled");
    const revenueAllTime = revenueEligible.reduce((sum, o) => sum + o.subtotal, 0);
    const revenueThisMonth = revenueEligible
      .filter((o) => new Date(o.created_at) >= monthStart)
      .reduce((sum, o) => sum + o.subtotal, 0);

    const ordersByStatus = {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      fulfilled: orders.filter((o) => o.status === "fulfilled").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };

    const bookingsSummary = {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
    };

    const productSales = new Map<string, { unitsSold: number; revenue: number }>();
    for (const item of orderItems) {
      const entry = productSales.get(item.product_name) ?? { unitsSold: 0, revenue: 0 };
      entry.unitsSold += item.quantity;
      entry.revenue += item.unit_price * item.quantity;
      productSales.set(item.product_name, entry);
    }
    const topProducts = [...productSales.entries()]
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);

    const today = new Date().toISOString().slice(0, 10);
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
      revenue: { allTime: revenueAllTime, thisMonth: revenueThisMonth },
      orders: ordersByStatus,
      bookings: bookingsSummary,
      recentOrders: orders.slice(0, 5).map((o) => ({
        id: o.id,
        customerName: o.customer_name,
        status: o.status,
        subtotal: o.subtotal,
        createdAt: o.created_at,
      })),
      upcomingBookings,
      topProducts,
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
  },
);
