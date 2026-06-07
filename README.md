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

---

# Combo WEB de Claude para diseñar

Segundo combo del reel de `@soyenriquerocha` ("Mi combo WEB de Claude para diseñar").
Son 4 herramientas pensadas para **diseñar y construir páginas web** con Claude.
Ya están instaladas/configuradas en este repo.

| # | Herramienta | Qué hace | Tipo |
|---|---|---|---|
| 1 | [Frontend Design](https://github.com/anthropics/skills/tree/main/frontend-design) | Skill oficial de Anthropic que hace que Claude diseñe interfaces con criterio (tipografía, paletas, animaciones) y evite el look genérico de "AI slop". | Skill |
| 2 | [Magic UI MCP](https://magicui.design/docs/mcp) | Da a Claude acceso directo a todos los componentes animados de Magic UI para generarlos sin errores. | Servidor MCP |
| 3 | [shadcn MCP](https://ui.shadcn.com/docs/mcp) | Permite a Claude buscar e instalar componentes de shadcn/ui (y otros registros) en lenguaje natural. | Servidor MCP |
| 4 | [Playwright MCP](https://github.com/microsoft/playwright-mcp) | Da a Claude control de un navegador real para ver, probar y depurar la web que construye. | Servidor MCP |

## Cómo quedó instalado

- **Frontend Design** → skill en `.agents/skills/frontend-design` (con symlink en `.claude/skills/`).
- **Magic UI / shadcn / Playwright** → definidos en [`.mcp.json`](./.mcp.json) (alcance de proyecto). La primera vez que abras `claude` te pedirá **aprobar** estos 3 servidores MCP; acepta y quedan activos.
- **Playwright** usa el wrapper [`scripts/playwright-mcp.sh`](./scripts/playwright-mcp.sh), que autodetecta el Chromium pre-instalado en el entorno (`/opt/pw-browsers/...`) con `--no-sandbox --ignore-https-errors`. En una máquina local cae al modo estándar (`--browser chromium`).

## Estado real verificado (entorno Claude Code on the web)

Probé los 3 MCP en vivo. Estado en este entorno remoto:

| MCP | Estado | Nota |
|---|:---:|---|
| **shadcn** | ✅ funciona | Devuelve el registro `@shadcn`, busca e instala componentes. |
| **Playwright** | ✅ funciona | Lanza Chromium, renderiza y toma screenshots. Para sitios HTTPS externos usa `--ignore-https-errors` (el entorno tiene un proxy TLS). Ideal para revisar tus páginas en `localhost`. |
| **Magic UI** | ⚠️ limitado | El server arranca, pero `magicui.design` devuelve **403** desde este sandbox (la **política de red** del entorno no tiene ese dominio en el allowlist). Funcionará en tu máquina local o si se amplía el allowlist de red. |

> **Sobre la red del entorno remoto:** este sandbox bloquea dominios fuera de su allowlist
> (`magicui.design` y `cdn.playwright.dev` dan 403). Por eso el Chromium se autodetecta del
> pre-instalado en vez de descargarse, y Magic UI no puede bajar su registro aquí.
> La política de red se elige al crear el entorno — ver
> [docs](https://code.claude.com/docs/en/claude-code-on-the-web).

## Instalación manual (en otra máquina/proyecto)

```bash
# 1. Skill Frontend Design
npx skills add https://github.com/anthropics/skills --skill frontend-design

# 2. Magic UI MCP
npx @magicuidesign/cli@latest install claude

# 3. shadcn MCP
npx shadcn@latest mcp init --client claude

# 4. Playwright MCP (+ navegador)
claude mcp add playwright npx @playwright/mcp@latest
npx playwright install chromium
```

> En este repo los 3 MCP se dejaron directamente en `.mcp.json` para que la configuración
> sea **permanente y versionada**, en lugar de quedar solo en el config local del entorno
> (que es efímero en Claude Code on the web).

## Cómo usarlo

Una vez aprobados los MCP, simplemente pídele a Claude algo como:

> "Diséñame una landing page para una startup de seguridad con modo oscuro,
> usa componentes de shadcn y Magic UI, y ábrela en el navegador para revisarla."

Claude activará el skill de diseño, traerá componentes vía los MCP de Magic UI / shadcn,
y usará Playwright para abrir y verificar el resultado.

## Recursos extra (video de `@duncanrogoff`)

Otros videos sobre "sitios web con IA" muestran recursos que se solapan con los combos de
arriba. Estado en este repo:

| Recurso | Qué aporta | Estado |
|---|---|:---:|
| [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Skill con 57 estilos UI, 95 paletas, 56 font pairings, charts y landing patterns. | ✅ instalado en `.claude/skills/ui-ux-pro-max` |
| [Framer Motion](https://www.npmjs.com/package/framer-motion) | Librería de animación para React (demo en `demo-react/`). | ✅ instalado en la demo |
| [21st.dev](https://21st.dev/community/components) | Galería de componentes React de la comunidad + Magic MCP para generarlos. | ⚙️ opcional — el MCP requiere API key gratuita de 21st.dev |

> **21st.dev Magic MCP** (`@21st-dev/magic`) necesita una API key gratuita que se obtiene
> creando cuenta en [21st.dev](https://21st.dev). Si la consigues, se añade con:
> ```bash
> claude mcp add magic -e API_KEY=tu_key -- npx -y @21st-dev/magic@latest
> ```
