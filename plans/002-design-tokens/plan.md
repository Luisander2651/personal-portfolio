---
id: 002
title: Tokens de diseño y estilos base
spec: specs/002-design-tokens/spec.md
design: no aplica (fuente de valores designs/000-design-system/design.md)
status: approved
created: 2026-09-13
updated: 2026-09-13
---

# Plan — Tokens de diseño y estilos base

Leyenda: `[ ]` pendiente · `[x]` hecha · `[-]` obsoleta · una tarea `[ ]` con línea
**Bloqueo** está detenida por `/implement` hasta resolver una brecha.

## Resumen

Spec sin interfaz propia: las capas se adaptan a utilidades de test → tokens → fuentes →
estilos base → verificación.

| Capa | Tareas |
|------|--------|
| Utilidades de test | T01 |
| Tokens | T02, T03 |
| Fuentes | T04 |
| Estilos base | T05 |
| Movimiento e interacción | — (no aplica) |
| Verificación final | T06 |

## Cobertura de criterios

| Criterio | Tareas |
|----------|--------|
| CA-1.1 | T02, T03 |
| CA-1.2 | T03 |
| CA-1.3 | T03 |
| CA-1.4 | T03 |
| CA-2.1 | T02 |
| CA-3.1 | T02, T04 |
| CA-3.2 | T04, T06 |
| CA-3.3 | T04 |
| CA-4.1 | T05 |
| CA-4.2 | T05 |
| CA-4.3 | T05 |
| CA-4.4 | T05 |
| CA-4.5 | T05, T06 |

## Tareas

### [x] T01 — Utilidades de test para tokens y contraste

- **Criterios**: — (soporte de CA-1.1 a CA-2.1)
- **Diseño**: — (formato de "Convenciones de tokens" de `designs/000-design-system/design.md`)
- **Archivos**: `tests/helpers/design-tokens.ts`, `tests/helpers/css-tokens.ts`,
  `tests/helpers/contrast.ts`, `tests/helpers/helpers.test.ts` (crear)
