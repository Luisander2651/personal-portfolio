---
id: 007
title: Experiencia profesional
spec: specs/007-experience/spec.md
design: designs/007-experience/design.md
status: approved
created: 2026-09-15
updated: 2026-09-16
---

# Plan — Experiencia profesional

Leyenda: `[ ]` pendiente · `[x]` hecha · `[-]` obsoleta · una tarea `[ ]` con línea
**Bloqueo** está detenida por `/implement` hasta resolver una brecha.

## Resumen

| Capa | Tareas |
|------|--------|
| Sistema | T01 |
| Datos | T02, T03 |
| Estructura, estilos y movimiento (sección) | T04 |
| Pulido | — (incluido en T04) |
| Verificación final | T05 |

## Cobertura de criterios

| Criterio | Tareas |
|----------|--------|
| CA-1.1 | T04, T05 |
| CA-1.2 | T04 |
| CA-1.3 | T02 |
| CA-1.4 | T04 |
| CA-2.1 | T04, T05 |
| CA-2.2 | T04, T05 |
| CA-2.3 | T04, T05 |
| CA-3.1 | T04 |
| CA-3.2 | T04 |
| CA-3.3 | T05 |
| CA-3.4 | T04, T05 |

## Tareas

### [x] T01 — Token y patrón de la fila de experiencia en el sistema

- **Criterios**: CA-3.1
- **Diseño**: `designs/007-experience/design.md` → "Cambios a incorporar al sistema"
- **Archivos**: `designs/000-design-system/design.md` (modificar), `src/styles/tokens.css`
  (modificar)
- **Qué hacer**:
  - En `designs/000-design-system/design.md`:
    - Sección de tokens nueva "Experiencia" con `--experience-meta-width` (fijo, `220px`).
    - En Componentes, patrón "Fila de experiencia": bloque entre líneas de `--border-width`
      `--color-border`, sin superficie propia en reposo, que adopta el tratamiento de card
      (superficie, `--border-glow` y `--shadow-glow-soft`) solo mientras el spotlight lo ilumina;
      sin foco ni efecto táctil, como las cards sin enlace de la spec 006.
    - Entrada en el registro de decisiones del sistema.
  - En `src/styles/tokens.css`: declarar el token.
- **Test**: el test de tokens existente (`tests/styles/tokens.test.ts`); rojo al documentar el
  token y verde al declararlo. Sin test nuevo.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - Sistema y `tokens.css` coinciden, en un solo commit.

### [x] T02 — Periodo y logro nuevo en el CV y en la colección

- **Criterios**: CA-1.3
- **Diseño**: —
- **Archivos**: `docs/cv.md` (modificar), `src/content/schemas.ts` (modificar),
  `src/content/experience/syspyra-solutions.md` (modificar), `tests/content/schemas.test.ts`
  (modificar), `tests/content/entries.test.ts` (modificar)
- **Qué hacer**:
  - `docs/cv.md`, sección "Experiencia": añadir la línea `**Periodo:** mayo – agosto de 2025`
    justo antes de `**Duración:** 4 meses`, y el logro nuevo como primero de la lista, con la
    redacción exacta de CA-1.3.
  - Esquema de `experience`: campo obligatorio `period`.
  - Entrada `syspyra-solutions`: `period` en el frontmatter y el logro nuevo como primer punto del
    cuerpo.
- **Test**:
  - Esquema: rechaza una entrada sin `period` o con un valor vacío; la lista de campos incluye
    `period`.
  - Entradas: la entrada coincide con `docs/cv.md` en empresa, puesto, periodo, duración y los
    tres logros, en ese orden (la comprobación de periodo se suma a las existentes).
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - `docs/cv.md` y la colección incluyen el periodo y los tres logros.

### [x] T03 — Extracción de logros compartida

Va antes del componente porque la sección reutiliza la función que hoy vive en
`src/lib/projects.ts` (ver registro).

