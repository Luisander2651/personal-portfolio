---
id: 001
title: Base del proyecto
status: done
created: 2026-09-13
updated: 2026-09-13
depends_on: []
---

# Base del proyecto

## Objetivo

Dejar listo el entorno de trabajo (Astro + Bun + TypeScript `strict` + Vitest) y el
contenido profesional de `docs/cv.md`, en español, dentro de Content Collections con
esquema validado. Es la base técnica sobre la que se construyen todas las specs
siguientes; no incluye interfaz visual.

## Historias de usuario

- **HU-1**: Como desarrollador del portafolio, quiero un proyecto Astro con Bun y
  TypeScript `strict` con scripts estándar, para trabajar siguiendo el flujo del proyecto.
- **HU-2**: Como desarrollador, quiero Vitest configurado con soporte para renderizar
  componentes `.astro`, para aplicar TDD desde la primera tarea.
- **HU-3**: Como dueño del portafolio, quiero mi CV en español dentro de colecciones de
  contenido validadas, para que el sitio muestre solo datos veraces y consistentes.
- **HU-4**: Como desarrollador, quiero una página mínima que lea las colecciones, para
  comprobar que el contenido llega al sitio generado.

## Criterios de aceptación

### HU-1

- **CA-1.1**
  - **Dado** el repositorio sin `node_modules`
  - **Cuando** ejecuto `bun install`
  - **Entonces** las dependencias se instalan sin errores, existe `bun.lock` y no existe
    `package-lock.json`, `yarn.lock` ni `pnpm-lock.yaml`
- **CA-1.2**
  - **Dado** el proyecto instalado
  - **Cuando** ejecuto `bun run build`
  - **Entonces** se ejecuta `astro check` sin errores y se genera un sitio estático en `dist/`
- **CA-1.3**
  - **Dado** un error de tipos en un archivo de `src/`
  - **Cuando** ejecuto `bun run build`
  - **Entonces** el build falla indicando el error de tipos
- **CA-1.4**
  - **Dado** el `package.json` del proyecto
  - **Cuando** consulto sus scripts
  - **Entonces** existen `dev`, `build`, `preview`, `test` y `check`, y la configuración de
    TypeScript usa el modo `strict` de Astro
- **CA-1.5**
  - **Dado** el directorio del proyecto
  - **Cuando** ejecuto `git status`
  - **Entonces** es un repositorio git y `.gitignore` excluye `node_modules/`, `dist/`,
    `.astro/` y archivos `.env*`

### HU-2

- **CA-2.1**
  - **Dado** el proyecto instalado
  - **Cuando** ejecuto `bun run test`
  - **Entonces** Vitest se ejecuta una sola vez (sin modo watch) y termina con código 0 si
    todos los tests pasan
- **CA-2.2**
  - **Dado** el layout base
  - **Cuando** un test lo renderiza con la Container API de Astro pasando un título y una
    descripción de prueba
  - **Entonces** el HTML resultante tiene `lang="es"` y contiene ese título y esa descripción

### HU-3

- **CA-3.1**
  - **Dado** `docs/cv.md`
  - **Cuando** se completa su traducción
  - **Entonces** está en español, incluye las URLs de GitHub y LinkedIn, indica el estado
    de la formación (TSU finalizado, Ingeniería en curso), conserva sin
    traducir nombres propios, nombres de proyectos y tecnologías, y el usuario aprobó la
    traducción (verificación: revisión y aprobación explícita del usuario)
- **CA-3.2**
  - **Dado** las colecciones `profile`, `skills`, `projects`, `experience` y `education`
  - **Cuando** se ejecutan los tests
  - **Entonces** todas las entradas validan su esquema y hay exactamente 1 `profile`,
    9 categorías de `skills`, 5 `projects`, 1 `experience` y 2 `education`, con los mismos
    datos que `docs/cv.md`; en `education`, el TSU tiene `status: completed` y la
    Ingeniería `status: in-progress`
- **CA-3.3**
  - **Dado** una entrada a la que le falta un campo obligatorio o tiene un valor no permitido
  - **Cuando** se valida contra su esquema (en tests) o se ejecuta `bun run build`
  - **Entonces** la validación falla indicando el campo
- **CA-3.4**
  - **Dado** la colección `projects`
  - **Cuando** se obtienen los proyectos mediante la función de `src/lib/` correspondiente
  - **Entonces** se devuelven ordenados por `order` ascendente (mismo orden que `docs/cv.md`),
    "DentissaApp — Auth Microservice" tiene `status: in-progress` y el resto `completed`

### HU-4

- **CA-4.1**
  - **Dado** el sitio generado con `bun run build`
  - **Cuando** inspecciono `dist/index.html`
  - **Entonces** tiene `<html lang="es">`, un `<title>` con nombre y rol, una
    `<meta name="description">` con el resumen profesional y un `<h1>` con nombre y rol,
    todos tomados de la colección `profile`
