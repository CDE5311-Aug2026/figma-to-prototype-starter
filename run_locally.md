# Run this app on your computer

A short, step-by-step guide. You do not need to know how to code. If anything goes wrong, jump to [Fixing common problems](#fixing-common-problems).

**What you will end up with:** the app running at <http://localhost:3000> in your browser, with a phone view and a desktop view.

**Time needed:** about 5 to 10 minutes.

---

## The 4 steps

1. [Get the project onto your computer](#step-1-get-the-project)
2. [Open a terminal in the project folder](#step-2-open-a-terminal-in-the-project-folder)
3. [Install what you need](#step-3-install-what-you-need)
4. [Start the app](#step-4-start-the-app)

> **Do not want to install anything?** Use GitHub Codespaces instead. Open the repository on GitHub, click **Code, then Codespaces, then Create codespace**. It opens a ready-to-go editor in your browser. In its terminal run `npm run dev`. Then skip to [Step 4](#step-4-start-the-app).

---

## Step 1: Get the project

**Option A: download a ZIP (easiest)**

1. Download the project ZIP.
2. Unzip it. You should get a folder called `figma-to-prototype-starter`.
3. Move it somewhere easy to find, such as your Desktop or Documents.

**Option B: use git**

```bash
git clone <your-repository-url> figma-to-prototype-starter
```

---

## Step 2: Open a terminal in the project folder

A **terminal** is a window where you type commands. You need one that is "inside" the project folder.

### macOS

1. Press `Cmd + Space`, type **Terminal**, press Enter.
2. Type `cd ` (the letters c, d and a space), then **drag the project folder from Finder into the Terminal window**, then press Enter.

   Or type the path yourself, for example: `cd ~/Desktop/figma-to-prototype-starter`

### Windows (simplest: no extra setup)

1. Open the project folder in File Explorer.
2. Click the address bar at the top, type `powershell`, and press Enter. A PowerShell window opens already inside the folder.

### Windows with WSL (needed only if you want to use `setup.sh`)

1. Open **PowerShell as Administrator**, run `wsl --install`, and restart your computer.
2. Open **Ubuntu** from the Start menu.
3. Inside Ubuntu, get the project into your Linux home folder (do not run it from `/mnt/c/...`, which is slow):
   ```bash
   cd ~
   git clone <your-repository-url> figma-to-prototype-starter
   cd figma-to-prototype-starter
   ```

### Linux

Open your terminal and `cd` into the project folder.

**Check you are in the right place.** Run this and you should see `package.json` in the list:

```bash
ls            # macOS / Linux / WSL
dir           # Windows PowerShell
```

---

## Step 3: Install what you need

The app needs **Node.js 20.9 or newer** (version 22 is best) and its libraries. Pick one way.

### Way 1: the setup script (macOS, Linux, Windows WSL)

```bash
bash setup.sh
```

It checks what you have, **asks before installing anything**, and sets everything up:

- installs **git** and **Node.js 22** if they are missing
- installs the project's libraries
- creates your `.env.local` settings file
- runs a health check, so you know everything works

Answer `y` when it asks. If it says it installed Node, **close the terminal, open a new one, and go back into the project folder** (Step 2) before continuing.

Prefer no questions? `bash setup.sh --yes` says yes to everything.

### Way 2: do it by hand (works on Windows without WSL)

1. Go to <https://nodejs.org>, download the **LTS** version, and run the installer. Accept the defaults.
2. **Close and reopen your terminal** (Step 2), then check Node is installed:
   ```bash
   node -v
   ```
   It should print `v20.9.0` or higher (for example `v22.x.x`).
3. In the project folder, install the libraries:
   ```bash
   npm install
   ```
   This takes a minute or two. Warnings that start with `npm warn` are normal.
4. Create your settings file:
   ```bash
   cp .env.example .env.local          # macOS, Linux, WSL
   copy .env.example .env.local        # Windows PowerShell
   ```

---

## Step 4: Start the app

```bash
npm run dev
```

Wait until you see a line like `Ready` or `Local: http://localhost:3000`. Then open **<http://localhost:3000>** in your browser.

You should see the **Dashboard**, with a yellow **Demo mode** notice. **That means it works.**

Leave the terminal open while you use the app. It is the app's engine.

**To stop it:** click the terminal and press `Ctrl + C`.
**To start it again later:** open a terminal in the project folder and run `npm run dev`.

---

## What you will see

The app starts in **demo mode**, so it works straight away with no accounts or keys:

- **Dashboard** at `/`: welcome message, summary numbers and recent tasks
- **Tasks** at `/tasks`: add, update and delete tasks
- **Account** at `/account`: your details and sign out
- **No login**: a fake demo user is signed in
- **Data is temporary**: it resets when you stop and restart the app

This is a placeholder app. Your coding agent replaces it with your Figma design.

---

## See the phone view and the desktop view

It is one web app that changes layout with the screen width:

| Screen                           | Layout                                        |
| -------------------------------- | --------------------------------------------- |
| **Desktop** (768px wide or more) | Sidebar on the left, content on the right     |
| **Phone** (narrower than 768px)  | Top bar, content, and a tab bar at the bottom |

**Easiest way to try the phone view:** in your browser, open developer tools and switch on the device toolbar.

- **Chrome or Edge:** press `F12`, then `Ctrl + Shift + M` (Mac: `Cmd + Option + I`, then `Cmd + Shift + M`). Pick a phone, such as iPhone 14.
- **Firefox:** `Ctrl + Shift + M` (Mac: `Cmd + Option + M`).
- **Safari:** turn on the Develop menu in Settings, then **Develop, Enter Responsive Design Mode**.
- Or drag the browser window narrower and watch the layout change.

**On your real phone** (same Wi-Fi as your computer):

1. Stop the app (`Ctrl + C`) and start it so other devices can reach it:
   ```bash
   npm run dev -- -H 0.0.0.0
   ```
2. Find your computer's local address, such as `192.168.1.20`:
   - macOS: **System Settings, Wi-Fi, Details**
   - Windows: run `ipconfig` and look for **IPv4 Address**
   - Linux/WSL: run `hostname -I`
3. On your phone, open `http://<that address>:3000`.
4. If the page loads but buttons do nothing, ask your coding agent: _"Add my computer's address to allowedDevOrigins in next.config.ts."_

---

## Optional: turn on real login and a real database

You can skip this for now. When you want real accounts and saved data, connect **Supabase**:

1. Create a free project at <https://supabase.com>.
2. Copy the **Project URL** and the **Publishable key** from **Project Settings, then API**. (Never use the "service role" or "secret" key.)
3. In Supabase, open **SQL Editor, then New query**, paste in everything from `supabase/schema.sql`, and click **Run**.
4. In Supabase, open **Authentication, Providers, Email** and turn **Confirm email** off (for demos and workshops).
5. Open `.env.local` in a text editor and fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ```
   No quotes, no spaces.
6. **Stop and restart** the app (`Ctrl + C`, then `npm run dev`).
7. Open <http://localhost:3000>. You are sent to a login page and the "Demo mode" notice is gone. Create an account and add some tasks.

The full walkthrough is in [README.md](./README.md), section "Connect Supabase".

---

## Use it with your coding agent

1. Keep `npm run dev` running in one terminal.
2. Open a **second terminal** in the same folder and start your agent (`codex` or `claude`).
3. Paste your Figma link and ask:

   ```
   Use the figma-to-prototype skill. Build this frame as the home page: <Figma link>
   ```

4. Watch <http://localhost:3000> update as the agent works.
5. When you are happy: _"Run npm run check, fix anything that fails, and commit."_

---

## Cheat sheet

| I want to...                         | Run                         |
| ------------------------------------ | --------------------------- |
| Start the app                        | `npm run dev`               |
| Stop the app                         | `Ctrl + C` in the terminal  |
| Check everything is healthy          | `npm run check`             |
| Re-run setup                         | `bash setup.sh`             |
| Reinstall libraries                  | `npm install`               |
| Use another port                     | `npm run dev -- -p 3001`    |
| Make the app reachable from my phone | `npm run dev -- -H 0.0.0.0` |

---

## Fixing common problems

**`command not found: npm` or `'npm' is not recognized`**
Node is not installed, or the terminal has not noticed it yet. Install Node (Step 3), then **close the terminal and open a new one**.

**`node -v` shows something lower than v20.9**
Your Node is too old. Run `bash setup.sh` (it installs Node 22), or install the latest **LTS** from <https://nodejs.org>. Then open a new terminal.

**`bash: ./setup.sh: Permission denied`**
Run it as `bash setup.sh` (without `./`).

**`Port 3000 is already in use`**
Another copy of the app is still running. Close that terminal window, or press `Ctrl + C` in it. Or use a different port: `npm run dev -- -p 3001` and open <http://localhost:3001>.

**The page is blank, or shows a red error box**
Copy the first line of the error and give it to your coding agent: _"Fix this error and explain in one sentence."_

**`npm install` says `EACCES` (permission denied)**
Do not use `sudo npm`. Reinstall Node with `bash setup.sh` (it installs Node without admin rights), then open a new terminal.

**`npm warn deprecated ...` messages**
Notices, not errors. If the install finishes and the app starts, ignore them.

**`npm audit` warns about vulnerabilities**
These come from developer tooling, not the app itself. Do **not** run `npm audit fix --force`, because it can break the project.

**I changed `.env.local` but nothing changed**
Stop and restart the app. Settings are only read when it starts.

**It still says "Demo mode" after adding Supabase keys**
Restart the app. Check the file is named exactly `.env.local`, is in the project's main folder, and that the variable names are spelled exactly as above with no quotes or spaces.

**Windows: `setup.sh` fails with `$'\r': command not found`**
The file has Windows line endings. In WSL run `sed -i 's/\r$//' setup.sh` and try again. Or skip the script and use "Way 2: do it by hand".

**Want to wipe your changes and start over**
Ask your agent: _"Go back to the last good commit."_ Or re-download the project.

Still stuck? Ask your coding agent: _"Read RUN_LOCALLY.md and help me get the app running. Here is what I see: ..."_ and paste the message from your terminal.