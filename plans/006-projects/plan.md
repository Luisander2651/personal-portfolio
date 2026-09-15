---
id: 006
title: Proyectos
spec: specs/006-projects/spec.md
design: designs/006-projects/design.md
status: approved
created: 2026-09-15
updated: 2026-09-15
---

# Plan — Proyectos

Leyenda: `[ ]` pendiente · `[x]` hecha · `[-]` obsoleta · una tarea `[ ]` con línea
**Bloqueo** está detenida por `/implement` hasta resolver una brecha.

## Resumen

| Capa | Tareas |
|------|--------|
| Sistema | T01 |
| Datos | T02, T03 |
| Movimiento e interacción (spotlight común) | T04 |
| Estructura estática y estilos (componentes y sección) | T05, T06 |
| Pulido | — (incluido en T05 y T06) |
| Verificación final | T07 |

## Cobertura de criterios

| Criterio | Tareas |
|----------|--------|
| CA-1.1 | T06, T07 |
| CA-1.2 | T03, T05, T06 |
| CA-1.3 | T03, T05 |
| CA-2.1 | T02 |
| CA-2.2 | T01, T03, T06 |
| CA-3.1 | T04, T05, T07 |
| CA-3.2 | T04, T05, T07 |
| CA-3.3 | T04, T07 |
| CA-4.1 | T05, T06 |
| CA-4.2 | T05, T06 |
| CA-4.3 | T07 |
| CA-4.4 | T05, T06, T07 |

## Tareas

### [ ] T01 — Breakpoint ancho y cards sin enlace en el sistema

- **Criterios**: CA-2.2
- **Diseño**: `designs/006-projects/design.md` → "Cambios a incorporar al sistema"
- **Archivos**: `designs/000-design-system/design.md` (modificar)
- **Qué hacer**:
  - Tabla de constantes: fila `Breakpoint ancho` · `1024px` · composiciones en fila que no caben
    entre 768px y 1023px (panel destacado y fila de proyectos de la spec 006); los tokens siguen
    cambiando solo en `768px`.
  - "Card de proyecto": nota de que las cards sin enlace (spec 006) no tienen estado de foco y en
    táctil no muestran efecto, como las cards de categoría de la spec 005.
  - Entrada en el registro de decisiones del sistema.
- **Test**: sin test nuevo (solo documentación); los tests existentes siguen en verde.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - El sistema documenta la constante y la nota, con su entrada en el registro.

### [ ] T02 — Campo de bloque destacado en los proyectos

- **Criterios**: CA-2.1
- **Diseño**: —
- **Archivos**: `src/content/schemas.ts` (modificar), las 5 entradas de `src/content/projects/`
  (modificar), `tests/content/schemas.test.ts` (modificar), `tests/content/entries.test.ts`
  (modificar)
- **Qué hacer**:
  - Esquema de `projects`: campo obligatorio `featured` (booleano).
  - Entradas: `featured: true` en "DentissaApp — Dental Practice Management Platform" y
    "DentissaApp — Auth Microservice"; `false` en las otras tres. `docs/cv.md` no cambia.
- **Test**:
  - Esquema: acepta `featured` verdadero y falso; rechaza una entrada sin `featured` o con un
    valor no booleano; la lista de campos del esquema incluye `featured`.
  - Entradas: solo las dos entradas de DentissaApp tienen `featured` activado; siguen coincidiendo
    con `docs/cv.md` en nombre, stack, logros, estado y orden.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.

### [ ] T03 — Funciones de proyectos para la sección

- **Criterios**: CA-1.2, CA-1.3, CA-2.2
- **Diseño**: `A · Sistema — Escritorio 1440` (orden y agrupación)
- **Archivos**: `src/lib/projects.ts` (modificar), `tests/lib/projects.test.ts` (modificar)
- **Qué hacer**: añadir a `src/lib/projects.ts`, junto a `sortProjects`:
  - `groupProjectsForSection`: recibe las entradas de `projects` y devuelve dos grupos,
    destacados y resto, cada uno ordenado por `order` (reutiliza `sortProjects` y su error con
    órdenes duplicados).
  - `parseProjectAchievements`: recibe el cuerpo de una entrada y devuelve el texto de cada punto
    de lista, en orden; lanza un error si no hay ninguno.
  - `projectStatusLabel`: devuelve "Finalizado" para `completed` y "En curso" para `in-progress`.
- **Test**:
  - Agrupación: separa por `featured`; orden por `order` dentro de cada grupo aunque la entrada
    llegue desordenada; no muta la entrada; error con órdenes duplicados; grupos vacíos cuando no
    hay proyectos de un tipo.
  - Logros: extrae los puntos en orden y sin el marcador de lista; ignora líneas vacías; error si
    el cuerpo no tiene puntos.
  - Estado: texto de cada valor.
  - Los tests existentes de `sortProjects` se mantienen.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.

