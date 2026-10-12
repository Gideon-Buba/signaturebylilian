import { createFileRoute } from "@tanstack/react-router";

import { confirmOrderPayment } from "@/lib/echezona.server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

// Echezona's docs don't describe a webhook signature, so the payload is never
// trusted: it's only used to learn which transaction to look up, and the
// payment is then confirmed by asking Echezona directly. A forged request
// therefore can't mark anything paid. This covers bank-transfer customers who
// pay but never come back to the callback page.
export const Route = createFileRoute("/api/echezona-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const payload = (await request.json().catch(() => null)) as {
          transactionId?: string;
        } | null;
        const transactionId = payload?.transactionId;

        if (!transactionId || !/^[A-Za-z0-9_-]{1,30}$/.test(transactionId)) {
          // Not a shape we'd ever generate — acknowledge so Echezona doesn't keep retrying.
          return new Response("ignored", { status: 200 });
        }

        // The transactionId is our own short payment_reference, not the
        // order's id, so look the order up by that first.
        const admin = getSupabaseAdminClient();
        const { data: order } = await admin
          .from("orders")
          .select("id")
          .eq("payment_reference", transactionId)
          .maybeSingle();

        if (!order) {
          return new Response("ignored", { status: 200 });
        }

        try {
          await confirmOrderPayment(order.id);
        } catch (error) {
          console.error("Echezona webhook: couldn't confirm payment:", error);
          // Non-2xx makes Echezona retry (up to three times).
          return new Response("error", { status: 500 });
        }
        return new Response("ok", { status: 200 });
      },
    },
  },
});
