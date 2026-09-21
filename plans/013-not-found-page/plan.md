---
id: 013
title: Página 404
spec: specs/013-not-found-page/spec.md
design: designs/013-not-found-page/design.md
status: approved
created: 2026-09-19
updated: 2026-09-19
---

# Plan — Página 404

Leyenda: `[ ]` pendiente · `[x]` hecha · `[-]` obsoleta · una tarea `[ ]` con línea
**Bloqueo** está detenida por `/implement` hasta resolver una brecha.

## Resumen

| Capa | Tareas |
|------|--------|
| Sistema, datos y layout | T01 |
| Estructura estática | T02 |
| Estilos | T03 |
| Movimiento | T04 |
| Verificación final | T05 |

## Cobertura de criterios

| Criterio | Tareas |
|----------|--------|
| CA-1.1 | T01, T02, T05 |
| CA-1.2 | T02 |
| CA-1.3 | T02 |
| CA-1.4 | T05 |
| CA-2.1 | T01, T02 |
| CA-2.2 | T01 |
| CA-3.1 | T04 |
| CA-3.2 | T04, T05 |
| CA-3.3 | T03 |
| CA-3.4 | T05 |

## Tareas

### [x] T01 — Tokens, título y `head` común

- **Criterios**: CA-1.1, CA-2.1, CA-2.2
- **Diseño**: `designs/013-not-found-page/design.md` → Cambios a incorporar al sistema
- **Archivos**: `designs/000-design-system/design.md` (modificar), `src/styles/tokens.css`
  (modificar), `src/lib/page-meta.ts` (modificar), `tests/lib/page-meta.test.ts` (modificar),
  `src/layouts/BaseLayout.astro` (modificar), `src/components/SeoHead.astro` (modificar),
  `tests/layouts/base-layout.test.ts` (modificar), `tests/components/seo-head.test.ts`
  (modificar)
- **Qué hacer**:
  - Sistema de diseño y `tokens.css`: `--not-found-code-size` (fluido, `112px` → `208px`) y
    `--shadow-glow-text` (`0 0 60px rgba(34, 211, 238, 0.45), 0 0 18px rgba(34, 211, 238,
    0.25)`), con su entrada en el registro del sistema.
  - `page-meta.ts`: `getNotFoundMeta`, que devuelve el título "Página no encontrada —
    {nombre}" y la descripción "La ruta que buscas no existe o se ha movido.".
  - `BaseLayout`: los enlaces de iconos (`/favicon.svg`, `/favicon-32.png`,
    `/apple-touch-icon.png`) y `theme-color` pasan aquí desde `SeoHead`, en todas las páginas;
    prop opcional `noindex` que añade `<meta name="robots" content="noindex">`.
  - `SeoHead`: se queda con la canónica, Open Graph y JSON-LD.
- **Test**: tokens nuevos documentados y declarados con su valor (test de tokens existente);
  `getNotFoundMeta` con un nombre de prueba; `BaseLayout` enlaza los tres iconos y
  `theme-color` (igual a `--color-bg`) siempre, añade `noindex` solo con la prop y no incluye
  scripts sin `seo`; `SeoHead` ya no contiene iconos ni `theme-color`; con `seo`, la home
  sigue teniendo canónica, OG y JSON-LD.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - `dist/index.html` mantiene sus metadatos (canónica, OG, JSON-LD, iconos, `theme-color`).

### [x] T02 — Estructura de la 404 (sin JavaScript)

- **Criterios**: CA-1.1, CA-1.2, CA-1.3, CA-2.1
- **Diseño**: `A · Señal — Escritorio 1440` y `— Móvil 390` (estructura)
- **Archivos**: `src/components/SiteBrand.astro` (crear), `src/components/SiteNav.astro`
  (modificar), `src/components/BrandHeader.astro` (crear),
  `src/components/NotFoundScreen.astro` (crear), `src/pages/404.astro` (crear),
  `tests/components/not-found.test.ts` (crear)
