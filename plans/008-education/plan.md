---
id: 008
title: Formación
spec: specs/008-education/spec.md
design: designs/008-education/design.md
status: approved
created: 2026-09-16
updated: 2026-09-17
---

# Plan — Formación

Leyenda: `[ ]` pendiente · `[x]` hecha · `[-]` obsoleta · una tarea `[ ]` con línea
**Bloqueo** está detenida por `/implement` hasta resolver una brecha.

## Resumen

| Capa | Tareas |
|------|--------|
| Datos | T01, T02, T03 |
| Estructura, estilos y movimiento (sección) | T04 |
| Pulido | — (incluido en T04) |
| Verificación final | T05 |

## Cobertura de criterios

| Criterio | Tareas |
|----------|--------|
| CA-1.1 | T04, T05 |
| CA-1.2 | T03, T04 |
| CA-1.3 | T01 |
| CA-1.4 | T04 |
| CA-2.1 | T04, T05 |
| CA-2.2 | T04, T05 |
| CA-2.3 | T04, T05 |
| CA-3.1 | T04 |
| CA-3.2 | T04 |
| CA-3.3 | T05 |
| CA-3.4 | T04, T05 |

## Tareas

### [x] T01 — Años, abreviatura y campos de formación

- **Criterios**: CA-1.3
- **Diseño**: —
- **Archivos**: `docs/cv.md` (modificar), `src/content/schemas.ts` (modificar), las 2 entradas de
  `src/content/education/` (modificar), `tests/content/schemas.test.ts` (modificar),
  `tests/content/entries.test.ts` (modificar)
- **Qué hacer**:
  - `docs/cv.md`, sección "Formación": la institución pasa a
    `Universidad Tecnológica de la Costa Grande de Guerrero (UTCGG)` en las dos formaciones, y
    cada una indica su rango junto al estado: `*2025 – 2026 · En curso*` y
    `*2023 – 2025 · Finalizado*`.
  - Esquema de `education`: campos obligatorios `order` (entero positivo), `startYear`, `endYear`
    (enteros) e `institutionShort`; se elimina `expectedYear`.
  - Entradas: Ingeniería `order` 1, 2025–2026, `in-progress`; TSU `order` 2, 2023–2025,
    `completed`; ambas con `institutionShort` `UTCGG`.
- **Test**:
  - Esquema: rechaza una entrada sin `order`, sin `startYear`, sin `endYear` o sin
    `institutionShort`; rechaza `order` 0, negativo o decimal; la lista de campos ya no incluye
    `expectedYear`.
  - Entradas: las dos coinciden con `docs/cv.md` en titulación, especialidad, institución,
    abreviatura, rango de años y estado, y sus `order` son 1 y 2.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.

### [x] T02 — Estado compartido entre secciones

Va antes del componente porque la formación reutiliza el texto del estado que hoy vive en
`src/lib/projects.ts` (ver registro).

- **Criterios**: CA-1.2
- **Diseño**: `designs/008-education/design.md` → Componentes (badge de estado)
- **Archivos**: `src/lib/status.ts` (crear), `tests/lib/status.test.ts` (crear),
  `src/lib/projects.ts` (modificar), `tests/lib/projects.test.ts` (modificar),
  `src/components/StatusBadge.astro` (modificar), `src/components/ProjectCard.astro` (modificar),
  `src/components/ProjectsSection.astro` (modificar)
- **Qué hacer**:
  - Mover a `src/lib/status.ts` el tipo de estado (`EntryStatus`, con los valores `completed` e
    `in-progress`) y la función que devuelve su texto (`statusLabel`: "Finalizado" y "En curso").
  - `src/lib/projects.ts` deja de exportarlos; `StatusBadge`, `ProjectCard` y `ProjectsSection`
    pasan a usar el módulo nuevo.
- **Test**:
  - `status.test.ts`: el texto de cada estado, movido desde el test de proyectos.
  - `projects.test.ts`: conserva agrupación, orden y logros.
  - El test de `StatusBadge` sigue en verde sin cambios.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - La sección de proyectos sigue mostrando sus badges igual (sin cambios en su HTML).