- **CA-4.2**
  - **Dado** `dist/index.html`
  - **Cuando** lo inspecciono
  - **Entonces** no contiene JavaScript de cliente

## Contenido

Fuente: `docs/cv.md`, traducido al español en esta spec (CA-3.1).

| Colección | Entradas | Datos | Sección de `docs/cv.md` |
|-----------|----------|-------|--------------------------|
| `profile` | 1 | Nombre, rol, ubicación, email, GitHub, LinkedIn, resumen profesional, idiomas y nivel | Cabecera, Professional Summary, Languages |
| `skills` | 9 | Categoría, orden y lista de habilidades | Technical Skills |
| `projects` | 5 | Nombre, orden, estado, logros (cuerpo), stack | Project Highlights |
| `experience` | 1 | Empresa, puesto, duración (texto, sin fechas), logros (cuerpo) | Experience |
| `education` | 2 | Título, especialidad, institución, estado (`completed` \| `in-progress`) y año esperado (opcional) | Education |

Datos a añadir a `docs/cv.md` (aportados por el usuario):
- GitHub: https://github.com/Luisander2651
- LinkedIn: https://www.linkedin.com/in/luis-mario-gutierrez-valdovinos-6998a6357
- Estado de la formación: TSU en Tecnologías de la Información finalizado; Ingeniería en
  Tecnologías de la Información en curso (egreso esperado 2026).

Dependencias justificadas por esta spec: `astro`, `vitest` (constitución §1),
`@astrojs/check` y `typescript` (verificación de TypeScript `strict`, §1).

## Diseño

No aplica: spec sin interfaz. La página `index` es una página técnica mínima, sin estilos,
que será sustituida por la spec de la home.

## Fuera de alcance

- Tokens de diseño (color, tipografía, espaciado, movimiento): spec posterior, tras
  `/design-spec system`.
- Estilos, fuentes, Motion y cualquier diseño visual de la home.
- Repositorio remoto en GitHub, `git push` y despliegue.
- Configuración de `site`, sitemap y SEO avanzado.
- Colección de logros o reconocimientos (no existen en `docs/cv.md`).
- Islas de frameworks UI.

## Registro de decisiones

| Fecha | Tipo | Pregunta / Conflicto | Decisión | Fuente |
|-------|------|----------------------|----------|--------|
| 2026-09-13 | Contradicción | Tokens pedidos sin sistema de diseño aprobado (constitución §6) | Tokens salen de esta spec a una spec posterior tras `/design-spec system` | usuario |
| 2026-09-13 | Contradicción | `docs/cv.md` en inglés vs. contenido y documentación en español (§9) | Traducir `docs/cv.md` al español como tarea de esta spec | usuario |
| 2026-09-13 | Brecha | GitHub y LinkedIn como "(agregar URL)" en cv.md | Se añaden las URLs aportadas por el usuario; campos obligatorios | usuario |
| 2026-09-13 | Brecha | ¿Incluye git? | `git init` + `.gitignore` local, sin remoto | usuario |
| 2026-09-13 | Brecha | Colecciones a crear | `profile`, `skills`, `projects`, `experience`, `education` | usuario |
| 2026-09-13 | Brecha | Formato de datos | Markdown con frontmatter, un archivo por entrada | usuario |
| 2026-09-13 | Brecha | Página necesaria para el build | Layout base + `index` mínima que lee `profile` | usuario |
| 2026-09-13 | Brecha | Preparación de tests | Vitest con config de Astro + Container API | usuario |
| 2026-09-13 | Brecha | Verificación de TypeScript `strict` | `astro check` dentro de `bun run build` | usuario |
| 2026-09-13 | Brecha | Orden y estado de proyectos sin fechas | Campos `order` (orden de cv.md) y `status` (`in-progress` solo Auth Microservice, resto `completed`) | usuario |
| 2026-09-13 | Implícita | Gestor de paquetes | Solo Bun | constitution.md §1 |
| 2026-09-13 | Implícita | Salida del sitio | Estática, sin JS de cliente | constitution.md §3 |
| 2026-09-13 | Implícita | Ubicación de datos y lógica | `src/content/` y funciones puras en `src/lib/` con tests | constitution.md §4, §5 |
| 2026-09-13 | Implícita | Idioma | Identificadores en inglés; contenido en español | constitution.md §9 |
| 2026-09-13 | Implícita | Duración de experiencia sin fechas | Se guarda como texto, sin inventar fechas | constitution.md §8 |
| 2026-09-13 | Implícita | Verificación de CA-3.1 | Traducción verificada por revisión del usuario (no automatizable) | usuario |
| 2026-09-13 | Brecha | Estado de la formación no indicado en cv.md (detectado en `/plan-spec 001`) | Campo `status` en `education`: TSU `completed`, Ingeniería `in-progress`; se añade a cv.md en la traducción | usuario |
| 2026-09-13 | Cierre | Spec implementada y verificada (plan `plans/001-foundation/plan.md`, T01–T09) | Spec marcada como `done` | usuario |
