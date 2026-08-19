import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { getCookies, setCookie } from "@tanstack/react-start/server";
import WebSocket from "ws";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Session-bound client: reads/writes the Supabase auth cookies for the current
// request, and respects Row Level Security as the signed-in user (or anon).
export function getSupabaseServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase env vars — set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local",
    );
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        const cookies = getCookies();
        return Object.entries(cookies).map(([name, value]) => ({ name, value }));
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          setCookie(name, value, options);
        }
      },
    },
    // We never use Realtime, but supabase-js always constructs a Realtime
    // client, which needs native WebSocket support (Node 22+). This polyfill
    // keeps the server working on older Node runtimes.
    realtime: {
      transport: WebSocket as never,
    },
  });
}

// Privileged client that bypasses Row Level Security entirely. Only use this
// for operations that have already been independently verified server-side
// (e.g. confirming a payment with Paystack before marking an order paid) —
// never in response to unverified client input.
export function getSupabaseAdminClient() {
  const serviceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY — set it in .env.local (and in your host's env vars for production).",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    realtime: {
      transport: WebSocket as never,
    },
  });
}
