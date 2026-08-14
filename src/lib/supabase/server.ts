import { createServerClient } from "@supabase/ssr";
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
