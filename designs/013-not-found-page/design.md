---
id: 013
title: Página 404
spec: specs/013-not-found-page/spec.md
status: approved
canvas: https://claude.ai/artifact/XRnJCaHqhnpKY8DutvtVKw
created: 2026-09-19
updated: 2026-09-19
---

# Diseño — Página 404

## Dirección elegida

**Dirección A · "Señal"**, elegida entre tres exploradas sobre el sistema de diseño aprobado
(A · Señal, B · Tarjeta, C · Ruta). Sin combinar elementos de B ni C; las descartadas se
conservan en el canvas.

Un "404" enorme en mono, centrado y con halo cian, que se descifra al cargar; debajo, el título,
una línea y el botón "Volver al inicio". Arriba solo la marca; abajo el footer de contacto.

- **Motivo**: es la más directa (se entiende en un segundo) y la que mejor luce el único
  momento de movimiento, el descifrado.
- **Riesgo asumido**: una 404 centrada es un formato común → la mono, el halo cian, la
  cuadrícula del sitio y el descifrado la hacen propia de la dirección creativa.

## Pantallas

| Pantalla | Artboard móvil | Artboard escritorio | Criterios de la spec que cubre |
|----------|----------------|---------------------|--------------------------------|
| 404 · cabecera, pantalla e inicio del footer; hover (escritorio) y foco (móvil) de "Volver al inicio" | `A · Señal — Móvil 390` | `A · Señal — Escritorio 1440` | CA-1.1, CA-1.2, CA-1.3, CA-3.3 |
| Descifrado del "404" · fotogramas y reduced motion | — | `Movimiento — Descifrado del 404` | CA-3.1, CA-3.2 |

## Composición y jerarquía

- **Fondo**: el de página del sistema (`--color-bg`, cuadrícula y `--page-halo`).
- **Cabecera** (antes de `main`, no fija): alto `--nav-height`, fondo `--color-nav-bg`, borde
  inferior `--border-width` `--color-border`, contenido con `--section-max-width` y
  `--space-gutter`; solo la **marca** de la barra de navegación (punto de luz
  `--nav-marker-size` en `--color-glow` con `--shadow-nav-marker` y "LMGV" en mono, nombre
  completo como nombre accesible), enlazando a `/`, con el foco del sistema.
- **`main`**: alto mínimo de la ventana menos la cabecera (`--hero-min-height` −
  `--nav-height`), padding `--space-section` / `--space-gutter`; contenido centrado en vertical
  y horizontal, texto centrado, en columna:
  1. **"404"**: `--font-mono`, `--not-found-code-size`, peso `--text-display-weight`, tracking
     `--text-display-tracking`, `line-height` ajustada, `--color-text`, sombra de texto
     `--shadow-glow-text`.
  2. **`h1` "Página no encontrada"**: tokens `--text-h1-*`, `--color-text`, separado
     `--space-6` del código.
  3. **Línea** "La ruta que buscas no existe o se ha movido.": `--text-body-*`,
     `--color-text-muted`, separada `--space-3` del título.
  4. **"Volver al inicio"** (enlace a `/` con el patrón del **botón secundario** del sistema),
     separado `--space-6`: alto `--control-height`, padding `--control-padding-x`,
     `--radius-md`, fondo `--color-secondary-bg`, borde `--border-width`
     `--color-border-strong`, texto `--color-text` con `--control-font-size` y
     `--control-font-weight`, flecha ← de línea (`--icon-size-sm`, `--icon-stroke`) en
     `--color-text-muted` a la izquierda con separación `--space-2`.
     - **Hover**: borde `--color-accent`, `--shadow-glow-secondary`, flecha `--color-glow`.
     - **Foco**: `--focus-ring` y `--focus-ring-offset`.
- **Footer**: el `SiteFooter` de la spec 011, sin cambios.
- **Momento protagonista**: el descifrado del "404".

## Componentes

- **Cabecera de marca** (nuevo): la marca de la navegación sin lista de enlaces ni botón
  "Menú".
- **Pantalla 404** (nuevo): código, título, línea y botón, con la anatomía anterior.
- **Botón secundario con icono** (sistema) para "Volver al inicio".
- **Footer** (spec 011), reutilizado.

