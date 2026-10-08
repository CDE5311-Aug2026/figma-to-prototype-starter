#!/usr/bin/env bash
#
# setup.sh - one-command setup for the Figma to Prototype Starter.
#
# What it does (asks before installing anything):
#   1. Checks for git, curl and Node.js 20+ and installs whatever is missing
#   2. Installs the project's dependencies (npm install)
#   3. Creates your local .env.local file
#   4. Runs a health check so you know everything works
#   5. Optionally installs the Codex CLI
#
# Works on macOS, Linux (Ubuntu/Debian, Fedora, Arch, openSUSE) and Windows via WSL.
#
# Usage:
#   bash setup.sh          # interactive, asks before installing
#   bash setup.sh --yes    # say yes to everything (installs Codex CLI too)
#   bash setup.sh --help
#
set -euo pipefail

NODE_MAJOR=22          # version installed if Node is missing or too old
MIN_NODE_MAJOR=20      # anything at or above this is accepted
NVM_VERSION="v0.40.3"
ASSUME_YES=false

# ---------- pretty output ----------
if [ -t 1 ]; then
  BOLD=$'\033[1m'; GREEN=$'\033[32m'; YELLOW=$'\033[33m'; RED=$'\033[31m'; DIM=$'\033[2m'; RESET=$'\033[0m'
else
  BOLD=""; GREEN=""; YELLOW=""; RED=""; DIM=""; RESET=""
fi
step() { printf '\n%s==> %s%s\n' "$BOLD" "$1" "$RESET"; }
ok()   { printf '%s  ok%s  %s\n' "$GREEN" "$RESET" "$1"; }
warn() { printf '%swarn%s  %s\n' "$YELLOW" "$RESET" "$1"; }
info() { printf '%s      %s%s\n' "$DIM" "$1" "$RESET"; }
die()  { printf '\n%serror%s %s\n' "$RED" "$RESET" "$1" >&2; exit 1; }

usage() {
  # Print the comment block at the top of this file.
  awk 'NR>1 && /^#/ {sub(/^# ?/, ""); print; next} NR>1 {exit}' "$0"
}

for arg in "$@"; do
  case "$arg" in
    -y|--yes) ASSUME_YES=true ;;
    -h|--help) usage; exit 0 ;;
    *) die "Unknown option: $arg (try --help)" ;;
  esac
done

confirm() {
  # confirm "Question?"  -> returns 0 for yes, 1 for no
  if [ "$ASSUME_YES" = true ]; then return 0; fi
  if [ ! -t 0 ]; then
    die "This script needs to ask a question but has no terminal. Re-run with: bash setup.sh --yes"
  fi
  local reply
  read -r -p "$1 [y/N] " reply
  case "$reply" in y|Y|yes|YES) return 0 ;; *) return 1 ;; esac
}

have() { command -v "$1" >/dev/null 2>&1; }

# ---------- move to the project folder ----------
cd "$(dirname "${BASH_SOURCE[0]}")"
[ -f package.json ] || die "Run this script from the project folder (package.json not found)."

OS="$(uname -s)"
case "$OS" in
  Darwin) PLATFORM="macOS" ;;
  Linux)  PLATFORM="Linux" ;;
  *) die "Unsupported system: $OS. On Windows, use WSL (see README) or GitHub Codespaces." ;;
esac

printf '%sFigma to Prototype Starter - setup%s\n' "$BOLD" "$RESET"
info "Detected: $PLATFORM"

# ---------- helpers for installing system packages (Linux) ----------
SUDO=""
if [ "$(id -u)" -ne 0 ]; then
  if have sudo; then SUDO="sudo"; fi
fi

linux_install() {
  # linux_install <package...>
  if [ "$(id -u)" -ne 0 ] && [ -z "$SUDO" ]; then
    die "Need administrator rights to install: $*. Install them manually, then re-run this script."
  fi
  if have apt-get; then
    $SUDO apt-get update -y && $SUDO apt-get install -y "$@"
  elif have dnf; then
    $SUDO dnf install -y "$@"
  elif have yum; then
    $SUDO yum install -y "$@"
  elif have pacman; then
    $SUDO pacman -Sy --noconfirm "$@"
  elif have zypper; then
    $SUDO zypper --non-interactive install "$@"
  else
    die "No supported package manager found. Please install manually: $*"
  fi
}

# ---------- 1. git ----------
step "Checking git"
if have git; then
  ok "git $(git --version | awk '{print $3}')"
else
  warn "git is not installed."
  confirm "Install git now?" || die "git is required. Install it and re-run this script."
  if [ "$PLATFORM" = "macOS" ]; then
    info "A macOS window will open asking to install the Command Line Tools."
    info "Click Install, wait for it to finish, then come back here."
    xcode-select --install 2>/dev/null || true
    until have git && xcode-select -p >/dev/null 2>&1; do
      read -r -p "Press Enter once the installation has finished... " _ || true
      have git || warn "git still not found. Finish the installer, then press Enter again."
    done
  else
    linux_install git
  fi
  have git || die "git installation did not work. Install it manually and re-run."
  ok "git installed"