- **Criterios**: CA-1.2
- **Diseño**: —
- **Archivos**: `src/lib/achievements.ts` (crear), `tests/lib/achievements.test.ts` (crear),
  `src/lib/projects.ts` (modificar), `tests/lib/projects.test.ts` (modificar),
  `src/components/ProjectsSection.astro` (modificar)
- **Qué hacer**:
  - Mover la lógica de `parseProjectAchievements` a `src/lib/achievements.ts` como
    `parseAchievements`, con el mismo comportamiento: devuelve el texto de cada punto de lista del
    cuerpo, en orden, y lanza un error si no hay ninguno.
  - `src/lib/projects.ts` deja de exportarla; `ProjectsSection` pasa a importarla del módulo nuevo.
- **Test**:
  - `achievements.test.ts`: los casos que hoy cubren los logros (orden, líneas vacías, error sin
    puntos), movidos desde el test de proyectos.
  - `projects.test.ts`: conserva los casos de agrupación, orden y estado.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - La sección de proyectos sigue mostrando sus logros igual (sin cambios en su HTML).

### [x] T04 — Sección "Experiencia profesional" en la home


- **Criterios**: CA-1.1, CA-1.2, CA-1.4, CA-2.1, CA-2.2, CA-2.3, CA-3.1, CA-3.2, CA-3.4
- **Diseño**: `A · Registro — Escritorio 1440` y `— Móvil 390` · `M-1` · `M-2`
- **Archivos**: `src/components/ExperienceSection.astro` (crear),
  `tests/components/experience-section.test.ts` (crear),
  `tests/components/experience-section-styles.test.ts` (crear), `src/pages/index.astro`
  (modificar)
- **Qué hacer**:
  - **`ExperienceSection`**. Props: las entradas de la colección `experience`.
    - `section` con id `experiencia` y `aria-labelledby` al `h2` de `SectionHeader` (ancla
      `experiencia`, título "Experiencia profesional").
    - Una fila por entrada, marcada como bloque revelable (`data-reveal`) y como bloque con
      spotlight (`data-spotlight`): periodo y duración en una línea mono con separador decorativo,
      `h3` con la empresa, párrafo con el puesto y `ul` de logros (de `parseAchievements`) con la
      misma marca decorativa que la card de proyecto.
    - Sin elementos enfocables.
  - **Estilos** con tokens, mobile-first, fieles a la composición A:
    - Contenedor `--section-max-width`, separaciones `--section-header-gap`, padding de sección
      `--space-section` / `--space-gutter`.
    - Fila: bordes superior e inferior `--border-width` `--color-border` (filas consecutivas sin
      dobles líneas), padding `--card-padding` vertical y `--space-5` horizontal; una columna por
      debajo de 768px y dos columnas (`--experience-meta-width` + resto, separación `--space-6`)
      desde 768px.
    - Periodo y duración con `--font-mono` y `--text-mono-label-*` en `--color-text-muted`;
      empresa `--text-h3-*`; puesto `--text-body-*` en `--color-text-secondary`; logros como en la
      card de proyecto.
    - Dentro de la media query de puntero fino: con el estado activo del spotlight, logros y línea
      de periodo a `--color-text-secondary` y marcas a `--color-glow`, con transición
      `--duration-base` / `--ease-out` solo sin reduced motion; con reduced motion, el mismo
      cambio en hover y sin transición.
  - **`index.astro`**: obtener la colección `experience` y renderizar `ExperienceSection` justo
    después de `ProjectsSection` dentro de `main`.
