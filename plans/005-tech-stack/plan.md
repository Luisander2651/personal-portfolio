---
id: 005
title: Tecnologías
spec: specs/005-tech-stack/spec.md
design: designs/005-tech-stack/design.md
status: approved
created: 2026-09-15
updated: 2026-09-15
---

# Plan — Tecnologías

Leyenda: `[ ]` pendiente · `[x]` hecha · `[-]` obsoleta · una tarea `[ ]` con línea
**Bloqueo** está detenida por `/implement` hasta resolver una brecha.

## Resumen

| Capa | Tareas |
|------|--------|
| Sistema (tokens e iconografía) | T01 |
| Datos | T02, T03, T04 |
| Estructura estática, estilos y revelado (componente) | T05 |
| Movimiento e interacción (spotlight) | T06 |
| Pulido | — (incluido en T05 y T06) |
| Verificación final | T07 |

## Cobertura de criterios

| Criterio | Tareas |
|----------|--------|
| CA-1.1 | T05, T07 |
| CA-1.2 | T02 |
| CA-1.3 | T03, T05 |
| CA-1.4 | T03, T05 |
| CA-1.5 | T03, T05 |
| CA-2.1 | T04, T05 |
| CA-2.2 | T05 |
| CA-2.3 | T04 |
| CA-3.1 | T06, T07 |
| CA-3.2 | T05, T06, T07 |
| CA-3.3 | T06, T07 |
| CA-4.1 | T01, T05, T06 |
| CA-4.2 | T05 |
| CA-4.3 | T07 |

## Tareas

### [x] T01 — Incorporar al sistema los tokens y la iconografía de tecnologías

- **Criterios**: CA-4.1
- **Diseño**: `designs/005-tech-stack/design.md` → "Cambios a incorporar al sistema"
- **Archivos**: `designs/000-design-system/design.md` (modificar), `src/styles/tokens.css` (modificar)
- **Qué hacer**:
  - En `designs/000-design-system/design.md`:
    - Sección de tokens nueva "Tecnologías" con `--tech-card-min-width` y `--tech-item-min-width`.
    - En "Iconografía": excepción "logos de tecnología" (Simple Icons, CC0, relleno de un color
      del sistema, solo en la sección de tecnologías) y los 6 iconos genéricos de línea (taza,
      tabla, llaves, flechas bidireccionales, enlace con flecha saliente, llave).
    - Entrada en el registro de decisiones del sistema.
  - En `src/styles/tokens.css`: declarar los 2 tokens (fijos).
- **Test**: el test de tokens existente (`tests/styles/tokens.test.ts`); rojo al documentar los
  tokens y verde al declararlos. Sin test nuevo.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - Sistema y `tokens.css` coinciden con el diseño 005, en un solo commit.

### [ ] T02 — Categoría "Desarrollo móvil" y presentación de cada categoría

- **Criterios**: CA-1.2
- **Diseño**: —
- **Archivos**: `docs/cv.md` (modificar), `src/content/skills/mobile-development.md` (crear), las 7
  entradas de `src/content/skills/` desde "Bases de datos y caché" (modificar `order`) y todas
  las de `src/content/skills/` (modificar para el campo nuevo), `src/content/schemas.ts`
  (modificar), `tests/content/schemas.test.ts` (modificar), `tests/content/entries.test.ts`
  (modificar)
- **Qué hacer**:
  - `docs/cv.md`: añadir `### Desarrollo móvil` con `Android nativo (Java, Kotlin), Ionic` justo
    después de "Backend y web".
  - Colección `skills`: entrada nueva "Desarrollo móvil" (`order` 3, ítems
    `Android nativo (Java, Kotlin)` e `Ionic`); las categorías siguientes pasan a `order` 4–10.
  - Esquema de `skills`: campo obligatorio `presentation` con valores `icons`, `tags` o `text`.
  - Valores: `icons` para Lenguajes y fundamentos, Backend y web, Desarrollo móvil, Bases de
    datos y caché, DevOps y herramientas y Seguridad y pruebas; `tags` para Arquitectura y
    prácticas; `text` para Desarrollo asistido por IA, CI/CD y Contenedores / entornos.
