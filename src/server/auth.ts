import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type CurrentUser = {
  id: string;
  email: string;
  /** True when Supabase is not connected and the app is running with a fake user. */
  isDemo: boolean;
};

const demoUser: CurrentUser = { id: "demo-user", email: "demo@example.com", isDemo: true };

/** The signed-in user, or null. In demo mode (no Supabase keys) it is always the demo user. */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  if (!isSupabaseConfigured()) return demoUser;

  const supabase = await createClient();
  // getUser() asks Supabase to verify the JWT, so it is safe to trust on the server.
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  return { id: data.user.id, email: data.user.email ?? "", isDemo: false };
});

/** Use at the top of any protected page or action. Sends signed-out visitors to /login. */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
