---
name: figma-to-prototype
description: Turn a Figma frame or link into a working, responsive page in this repo using the project's tokens and components. Use when the user shares a Figma URL or asks to build, recreate or prototype a design.
---

# Figma to prototype

Goal: a page that matches the Figma frame on phone and desktop, built only from this repo's tokens and components.

## Steps

1. **Read AGENTS.md** if you have not already. Follow the hard rules.
2. **Get the design.** Use the Figma MCP with the frame URL to fetch the layout, styles and a screenshot. If the MCP is not connected, ask the user to attach a screenshot and describe the frame. Note whether the design is a mobile frame, a desktop frame, or both.
3. **Inventory the design.** List the sections, components, colours, font sizes, spacing and radii it uses.
4. **Sync tokens.** If the design uses values that are not in `tokens/tokens.json`, follow the `sync-tokens` skill first. Map to existing tokens when a value is close; add a token only when it is genuinely new.
5. **Map to components.** For each repeated element, use an existing component in `src/components/ui/`. Build missing ones with the `new-component` skill.
6. **Place the page.** Signed-in screens go in `src/app/(app)/<route>/page.tsx` (use `src/app/(app)/page.tsx` for the home screen) so they get the app shell and login protection. If the design has its own navigation, edit `src/components/app-shell.tsx`; if it has no navigation at all, build the screen without the shell. Public screens (landing, login) live outside `(app)`. Rename the app in `src/lib/config.ts`.
7. **Build responsively.** Mobile-first classes, then `md:`/`lg:`. If only one size is designed, extend it sensibly to the other.
8. **Data.** If the design needs saved data, use the `add-table` skill. Until a Supabase project is connected, demo mode keeps the app working.
9. **Check visually.** Run `npm run dev`, compare with the screenshot at about 390px and 1280px, and fix differences.
10. **Run `npm run check`.** Fix every failure.
11. **Commit** with a short message, then tell the user in plain English what you built and how to open it (http://localhost:3000/<route>).

## Rules of thumb

- Never hard-code a design value. If you are tempted to, you are missing a token.
- Prefer composition over new abstractions. Keep components small and typed.
- If the design is ambiguous, pick the simplest reasonable option and mention it in one sentence rather than stopping to ask.
- Remove placeholder pages the design does not need, but keep `/login` and `src/server/auth.ts` working.