- **Test**:
  - Esquema: rechaza una categoría sin `presentation` o con un valor fuera de los tres.
  - Entradas: 10 categorías; siguen coincidiendo con `cv.md` en nombre, ítems y orden;
    "Desarrollo móvil" es la 3.ª con sus dos ítems; cada categoría tiene la `presentation` de
    la spec.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - `docs/cv.md` y la colección incluyen "Desarrollo móvil" y las 10 categorías tienen su
    presentación.

### [ ] T03 — Agrupación de categorías para la sección

- **Criterios**: CA-1.3, CA-1.4, CA-1.5
- **Diseño**: `A · Bento — Escritorio 1440` (orden de los bloques)
- **Archivos**: `src/lib/skills.ts` (crear), `tests/lib/skills.test.ts` (crear)
- **Qué hacer**: función pura `groupSkillsForSection` que recibe las entradas de `skills` y
  devuelve tres grupos — categorías con iconos, con etiquetas y con texto — cada uno ordenado
  por `order`; lanza un error si hay órdenes duplicados.
- **Test**: agrupa por `presentation`; mantiene el orden por `order` dentro de cada grupo aunque
  la entrada llegue desordenada; no muta la entrada; error con órdenes duplicados; grupos vacíos
  cuando no hay categorías de un tipo.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.

### [ ] T04 — Catálogo de iconos de tecnologías

- **Criterios**: CA-2.1, CA-2.3
- **Diseño**: `designs/005-tech-stack/design.md` → "Iconografía de la sección" (tabla ítem → icono)
- **Archivos**: `src/lib/tech-icons.ts` (crear), `tests/lib/tech-icons.test.ts` (crear)
- **Qué hacer**:
  - Catálogo de los 29 ítems de las categorías con iconos → icono, con tipo `logo` (trazados
    de Simple Icons 16.31.0 copiados) o `line` (trazados de los 6 iconos genéricos del canvas).
  - Comentario de cabecera con la fuente (Simple Icons, versión) y la licencia (CC0) de los logos.
  - Función de consulta por nombre de ítem que lanza un error si el ítem no tiene icono.
- **Test**:
  - Cada ítem de las categorías `icons` de la colección tiene icono.
  - El tipo de cada ítem coincide con la tabla del diseño (21 `logo`, 6 `line`; "Java" y los
    genéricos como `line`, "Android nativo (Java, Kotlin)" con el logo de Android).
  - Los trazados no están vacíos y no incluyen colores.
  - El archivo menciona Simple Icons y CC0.
  - Consultar un ítem desconocido lanza un error.
  - El test de configuración del proyecto sigue confirmando que no hay dependencias nuevas.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.

### [ ] T05 — Componente "Tecnologías": estructura, estilos y revelado

- **Criterios**: CA-1.1, CA-1.3, CA-1.4, CA-1.5, CA-2.1, CA-2.2, CA-3.2, CA-4.1, CA-4.2
- **Diseño**: `A · Bento — Móvil 390`, `A · Bento — Escritorio 1440` · `M-2`
- **Archivos**: `src/components/TechStackSection.astro` (crear), `src/pages/index.astro`
  (modificar), `tests/components/tech-stack-section.test.ts` (crear),
  `tests/components/tech-stack-section-styles.test.ts` (crear)
- **Qué hacer**:
  - **`TechStackSection`**. Props: los tres grupos de `groupSkillsForSection`.
    - `section` con id `tecnologias` y `aria-labelledby` al `h2` de `SectionHeader`
      (ancla `tecnologias`, título "Tecnologías").
    - Cards de las 6 categorías con iconos: `h3`, contador decorativo oculto y lista de ítems
      con icono SVG en línea oculto (desde el catálogo de T04) + nombre visible.
    - "Arquitectura y prácticas": `h3` y lista de etiquetas sin iconos.
    - Notas: `h3` y párrafo por categoría de texto.
    - Sin elementos enfocables.
  - **Estilos** con tokens, mobile-first, fieles a la composición A:
    - Contenedor `--section-max-width`, separaciones `--section-header-gap`, `--space-*`.
    - Fila 1 en 5:7 desde 768px; fila 2 con columnas automáticas por
      `--tech-card-min-width`; ítems con columnas automáticas por `--tech-item-min-width`.
    - Cards del sistema; iconos en `--color-text-secondary` con `currentColor`; etiquetas del
      sistema; notas en `--color-text-muted`; notas en 3 columnas desde 768px.
  - **Revelado M-2** (CSS scroll-driven, sin JavaScript) de cada card, del bloque de
    arquitectura y del bloque de notas: solo dentro de
    `@media (prefers-reduced-motion: no-preference)` y `@supports (animation-timeline: view())`;
    `opacity` y `transform` sin `filter`, con capa propia; rango `--reveal-range-start` →
    `--reveal-range-start` + `--reveal-range-length`, curva `--ease-in-out`.
  - **`index.astro`**: obtener la colección `skills`, agruparla y renderizar `TechStackSection`
    justo después de `AboutSection` dentro de `main`.
