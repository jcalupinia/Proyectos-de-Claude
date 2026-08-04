# install-lenovo.ps1 — Instala TODO en un Lenovo con Windows, de forma automática.
#
# Qué instala:
#   1. Node.js LTS        (base para MCP y Claude Code)
#   2. Git                (base para skills)
#   3. Claude Desktop     (app de chat + MCP)
#   4. Claude Code (CLI)  (para programar + skills)
#   5. Config de MCP      (Context7 + Pensamiento Secuencial)
#
# Uso (en PowerShell):
#   .\install-lenovo.ps1
#
# Si Windows bloquea el script, primero corre esto una vez:
#   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

$ErrorActionPreference = "Stop"

function Info($m) { Write-Host "==> $m" -ForegroundColor Cyan }
function Ok($m)   { Write-Host "OK  $m"  -ForegroundColor Green }
function Warn($m) { Write-Host "!   $m"  -ForegroundColor Yellow }
function Fail($m) { Write-Host "X   $m"  -ForegroundColor Red }

Write-Host ""
Write-Host "==============================================" -ForegroundColor Magenta
Write-Host "  Instalador automatico para Lenovo (Windows)" -ForegroundColor Magenta
Write-Host "==============================================" -ForegroundColor Magenta
Write-Host ""

# --- 0. Verificar winget --------------------------------------------------

if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    Fail "No encuentro 'winget' (el instalador de Windows)."
    Warn "winget viene con Windows 10/11 modernos. Actualiza Windows o instala"
    Warn "'App Installer' desde la Microsoft Store y vuelve a correr este script."
    exit 1
}
Ok "winget disponible."

# Helper: instala un paquete por su id de winget si no esta ya presente
function Install-Winget($id, $nombre) {
    Info "Instalando $nombre ..."
    $installed = winget list --id $id --exact 2>$null | Select-String $id
    if ($installed) {
        Ok "$nombre ya estaba instalado."
        return
    }
    winget install --id $id --exact --silent --accept-package-agreements --accept-source-agreements
    Ok "$nombre instalado."
}

# --- 1. Node.js -----------------------------------------------------------

Install-Winget "OpenJS.NodeJS.LTS" "Node.js LTS"

# --- 2. Git ---------------------------------------------------------------

Install-Winget "Git.Git" "Git"

# --- 3. Claude Desktop ----------------------------------------------------

Install-Winget "Anthropic.Claude" "Claude Desktop"

# Refrescar PATH para que 'npm' y 'node' esten disponibles en esta sesion
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
            [System.Environment]::GetEnvironmentVariable("Path", "User")

# --- 4. Claude Code (CLI) -------------------------------------------------

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Warn "npm todavia no aparece en el PATH de esta ventana."
    Warn "Cierra PowerShell, abrelo de nuevo y vuelve a correr el script para el paso de Claude Code."
} else {
    Info "Instalando Claude Code (CLI) ..."
    npm install -g "@anthropic-ai/claude-code"
    Ok "Claude Code instalado. Escribe 'claude' en una carpeta para usarlo."
}

# --- 5. Config de MCP para Claude Desktop ---------------------------------

Info "Configurando MCP (Context7 + Pensamiento Secuencial) en Claude Desktop ..."

$claudeDir  = Join-Path $env:APPDATA "Claude"
$configPath = Join-Path $claudeDir "claude_desktop_config.json"

if (-not (Test-Path $claudeDir)) {
    New-Item -ItemType Directory -Path $claudeDir -Force | Out-Null
}

# Los dos servidores MCP que queremos.
# En Windows usamos "cmd /c npx" porque algunas versiones de Claude Desktop
# no resuelven npx directamente (npx es un .cmd). Esta forma es la mas confiable.
$nuevosServers = @{
    "context7" = @{
        command = "cmd"
        args    = @("/c", "npx", "-y", "@upstash/context7-mcp")
    }
    "sequential-thinking" = @{
        command = "cmd"
        args    = @("/c", "npx", "-y", "@modelcontextprotocol/server-sequential-thinking")
    }
}

# Si ya existe config, la fusionamos para no borrar lo que el usuario tenga
if (Test-Path $configPath) {
    Warn "Ya existe una config de Claude Desktop. La fusiono sin borrar lo tuyo."
    try {
        $config = Get-Content $configPath -Raw | ConvertFrom-Json
    } catch {
        Warn "La config existente no era JSON valido. Hago respaldo y creo una nueva."
        Copy-Item $configPath "$configPath.bak" -Force
        $config = [PSCustomObject]@{}
    }
} else {
    $config = [PSCustomObject]@{}
}

# Asegurar que exista la propiedad mcpServers
if (-not ($config.PSObject.Properties.Name -contains "mcpServers")) {
    $config | Add-Member -MemberType NoteProperty -Name "mcpServers" -Value ([PSCustomObject]@{})
}

foreach ($nombre in $nuevosServers.Keys) {
    $valor = [PSCustomObject]$nuevosServers[$nombre]
    if ($config.mcpServers.PSObject.Properties.Name -contains $nombre) {
        $config.mcpServers.$nombre = $valor
    } else {
        $config.mcpServers | Add-Member -MemberType NoteProperty -Name $nombre -Value $valor
    }
}

$config | ConvertTo-Json -Depth 10 | Set-Content -Path $configPath -Encoding UTF8
Ok "Config MCP escrita en: $configPath"

# --- Cierre ---------------------------------------------------------------

Write-Host ""
Ok "Instalacion terminada."
Write-Host ""
Write-Host "Que sigue (hazlo tu, es rapido):" -ForegroundColor Cyan
Write-Host "  1. Abre Claude Desktop e inicia sesion con tu cuenta."
Write-Host "  2. Cierra Claude Desktop por completo y abrelo de nuevo"
Write-Host "     (para que cargue Context7 y Pensamiento Secuencial)."
Write-Host "  3. Para las skills de programar, abre PowerShell en una carpeta y escribe:"
Write-Host "        claude"
Write-Host "     Dentro de Claude Code ya tienes /simplify (Simplificador de codigo)."
Write-Host "     Y para find-skills:"
Write-Host "        npx skills add https://github.com/vercel-labs/skills --skill find-skills"
Write-Host ""