fi

# ---------- 2. curl (needed to install Node) ----------
if ! have curl; then
  warn "curl is not installed."
  confirm "Install curl now?" || die "curl is required. Install it and re-run."
  if [ "$PLATFORM" = "Linux" ]; then linux_install curl; else die "curl should ship with macOS. Please check your system."; fi
fi

# ---------- 3. Node.js ----------
step "Checking Node.js (need $MIN_NODE_MAJOR or newer)"

node_major() { node -p "process.versions.node.split('.')[0]" 2>/dev/null || echo 0; }

load_nvm() {
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  # nvm's scripts are not written for 'set -u', so relax it while loading and using nvm.
  set +u
  # shellcheck disable=SC1091
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
  set -u
}

if have node && [ "$(node_major)" -ge "$MIN_NODE_MAJOR" ]; then
  ok "Node $(node -v) and npm $(npm -v)"
else
  if have node; then
    warn "Found Node $(node -v), which is too old."
  else
    warn "Node.js is not installed."
  fi
  confirm "Install Node.js $NODE_MAJOR using nvm (no admin rights needed)?" \
    || die "Node.js $MIN_NODE_MAJOR+ is required. Install it from https://nodejs.org and re-run."

  load_nvm
  if ! type nvm >/dev/null 2>&1; then
    info "Installing nvm $NVM_VERSION ..."
    curl -fsSL "https://raw.githubusercontent.com/nvm-sh/nvm/$NVM_VERSION/install.sh" | bash
    load_nvm
  fi
  type nvm >/dev/null 2>&1 || die "nvm did not load. Open a new terminal window and re-run this script."

  info "Installing Node.js $NODE_MAJOR ..."
  set +u
  nvm install "$NODE_MAJOR"
  nvm use "$NODE_MAJOR"
  nvm alias default "$NODE_MAJOR" >/dev/null
  set -u

  have node || die "Node installation did not work. Open a new terminal and re-run."
  ok "Node $(node -v) and npm $(npm -v) installed"
  NEW_SHELL_NEEDED=true
fi
NEW_SHELL_NEEDED="${NEW_SHELL_NEEDED:-false}"

# ---------- 4. project dependencies ----------
step "Installing project dependencies (this can take a minute)"
npm install --no-fund
ok "Dependencies installed"

# ---------- 5. local environment file ----------
step "Setting up local environment file"
if [ -f .env.local ]; then
  ok ".env.local already exists (left untouched)"
elif [ -f .env.example ]; then
  cp .env.example .env.local
  ok "Created .env.local from .env.example"
fi

# ---------- 6. git repository ----------
step "Checking git repository"
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  ok "Already a git repository"
else
  info "Not a git repository yet. Creating one so you always have a last good version to go back to."
  git init -q -b main 2>/dev/null || git init -q
  if [ -z "$(git config user.name || true)" ] || [ -z "$(git config user.email || true)" ]; then
    warn "git does not know who you are yet. Set it once with:"
    info 'git config --global user.name "Your Name"'
    info 'git config --global user.email "you@example.com"'
    info "Then run:  git add -A && git commit -m \"Initial commit\""
  else
    git add -A
    git commit -q -m "Initial commit from starter"
    ok "Created repository with an initial commit"
  fi
fi

# ---------- 7. health check ----------
step "Running health check (typecheck, lint, tokens, build)"
if npm run check; then
  ok "Everything works"
else
  die "The health check failed. Scroll up to see why, or see Troubleshooting in README.md."
fi

# ---------- 8. optional: Codex CLI ----------
step "Optional: Codex CLI"
if have codex; then
  ok "Codex CLI already installed"
elif confirm "Install the Codex CLI (OpenAI's coding agent) globally?"; then
  if npm install -g @openai/codex; then
    ok "Codex CLI installed. Start it by typing: codex"
  else
    warn "Could not install Codex automatically. See README.md for manual steps."
  fi
else
  info "Skipped. You can use any coding agent you like (see README.md)."
fi

# ---------- done ----------
printf '\n%s%sAll set!%s\n\n' "$BOLD" "$GREEN" "$RESET"
if [ "$NEW_SHELL_NEEDED" = true ]; then
  warn "Node was just installed. Close this terminal and open a new one before continuing."
fi
cat <<MSG
Next steps:
  1. Start the app:        npm run dev
  2. Open in your browser: http://localhost:3000
  3. Start your coding agent in this folder and paste your Figma link.

The app starts in DEMO MODE (no login, data kept in memory) so it works right away.
To switch on real accounts and a database, follow "Connect Supabase" in README.md.

Full guide: README.md
MSG
