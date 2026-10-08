import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseKey, supabaseUrl } from "./config";

/** Supabase client for server components, server actions and route handlers. */
export async function createClient() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase is not configured. See README.md (Connect Supabase).");
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a server component, where cookies are read-only.
          // The proxy (src/proxy.ts) refreshes the session, so this is safe to ignore.
        }
      },
    },
  });
}
