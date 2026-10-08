"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type NavLinkProps = {
  href: string;
  label: string;
  icon: ReactNode;
  /** "sidebar" = desktop list, "tab" = mobile bottom bar */
  variant: "sidebar" | "tab";
};

export function NavLink({ href, label, icon, variant }: NavLinkProps) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center transition-colors",
        variant === "sidebar" &&
          "gap-3 rounded-md px-3 py-2 text-sm font-medium " +
            (active
              ? "bg-primary-soft text-primary-soft-foreground"
              : "text-muted hover:bg-surface hover:text-foreground"),
        variant === "tab" &&
          "min-h-14 flex-col justify-center gap-1 text-xs font-medium " +
            (active ? "text-primary" : "text-muted"),
      )}
    >
      {icon}
      {label}
    </Link>
  );
}