### [x] T03 — Orden y rango de años de la formación

- **Criterios**: CA-1.2
- **Diseño**: `A · Par — Escritorio 1440` (fila de años y estado)
- **Archivos**: `src/lib/education.ts` (crear), `tests/lib/education.test.ts` (crear)
- **Qué hacer**: funciones puras en `src/lib/education.ts`:
  - `sortEducation`: devuelve las entradas ordenadas por `order` ascendente y lanza un error si
    dos comparten `order`.
  - `formatYearRange`: devuelve el rango como `2025 – 2026` a partir de `startYear` y `endYear`
    (guion largo con espacios, como en `docs/cv.md`); si ambos años coinciden devuelve solo uno.
- **Test**: orden por `order` aunque la entrada llegue desordenada; sin mutar la entrada; error
  con órdenes duplicados; lista vacía sin cambios; formato del rango con años distintos e iguales.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.

### [ ] T04 — Sección "Formación" en la home

- **Criterios**: CA-1.1, CA-1.2, CA-1.4, CA-2.1, CA-2.2, CA-2.3, CA-3.1, CA-3.2, CA-3.4
- **Diseño**: `A · Par — Escritorio 1440` y `— Móvil 390` · `M-1` · `M-2`
- **Archivos**: `src/components/EducationSection.astro` (crear),
  `tests/components/education-section.test.ts` (crear),
  `tests/components/education-section-styles.test.ts` (crear), `src/pages/index.astro` (modificar)
- **Qué hacer**:
  - **`EducationSection`**. Props: las entradas de la colección `education`.
    - `section` con id `formacion` y `aria-labelledby` al `h2` de `SectionHeader` (ancla
      `formacion`, título "Formación").
    - Una card por entrada, en el orden de `sortEducation`, marcada como bloque revelable
      (`data-reveal`) y como card con spotlight (`data-spotlight`): fila con el rango de años
      (`formatYearRange`) y `StatusBadge`; `h3` con la titulación; párrafo con la especialidad; al
      pie, la abreviatura como etiqueta y el nombre completo de la institución.
    - Sin elementos enfocables.
  - **Estilos** con tokens, mobile-first, fieles a la composición A:
    - Contenedor `--section-max-width`, separaciones `--section-header-gap`, padding de sección
      `--space-section` / `--space-gutter`.
    - Rejilla: una columna con separación `--space-3`; desde 768px, 2 columnas iguales con
      separación `--space-4` y la misma altura.
    - Card del sistema (`--color-surface`, borde, `--radius-lg`, `--card-padding`, `--card-gap`);
      años con `--font-mono` y `--text-mono-label-*` en `--color-text-muted`; titulación
      `--text-h3-*`; especialidad `--text-body-*` en `--color-text-secondary`; institución al pie
      con la etiqueta del sistema y el nombre en `--color-text-muted`.
    - Dentro de la media query de puntero fino: con el estado activo del spotlight, institución y
      años a `--color-text-secondary`, con transición `--duration-base` / `--ease-out` solo sin
      reduced motion; con reduced motion, el mismo cambio en hover y sin transición.
  - **`index.astro`**: obtener la colección `education` y renderizar `EducationSection` justo
    después de `ExperienceSection` dentro de `main`.
- **Test**:
  - `education-section.test.ts`: `section#formacion` con `aria-labelledby` al `h2` "Formación";
    una card por entrada en el orden de `order` (con entradas desordenadas), cada una con su
    titulación en `h3`, especialidad, rango de años, badge con el texto del estado, abreviatura y
    nombre de la institución; cada card lleva `data-reveal` y `data-spotlight`; sin enlaces,
    botones, controles ni `tabindex`; `index.astro` renderiza la sección después de
    `ExperienceSection` dentro de `main` y obtiene la colección `education`.
  - `education-section-styles.test.ts`: sin literales; usa los tokens citados; una columna por
    debajo de 768px y 2 columnas iguales desde 768px; reglas del estado activo y del hover dentro
    de la media query de puntero fino, con transiciones solo sin reduced motion; ninguna regla
    oculta o desplaza contenido.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - JavaScript de la home sin scripts nuevos y ≤ 3 kB con gzip.
  - Comprobación manual en Chrome (sobre `bun run preview`):
    - Sección a 390px y 1440px contra `A · Par — Móvil 390` y `— Escritorio 1440`.
    - Spotlight en las dos cards (institución y años se aclaran) y sin cambios en las secciones
      anteriores.
    - Revelado del encabezado y de las cards al entrar y otra vez al volver a entrar; scroll
      fluido con trackpad.
    - Con reduced motion y con JavaScript desactivado (recargando), todo visible y sin animación.

