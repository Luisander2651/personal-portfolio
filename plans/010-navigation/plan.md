---
id: 010
title: Navegación
spec: specs/010-navigation/spec.md
design: designs/010-navigation/design.md
status: approved
created: 2026-09-18
updated: 2026-09-18
---

# Plan — Navegación

Leyenda: `[ ]` pendiente · `[x]` hecha · `[-]` obsoleta · una tarea `[ ]` con línea
**Bloqueo** está detenida por `/implement` hasta resolver una brecha.

## Resumen

| Capa | Tareas |
|------|--------|
| Sistema y datos | T01, T02 |
| Estructura estática | T03 |
| Estilos | T04 |
| Movimiento e interacción | T05 |
| Verificación final | T06 |

## Cobertura de criterios

| Criterio | Tareas |
|----------|--------|
| CA-1.1 | T03, T06 |
| CA-1.2 | T02, T03 |
| CA-1.3 | T02, T03 |
| CA-1.4 | T01, T04, T06 |
| CA-1.5 | T01 |
| CA-2.1 | T03, T04 |
| CA-2.2 | T03, T04 |
| CA-3.1 | T04, T05 |
| CA-3.2 | T03, T04 |
| CA-3.3 | T04 |
| CA-4.1 | T02, T05 |
| CA-4.2 | T03 |
| CA-5.1 | T05, T06 |
| CA-5.2 | T04 |
| CA-5.3 | T06 |
| CA-5.4 | T01, T04, T05 |

## Tareas

### [x] T01 — Tokens de la navegación y scroll del documento

- **Criterios**: CA-1.4, CA-1.5, CA-5.4
- **Diseño**: `designs/010-navigation/design.md` → Cambios a incorporar al sistema · `M-3`
- **Archivos**: `designs/000-design-system/design.md` (modificar), `src/styles/tokens.css`
  (modificar), `src/styles/base.css` (modificar), `tests/styles/base.test.ts` (modificar)
- **Qué hacer**:
  - Sistema de diseño: añadir a sus tablas los tokens `--nav-height` (`60px` / `64px` desde
    768px), `--color-nav-bg` (`rgba(5, 7, 13, 0.92)`), `--nav-row-height` (`56px`),
    `--nav-marker-size` (`6px`) y `--shadow-nav-marker` (`0 0 10px rgba(34, 211, 238, 0.8)`), el
    patrón "enlace de navegación" y la barra de navegación, y la entrada en su registro.
  - `tokens.css`: los mismos tokens con sus valores (y el de 768px de `--nav-height`).
  - `base.css`: `scroll-behavior: smooth` en el documento solo sin reduced motion, y
    `scroll-margin-top: var(--nav-height)` en las secciones con ancla (`section[id]`).
- **Test**:
  - `tokens.test.ts` (existente): los tokens nuevos están documentados y declarados con el mismo
    valor, en su modo.
  - `base.test.ts`: el desplazamiento suave solo aparece dentro de
    `prefers-reduced-motion: no-preference`; las secciones con ancla usan
    `scroll-margin-top: var(--nav-height)`; sin literales.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.

### [x] T02 — Enlaces, iniciales y sección activa

- **Criterios**: CA-1.2, CA-1.3, CA-4.1
- **Diseño**: `designs/010-navigation/design.md` → Composición (marca, zona de lectura)
- **Archivos**: `src/lib/navigation.ts` (crear), `tests/lib/navigation.test.ts` (crear)
- **Qué hacer**: en `src/lib/navigation.ts`:
  - `NAV_LINKS`: la lista única de enlaces (texto y ancla) en el orden de la spec.
  - `initialsOf`: devuelve la primera letra de cada palabra de un nombre, en mayúscula.
  - `pickActiveSection`: a partir de las secciones medidas (ancla, borde superior e inferior
    respecto a la ventana) y la altura de la ventana, devuelve el ancla de la sección que cruza
    la línea situada a un tercio de la altura, o ninguna si la línea no cae en ninguna sección
    (hero).
