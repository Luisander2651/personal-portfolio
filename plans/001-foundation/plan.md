---
id: 001
title: Base del proyecto
spec: specs/001-foundation/spec.md
design: no aplica
status: approved
created: 2026-09-13
updated: 2026-09-13
---

# Plan — Base del proyecto

Leyenda: `[ ]` pendiente · `[x]` hecha · `[-]` obsoleta · una tarea `[ ]` con línea
**Bloqueo** está detenida por `/implement` hasta resolver una brecha.

## Resumen

Spec sin interfaz: las capas se adaptan a configuración → datos → estructura estática mínima.

| Capa | Tareas |
|------|--------|
| Configuración | T01, T02 |
| Datos | T03, T04, T05, T06 |
| Estructura estática | T07, T08 |
| Estilos | — (no aplica) |
| Movimiento e interacción | — (no aplica) |
| Pulido | — (no aplica) |
| Verificación final | T09 |

## Cobertura de criterios

| Criterio | Tareas |
|----------|--------|
| CA-1.1 | T01, T09 |
| CA-1.2 | T02 |
| CA-1.3 | T02, T09 |
| CA-1.4 | T01, T02 |
| CA-1.5 | T01 |
| CA-2.1 | T01 |
| CA-2.2 | T07 |
| CA-3.1 | T03 |
| CA-3.2 | T05 |
| CA-3.3 | T04 |
| CA-3.4 | T05, T06 |
| CA-4.1 | T06, T08, T09 |
| CA-4.2 | T08, T09 |

## Tareas

### [x] T01 — Entorno Astro + Bun + Vitest + git

- **Criterios**: CA-1.1, CA-1.4, CA-1.5, CA-2.1
- **Diseño**: —
- **Archivos**: `package.json`, `bun.lock`, `astro.config.mjs`, `tsconfig.json`,
  `vitest.config.ts`, `.gitignore`, `src/pages/index.astro` (provisional),
  `tests/project-setup.test.ts` (todos crear)
- **Qué hacer**:
  - Proyecto Astro mínimo creado con Bun; `output: 'static'`.
  - `tsconfig.json` extiende la configuración `strict` de Astro.
  - Vitest como dependencia de desarrollo; `vitest.config.ts` basado en `getViteConfig`
    de Astro (necesario para la Container API en T07).
  - Scripts `dev`, `build`, `preview` y `test` (Vitest en modo run, sin watch).
  - `git init` y `.gitignore` con `node_modules/`, `dist/`, `.astro/` y `.env*`.
  - `index.astro` provisional sin datos, solo para que el build funcione (se reemplaza en T08).
  - Excepción TDD: el test se escribe en cuanto Vitest está instalado y debe fallar antes
    de completar scripts, `tsconfig` y `.gitignore`.
- **Test**: `package.json` expone `dev`, `build`, `preview` y `test`, y `test` no usa watch;
  existe `bun.lock` y no existen `package-lock.json`, `yarn.lock` ni `pnpm-lock.yaml`;
  `tsconfig.json` extiende el modo `strict` de Astro; `.gitignore` contiene las cuatro entradas.
- **Terminado cuando**:
  - `bun install`, `bun run test` y `bun run build` en verde.
  - `git status` funciona en el directorio del proyecto.

### [x] T02 — Verificación de tipos en el build

- **Criterios**: CA-1.2, CA-1.3, CA-1.4
- **Diseño**: —
- **Archivos**: `package.json`, `bun.lock`, `tests/project-setup.test.ts` (modificar)
- **Qué hacer**:
  - Añadir `@astrojs/check` y `typescript` como dependencias de desarrollo (justificadas en la spec).
  - Script `check` que ejecuta `astro check`.
  - Script `build` que ejecuta `astro check` antes de `astro build`.
- **Test**: existe el script `check`; el script `build` ejecuta la verificación de tipos
  antes de construir.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - Comprobación manual: un error de tipos temporal en `src/` hace fallar `bun run build`;
    el error se revierte y no se incluye en el commit.

### [ ] T03 — Traducción de `docs/cv.md`

