#!/usr/bin/env bash
# Configura el 21st.dev "Magic" MCP — PASO 4 del combo (video de @duncanrogoff).
#
# IMPORTANTE: 21st.dev es un servicio en vivo (genera componentes con IA llamando a su API).
# En el entorno remoto de Claude Code on the web su dominio está bloqueado por la política de
# red, así que este MCP SOLO funciona en tu máquina LOCAL.
#
# Uso (en tu computadora, dentro del repo):
#   ./scripts/setup-21st-local.sh TU_API_KEY
# o:
#   export TWENTY_FIRST_API_KEY=tu_key && ./scripts/setup-21st-local.sh
#
# ¿De dónde sale la API key? Gratis en: https://21st.dev/magic/console
set -euo pipefail

KEY="${1:-${TWENTY_FIRST_API_KEY:-}}"

if [[ -z "$KEY" ]]; then
  echo "✗ Falta la API key de 21st.dev."
  echo "  1) Crea cuenta y copia tu key en: https://21st.dev/magic/console"
  echo "  2) Ejecuta: $0 TU_API_KEY"
  exit 1
fi

# Aviso si se ejecuta por error en el entorno remoto.
if [[ -d /opt/pw-browsers ]]; then
  echo "⚠️  Parece que estás en el entorno remoto (Claude Code on the web)."
  echo "    21st.dev está bloqueado por la red aquí; esto solo funciona en tu máquina local."
  echo ""
fi

if ! command -v claude >/dev/null 2>&1; then
  echo "✗ No encuentro la CLI 'claude' (Claude Code). Instálala primero."
  exit 1
fi

# Registrar el MCP a nivel de usuario para que la API key NO quede en el repo (es un secreto).
claude mcp add magic -s user -e API_KEY="$KEY" -- npx -y @21st-dev/magic@latest

echo ""
echo "✅ 21st.dev Magic MCP configurado (alcance: user)."
echo "   Reinicia Claude Code y pídele, por ejemplo:"
echo '   "Usa 21st.dev para crear un hero section moderno con un botón animado."'
