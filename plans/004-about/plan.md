---
id: 004
title: Sobre mí
spec: specs/004-about/spec.md
design: designs/004-about/design.md
status: approved
created: 2026-09-15
updated: 2026-09-15
---

# Plan — Sobre mí

Orden de ejecución: T01 → T02 → T05 → T03 → T04.

Leyenda: `[ ]` pendiente · `[x]` hecha · `[-]` obsoleta · una tarea `[ ]` con línea
**Bloqueo** está detenida por `/implement` hasta resolver una brecha.

## Resumen

| Capa | Tareas |
|------|--------|
| Sistema (incorporar tokens, encabezado de sección y P-1) | T01, T05 |
| Datos | T02 |
| Estructura estática, estilos y movimiento (componentes) | T03 |
| Pulido | — (incluido en T03) |
| Verificación final | T04 |

## Cobertura de criterios

| Criterio | Tareas |
|----------|--------|
| CA-1.1 | T03, T04 |
| CA-1.2 | T02 |
| CA-1.3 | T02, T04 |
| CA-2.1 | T02 |
| CA-2.2 | T03 |
| CA-3.1 | T03, T04 |
| CA-4.1 | T03, T04 |
| CA-4.2 | T03, T04 |
| CA-4.3 | T01, T05, T03, T04 |

## Tareas

### [x] T01 — Incorporar al sistema los tokens, el encabezado de sección y el ajuste de P-1

- **Criterios**: CA-4.3
- **Diseño**: `designs/004-about/design.md` → "Tokens a incorporar al sistema" y
  "Encabezado de sección (componente nuevo del sistema)"
- **Archivos**: `designs/000-design-system/design.md` (modificar), `src/styles/tokens.css` (modificar)
- **Qué hacer**:
  - En `designs/000-design-system/design.md`:
    - Sección de tokens nueva "Secciones" con `--section-max-width` y `--section-header-gap`.
    - Sección de tokens nueva "Sobre mí" con `--about-panel-padding`, `--about-panel-gap`,
      `--about-groups-gap` y `--about-text-max-width`.
    - `--reveal-range-length` en "Tokens de movimiento".
    - Componente base "Encabezado de sección" (ruta decorativa + `h2`), tal como lo describe
      el diseño 004.
    - Patrón P-1: progreso ligado al scroll con `--reveal-range-length` y `--ease-out`,
      escalonado por posición, retrocede al subir y sin desenfoque en elementos de gran superficie.
    - Entrada en el registro de decisiones del sistema.
  - En `src/styles/tokens.css`: declarar los 7 tokens con sus valores fijos o de breakpoint
    768, en los grupos correspondientes.
- **Test**: el test de tokens existente (`tests/styles/tokens.test.ts`) compara `design.md` con
  `tokens.css`; se pone en rojo al documentar los tokens y en verde al declararlos. Sin test nuevo.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - Los 7 tokens están documentados y declarados con los valores del diseño 004, en un solo commit.

### [x] T02 — Resumen corregido y puntos clave en el perfil

- **Criterios**: CA-1.2, CA-1.3, CA-2.1
- **Diseño**: —
- **Archivos**: `docs/cv.md` (modificar), `src/content/profile/profile.md` (modificar),
  `src/content/schemas.ts` (modificar), `tests/content/schemas.test.ts` (modificar),
  `tests/content/entries.test.ts` (modificar)
