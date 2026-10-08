import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/server/auth";

// Pages in this folder show per-user data, so they are rendered fresh on every request.
export const dynamic = "force-dynamic";

// Everything inside the (app) folder needs a signed-in user.
// (In demo mode there is always a demo user, so nothing is blocked.)
export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  return <AppShell user={user}>{children}</AppShell>;
}
