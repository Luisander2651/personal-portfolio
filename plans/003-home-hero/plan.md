---
id: 003
title: Hero de la home
spec: specs/003-home-hero/spec.md
design: designs/003-home-hero/design.md
status: approved
created: 2026-09-13
updated: 2026-09-13
---

# Plan — Hero de la home

Leyenda: `[ ]` pendiente · `[x]` hecha · `[-]` obsoleta · una tarea `[ ]` con línea
**Bloqueo** está detenida por `/implement` hasta resolver una brecha.

## Resumen

| Capa | Tareas |
|------|--------|
| Sistema (incorporar tokens y estilos base) | T01 |
| Datos | T02, T03 |
| Estructura estática | T04 |
| Estilos | T05 |
| Movimiento e interacción | T06, T07 |
| Pulido | — (incluido en T05 y T07) |
| Verificación final | T08 |

## Cobertura de criterios

| Criterio | Tareas |
|----------|--------|
| CA-1.1 | T04, T08 |
| CA-1.2 | T04 |
| CA-1.3 | T02 |
| CA-2.1 | T04 |
| CA-2.2 | T01, T05, T08 |
| CA-3.1 | T03, T06, T07, T08 |
| CA-3.2 | T03, T04 |
| CA-3.3 | T06, T07, T08 |
| CA-3.4 | T04, T07, T08 |
| CA-4.1 | T07, T08 |
| CA-4.2 | T05 |
| CA-4.3 | T08 |

## Tareas

### [x] T01 — Incorporar al sistema los tokens del hero y el reinicio de margen

- **Criterios**: — (soporte de CA-2.2 y CA-4.2)
- **Diseño**: sección "Tokens a incorporar al sistema" de `designs/003-home-hero/design.md`
- **Archivos**: `designs/000-design-system/design.md`, `src/styles/tokens.css`,
  `src/styles/base.css`, `tests/styles/base.test.ts` (modificar)
- **Qué hacer**:
  - En `designs/000-design-system/design.md`: `--icon-frame-size` pasa a `48px` (móvil) /
    `52px` (escritorio); nueva tabla "Hero" con `--hero-min-height`, `--hero-card-max-width`,
    `--hero-card-padding`, `--hero-card-gap`, `--hero-caret-width` y `--hero-caret-height`
    (modos y valores de `designs/003-home-hero/design.md`); `body` con `margin: 0` en
    "Estilos base"; entradas en su registro de decisiones.
  - En `tokens.css`: los mismos cambios, respetando los modos `fijo` y `768`.
  - En `base.css`: `margin: 0` en `body`.
  - Todo en un único commit para que los tests no queden en rojo.
- **Test**: el test de tokens existente (spec 002) falla tras actualizar `design.md` (6 tokens
  que faltan y un valor distinto) y pasa al actualizar `tokens.css`; `base.test.ts` comprueba
  `margin: 0` en `body`.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.

### [x] T02 — Stack destacado en `profile`

- **Criterios**: CA-1.3
- **Diseño**: —
- **Archivos**: `src/content/schemas.ts`, `src/content/profile/profile.md`,
  `tests/content/schemas.test.ts`, `tests/content/entries.test.ts` (modificar)
- **Qué hacer**:
  - Campo obligatorio `featuredStack` en el esquema de `profile`: lista no vacía de textos.
  - En `profile.md`: `featuredStack` con `TypeScript`, `Node.js`, `Laravel 12`,
    `Spring Boot`, en ese orden.
- **Test**: el esquema rechaza `profile` sin `featuredStack` o con lista vacía; la entrada real
  tiene exactamente esos cuatro valores en ese orden; cada valor aparece en `docs/cv.md`.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.

### [x] T03 — Líneas del código decorativo desde `profile`

- **Criterios**: CA-3.2, CA-3.1 (soporte)
- **Diseño**: bloque de código de M-1 (`A · Escenario — Secuencia y enlaces`, F1–F2)
- **Archivos**: `src/lib/hero-code.ts`, `tests/lib/hero-code.test.ts` (crear)
- **Qué hacer**:
  - Función pura `buildProfileCodeLines` que recibe `name`, `role` y `featuredStack` y
    devuelve las líneas del código decorativo como listas de segmentos con texto y tipo
    (`keyword`, `string`, `function`, `plain`):
    `const profile = {` · `name: "…",` · `role: "…",` · `stack: ["…", …],` · `};` ·
    `render(profile);`
