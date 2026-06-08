# Rediseño ROBOT AUDIT SRI — Mockup HTML

Versión **totalmente mejorada** (un solo `index.html` autocontenido) de las pantallas del
documento `PantallasEditables.docx`. Es una **maqueta de propuesta** — no modifica la app real.

## Cómo verla
Abre `index.html` en el navegador (o `npx serve .`). Es navegable:
- **Login / Recuperar** (cerrar sesión desde el perfil arriba a la derecha).
- **Descarga** (formulario agrupado en pasos 1-4).
- **Reporte e Historial** (tabla con chips de estado y filas expandibles).
- **Consolidación** (toggles XML/PDF).
- **Ayuda** (quick-start + acordeón).
- Botón ◐ arriba: alterna **tema claro/oscuro**.

## Mejoras aplicadas (del análisis)
1. **Tema oscuro unificado** en todas las pantallas (antes la landing era clara).
2. **Formularios densos agrupados** en secciones numeradas (Credenciales → Filtros → Destino → Ejecutar).
3. **Jerarquía de color:** verde como acción primaria (antes morado disperso); rojo solo para "Detener".
4. **Historial:** de 13 columnas a 6 esenciales + **chips de estado de color** + filas expandibles.
5. **Identidad consistente** (emblema robot + AUDIT IA) y tipografía con carácter (Plus Jakarta Sans).
6. **Accesibilidad:** foco visible, contraste, mostrar/ocultar contraseña, segmented controls.
