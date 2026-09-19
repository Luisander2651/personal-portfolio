---
id: 012
title: SEO y metadatos
spec: specs/012-seo-metadata/spec.md
design: designs/012-seo-metadata/design.md
status: approved
created: 2026-09-18
updated: 2026-09-18
---

# Plan — SEO y metadatos

Leyenda: `[ ]` pendiente · `[x]` hecha · `[-]` obsoleta · una tarea `[ ]` con línea
**Bloqueo** está detenida por `/implement` hasta resolver una brecha.

## Resumen

| Capa | Tareas |
|------|--------|
| Datos | T01 |
| Archivos generados en la build | T02 |
| Estructura (`head`) | T03 |
| Recursos visuales | T04 |
| Verificación final | T05 |

## Cobertura de criterios

| Criterio | Tareas |
|----------|--------|
| CA-1.1 | T01, T03 |
| CA-1.2 | T01, T02 |
| CA-1.3 | T01, T02 |
| CA-1.4 | T01, T03 |
| CA-2.1 | T01, T03 |
| CA-2.2 | T04 |
| CA-3.1 | T03, T04 |
| CA-3.2 | T03 |
| CA-4.1 | T03, T05 |
| CA-4.2 | T05 |
| CA-4.3 | T04 |

## Tareas

### [x] T01 — URL del sitio y lógica de SEO

- **Criterios**: CA-1.1, CA-1.2, CA-1.3, CA-1.4, CA-2.1
- **Diseño**: —
- **Archivos**: `astro.config.mjs` (modificar), `src/lib/seo.ts` (crear),
  `tests/lib/seo.test.ts` (crear)
- **Qué hacer**:
  - `astro.config.mjs`: `site` = `https://personal-portfolio-lemon-three-51.vercel.app`.
  - Funciones puras en `src/lib/seo.ts`:
    - `canonicalUrl`: URL absoluta de la home a partir de `site` (con barra final).
    - `sitemapXml`: documento XML con el espacio de nombres de sitemaps y una `<url>`/`<loc>`
      por URL recibida.
    - `robotsTxt`: `User-agent: *`, `Allow: /` y `Sitemap: {site}/sitemap.xml`.
    - `splitLocation`: separa `profile.location` ("Estado de México, México") en región y
      país.
    - `personJsonLd`: objeto schema.org `Person` con `name`, `jobTitle`, `url`, `email`
      (`mailto:`), `address` (`PostalAddress` con `addressRegion` y `addressCountry`) y
      `sameAs` (GitHub, LinkedIn).
    - `openGraphTags`: lista de pares `property`/`content` para `og:type`, `og:site_name`,
      `og:title`, `og:description`, `og:url`, `og:locale`, `og:image`, `og:image:width`,
      `og:image:height` y `og:image:alt`, a partir del título, la descripción, el nombre y
      `site`.
- **Test**: URL canónica con y sin barra final en `site`; XML con el espacio de nombres y
  exactamente una `<url>` para una URL, escapando caracteres especiales; líneas de
  `robots.txt`; `splitLocation` con "Estado de México, México" y con una ubicación sin coma;
  JSON-LD serializable con todos los campos; las diez etiquetas OG con sus valores
  (`og:image` absoluta, 1200/630, `og:locale` `es_MX`); con los datos reales de `profile`, los
  valores de la tabla de Contenido de la spec; `site` de la configuración igual a la URL de la
  spec.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.

### [x] T02 — `sitemap.xml` y `robots.txt` en la build

- **Criterios**: CA-1.2, CA-1.3
- **Diseño**: —
- **Archivos**: `src/pages/sitemap.xml.ts` (crear), `src/pages/robots.txt.ts` (crear),
  `tests/pages/seo-files.test.ts` (crear)
- **Qué hacer**: dos endpoints estáticos (`GET`) que usan `site` y las funciones de T01:
  - `sitemap.xml`: el XML con la URL canónica de la home, tipo `application/xml`.
  - `robots.txt`: el texto de `robotsTxt`, tipo `text/plain`.
