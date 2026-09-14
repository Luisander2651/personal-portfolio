---
id: 003
title: Hero de la home
spec: specs/003-home-hero/spec.md
status: approved
canvas: https://claude.ai/code/artifact/1fd35525-0141-41e5-8257-a47f545f0423
created: 2026-09-13
updated: 2026-09-13
---

# Diseño — Hero de la home

## Dirección elegida

**Composición A · "Escenario"**, elegida entre tres exploradas sobre el sistema de diseño
aprobado (A · Escenario, B · Split asimétrico, C · Consola a sangre). Sin combinar elementos
de B ni C.

El código y la tarjeta son una única pieza centrada en el viewport: el bloque de código se
escribe y compila en el mismo hueco que después ocupa la tarjeta. Es la composición más
fiel al patrón P-5 del sistema y la más limpia; el hero tiene un solo foco visual.

## Pantallas

| Pantalla | Artboard móvil | Artboard escritorio | Criterios de la spec que cubre |
|----------|----------------|---------------------|--------------------------------|
| Hero · estado final (F3) | `A · Escenario — Móvil 390` | `A · Escenario — Escritorio 1440` | CA-1.1, CA-1.2, CA-2.1, CA-4.2 |
| Hero · secuencia F1 → F3 | — | `A · Escenario — Secuencia y enlaces` (F1, F2, F3) | CA-3.1, CA-3.2 |
| Hero · reduced motion / sin JavaScript | — | `A · Escenario — Secuencia y enlaces` (Reduced motion) | CA-3.3, CA-3.4 |
| Enlaces · reposo, hover y foco | `A · Escenario — Móvil 390` | `A · Escenario — Secuencia y enlaces` (Enlaces) | CA-2.1, CA-2.2 |

## Composición y jerarquía

- **Hero**: ocupa al menos `--hero-min-height`; contenido centrado vertical y
  horizontalmente; margen lateral `--space-gutter`.
- **Hueco del hero**: ancho máximo `--hero-card-max-width` (100 % del ancho útil en móvil).
  La tarjeta define el alto del hueco; el bloque de código se superpone en el mismo hueco,
  por lo que no hay salto de layout entre F1 y F3.
- **Orden de lectura dentro de la tarjeta** (igual en móvil y escritorio):
  1. Fila superior: ubicación (etiqueta mono) y, **solo desde 768px**, el indicador
     `render(profile)` alineado a la derecha.
  2. `h1` con el nombre.
  3. Rol como subtítulo (párrafo).
  4. Etiquetas del stack destacado.
  5. Separador y fila de enlaces: GitHub, LinkedIn, Correo.
- **Momento protagonista**: la secuencia M-1; ningún otro elemento se anima al cargar.

## Componentes

Componentes del sistema usados:

- **Tarjeta del hero** (variante de la card de proyecto): fondo `--color-surface`, borde
  `--border-glow` visible en reposo y sombra `--shadow-glow-hero` (única tarjeta con borde
  luminoso en reposo, según las reglas de uso); `--radius-lg`; padding `--hero-card-padding`;
  separación entre bloques `--hero-card-gap`.
- **Ubicación**: etiqueta mono (`--text-mono-label-*`, `--color-text-muted`).
- **Indicador `render(profile)`**: `--font-mono`, `--tag-font-size`, `--color-code-function`;
  decorativo (oculto a lectores de pantalla); oculto por debajo de 768px.
- **`h1`**: tokens `--text-h1-*`, color `--color-text`.
- **Rol**: `--text-h3-size`, `--text-h3-line-height`, `--color-text-secondary`, peso normal.
- **Etiquetas del stack**: etiqueta de tecnología del sistema, separación `--space-2`.
- **Separador**: borde superior `--border-width` `--color-border`; separación superior
  `--hero-card-gap`.
- **Enlaces**: icono enmarcado del sistema como enlace (`<a>`): marco `--icon-frame-size`,
  icono `--icon-size-md`, trazo `--icon-stroke`, `--radius-md`, borde `--color-border`,
  color `--color-text-secondary`; separación `--space-3`. Nombre accesible en español
  ("GitHub", "LinkedIn", "Correo").
  - **Hover (puntero fino)**: color `--color-text`, `--border-glow` y `--shadow-glow-soft` (M-3).
  - **Foco (`:focus-visible`)**: foco visible del sistema (`--focus-ring`, `--focus-ring-offset`).
  - **Táctil (`hover: none`)**: `--border-glow` al tocar.
