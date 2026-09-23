import { createFileRoute } from "@tanstack/react-router";

import { confirmOrderPayment } from "@/lib/echezona.server";

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

        if (!transactionId || !/^[0-9a-f-]{36}$/i.test(transactionId)) {
          // Not one of our orders — acknowledge so Echezona doesn't keep retrying.
          return new Response("ignored", { status: 200 });
        }

        try {
          await confirmOrderPayment(transactionId);
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
