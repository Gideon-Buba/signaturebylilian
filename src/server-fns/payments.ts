import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getSupabaseAdminClient, getSupabaseServerClient } from "@/lib/supabase/server";

type PaystackVerifyResponse = {
  status: boolean;
  message: string;
  data?: {
    status: "success" | "failed" | "abandoned";
    reference: string;
    amount: number;
    currency: string;
  };
};

export const verifyPaymentFn = createServerFn({ method: "POST" })
  .validator(z.object({ orderId: z.string().uuid(), reference: z.string().min(1) }))
  .handler(async ({ data }) => {
    const secretKey = process.env["PAYSTACK_SECRET_KEY"];
    if (!secretKey) {
      throw new Error(
        "Payments aren't configured on the server yet — PAYSTACK_SECRET_KEY is missing.",
      );
    }

    const supabase = getSupabaseServerClient();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, subtotal, payment_status")
      .eq("id", data.orderId)
      .single();

    if (orderError) throw new Error("Order not found");
    if (order.payment_status === "paid") return { success: true as const };

    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(data.reference)}`,
      { headers: { Authorization: `Bearer ${secretKey}` } },
    );
    const verify = (await verifyRes.json()) as PaystackVerifyResponse;

    if (!verifyRes.ok || !verify.status || !verify.data) {
      throw new Error(verify.message || "Couldn't verify payment with Paystack");
    }

    const { status, amount, currency } = verify.data;
    const expectedAmountKobo = Math.round(order.subtotal * 100);

    if (status !== "success") {
      throw new Error(`Payment was not successful (status: ${status})`);
    }
    if (currency !== "NGN" || amount !== expectedAmountKobo) {
      throw new Error("Payment amount doesn't match the order total");
    }

    // RLS restricts order updates to admins — this write is only reachable
    // after the Paystack verification above has independently confirmed the
    // payment, so bypassing RLS here (via the service-role client) is safe.
    const admin = getSupabaseAdminClient();
    const { error: updateError } = await admin
      .from("orders")
      .update({
        payment_status: "paid",
        payment_reference: data.reference,
        status: "confirmed",
      })
      .eq("id", data.orderId);

    if (updateError) throw new Error(updateError.message);

    return { success: true as const };
  });