- **Qué hacer**:
  - **`SiteBrand`**: la marca extraída de `SiteNav` (punto de luz, iniciales visibles con
    `aria-hidden` y nombre completo como texto accesible), con el destino como prop (`#top` en
    la barra, `/` en la 404); `SiteNav` pasa a usarlo sin cambiar su HTML ni sus estilos.
  - **`BrandHeader`**: `header` con solo `SiteBrand` enlazando a `/`.
  - **`NotFoundScreen`**: en orden, el "404" (texto en mono con nombre accesible "404"), el
    `h1` "Página no encontrada", el párrafo "La ruta que buscas no existe o se ha movido." y el
    enlace "Volver al inicio" a `/` con flecha decorativa.
  - **`404.astro`**: `BaseLayout` con `noindex` y `getNotFoundMeta`, sin `seo`;
    `BrandHeader`, `main` con `NotFoundScreen` y `SiteFooter` con los datos de `profile`.
- **Test** (`not-found.test.ts`): la pantalla con sus textos en orden, un único `h1` y el
  enlace a `/`; la cabecera con un solo enlace (la marca a `/`), sin lista de secciones ni
  botón; `SiteBrand` con iniciales y nombre accesible; la página usa `noindex`,
  `getNotFoundMeta`, no pasa `seo`, y renderiza `BrandHeader`, `main` y `SiteFooter` en ese
  orden; los tests existentes de `SiteNav` siguen en verde.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - `dist/404.html` generado; `dist/sitemap.xml` no la incluye.

### [x] T03 — Estilos A · Señal

- **Criterios**: CA-3.3
- **Diseño**: `A · Señal — Escritorio 1440` y `— Móvil 390` · `M-2`
- **Archivos**: `src/components/BrandHeader.astro` (modificar),
  `src/components/NotFoundScreen.astro` (modificar), `src/components/SiteBrand.astro`
  (modificar si hace falta llevar ahí los estilos de la marca), `src/components/SiteNav.astro`
  (modificar en ese caso), `tests/components/not-found-styles.test.ts` (crear)
- **Qué hacer** (tokens, mobile-first, fiel a A · Señal):
  - Cabecera: alto `--nav-height`, fondo `--color-nav-bg`, borde inferior, contenido con
    `--section-max-width` y `--space-gutter`; no fija.
  - `main`: alto mínimo `--hero-min-height` menos `--nav-height`, padding `--space-section` /
    `--space-gutter`, contenido centrado en columna y texto centrado.
  - "404": `--font-mono`, `--not-found-code-size`, `--text-display-weight`,
    `--text-display-tracking`, `--color-text`, `--shadow-glow-text`; título con `--text-h1-*`;
    línea con `--text-body-*` y `--color-text-muted`; separaciones `--space-6` / `--space-3`.
  - "Volver al inicio": botón secundario del sistema con flecha (hover: borde
    `--color-accent`, `--shadow-glow-secondary`, flecha `--color-glow`; foco con los tokens
    del sistema); transición `--duration-fast` / `--ease-out` solo sin reduced motion.
- **Test** (`not-found-styles.test.ts`): sin literales; usa los tokens citados; foco con los
  tokens del sistema; transiciones solo sin reduced motion; ninguna regla oculta contenido.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - Comprobación manual en Chrome (sobre `bun run preview`, ruta inexistente): 404 a 390px y
    1440px contra `A · Señal — Móvil 390` y `— Escritorio 1440`; hover y foco del botón; la
    barra de la home sin cambios visuales tras extraer `SiteBrand`.

### [x] T04 — Descifrado del "404"

- **Criterios**: CA-3.1, CA-3.2
- **Diseño**: `Movimiento — Descifrado del 404` · `M-1`
- **Archivos**: `src/components/NotFoundScreen.astro` (modificar),
  `tests/components/not-found-script.test.ts` (crear)