- **Test**: la respuesta de cada endpoint con un `site` de prueba (contenido y tipo de
  contenido); el sitemap no incluye la 404; `package.json` no gana dependencias.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - `dist/sitemap.xml` y `dist/robots.txt` generados con la URL real.

### [x] T03 — Metadatos en el `head`

- **Criterios**: CA-1.1, CA-1.4, CA-2.1, CA-3.1, CA-3.2, CA-4.1
- **Diseño**: `designs/012-seo-metadata/design.md` → Icono del sitio (`theme-color`)
- **Archivos**: `src/components/SeoHead.astro` (crear), `tests/components/seo-head.test.ts`
  (crear), `src/layouts/BaseLayout.astro` (modificar), `src/pages/index.astro` (modificar)
- **Qué hacer**:
  - **`SeoHead`**. Props: título, descripción, datos de `profile` necesarios y `site`.
    Renderiza en el `head`: `<link rel="canonical">`, las etiquetas `og:*` de
    `openGraphTags`, un único `<script type="application/ld+json">` con `personJsonLd`,
    `<meta name="theme-color">` con el valor de `--color-bg`, y los enlaces a
    `/favicon.svg` (`type="image/svg+xml"`), `/favicon-32.png` (`sizes="32x32"`) y
    `/apple-touch-icon.png` (`rel="apple-touch-icon"`).
  - **`BaseLayout`**: incluye `SeoHead` en el `head` con lo que recibe de la página, sin
    cambiar el `<title>` ni la meta description.
  - **`index.astro`**: pasa los datos de `profile` y `Astro.site`.
- **Test** (`seo-head.test.ts`): una sola canónica con la URL; las diez etiquetas OG con sus
  valores; un único JSON-LD que se parsea como `Person` con los campos de CA-1.4; los tres
  enlaces de icono con sus atributos; `theme-color` igual al valor de `--color-bg` en
  `tokens.css`; el `<title>` y la meta description siguen saliendo de `getPageMeta`.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - JavaScript ejecutable de la home ≤ 3 kB con gzip (el JSON-LD no cuenta).

### [x] T04 — Imagen Open Graph e iconos

- **Criterios**: CA-2.2, CA-3.1, CA-4.3
- **Diseño**: `A · Tarjeta — Imagen OG 1200×630` y `B · Índice — Icono y vista previa`
- **Archivos**: `public/og-image.png` (crear), `public/favicon.svg` (crear),
  `public/favicon-32.png` (crear), `public/apple-touch-icon.png` (crear),
  `tests/public/brand-assets.test.ts` (crear)
- **Qué hacer**:
  - `favicon.svg`: el icono B · Índice en la retícula de 64 con "LM" (Geist Mono 600)
    convertido a trazos, sin `<text>`, filtros ni recursos externos.
  - `favicon-32.png` y `apple-touch-icon.png`: el mismo dibujo rasterizado a 32×32 y
    180×180.
  - `og-image.png`: la composición A · Tarjeta a 1200×630 con los datos reales de `profile`
    (ubicación, nombre, rol y stack destacado) y las fuentes Geist del sitio, ≤ 300 kB.
  - Generación única, fuera del repositorio y sin dependencias del proyecto: los PNG se
    renderizan con el Chrome instalado en modo headless a su tamaño exacto; el texto "LM" se
    convierte a trazos con `opentype.js` vía `bunx`. Solo se añaden los archivos resultantes.
- **Test** (`brand-assets.test.ts`): los cuatro archivos existen; las dimensiones leídas de la
  cabecera PNG son 1200×630, 32×32 y 180×180; `og-image.png` pesa ≤ 300 kB; el SVG tiene
  `viewBox="0 0 64 64"` y no contiene `<text>`, `<filter>`, `<image>` ni URL externas.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - Comprobación manual: `og-image.png` contra `A · Tarjeta — Imagen OG 1200×630` y los iconos
    contra `B · Índice — Icono y vista previa` (incluido el favicon en una pestaña real).

