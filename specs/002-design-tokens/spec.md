---
id: 002
title: Tokens de diseño y estilos base
status: active
created: 2026-09-13
updated: 2026-09-13
depends_on: [001]
---

# Tokens de diseño y estilos base

## Objetivo

Trasladar el sistema de diseño aprobado (`designs/000-design-system/design.md`) al proyecto
como variables CSS globales, fuentes autoalojadas y estilos base aplicados a todo el sitio,
de modo que ninguna spec visual posterior necesite valores sueltos y que la documentación
de diseño y el código no puedan divergir.

## Historias de usuario

- **HU-1**: Como desarrollador del portafolio, quiero todos los tokens del sistema de diseño
  disponibles como variables CSS globales con los mismos valores que `design.md`, para
  construir cada sección sin valores sueltos.
- **HU-2**: Como visitante, quiero que todo texto tenga contraste suficiente sobre su fondo,
  para leer el sitio sin esfuerzo.
- **HU-3**: Como visitante, quiero que las fuentes se sirvan desde el propio sitio sin
  bloquear la lectura, para que la página cargue rápido y no dependa de terceros.
- **HU-4**: Como visitante, quiero que todas las páginas compartan la base visual del sistema
  (fondo, color, tipografía, foco, enlaces y selección), para percibir un sitio coherente.

## Criterios de aceptación

### HU-1

- **CA-1.1**
  - **Dado** los tokens documentados en `designs/000-design-system/design.md`
  - **Cuando** se ejecutan los tests
  - **Entonces** cada token existe en los estilos globales con exactamente el mismo valor,
    y no existe en los estilos globales ningún token que no esté documentado
- **CA-1.2**
  - **Dado** un token fluido (tamaños tipográficos y espaciados fluidos)
  - **Cuando** se ejecutan los tests
  - **Entonces** su valor mínimo es el valor móvil documentado (viewport 390px) y su valor
    máximo es el valor de escritorio documentado (viewport 1440px)
- **CA-1.3**
  - **Dado** un token con valor distinto en móvil y escritorio que no es fluido
    (line-heights, tamaño del grid de fondo, alto de control)
  - **Cuando** se ejecutan los tests
  - **Entonces** toma el valor móvil por debajo de 768px de ancho y el valor de escritorio
    desde 768px
- **CA-1.4**
  - **Dado** un visitante con `prefers-reduced-motion: reduce`
  - **Cuando** se aplican los estilos globales
  - **Entonces** todos los tokens de duración y el token de stagger valen `0ms`
    (verificado por test)

### HU-2

- **CA-2.1**
  - **Dado** los tokens de color
  - **Cuando** un test calcula el contraste WCAG entre ellos
  - **Entonces** `--color-text`, `--color-text-secondary`, `--color-text-muted`,
    `--color-link`, `--color-warning` y `--color-success` tienen ≥ 4.5:1 sobre
    `--color-bg` y sobre `--color-surface`; `--color-on-accent` tiene ≥ 4.5:1 sobre
    `--color-accent`; `--color-tag-text` tiene ≥ 4.5:1 sobre `--color-tag-bg`; y
    `--color-glow` (anillo de foco) tiene ≥ 3:1 sobre `--color-bg`

### HU-3

- **CA-3.1**
  - **Dado** los estilos generados por el build
  - **Cuando** inspecciono las declaraciones de fuentes
  - **Entonces** existen Geist (400, 500, 600) y Geist Mono (400, 500) con
    `font-display: swap`, y `--font-sans` y `--font-mono` incluyen los fallbacks de `design.md`
- **CA-3.2**
  - **Dado** el sitio generado en `dist/`
  - **Cuando** inspecciono el HTML y el CSS
  - **Entonces** ningún archivo de fuente ni hoja de estilos se carga desde un dominio externo;
    los archivos de fuente se sirven desde el propio sitio
- **CA-3.3**
  - **Dado** el `package.json` del proyecto
  - **Cuando** comparo sus dependencias con las de la spec 001
  - **Entonces** no se ha añadido ninguna dependencia

### HU-4

- **CA-4.1**
  - **Dado** los estilos base globales
  - **Cuando** se ejecutan los tests
  - **Entonces** el documento declara `color-scheme` oscuro y el body usa `--color-bg`, el
    grid de fondo con `--color-grid-line` y el halo superior documentados, `--color-text` y
    `--font-sans`