- **Test**:
  - `NAV_LINKS`: los seis textos y anclas en orden.
  - `initialsOf`: "Luis Mario Gutiérrez Valdovinos" → "LMGV"; ignora espacios repetidos o en
    los extremos; conserva acentos en mayúscula; nombre de una palabra.
  - `pickActiveSection`: ninguna cuando la línea está sobre el hero; la sección correcta en
    medio; exactamente una en el límite entre dos secciones; la última sección al final de la
    página; lista vacía.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.

### [x] T03 — Barra de navegación en la home (HTML sin JavaScript)

- **Criterios**: CA-1.1, CA-1.2, CA-1.3, CA-2.1, CA-2.2, CA-3.2, CA-4.2
- **Diseño**: `A · Índice — Escritorio 1440` y `— Móvil 390` (estructura)
- **Archivos**: `src/components/SiteNav.astro` (crear), `tests/components/site-nav.test.ts`
  (crear), `src/pages/index.astro` (modificar)
- **Qué hacer**:
  - **`SiteNav`**. Props: el nombre del perfil.
    - `header` con, en este orden: enlace "Saltar al contenido" a `#contenido`; marca (enlace a
      `#top` con el marcador decorativo, las iniciales de `initialsOf` visibles y el nombre
      completo como texto accesible, con las iniciales ocultas a lectores); botón "Menú"
      (`type="button"`, `hidden`, `aria-expanded="false"`, `aria-controls` a la lista, icono
      decorativo); `nav aria-label="Principal"` con la lista (`id` referido por el botón) de
      `NAV_LINKS`: marcador decorativo, número `01`–`06` y texto.
    - Sin `aria-current` en el HTML.
  - **`index.astro`**: renderizar `SiteNav` con `profile.data.name` antes de `main`, y `main`
    con `id="contenido"`.
- **Test** (`site-nav.test.ts`):
  - Un `header` con un `nav` `aria-label="Principal"` y seis enlaces con los textos, números y
    anclas de la spec, en orden.
  - Orden de elementos enfocables: "Saltar al contenido", marca, botón, seis enlaces.
  - Marca: href `#top`, iniciales visibles y nombre completo como texto accesible, con las
    iniciales calculadas a partir de la prop.
  - Botón: `hidden`, `aria-expanded="false"`, `aria-controls` igual al `id` de la lista.
  - Ningún `aria-current`.
  - `index.astro`: `SiteNav` antes de `main`, con el nombre del perfil; `main` con
    `id="contenido"`.
  - Cada ancla de `NAV_LINKS` coincide con el `id` de la `section` del componente de sección
    correspondiente, en el orden en que esos componentes aparecen en `main`.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.

### [x] T04 — Estilos de la barra

- **Criterios**: CA-1.4, CA-2.1, CA-2.2, CA-3.1, CA-3.2, CA-3.3, CA-5.2, CA-5.4
- **Diseño**: `A · Índice — Escritorio 1440`, `— Móvil 390 cerrado`, `— Móvil 390 menú abierto` ·
  `M-1` · `M-2`
- **Archivos**: `src/components/SiteNav.astro` (modificar),
  `tests/components/site-nav-styles.test.ts` (crear)
- **Qué hacer** (tokens, mobile-first, fiel a A · Índice):
  - Cabecera fija arriba por encima del contenido, alto `--nav-height`, fondo `--color-nav-bg`,
    borde inferior; contenido con `--section-max-width` y `--space-gutter`.
  - Marca, enlaces y botón con las tipografías, colores, alturas (`--control-height`) y
    separaciones de `design.md`; estados reposo, hover, activo (`[aria-current='true']`:
    marcador visible con `--color-glow` y `--shadow-nav-marker`, número `--color-glow`, texto
    `--color-text`) y foco (`--focus-ring`, `--focus-ring-offset`).
  - "Saltar al contenido": fuera de la vista hasta `:focus`; con foco, la etiqueta mono de
    `design.md` por encima de la barra.
  - Por debajo de 1024px: panel de filas (`--nav-row-height`) bajo la barra; plegado solo cuando
    el script está activo (marca en el documento que pone T05) y el botón no está expandido.
    Desde 1024px: lista en línea y botón oculto.
  - Transiciones: panel (`opacity` + `transform`, `--duration-fast`) y marcador (`opacity`,
    `--duration-base`) solo con `prefers-reduced-motion: no-preference`.