- **Bloque de código**: componente del sistema sin cabecera; `--text-code-*`,
  `--code-padding`, colores de sintaxis del sistema; caret de `--hero-caret-width` ×
  `--hero-caret-height` en `--color-glow`. Contenido generado desde `profile`
  (`name`, `role` y stack destacado) seguido de `render(profile);`. Decorativo
  (oculto a lectores de pantalla).

### Tokens a incorporar al sistema

Estos cambios se documentan aquí y **se incorporan a `designs/000-design-system/design.md`
y a `tokens.css` en la primera tarea del plan 003, en el mismo commit**, para que el test de
tokens de la spec 002 no quede en rojo entre el diseño y la implementación.

| Token | Modo | Móvil | Escritorio | Uso |
|-------|------|-------|------------|-----|
| `--icon-frame-size` (cambia) | 768 | `48px` | `52px` | Marco de icono; objetivo táctil ≥ 44px (antes `36px` en móvil) |
| `--hero-min-height` | fijo | `100svh` | — | Alto mínimo del hero (pantalla completa) |
| `--hero-card-max-width` | fijo | `560px` | — | Ancho máximo de la tarjeta y del hueco del código |
| `--hero-card-padding` | 768 | `24px` | `40px` | Padding de la tarjeta del hero |
| `--hero-card-gap` | 768 | `18px` | `24px` | Separación entre bloques de la tarjeta del hero |
| `--hero-caret-width` | fijo | `8px` | — | Ancho del caret de escritura |
| `--hero-caret-height` | fijo | `16px` | — | Alto del caret de escritura |

## Especificación de movimiento

### M-1 — Hero código → tarjeta (patrón P-5)

- **Disparador**: carga de la página, una sola vez, si hay JavaScript y no hay
  `prefers-reduced-motion: reduce`.
- **Elementos**: bloque de código y tarjeta, superpuestos en el hueco del hero.
- **Propiedades**: `opacity`, `transform` y `filter`.
- **Duración / easing**:
  1. F1 · escritura: `--duration-hero-type` en total, `--stagger` por línea.
  2. F2 · compilación: `--duration-hero-compile` / `--ease-in-out`.
  3. F3 · tarjeta: `--duration-reveal` / `--ease-out`.
- **Estado inicial → final**:
  - Inicio: bloque de código visible y vacío; tarjeta con `opacity: 0` (ocupando su hueco).
  - F1: las líneas del código aparecen una a una; caret visible al final de la línea en curso.
  - F2: el bloque pasa a `filter: blur(var(--hero-compile-blur)) brightness(var(--hero-compile-brightness))`,
    borde `--color-glow` y sombra `--shadow-glow-hero`; al terminar, `opacity: 0`.
  - F3: la tarjeta pasa de `opacity: 0` y `translateY(var(--hero-card-distance))` a
    `opacity: 1` y `translateY(0)`; el bloque de código se retira del flujo visual.
- **Secuencia / stagger**: F1 → F2 → F3 → M-2, cada fase al terminar la anterior.
- **Implementación**: Web Animations API (script nativo mínimo, sin dependencias).
- **Justificación de Motion**: no aplica (sin Motion).
- **Reduced motion**: tarjeta final directamente, sin bloque de código, desenfoque ni M-2.
- **Sin JavaScript**: tarjeta final visible desde el HTML; el bloque de código no se muestra.
- **Táctil**: no depende del cursor.
- **Fotogramas en canvas**: `A · Escenario — Secuencia y enlaces` (F1, F2, F3, Reduced motion).

### M-2 — Descifrado del nombre (patrón P-4)

- **Disparador**: fin de M-1 (F3), una sola vez.
- **Elementos**: texto del `h1`.
- **Propiedades**: sustitución de caracteres por glifos de `--font-mono` que se resuelven
  de izquierda a derecha hasta el nombre real.
- **Duración / easing**: `--duration-scramble` / lineal.
- **Estado inicial → final**: caracteres aleatorios → nombre real.
- **Implementación**: script nativo mínimo (el mismo del hero). El nombre real permanece en
  el HTML y es el que leen los lectores de pantalla.
