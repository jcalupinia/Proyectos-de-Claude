# 🖥️ Instalación en Lenovo (Windows) — Guía completa

Esta guía instala **todo** lo que salía en los 5 reels, en tu Lenovo con Windows.

> ⚠️ **Importante:** nadie puede instalar esto en tu Lenovo *de forma remota por ti*.
> Claude en la nube no tiene acceso a tu computadora física. Lo que sí existe es
> este **script automático**: tú pegas una línea y él hace el resto.

---

## ✅ La forma fácil (recomendada): el script automático

1. En tu Lenovo, abre **PowerShell** (botón Inicio → escribe `PowerShell` → Enter).
2. Descarga este repositorio (o solo el archivo `install-lenovo.ps1`).
3. Corre estas dos líneas:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\install-lenovo.ps1
```

El script instala solo:

- ✅ Node.js LTS
- ✅ Git
- ✅ Claude Desktop
- ✅ Claude Code (CLI)
- ✅ Configuración de MCP: **Context7** + **Pensamiento Secuencial**

Cuando termine, sigue las 3 instrucciones finales que imprime en pantalla.

---

## 🔧 La forma manual (por si el script falla)

### Bloque 1 — Base
- **Node.js** → https://nodejs.org → botón **LTS** → instalar por defecto.
- **Git** → https://git-scm.com/download/win → instalar por defecto.
- Reiniciar el Lenovo.

### Bloque 2 — Claude Desktop (reels #2 y #3)
1. https://claude.ai/download → descargar **Windows** → instalar.
2. Abrir Claude → iniciar sesión.
3. **Settings → Developer → Edit Config** → pegar y guardar:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

4. Cerrar Claude **por completo** y volver a abrir.

### Bloque 3 — Claude Code (reels #1, #4, #5)
```powershell
npm install -g @anthropic-ai/claude-code
cd Documents
claude
```

### Bloque 4 — Skills dentro de Claude Code
- **#1 find-skills:**
  ```
  npx skills add https://github.com/vercel-labs/skills --skill find-skills
  ```
- **#4 Simplificador de código:** ya viene incluido → escribe `/simplify`.
- **#5 The Agency:** confirmar el repositorio real antes de instalar.

---

## 📋 Checklist rápida

- [ ] Node.js instalado
- [ ] Git instalado
- [ ] Claude Desktop instalado y con sesión iniciada
- [ ] MCP Context7 funcionando
- [ ] MCP Pensamiento Secuencial funcionando
- [ ] Claude Code (CLI) instalado
- [ ] `/simplify` disponible
- [ ] find-skills instalado

---

## ❓ Diferencia clave (para no confundirte)

| Producto | Qué es | Herramientas de los reels |
|---|---|---|
| **Claude Desktop** | App de chat con MCP | #2 Pensamiento Secuencial, #3 Context7 |
| **Claude Code** | Herramienta para programar (skills) | #1 find-skills, #4 Simplificador, #5 The Agency |

Son **dos apps distintas**. Por eso instalamos ambas.
