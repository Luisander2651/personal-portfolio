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

Orden de ejecución: T01 → T02 → T03 → T04 → T08 → T10 → T09 → T05 → T06 → T07.

Leyenda: `[ ]` pendiente · `[x]` hecha · `[-]` obsoleta · una tarea `[ ]` con línea
**Bloqueo** está detenida por `/implement` hasta resolver una brecha.

## Resumen

| Capa | Tareas |
|------|--------|
| Sistema (tokens, iconografía y P-1) | T01, T08, T10 |
| Datos | T02, T03, T04 |
| Estructura estática y estilos (componente) | T05 |
| Movimiento e interacción (revelado común, "Sobre mí" y spotlight) | T08, T09, T06 |
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
| CA-3.2 | T08, T05, T06, T07 |
| CA-3.3 | T08, T06, T07 |
| CA-4.1 | T01, T05, T06 |
| CA-4.2 | T05 |
| CA-4.3 | T07 |
| CA-4.4 | T08, T10, T05, T07 |
| Spec 004 · CA-4.1, CA-4.2, CA-4.4 (refinados) | T09 |

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

### [x] T02 — Categoría "Desarrollo móvil" y presentación de cada categoría

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

### [x] T03 — Agrupación de categorías para la sección

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

### [x] T04 — Catálogo de iconos de tecnologías

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

### [x] T08 — Revelado común al entrar en pantalla

Va antes de T05 y T09 porque ambas usan este revelado (añadida al replanificar; ver registro).

- **Criterios**: CA-3.2, CA-3.3, CA-4.4
- **Diseño**: `A · Bento — Movimiento` (fila "Revelado al entrar en pantalla · por tiempo") · `M-2`;
  `designs/005-tech-stack/design.md` → "Refinado del revelado"
- **Archivos**: `designs/000-design-system/design.md` (modificar), `src/styles/tokens.css`
  (modificar), `src/lib/section-reveal.ts` (crear), `tests/lib/section-reveal.test.ts` (crear),
  `src/components/SectionReveal.astro` (crear), `tests/components/section-reveal.test.ts` (crear),
  `src/pages/index.astro` (modificar)
- **Qué hacer**:
  - **Sistema**: P-1 como revelado por tiempo al entrar (umbral, escalonado, repetición al volver
    a entrar, salida sin animación, reduced motion y sin JS visibles); constante "umbral de
    revelado 10 %" en la tabla de constantes; eliminar `--reveal-range-start`,
    `--reveal-range-length` y `--reveal-blur` del sistema y de `tokens.css`; entrada en el
    registro del sistema.
  - **`src/lib/section-reveal.ts`**: funciones puras que, a partir de los cambios de visibilidad
    observados, deciden qué bloques pasan a revelados (≥ 10 % visible) y cuáles vuelven a
    ocultos (fuera del todo), y asignan el orden de escalonado a los que entran a la vez según
    su orden de lectura.
  - **`SectionReveal`** (se renderiza una vez en la home, al final de `main`):
    - Script sin dependencias: si no hay `prefers-reduced-motion: reduce`, marca el documento
      como "revelado activo", muestra de inmediato los bloques ya visibles y observa con
      `IntersectionObserver` (umbral 10 %) los elementos marcados como revelables para marcar
      su estado y su orden de escalonado.
    - Estilos globales con tokens: el estado oculto (`opacity: 0` y
      `translateY(var(--reveal-distance))`) solo aplica con el documento activo; transición a
      revelado en `--duration-reveal` / `--ease-out` con retraso `--stagger` por orden; al volver
      a oculto, sin transición.
  - **`index.astro`**: renderizar `SectionReveal` dentro de `main`, tras las secciones.
- **Test**:
  - `tests/lib/section-reveal.test.ts`: revela a partir del 10 % visible; oculta solo al quedar
    fuera del todo; no cambia bloques entre ambos umbrales; ordena el escalonado por orden de
    lectura de los que entran a la vez; no muta la entrada.
  - `tests/components/section-reveal.test.ts`: el script comprueba `prefers-reduced-motion`, usa
    `IntersectionObserver` con umbral del 10 % y solo importa de `src/lib`; los estilos solo usan
    tokens (`--reveal-distance`, `--duration-reveal`, `--ease-out`, `--stagger`); toda regla que
    oculta o desplaza contenido depende del atributo de documento activo; sin `filter`.
  - El test de tokens pasa a rojo al quitar los tokens del sistema y a verde al quitarlos de
    `tokens.css`.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - JavaScript de cliente de la home en `dist/` ≤ 3 kB con gzip, sin dependencias (hero + revelado).

### [x] T10 — Inicio del revelado por distancia de entrada

Va antes de T09 porque ajusta el revelado común que usan "Sobre mí" y "Tecnologías" (añadida al
replanificar; ver registro).

