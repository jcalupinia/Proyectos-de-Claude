# CLAUDE.md

Este archivo proporciona guía a Claude Code (claude.ai/code) cuando trabaja con código en este repositorio.

## Propósito del repositorio

Repositorio complementario al reel de `@soyenriquerocha` que lista 5 herramientas gratuitas que extienden Claude Code. Incluye:

- `install.sh` — instalador en Bash que integra esas 5 herramientas en la configuración local de Claude Code del usuario.
- `demo-react/` — app mínima en Vite + React 18 que demuestra la herramienta framer-motion de la lista.

El repo en sí no es una librería ni un producto — no hay suite de tests, ni configuración de lint, ni CI. Los cambios casi siempre son al instalador, al README (en español) o a la demo.

## Comandos comunes

Instalador (ejecutar desde la raíz del repo):

```bash
./install.sh                              # menú interactivo
./install.sh --all                        # instala las 5
./install.sh --n8n --claude-mem --uipro   # subconjunto (flags: --n8n --claude-mem --uipro --ecc --framer-motion)
./install.sh -h                           # ayuda (parseada del bloque inicial `# `)
```

Requiere `node >= 18`, `npm` y la CLI `claude` en el PATH (solo `--n8n` exige `claude` obligatoriamente; las demás solo avisan).

App de demo (`demo-react/`):

```bash
cd demo-react
npm install        # o `../install.sh --framer-motion` desde la raíz del repo
npm run dev        # servidor de desarrollo de vite en :5173
npm run build      # build de producción
npm run preview    # sirve el bundle ya compilado
```

## Notas de arquitectura

### Estructura de `install.sh`

Un instalador por herramienta, cada uno como su propia función `install_X` (`install_n8n`, `install_claude_mem`, `install_uipro`, `install_ecc`, `install_framer`). El final del archivo invoca cada función condicionada a una bandera `WANT_*` que se asigna durante el parseo de argumentos o el prompt interactivo. Para añadir una herramienta hay que agregar: un flag en el bloque `case` de `for arg in "$@"`, un prompt en el bloque `INTERACTIVE`, una función `install_X` y una llamada condicionada al final.

El script usa `set -euo pipefail`, helpers de logging con colores `info`/`ok`/`warn`/`fail`, y un helper de preflight `require <cmd>`. Reusa estos en vez de inlinear nuevos logs o checks de `command -v`.

### Manejo de `.env` para n8n-MCP

`install_n8n` busca `./.env` (gitignored) y, si `N8N_API_URL` + `N8N_API_KEY` están definidas, registra n8n-MCP en **modo management** (Claude puede ejecutar workflows en una instancia real de n8n). Sin `.env` cae al **modo solo documentación**. `.env.example` documenta las variables. Antes de reinstalar, elimina cualquier registro existente de `n8n-mcp` con `claude mcp remove` para evitar registros duplicados.

### Modificaciones fuera del repo

El instalador escribe en el estado global del usuario — `~/.claude/`, `~/.config/`, npm global (`npm install -g uipro-cli`) y `~/.local/share/ecc` (git clone de ECC). Al cambiar el comportamiento del instalador, recuerda que estos efectos colaterales no están contenidos en el repo y no se deshacen con `git`. ECC tiene una alternativa con `/plugin` mencionada en el README; el script usa la ruta manual con `git clone` porque `/plugin` solo funciona dentro de Claude Code.

### Sesiones remotas (Web)

Los plugins/skills instalados dentro de un contenedor de Claude Code on the web no persisten — el contenedor es efímero. El README y el instalador asumen que el usuario corre `install.sh` en su máquina local. No agregues features que dependan de persistencia dentro del contenedor web.

### `demo-react/`

Demo autocontenida de Vite + React 18 + framer-motion. Un solo componente (`src/App.jsx`) que muestra `motion.*`, `AnimatePresence` y animación de layout compartido vía `layoutId`. Sin router, sin gestión de estado, sin tests. Existe para que `framer-motion` quede ejecutable en un solo paso después del instalador.

## Convenciones

- Los strings del README y del instalador dirigidos al usuario están en español; respétalo al editarlos. Los identificadores de código se quedan en inglés.
- Los commits hasta ahora siguen sujetos cortos en imperativo en inglés (`Add installer and demo for 5 free Claude tools`).
- `.env` está en `.gitignore`; nunca commitees credenciales. `.env.example` es la plantilla.