- **Qué hacer**: `<script>` nativo en `NotFoundScreen`: con JavaScript y sin reduced motion,
  descifra el "404" una vez al cargar con `scrambleText` y `parseCssDuration`
  (`src/lib/hero-motion.ts`) durante `--duration-scramble`, con glifos mono y los caracteres no
  resueltos en `--color-glow`; el nombre accesible sigue siendo "404" (el texto que cambia no se
  anuncia). Sin JavaScript o con reduced motion no se toca el "404".
- **Test** (`not-found-script.test.ts`): el componente tiene un único `<script>` que importa
  solo de `../lib/hero-motion`, consulta `prefers-reduced-motion` y lee
  `--duration-scramble`; el HTML contiene "404" y su nombre accesible es "404".
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - JavaScript de `dist/404.html` ≤ 3 kB con gzip, sin scripts externos.
  - Comprobación manual: descifrado contra `Movimiento — Descifrado del 404`; con reduced
    motion y sin JavaScript, "404" directamente.

### [ ] T05 — Verificación final

- **Criterios**: todos
- **Diseño**: todas las pantallas de `designs/013-not-found-page/design.md`
- **Archivos**: —
- **Qué hacer**: verificación completa de la spec.
- **Test**: cada CA tiene cobertura:
  - CA-1.1 → `tests/lib/page-meta.test.ts` + `tests/components/not-found.test.ts` + revisión de `dist/`
  - CA-1.2, CA-1.3 → `tests/components/not-found.test.ts`
  - CA-1.4 → comprobación en producción
  - CA-2.1 → `tests/layouts/base-layout.test.ts` + `tests/components/not-found.test.ts` + revisión de `dist/`
  - CA-2.2 → `tests/layouts/base-layout.test.ts` + `tests/components/seo-head.test.ts`
  - CA-3.1 → `tests/components/not-found-script.test.ts` + comprobación manual
  - CA-3.2 → `tests/components/not-found-script.test.ts` + medición de `dist/`
  - CA-3.3 → `tests/components/not-found-styles.test.ts` + `tests/styles/tokens.test.ts`
  - CA-3.4 → Lighthouse
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - `dist/404.html`: título, un único `h1`, textos, marca, footer, `noindex`, iconos y
    `theme-color`, sin canónica, OG ni JSON-LD; JavaScript ≤ 3 kB; fuera de `dist/sitemap.xml`.
  - `dist/index.html` sin cambios en sus metadatos.
  - Teclado (marca → "Volver al inicio" → footer) y contraste AA; revisión visual a 390px y
    1440px; reduced motion y sin JavaScript.
  - En producción (tras `git push`): una URL inexistente responde 404 con esta página.
  - Lighthouse (móvil) de la 404 ≥ 90 en Performance, Accessibility y Best Practices.

## Registro de decisiones

| Fecha | Tipo | Decisión | Motivo |
|-------|------|----------|--------|
| 2026-09-19 | Creación | Plan inicial de 5 tareas | — |
| 2026-09-19 | Planificación | Iconos y `theme-color` pasan de `SeoHead` a `BaseLayout`, con una prop `noindex` (T01) | La spec los quiere en todas las páginas y la 404 no lleva el resto de metadatos |
| 2026-09-19 | Planificación | La marca se extrae de `SiteNav` a `SiteBrand` y se reutiliza en la cabecera de la 404 (T02) | Evita duplicar el marcado y los estilos de la marca |
| 2026-09-19 | Planificación | El descifrado reutiliza `scrambleText` y `parseCssDuration` de `src/lib/hero-motion.ts` (T04) | Misma lógica ya probada del hero (patrón P-4) |
| 2026-09-19 | Planificación | La página se prueba por sus componentes y su código; el HTML final en la verificación (T05) | Las páginas con colecciones no se renderizan en el contenedor de tests, como la home |
| 2026-09-20 | Implementación (T02) | La marca pasa a `SiteBrand` con sus estilos (clases `site-brand*`); `tests/components/site-nav-styles.test.ts` deja de comprobar el nombre oculto y esa comprobación se hace ahora sobre `SiteBrand` | Los estilos de Astro no alcanzan al HTML de otro componente; aprobado por el usuario |