## Especificación de movimiento

### M-1 — Descifrado del "404" (patrón P-4)

- **Disparador**: carga de la página, una sola vez, con JavaScript activo y sin
  `prefers-reduced-motion: reduce`.
- **Elementos**: los tres caracteres del "404".
- **Propiedades**: el texto de cada posición (caracteres mono aleatorios en `--color-glow`
  hasta fijarse en su dígito en `--color-text`); no cambia el tamaño ni la posición (fuente
  monoespaciada).
- **Duración / easing**: `--duration-scramble`, las posiciones se fijan de izquierda a derecha
  repartidas en esa duración.
- **Estado inicial → final**: caracteres aleatorios → "404".
- **Implementación**: script nativo mínimo, reutilizando la lógica del descifrado del hero
  (`src/lib/hero-motion.ts` o equivalente) si encaja; sin dependencias.
- **Justificación de Motion**: no aplica (sin Motion).
- **Accesibilidad**: el nombre accesible del código es siempre "404"; los caracteres
  intermedios no se anuncian.
- **Reduced motion**: "404" directamente, sin descifrado.
- **Sin JavaScript**: "404" en el HTML.
- **Fotogramas en canvas**: `Movimiento — Descifrado del 404` (t = 0, 200 ms, 400 ms, 600 ms
  final, Reduced motion · sin JS).

### M-2 — Hover y foco de "Volver al inicio"

- **Propiedades**: color del borde, sombra y color de la flecha.
- **Duración / easing**: `--duration-fast` / `--ease-out`, solo sin reduced motion.
- **Reduced motion**: cambio inmediato.

**Coste**: solo el script del descifrado en la 404 (≤ 3 kB con gzip, spec 013 CA-3.2).

## Cambios a incorporar al sistema

| Token | Modo | Móvil | Escritorio | Uso |
|-------|------|-------|------------|-----|
| `--not-found-code-size` | fluido | `112px` | `208px` | Tamaño del "404" |
| `--shadow-glow-text` | fijo | `0 0 60px rgba(34, 211, 238, 0.45), 0 0 18px rgba(34, 211, 238, 0.25)` | — | Halo del texto protagonista (el "404") |

Además, los iconos del sitio y `theme-color` pasan de `SeoHead` a `BaseLayout` (spec 013,
CA-2.2).

## Accesibilidad

- **Contraste** (tokens del sistema): "404" y título `--color-text` 17.1:1; línea
  `--color-text-muted` 6.8:1; botón `--color-text` sobre `--color-secondary-bg` ≥ 16:1; foco
  `--color-glow` 11.1:1.
- **Estructura**: cabecera → `main` (código, `h1`, párrafo, enlace) → `footer`; un único `h1`.
- **Teclado**: marca → "Volver al inicio" → enlaces del footer, con foco visible; objetivo
  táctil ≥ 44 px (`--control-height`).
- **Descifrado**: nombre accesible fijo "404".
- **Sin JavaScript y reduced motion**: todo visible, sin animación.

## Anti-clichés

- **Ilustraciones de astronautas, emojis o bromas**: no hay; tono técnico y sobrio.
- **Typewriter con frases rotativas**: no; un único descifrado del "404" (alternativa propia de
  la dirección creativa).
- **Animaciones sin jerarquía**: un único momento de movimiento.

## Registro de decisiones

| Fecha | Tipo | Pregunta / Conflicto | Decisión | Fuente |
|-------|------|----------------------|----------|--------|
| 2026-09-19 | Brecha | Qué explorar | 3 composiciones: A · Señal, B · Tarjeta, C · Ruta | usuario |
| 2026-09-19 | Diseño | Composición de la 404 | A · Señal, sin combinar | usuario |
| 2026-09-19 | Implícita | "Volver al inicio" | Botón secundario del sistema con flecha ← | designs/000-design-system |
| 2026-09-19 | Implícita | Tamaño y halo del "404" | Tokens nuevos `--not-found-code-size` (112 → 208 px) y `--shadow-glow-text` | canvas |
| 2026-09-19 | Implícita | Cabecera | Solo la marca de la navegación, no fija | specs/013-not-found-page, specs/010-navigation |