### [ ] T04 — Spotlight común para las cards

Va antes de las cards de proyecto para que "Tecnologías" y "Proyectos" compartan un único script
(CA-3.3) en lugar de duplicarlo.

- **Criterios**: CA-3.1, CA-3.2, CA-3.3
- **Diseño**: `A · Sistema — Movimiento` · `M-1`; `designs/005-tech-stack/design.md` → M-1
- **Archivos**: `src/components/CardSpotlight.astro` (crear),
  `tests/components/card-spotlight.test.ts` (crear), `src/components/TechStackSection.astro`
  (modificar), `tests/components/tech-stack-spotlight.test.ts` (modificar),
  `tests/components/tech-stack-section-styles.test.ts` (modificar si hace falta),
  `src/pages/index.astro` (modificar)
- **Qué hacer**:
  - **`CardSpotlight`** (se renderiza una vez en la home, al final de `main`):
    - Script sin dependencias (el de T06 de 005): solo con `(hover: hover) and (pointer: fine)` y
      sin reduced motion; sobre las cards con la marca `data-spotlight` actualiza las variables de
      posición como máximo una vez por fotograma y pone el estado `data-spotlight-active` mientras
      el puntero está dentro.
    - Estilos globales con tokens, dentro de la media query de puntero fino: capa `::before` con
      `--border-glow` y `--shadow-glow-soft`, capa `::after` con la luz de `--color-spotlight` y
      `--spotlight-size`, transiciones en `--duration-base` / `--ease-out` solo sin reduced motion;
      con reduced motion, borde luminoso estático en hover y sin capa de luz.
  - **`TechStackSection`**: sin script ni capas propias; marca sus 6 cards con `data-spotlight` y
    conserva solo el color de sus iconos ligado al estado activo (y al hover con reduced motion).
  - **`index.astro`**: renderiza `CardSpotlight` una vez dentro de `main`.
- **Test**:
  - `card-spotlight.test.ts`: el script comprueba puntero fino y reduced motion, usa
    `requestAnimationFrame`, selecciona `[data-spotlight]`, pone `data-spotlight-active` y no
    importa paquetes; estilos `is:global` sin literales; luz con `--color-spotlight`,
    `--spotlight-size` y las variables de posición; borde con `--border-glow` y
    `--shadow-glow-soft`; todas sus reglas dentro de la media query de puntero fino; con reduced
    motion sin luz ni transiciones; solo oculta sus capas `::before` / `::after`; la home lo
    renderiza una vez dentro de `main`.
  - `tech-stack-spotlight.test.ts`: las 6 cards llevan `data-spotlight`; el componente no tiene
    script ni capas de spotlight; los iconos cambian a `--color-text` con el estado activo (y con
    hover bajo reduced motion) dentro de la media query de puntero fino.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - JavaScript de la home ≤ 3 kB con gzip, sin dependencias: hero, revelado común y spotlight común.
  - Comprobación manual en Chrome: el spotlight de "Tecnologías" se ve y se comporta igual que
    antes (dentro, se mueve, sale); con reduced motion (recargando), borde estático sin luz; sin
    JavaScript (recargando), sin luz y contenido completo.

### [ ] T05 — Componentes `StatusBadge` y `ProjectCard`

- **Criterios**: CA-1.2, CA-1.3, CA-3.1, CA-3.2, CA-4.1, CA-4.2, CA-4.4
- **Diseño**: `A · Sistema — Escritorio 1440` y `— Móvil 390` (card de proyecto) · `M-1` · `M-2`
- **Archivos**: `src/components/StatusBadge.astro` (crear), `src/components/ProjectCard.astro`
  (crear), `tests/components/status-badge.test.ts` (crear),
  `tests/components/project-card.test.ts` (crear), `tests/components/project-card-styles.test.ts`
  (crear)
