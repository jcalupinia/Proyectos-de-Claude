#!/usr/bin/env bash
# Wrapper para el Playwright MCP server.
# Autodetecta el Chromium pre-instalado en este entorno remoto (Claude Code on the web),
# donde cdn.playwright.dev está bloqueado y no se pueden descargar navegadores nuevos.
# En una máquina local normal cae al modo estándar (--browser chromium).
set -euo pipefail

# Buscar el Chromium pre-seedeado por el entorno (el build más alto disponible).
CHROME="$(ls -d /opt/pw-browsers/chromium-*/chrome-linux/chrome 2>/dev/null | sort -V | tail -1 || true)"

if [[ -n "$CHROME" && -x "$CHROME" ]]; then
  exec npx -y @playwright/mcp@latest \
    --executable-path "$CHROME" \
    --no-sandbox \
    --ignore-https-errors "$@"
else
  # Máquina local: usa el chromium que Playwright instala normalmente.
  exec npx -y @playwright/mcp@latest --browser chromium "$@"
fi
