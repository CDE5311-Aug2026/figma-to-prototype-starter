---
name: sync-tokens
description: Update design tokens from Figma variables or styles into tokens/tokens.json and regenerate the Tailwind theme. Use when a design introduces new colours, type sizes, spacing, radii or shadows.
---

# Sync tokens

Tokens flow one way: Figma variables -> `tokens/tokens.json` -> `src/styles/tokens.generated.css` -> Tailwind classes.

## Steps

1. Read the variables/styles from Figma (Figma MCP) or from the values the user provides.
2. Open `tokens/tokens.json`. For each design value:
   - If an existing token matches or is very close, reuse it. Do not add near-duplicates.
   - Otherwise add a token with a **semantic** name (`surface-raised`, `danger`), not a value-based one (`blue-500`).
3. Groups and what they generate:
   - `color` -> `bg-*`, `text-*`, `border-*` (e.g. `color.primary` -> `bg-primary`)
   - `radius` -> `rounded-*`
   - `text` (`size` + `lineHeight`) -> `text-*`
   - `shadow` -> `shadow-*`
   - `font` -> `font-*`
   - `spacing.base` -> the spacing scale (`p-4` = 4 x base)
4. Run `npm run tokens`. Never edit `src/styles/tokens.generated.css` by hand.
5. Run `npm run check` and fix any failures.
6. Tell the user in one sentence which tokens changed.

## Notes

- The default Tailwind colour palette is disabled, so every colour used must exist in `tokens.json`.
- Keep token names consistent with the Figma variable names where reasonable.
