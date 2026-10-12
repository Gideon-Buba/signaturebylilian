import { getSupabaseAdminClient } from "@/lib/supabase/server";

export const ECHEZONA_BASE_URL = "https://api.echezona.com/api";

export type EchezonaInitializeResponse = {
  responseCode: string;
  responseMessage: string;
  data?: { paymentUrl: string; accessCode: string };
};

type EchezonaVerifyResponse = {
  responseCode: string;
  responseMessage?: string;
  data?: {
    amount: string;
    currency?: string;
    status: "Successful" | "Failed" | "Pending";
    isSuccessful: boolean;
    gatewayResponse?: string;
    transactionId: string;
    paymentReference?: string;
  };
};

export function getApiKey() {
  const apiKey = process.env["ECHEZONA_API_KEY"];
  if (!apiKey) {
    throw new Error("Payments aren't configured on the server yet — ECHEZONA_API_KEY is missing.");
  }
  return apiKey;
}

// Echezona uses one host for both environments; `isLive` picks which one runs.
// Defaults to test mode so nothing real is charged until ECHEZONA_IS_LIVE=true.
export function isLive() {
  return process.env["ECHEZONA_IS_LIVE"] === "true";
}

// Echezona's transactionId field has a hard 30-character limit, so our UUID
// order ids (36 chars, with dashes) can't be used directly — every Initialize
// call was rejected with a validation error until this was added. Instead we
// mint a short reference per payment attempt and store it on the order, so
// Echezona only ever sees this, and we map back to the order by looking it
// up again. 24 hex chars is well under the limit with plenty of entropy.
export function generatePaymentReference() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 24);
}

// Asks Echezona for the transaction's status and, only if it's genuinely paid
// and covers the order total, marks the order paid. Shared by the browser
// callback and the webhook — neither is trusted on its own, Echezona's own
// answer is what counts.
export async function confirmOrderPayment(orderId: string) {
  const apiKey = getApiKey();

  // Guest customers can't SELECT their own order back (RLS restricts reads to
  // admins) — this read is server-only, so the admin client is safe here.
  const admin = getSupabaseAdminClient();
  const { data: order, error: orderError } = await admin
    .from("orders")
    .select("id, subtotal, payment_status, payment_reference")
    .eq("id", orderId)
    .single();

  if (orderError) throw new Error("Order not found");
  if (order.payment_status === "paid") return { status: "paid" as const };
  if (!order.payment_reference) {
    // Online payment was never started for this order (e.g. it's a
    // bank-transfer order) — nothing to verify with Echezona.
    throw new Error("No online payment was started for this order");
  }

  const verifyRes = await fetch(`${ECHEZONA_BASE_URL}/Payments/VerifyPayment`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ transactionId: order.payment_reference }),
  });
  const rawVerify = await verifyRes.text();
  let verify: EchezonaVerifyResponse | null = null;
  try {
    verify = JSON.parse(rawVerify) as EchezonaVerifyResponse;
  } catch {
    // Non-JSON errors (e.g. "Invalid merchant key") come back as plain text.
  }

  if (!verifyRes.ok || !verify || verify.responseCode !== "00" || !verify.data) {
    console.error("Echezona verify failed:", verifyRes.status, rawVerify);
    throw new Error(verify?.responseMessage || "Couldn't verify payment with Echezona");
  }

  const { status, isSuccessful, amount, currency } = verify.data;

  if (status === "Pending") return { status: "pending" as const };
  if (status !== "Successful" || !isSuccessful) return { status: "failed" as const };

  // >= rather than ===: Echezona may add its processing fee on top of the
  // amount the customer pays. Underpayment is the only thing to guard against.
  if ((currency && currency !== "NGN") || Number(amount) < order.subtotal) {
    throw new Error("Payment amount doesn't match the order total");
  }

  // RLS restricts order updates to admins — this write is only reachable after
  // Echezona has independently confirmed the payment above. payment_reference
  // is left as-is (it already holds our Echezona transactionId).
  const { error: updateError } = await admin
    .from("orders")
    .update({ payment_status: "paid", status: "confirmed" })
    .eq("id", orderId);

  if (updateError) throw new Error(updateError.message);

  return { status: "paid" as const };
}