- **Test** (`site-nav-styles.test.ts`): sin literales; usa los tokens citados; cabecera fija con
  `--nav-height`; media query de 1024px; reglas de plegado siempre condicionadas a la marca del
  script; ninguna regla oculta la lista sin esa marca; "Saltar al contenido" solo visible con
  foco; foco con los tokens del sistema; transiciones solo sin reduced motion y solo de
  `opacity`, `transform` y `color`.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - Comprobación manual en Chrome (sobre `bun run preview`), con JavaScript desactivado y sin
    él: barra a 390px y 1440px contra A · Índice; "Saltar al contenido" al primer Tab; la barra
    no tapa los `h2` al saltar a las anclas.

### [ ] T05 — Script de la navegación: menú y sección activa

- **Criterios**: CA-3.1, CA-4.1, CA-5.1, CA-5.4
- **Diseño**: `Movimiento — Menú y enlace activo` · `M-1` · `M-2`
- **Archivos**: `src/components/SiteNav.astro` (modificar),
  `tests/components/site-nav-script.test.ts` (crear)
- **Qué hacer**: un `<script>` nativo en `SiteNav`, sin dependencias:
  - Al cargar: muestra el botón (quita `hidden`) y marca el documento como navegación activa.
  - Menú: el botón alterna `aria-expanded`; Escape con el menú abierto lo cierra y devuelve el
    foco al botón; elegir un enlace lo cierra.
  - Sección activa: un `IntersectionObserver` sobre las secciones de `NAV_LINKS` recalcula con
    `pickActiveSection` y deja `aria-current="true"` solo en el enlace activo (ninguno sobre el
    hero).
- **Test** (`site-nav-script.test.ts`): el componente tiene un único `<script>` que importa
  `NAV_LINKS` y `pickActiveSection` de `src/lib/navigation` y ningún paquete; el script quita
  `hidden` al botón, gestiona `aria-expanded`, Escape y `aria-current`; el HTML del botón sigue
  empezando con `hidden`.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - JavaScript de la home ≤ 3 kB con gzip, sin scripts externos.
  - Comprobación manual en Chrome (sobre `bun run preview`): menú a 390px (abrir, cerrar con el
    botón, con Escape y al elegir un enlace), sección activa al hacer scroll (ninguna sobre el
    hero, una en cada sección), movimiento contra `Movimiento — Menú y enlace activo`; con
    reduced motion sin animación; sin JavaScript, lista visible y sin botón.

### [ ] T06 — Verificación final