- **Test**:
  - `tech-stack-section.test.ts`:
    - `section#tecnologias` con `aria-labelledby` al `h2` "Tecnologías".
    - 6 cards en el orden recibido, cada una con `h3` y sus ítems en orden con nombre visible y
      exactamente un SVG oculto a lectores de pantalla.
    - "Arquitectura y prácticas" con sus etiquetas sin SVG.
    - Tres notas con `h3` y párrafo, sin SVG.
    - Contadores ocultos; sin enlaces, botones, controles ni `tabindex`.
    - `index.astro` renderiza `TechStackSection` después de `AboutSection` dentro de `main`.
  - `tech-stack-section-styles.test.ts`:
    - Sin colores, tamaños, espaciados ni duraciones literales.
    - Usa `--tech-card-min-width`, `--tech-item-min-width`, `--section-max-width` y los tokens
      de revelado.
    - Regla 5:7 desde 768px.
    - Los iconos usan `currentColor` y colores de tokens.
    - Toda regla que oculta o desplaza contenido está dentro de no-preference y del `@supports`.
    - El revelado no anima `filter`, declara `will-change: opacity, transform` y usa
      `--ease-in-out`.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - JavaScript de la home en `dist/` sin cambios (solo el del hero en esta tarea).
  - Comprobación manual en Chrome:
    - Sección a 390px y 1440px contra `A · Bento — Móvil 390` y `— Escritorio 1440`.
    - Revelado al hacer scroll visible y scroll fluido con trackpad.
    - Con reduced motion emulado, contenido directo; con JavaScript desactivado, contenido completo.

### [ ] T06 — Spotlight en las cards de categoría

- **Criterios**: CA-3.1, CA-3.2, CA-3.3, CA-4.1
- **Diseño**: `A · Bento — Movimiento` · `M-1`
- **Archivos**: `src/components/TechStackSection.astro` (modificar),
  `tests/components/tech-stack-spotlight.test.ts` (crear)
- **Qué hacer**:
  - **CSS**: capa de luz con gradiente radial de `--color-spotlight` y radio `--spotlight-size`
    centrada en variables de posición del puntero; capa luminosa con `--border-glow` y
    `--shadow-glow-soft`; iconos a `--color-text`; aparición y desaparición en
    `--duration-base` / `--ease-out`.
    - Solo se activa con `(hover: hover) and (pointer: fine)` y un estado que marca el
      script cuando el puntero está dentro.
    - Con `prefers-reduced-motion: reduce`: sin capa de luz; borde luminoso y sombra estáticos
      en hover, sin transición.
    - Táctil: sin efecto.
  - **Script** del componente (sin dependencias): solo si hay puntero fino y no hay reduced
    motion; al mover el puntero sobre una card actualiza sus variables de posición como máximo
    una vez por fotograma y marca la card mientras el puntero está dentro; nada si falla o sin JS.