- **Test**: con datos de prueba, el texto de cada línea es el esperado y usa los datos
  recibidos (nada incrustado); `const` es `keyword`, los valores entre comillas son `string`,
  `render` es `function`; el stack conserva el orden.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.

### [x] T04 — `HomeHero` estático

- **Criterios**: CA-1.1, CA-1.2, CA-2.1, CA-3.2, CA-3.4
- **Diseño**: `A · Escenario — Escritorio 1440`, `A · Escenario — Móvil 390` (estado final)
- **Archivos**: `src/components/HomeHero.astro`, `tests/components/home-hero.test.ts`
  (crear); `src/pages/index.astro` (modificar); `src/components/ProfileHeading.astro`,
  `tests/components/profile-heading.test.ts` (eliminar)
- **Qué hacer**:
  - `HomeHero` con props `name`, `role`, `location`, `featuredStack`, `github`, `linkedin` y
    `email`; sección con el hueco del hero que contiene:
    - bloque de código con las líneas de `buildProfileCodeLines`, `aria-hidden="true"` y oculto
      por defecto (no visible sin JavaScript);
    - tarjeta: fila con ubicación e indicador `render(profile)` (`aria-hidden`), `h1` con el
      nombre, párrafo con el rol, lista de etiquetas del stack y fila de tres enlaces
      (`<a>` con icono SVG `aria-hidden` y `aria-label` "GitHub", "LinkedIn", "Correo";
      correo con `mailto:`; sin `target`).
  - `index.astro` obtiene `profile` y renderiza `HomeHero` dentro de `main`; `<title>` y
    descripción siguen saliendo de `getPageMeta`.
  - Se eliminan `ProfileHeading` y su test (su `h1` "Nombre — Rol" queda superado por la spec 003).
  - Sin estilos ni scripts todavía.
- **Test**: renderizado con Container API y datos de prueba: un único `h1` con el nombre; el
  rol en un párrafo fuera del `h1`; la ubicación y las cuatro etiquetas en orden; exactamente
  tres enlaces con sus `href` (incluido `mailto:`), sin `target` y con su `aria-label`; el
  bloque de código tiene `aria-hidden="true"`, está oculto y contiene las líneas generadas;
  el indicador es `aria-hidden`.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - `dist/index.html` contiene nombre, rol, ubicación, stack y enlaces reales sin ejecutar JS.

### [x] T05 — Estilos del hero y estado de los enlaces

- **Criterios**: CA-4.2, CA-2.2
- **Diseño**: `A · Escenario — Escritorio 1440`, `A · Escenario — Móvil 390`; M-3 en
  `A · Escenario — Secuencia y enlaces` (Enlaces)
- **Archivos**: `src/components/HomeHero.astro` (modificar),
  `tests/components/home-hero-styles.test.ts` (crear)
- **Qué hacer**:
  - Estilos scoped del componente, mobile-first y solo con tokens: hero de al menos
    `--hero-min-height`, centrado, margen lateral `--space-gutter`; hueco de ancho máximo
    `--hero-card-max-width` con código y tarjeta superpuestos; tarjeta con `--border-glow`,
    `--shadow-glow-hero`, `--hero-card-padding`, `--hero-card-gap`; tipografía y colores de
    `designs/003-home-hero/design.md`; indicador `render(profile)` visible solo desde 768px;
    bloque de código con `--code-padding`, `pre-wrap` y recortado al hueco.
  - M-3 (CSS): enlaces con marco `--icon-frame-size`; en hover con puntero fino y en
    `:focus-visible`, `--border-glow` + `--shadow-glow-soft` y color `--color-text` con
    `--duration-base` / `--ease-out`; en `hover: none`, borde luminoso al tocar.
- **Test**: lee los estilos del componente (`?raw`) y comprueba que no hay colores, tamaños,
  espaciados ni duraciones literales (salvo palabras clave y `0`); que usan
  `--hero-min-height`, `--hero-card-max-width`, `--hero-card-padding`, `--hero-card-gap` e
  `--icon-frame-size`; que existen la regla de 768px del indicador, la regla de hover con
  puntero fino, la de `:focus-visible` y la de `hover: none`.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - Comprobación manual en Chrome a 390px y 1440px contra `A · Escenario — Móvil 390` y
    `A · Escenario — Escritorio 1440`; estados de enlace reposo, hover y foco contra la
    lámina de enlaces; sin scroll vertical en el hero.

### [ ] T06 — Utilidades de movimiento

