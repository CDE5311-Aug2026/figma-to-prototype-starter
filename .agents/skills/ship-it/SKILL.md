---
name: ship-it
description: Polish and deploy the app so it can be shown to other people (empty/loading/error states, demo data, metadata, Vercel). Use when the user says ship, deploy, publish, demo, showcase, share or present.
---

# Ship it

Goal: a live URL that looks finished and does not break in front of an audience.

## Polish (do these yourself)

1. **Name and tagline** in `src/lib/config.ts`; page `<title>`/description in `src/app/layout.tsx`.
2. **States.** Every list has an empty state; every form shows errors; destructive buttons are clear.
3. **Responsive.** Walk each page at about 390px and 1280px: no horizontal scroll, tap targets at least 40px, bottom tab bar not covering content.
4. **Demo data.** The "Add sample tasks" button (or a seed for the user's own feature) should make an empty account look good in one click.
5. **Remove leftovers.** Placeholder text, unused sample pages and routes the design does not use. Keep `/login` and `/api/health`.
6. **Run `npm run check`** and fix everything.
7. **Commit.**

## Deploy (guide the user)

1. Push to GitHub (`git remote add origin <url>` then `git push -u origin main`).
2. On https://vercel.com: **Add New, Project**, import the repo, click **Deploy** (Next.js is detected automatically).
3. If using Supabase: add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` under **Project Settings, Environment Variables**, redeploy, and set Supabase **Authentication, URL Configuration** Site URL to the Vercel URL.
4. Open the live URL, sign up, add data, and check it on a real phone.

## Final message to the user

One short paragraph: the live link, what the app does, and the one thing to try first.
