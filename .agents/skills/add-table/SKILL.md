---
name: add-table
description: Add a new database-backed feature end to end (table with Row Level Security, schema, service with demo-mode fallback, server actions, page). Use when a Figma design needs to save or show new kinds of data.
---

# Add a table (a data-backed feature)

Use `tasks` as the reference. Copy its pattern in every layer:

| Layer                     | Reference file                 |
| ------------------------- | ------------------------------ |
| Database + RLS            | `supabase/schema.sql`          |
| Types + validation        | `src/lib/schemas.ts`           |
| Sample data (demo mode)   | `src/data/mock.ts`             |
| Service (Supabase + demo) | `src/server/tasks.ts`          |
| Server actions            | `src/actions/tasks.ts`         |
| Page + forms              | `src/app/(app)/tasks/page.tsx` |

## Steps

1. **Plan the data.** From the design, list the fields (name, type, required?). Keep it small.
2. **SQL.** Append to `supabase/schema.sql` (keep it re-runnable with `if not exists` / `drop policy if exists`):
   - `id uuid primary key default gen_random_uuid()`
   - `user_id uuid not null default auth.uid() references auth.users (id) on delete cascade`
   - your columns, with `check` constraints where sensible, and `created_at timestamptz not null default now()`
   - `alter table ... enable row level security;` plus select/insert/update/delete policies using `(select auth.uid()) = user_id`
3. **Schema.** In `src/lib/schemas.ts` add the zod schema, the create-input schema and the types. Use camelCase in the app, snake_case in the database, and convert in the service.
4. **Service.** Create `src/server/<things>.ts` (`import "server-only"`). Export `list`, `create`, `update`, `delete` functions that take the `CurrentUser` first. Implement both branches: Supabase (`createClient()` from `@/lib/supabase/server`; parse rows with zod; let RLS filter) and demo mode (in-memory store on `globalThis`, seeded from `src/data/mock.ts`).
5. **Actions.** Create `src/actions/<things>.ts` (`"use server"`). Each action: `requireUser()`, validate `FormData` with zod, call the service, `revalidatePath(...)`, and `redirect(...)` with an `?error=` message on bad input.
6. **Page.** Build the page under `src/app/(app)/<route>/page.tsx` using existing components. Forms use `action={yourAction}`. Add the page to `links` in `src/components/app-shell.tsx` if it needs navigation (the mobile tab bar fits about 4 items; the grid uses `grid-cols-3`, so adjust it).
7. **Tell the user** to run the new SQL in Supabase's SQL Editor (they can copy it from `supabase/schema.sql`), unless they are still in demo mode.
8. **Verify** in demo mode and, if connected, in Supabase mode. Run `npm run check`.

## Safety

- RLS on, with all four policies. Never trust a user id from the browser.
- Validate every input with zod, on the server.
