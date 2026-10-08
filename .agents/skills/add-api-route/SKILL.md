---
name: add-api-route
description: Add a backend endpoint (Next.js route handler) with auth, zod validation and a service function. Use when another client or a client component needs to fetch or send data over HTTP. For forms inside the app, prefer server actions (see add-table).
---

# Add an API route

Layers, from the outside in: **route** (HTTP) -> **schema** (validation + types) -> **service** (logic, in `src/server/`) -> **data** (Supabase, or demo store).

## When to use this vs a server action

- The app's own forms and buttons: use a **server action** in `src/actions/` (simpler, no fetch code). See `src/actions/tasks.ts`.
- A client component that must fetch on its own, or something outside the app calling in: use a **route handler** here.

## Steps

1. **Schema.** In `src/lib/schemas.ts`, add a zod schema for the input and export the inferred type.
2. **Service.** Add the logic to a file in `src/server/` (it starts with `import "server-only";`). Follow `src/server/tasks.ts`, including the demo-mode fallback.
3. **Route.** Create `src/app/api/<name>/route.ts`. Keep it thin and always check the user:
   ```ts
   import { NextResponse } from "next/server";
   import { createThingSchema } from "@/lib/schemas";
   import { getCurrentUser } from "@/server/auth";
   import { createThing, listThings } from "@/server/things";

   export async function GET() {
     const user = await getCurrentUser();
     if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
     return NextResponse.json(await listThings(user));
   }

   export async function POST(request: Request) {
     const user = await getCurrentUser();
     if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

     const body = await request.json().catch(() => null);
     const parsed = createThingSchema.safeParse(body);
     if (!parsed.success) {
       return NextResponse.json(
         { error: "Invalid input", issues: parsed.error.issues },
         { status: 400 },
       );
     }
     return NextResponse.json(await createThing(user, parsed.data), { status: 201 });
   }
   ```
4. **Secrets.** If you need an env var, add it to `.env.example`. Never expose it to client code.
5. **Test it.** With `npm run dev` running, call the route (`curl http://localhost:3000/api/<name>`) and confirm a valid request, an invalid request and (in Supabase mode) a signed-out request all behave.
6. **Run `npm run check`.**

## Remember

In demo mode data lives in memory and resets. In Supabase mode on Vercel, only data in the database persists. Never store data in local files or module variables in production code paths.
