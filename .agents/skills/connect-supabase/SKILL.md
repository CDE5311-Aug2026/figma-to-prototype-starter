---
name: connect-supabase
description: Connect this app to a real Supabase project (database + login) and check it works. Use when the user wants real accounts, saved data, or says Supabase, database, login or "make it real".
---

# Connect Supabase

The app runs in demo mode until two environment variables are set. Walk the user through the parts that need a browser, and do the rest yourself.

## What only the user can do (give them these steps in plain English)

1. Create a free account at https://supabase.com and click **New project**. Choose a name, a database password (save it somewhere), and the region closest to them.
2. Wait until the project finishes setting up (a minute or two).
3. Copy two values:
   - **Project URL**
   - **Publishable key** (older projects call it the "anon" key). Find both under **Project Settings, then API** (or the **Connect** button).
   - Do **not** copy or share the "service role" / "secret" key.
4. In **SQL Editor, New query**, paste the whole contents of `supabase/schema.sql` and click **Run**.
5. For workshops and demos: under **Authentication, then Providers, then Email**, turn **Confirm email** off, so people can sign up and get in immediately. (Keep it on for anything real.)

## What you do

1. Create `.env.local` from `.env.example` if it does not exist, and fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<project url>
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable key>
   ```
   Never commit `.env.local`. Never print the keys back unnecessarily.
2. Restart `npm run dev` (env changes need a restart).
3. Verify: open `/` and confirm it redirects to `/login` and that the "Demo mode" banner is gone. Create an account, add a task, refresh, and confirm it persists. In Supabase's **Table Editor** the `tasks` row should appear.
4. If sign-up says "Check your email", Confirm email is still on. Tell the user how to turn it off (step 5 above).
5. If you see "Could not reach Supabase", the URL or key is wrong or has stray spaces. Re-check them.
6. Run `npm run check`, then tell the user in one sentence that it is connected.

## Vercel

Add the same two variables in **Vercel, Project Settings, Environment Variables**, then redeploy. In Supabase, under **Authentication, then URL Configuration**, set **Site URL** to the Vercel URL and add it (and `http://localhost:3000`) to the redirect URLs.

## Safety

- RLS must stay on. If a query returns nothing or errors with "permission denied", fix the policy, do not disable RLS.
- Never use the service role key in this app.
