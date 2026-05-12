# Plan de estilos (globals.css)

## Información reunida
- Ya existe `app/globals.css` con: reset/base, variables CSS, estilos para header, botones, navegación, cards, tabla, inputs inline, grids de edición, modal y `@media print` (excel).
- La app usa un set de clases existentes (p.ej. `main-header`, `btn-premium-add`, `area-navigation`, `premium-table`, `inp-table-add`, `modal-overlay`, etc.).

## Plan
- Mantener todas las clases existentes y su compatibilidad.
- Hacer refactor visual: mejoras de tipografía, accesibilidad (focus-visible), consistencia de espaciados, estados hover/active, sombras/bordes más modernos.
- Introducir un sistema de utilidades globales sutiles (sin requerir cambios en TSX):
  - Estilos para `a`, `button:disabled`, `select/textarea` (si aparecen).
  - Mejora de tablas (bordes, zebra, sticky header opcional en screen).
  - Estilos para contenedores genéricos (`.card`, `.section-title`) sin afectar.
- Asegurar que `@media print` quede intacto (no tocar reglas de Excel salvo ajustes menores si fueran necesarios).
- Reemplazar completamente `app/globals.css` por una versión más profesional.

## Archivos dependientes
- `app/globals.css` (solo este).

## Followup steps
- Ejecutar `npm run dev` y revisar UI.
- Probar impresión para confirmar que el formato Excel no cambia.