- **Test**:
  - El componente tiene un script que comprueba `(hover: hover) and (pointer: fine)` y
    `prefers-reduced-motion`, usa `requestAnimationFrame` y no importa paquetes.
  - La capa de luz usa `--color-spotlight` y `--spotlight-size`; el estado luminoso usa
    `--border-glow` y `--shadow-glow-soft`.
  - Las reglas del spotlight están dentro de la media query de puntero fino; con reduced motion
    no hay capa de luz ni transiciones.
  - Sin estilos que oculten contenido fuera de las condiciones del revelado.
  - Estilos sin valores literales.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - JavaScript de cliente de la home en `dist/` ≤ 3 kB con gzip, sin dependencias, solo hero
    y spotlight (medido con Bun).
  - Comprobación manual en Chrome:
    - Spotlight contra `A · Bento — Movimiento` (reposo, puntero dentro, se mueve, sale).
    - Scroll y movimiento del puntero fluidos con trackpad.
    - Con reduced motion emulado, borde estático sin luz; con JavaScript desactivado, sin luz y
      contenido completo.

### [ ] T07 — Verificación final

- **Criterios**: todos
- **Diseño**: todas las pantallas de `designs/005-tech-stack/design.md`
- **Archivos**: —
- **Qué hacer**: verificación completa de la spec.
- **Test**: cada CA tiene cobertura:
  - CA-1.1 → `tests/components/tech-stack-section.test.ts` + revisión de `dist/`
  - CA-1.2 → `tests/content/schemas.test.ts` + `tests/content/entries.test.ts`
  - CA-1.3, CA-1.4, CA-1.5 → `tests/lib/skills.test.ts` + `tests/components/tech-stack-section.test.ts`
  - CA-2.1 → `tests/lib/tech-icons.test.ts` + `tests/components/tech-stack-section.test.ts`
  - CA-2.2 → `tests/components/tech-stack-section-styles.test.ts`
  - CA-2.3 → `tests/lib/tech-icons.test.ts` + `tests/project-setup.test.ts`
  - CA-3.1 → `tests/components/tech-stack-spotlight.test.ts` + comprobación manual
  - CA-3.2 → `tests/components/tech-stack-section-styles.test.ts` + `tests/components/tech-stack-spotlight.test.ts` + comprobación manual
  - CA-3.3 → medición de `dist/`
  - CA-4.1 → `tests/components/tech-stack-section-styles.test.ts` + `tests/components/tech-stack-spotlight.test.ts` + `tests/styles/tokens.test.ts`
  - CA-4.2 → `tests/components/tech-stack-section.test.ts`
  - CA-4.3 → Lighthouse
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - `dist/index.html`:
    - `section#tecnologias` única tras `#sobre-mi` dentro de `main`, con las 10 categorías,
      sus ítems e iconos sin JavaScript.
    - Un único `h1`.
    - JavaScript de la home ≤ 3 kB con gzip (hero + spotlight).
  - Reduced motion y JavaScript desactivado revisados.
  - Rendimiento: pestaña Performance con scroll y puntero por la sección (trackpad), sin
    fotogramas largos.
  - Contraste AA según tokens y orden de tabulación sin cambios.
  - Revisión visual a 390px y 1440px contra la composición A.
  - Lighthouse ≥ 90 en todas las categorías (DevTools sobre `bun run preview`).

## Registro de decisiones

| Fecha | Tipo | Decisión | Motivo |
|-------|------|----------|--------|
| 2026-09-15 | Creación | Plan inicial de 7 tareas | — |
| 2026-09-15 | Planificación | T01 incorpora tokens e iconografía al sistema y a `tokens.css` en un solo commit | Mantener en verde el test de tokens de la spec 002 (como en 003 y 004) |
| 2026-09-15 | Planificación | Campo `presentation` (`icons`, `tags`, `text`) en el esquema de `skills` en lugar de deducir la presentación del nombre | Contenido separado de presentación y validado por esquema (constitución §4) |
| 2026-09-15 | Planificación | Agrupación en `src/lib/skills.ts` y catálogo de iconos en `src/lib/tech-icons.ts`, cada uno con su test | Lógica en `src/lib/` como funciones puras con test (constitución §4 y §5) |
| 2026-09-15 | Planificación | Estructura, estilos y revelado del componente en una sola tarea (T05); el spotlight con script en otra (T06) | Preferencia del usuario en el plan 004; el spotlight añade JavaScript y se verifica aparte |
| 2026-09-15 | Planificación | Nombres: `presentation`, `groupSkillsForSection`, `TechStackSection`, `tech-icons` | Identificadores en inglés (constitución §9) |
