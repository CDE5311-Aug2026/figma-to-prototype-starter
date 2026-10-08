# Example: Figma frame to prototype

This folder is where a **finished walkthrough** lives, so people (and agents) can see what "done" looks like.

> The starter ships without a Figma file, because Figma files can't be bundled in a repo. Add your own
> before the session (see "Add your own example" below). Until then, the home page in `src/app/page.tsx`
> shows the components, tokens and mock data working together.

## What a good example contains

```
examples/
  README.md            this file
  my-example/
    figma-link.md      the Figma URL + which frame was used
    screenshot.png     the Figma frame (what we are trying to match)
    result.png         the finished prototype
    prompt.md          the exact prompt that produced it
    notes.md           tokens added, components created, anything surprising
```

Keep it small. One example is enough. The agent will use it as a pattern.

## Add your own example (facilitator, ~15 minutes)

1. Pick one simple Figma frame (a landing section, a form, a dashboard card list).
2. Run the workflow below in a fresh copy of the starter.
3. Save the link, the screenshots and the prompt into `examples/<name>/`.
4. Make sure `npm run check` passes with the finished page, then commit.

## The workflow, with prompts you can paste

**1. Build the screen**

```
Use the figma-to-prototype skill. Build this frame as the home page:
<paste Figma frame link>
```

**2. Fix differences**

```
Compare the page with the Figma screenshot at mobile and desktop widths and fix any
differences in spacing, type or colour. Use tokens only.
```

**3. Add real behaviour**

```
Make the form submit to an API route that validates the input and returns the saved item.
Use the add-api-route skill and mock data.
```

**4. Wrap up**

```
Run npm run check, fix anything that fails, commit, and tell me in one plain sentence what changed.
```

If your agent does not pick up skills automatically, add: "Follow `.agents/skills/figma-to-prototype/SKILL.md`."