- **Criterios**: CA-3.1 (soporte), CA-3.3 (soporte)
- **Diseño**: M-1 y M-2 de `designs/003-home-hero/design.md`
- **Archivos**: `src/lib/hero-motion.ts`, `tests/lib/hero-motion.test.ts` (crear)
- **Qué hacer**:
  - `parseCssDuration`: convierte un valor computado de duración a milisegundos; admite `ms`,
    `s` y la forma minificada (`.4s`, `0s`).
  - `scrambleText`: dado un texto, un progreso entre 0 y 1 y un generador de glifos, devuelve
    el texto con los caracteres ya resueltos de izquierda a derecha según el progreso y el
    resto sustituidos; conserva los espacios; con progreso 1 devuelve el texto original.
- **Test**: `400ms` → 400, `.4s` → 400, `0s` → 0, `1.2s` → 1200; valores inválidos fallan de
  forma explícita; `scrambleText` con progreso 0 no revela ningún carácter (salvo espacios),
  con progreso 1 devuelve el original y a mitad resuelve la primera mitad; usa el generador
  recibido (determinista en test).
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.

### [ ] T07 — Animación del hero (M-1 y M-2)

- **Criterios**: CA-3.1, CA-3.3, CA-3.4, CA-4.1
- **Diseño**: M-1 y M-2; fotogramas F1, F2, F3 y Reduced motion de
  `A · Escenario — Secuencia y enlaces`
- **Archivos**: `src/components/HomeHero.astro` (modificar),
  `tests/components/home-hero-motion.test.ts` (crear)
- **Qué hacer**:
  - Script en línea mínimo situado antes del hueco del hero: si no hay
    `prefers-reduced-motion: reduce`, marca el documento con un atributo de "animación
    pendiente" antes de pintar la tarjeta.
  - Estilos (tokens) bajo ese atributo: tarjeta en su estado inicial de F3 y bloque de código
    visible con las líneas ocultas.
  - Script del componente (Web Animations API, sin dependencias): lee las duraciones y
    easings de los tokens con `parseCssDuration`; ejecuta F1 (líneas con `--stagger` y caret),
    F2 (desenfoque y brillo con `--hero-compile-blur`/`--hero-compile-brightness`, borde y
    sombra), F3 (tarjeta) y M-2 con `scrambleText` sobre el `h1`; una sola vez; al terminar
    retira el atributo y oculta el código.
  - Respaldo: si la animación no arranca en el tiempo total de los tokens, o falla, se retira
    el atributo y la tarjeta queda visible.
  - Con reduced motion o sin JavaScript no se marca el documento: tarjeta final directa.
- **Test**: el componente renderizado incluye el script en línea con la comprobación de
  `prefers-reduced-motion`; los estilos bajo el atributo de animación solo usan tokens; sin el
  atributo, la tarjeta no tiene estilos que la oculten; el bloque de código sigue
  `aria-hidden` y el `h1` conserva el nombre real en el HTML.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - JavaScript de cliente de la home en `dist/` ≤ 3 kB con gzip (medido con Bun, sin dependencias).
  - Comprobación manual en Chrome: secuencia contra F1, F2 y F3 y descifrado del nombre una
    sola vez; con reduced motion emulado, tarjeta directa; con JavaScript desactivado, tarjeta
    completa y sin código visible.

### [ ] T08 — Verificación final

- **Criterios**: todos
- **Diseño**: todos los artboards de la composición A
- **Archivos**: —
- **Qué hacer**: verificación completa de la spec.
- **Test**: cada CA tiene cobertura:
  - CA-1.1, CA-1.2, CA-2.1 → `tests/components/home-hero.test.ts` + revisión de `dist/`
  - CA-1.3 → `tests/content/schemas.test.ts` + `tests/content/entries.test.ts`
  - CA-2.2 → `tests/components/home-hero-styles.test.ts` + prueba con teclado
  - CA-3.1 → `tests/lib/hero-code.test.ts` + `tests/lib/hero-motion.test.ts` + revisión visual
  - CA-3.2 → `tests/lib/hero-code.test.ts` + `tests/components/home-hero.test.ts`
  - CA-3.3, CA-3.4 → `tests/components/home-hero-motion.test.ts` + comprobación manual
  - CA-4.1 → medición de `dist/`
  - CA-4.2 → `tests/components/home-hero-styles.test.ts`
  - CA-4.3 → Lighthouse
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - `dist/index.html`: datos del hero y enlaces presentes sin JS; único script de la home
    ≤ 3 kB con gzip.
  - Teclado: Tab recorre GitHub → LinkedIn → Correo con foco visible.
  - Reduced motion y JavaScript desactivado revisados.
  - Contraste AA según tokens (sin valores nuevos de color).
  - Revisión visual a 390px y 1440px contra la composición A.
  - Lighthouse ≥ 90 en todas las categorías (DevTools sobre `bun run preview`).