- **Qué hacer**:
  - `design-tokens`: lee el contenido de `design.md` y devuelve cada fila de las tablas de
    tokens (las que empiezan por `` `--``) con `token`, `mode` (`fijo` | `fluido` | `768`),
    `mobile` y `desktop` (sin comillas invertidas; `—` como ausente).
  - `css-tokens`: lee un CSS y devuelve las custom properties declaradas por contexto:
    `:root` base, `:root` dentro de `@media (min-width: 768px)` y `:root` dentro de
    `@media (prefers-reduced-motion: reduce)`; y extrae mínimo y máximo de un `clamp()`.
  - `contrast`: luminancia relativa y ratio de contraste WCAG 2.x entre dos colores hex.
  - Todo como funciones puras, sin dependencias nuevas; los archivos se leen en los tests
    con importaciones `?raw` de Vite (sin `node:fs`).
- **Test**: con fragmentos de ejemplo, la tabla devuelve filas con los tres modos y omite
  filas que no son tokens; el CSS separa correctamente los tres contextos y el `clamp()`
  devuelve sus extremos; el contraste de `#000000`/`#FFFFFF` es 21 y el de
  `#E6EDF7`/`#05070D` redondea a 17.1.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.

### [x] T02 — Tokens fijos y contraste

- **Criterios**: CA-1.1 (tokens `fijo`), CA-2.1, CA-3.1 (referencias de `--font-sans` / `--font-mono`)
- **Diseño**: — (tablas de `design.md`, modo `fijo`)
- **Archivos**: `src/styles/tokens.css` (crear), `tests/styles/tokens.test.ts` (crear)
- **Qué hacer**:
  - Declarar en `:root` los 100 tokens `fijo` con el valor literal exacto de `design.md`
    (incluidos `--font-sans: var(--font-geist)` y `--font-mono: var(--font-geist-mono)`).
  - `tokens.css` no declara las variables generadas por la carga de fuentes.
- **Test**: cada token `fijo` de `design.md` existe en `:root` con el mismo valor; ningún
  token de `tokens.css` falta en `design.md`; contraste calculado con los valores de
  `tokens.css`: `--color-text`, `--color-text-secondary`, `--color-text-muted`,
  `--color-link`, `--color-warning`, `--color-success` ≥ 4.5 sobre `--color-bg` y
  `--color-surface`; `--color-on-accent` ≥ 4.5 sobre `--color-accent`; `--color-tag-text`
  ≥ 4.5 sobre `--color-tag-bg`; `--color-glow` ≥ 3 sobre `--color-bg`.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.

### [ ] T03 — Tokens fluidos, de breakpoint y reduced motion

- **Criterios**: CA-1.1 (completo), CA-1.2, CA-1.3, CA-1.4
- **Diseño**: — (tablas de `design.md`, modos `fluido` y `768`; "Convenciones de tokens")
- **Archivos**: `src/styles/tokens.css` (modificar), `tests/styles/tokens.test.ts` (modificar)
- **Qué hacer**:
  - Tokens `fluido` (9): `clamp()` con mínimo = valor móvil, máximo = valor escritorio e
    interpolación lineal entre viewports de 390px y 1440px.
  - Tokens `768` (11): valor móvil en `:root`; valor escritorio en `:root` dentro de
    `@media (min-width: 768px)`.
  - `@media (prefers-reduced-motion: reduce)`: todos los `--duration-*` y `--stagger` a `0ms`.
- **Test**: todos los tokens de `design.md` existen en `tokens.css` (CA-1.1 completo);
  cada `fluido` es un `clamp()` cuyos extremos son móvil y escritorio; cada `768` vale
  móvil en `:root` y escritorio en el bloque de 768px; el bloque de reduced motion pone a
  `0ms` exactamente todos los tokens `--duration-*` y `--stagger`.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.

### [ ] T04 — Fuentes autoalojadas

- **Criterios**: CA-3.1, CA-3.2, CA-3.3
- **Diseño**: — (sección "Carga de fuentes" de `design.md`)
- **Archivos**: `astro.config.mjs` (modificar), `src/layouts/BaseLayout.astro` (modificar),
  `tests/styles/fonts.test.ts` (crear), `tests/project-setup.test.ts` (modificar)
- **Qué hacer**:
  - Configurar la API de fuentes de Astro con el proveedor Google para Geist
    (`cssVariable` `--font-geist`, pesos 400/500/600) y Geist Mono (`--font-geist-mono`,
    pesos 400/500), estilo normal, subconjunto latino, `display: swap` y los fallbacks de
    `design.md` en orden.
  - Añadir el componente `Font` de Astro en el `<head>` de `BaseLayout` para ambas
    variables; precarga solo de Geist 400.
  - Sin dependencias nuevas.
- **Test**: la configuración de Astro declara exactamente esas dos familias con su
  variable, pesos, `swap` y fallbacks en orden; `package.json` mantiene exactamente las
  dependencias de la spec 001 (`astro`; dev: `@astrojs/check`, `typescript`, `vitest`);
  el test existente de `BaseLayout` sigue en verde (sin `<script>`).
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde (el build necesita red la primera vez).
  - Revisión de `dist/`: `@font-face` de Geist y Geist Mono con `font-display: swap`,
    archivos de fuente servidos desde el propio sitio y ninguna referencia a
    `fonts.googleapis.com` ni `fonts.gstatic.com`.

### [ ] T05 — Estilos base globales

- **Criterios**: CA-4.1, CA-4.2, CA-4.3, CA-4.4, CA-4.5
- **Diseño**: secciones "Estilos base" y "Fondo de página" de `design.md`; artboards
  `A · Luz en la oscuridad — Sistema · escritorio` y `A · Luz en la oscuridad — Móvil`
  (fondo y tipografía)
- **Archivos**: `src/styles/base.css` (crear), `src/layouts/BaseLayout.astro` (modificar),
  `tests/styles/base.test.ts` (crear)
- **Qué hacer**:
  - `base.css`: `color-scheme: dark`; `body` con fondo de página (`--page-halo`, líneas de
    `--border-width` en `--color-grid-line` cada `--grid-size`, `--color-bg`),
    `--color-text`, `--font-sans` y `--text-body-*`; `h1`, `h2`, `h3`, `p`, `small`, `code`
    con todos los tokens de su nivel (`code` con `--font-mono`); enlaces con `--color-link`
    y `--color-link-hover`; `:focus-visible` con `--focus-ring` y `--focus-ring-offset`;
    selección con `--color-selection-bg` y `--color-selection-text`.
  - Solo tokens: ningún valor literal de color, tamaño, espaciado o duración.
  - `BaseLayout` importa `tokens.css` y `base.css` como estilos globales.
- **Test**: `base.css` declara cada regla anterior referenciando exactamente esos tokens;
  no contiene colores ni tamaños literales; el test de `BaseLayout` sigue sin `<script>`.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - `dist/index.html` sigue sin JavaScript de cliente.
  - Comprobación manual en Chrome a 390px y 1440px: fondo con halo y grid, texto en Geist
    con color `--color-text`, coherente con el fondo y la tipografía de los artboards de
    la dirección A.

### [ ] T06 — Verificación final

- **Criterios**: todos
- **Diseño**: fondo y tipografía de los artboards de la dirección A
- **Archivos**: —
- **Qué hacer**: verificación completa de la spec.
- **Test**: cada CA tiene cobertura:
  - CA-1.1 → `tests/styles/tokens.test.ts`
  - CA-1.2, CA-1.3, CA-1.4 → `tests/styles/tokens.test.ts`
  - CA-2.1 → `tests/styles/tokens.test.ts`
  - CA-3.1 → `tests/styles/tokens.test.ts` + `tests/styles/fonts.test.ts` + revisión de `dist/`
  - CA-3.2 → revisión de `dist/`
  - CA-3.3 → `tests/project-setup.test.ts`
  - CA-4.1 a CA-4.4 → `tests/styles/base.test.ts`
  - CA-4.5 → `tests/layouts/base-layout.test.ts` + revisión de `dist/`
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - `dist/`: estilos globales aplicados, fuentes autoalojadas con `swap`, ninguna
    referencia a dominios externos de fuentes o estilos, sin JavaScript de cliente.
  - Reduced motion (DevTools → Rendering): los tokens `--duration-*` y `--stagger`
    computan `0ms`.
  - Foco visible: el anillo `--focus-ring` se aplica a un elemento enfocable de prueba en
    DevTools (la página actual no tiene interactivos).
  - Revisión visual en Chrome a 390px y 1440px contra los artboards de la dirección A.
  - Lighthouse ≥ 90 en todas las categorías (DevTools sobre `bun run preview`).

## Registro de decisiones

| Fecha | Tipo | Decisión | Motivo |
|-------|------|----------|--------|
| 2026-09-13 | Creación | Plan inicial de 6 tareas | — |
| 2026-09-13 | Bloqueo resuelto | Antes de planificar se refinaron `design.md` (tokens de fuente) y la spec (CA-3.1, CA-4.4) | Contradicción con la API de fuentes de Astro y tokens renombrados; aplicado a petición del usuario |
| 2026-09-13 | Planificación | Utilidades de lectura de tokens y contraste en `tests/helpers/` con sus propios tests | Son código de test, no lógica del sitio |
| 2026-09-13 | Planificación | Proveedor de fuentes: Google, vía la API de fuentes de Astro | Geist está disponible; la API descarga y autoaloja en el build |
| 2026-09-13 | Planificación | Precarga solo de Geist 400 | Limitar peticiones precargadas (Lighthouse ≥ 90) |
| 2026-09-13 | Planificación | Estilos en `src/styles/tokens.css` y `src/styles/base.css`, importados desde `BaseLayout` | Separar tokens de reglas base |
| 2026-09-13 | Planificación | CA-3.2 se verifica revisando `dist/` en T04 y T06 | Los tests no dependen del build (mismo criterio que la spec 001) |
| 2026-09-13 | Planificación | Contraste probado en T02 junto a los colores | Un test solo de contraste pasaría sin implementación (TDD) |
| 2026-09-13 | Implementación (T02) | `vitest.config.ts` modificado (archivo no listado, autorizado por el usuario): `test.css.include` para `src/styles/*.css` | Vitest vacía los CSS importados con `?raw` por defecto; T05 también lo necesita para `base.css` |
