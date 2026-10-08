import type { ReactNode } from "react";
import { signOutAction } from "@/actions/auth";
import { HomeIcon, ListIcon, UserIcon } from "@/components/icons";
import { NavLink } from "@/components/nav-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { appConfig } from "@/lib/config";
import type { CurrentUser } from "@/server/auth";

// The responsive frame around every signed-in page.
//   Desktop (md and up): fixed sidebar on the left, content on the right.
//   Mobile:              top bar, content, and a tab bar fixed to the bottom.
export function AppShell({ user, children }: { user: CurrentUser; children: ReactNode }) {
  const links = [
    { href: "/", label: "Dashboard", icon: <HomeIcon /> },
    { href: "/tasks", label: "Tasks", icon: <ListIcon /> },
    { href: "/account", label: "Account", icon: <UserIcon /> },
  ];

  return (
    <div className="min-h-dvh bg-surface md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col gap-6 border-r border-border bg-surface-raised p-4 md:sticky md:top-0 md:flex md:h-dvh">
        <p className="px-3 pt-2 text-lg font-semibold text-foreground">{appConfig.name}</p>
        <nav aria-label="Main" className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink key={link.href} variant="sidebar" {...link} />
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-3 border-t border-border pt-4">
          <div className="flex flex-col gap-1 px-1">
            <p className="truncate text-sm font-medium text-foreground">{user.email}</p>
            {user.isDemo ? <Badge tone="warning">Demo mode</Badge> : null}
          </div>
          <form action={signOutAction}>
            <Button type="submit" variant="secondary" size="sm" className="w-full">
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-surface-raised px-4 md:hidden">
          <p className="text-base font-semibold text-foreground">{appConfig.name}</p>
          {user.isDemo ? <Badge tone="warning">Demo mode</Badge> : null}
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 pb-24 md:px-8 md:py-10 md:pb-10">
          {children}
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-3 border-t border-border bg-surface-raised md:hidden"
      >
        {links.map((link) => (
          <NavLink key={link.href} variant="tab" {...link} />
        ))}
      </nav>
    </div>
  );
}
