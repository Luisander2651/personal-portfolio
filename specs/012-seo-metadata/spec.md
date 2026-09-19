---
id: 012
title: SEO y metadatos
status: done
created: 2026-09-18
updated: 2026-09-18
depends_on: [001, 002, 003, 004, 010, 011]
---

# SEO y metadatos

## Objetivo

Que la home se indexe correctamente y se vea cuidada al compartirla: URL canónica, sitemap,
`robots.txt` y datos estructurados de persona para los buscadores; tarjeta Open Graph para
LinkedIn, WhatsApp y otras redes; e iconos del sitio y color de la barra del navegador. Todo se
deriva de la colección `profile` y de una única URL del sitio, sin dependencias nuevas.

## Historias de usuario

- **HU-1**: Como autor, quiero que los buscadores encuentren e interpreten la home (quién soy, a
  qué me dedico y dónde están mis perfiles), para aparecer en las búsquedas de mi nombre.
- **HU-2**: Como autor que comparte el enlace (LinkedIn, WhatsApp, correo), quiero una tarjeta
  con título, descripción e imagen cuidadas, para que el enlace transmita la misma imagen que el
  sitio.
- **HU-3**: Como visitante, quiero reconocer el sitio en la pestaña, en marcadores y en la
  pantalla de inicio del móvil.
- **HU-4**: Como visitante, quiero que estos metadatos no hagan la página más pesada ni menos
  accesible.

## Criterios de aceptación

### HU-1

- **CA-1.1**
  - **Dado** la configuración de Astro y el sitio generado con `bun run build`
  - **Cuando** inspecciono la configuración y `dist/index.html`
  - **Entonces** `site` vale `https://personal-portfolio-lemon-three-51.vercel.app` y la home
    tiene un único `<link rel="canonical">` con `href`
    `https://personal-portfolio-lemon-three-51.vercel.app/`, construido a partir de `site`
- **CA-1.2**
  - **Dado** el sitio generado
  - **Cuando** inspecciono `dist/sitemap.xml`
  - **Entonces** existe, es XML válido con el espacio de nombres de sitemaps
    (`http://www.sitemaps.org/schemas/sitemap/0.9`) y contiene exactamente una `<url>` cuyo
    `<loc>` es la URL canónica de la home; la página 404 no aparece; se genera sin paquetes
    nuevos
- **CA-1.3**
  - **Dado** el sitio generado
  - **Cuando** inspecciono `dist/robots.txt`
  - **Entonces** contiene `User-agent: *`, `Allow: /` y
    `Sitemap: https://personal-portfolio-lemon-three-51.vercel.app/sitemap.xml`, construido a
    partir de `site`
- **CA-1.4**
  - **Dado** `dist/index.html` y la colección `profile`
  - **Cuando** inspecciono su `<script type="application/ld+json">`
  - **Entonces** hay uno solo, con JSON válido de schema.org de tipo `Person`, con `name`
    (`profile.name`), `jobTitle` (`profile.role`), `url` (la URL canónica), `email`
    (`mailto:` + `profile.email`), `address` con `addressRegion` "Estado de México" y
    `addressCountry` "México" (derivados de `profile.location`) y `sameAs` con
    `profile.github` y `profile.linkedin`; ningún dato está incrustado en componentes y la
    construcción de ese objeto tiene tests

### HU-2

- **CA-2.1**
  - **Dado** `dist/index.html`
  - **Cuando** inspecciono sus metadatos Open Graph
  - **Entonces** tiene `og:type` `website`, `og:site_name` = `profile.name`, `og:title` igual al
    `<title>`, `og:description` igual a la meta description, `og:url` igual a la URL canónica,
    `og:locale` `es_MX`, `og:image` con la URL absoluta de `/og-image.png`, `og:image:width`
    `1200`, `og:image:height` `630` y `og:image:alt` igual al `<title>` ("Nombre — Rol")
- **CA-2.2**
  - **Dado** `public/og-image.png`
  - **Cuando** se ejecutan los tests
  - **Entonces** existe, es un PNG de 1200×630 px y pesa como máximo 300 kB; su contenido
    (nombre, rol y marca, sin fotografía) sigue el diseño aprobado (verificación: revisión
    manual contra el diseño)

### HU-3

- **CA-3.1**
  - **Dado** `dist/index.html` y `public/`
  - **Cuando** inspecciono los iconos
  - **Entonces** el `head` enlaza `/favicon.svg` (`type="image/svg+xml"`), `/favicon-32.png`
    (`sizes="32x32"`) y `/apple-touch-icon.png` (`rel="apple-touch-icon"`); los tres archivos
    existen, el SVG es válido y los PNG miden 32×32 y 180×180 px
- **CA-3.2**
  - **Dado** `dist/index.html` y `src/styles/tokens.css`
  - **Cuando** se ejecutan los tests
  - **Entonces** `<meta name="theme-color">` vale lo mismo que `--color-bg` (`#05070D`)

### HU-4

- **CA-4.1**
  - **Dado** el sitio generado
  - **Cuando** mido el JavaScript de cliente de la home y reviso las dependencias
  - **Entonces** el JavaScript ejecutable de la home sigue siendo ≤ 3 kB con gzip (el JSON-LD
    no es JavaScript ejecutable), no hay paquetes nuevos, y el `<title>` y la meta description
    no cambian respecto a las specs 001 y 004
