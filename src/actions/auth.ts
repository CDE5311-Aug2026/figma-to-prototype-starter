"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

const credentialsSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function parseCredentials(formData: FormData) {
  return credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
}

// Turns Supabase's raw error text into something a beginner can act on.
function friendly(message: string): string {
  if (message.toLowerCase().includes("fetch failed")) {
    return "Could not reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL and the key in .env.local, then restart npm run dev.";
  }
  return message;
}

function backToLogin(kind: "error" | "message", text: string): never {
  redirect(`/login?${kind}=${encodeURIComponent(text)}`);
}

export async function signInAction(formData: FormData) {
  if (!isSupabaseConfigured()) redirect("/");

  const parsed = parseCredentials(formData);
  if (!parsed.success) backToLogin("error", parsed.error.issues[0]?.message ?? "Invalid input");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) backToLogin("error", friendly(error.message));

  redirect("/");
}

export async function signUpAction(formData: FormData) {
  if (!isSupabaseConfigured()) redirect("/");

  const parsed = parseCredentials(formData);
  if (!parsed.success) backToLogin("error", parsed.error.issues[0]?.message ?? "Invalid input");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp(parsed.data);
  if (error) backToLogin("error", friendly(error.message));

  // If "Confirm email" is on in Supabase there is no session yet.
  if (!data.session) {
    backToLogin("message", "Account created. Check your email to confirm it, then sign in.");
  }

  redirect("/");
}

export async function signOutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/login");
}