- **Qué hacer**:
  - Corregir el inicio del resumen profesional en `docs/cv.md` y en `profile.summary` con el
    texto de la spec ("Estudiante de Ingeniería en Tecnologías de la Información, especializado
    en Desarrollo de Software Multiplataforma, con experiencia práctica en…"), sin cambiar el resto.
  - Esquema de `profile`: campos `practicalExperience` y `focusAreas`, listas no vacías de texto.
  - `profile.md`: valores exactos y en orden de CA-2.1.
- **Test**:
  - Esquema: rechaza `practicalExperience` o `focusAreas` vacíos o ausentes.
  - Entradas: el resumen empieza por el texto corregido y coincide con `cv.md`;
    `practicalExperience` y `focusAreas` tienen exactamente los valores de CA-2.1 en orden, y
    cada valor aparece en el resumen de `cv.md` sin distinguir la mayúscula inicial.
  - La meta description sigue saliendo de `profile.summary` (test existente de `page-meta`).
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - `docs/cv.md` y `profile` tienen el resumen corregido y los dos campos nuevos.

### [ ] T05 — Actualizar los tokens del revelado en el sistema

Va antes de T03 porque T03 usa estos tokens (añadida al replanificar; ver registro).

- **Criterios**: CA-4.3
- **Diseño**: `designs/004-about/design.md` → "Tokens a incorporar al sistema" (refinado del
  revelado)
- **Archivos**: `designs/000-design-system/design.md` (modificar), `src/styles/tokens.css` (modificar)
- **Qué hacer**:
  - En `designs/000-design-system/design.md`:
    - Añadir `--reveal-range-start` (768: `80px` / `120px`) en "Tokens de movimiento".
    - Cambiar `--reveal-range-length` a `240px` / `360px`.
    - Patrón P-1: el revelado empieza cuando el elemento ha entrado `--reveal-range-start` y
      termina `--reveal-range-length` después, con curva `--ease-in-out`.
    - Entrada en el registro de decisiones del sistema.
  - En `src/styles/tokens.css`: declarar `--reveal-range-start` y actualizar
    `--reveal-range-length` en móvil y desde 768px.
- **Test**: el test de tokens existente (`tests/styles/tokens.test.ts`); se pone en rojo al
  documentar los valores nuevos y en verde al declararlos. Sin test nuevo.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - Sistema y `tokens.css` coinciden con los valores refinados del diseño 004, en un solo commit
    que no incluye el trabajo pendiente de T03.

### [ ] T03 — Componentes de "Sobre mí": estructura, estilos y revelado

Estructura, estilos y tests ya están hechos (sin commit) desde la primera ejecución; al
retomarla solo cambia el revelado M-1 según el refinado del diseño.

- **Criterios**: CA-1.1, CA-2.2, CA-3.1, CA-4.1, CA-4.2, CA-4.3
- **Diseño**: `B · about.md — Móvil 390`, `B · about.md — Escritorio 1440`,
  `B · about.md — Movimiento` · `M-1`
- **Archivos**: `src/components/SectionHeader.astro` (crear),
  `src/components/AboutSection.astro` (crear), `src/pages/index.astro` (modificar),
  `tests/components/section-header.test.ts` (crear),
  `tests/components/about-section.test.ts` (crear),
  `tests/components/about-section-styles.test.ts` (crear)
- **Qué hacer**:
  - **`SectionHeader`** (reutilizable en 005–009). Props: `anchor` (ancla sin `#`), `title`, `headingId`.
    - Marcado: ruta decorativa oculta a lectores de pantalla (`portfolio`, `/`, ancla) y `h2`
      con el id recibido.
    - Estilos con los tokens del componente "Encabezado de sección".
    - Revelado M-1 del encabezado: `opacity`, `transform` y `filter`.
  - **`AboutSection`**. Props: `summary`, `practicalExperience`, `focusAreas`.
    - `section` con id `sobre-mi` y `aria-labelledby` al `h2` de `SectionHeader` ("Sobre mí").
    - Panel `about.md`: cabecera decorativa (`about.md` · `markdown`), párrafo del resumen,
      separador y dos grupos, cada uno con `h3` ("Experiencia práctica", "Enfoque") y `ul`
      con sus puntos. Los marcadores `##` y `-` son decorativos y la lista conserva su
      semántica sin viñetas nativas.
    - Estilos con tokens, mobile-first: `--space-section`, `--space-gutter`,
      `--section-max-width`, `--section-header-gap` y los `--about-*`; grupos en una columna y
      en dos desde 768px; sin glow ni borde luminoso.
    - Revelado M-1 del panel: `opacity` y `transform`, sin `filter`.
  - **Revelado M-1** (CSS scroll-driven, sin JavaScript), en ambos componentes:
    - Solo dentro de `@media (prefers-reduced-motion: no-preference)` y
      `@supports (animation-timeline: view())`.
    - Línea de tiempo de vista propia por elemento, rango desde que el elemento ha entrado
      `--reveal-range-start` hasta `--reveal-range-start` + `--reveal-range-length`, mismo
      rango en encabezado y panel, curva `--ease-in-out`, estado inicial con
      `--reveal-distance` (y `--reveal-blur` solo en el encabezado).
    - Fuera de esas condiciones, nada oculta el contenido.
  - **`index.astro`**: renderizar `AboutSection` con los datos de `profile`, justo después de
    `HomeHero` dentro de `main`.
- **Test**:
  - `section-header.test.ts`: un único `h2` con el título y el id recibidos; ruta con el ancla
    y oculta a lectores de pantalla.
  - `about-section.test.ts`:
    - `section#sobre-mi` con `aria-labelledby` que apunta al `h2` "Sobre mí".
    - Contiene el resumen recibido.
    - Dos `h3` en orden, cada uno seguido de una `ul` con sus puntos en orden.
    - Cabecera del panel y marcadores ocultos a lectores de pantalla.
    - Ningún `<script>` en los componentes.
    - `index.astro` renderiza `AboutSection` después de `HomeHero` dentro de `main`.
  - `about-section-styles.test.ts` (estilos de ambos componentes):
    - Sin colores, tamaños, espaciados ni duraciones literales.
    - Usan los tokens `--section-*`, `--about-*`, `--reveal-range-start` y
      `--reveal-range-length`.
    - Regla de dos columnas desde 768px.
    - Sin `--border-glow` ni sombras de glow.
    - Toda regla que oculta o desplaza contenido (animación, `opacity`, `transform`,
      `filter`) está dentro de `prefers-reduced-motion: no-preference` y del `@supports` de
      scroll-driven.
    - El panel no anima `filter`.
    - El revelado empieza en `entry` + `--reveal-range-start`, termina en `entry` +
      `--reveal-range-start` + `--reveal-range-length` y usa `--ease-in-out`.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - JavaScript de cliente de la home en `dist/` sin cambios respecto a la spec 003
    (solo el del hero, ≤ 3 kB con gzip).
  - Comprobación manual en Chrome:
    - Sección a 390px y 1440px contra `B · about.md — Móvil 390` y `— Escritorio 1440`.
    - Revelado al hacer scroll contra `B · about.md — Movimiento`: encabezado y panel se
      revelan a la vista, no pegados al borde inferior.
    - Scroll fluido con trackpad al pasar por la sección.
    - Con reduced motion emulado, contenido directo sin revelado.
    - Con JavaScript desactivado, contenido presente y nunca oculto a la espera de un script.

### [ ] T04 — Verificación final

- **Criterios**: todos
- **Diseño**: todas las pantallas de `designs/004-about/design.md`
- **Archivos**: —
- **Qué hacer**: verificación completa de la spec.
- **Test**: cada CA tiene cobertura:
  - CA-1.1 → `tests/components/about-section.test.ts` + revisión de `dist/`
  - CA-1.2, CA-2.1 → `tests/content/schemas.test.ts` + `tests/content/entries.test.ts`
  - CA-1.3 → `tests/lib/page-meta.test.ts` + `tests/content/entries.test.ts` + revisión de `dist/`
  - CA-2.2 → `tests/components/about-section.test.ts`
  - CA-3.1 → `tests/components/about-section.test.ts` + revisión de `dist/`
  - CA-4.1 → `tests/components/about-section-styles.test.ts` + comprobación manual
  - CA-4.2 → `tests/components/about-section.test.ts` + medición de `dist/`
  - CA-4.3 → `tests/components/about-section-styles.test.ts` + `tests/styles/tokens.test.ts` + Lighthouse
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - `dist/index.html`:
    - `section#sobre-mi` única, justo después del hero dentro de `main`, con el resumen y los
      7 puntos sin JavaScript.
    - Meta description con el resumen corregido.
    - Un único `h1`.
    - JavaScript de la home solo del hero (≤ 3 kB con gzip).
  - Reduced motion y JavaScript desactivado revisados.
  - Rendimiento del revelado: pestaña Performance de DevTools haciendo scroll (con trackpad)
    por la sección, sin fotogramas largos. Si hay tirones atribuibles al desenfoque del
    encabezado, se añade **Bloqueo** y se vuelve a `/design-spec 004` para quitarlo
    (constitución §7).
  - Contraste AA según tokens (sin valores nuevos de color) y orden de tabulación sin cambios.
  - Revisión visual a 390px y 1440px contra la composición B.
  - Lighthouse ≥ 90 en todas las categorías (DevTools sobre `bun run preview`).

## Registro de decisiones

| Fecha | Tipo | Decisión | Motivo |
|-------|------|----------|--------|
| 2026-09-15 | Creación | Plan inicial de 4 tareas | — |
| 2026-09-15 | Bloqueo resuelto | Antes de planificar se refinó CA-4.1 de la spec y M-1 del diseño: sin JavaScript el revelado CSS también se ejecuta, así que se separan los casos (reduced motion o sin soporte: visible sin animación; sin JS: nada oculto a la espera de un script) | Contradicción entre la spec y la técnica aprobada; aplicado a petición del usuario |
| 2026-09-15 | Planificación | T01 incorpora tokens, encabezado de sección y P-1 al sistema y a `tokens.css` en un solo commit | Mantener en verde el test de tokens de la spec 002 (como en 003) |
| 2026-09-15 | Planificación | Estructura, estilos y revelado M-1 (con su rama reduced motion) de los componentes en una sola tarea (T03) | Petición del usuario al revisar el plan |
| 2026-09-15 | Planificación | Encabezado de sección como componente propio `SectionHeader`, reutilizable en 005–009 | Patrón común aprobado en el diseño 004 |
| 2026-09-15 | Planificación | Nombres: campos `practicalExperience` y `focusAreas`; componentes `SectionHeader` y `AboutSection` | Identificadores en inglés (constitución §9) |
| 2026-09-15 | Aclaración | La rama reduced motion del revelado es CSS (`prefers-reduced-motion` y `@supports`), sin JavaScript | Pregunta del usuario al revisar el plan; se mantiene CA-4.2 |
| 2026-09-15 | Bloqueo resuelto | T03 se detuvo porque el revelado M-1 del panel no se percibía (empezaba en el borde inferior y con `--ease-out` terminaba a los ~60px); `/design-spec 004` refinó M-1: inicio tras `--reveal-range-start` (80px / 120px), recorrido `--reveal-range-length` (240px / 360px) y `--ease-in-out` | Revisión manual del usuario en T03 |
| 2026-09-15 | Replanificación | Nueva T05 para incorporar los tokens y P-1 refinados al sistema y a `tokens.css` (invalida parte de T01, ya hecha); se sitúa antes de T03 en el documento y en el orden de ejecución porque T03 la necesita | Regla de replanificar: una tarea hecha invalidada se ajusta con una tarea nueva |
| 2026-09-15 | Replanificación | T03 se ajusta al revelado refinado y reutiliza el trabajo sin commit; su revisión manual incluye que el revelado se perciba y scroll fluido | Refinado del diseño 004 |
| 2026-09-15 | Replanificación | T04 añade la comprobación de rendimiento del revelado (Performance con trackpad); si el desenfoque del encabezado provoca tirones, Bloqueo y `/design-spec 004` | Tirones intermitentes no reproducibles en la primera revisión; el usuario mantuvo el desenfoque |
