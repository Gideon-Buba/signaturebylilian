import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/session";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type OrderStatus = "pending" | "confirmed" | "fulfilled" | "cancelled";

export type OrderItem = {
  id: string;
  productId: string | null;
  productName: string;
  size: string | null;
  unitPrice: number;
  quantity: number;
};

export type Order = {
  id: string;
  customerName: string;
  phone: string;
  email: string | null;
  address: string;
  notes: string;
  status: OrderStatus;
  subtotal: number;
  createdAt: string;
  items: OrderItem[];
};

type OrderRow = {
  id: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  notes: string;
  status: string;
  subtotal: number;
  created_at: string;
};

type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  size: string | null;
  unit_price: number;
  quantity: number;
};

function itemFromRow(row: OrderItemRow): OrderItem {
  return {
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    size: row.size,
    unitPrice: row.unit_price,
    quantity: row.quantity,
  };
}

const cartItemInput = z.object({
  productId: z.string().uuid(),
  productName: z.string().min(1),
  size: z.string().nullable().optional(),
  unitPrice: z.number().int().nonnegative(),
  quantity: z.number().int().positive(),
});

const createOrderInput = z.object({
  customerName: z.string().trim().min(1, "Name is required"),
  phone: z.string().trim().min(1, "Phone number is required"),
  email: z.string().trim().email().optional().or(z.literal("")),
  address: z.string().trim().min(1, "Delivery address is required"),
  notes: z.string().trim().default(""),
  items: z.array(cartItemInput).min(1, "Cart is empty"),
});

export const createOrderFn = createServerFn({ method: "POST" })
  .validator(createOrderInput)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const subtotal = data.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: data.customerName,
        phone: data.phone,
        email: data.email ? data.email : null,
        address: data.address,
        notes: data.notes,
        subtotal,
      })
      .select("*")
      .single();

    if (orderError) throw new Error(orderError.message);
    const orderRow = order as OrderRow;

    const { error: itemsError } = await supabase.from("order_items").insert(
      data.items.map((item) => ({
        order_id: orderRow.id,
        product_id: item.productId,
        product_name: item.productName,
        size: item.size ?? null,
        unit_price: item.unitPrice,
        quantity: item.quantity,
      })),
    );

    if (itemsError) throw new Error(itemsError.message);

    return { orderId: orderRow.id as string };
  });

export const listOrdersFn = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const supabase = getSupabaseServerClient();

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (ordersError) throw new Error(ordersError.message);

  const { data: items, error: itemsError } = await supabase.from("order_items").select("*");

  if (itemsError) throw new Error(itemsError.message);

  const itemsByOrder = new Map<string, OrderItem[]>();
  for (const row of items as OrderItemRow[]) {
    const list = itemsByOrder.get(row.order_id) ?? [];
    list.push(itemFromRow(row));
    itemsByOrder.set(row.order_id, list);
  }

  return (orders as OrderRow[]).map(
    (row): Order => ({
      id: row.id,
      customerName: row.customer_name,
      phone: row.phone,
      email: row.email,
      address: row.address,
      notes: row.notes,
      status: row.status as OrderStatus,
      subtotal: row.subtotal,
      createdAt: row.created_at,
      items: itemsByOrder.get(row.id) ?? [],
    }),
  );
});

export const updateOrderStatusFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string().uuid(),
      status: z.enum(["pending", "confirmed", "fulfilled", "cancelled"]),
    }),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .from("orders")
      .update({ status: data.status })
      .eq("id", data.id);

    if (error) throw new Error(error.message);
    return { success: true as const };
  });
