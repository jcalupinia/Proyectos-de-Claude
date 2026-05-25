# 5 herramientas gratis para Claude Code

Instalación reproducible de 5 herramientas que potencian Claude Code (y otros agentes de IA).
Las 5 vienen del reel de `@soyenriquerocha`.

| # | Herramienta | Qué hace | Tipo |
|---|---|---|---|
| 1 | [n8n-MCP](https://github.com/czlonkowski/n8n-mcp) | Da a Claude conocimiento sobre los 1239 nodos de n8n para construir workflows. | Servidor MCP |
| 2 | [claude-mem](https://github.com/thedotmack/claude-mem) | Memoria persistente entre sesiones de Claude Code. | Plugin de Claude Code |
| 3 | [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Skill con paletas, tipografías, charts y guidelines UI/UX. | Skill de Claude Code |
| 4 | [Everything Claude Code](https://github.com/affaan-m/everything-claude-code) | Sistema completo de skills, hooks, comandos y agentes optimizados. | Plugin de Claude Code |
| 5 | [framer-motion](https://www.npmjs.com/package/framer-motion) | Librería de animación para React. | Paquete npm |

## Instalación rápida

```bash
./install.sh
```

El script pregunta cuáles instalar. También admite flags:

```bash
./install.sh --all                          # instala las 5
./install.sh --n8n --claude-mem --uipro     # selecciona específicas
./install.sh --ecc --framer-motion
```

> ℹ️ Requiere `node >= 18`, `npm` y la CLI `claude` (Claude Code) ya instalada.

## Configuración opcional (n8n)

Por defecto `n8n-MCP` se instala en modo **solo documentación** (no necesita credenciales). Si quieres que Claude pueda ejecutar workflows en tu instancia n8n, copia `.env.example` a `.env` y rellena:

```bash
cp .env.example .env
# edita .env con tu URL y API key
./install.sh --n8n   # detecta el .env y lo usa
```

## Detalle por herramienta

### 1. n8n-MCP
Servidor MCP que expone documentación de 537 nodos core + 547 community nodes de n8n. Cobertura: 99% de propiedades, 63.6% docs, 87% AI-tools. Útil para que Claude genere workflows n8n con sintaxis correcta.

Instalación manual:
```bash
claude mcp add n8n-mcp \
  -e MCP_MODE=stdio \
  -e LOG_LEVEL=error \
  -e DISABLE_CONSOLE_OUTPUT=true \
  -- npx n8n-mcp
```

### 2. claude-mem
Captura cada sesión de Claude Code, la comprime con un modelo ligero y reinyecta el contexto relevante en sesiones futuras. ~10x ahorro de tokens según el repo.

Instalación manual:
```bash
npx claude-mem@latest install
```

### 3. UI UX Pro Max (uipro)
Base de datos buscable de 57 estilos UI, 95 paletas, 56 font pairings, 24 tipos de chart, 29 landing patterns. Se activa automáticamente cuando pides trabajo de UI/UX.

Instalación manual:
```bash
npm install -g uipro-cli
cd tu-proyecto
uipro init --ai claude
```

### 4. Everything Claude Code (ECC)
Sistema de optimización con skills, instincts, memoria, seguridad e investigación. Funciona en Claude Code, Codex, Cowork y otros harnesses.

Instalación manual (recomendada: plugin):
```
/plugin marketplace add https://github.com/affaan-m/ECC
/plugin install ecc@ecc
```

> ⚠️ Los slash commands `/plugin` solo funcionan dentro de Claude Code. El script `install.sh` usa el método manual (`git clone` + script) como alternativa.

### 5. framer-motion
Librería de animación para React. Se instala en un proyecto Node:
```bash
cd tu-proyecto-react
npm install framer-motion
```

Este repo incluye una demo lista para correr en `demo-react/`.

## Demo de framer-motion

```bash
cd demo-react
npm install
npm run dev
```

Abre `http://localhost:5173` y verás un componente animado.

## Notas

- `claude-mem`, `uipro`, `ecc` y `n8n-mcp` modifican configuración global (`~/.claude/`, `~/.config/`, npm global). El script avisa antes de cada paso.
- Si trabajas en Claude Code on the web, instalar plugins de Claude Code dentro del contenedor remoto no persiste — corre el script en tu máquina local.