- **Test**:
  - `experience-section.test.ts`: `section#experiencia` con `aria-labelledby` al `h2`
    "Experiencia profesional"; por cada entrada, empresa en `h3`, puesto, periodo y duración, y
    logros en orden tomados del cuerpo; la fila lleva `data-reveal` y `data-spotlight`; con dos
    entradas se muestran las dos (CA-1.4); sin enlaces, botones, controles ni `tabindex`;
    `index.astro` renderiza la sección después de `ProjectsSection` dentro de `main` y obtiene la
    colección `experience`.
  - `experience-section-styles.test.ts`: sin literales; usa `--experience-meta-width`,
    `--section-max-width`, `--card-padding` y los tokens de tipografía citados; dos columnas desde
    768px y una por debajo; reglas del estado activo y del hover dentro de la media query de
    puntero fino, con transiciones solo sin reduced motion; ninguna regla oculta o desplaza
    contenido.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - JavaScript de la home sin scripts nuevos y ≤ 3 kB con gzip.
  - Comprobación manual en Chrome (sobre `bun run preview`):
    - Sección a 390px y 1440px contra `A · Registro — Móvil 390` y `— Escritorio 1440`.
    - Spotlight sobre la fila (se levanta como card y se aclaran logros y fechas) y sin cambios en
      "Tecnologías" ni "Proyectos".
    - Revelado del encabezado y de la fila al entrar y otra vez al volver a entrar; scroll fluido
      con trackpad.
    - Con reduced motion y con JavaScript desactivado (recargando), todo visible y sin animación.

### [ ] T05 — Verificación final

- **Criterios**: todos
- **Diseño**: todas las pantallas de `designs/007-experience/design.md`
- **Archivos**: —
- **Qué hacer**: verificación completa de la spec.
- **Test**: cada CA tiene cobertura:
  - CA-1.1 → `tests/components/experience-section.test.ts` + revisión de `dist/`
  - CA-1.2 → `tests/lib/achievements.test.ts` + `tests/components/experience-section.test.ts`
  - CA-1.3 → `tests/content/schemas.test.ts` + `tests/content/entries.test.ts`
  - CA-1.4 → `tests/components/experience-section.test.ts`
  - CA-2.1 → `tests/components/card-spotlight.test.ts` + `tests/components/experience-section.test.ts` + comprobación manual
  - CA-2.2 → `tests/components/experience-section-styles.test.ts` + `tests/components/card-spotlight.test.ts` + comprobación manual
  - CA-2.3 → medición de `dist/`
  - CA-3.1 → `tests/components/experience-section-styles.test.ts` + `tests/styles/tokens.test.ts`
  - CA-3.2 → `tests/components/experience-section.test.ts`
  - CA-3.3 → Lighthouse
  - CA-3.4 → `tests/components/experience-section.test.ts` + `tests/components/section-reveal.test.ts` + comprobación manual
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - `dist/index.html`:
    - `section#experiencia` única tras `#proyectos` dentro de `main`, con empresa, puesto,
      periodo, duración y los tres logros sin JavaScript.
    - Un único `h1`.
    - JavaScript de la home ≤ 3 kB con gzip (hero + revelado común + spotlight común).
  - Spotlight y revelado revisados en la sección; reduced motion y JavaScript desactivado
    revisados (recargando).
  - Rendimiento: pestaña Performance con scroll y puntero por las últimas secciones (trackpad),
    sin tareas largas.
  - Contraste AA según tokens y orden de tabulación sin cambios.
  - Revisión visual a 390px y 1440px contra la composición A · Registro.
  - Lighthouse ≥ 90 en todas las categorías (DevTools sobre `bun run preview`).

## Registro de decisiones

| Fecha | Tipo | Decisión | Motivo |
|-------|------|----------|--------|
| 2026-09-15 | Creación | Plan inicial de 5 tareas | — |
| 2026-09-15 | Planificación | T01 incorpora al sistema el token `--experience-meta-width` y el patrón "Fila de experiencia" antes que el código | El diseño 007 pide incorporarlo en la primera tarea; mantiene en verde el test de tokens |
| 2026-09-15 | Planificación | La extracción de logros se mueve de `src/lib/projects.ts` a `src/lib/achievements.ts` como `parseAchievements` (T03) | La usan dos secciones; importar `parseProjectAchievements` desde la experiencia sería confuso (constitución §4) |
| 2026-09-15 | Planificación | Estructura, estilos y marcas de revelado y spotlight en una sola tarea (T04) | La fila es un único bloque y comparte revisión visual; el movimiento reutiliza los scripts existentes |
| 2026-09-15 | Planificación | Sin tarea propia de animación | `CardSpotlight` y `SectionReveal` ya existen (specs 005 y 006); la sección solo añade sus marcas |