- **CA-4.2**
  - **Dado** cualquier elemento interactivo enfocado con teclado
  - **Cuando** recibe `:focus-visible`
  - **Entonces** muestra el anillo de foco definido por los tokens de foco
    (verificado por test sobre los estilos base)
- **CA-4.3**
  - **Dado** los estilos base
  - **Cuando** se ejecutan los tests
  - **Entonces** los enlaces usan `--color-link` y `--color-link-hover`, y la selección de
    texto usa el token de selección documentado
- **CA-4.4**
  - **Dado** los estilos base
  - **Cuando** se ejecutan los tests
  - **Entonces** `h1`, `h2`, `h3`, `p`, `small` y `code` usan respectivamente
    `--text-h1`, `--text-h2`, `--text-h3`, `--text-body`, `--text-small` y `--text-code`
    (este último con `--font-mono`)
- **CA-4.5**
  - **Dado** `BaseLayout` y el sitio generado
  - **Cuando** ejecuto `bun run build` e inspecciono `dist/index.html`
  - **Entonces** la página aplica los estilos globales y sigue sin contener JavaScript de
    cliente

## Contenido

No aplica: esta spec no muestra datos de `docs/cv.md`.

Fuente de todos los valores: `designs/000-design-system/design.md`.

## Diseño

No aplica: spec sin interfaz propia; implementa el sistema de diseño aprobado.

**Requisito previo a `/plan-spec 002`**: refinar la documentación de
`designs/000-design-system/design.md` con `/design-spec system` (sin regenerar el canvas)
para que:
- cada token tenga su valor CSS exacto, con valores móvil y escritorio en columnas
  separadas cuando difieran (sin valores descritos en prosa);
- documente el breakpoint de 768px para valores no fluidos;
- documente el token de selección de texto: fondo `--color-accent` al 35 % y texto
  `--color-text`.

## Fuera de alcance

- Componentes: botones, enlaces con icono, etiquetas, badges, cards, bloque de código,
  iconografía.
- Patrones de movimiento P-1 a P-7 (reveals, spotlight, borde luminoso, scramble, hero,
  View Transitions, tilt) y cualquier script.
- Diseño y contenido de la home; la página `index` técnica de la spec 001 solo recibe los
  estilos base.
- Uso del estilo `--text-display` en elementos concretos (lo decide cada spec visual).
- Favicon, metadatos sociales y SEO.
- Tema claro.

## Registro de decisiones

| Fecha | Tipo | Pregunta / Conflicto | Decisión | Fuente |
|-------|------|----------------------|----------|--------|
| 2026-09-13 | Implícita | Valores de los tokens | Los de `designs/000-design-system/design.md` (aprobado) | design.md |
| 2026-09-13 | Implícita | Tecnología de estilos | CSS nativo con variables globales | constitution.md §6 |
| 2026-09-13 | Implícita | Carga de fuentes | Autoalojadas con `font-display: swap` | constitution.md §7 |
| 2026-09-13 | Implícita | Solo tema oscuro | Sin tema claro | design.md |
| 2026-09-13 | Brecha | Origen de los archivos de fuente | API de fuentes integrada de Astro, sin dependencias nuevas (el primer build necesita red) | usuario |
| 2026-09-13 | Brecha | Alcance además de los tokens | Tokens + estilos base + fondo de página (grid y halo), aplicados desde `BaseLayout` | usuario |
| 2026-09-13 | Brecha | Qué se verifica con tests | Tokens = design.md, contraste AA calculado, extremos de la escala fluida y fuentes autoalojadas | usuario |
| 2026-09-13 | Brecha | Red de seguridad para reduced motion | Tokens de duración y stagger a `0ms` con `prefers-reduced-motion: reduce` | usuario |
| 2026-09-13 | Brecha | Valores móvil/escritorio no fluidos | Breakpoint único en 768px | usuario |
| 2026-09-13 | Brecha | Color de selección no documentado | Fondo `--color-accent` al 35 % y texto `--color-text`, documentado en design.md | usuario |
| 2026-09-13 | Contradicción | "Tokens = design.md" vs. valores en prosa en design.md | Normalizar design.md con `/design-spec system` antes de planificar | usuario |
| 2026-09-13 | Brecha | Tipografía por defecto de elementos | `h1`–`h3`, `p`, `small` y `code` usan sus tokens de texto | usuario |