### [ ] T05 — Verificación final

- **Criterios**: todos
- **Diseño**: todas las pantallas de `designs/008-education/design.md`
- **Archivos**: —
- **Qué hacer**: verificación completa de la spec.
- **Test**: cada CA tiene cobertura:
  - CA-1.1 → `tests/components/education-section.test.ts` + revisión de `dist/`
  - CA-1.2 → `tests/lib/education.test.ts` + `tests/lib/status.test.ts` + `tests/components/education-section.test.ts`
  - CA-1.3 → `tests/content/schemas.test.ts` + `tests/content/entries.test.ts`
  - CA-1.4 → `tests/components/education-section.test.ts`
  - CA-2.1 → `tests/components/card-spotlight.test.ts` + `tests/components/education-section.test.ts` + comprobación manual
  - CA-2.2 → `tests/components/education-section-styles.test.ts` + `tests/components/card-spotlight.test.ts` + comprobación manual
  - CA-2.3 → medición de `dist/`
  - CA-3.1 → `tests/components/education-section-styles.test.ts` + `tests/styles/tokens.test.ts`
  - CA-3.2 → `tests/components/education-section.test.ts`
  - CA-3.3 → Lighthouse
  - CA-3.4 → `tests/components/education-section.test.ts` + `tests/components/section-reveal.test.ts` + comprobación manual
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - `dist/index.html`:
    - `section#formacion` única tras `#experiencia` dentro de `main`, con las dos formaciones
      (titulación, especialidad, institución con abreviatura, años y estado) sin JavaScript.
    - Un único `h1`.
    - JavaScript de la home ≤ 3 kB con gzip (hero + revelado común + spotlight común).
  - Spotlight y revelado revisados en la sección; reduced motion y JavaScript desactivado
    revisados (recargando).
  - Rendimiento: pestaña Performance con scroll y puntero por las últimas secciones (trackpad),
    sin tareas largas.
  - Contraste AA según tokens y orden de tabulación sin cambios.
  - Revisión visual a 390px y 1440px contra la composición A · Par.
  - Lighthouse ≥ 90 en todas las categorías (DevTools sobre `bun run preview`).

## Registro de decisiones

| Fecha | Tipo | Decisión | Motivo |
|-------|------|----------|--------|
| 2026-09-16 | Creación | Plan inicial de 5 tareas | — |
| 2026-09-16 | Planificación | Campos `order`, `startYear`, `endYear` e `institutionShort` en el esquema de `education`, y `expectedYear` eliminado (T01) | La spec fija esos datos; el año esperado queda implícito en `endYear` más el estado |
| 2026-09-16 | Planificación | El tipo y el texto del estado se mueven de `src/lib/projects.ts` a `src/lib/status.ts` (T02) | Los usan dos secciones; `projectStatusLabel` sería confuso desde la formación, como pasó con los logros en la spec 007 |
| 2026-09-16 | Planificación | Orden y formato del rango de años en `src/lib/education.ts` (T03) | Lógica pura y testeable fuera del componente (constitución §4 y §5) |
| 2026-09-16 | Planificación | Estructura, estilos y marcas de revelado y spotlight en una sola tarea (T04) | Son dos cards con la misma revisión visual; el movimiento reutiliza los scripts existentes |
| 2026-09-16 | Planificación | Sin tarea propia de animación ni cambios en el sistema | `CardSpotlight` y `SectionReveal` ya existen y el diseño 008 no añade tokens ni patrones |