- **Reduced motion**: nombre final directo, sin descifrado.
- **Táctil**: no depende del cursor.
- **Fotogramas en canvas**: `A · Escenario — Secuencia y enlaces` (F3).

### M-3 — Borde luminoso de los enlaces (patrón P-3)

- **Disparador**: hover con puntero fino, `:focus-visible` o toque.
- **Elementos**: marco del icono enlazado.
- **Propiedades**: capa del borde luminoso y sombra (`opacity` 0 → 1).
- **Duración / easing**: `--duration-base` / `--ease-out`.
- **Estado inicial → final**: borde `--color-border` → `--border-glow` + `--shadow-glow-soft`;
  icono `--color-text-secondary` → `--color-text`.
- **Implementación**: CSS.
- **Reduced motion**: cambio sin transición.
- **Táctil**: borde luminoso al tocar.
- **Fotogramas en canvas**: `A · Escenario — Secuencia y enlaces` (Enlaces: reposo, hover, foco).

## Accesibilidad

- **Contraste** (tokens del sistema, calculados): nombre `--color-text` 16.2:1 y rol
  `--color-text-secondary` 12.8:1 sobre `--color-surface`; ubicación `--color-text-muted`
  6.5:1; etiquetas `--color-tag-text` ≥ 4.5:1 sobre `--color-tag-bg`; anillo de foco
  `--color-glow` 11.1:1 sobre `--color-bg`.
- **Encabezados**: un único `h1` (nombre); rol fuera del `h1`.
- **Enlaces**: nombre accesible en español; orden de tabulación GitHub → LinkedIn → Correo;
  foco visible; objetivo táctil `--icon-frame-size` (48px en móvil, 52px en escritorio).
- **Decorativos ocultos**: bloque de código e indicador `render(profile)`.
- **Contenido sin animación**: todo el contenido y los enlaces existen en el HTML; sin
  JavaScript o con reduced motion se ve la tarjeta final.
- **Duración**: la secuencia completa dura menos de 5 s, sin control de pausa (WCAG 2.2.2).

## Anti-clichés

- **Foto circular + "Hola, soy…"**: evitado; la presentación es el propio código que se
  convierte en tarjeta.
- **Fila de logos de tecnologías sin contexto**: evitado; el stack son etiquetas de texto
  dentro de la tarjeta, junto al rol.
- **Typewriter con frases rotativas**: evitado; se escribe una sola vez el código real del
  perfil y el nombre se descifra una vez.
- **Animaciones en todo**: evitado; un único momento protagonista (M-1) y un estado de
  enlace sobrio (M-3).

## Registro de decisiones

| Fecha | Tipo | Pregunta / Conflicto | Decisión | Fuente |
|-------|------|----------------------|----------|--------|
| 2026-09-13 | Brecha | Qué explorar si el sistema visual ya está fijado | 3 composiciones: Escenario, Split asimétrico, Consola a sangre | usuario |
| 2026-09-13 | Brecha | Altura del hero | Pantalla completa | usuario |
| 2026-09-13 | Brecha | Dónde definir las medidas propias del hero | Tokens del sistema 000 | usuario |
| 2026-09-13 | Brecha | Presentación de los enlaces | Explorada en las composiciones; en A, iconos enmarcados con nombre accesible | usuario |
| 2026-09-13 | Diseño | Composición del hero | A · Escenario, sin combinar | usuario |
| 2026-09-13 | Contradicción | `--icon-frame-size` 36px en móvil vs. objetivo táctil ≥ 44px (constitución §7) | Token del sistema a 48px en móvil / 52px en escritorio | usuario |
| 2026-09-13 | Contradicción | Documentar tokens nuevos en el sistema 000 dejaría en rojo el test de tokens de la spec 002 | Se documentan aquí y se incorporan a 000 y `tokens.css` en la primera tarea del plan 003, en el mismo commit | usuario, constitution.md §5 |
| 2026-09-13 | Implícita | Indicador `render(profile)` | Solo desde 768px, como en los artboards; decorativo | canvas |
| 2026-09-13 | Implícita | Técnica de animación | Web Animations API y script nativo; CSS para M-3; sin Motion | designs/000-design-system, constitution.md §3 |