- **Qué hacer**:
  - **`StatusBadge`**. Prop: `status`. Texto de `projectStatusLabel` y punto decorativo oculto;
    estilos del badge de estado del sistema (éxito para `completed`; aviso con halo en el punto
    para `in-progress`).
  - **`ProjectCard`**. Props: `order`, `name`, `status`, `achievements`, `stack`.
    - `article` marcado como bloque revelable (`data-reveal`) y como card con spotlight
      (`data-spotlight`).
    - Fila de metadatos: índice de `order` con dos dígitos, oculto a lectores de pantalla, y
      `StatusBadge`.
    - `h3` con el nombre; `ul` de logros con una marca decorativa oculta por punto; `ul` de stack
      con etiquetas de tecnología sin iconos.
    - Sin elementos enfocables.
  - **Estilos** con tokens, fieles a la card del diseño: card del sistema (`--color-surface`,
    borde, `--radius-lg`, `--card-padding`, `--card-gap`); índice mono `--text-mono-label-*` en
    `--color-text-muted`; logros con separación `--space-3`, marca de `--space-2` ×
    `--border-width` en `--color-border-strong` alineada con la primera línea, texto
    `--text-body-*` en `--color-text-muted`; stack al pie con separación `--space-2`.
    - Dentro de la media query de puntero fino: con el estado activo, texto de logros a
      `--color-text-secondary` y marcas a `--color-glow`, con transición `--duration-base` /
      `--ease-out` solo sin reduced motion; con reduced motion, el mismo cambio en hover y sin
      transición.
- **Test**:
  - `status-badge.test.ts`: texto "Finalizado" / "En curso" según `status`; punto oculto; estilos
    con los tokens de éxito y aviso, sin literales.
  - `project-card.test.ts`: `article` con `data-reveal` y `data-spotlight`; índice con dos dígitos
    oculto; badge; `h3` con el nombre; logros y stack en orden, marcas ocultas, sin SVG en el
    stack; sin enlaces, botones, controles ni `tabindex`.
  - `project-card-styles.test.ts`: sin literales; usa los tokens de la card y de los logros;
    reglas del estado activo y del hover dentro de la media query de puntero fino; transiciones
    solo sin reduced motion; ninguna regla oculta o desplaza contenido.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde (la revisión visual se hace en T06, cuando la card
    está en la home).

### [ ] T06 — Sección "Proyectos" en la home

- **Criterios**: CA-1.1, CA-1.2, CA-2.2, CA-4.1, CA-4.2, CA-4.4
- **Diseño**: `A · Sistema — Escritorio 1440`, `— Intermedio 900`, `— Móvil 390` · `M-1` · `M-2`
- **Archivos**: `src/components/ProjectsSection.astro` (crear),
  `tests/components/projects-section.test.ts` (crear),
  `tests/components/projects-section-styles.test.ts` (crear), `src/pages/index.astro` (modificar)
- **Qué hacer**:
  - **`ProjectsSection`**. Props: los dos grupos de `groupProjectsForSection`.
    - `section` con id `proyectos` y `aria-labelledby` al `h2` de `SectionHeader` (ancla
      `proyectos`, título "Proyectos").
    - Panel destacado con las dos cards destacadas (`ProjectCard`, logros de
      `parseProjectAchievements`) y el conector decorativo oculto entre ellas; después, el bloque
      con las otras tres cards.
  - **Estilos** con tokens, mobile-first:
    - Contenedor `--section-max-width`; separaciones `--section-header-gap`.
    - Panel: `--color-surface-sunken`, rejilla de puntos de `--border-width` en
      `--color-border-strong` cada `--grid-size`, borde, `--radius-lg`, padding `--card-padding`;
      nodos apilados con conector vertical de `--space-6`; desde `1024px`, fila 7:5 con conector
      horizontal de `--space-7` y nodos de igual altura.
    - Conector: línea de `--border-width` con degradado `--color-border-strong` → `--color-glow` →
      `--color-border-strong` y puntos de `--status-dot-size` con fondo `--color-bg` y borde
      `--color-glow`.
    - Resto: una columna con separación `--space-3` (y `--space-4` desde 768px); desde `1024px`, 3
      columnas iguales con separación `--space-4` y la misma altura.
  - **`index.astro`**: obtener la colección `projects`, agruparla y renderizar `ProjectsSection`
    justo después de `TechStackSection` dentro de `main`.
- **Test**:
  - `projects-section.test.ts`: `section#proyectos` con `aria-labelledby` al `h2` "Proyectos";
    el panel contiene exactamente las dos cards destacadas en orden con el conector oculto entre
    ellas; el bloque siguiente contiene las otras tres en orden; logros tomados del cuerpo; sin
    elementos enfocables; `index.astro` renderiza `ProjectsSection` después de
    `TechStackSection` dentro de `main` y agrupa la colección `projects`.
  - `projects-section-styles.test.ts`: sin literales; usa `--section-max-width`, `--grid-size`,
    `--card-padding`, `--space-6` y `--space-7`; desde `1024px` el panel usa 7:5 con la columna del
    conector y el resto 3 columnas iguales, y por debajo ambos están en una columna (disposiciones
    distintas para el panel y el resto); ninguna regla oculta o desplaza contenido.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - JavaScript de la home sin scripts nuevos respecto a T04.
  - Comprobación manual en Chrome (sobre `bun run preview`):
    - Sección a 390px, 900px y 1440px contra `A · Sistema — Móvil 390`, `— Intermedio 900` y
      `— Escritorio 1440`.
    - Spotlight en las 5 cards (y sigue igual en "Tecnologías").
    - Revelado del encabezado y de cada card al entrar (en cascada) y otra vez al volver a
      entrar; el panel y el conector visibles mientras entran las cards; scroll fluido con
      trackpad.
    - Con reduced motion y con JavaScript desactivado (recargando), todo visible y sin animación.

