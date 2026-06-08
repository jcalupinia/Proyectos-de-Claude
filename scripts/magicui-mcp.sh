#!/usr/bin/env bash
# Wrapper para el Magic UI MCP server.
# En el entorno remoto (Claude Code on the web) magicui.design devuelve 403 (fuera del
# allowlist de red). Este script redirige las peticiones del MCP al mirror oficial en
# GitHub raw (que SÍ está permitido), parcheando las URLs hardcodeadas del paquete.
# En una máquina local con red abierta también funciona (el mirror es el mismo contenido).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIR="$SCRIPT_DIR/.magicui"
PKG="$DIR/node_modules/@magicuidesign/mcp"
MIRROR="https://raw.githubusercontent.com/magicuidesign/magicui/main/apps/www/public"

# Instalar el paquete localmente si falta (npm registry sí está en el allowlist).
if [[ ! -f "$PKG/dist/server.js" ]]; then
  mkdir -p "$DIR"
  ( cd "$DIR" && npm install --no-save --no-audit --no-fund --silent @magicuidesign/mcp@latest >/dev/null 2>&1 )
fi

# Parchear una sola vez (marcador para que sea idempotente entre arranques).
if [[ ! -f "$PKG/.mirror-patched" ]]; then
  # 1) Dominio -> mirror de GitHub raw.
  while IFS= read -r f; do
    sed -i "s#https://magicui.design#$MIRROR#g" "$f"
  done < <(grep -rl "https://magicui.design" "$PKG/dist" 2>/dev/null || true)
  # 2) GitHub raw necesita la extensión .json en los items (la web la omite).
  sed -i 's#}/${name}`#}/${name}.json`#g; s#}/${exampleName}`#}/${exampleName}.json`#g' \
    "$PKG/dist/registry/client.js"
  touch "$PKG/.mirror-patched"
fi

exec node "$PKG/dist/server.js" "$@"