- **Criterios**: CA-4.4
- **Diseño**: `designs/005-tech-stack/design.md` → M-2 (disparador) y "Refinado del revelado";
  `A · Bento — Movimiento` (fila de revelado, "2 · Entra (120px dentro)")
- **Archivos**: `designs/000-design-system/design.md` (modificar), `src/styles/tokens.css`
  (modificar), `src/lib/section-reveal.ts` (modificar), `tests/lib/section-reveal.test.ts`
  (modificar), `src/components/SectionReveal.astro` (modificar),
  `tests/components/section-reveal.test.ts` (modificar)
- **Qué hacer**:
  - **Sistema**: token `--reveal-start-distance` (768: `80px` / `120px`) en "Tokens de
    movimiento"; quitar la constante "umbral de revelado 10 %"; P-1 con el disparador por
    distancia de entrada y la salvaguarda de bloque completo; entrada en el registro del sistema.
  - **`tokens.css`**: declarar `--reveal-start-distance` en móvil y desde 768px.
  - **`src/lib/section-reveal.ts`**: la decisión de revelar pasa a "el borde superior del bloque
    ha entrado al menos la distancia de inicio, o el bloque se ve completo"; ocultar sigue siendo
    "fuera del todo"; los bloques en medio no cambian; orden de lectura igual.
  - **`SectionReveal`**: leer la distancia del token al activarse y observar la entrada con un
    margen inferior igual a esa distancia; la visibilidad completa y la salida, sin margen; sin
    trabajo por fotograma de scroll.
- **Test**:
  - Tokens: rojo al documentar `--reveal-start-distance`, verde al declararlo.
  - Lib: revela cuando el borde superior ha entrado la distancia de inicio; no revela antes salvo
    que el bloque se vea completo; oculta solo fuera del todo; orden de lectura; sin mutar la entrada.
  - Componente: el script lee `--reveal-start-distance` y usa un margen inferior negativo con esa
    distancia en la observación de entrada; ya no usa el umbral del 10 %; el resto de
    comprobaciones (reduced motion, estilos solo con tokens y bajo el atributo activo) se mantiene.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - JavaScript de cliente de la home en `dist/` ≤ 3 kB con gzip, sin dependencias.

### [ ] T09 — "Sobre mí" con el revelado común


Aplica los criterios refinados de la spec 004 (CA-4.1, CA-4.2 y CA-4.4) con el revelado de T08.

- **Criterios**: spec 004 · CA-4.1, CA-4.2, CA-4.4; spec 005 · CA-4.4
- **Diseño**: `designs/004-about/design.md` → nota de M-1 (sustituido por el M-2 de 005)
- **Archivos**: `src/components/SectionHeader.astro` (modificar),
  `src/components/AboutSection.astro` (modificar), `tests/components/section-header.test.ts`
  (modificar), `tests/components/about-section.test.ts` (modificar),
  `tests/components/about-section-styles.test.ts` (modificar)
- **Qué hacer**:
  - `SectionHeader`: quitar el revelado ligado al scroll; marcar el encabezado como bloque
    revelable del revelado común.
  - `AboutSection`: quitar el revelado ligado al scroll y `will-change` del panel; marcar la caja
    `about.md` como bloque revelable.
  - Ajustar los tests de 004: sin `animation-timeline` ni reglas de revelado propias; encabezado y
    caja marcados como revelables; siguen sin scripts propios y con estilos solo de tokens.
- **Test**: los tests ajustados de `section-header`, `about-section` y `about-section-styles`
  (rojo al exigir las marcas y la ausencia del revelado anterior, verde al aplicarlo).
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - JavaScript de la home sin scripts nuevos respecto a T08.
  - Comprobación manual en Chrome:
    - "Sobre mí": encabezado y caja se revelan cuando han entrado 80px (móvil) / 120px
      (escritorio), en cascada, y otra vez al volver a entrar tras salir del todo.
    - Scroll fluido con trackpad.
    - Con reduced motion emulado y con JavaScript desactivado, todo visible sin animación.

### [ ] T05 — Componente "Tecnologías": estructura, estilos y marcas de revelado

Estructura, estilos y tests ya están hechos (sin commit) desde la primera ejecución; al
retomarla se sustituye el revelado ligado al scroll por las marcas del revelado común (T08).

