---
name: new-component
description: Add a reusable UI component to src/components/ui following the repo's conventions (typed props, cn(), token classes). Use when a design needs a component that does not exist yet.
---

# New component

## Steps

1. **Check first.** Look in `src/components/ui/`. Extend an existing component with a variant rather than creating a near-duplicate.
2. **Study the pattern.** Read `button.tsx`, `card.tsx` and `badge.tsx`. Copy their structure.
3. **Create `src/components/ui/<name>.tsx`:**
   - Named export, kebab-case file name, PascalCase component name
   - Typed props that extend the matching HTML element props
   - Combine classes with `cn()` and accept a `className` prop
   - Variants as plain objects keyed by variant name (no extra libraries)
   - Token classes only (`bg-primary`, `text-muted`, `rounded-lg`)
   - Semantic, accessible HTML
   - Server component unless it needs state/events (then add `"use client"` at the top)
4. **Use it** in the page. If it appears on the home page sample, you may add it there.
5. **Run `npm run check`.**

## Template

```tsx
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type StatProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  value: string | number;
  tone?: "default" | "success";
};

const tones = {
  default: "text-foreground",
  success: "text-success",
} as const;

export function Stat({ label, value, tone = "default", className, ...props }: StatProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-lg border border-border bg-surface-raised p-4",
        className,
      )}
      {...props}
    >
      <p className="text-sm text-muted">{label}</p>
      <p className={cn("text-3xl font-semibold", tones[tone])}>{value}</p>
    </div>
  );
}
```

Existing components to reuse before writing a new one: `Button`, `Input`, `Card`, `Badge`, `Alert`.
