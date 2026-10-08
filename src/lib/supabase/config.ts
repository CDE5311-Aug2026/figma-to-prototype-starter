// Supabase settings come from environment variables (see .env.example).
// When they are missing the app runs in DEMO MODE: no login, data kept in memory.

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Supabase calls this the "publishable" key (older projects call it the "anon" key).
// Both are safe to expose in the browser. The "service role" / "secret" key is NOT, never use it here.
export const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseKey);
}