## Registro de decisiones

| Fecha | Tipo | Decisión | Motivo |
|-------|------|----------|--------|
| 2026-09-13 | Creación | Plan inicial de 8 tareas | — |
| 2026-09-13 | Bloqueo resuelto | Antes de planificar se refinó `designs/003-home-hero/design.md`: `margin: 0` del `body` a incorporar al sistema | El hero de `100svh` desbordaba por el margen por defecto del navegador; aplicado a petición del usuario |
| 2026-09-13 | Planificación | T01 incorpora tokens, `--icon-frame-size` y `margin: 0` a `designs/000`, `tokens.css` y `base.css` en un solo commit | Mantener en verde el test de tokens de la spec 002 |
| 2026-09-13 | Planificación | Nombres: campo `featuredStack`, componente `HomeHero` | Identificadores en inglés (constitución §9) |
| 2026-09-13 | Planificación | Se eliminan `ProfileHeading` y su test | La spec 003 supera el `h1` "Nombre — Rol" de la spec 001 |
| 2026-09-13 | Planificación | Código decorativo, lectura de duraciones y scramble como funciones puras en `src/lib/` | Testeables sin DOM (constitución §4 y §5) |
| 2026-09-13 | Planificación | Script en línea antes de la tarjeta + respaldo que la muestra si la animación no arranca | Evitar el parpadeo de la tarjeta sin arriesgar que quede oculta (CA-3.4) |
| 2026-09-13 | Planificación | Estilos scoped en `HomeHero.astro`, leídos en tests con `?raw` | CSS nativo scoped (constitución §6); si Vitest no lo permite, `/implement` bloquea la tarea |
| 2026-09-13 | Planificación | JS medido con gzip de Bun | Sin dependencias nuevas |
| 2026-09-13 | Planificación | Código decorativo con `pre-wrap` y recortado al hueco de la tarjeta | Como en los fotogramas del canvas; sin salto de layout |
| 2026-09-14 | Implementación (T03) | Los valores del código decorativo se escriben como cadenas JavaScript escapadas (acentos intactos, comillas escapadas) | Un valor con comillas no rompe el código mostrado |
| 2026-09-14 | Implementación (T04) | Las líneas del código son `<span class="code-line">` sin saltos de línea explícitos; en T05 se muestran como bloque | `astro check` no admite expresiones con `'\n'` dentro de `<pre>` (el compilador sí); evita el error sin cambiar el resultado |
| 2026-09-14 | Implementación (T04) | El grosor de trazo de los iconos (`--icon-stroke`) se aplica por CSS en T05 | T04 no incluye estilos |
| 2026-09-14 | Incidencia (T04) | En `astro dev` la home fallaba con `featuredStack` indefinido (build y tests correctos); se resolvió borrando las cachés de contenido (`.astro/` y `node_modules/.astro/data-store.json`) y reiniciando el servidor de desarrollo | Caché de contenido de desarrollo desfasada tras cambiar el esquema en T02; no requiere cambios de código |
| 2026-09-14 | Implementación (T05) | `h1` y rol agrupados en `.hero-identity` con separación `--space-3` | El artboard separa nombre y rol menos que el resto de bloques y no hay token propio; se usa el existente más cercano |
| 2026-09-14 | Implementación (T05) | Relleno vertical del hero `--space-gutter` | Evitar que una tarjeta más alta que la pantalla toque los bordes; token existente |
| 2026-09-14 | Implementación (T05) | M-3 con capa `::before` (gradiente, `opacity` 0 → 1) y relleno interior `::after` | Los gradientes no se transicionan; con `isolation` la capa negativa se pinta sobre el fondo, así que `::after` limita el gradiente al anillo (defecto visto en la revisión y corregido) |
| 2026-09-14 | Verificación (T05) | Chrome 1440px y 390px: tarjeta 560px / 342px, `h1` 48px / 30px, indicador solo desde 768px, enlaces 52px / 48px, sin scroll vertical; hover y foco confirmados por el usuario | Coincide con la composición A |
