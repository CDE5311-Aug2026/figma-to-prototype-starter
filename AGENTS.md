# AGENTS.md

Instructions for AI coding agents (Codex, Claude Code, Cursor, etc.). Read this fully before changing anything.

## What this project is

A starter for turning a **Figma design into a working full-stack web app**. One repo: Next.js (App Router) for frontend and backend, Tailwind CSS v4 for styling, design tokens as the single source of truth, Supabase for database and login, deployed to Vercel.

It ships with a **default app** (dashboard, tasks, account, login) so something real is on screen from the first run. The default app is a placeholder: replace it with the user's Figma design.

The person you are helping may not be a developer. Explain results in plain English, keep it short, and never ask them to edit code or run commands you can run yourself.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript (strict)
- Tailwind CSS v4. Tokens are defined in `tokens/tokens.json` and generated into `@theme`
- Supabase (Postgres + Auth, JWT sessions in cookies) via `@supabase/ssr`, with Row Level Security
- zod for validation, `clsx` + `tailwind-merge` via `cn()` in `src/lib/utils.ts`
- Deploys to Vercel with no extra config

## Two modes (important)

- **Demo mode**: no Supabase keys in `.env.local`. No login (a fake demo user is used) and data lives in memory. This is the default on first run. It must keep working.
- **Supabase mode**: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are set. Real sign-in and database.

`isSupabaseConfigured()` in `src/lib/supabase/config.ts` decides. Services in `src/server/` support both modes with the same function signatures. Pages, actions and routes never check the mode themselves.

## Commands

| Command          | What it does                                                    |
| ---------------- | --------------------------------------------------------------- |
| `npm run dev`    | Rebuild tokens, start the app at http://localhost:3000          |
| `npm run tokens` | Regenerate `src/styles/tokens.generated.css` from `tokens.json` |
| `npm run check`  | Tokens, typecheck, lint, token check and a production build     |
| `npm run format` | Format all files with Prettier                                  |

**Run `npm run check` before telling the user you are done. It must pass.**

## Hard rules

1. **Tokens only.** Never hard-code colours, font sizes, spacing, radii or shadows. No hex/rgb/hsl values, no arbitrary Tailwind values (`bg-[#fff]`, `p-[13px]`), no inline `style` for design values, and no default palette classes (`bg-blue-500`, `bg-white`). The default Tailwind palette is disabled on purpose. Use semantic tokens (`bg-primary`, `text-muted`, `border-border`, `rounded-lg`, `shadow-md`).
2. **Missing token?** Add it to `tokens/tokens.json`, run `npm run tokens`, then use it. Never edit `src/styles/tokens.generated.css` by hand.
3. **Reuse components first.** Look in `src/components/ui/` before building anything. Copy their patterns (typed props, `cn()`, token classes).
4. **Mobile and desktop.** Every screen must work at about 390px wide (phone) and 1280px (desktop). Build mobile-first, then add `md:`/`lg:` variants. The shell (`src/components/app-shell.tsx`) already switches between a bottom tab bar on mobile and a sidebar on desktop.
5. **Server components by default.** Add `"use client"` only for state, effects or browser events.
6. **No new dependencies** without asking the user first. No state libraries, UI kits or data-fetching libraries.
7. **Layers.** Pages and components call server actions (`src/actions/`) or services (`src/server/`). Actions and API routes stay thin: validate input with zod (schemas in `src/lib/schemas.ts`), call a service, return or redirect. Business logic and database calls live only in `src/server/`.
8. **Auth.** Protect every page or action that touches user data with `requireUser()` from `src/server/auth.ts` (pages under `src/app/(app)/` are already protected by their layout). Never trust a user id sent from the browser. Use the one from `requireUser()`/`getCurrentUser()`.
9. **Database safety.** Every table gets Row Level Security and policies (see `supabase/schema.sql`). Never disable RLS to "make it work".
10. **Secrets.** Never put secrets in client code or commit `.env.local`. Only `NEXT_PUBLIC_*` variables reach the browser. **Never use or request the Supabase service role/secret key.** Add every new variable to `.env.example`.
11. **Accessibility basics.** Semantic HTML, real `<button>`/`<a>`, labels on inputs, alt text on images, visible focus states.

## Folder map

```
tokens/tokens.json            Design tokens (source of truth, mirrors Figma variables)
scripts/                      build-tokens.mjs, check-tokens.mjs
supabase/schema.sql           Database tables + RLS policies (run in Supabase SQL Editor)
src/proxy.ts                  Keeps the Supabase login session fresh (Next 16 "proxy")
src/app/(app)/                Signed-in pages: dashboard (/), /tasks, /account. Layout = app shell
src/app/(auth)/login/         Sign in / create account
src/app/api/                  Route handlers (health, tasks)
src/actions/                  Server actions called by forms (auth.ts, tasks.ts)
src/components/ui/            Reusable primitives (Button, Input, Card, Badge, Alert)
src/components/app-shell.tsx  Responsive frame: sidebar (desktop) / tab bar (mobile)
src/server/                   Server-only logic: auth.ts, tasks.ts (Supabase + demo mode)
src/lib/                      cn(), config.ts (app name), schemas.ts, supabase/ clients
src/data/mock.ts              Sample data for demo mode
examples/                     A finished Figma -> app walkthrough
.agents/skills/               Skills (also exposed at .claude/skills)
```

## Workflow: Figma frame to app

Use the `figma-to-prototype` skill. In short:

1. Get the Figma frame (Figma MCP) and a screenshot of it. Note both the mobile and desktop frames if the design has them.
2. Sync tokens first if the design has new colours/spacing/type (`sync-tokens` skill).
3. Map each part of the design to existing components. Build missing ones (`new-component` skill).
4. Replace or add pages under `src/app/(app)/`. Rename the app in `src/lib/config.ts`.
5. If the design needs saved data, add a table and service (`add-table` skill). To use a real database, follow `connect-supabase`.
6. Run `npm run dev`, compare with the screenshot at phone and desktop widths, fix differences.
7. Run `npm run check`. Fix every failure yourself.
8. Commit. When the user wants to share it, use the `ship-it` skill.

## When something breaks

Fix it yourself. Then tell the user in **one plain-English sentence** what went wrong and what you did. Do not paste error logs at them. If you are stuck after two attempts, say what you tried and ask one clear question.

## Git

- Commit after every working step with a short message, so there is always a last good version to return to.
- Do not force-push, rewrite history, or delete branches without being asked.

## Definition of done

- Matches the Figma screenshot (layout, spacing, colour, type) at phone and desktop widths
- Uses only tokens and existing components where possible
- Works in demo mode, and in Supabase mode if the user has connected it
- `npm run check` passes
- Committed, and the user has been told in plain English what changed and how to see it

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
