import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/session";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type SiteSettings = {
  payOnlineEnabled: boolean;
  bankTransferEnabled: boolean;
};

type SettingsRow = { pay_online_enabled: boolean; bank_transfer_enabled: boolean };

const DEFAULT_SETTINGS: SiteSettings = { payOnlineEnabled: true, bankTransferEnabled: true };

// Public: the checkout page needs this to decide which payment buttons to
// show, before the customer is anywhere near the admin area.
export const getSiteSettingsFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteSettings> => {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("pay_online_enabled, bank_transfer_enabled")
      .eq("id", true)
      .maybeSingle();

    // If the migration hasn't been run yet, fail open to "both on" rather
    // than breaking checkout.
    if (error || !data) return DEFAULT_SETTINGS;

    const row = data as SettingsRow;
    return {
      payOnlineEnabled: row.pay_online_enabled,
      bankTransferEnabled: row.bank_transfer_enabled,
    };
  },
);

export const updateSiteSettingsFn = createServerFn({ method: "POST" })
  .validator(
    z
      .object({ payOnlineEnabled: z.boolean(), bankTransferEnabled: z.boolean() })
      .refine((v) => v.payOnlineEnabled || v.bankTransferEnabled, {
        message: "At least one payment method must stay on.",
      }),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .from("site_settings")
      .update({
        pay_online_enabled: data.payOnlineEnabled,
        bank_transfer_enabled: data.bankTransferEnabled,
      })
      .eq("id", true);

    if (error) throw new Error(error.message);
    return { success: true as const };
  });
