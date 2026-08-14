import { getSupabaseServerClient } from "@/lib/supabase/server";

export type SessionUser = { id: string; email: string | null };

// Revalidates the JWT against Supabase Auth rather than trusting the local
// cookie, so a revoked session is rejected immediately.
export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return { id: data.user.id, email: data.user.email ?? null };
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}
