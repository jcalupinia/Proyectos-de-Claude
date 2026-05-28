# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository purpose

Companion repo to a reel by `@soyenriquerocha` listing 5 free tools that extend Claude Code. It ships:

- `install.sh` — a Bash installer that wires those 5 tools into the user's local Claude Code setup.
- `demo-react/` — a minimal Vite + React 18 app that demonstrates the framer-motion tool from the list.

The repo itself is not a library or product — there is no test suite, no lint config, no CI. Changes are almost always to the installer, the README (Spanish), or the demo.

## Common commands

Installer (run from repo root):

```bash
./install.sh                              # interactive menu
./install.sh --all                        # install all 5
./install.sh --n8n --claude-mem --uipro   # subset (flags: --n8n --claude-mem --uipro --ecc --framer-motion)
./install.sh -h                           # help (parsed from the leading `# ` block)
```

Requires `node >= 18`, `npm`, and the `claude` CLI on PATH (only `--n8n` hard-requires `claude`; others warn).

Demo app (`demo-react/`):

```bash
cd demo-react
npm install        # or `../install.sh --framer-motion` from repo root
npm run dev        # vite dev server on :5173
npm run build      # production build
npm run preview    # serve the built bundle
```

## Architecture notes

### `install.sh` structure

One installer per tool, each as its own `install_X` function (`install_n8n`, `install_claude_mem`, `install_uipro`, `install_ecc`, `install_framer`). The bottom of the file gates each function on a `WANT_*` flag set during arg parsing or the interactive prompt. To add a tool, add: a flag in the `for arg in "$@"` case block, a prompt in the `INTERACTIVE` block, an `install_X` function, and a gated call at the bottom.

The script is `set -euo pipefail`, uses colored `info`/`ok`/`warn`/`fail` helpers, and a `require <cmd>` preflight helper. Reuse these instead of inlining new logging or `command -v` checks.

### n8n-MCP `.env` handling

`install_n8n` looks for `./.env` (gitignored) and, if `N8N_API_URL` + `N8N_API_KEY` are set, registers n8n-MCP in **management mode** (Claude can execute workflows on a real n8n instance). Without `.env` it falls back to **documentation-only mode**. `.env.example` documents the variables. Before reinstalling, it removes any existing `n8n-mcp` registration via `claude mcp remove` to avoid duplicate registrations.

### Modifications outside the repo

The installer writes to the user's global state — `~/.claude/`, `~/.config/`, npm global (`npm install -g uipro-cli`), and `~/.local/share/ecc` (git clone of ECC). When changing installer behavior, remember these side effects are not contained in the repo and are not undone by `git`. ECC has a `/plugin` alternative noted in the README; the script uses the manual `git clone` path because `/plugin` only works from inside Claude Code.

### Remote (Web) sessions caveat

Plugins/skills installed inside a Claude Code on the web container do not persist — the container is ephemeral. The README and installer are written assuming the user runs `install.sh` on their local machine. Don't add features that depend on persistence inside the web container.

### `demo-react/`

Self-contained Vite + React 18 + framer-motion demo. Single component (`src/App.jsx`) showing `motion.*`, `AnimatePresence`, and shared-layout animation via `layoutId`. No router, no state management, no tests. It exists to make `framer-motion` runnable in one step after the installer.

## Conventions

- README and installer user-facing strings are in Spanish; match that when editing them. Code identifiers stay English.
- Commits so far follow short imperative English subjects (`Add installer and demo for 5 free Claude tools`).
- `.env` is gitignored; never commit credentials. `.env.example` is the template.