### [ ] T05 — Verificación final

- **Criterios**: todos
- **Diseño**: todas las piezas de `designs/012-seo-metadata/design.md`
- **Archivos**: —
- **Qué hacer**: verificación completa de la spec.
- **Test**: cada CA tiene cobertura:
  - CA-1.1 → `tests/lib/seo.test.ts` + `tests/components/seo-head.test.ts` + revisión de `dist/`
  - CA-1.2, CA-1.3 → `tests/lib/seo.test.ts` + `tests/pages/seo-files.test.ts` + revisión de `dist/`
  - CA-1.4, CA-2.1 → `tests/lib/seo.test.ts` + `tests/components/seo-head.test.ts`
  - CA-2.2, CA-4.3 → `tests/public/brand-assets.test.ts` + comprobación manual
  - CA-3.1 → `tests/components/seo-head.test.ts` + `tests/public/brand-assets.test.ts`
  - CA-3.2 → `tests/components/seo-head.test.ts`
  - CA-4.1 → `tests/components/seo-head.test.ts` + medición de `dist/`
  - CA-4.2 → Lighthouse
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - `dist/index.html`: canónica, etiquetas OG, JSON-LD, `theme-color` e iconos; `dist/sitemap.xml`
    y `dist/robots.txt` con la URL real; un único `h1`; JavaScript de la home ≤ 3 kB.
  - Datos estructurados validados con una herramienta de schema.org (p. ej. Rich Results Test
    de Google) una vez desplegado.
  - Vista previa del enlace compartido revisada (p. ej. Post Inspector de LinkedIn) una vez
    desplegado.
  - Lighthouse ≥ 90 en todas las categorías y la auditoría de SEO sin fallos (DevTools sobre
    `bun run preview`).

## Registro de decisiones

| Fecha | Tipo | Decisión | Motivo |
|-------|------|----------|--------|
| 2026-09-18 | Creación | Plan inicial de 5 tareas | — |
| 2026-09-18 | Planificación | Lógica de SEO (URL, sitemap, robots, JSON-LD, Open Graph) en `src/lib/seo.ts` (T01) | Funciones puras y testeables (constitución §4 y §5) |
| 2026-09-18 | Planificación | `sitemap.xml` y `robots.txt` como endpoints estáticos de Astro (T02) | Generados en la build a partir de `site`, sin dependencias |
| 2026-09-18 | Planificación | Metadatos en un componente `SeoHead` dentro de `BaseLayout` (T03) | Un único lugar para el `head`; la 404 (spec 013) podrá reutilizarlo |
| 2026-09-18 | Planificación | Imágenes generadas una vez con Chrome headless y `opentype.js` vía `bunx`, fuera del repositorio (T04) | Sin dependencias del proyecto (constitución §1); solo se versionan los archivos resultantes |
| 2026-09-18 | Implementación (T03) | `BaseLayout` recibe una prop opcional `seo` (perfil y `site`) y solo entonces incluye `SeoHead`; `theme-color` usa el literal `#05070D`, comparado por test con `--color-bg` | Un `<meta>` no puede leer variables CSS; sin `seo` el layout no cambia (la 404 decidirá en la spec 013) |
| 2026-09-18 | Implementación (T04) | Generación fuera del repositorio: "LM" a trazos con `opentype.js` sobre Geist Mono 600 (TTF de Google Fonts, la misma fuente del sitio); PNG con Chrome headless a tamaño exacto y esquinas transparentes; datos de la imagen OG leídos de `profile.md`. Resultado: `og-image.png` 139 kB, `favicon.svg` 495 B | Sin dependencias del proyecto (constitución §1) |
| 2026-09-18 | Implementación (T04) | El test lee los archivos con imports de Vite (`?inline` para los PNG, `?raw` para el SVG) en lugar de `node:fs` | El proyecto no incluye tipos de Node y `astro check` rechazaba `node:fs`, `Buffer` y `process` |
