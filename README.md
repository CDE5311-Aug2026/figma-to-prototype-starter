# Figma to Prototype Starter

Turn a Figma design into a **working, shareable prototype** by describing what you want to a coding agent (Codex, Claude Code, Cursor, and others). The repo already contains the project setup, design tokens, components, rules and a working default app (with mobile and desktop layouts), so nobody has to scaffold anything.

You bring a Figma link. The agent builds the page. Vercel gives you a live URL.

**Stack:** Next.js 16 (React 19) · TypeScript · Tailwind CSS v4 · Supabase (database + login) · zod · deployed on Vercel

---

## Contents

1. [How it works](#1-how-it-works)
2. [What you need before you start](#2-what-you-need-before-you-start)
3. [Choose how to run it](#3-choose-how-to-run-it)
4. [Option A: GitHub Codespaces (nothing to install)](#4-option-a-github-codespaces-nothing-to-install)
5. [Option B: Run it on your own computer](#5-option-b-run-it-on-your-own-computer)
6. [Option C: Manual install (no script)](#6-option-c-manual-install-no-script)
7. [What you will see: the default app (mobile and desktop)](#7-what-you-will-see-the-default-app-mobile-and-desktop)
8. [Connect Supabase (real login and database)](#8-connect-supabase-real-login-and-database)
9. [Connect Figma to your coding agent](#9-connect-figma-to-your-coding-agent)
10. [Build your first prototype](#10-build-your-first-prototype)
11. [Everyday commands](#11-everyday-commands)
12. [Tour of the project](#12-tour-of-the-project)
13. [Design tokens explained](#13-design-tokens-explained)
14. [The backend explained](#14-the-backend-explained)
15. [Deploy to Vercel](#15-deploy-to-vercel)
16. [Good practices built into this repo](#16-good-practices-built-into-this-repo)
17. [Using other coding agents](#17-using-other-coding-agents)
18. [Troubleshooting](#18-troubleshooting)
19. [Glossary](#19-glossary)
20. [What is intentionally left out](#20-what-is-intentionally-left-out)
21. [For facilitators](#21-for-facilitators)

---

## 1. How it works

```
Figma design ──► coding agent ──► your prototype ──► live URL
                    │
        reads AGENTS.md, skills, tokens and components
        so the result matches your design system
```

Three things keep the output on-design and consistent:

- **`AGENTS.md`** tells the agent the rules (use tokens, reuse components, run the checks).
- **Skills** in `.agents/skills/` give the agent step-by-step recipes (build from Figma, sync tokens, add a component, add an API route, connect Supabase, add a data feature, ship it).
- **`npm run check`** is an automatic safety net. It fails if the agent hard-codes a colour or size instead of using your design tokens, if TypeScript or lint finds a problem, or if the production build breaks.

You do not need to read or write code to use this. You do need to be able to open a terminal and paste a few commands, and this guide walks you through that.

---

## 2. What you need before you start

| Need                                         | Why                                                                                                                                                  | Cost                                                                                       |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| A **GitHub** account                         | Stores your code, enables Codespaces and Vercel                                                                                                      | Free                                                                                       |
| A **Figma** account and a design to build    | The thing you are turning into a prototype                                                                                                           | Free tier works for viewing; check Figma's docs for what its MCP server needs on your plan |
| A **coding agent**                           | Does the building. [Codex](https://developers.openai.com/codex) or [Claude Code](https://claude.com/claude-code) are the two this repo is set up for | Varies by plan                                                                             |
| A **Supabase** account (optional at first)   | Real login and a real database. The app runs without it in demo mode                                                                                 | Free tier available (check Supabase's current limits)                                      |
| A **Vercel** account (optional, for sharing) | Gives you a live link                                                                                                                                | Free tier available                                                                        |
| A modern browser                             | To see your prototype                                                                                                                                | Free                                                                                       |

You do **not** need to install anything up front if you use [Option A (Codespaces)](4-option-a-github-codespaces-nothing-to-install). For [Option B](5-option-b-run-it-on-your-own-computer), the setup script installs what is missing.

---

## 3. Choose how to run it

|                       | Option A: Codespaces                                      | Option B: Your computer + `setup.sh` | Option C: Manual             |
| --------------------- | --------------------------------------------------------- | ------------------------------------ | ---------------------------- |
| Install anything?     | No                                                        | The script installs it for you       | You install it yourself      |
| Works on              | Any computer with a browser                               | macOS, Linux, Windows (via WSL)      | macOS, Linux, Windows        |
| Best for              | Workshops, first-timers, Chromebooks, locked-down laptops | Your daily setup                     | People who want full control |
| Time to first preview | ~2 minutes                                                | ~5 to 10 minutes                     | ~10 to 15 minutes            |

**If you are unsure, pick Option A.**

---

## 4. Option A: GitHub Codespaces (nothing to install)

A Codespace is a computer in the cloud that opens in your browser with everything already set up (see `.devcontainer/devcontainer.json`).

1. Open the repository on GitHub.
2. Click the green **Code** button, open the **Codespaces** tab, and click **Create codespace on main**.
3. Wait for the editor to load. The first time, it installs dependencies automatically (about a minute).
4. In the terminal at the bottom, run:
   ```bash
   npm run dev
   ```
5. A pop-up appears saying port 3000 is available. Click **Open in Browser**. If you miss it, open the **Ports** tab and click the globe icon next to port 3000.
6. You should see the **Dashboard** with a yellow **Demo mode** notice. That means it works.

GitHub gives a monthly free allowance of Codespaces hours. Check GitHub's current limits, and stop your Codespace when you are done (**Codespaces** page, then **Stop**).

Skip to [Connect Figma](9-connect-figma-to-your-coding-agent).

---

## 5. Option B: Run it on your own computer

### Step 1: Get the code onto your computer

**If you have git:** open a terminal and run

```bash
git clone <your-repository-url> figma-to-prototype
cd figma-to-prototype
```

**If you do not have git:** on the GitHub page click **Code**, then **Download ZIP**, unzip it, and open a terminal in that folder (see the next step).

### Step 2: Open a terminal in the project folder

A terminal is a window where you type commands instead of clicking.

**macOS**

1. Press `Cmd + Space`, type **Terminal**, press Enter.
2. Move into the project folder. If it is on your Desktop:
   ```bash
   cd ~/Desktop/figma-to-prototype
   ```
   Tip: type `cd ` (with a space) and drag the folder from Finder into the Terminal window, then press Enter.

**Windows**

The setup script is a bash script, so on Windows use **WSL** (Windows Subsystem for Linux), a real Linux environment inside Windows.

1. Open **PowerShell as Administrator** (right-click the Start button).
2. Run `wsl --install` and restart your computer when asked.
3. Open **Ubuntu** from the Start menu and create a username and password when prompted.
4. In Ubuntu, clone the project into your Linux home folder (not `/mnt/c/...`, which is slow):
   ```bash
   cd ~
   git clone <your-repository-url> figma-to-prototype
   cd figma-to-prototype
   ```

If WSL is not possible on your machine, use [Option A (Codespaces)](4-option-a-github-codespaces-nothing-to-install) instead.

**Linux**

Open your terminal and `cd` into the project folder.

### Step 3: Run the setup script

```bash
bash setup.sh
```

The script is safe to re-run. It does the following, and **asks before installing anything**:

1. Checks for **git** and installs it if missing (on macOS this opens Apple's Command Line Tools installer, so click **Install** and wait).
2. Checks for **Node.js 20 or newer**. If it is missing or too old, it installs Node 22 using [nvm](https://github.com/nvm-sh/nvm) (no admin rights needed).
3. Runs `npm install` to download the project's dependencies.
4. Creates your `.env.local` file from `.env.example`.
5. Turns the folder into a git repository if it is not one, so you always have a "last good version".
6. Runs `npm run check` as a health check.
7. Offers to install the **Codex CLI**.

Useful flags:

```bash
bash setup.sh --yes    # answer yes to every question
bash setup.sh --help   # show what the script does
```

> **If the script says it installed Node, close the terminal and open a new one** before continuing. That is how your computer learns where the new Node is. Then `cd` back into the project folder.

### Step 4: Start the app

```bash
npm run dev
```

Open **http://localhost:3000** in your browser. You should see the **Dashboard** with a yellow **Demo mode** notice. That means it works.

To stop the app, click in the terminal and press `Ctrl + C`.

---

## 6. Option C: Manual install (no script)

Prefer to do it yourself? You need three things.

1. **Node.js 20.9 or newer** (22 recommended). Download the **LTS** version from <https://nodejs.org>, run the installer, and check it worked:
   ```bash
   node -v    # should print v20.9.0 or higher
   npm -v
   ```
2. **git** (optional but recommended). Download from <https://git-scm.com/downloads>.
3. **Install and run:**
   ```bash
   npm install
   cp .env.example .env.local     # on Windows PowerShell: Copy-Item .env.example .env.local
   npm run dev
   ```
   Then open <http://localhost:3000>.

---

## 7. What you will see: the default app (mobile and desktop)

Once `npm run dev` is running, open <http://localhost:3000>. You get a small working app, so you are never staring at a blank page.

| Page         | Address       | What it is                                                          |
| ------------ | ------------- | ------------------------------------------------------------------- |
| Dashboard    | `/`           | Welcome message, summary numbers and recent tasks                   |
| Tasks        | `/tasks`      | Add, update and delete tasks                                        |
| Account      | `/account`    | Who you are signed in as, and sign out                              |
| Login        | `/login`      | Sign in or create an account (needs Supabase, see the next section) |
| Health check | `/api/health` | Returns `{"status":"ok"}`                                           |
| Tasks API    | `/api/tasks`  | The same tasks as JSON                                              |

This app is a **placeholder**. It exists to show the components, design tokens, login and data working together. Your coding agent replaces it with your Figma design.

### Yes, it is a web app, and it adapts to phone and desktop

It is a responsive **web app** (a website that behaves like an app), not a native iPhone or Android app. One codebase adapts to the screen size:

**Desktop and tablet (768px wide and up):** a sidebar on the left, content on the right.

```
┌───────────┬────────────────────────────┐
│ App name  │  Page title                │
│           │  ┌─────┐ ┌─────┐ ┌─────┐   │
│ Dashboard │  │ stat│ │ stat│ │ stat│   │
│ Tasks     │  └─────┘ └─────┘ └─────┘   │
│ Account   │  Recent tasks              │
│           │  ┌──────────────────────┐  │
│ you@mail  │  │ task          [Done] │  │
│ Sign out  │  └──────────────────────┘  │
└───────────┴────────────────────────────┘
```

**Phone (narrower than 768px):** a top bar, one column of content, and a tab bar fixed to the bottom, like a native app.

```
┌──────────────────────┐
│ App name       [Demo]│
├──────────────────────┤
│ Page title           │
│ ┌──────────────────┐ │
│ │ stat             │ │
│ └──────────────────┘ │
│ Recent tasks         │
│ ┌──────────────────┐ │
│ │ task      [Done] │ │
│ └──────────────────┘ │
├──────────────────────┤
│ Home    Tasks    Me  │
└──────────────────────┘
```

The frame lives in `src/components/app-shell.tsx`. Every page you build inside `src/app/(app)/` gets it automatically.

### How to see the mobile view

**In your browser (easiest):** with the app open, switch on the device toolbar.

- **Chrome or Edge:** press `F12` (or `Ctrl + Shift + I`, on Mac `Cmd + Option + I`), then `Ctrl + Shift + M` (Mac: `Cmd + Shift + M`). Pick a phone such as "iPhone 14" from the dropdown.
- **Firefox:** `Ctrl + Shift + M` (Mac: `Cmd + Option + M`).
- **Safari:** enable the Develop menu in Settings, then **Develop, Enter Responsive Design Mode**.
- Or just drag the browser window narrower than 768px and watch the layout switch.

**On a real phone, same Wi-Fi as your computer:**

1. Start the app so other devices can reach it: `npm run dev -- -H 0.0.0.0`
2. Find your computer's local address (for example `192.168.1.20`). On Mac: **System Settings, Wi-Fi, Details**. On Windows or Linux: run `ipconfig` or `hostname -I`.
3. On your phone open `http://<that address>:3000`.
4. If the page loads but buttons do nothing, ask your agent: _"Add my computer's address to allowedDevOrigins in next.config.ts."_

**In a Codespace:** open the **Ports** tab, right-click port 3000, set **Port Visibility** to **Public**, and open the forwarded address on your phone.

### Demo mode and Supabase mode

|              | Demo mode (default)                            | Supabase mode                      |
| ------------ | ---------------------------------------------- | ---------------------------------- |
| Turned on by | Nothing. It is what you get with no keys       | Setting two values in `.env.local` |
| Login        | None. A fake demo user is signed in            | Real sign up and sign in           |
| Data         | Kept in memory, reset when the server restarts | Saved in your Supabase database    |
| Best for     | First run, workshops, quick design checks      | A real app you can show and share  |

You can build the whole design in demo mode and connect Supabase later.

---

## 8. Connect Supabase (real login and database)

Supabase gives you a **Postgres database** and **login** in one service. It is optional at first. The app works without it in demo mode.

> Short on time? Ask your coding agent: _"Use the connect-supabase skill."_ It does the file edits and checks for you. You only need to do the browser steps below.

### Step 1: Create a Supabase project

1. Go to <https://supabase.com> and sign up (GitHub login is quickest).
2. Click **New project**. Pick a name, create a **database password** (save it somewhere safe) and choose the **region** closest to you.
3. Wait a minute or two while the project is created.

### Step 2: Copy two values

Open **Project Settings, then API** (or click the **Connect** button at the top of the dashboard) and copy:

- **Project URL**, which looks like `https://abcdxyz.supabase.co`
- **Publishable key** (older projects call this the **anon** key). It is safe to use in the browser.

> **Never** copy the **service role** or **secret** key into this project, and never share it. The app does not need it.

### Step 3: Create the database tables

1. In Supabase open **SQL Editor, then New query**.
2. Open `supabase/schema.sql` from this project, copy everything, paste it in, and click **Run**.
3. You should see "Success". Open **Table Editor** and you will see a `tasks` table.

The script also switches on **Row Level Security (RLS)**, so each person can only ever see and change their own rows.

### Step 4: Allow sign-ups without email confirmation (workshops and demos)

Open **Authentication, then Providers, then Email** and turn **Confirm email** **off**. People can then sign up and get in straight away. For a real product, leave it on.

### Step 5: Put the values in `.env.local`

Open `.env.local` (created by `setup.sh`, or run `cp .env.example .env.local`) and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://abcdxyz.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

No quotes and no spaces. **Restart the app** (`Ctrl + C`, then `npm run dev`). Environment changes are only read at start-up.

### Step 6: Try it

1. Open <http://localhost:3000>. You are sent to the login page, and the "Demo mode" notice is gone.
2. Click **Create account**, use any email and a password of 8+ characters.
3. On the dashboard click **Add sample tasks**, then refresh the page. The tasks are still there.
4. In Supabase **Table Editor, then tasks** you can see the rows.

### How login works (plain English)

When you sign in, Supabase hands your browser a signed **JWT** (a tamper-proof pass that says who you are). It is stored in a cookie. On every page the app checks the pass with Supabase (`src/server/auth.ts`), and `src/proxy.ts` refreshes it before it expires. The database then uses the same pass, via Row Level Security, to decide which rows you may touch.

### Safety rules (already built in)

- RLS is on for every table. Never turn it off to "make something work". Fix the policy instead.
- Only the publishable key lives in the app. The service role key does not.
- The user id always comes from the verified session, never from a form field.
- `.env.local` is ignored by git, so your keys are not committed.

---

## 9. Connect Figma to your coding agent

The **Figma MCP server** lets your agent read your Figma frames directly (layout, colours, text, and a screenshot) instead of guessing from a description. This repo ships config for both Claude Code and Codex.

> Tooling moves quickly. If a command below does not match your version, run the tool's `--help` or check its docs. The server address Figma publishes is `https://mcp.figma.com/mcp`.

### Claude Code

The project already includes `.mcp.json`. When you open Claude Code in this folder it will offer to enable the `figma` server. To connect manually:

```bash
claude mcp add --transport http figma https://mcp.figma.com/mcp
```

Then start `claude`, run `/mcp`, choose **figma**, and sign in to Figma in the browser window that opens.

### Codex

The project includes `.codex/config.toml`, which Codex uses when you trust this project. If you would rather add it yourself:

```bash
codex mcp add figma --url https://mcp.figma.com/mcp
codex mcp login figma
```

### Check that it works

Start your agent in the project folder and ask:

```
Which Figma tools do you have available? Then fetch this frame and tell me what you see: <Figma frame link>
```

**How to get a frame link in Figma:** right-click the frame, then **Copy/Paste as**, then **Copy link to selection**.

**No MCP? No problem.** Attach a screenshot of the frame to your agent and describe it. It works less precisely but it works.

---

## 10. Build your first prototype

1. Start the app in one terminal: `npm run dev`.
2. Open a **second terminal** in the same folder and start your agent (`codex` or `claude`).
3. Paste a prompt like this:

   ```
   Use the figma-to-prototype skill. Build this frame as the home page: <Figma frame link>
   ```

4. Watch the browser at <http://localhost:3000>. It updates as the agent works.
5. Ask for changes in plain English:

   ```
   The spacing between cards is too tight and the heading should use the secondary colour.
   ```

6. When you are happy, ask:

   ```
   Run npm run check, fix anything that fails, commit, and tell me in one sentence what changed.
   ```

### Prompts that work well

| Goal                     | Prompt                                                                                    |
| ------------------------ | ----------------------------------------------------------------------------------------- |
| Build a screen           | `Use the figma-to-prototype skill to build <link> as /pricing`                            |
| Match the design closely | `Compare with the Figma screenshot at mobile and desktop widths and fix every difference` |
| Add new design values    | `The design has a new accent colour. Use the sync-tokens skill to add it`                 |
| New component            | `Use the new-component skill to add a Badge that matches the "Status" component in Figma` |
| Add behaviour            | `Use the add-api-route skill so this form saves an item and shows it in the list`         |
| Undo                     | `Go back to the last good commit`                                                         |
| Make it real             | `Use the connect-supabase skill so I get real login and saved data`                       |
| Add a feature with data  | `Use the add-table skill to add a <thing> with <fields>`                                  |
| Share it                 | `Use the ship-it skill to polish this and deploy it to Vercel`                            |

### If your agent does not pick up the skills

Codex reads `AGENTS.md` automatically. Skills are stored in `.agents/skills/` and linked at `.claude/skills/` for Claude Code. If your tool does not discover them, say it explicitly:

```
Follow .agents/skills/figma-to-prototype/SKILL.md to build this frame: <link>
```

---

## 11. Everyday commands

| Command                       | What it does                                                                 |
| ----------------------------- | ---------------------------------------------------------------------------- |
| `npm run dev`                 | Starts the app at <http://localhost:3000> with live reload                   |
| `npm run check`               | The full safety net: tokens, TypeScript, lint, token rules, production build |
| `npm run tokens`              | Rebuilds the Tailwind theme from `tokens/tokens.json`                        |
| `npm run tokens:check`        | Fails if code hard-codes colours or sizes                                    |
| `npm run typecheck`           | TypeScript only                                                              |
| `npm run lint`                | Lint only                                                                    |
| `npm run format`              | Auto-format all files                                                        |
| `npm run build` / `npm start` | Production build and run (what Vercel does)                                  |

You rarely need these yourself. Your agent runs `npm run check` before finishing.

---

## 12. Tour of the project

```
.
├── AGENTS.md                  Rules for AI agents (the most important file)
├── CLAUDE.md                  Points Claude Code at AGENTS.md
├── README.md                  This guide
├── setup.sh                   Installs what you need and runs a health check
├── .agents/skills/            Step-by-step recipes for agents
│   ├── figma-to-prototype/    Build a page from a Figma frame
│   ├── sync-tokens/           Update design tokens
│   ├── new-component/         Add a UI component
│   ├── add-api-route/         Add a backend endpoint
│   ├── connect-supabase/      Switch on real login and database
│   ├── add-table/             Add a data-backed feature end to end
│   └── ship-it/               Polish and deploy
├── .claude/skills             Link to .agents/skills for Claude Code
├── .mcp.json                  Figma MCP config for Claude Code
├── .codex/config.toml         Figma MCP config for Codex
├── .devcontainer/             One-click Codespaces setup
├── .env.example               Template for environment variables
├── supabase/schema.sql        Database tables + security rules (run once in Supabase)
├── tokens/tokens.json         Design tokens: the single source of truth
├── scripts/
│   ├── build-tokens.mjs       tokens.json to Tailwind theme CSS
│   └── check-tokens.mjs       Fails on hard-coded design values
├── src/
│   ├── proxy.ts               Keeps the login session fresh
│   ├── app/
│   │   ├── (app)/             Signed-in pages (these get the app shell)
│   │   │   ├── page.tsx       Dashboard, the default home screen
│   │   │   ├── tasks/         Tasks page
│   │   │   └── account/       Account page
│   │   ├── (auth)/login/      Login page
│   │   ├── api/               Backend endpoints (health, tasks)
│   │   └── globals.css        Tailwind + generated tokens
│   ├── actions/               Server actions called by forms
│   ├── components/
│   │   ├── app-shell.tsx      Sidebar on desktop, tab bar on mobile
│   │   ├── nav-link.tsx       Highlights the current page
│   │   ├── icons.tsx          Small inline icons
│   │   └── ui/                Button, Input, Card, Badge, Alert
│   ├── server/                Server-only logic: auth.ts, tasks.ts
│   ├── lib/                   cn(), config.ts (app name), schemas, supabase clients
│   ├── data/mock.ts           Sample data for demo mode
│   └── styles/                Generated token CSS (do not edit)
└── examples/                  A finished Figma-to-app walkthrough
```

**Where do I change...?**

| I want to change                          | Look in                                     |
| ----------------------------------------- | ------------------------------------------- |
| The app name and tagline                  | `src/lib/config.ts`                         |
| What the home screen shows                | `src/app/(app)/page.tsx`                    |
| Add a new signed-in page, like `/pricing` | Create `src/app/(app)/pricing/page.tsx`     |
| The sidebar and tab bar links             | `src/components/app-shell.tsx`              |
| Colours, fonts, spacing, radii            | `tokens/tokens.json`, then `npm run tokens` |
| A button, input or card                   | `src/components/ui/`                        |
| What gets saved (tables)                  | `supabase/schema.sql` plus `src/server/`    |
| Sample data for demo mode                 | `src/data/mock.ts`                          |
| A backend endpoint                        | `src/app/api/<name>/route.ts`               |
| Agent rules                               | `AGENTS.md`                                 |

---

## 13. Design tokens explained

A **design token** is a named design value, such as `primary` (a colour) or `lg` (a corner radius). Instead of writing `#4f46e5` in 40 places, everything says `bg-primary`. Change it once and the whole app updates, and it stays consistent with Figma.

```
Figma variables ──► tokens/tokens.json ──► src/styles/tokens.generated.css ──► Tailwind classes
   (design)          (source of truth)         (auto-generated, do not edit)    bg-primary, p-4, rounded-lg
```

**Example.** In `tokens/tokens.json`:

```json
"color": { "primary": "#4f46e5" }
```

becomes the class `bg-primary` (and `text-primary`, `border-primary`).

**What each group creates**

| Group in `tokens.json`      | Classes                                      |
| --------------------------- | -------------------------------------------- |
| `color`                     | `bg-*`, `text-*`, `border-*`, `ring-*`       |
| `radius`                    | `rounded-*`                                  |
| `text` (size + line height) | `text-*`                                     |
| `shadow`                    | `shadow-*`                                   |
| `font`                      | `font-*`                                     |
| `spacing.base`              | The spacing scale: `p-4` is 4 times the base |

**The default Tailwind colours are switched off on purpose.** `bg-blue-500` will not work here, only your tokens (`bg-primary`). This stops the agent from inventing colours that are not in your design.

**Adding or changing a token**

1. Edit `tokens/tokens.json` (or ask your agent: _"use the sync-tokens skill"_).
2. Run `npm run tokens` (it also runs automatically with `npm run dev`).
3. Use the new class.

**The guardrail.** `npm run tokens:check` scans the code and fails on:

- Hex or `rgb()`/`hsl()` colours (`#ff0000`)
- Arbitrary Tailwind values (`bg-[#fff]`, `p-[13px]`)
- Default palette classes (`text-blue-500`, `bg-white`)
- Inline `style={{ color: ... }}`

For a rare, justified exception, add the comment `token-check-ignore` on that line.

---

## 14. The backend explained

Next.js runs both the frontend and the backend in one project, so there is no second repo or server to manage.

```
Browser ──► page / form ──► server action ──► src/server/*.ts ──► Supabase database
              │                (src/actions)        │              (or demo memory)
              └─► /api/tasks ───────────────────────┘
                  (checks login, validates with zod)
```

- **Pages** in `src/app/` are server components by default. They read data directly from `src/server/`.
- **Server actions** (`src/actions/`) are what the app's own forms call. They check who you are, validate the input with zod, call a service, then refresh the page. No fetch code needed.
- **API routes** (`src/app/api/*/route.ts`) are for when something else needs to send or fetch data over HTTP. They stay thin in the same way.
- **Services** (`src/server/`) hold the logic and the database calls. They are `server-only`, so they can never leak into browser code. Each one works in both demo mode and Supabase mode.
- **Schemas** (`src/lib/schemas.ts`) define the shape of your data once. The same types are used by actions, routes and the UI.
- **Auth** (`src/server/auth.ts`): `requireUser()` protects a page or action, `getCurrentUser()` just looks.

Try the API while `npm run dev` is running (in demo mode no login is needed):

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/tasks
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","notes":"From curl"}'
```

In Supabase mode these return `401 Not signed in` unless the request carries a login cookie. That is the security working as intended.

### Where data lives

- **Demo mode:** in memory. It resets when the server restarts, and on Vercel it resets between requests, because serverless functions have no permanent memory or disk.
- **Supabase mode:** in your Postgres database. It persists everywhere, including on Vercel.

### Adding your own data

Ask your agent: _"Use the add-table skill to add a <thing> with <fields>."_ It creates the table and security rules (to paste into Supabase's SQL Editor), the types, the service, the actions and the page.

### Environment variables

- Local values go in `.env.local` (never committed, ignored by git).
- Add every new variable name to `.env.example` (without the secret value).
- Only variables starting with `NEXT_PUBLIC_` are visible in the browser. Everything else stays on the server.
- On Vercel, add the same variables under **Project Settings, then Environment Variables**.

---

## 15. Deploy to Vercel

1. **Put the code on GitHub.** If it is not there yet:
   ```bash
   git remote add origin <your-new-empty-github-repo-url>
   git push -u origin main
   ```
   (If your branch is called `master`, use `git push -u origin master`.)
2. Go to <https://vercel.com>, sign in with GitHub, and click **Add New, then Project**.
3. Pick your repository and click **Import**. Vercel detects Next.js automatically. Do not change the build settings.
4. Add your environment variables. If you connected Supabase, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (the same values as in `.env.local`) under **Environment Variables** before deploying. Without them the live site runs in demo mode.
5. Click **Deploy**. After a minute or two you get a live URL.

**Supabase after you deploy:** in Supabase open **Authentication, then URL Configuration**, set **Site URL** to your Vercel address, and add it (plus `http://localhost:3000`) to the **Redirect URLs**. Do this before you share the link.

From then on, every push creates a new deployment, and every branch or pull request gets its own **preview URL** you can share for feedback.

Prefer the command line? Run `npx vercel` and follow the prompts.

**If the deploy fails:** run `npm run check` locally. If it passes locally, the deploy almost always passes. If it fails locally, fix that first (or ask your agent to).

---

## 16. Good practices built into this repo

You do not have to remember these. They are enforced by the rules and checks.

- **Tokens only.** No hard-coded colours or sizes, checked automatically.
- **Reuse before you build.** Agents look at `src/components/ui/` first.
- **TypeScript strict mode.** Catches many bugs before you see them.
- **Server components by default.** Less JavaScript sent to the browser, faster pages. `"use client"` only when needed.
- **Validated input.** Every server action and API route validates requests with zod.
- **Secure by default.** Login uses Supabase JWT sessions, every table has Row Level Security, and the user id always comes from the verified session.
- **Responsive.** Every screen works on a phone and on a desktop.
- **Thin routes, logic in services.** Easier to read, test and change.
- **Secrets stay on the server.** `server-only` and the `NEXT_PUBLIC_` rule.
- **Accessible by default.** Semantic HTML, labelled inputs, visible focus.
- **Mobile-first.** Built for small screens, enhanced for large.
- **Small commits.** The agent commits after each working step, so you can always go back.
- **No unnecessary dependencies.** Fewer things to break.

---

## 17. Using other coding agents

- **Codex:** reads `AGENTS.md` natively.
- **Claude Code:** reads `CLAUDE.md`, which points to `AGENTS.md`. Skills are found through `.claude/skills`.
- **Cursor, Windsurf, Copilot and others:** most read `AGENTS.md` or let you point to it. If yours does not, start with: _"Read AGENTS.md and follow it for everything in this project."_

Keeping the rules in one file (`AGENTS.md`) means you edit them once and every tool follows them.

---

## 18. Troubleshooting

**`bash: ./setup.sh: Permission denied`**
Run it with `bash setup.sh` (no `./`), or run `chmod +x setup.sh` first.

**`command not found: npm` or `node`**
Node is not installed, or your terminal does not know about it yet. Close the terminal, open a new one, and try again. If it still fails, run `bash setup.sh`.

**`error: ... requires Node.js >=20.9.0` or a Node version error**
Run `node -v`. If it is lower than 20.9, run `bash setup.sh` (it installs Node 22), then open a new terminal.

**Port 3000 is already in use**
Another copy of the app is running. Close the other terminal (or press `Ctrl + C` in it). Or use another port: `npm run dev -- -p 3001`, then open <http://localhost:3001>.

**The page is blank or shows an error overlay**
Read the first line of the red error box and give it to your agent: _"Fix this error and explain in one sentence."_ If it started after a change you did not like, say _"go back to the last good commit."_

**My colour or size class does nothing (for example `bg-blue-500`)**
The default Tailwind palette is switched off. Use a token like `bg-primary`, or add a new token (see [Design tokens](13-design-tokens-explained)).

**`npm run check` fails with `tokens:check found ... hard-coded design value(s)`**
The message tells you the file, the line and what to use instead. Replace the value with a token, or add the token to `tokens/tokens.json`. Ask your agent: _"Fix the tokens:check failures."_

**I changed `tokens.json` but nothing changed**
Run `npm run tokens` (or restart `npm run dev`, which runs it for you). Never edit `src/styles/tokens.generated.css` directly. It is overwritten.

**`npm install` fails with `EACCES` (permission denied)**
Do not use `sudo npm`. If Node was installed with a system installer, reinstall it via `bash setup.sh` (which uses nvm), then open a new terminal.

**`npm audit` reports vulnerabilities**
You may see warnings about a lint-tool dependency (`braces`). These affect developer tooling only, not the app you deploy. Do **not** run `npm audit fix --force`, because it can downgrade the framework and break the project.

**`npm warn deprecated ...` messages during install**
These are notices about library versions, not errors. If the install finishes and `npm run dev` works, you can ignore them.

**The agent cannot see my Figma frame**
Check the connection: run `/mcp` in Claude Code, or `codex mcp list` in Codex. Re-run the login step in [Connect Figma](9-connect-figma-to-your-coding-agent). Make sure the link points to a specific frame (right-click, then Copy link to selection) and that your Figma account can open it. As a fallback, attach a screenshot.

**The agent ignores the rules or the skills**
Say it explicitly: _"Read AGENTS.md first, then follow .agents/skills/figma-to-prototype/SKILL.md."_

**The app still says "Demo mode" after I added my Supabase keys**
Restart `npm run dev` (environment files are read at start-up). Check that the file is named exactly `.env.local`, sits in the project root, and that the variable names are exactly `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` with no quotes or spaces.

**"Could not reach Supabase" when signing in**
The URL or key is wrong. Copy them again from **Project Settings, then API**, and restart the app.

**Sign up says "Check your email to confirm"**
**Confirm email** is still on. Turn it off under **Authentication, Providers, Email** in Supabase (for workshops), or click the link in the email.

**`relation "public.tasks" does not exist` or "Could not load tasks"**
The database tables have not been created. Run `supabase/schema.sql` in Supabase's **SQL Editor**.

**`new row violates row-level security policy` or "permission denied"**
The security rules are missing or you are not signed in. Re-run `supabase/schema.sql`, sign out and in again. Do not turn RLS off.

**I keep getting sent back to the login page**
Your session is missing or expired. Sign in again. If it happens on Vercel, check that the two Supabase variables are set there and that the **Site URL** in Supabase matches your Vercel address.

**The mobile layout does not show**
The layout switches at 768px wide. Make the browser window narrower, or use the device toolbar (see "How to see the mobile view").

**Everything is broken and I want to start over**

```bash
git status                  # see what changed
git log --oneline           # list the saved versions
git restore .               # throw away uncommitted changes
git reset --hard <commit>   # return to a specific saved version
```

`git reset --hard` discards changes permanently, so use it only when you mean it. Or just ask your agent: _"Go back to the last good commit."_

**Windows: `setup.sh` fails with `$'\r': command not found`**
The file got Windows line endings. Run `sed -i 's/\r$//' setup.sh` inside WSL and try again. Better: clone the repository inside WSL instead of unzipping on Windows.

**Windows: skills folder shows as a plain text file**
`.claude/skills` is a symbolic link, which some Windows tools do not preserve. Use WSL or Codespaces, or point your agent directly at `.agents/skills/`.

**Vercel build fails but it works locally**
Check that you committed everything (`git status`), and that any required environment variables are set in Vercel. Run `npm run check` locally to reproduce the build.

---

## 19. Glossary

| Term                         | Plain-English meaning                                                               |
| ---------------------------- | ----------------------------------------------------------------------------------- |
| **Terminal**                 | A window where you type commands                                                    |
| **Repository (repo)**        | A project folder tracked by git                                                     |
| **git / commit**             | A system that saves versions of your project; a commit is one saved version         |
| **Node.js / npm**            | The runtime that runs this project / the tool that installs its libraries           |
| **Dependency**               | A library the project uses, downloaded by `npm install`                             |
| **Next.js**                  | The framework that serves pages and backend endpoints                               |
| **React**                    | The library used to build the user interface from components                        |
| **Tailwind CSS**             | A styling system where you write classes like `p-4` and `bg-primary`                |
| **Design token**             | A named design value (colour, spacing, radius) shared by design and code            |
| **Component**                | A reusable piece of interface, like a button                                        |
| **API route**                | A backend URL (like `/api/items`) that returns data                                 |
| **Mock data**                | Fake sample data used before a real database exists                                 |
| **MCP**                      | A standard that lets an AI agent connect to tools like Figma                        |
| **Skill**                    | A saved recipe an agent follows for a certain kind of task                          |
| **Vercel**                   | The hosting service that gives your prototype a live URL                            |
| **Codespace**                | A cloud computer, in your browser, with the project ready to run                    |
| **Supabase**                 | A hosted database and login service                                                 |
| **JWT**                      | A signed digital pass that proves who you are. Supabase issues one when you sign in |
| **Row Level Security (RLS)** | Database rules that make sure people only see their own rows                        |
| **Demo mode**                | The app running with no Supabase: fake user, data in memory                         |
| **Server action**            | A function that runs on the server when a form is submitted                         |
| **Responsive**               | A layout that adapts to the screen size, phone or desktop                           |

