---
id: 013
title: Página 404
status: active
created: 2026-09-19
updated: 2026-09-19
depends_on: [001, 002, 003, 010, 011, 012]
---

# Página 404

## Objetivo

Que quien llega a una ruta que no existe vea una página con el estilo del sitio, entienda qué ha
pasado y pueda volver a la home o contactar con el autor, sin que la página se indexe. Es la
única página adicional del sitio (`docs/workflow.md`).

## Historias de usuario

- **HU-1**: Como visitante que llega a una ruta inexistente, quiero saber que la página no
  existe y volver a la home o contactar con el autor, para no quedarme sin salida.
- **HU-2**: Como autor, quiero que los buscadores no indexen la 404 y que el navegador muestre
  el icono y el color del sitio también en ella.
- **HU-3**: Como visitante, quiero que la 404 sea ligera y accesible, con un detalle del estilo
  del sitio que no dependa de JavaScript.

## Criterios de aceptación

### HU-1

- **CA-1.1**
  - **Dado** el sitio generado con `bun run build`
  - **Cuando** inspecciono `dist/404.html`
  - **Entonces** existe, su `<title>` es "Página no encontrada — {profile.name}"
    ("Página no encontrada — Luis Mario Gutiérrez Valdovinos"), tiene un único `h1` y no
    aparece en `dist/sitemap.xml`
- **CA-1.2**
  - **Dado** `dist/404.html`
  - **Cuando** inspecciono su `main`
  - **Entonces** contiene, en este orden: un "404" en tipografía mono, el `h1` "Página no
    encontrada", el texto "La ruta que buscas no existe o se ha movido." y un enlace "Volver al
    inicio" con `href="/"`
- **CA-1.3**
  - **Dado** `dist/404.html`
  - **Cuando** inspecciono lo que rodea al `main`
  - **Entonces** antes de `main` hay una cabecera con solo la marca "LMGV" (iniciales de
    `profile.name`, con el nombre completo como nombre accesible) enlazando a `/`, sin la lista
    de secciones ni el botón "Menú" de la navegación (spec 010); y después de `main` está el
    mismo footer de contacto de la home (spec 011), con los datos de `profile`
- **CA-1.4**
  - **Dado** el sitio desplegado
  - **Cuando** pido una URL que no existe (p. ej. `/no-existe`)
  - **Entonces** la respuesta tiene estado HTTP 404 y muestra esta página (verificación:
    manual en producción)

### HU-2

- **CA-2.1**
  - **Dado** `dist/404.html`
  - **Cuando** inspecciono su `head`
  - **Entonces** tiene `<meta name="robots" content="noindex">` y no tiene `<link
    rel="canonical">`, etiquetas `og:*` ni JSON-LD
- **CA-2.2**
  - **Dado** `dist/404.html` y `dist/index.html`
  - **Cuando** inspecciono sus `head`
  - **Entonces** ambas enlazan `/favicon.svg`, `/favicon-32.png` y `/apple-touch-icon.png`
    y tienen `<meta name="theme-color">` igual a `--color-bg`; los metadatos de la home
    (spec 012) no cambian

### HU-3

- **CA-3.1**
  - **Dado** un visitante con JavaScript activo y sin `prefers-reduced-motion: reduce`
  - **Cuando** carga la 404
  - **Entonces** el "404" se descifra una sola vez (efecto scramble/decode de la dirección
    creativa) hasta quedar como "404"; con `prefers-reduced-motion: reduce` o sin JavaScript
    se muestra "404" directamente; y los lectores de pantalla anuncian "404", no los caracteres
    intermedios (verificación: estructura por test y revisión manual)
- **CA-3.2**
  - **Dado** el sitio generado
  - **Cuando** mido el JavaScript de cliente de `dist/404.html`
  - **Entonces** es ≤ 3 kB con gzip, no depende de ningún paquete y solo implementa el
    descifrado del "404"; sin JavaScript todo el contenido está en el HTML y es visible