- **CA-4.2**
  - **Dado** la home servida con `bun run preview`
  - **Cuando** se ejecuta Lighthouse (móvil)
  - **Entonces** obtiene ≥ 90 en Performance, Accessibility, Best Practices y SEO, y la
    auditoría de SEO no marca ningún fallo
- **CA-4.3**
  - **Dado** los iconos y la imagen Open Graph
  - **Cuando** inspecciono cómo se sirven
  - **Entonces** son archivos estáticos de `public/`, sin JavaScript ni generación en la build

## Contenido

Fuente: colección `profile` (derivada de la cabecera de `docs/cv.md`) y la URL del sitio.

| Metadato | Valor |
|----------|-------|
| URL del sitio (`site`) | `https://personal-portfolio-lemon-three-51.vercel.app` |
| Canónica y `og:url` | `https://personal-portfolio-lemon-three-51.vercel.app/` |
| `<title>`, `og:title`, `og:image:alt` | "Luis Mario Gutiérrez Valdovinos — Ingeniero de Software Backend / Full Stack" (`getPageMeta`) |
| Meta description, `og:description` | `profile.summary` (`getPageMeta`) |
| `og:site_name` | `profile.name` |
| `og:locale` | `es_MX` |
| JSON-LD `Person` | `name`, `jobTitle`, `url`, `email`, `address` (Estado de México, México), `sameAs` (GitHub, LinkedIn) |
| `theme-color` | `#05070D` (`--color-bg`) |
| Imagen Open Graph | `/og-image.png`, 1200×630 |
| Iconos | `/favicon.svg`, `/favicon-32.png` (32×32), `/apple-touch-icon.png` (180×180) |

## Diseño

Diseño aprobado: [designs/012-seo-metadata/design.md](../../designs/012-seo-metadata/design.md)
· [canvas](https://claude.ai/artifact/PDypkF76GZLqEUBMHuDeyg) (imagen OG A · Tarjeta, icono
B · Índice).

Qué debe diseñarse: la imagen Open Graph (1200×630: nombre, rol y marca "LMGV", con la estética
del sitio y legible en miniatura) y el icono del sitio (legible a 16–32 px y a 180 px). Sin
fotografía.

## Fuera de alcance

- Página 404 y su tratamiento por los buscadores (spec 013).
- Configuración del hosting o de un dominio propio (spec 014); la cabecera `noindex` de las URL
  de preview de Vercel es de la plataforma.
- Etiquetas de X/Twitter, `favicon.ico`, `site.webmanifest` y PWA.
- Analítica, Search Console y `hreflang` (el sitio solo está en español).
- Generar la imagen Open Graph en la build: es un PNG estático y, si cambian el nombre o el rol,
  hay que regenerarla.

## Registro de decisiones

| Fecha | Tipo | Pregunta / Conflicto | Decisión | Fuente |
|-------|------|----------------------|----------|--------|
| 2026-09-18 | Implícita | Número, slug y alcance | `012-seo-metadata`: favicon, imagen Open Graph, sitemap y `robots.txt` | docs/workflow.md |
| 2026-09-18 | Brecha | URL pública del sitio | `https://personal-portfolio-lemon-three-51.vercel.app` como `site` de Astro; canónica, sitemap, `robots.txt` y `og:image` se construyen a partir de ella | usuario |
| 2026-09-18 | Brecha | Sitemap | Archivo propio generado en la build, sin dependencias; solo la home | usuario, constitution.md §1 |
| 2026-09-18 | Brecha | Imagen Open Graph | Diseñada en `/design-spec` y guardada como PNG estático en `public/` | usuario |
| 2026-09-18 | Brecha | Metadatos adicionales | Datos estructurados `Person` (JSON-LD) y `theme-color`; sin etiquetas de X/Twitter | usuario |
| 2026-09-18 | Brecha | Formatos de icono | `favicon.svg`, `favicon-32.png` (32×32) y `apple-touch-icon.png` (180×180); sin `.ico` ni manifest | usuario |
| 2026-09-18 | Implícita | Título y descripción | Los de `getPageMeta` (specs 001 y 004), reutilizados en Open Graph | specs/001-foundation, specs/004-about |
| 2026-09-18 | Implícita | `og:locale` | `es_MX`: contenido en español y ubicación en México | docs/cv.md, constitution.md §9 |
| 2026-09-18 | Implícita | Contenido de la imagen | Sin fotografía | anti-cliches.md |
| 2026-09-18 | Implícita | JavaScript | Sin JavaScript nuevo; el JSON-LD no cuenta en el presupuesto de la home | constitution.md §3 |
| 2026-09-18 | Diseño | Imagen OG e icono | Imagen OG A · Tarjeta (tarjeta del hero con ubicación, nombre, rol y stack sobre la cuadrícula) e icono B · Índice ("LM" mono con punto de luz, en trazos en el SVG); sin tokens nuevos | /design-spec |
| 2026-09-18 | Cierre | Spec completada: las tareas T01 a T05 de `plans/012-seo-metadata/plan.md` verificadas (tests, `dist/`, imagen OG e iconos contra el diseño, Rich Results Test, LinkedIn Post Inspector, URL de producción y Lighthouse 98) | Estado `done` | /implement |
