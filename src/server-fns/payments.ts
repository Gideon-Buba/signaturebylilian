import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  confirmOrderPayment,
  ECHEZONA_BASE_URL,
  getApiKey,
  isLive,
  type EchezonaInitializeResponse,
} from "@/lib/echezona.server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

// Creates the hosted-checkout payment and returns the URL to send the customer to.
export const initializePaymentFn = createServerFn({ method: "POST" })
  .validator(z.object({ orderId: z.string().uuid(), origin: z.string().url() }))
  .handler(async ({ data }) => {
    const apiKey = getApiKey();

    const admin = getSupabaseAdminClient();
    const { data: order, error: orderError } = await admin
      .from("orders")
      .select("id, customer_name, phone, email, subtotal, payment_status")
      .eq("id", data.orderId)
      .single();

    if (orderError) throw new Error("Order not found");
    if (order.payment_status === "paid") throw new Error("This order has already been paid");

    // Echezona rejects requests without both names (despite the docs marking
    // them optional), so single-word names get a placeholder last name.
    const [firstName = "Customer", ...rest] = String(order.customer_name).trim().split(/\s+/);

    const res = await fetch(`${ECHEZONA_BASE_URL}/Payments/Initialize`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        isLive: isLive(),
        amount: String(order.subtotal),
        currency: "NGN",
        email:
          order.email ||
          `${String(order.phone).replace(/\D/g, "") || "guest"}@guest.signaturebylilian.com`,
        phone: order.phone,
        firstName,
        lastName: rest.join(" ") || "-",
        transactionId: order.id,
        callbackUrl: `${data.origin}/checkout/callback?order=${order.id}`,
        metadata: [
          { name: "OrderId", value: order.id },
          { name: "CustomerName", value: order.customer_name },
        ],
      }),
    });
    const raw = await res.text();
    let body: EchezonaInitializeResponse | null = null;
    try {
      body = JSON.parse(raw) as EchezonaInitializeResponse;
    } catch {
      // Non-JSON errors (e.g. "Invalid merchant key") come back as plain text.
    }

    if (!res.ok || !body || body.responseCode !== "00" || !body.data?.paymentUrl) {
      console.error("Echezona initialize failed:", res.status, raw);
      throw new Error(
        body?.responseMessage ||
          (res.status === 401
            ? "Online payment isn't set up correctly yet — the Echezona API key was rejected."
            : "Couldn't start the payment with Echezona"),
      );
    }

    return { paymentUrl: body.data.paymentUrl };
  });

export const verifyPaymentFn = createServerFn({ method: "POST" })
  .validator(z.object({ orderId: z.string().uuid() }))
  .handler(async ({ data }) => confirmOrderPayment(data.orderId));