- **Criterios**: todos
- **Diseño**: todas las pantallas de `designs/010-navigation/design.md`
- **Archivos**: —
- **Qué hacer**: verificación completa de la spec.
- **Test**: cada CA tiene cobertura:
  - CA-1.1 → `tests/components/site-nav.test.ts` + revisión de `dist/`
  - CA-1.2 → `tests/lib/navigation.test.ts` + `tests/components/site-nav.test.ts`
  - CA-1.3 → `tests/lib/navigation.test.ts` + `tests/components/site-nav.test.ts`
  - CA-1.4 → `tests/styles/base.test.ts` + `tests/components/site-nav-styles.test.ts` + comprobación manual
  - CA-1.5 → `tests/styles/base.test.ts`
  - CA-2.1, CA-2.2 → `tests/components/site-nav.test.ts` + `tests/components/site-nav-styles.test.ts`
  - CA-3.1 → `tests/components/site-nav-script.test.ts` + `tests/components/site-nav-styles.test.ts` + comprobación manual
  - CA-3.2, CA-3.3 → `tests/components/site-nav-styles.test.ts` + comprobación manual
  - CA-4.1 → `tests/lib/navigation.test.ts` + `tests/components/site-nav-script.test.ts` + comprobación manual
  - CA-4.2 → `tests/components/site-nav.test.ts`
  - CA-5.1 → medición de `dist/`
  - CA-5.2 → `tests/components/site-nav-styles.test.ts` + `tests/styles/tokens.test.ts`
  - CA-5.3 → Lighthouse
  - CA-5.4 → `tests/components/site-nav-styles.test.ts` + `tests/styles/base.test.ts` + comprobación manual
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - `dist/index.html`: un único `header` antes de `main` con el `nav` "Principal" y los seis
    enlaces; `main#contenido`; marca "LMGV" con el nombre completo; un único `h1`; JavaScript de
    la home ≤ 3 kB con gzip (hero + spotlight + revelado + navegación).
  - Teclado: orden de tabulación y foco visible; contraste AA según tokens.
  - Revisión visual a 390px y 1440px contra A · Índice; menú, sección activa y desplazamiento
    revisados; reduced motion y JavaScript desactivado revisados (recargando).
  - Rendimiento: pestaña Performance con scroll por toda la home (trackpad), sin tareas largas.
  - Lighthouse ≥ 90 en todas las categorías (DevTools sobre `bun run preview`).

## Registro de decisiones

| Fecha | Tipo | Decisión | Motivo |
|-------|------|----------|--------|
| 2026-09-18 | Creación | Plan inicial de 6 tareas | — |
| 2026-09-18 | Planificación | Tokens nuevos, patrón de navegación y scroll del documento en una primera tarea (T01) | El diseño 010 añade tokens al sistema; el resto de tareas los usa |
| 2026-09-18 | Planificación | Lista de enlaces, iniciales y cálculo de la sección activa en `src/lib/navigation.ts` (T02) | Lógica pura y testeable fuera del componente y del script (constitución §4 y §5), como `section-reveal.ts` |
| 2026-09-18 | Planificación | Estructura sin JavaScript (T03) antes de estilos (T04) y del script (T05) | El sitio debe funcionar sin JavaScript antes de cualquier interacción |
| 2026-09-18 | Planificación | Menú y sección activa en un único script (T05) | Comparten el componente y el presupuesto de JavaScript; menos sobrecarga que dos scripts |
| 2026-09-18 | Implementación (T02) | `pickActiveSection` activa la última sección cuando su final ya está en la ventana | "Idiomas" es más baja que dos tercios de la ventana y nunca cruzaría la línea de lectura; el plan pide la última sección al final de la página |
| 2026-09-18 | Implementación (T03) | Se ajustó el patrón `<main>` a `<main[^>]*>` en 8 tests de secciones (about, tech-stack, projects, experience, education, languages, section-reveal, card-spotlight), con aprobación del usuario | `main` pasa a tener `id="contenido"` (CA-2.1) y esos tests buscaban la etiqueta literal |
| 2026-09-18 | Implementación (T04) | Por debajo de 1024px y sin JavaScript la cabecera no es fija (excepción anotada en CA-1.4 de la spec); con la marca `html[data-nav-ready]` es fija y el panel se pliega | La lista visible bajo una barra fija taparía unos 340px en móvil sin JavaScript; decisión del usuario |
| 2026-09-18 | Implementación (T04) | Panel del menú con fondo opaco `--color-bg` (diseño 010 y sistema actualizados) | En la revisión visual el hero se transparentaba bajo las filas con `--color-nav-bg`; decisión del usuario |
| 2026-09-18 | Planificación | T05 debe poner `data-nav-ready` antes del primer pintado | Si la marca llega tarde, en móvil la barra pasa de estar en el flujo a fija tras cargar y provoca un salto de maquetación |