- **CA-3.3**
  - **Dado** los estilos de la 404 y un visitante que navega con teclado
  - **Cuando** se ejecutan los tests y recorre la página con Tab
  - **Entonces** los estilos solo usan tokens del sistema de diseño; el orden de tabulación es
    marca, "Volver al inicio" y los enlaces del footer; y todos muestran el foco visible del
    sistema
- **CA-3.4**
  - **Dado** la 404 servida con `bun run preview`
  - **Cuando** se ejecuta Lighthouse (móvil) sobre una ruta inexistente
  - **Entonces** obtiene ≥ 90 en Performance, Accessibility y Best Practices (SEO no se exige:
    el `noindex` es intencionado)

## Contenido

| Elemento | Texto / fuente |
|----------|----------------|
| `<title>` | "Página no encontrada — {profile.name}" |
| Código | "404" |
| `h1` | "Página no encontrada" |
| Texto | "La ruta que buscas no existe o se ha movido." |
| Enlace | "Volver al inicio" → `/` |
| Marca | "LMGV" (iniciales de `profile.name`), enlace a `/` |
| Footer | El de la spec 011 (`profile`) |
| `head` | `noindex`, iconos y `theme-color` |

Textos de interfaz propios de la página; ningún dato profesional nuevo.

## Diseño

Diseño aprobado: [designs/013-not-found-page/design.md](../../designs/013-not-found-page/design.md)
· [canvas](https://claude.ai/artifact/XRnJCaHqhnpKY8DutvtVKw) (dirección A · Señal).

Qué debe sentirse: una pantalla sobria con el estilo del sitio (grid, luz, mono), con el "404"
como único momento de movimiento al descifrarse, y la salida a la home evidente.

## Fuera de alcance

- Mostrar la ruta que el visitante intentó abrir.
- Barra de navegación completa, buscador o sugerencias de secciones.
- Otras páginas de error (500…): el sitio es estático.
- Configuración específica del hosting más allá de comprobar el estado 404 (spec 014).

## Registro de decisiones

| Fecha | Tipo | Pregunta / Conflicto | Decisión | Fuente |
|-------|------|----------------------|----------|--------|
| 2026-09-19 | Implícita | Número, slug y alcance | `013-not-found-page`: 404 con el estilo del sitio y enlace a la home; única página adicional | docs/workflow.md |
| 2026-09-19 | Brecha | Marco de la página | Solo la marca "LMGV" enlazando a `/` arriba (sin los enlaces de sección, que son anclas de la home) y el footer de contacto abajo | usuario, specs/010-navigation |
| 2026-09-19 | Brecha | Tono del mensaje | Técnico y sobrio: "404" mono, "Página no encontrada", una línea y "Volver al inicio" | usuario |
| 2026-09-19 | Brecha | Mostrar la ruta pedida | No: página estática sin JavaScript para el contenido | usuario |
| 2026-09-19 | Brecha | Movimiento | Descifrado (scramble) del "404" una vez al cargar; directo con reduced motion o sin JavaScript | usuario, creative-direction.md |
| 2026-09-19 | Implícita | Indexación | `noindex` y fuera del sitemap; sin canónica, Open Graph ni JSON-LD | specs/012-seo-metadata |
| 2026-09-19 | Implícita | Iconos y `theme-color` | Pasan de `SeoHead` a `BaseLayout` para estar en todas las páginas; la home no cambia | specs/012-seo-metadata |
| 2026-09-19 | Implícita | Lighthouse | SEO no se exige en la 404 por el `noindex` intencionado | constitution.md §7 |
| 2026-09-19 | Diseño | Composición de la 404 | A · Señal: "404" mono enorme y centrado con halo cian, título, línea y botón secundario "Volver al inicio"; cabecera solo con la marca y el footer de contacto; tokens nuevos `--not-found-code-size` y `--shadow-glow-text` | /design-spec |
