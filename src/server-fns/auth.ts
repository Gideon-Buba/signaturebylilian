import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getSessionUser } from "@/lib/auth/session";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const loginFn = createServerFn({ method: "POST" })
  .validator(z.object({ email: z.string().email(), password: z.string().min(1) }))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      const message =
        error.code === "email_not_confirmed"
          ? "This account's email hasn't been confirmed yet — confirm it from the Supabase dashboard (Authentication -> Users)."
          : "Invalid email or password.";
      return { success: false as const, message };
    }
    return { success: true as const };
  });

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  const supabase = getSupabaseServerClient();
  await supabase.auth.signOut();
  return { success: true as const };
});

export const meFn = createServerFn({ method: "GET" }).handler(async () => {
  return await getSessionUser();
});