- **Criterios**: CA-3.1
- **Diseño**: —
- **Archivos**: `docs/cv.md` (modificar)
- **Qué hacer**:
  - Traducción fiel al español de todas las secciones.
  - Sin traducir: nombres propios, nombres de proyectos, empresas, instituciones y tecnologías.
  - Añadir GitHub (https://github.com/Luisander2651) y LinkedIn
    (https://www.linkedin.com/in/luis-mario-gutierrez-valdovinos-6998a6357).
  - Añadir el estado de la formación: TSU finalizado; Ingeniería en curso (egreso esperado 2026).
  - No añadir, quitar ni reformular datos más allá de la traducción y lo anterior.
- **Test**: — (no automatizable; CA-3.1 se verifica con la aprobación del usuario).
- **Terminado cuando**:
  - El usuario aprueba explícitamente la traducción.
  - `bun run test` y `bun run build` siguen en verde.

### [ ] T04 — Esquemas de las colecciones de contenido

- **Criterios**: CA-3.3
- **Diseño**: —
- **Archivos**: `src/content/schemas.ts`, `src/content.config.ts`,
  `tests/content/schemas.test.ts` (crear)
- **Qué hacer**:
  - `schemas.ts` exporta un esquema por colección (zod de Astro), reutilizable desde tests.
  - `content.config.ts` define las colecciones con loader de archivos Markdown en
    `src/content/<colección>/`.
  - Campos:
    - `profile`: `name`, `role`, `location`, `email` (email), `github` (url),
      `linkedin` (url), `summary`, `languages` (lista de `language` + `level`, mínimo 1).
    - `skills`: `category`, `order` (entero positivo), `items` (lista, mínimo 1).
    - `projects`: `name`, `order` (entero positivo), `status` (`completed` | `in-progress`),
      `stack` (lista, mínimo 1); el cuerpo contiene los logros.
    - `experience`: `company`, `position`, `duration` (texto); el cuerpo contiene los logros.
    - `education`: `degree`, `specialization`, `institution`,
      `status` (`completed` | `in-progress`), `expectedYear` (entero, opcional).
- **Test**: para cada esquema, un ejemplo válido pasa; falta de un campo obligatorio falla
  indicando el campo; `status` fuera de los valores permitidos falla (projects y education);
  email y URLs inválidos fallan en `profile`; listas vacías fallan.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.

### [ ] T05 — Entradas de contenido

- **Criterios**: CA-3.2, CA-3.4
- **Diseño**: —
- **Archivos**: `src/content/profile/profile.md`, `src/content/skills/*.md` (9),
  `src/content/projects/*.md` (5), `src/content/experience/syspyra-solutions.md`,
  `src/content/education/*.md` (2), `tests/content/entries.test.ts` (crear)
- **Qué hacer**:
  - Una entrada por elemento de `docs/cv.md` ya traducido, con nombres de archivo en
    kebab-case en inglés.
  - `order` sigue el orden de `docs/cv.md` en skills y projects.
  - Projects: "DentissaApp — Auth Microservice" `in-progress`, resto `completed`.
  - Education: TSU `completed`; Ingeniería `in-progress` con `expectedYear: 2026`.
  - Ningún dato que no esté en `docs/cv.md`.
- **Test**: carga las entradas Markdown sin depender de `astro:content` y valida cada una
  con su esquema de `schemas.ts`; comprueba conteos (1 / 9 / 5 / 1 / 2); comprueba valores
  clave frente a `docs/cv.md` (nombre, rol, nombres de proyectos y su stack, empresa,
  títulos); comprueba los `status` de projects y education.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - Revisión manual: cada dato de las entradas existe en `docs/cv.md`.

### [ ] T06 — Funciones de `src/lib/`

- **Criterios**: CA-3.4, CA-4.1
- **Diseño**: —
- **Archivos**: `src/lib/projects.ts`, `src/lib/page-meta.ts`,
  `tests/lib/projects.test.ts`, `tests/lib/page-meta.test.ts` (crear)
- **Qué hacer**:
  - `sortProjects`: función pura que devuelve los proyectos ordenados por `order`
    ascendente sin mutar la entrada, y falla si hay `order` duplicados.
  - `getPageMeta`: función pura que recibe los datos de profile y devuelve
    `title` con formato "Nombre — Rol" y `description` igual a `summary`.
- **Test**: `sortProjects` ordena una lista desordenada, no muta la original y falla con
  `order` duplicado; `getPageMeta` compone el título con la raya " — " y usa el resumen
  como descripción.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.

### [ ] T07 — Layout base

- **Criterios**: CA-2.2
- **Diseño**: —
- **Archivos**: `src/layouts/BaseLayout.astro`, `tests/layouts/base-layout.test.ts` (crear)
- **Qué hacer**:
  - `BaseLayout` con props `title` y `description`.
  - Documento con `lang="es"`, meta charset, meta viewport, `<title>`,
    `<meta name="description">` y un slot para el contenido.
  - Sin estilos ni scripts.
- **Test**: renderizado con la Container API pasando título y descripción de prueba:
  el HTML tiene `lang="es"`, contiene ese título en `<title>`, esa descripción en la meta
  description y no contiene `<script>`.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.

### [ ] T08 — Página index mínima

- **Criterios**: CA-4.1, CA-4.2
- **Diseño**: —
- **Archivos**: `src/components/ProfileHeading.astro`,
  `tests/components/profile-heading.test.ts` (crear), `src/pages/index.astro` (modificar)
- **Qué hacer**:
  - `ProfileHeading` con props `name` y `role`: un único `<h1>` con nombre y rol.
  - `index.astro` obtiene la entrada de `profile`, usa `getPageMeta` para `BaseLayout` y
    renderiza `ProfileHeading`. Sin estilos ni scripts; ningún dato incrustado.
- **Test**: renderizado de `ProfileHeading` con la Container API y datos de prueba:
  hay un único `<h1>` que contiene el nombre y el rol, y no hay `<script>`.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - `dist/index.html` muestra el nombre y rol reales de `profile`.

### [ ] T09 — Verificación final

- **Criterios**: todos
- **Diseño**: no aplica
- **Archivos**: —
- **Qué hacer**: verificación completa de la spec.
- **Test**: cada CA tiene cobertura:
  - CA-1.1, CA-1.4, CA-1.5, CA-2.1 → `tests/project-setup.test.ts`
  - CA-1.2 → `tests/project-setup.test.ts` + build
  - CA-1.3 → comprobación manual (T02 y esta tarea)
  - CA-2.2 → `tests/layouts/base-layout.test.ts`
  - CA-3.1 → aprobación del usuario (T03)
  - CA-3.2 → `tests/content/entries.test.ts`
  - CA-3.3 → `tests/content/schemas.test.ts`
  - CA-3.4 → `tests/content/entries.test.ts` + `tests/lib/projects.test.ts`
  - CA-4.1 → `tests/lib/page-meta.test.ts` + `tests/components/profile-heading.test.ts` + inspección de `dist/`
  - CA-4.2 → `tests/components/profile-heading.test.ts` + inspección de `dist/`
- **Terminado cuando**:
  - Instalación limpia: sin `node_modules`, `bun install` en verde.
  - `bun run test` y `bun run build` en verde.
  - Un error de tipos temporal hace fallar el build (revertido).
  - `dist/index.html`: `lang="es"`, `<title>` "Nombre — Rol", meta description con el
    resumen, `<h1>` con nombre y rol, sin JavaScript de cliente.
  - Lighthouse ≥ 90 en todas las categorías (DevTools de Chrome sobre `bun run preview`).
  - No aplican en esta spec: reduced-motion, revisión visual contra canvas, navegación por
    teclado (sin elementos interactivos).

## Registro de decisiones

| Fecha | Tipo | Decisión | Motivo |
|-------|------|----------|--------|
| 2026-09-13 | Creación | Plan inicial de 9 tareas | — |
| 2026-09-13 | Planificación | CA-4.1 y CA-4.2 se verifican con lógica en `src/lib`, Container API de `ProfileHeading` e inspección de `dist/` | `bun run test` no depende del build (usuario) |
| 2026-09-13 | Planificación | Formato de título "Nombre — Rol" | Usuario |
| 2026-09-13 | Planificación | Traducción de cv.md en T03, tras crear el entorno | Constitución §5 exige test y build en verde al terminar cada tarea |
| 2026-09-13 | Planificación | `profile.summary` en frontmatter | Se usa como meta description |
| 2026-09-13 | Planificación | Tests de contenido sin `astro:content` | Independencia de los tests respecto al build |
| 2026-09-13 | Cambio | `status` obligatorio en `education` (TSU `completed`, Ingeniería `in-progress`) | Petición del usuario; spec 001 actualizada con el dato |
| 2026-09-13 | Implementación (T02) | `typescript` fijado en `^6.0.3` | `@astrojs/check` 0.9.10 solo admite TypeScript `^5 \|\| ^6`; la 7.x instalada por defecto era incompatible |
| 2026-09-13 | Implementación (T02) | Los tests leen archivos del proyecto con importaciones de Vite (`?raw`, JSON, `import.meta.glob`) en vez de `node:fs` | `astro check` revisa también `tests/`; evita añadir `@types/node`, que no está en la spec |