### [ ] T07 — Verificación final

- **Criterios**: todos
- **Diseño**: todas las pantallas de `designs/006-projects/design.md`
- **Archivos**: —
- **Qué hacer**: verificación completa de la spec.
- **Test**: cada CA tiene cobertura:
  - CA-1.1 → `tests/components/projects-section.test.ts` + revisión de `dist/`
  - CA-1.2 → `tests/lib/projects.test.ts` + `tests/components/project-card.test.ts` + `tests/components/projects-section.test.ts`
  - CA-1.3 → `tests/lib/projects.test.ts` + `tests/components/status-badge.test.ts` + `tests/components/project-card.test.ts`
  - CA-2.1 → `tests/content/schemas.test.ts` + `tests/content/entries.test.ts`
  - CA-2.2 → `tests/lib/projects.test.ts` + `tests/components/projects-section.test.ts` + `tests/components/projects-section-styles.test.ts` + comprobación manual
  - CA-3.1 → `tests/components/card-spotlight.test.ts` + `tests/components/project-card.test.ts` + comprobación manual
  - CA-3.2 → `tests/components/card-spotlight.test.ts` + `tests/components/project-card-styles.test.ts` + comprobación manual
  - CA-3.3 → medición de `dist/`
  - CA-4.1 → `tests/components/status-badge.test.ts` + `tests/components/project-card-styles.test.ts` + `tests/components/projects-section-styles.test.ts`
  - CA-4.2 → `tests/components/project-card.test.ts` + `tests/components/projects-section.test.ts`
  - CA-4.3 → Lighthouse
  - CA-4.4 → `tests/components/project-card.test.ts` + `tests/components/section-reveal.test.ts` + comprobación manual
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - `dist/index.html`:
    - `section#proyectos` única tras `#tecnologias` dentro de `main`, con los 5 proyectos (nombre,
      estado, logros y stack) sin JavaScript.
    - Un único `h1`.
    - JavaScript de la home ≤ 3 kB con gzip (hero + revelado común + spotlight común).
  - Spotlight y revelado revisados en "Tecnologías" y "Proyectos"; reduced motion y JavaScript
    desactivado revisados (recargando).
  - Rendimiento: pestaña Performance con scroll y puntero por "Tecnologías" y "Proyectos"
    (trackpad), sin tareas largas.
  - Contraste AA según tokens y orden de tabulación sin cambios.
  - Revisión visual a 390px, 900px y 1440px contra la composición A · Sistema.
  - Lighthouse ≥ 90 en todas las categorías (DevTools sobre `bun run preview`).

## Registro de decisiones

| Fecha | Tipo | Decisión | Motivo |
|-------|------|----------|--------|
| 2026-09-15 | Creación | Plan inicial de 7 tareas | — |
| 2026-09-15 | Planificación | T01 incorpora al sistema la constante "breakpoint ancho 1024px" y la nota de cards sin enlace, antes que el código | El diseño 006 pide incorporarlo en la primera tarea; no hay tokens nuevos |
| 2026-09-15 | Planificación | Campo `featured` (booleano obligatorio) en el esquema de `projects` | Presentación validada por esquema, no deducida del nombre (constitución §4; como `presentation` en 005) |
| 2026-09-15 | Planificación | Logros extraídos del cuerpo de cada entrada con una función pura de `src/lib/projects.ts` en lugar de renderizar el markdown | Marcado controlado (marcas decorativas por punto) y lógica testeable (constitución §4 y §5) |
| 2026-09-15 | Planificación | Texto del estado en `projectStatusLabel` y badge como componente `StatusBadge` | Reutilizable en la formación (spec 008), que también tiene estado |
| 2026-09-15 | Planificación | Spotlight extraído a `CardSpotlight` (script y capas globales, marca `data-spotlight` y estado `data-spotlight-active`) antes de las cards de proyecto | Un único script para "Tecnologías" y "Proyectos" (CA-3.3); cada sección conserva solo sus cambios de color |
| 2026-09-15 | Planificación | La revisión visual de `ProjectCard` se hace en T06, con la sección en la home | La card aislada no se muestra en ninguna página |
