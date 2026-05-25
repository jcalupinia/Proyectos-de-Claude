#!/usr/bin/env bash
# install.sh — instala las 5 herramientas gratis para Claude Code
# Uso:
#   ./install.sh                 -> menú interactivo
#   ./install.sh --all           -> instala todas
#   ./install.sh --n8n --uipro   -> instala específicas
#
# Flags disponibles: --n8n  --claude-mem  --uipro  --ecc  --framer-motion

set -euo pipefail

# Colores
B="\033[1m"; G="\033[32m"; Y="\033[33m"; R="\033[31m"; C="\033[36m"; N="\033[0m"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"

# --- helpers --------------------------------------------------------------

info()  { printf "${C}==>${N} %s\n" "$*"; }
ok()    { printf "${G}✓${N}  %s\n" "$*"; }
warn()  { printf "${Y}!${N}  %s\n" "$*"; }
fail()  { printf "${R}✗${N}  %s\n" "$*" >&2; }

require() {
  local cmd="$1"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    fail "Falta '$cmd' en el PATH. Instálalo antes de continuar."
    exit 1
  fi
}

confirm() {
  local prompt="${1:-¿Continuar?} [y/N] "
  read -r -p "$prompt" ans
  [[ "$ans" =~ ^[yY](es)?$ ]]
}

# --- preflight ------------------------------------------------------------

require node
require npm

NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if (( NODE_MAJOR < 18 )); then
  fail "Necesitas Node >= 18 (tienes $(node -v))."
  exit 1
fi

if ! command -v claude >/dev/null 2>&1; then
  warn "La CLI 'claude' (Claude Code) no está instalada — algunas instalaciones requieren la CLI."
  warn "Instala desde: https://claude.com/claude-code"
fi

# --- parse args -----------------------------------------------------------

WANT_N8N=0 WANT_MEM=0 WANT_UIPRO=0 WANT_ECC=0 WANT_FRAMER=0
INTERACTIVE=1

for arg in "$@"; do
  INTERACTIVE=0
  case "$arg" in
    --all)            WANT_N8N=1; WANT_MEM=1; WANT_UIPRO=1; WANT_ECC=1; WANT_FRAMER=1 ;;
    --n8n)            WANT_N8N=1 ;;
    --claude-mem)     WANT_MEM=1 ;;
    --uipro)          WANT_UIPRO=1 ;;
    --ecc)            WANT_ECC=1 ;;
    --framer-motion)  WANT_FRAMER=1 ;;
    -h|--help)
      grep -E '^# ' "$0" | sed 's/^# //'
      exit 0 ;;
    *)
      fail "Flag desconocido: $arg"
      exit 1 ;;
  esac
done

if (( INTERACTIVE )); then
  printf "${B}Selecciona qué instalar:${N}\n"
  read -r -p "1. n8n-MCP                [y/N] "         a; [[ "$a" =~ ^[yY] ]] && WANT_N8N=1
  read -r -p "2. claude-mem             [y/N] "         a; [[ "$a" =~ ^[yY] ]] && WANT_MEM=1
  read -r -p "3. UI UX Pro Max (uipro)  [y/N] "         a; [[ "$a" =~ ^[yY] ]] && WANT_UIPRO=1
  read -r -p "4. Everything Claude Code [y/N] "         a; [[ "$a" =~ ^[yY] ]] && WANT_ECC=1
  read -r -p "5. framer-motion (demo)   [y/N] "         a; [[ "$a" =~ ^[yY] ]] && WANT_FRAMER=1
fi

# --- 1. n8n-MCP -----------------------------------------------------------

install_n8n() {
  info "Instalando n8n-MCP..."
  require claude

  local env_args=(
    -e MCP_MODE=stdio
    -e LOG_LEVEL=error
    -e DISABLE_CONSOLE_OUTPUT=true
  )

  if [[ -f "$ENV_FILE" ]]; then
    # shellcheck disable=SC1090
    set -a; source "$ENV_FILE"; set +a
    if [[ -n "${N8N_API_URL:-}" && -n "${N8N_API_KEY:-}" ]]; then
      info "Detectado .env con credenciales n8n — modo management activado."
      env_args+=(-e "N8N_API_URL=$N8N_API_URL" -e "N8N_API_KEY=$N8N_API_KEY")
    fi
  else
    info "Sin .env — instalando en modo solo documentación."
  fi

  if claude mcp list 2>/dev/null | grep -q '^n8n-mcp'; then
    warn "n8n-mcp ya está registrado. Quitándolo para reinstalar..."
    claude mcp remove n8n-mcp || true
  fi

  claude mcp add n8n-mcp "${env_args[@]}" -- npx -y n8n-mcp
  ok "n8n-MCP registrado."
}

# --- 2. claude-mem --------------------------------------------------------

install_claude_mem() {
  info "Instalando claude-mem..."
  npx -y claude-mem@latest install
  ok "claude-mem instalado."
}

# --- 3. UI UX Pro Max -----------------------------------------------------

install_uipro() {
  info "Instalando uipro-cli globalmente..."
  npm install -g uipro-cli
  ok "uipro-cli instalado. Úsalo dentro de tu proyecto con: uipro init --ai claude"
}

# --- 4. Everything Claude Code (ECC) --------------------------------------

install_ecc() {
  info "Instalando Everything Claude Code (manual)..."
  local target="$HOME/.local/share/ecc"
  if [[ -d "$target/.git" ]]; then
    warn "Repo ECC ya existe en $target — actualizando."
    git -C "$target" pull --ff-only
  else
    mkdir -p "$(dirname "$target")"
    git clone --depth 1 https://github.com/affaan-m/ECC.git "$target"
  fi
  (
    cd "$target"
    if [[ -f package.json ]]; then npm install; fi
    if [[ -x install.sh ]]; then
      info "Ejecutando ECC install.sh --profile full ..."
      ./install.sh --profile full
    else
      warn "ECC sin install.sh ejecutable — copia manualmente lo que necesites desde $target."
    fi
  )
  ok "ECC instalado en $target."
  info "Alternativa más limpia desde Claude Code:"
  info "  /plugin marketplace add https://github.com/affaan-m/ECC"
  info "  /plugin install ecc@ecc"
}

# --- 5. framer-motion -----------------------------------------------------

install_framer() {
  info "Instalando framer-motion en demo-react/..."
  local demo="$SCRIPT_DIR/demo-react"
  if [[ ! -f "$demo/package.json" ]]; then
    fail "No encuentro $demo/package.json. Clona el repo completo."
    return 1
  fi
  (cd "$demo" && npm install)
  ok "Demo lista. Corre con: cd demo-react && npm run dev"
}

# --- run ------------------------------------------------------------------

(( WANT_N8N ))     && install_n8n
(( WANT_MEM ))     && install_claude_mem
(( WANT_UIPRO ))   && install_uipro
(( WANT_ECC ))     && install_ecc
(( WANT_FRAMER ))  && install_framer

ok "Listo."