- **Criterios**: CA-1.1, CA-1.3, CA-1.4, CA-1.5, CA-2.1, CA-2.2, CA-3.2, CA-4.1, CA-4.2, CA-4.4
- **Diseño**: `A · Bento — Móvil 390`, `A · Bento — Escritorio 1440` · `M-2` (revelado común)
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
  - **Revelado M-2**: marcar cada card, el bloque de arquitectura y el bloque de notas como
    bloques revelables del revelado común (T08); el componente no define animaciones propias.
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
    - Las 6 cards, el bloque de arquitectura y el de notas están marcados como revelables.
    - `index.astro` renderiza `TechStackSection` después de `AboutSection` dentro de `main`.
  - `tech-stack-section-styles.test.ts`:
    - Sin colores, tamaños, espaciados ni duraciones literales.
    - Usa `--tech-card-min-width`, `--tech-item-min-width` y `--section-max-width`.
    - Regla 5:7 desde 768px.
    - Los iconos usan `currentColor` y colores de tokens.
    - Sin animaciones ni reglas que oculten o desplacen contenido (el revelado es común).
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - JavaScript de la home en `dist/` sin scripts nuevos respecto a T08.
  - Comprobación manual en Chrome:
    - Sección a 390px y 1440px contra `A · Bento — Móvil 390` y `— Escritorio 1440`.
    - Revelado al entrar (cards en cascada) y otra vez al volver a entrar; scroll fluido con trackpad.
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
  - Sin estilos que oculten contenido (el ocultamiento es solo del revelado común).
  - Estilos sin valores literales.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - JavaScript de cliente de la home en `dist/` ≤ 3 kB con gzip, sin dependencias, solo hero,
    revelado común y spotlight (medido con Bun).
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
  - CA-4.4 → `tests/lib/section-reveal.test.ts` + `tests/components/section-reveal.test.ts` + `tests/components/tech-stack-section.test.ts` + comprobación manual
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - `dist/index.html`:
    - `section#tecnologias` única tras `#sobre-mi` dentro de `main`, con las 10 categorías,
      sus ítems e iconos sin JavaScript.
    - Un único `h1`.
    - JavaScript de la home ≤ 3 kB con gzip (hero + revelado común + spotlight).
  - Revelado al entrar (tras 80px / 120px) y al volver a entrar en "Sobre mí" y "Tecnologías"; reduced motion y
    JavaScript desactivado revisados.
  - Rendimiento: pestaña Performance con scroll y puntero por "Sobre mí" y "Tecnologías"
    (trackpad), sin fotogramas largos.
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
| 2026-09-15 | Implementación (T04) | El catálogo tiene 23 logos y 6 iconos de línea (29 ítems), como la tabla ítem → icono del diseño; los textos "21 logos" del diseño y del plan eran una errata de conteo | La tabla del diseño es la fuente detallada; el test sigue la tabla |
| 2026-09-15 | Implementación (T04) | Los iconos de línea con rectángulo o círculo (tabla, llave) se guardan como trazados `path` equivalentes | Un solo formato de datos (lista de trazados) para logos e iconos de línea |
| 2026-09-15 | Bloqueo resuelto | T05 se detuvo por tirones de scroll con los revelados ligados al scroll; tras pruebas del usuario, las specs 004 y 005 se refinaron (revelado disparado al entrar, cada vez que entra, con script común) y `/design-spec 005` definió el M-2 por tiempo | Revisión manual del usuario en T05; prueba K fluida |
| 2026-09-15 | Replanificación | Nueva T08 (sistema, funciones puras y componente `SectionReveal` del revelado común) y nueva T09 ("Sobre mí" con el revelado común), ambas antes de T05 | El P-1 del sistema y el revelado de 004 quedan invalidados; T05 y T09 dependen del revelado común |
| 2026-09-15 | Replanificación | T05 sustituye su revelado ligado al scroll por las marcas del revelado común y reutiliza el trabajo sin commit; T06 y T07 cuentan el revelado en el presupuesto de JS y en las comprobaciones | Refinado de specs y diseño |
| 2026-09-15 | Planificación | Revelado común como funciones puras en `src/lib/section-reveal.ts` + componente `SectionReveal` renderizado una vez en la home | Lógica testeable en `src/lib` (constitución §4 y §5) y un solo script para todas las secciones |
| 2026-09-15 | Archivo extra (T08) | `tests/components/about-section.test.ts` comprueba solo que `HomeHero` y `AboutSection` son los dos primeros componentes de `main` (commit aparte tras el de T08) | Al añadir `SectionReveal` a la home, la aserción exacta de 004 fallaba; ajuste ya aprobado por el usuario en T05 |
| 2026-09-15 | Bloqueo resuelto | T09 se detuvo porque el revelado empezaba con el 10 % del alto del bloque; `/design-spec 005` recuperó el inicio por distancia de entrada (`--reveal-start-distance`, 80px / 120px) con salvaguarda de bloque completo | Revisión manual del usuario en T09 |
| 2026-09-15 | Replanificación | Nueva T10 (token, funciones puras y `SectionReveal` con inicio por distancia) antes de T09; T09 sin bloqueo y con la comprobación de la distancia; T07 incluye el inicio por distancia | T08 (hecha) queda invalidada en el disparador |
