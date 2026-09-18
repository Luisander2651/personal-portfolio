---
id: 011
title: Footer
spec: specs/011-footer/spec.md
design: designs/011-footer/design.md
status: approved
created: 2026-09-18
updated: 2026-09-18
---

# Plan — Footer

Leyenda: `[ ]` pendiente · `[x]` hecha · `[-]` obsoleta · una tarea `[ ]` con línea
**Bloqueo** está detenida por `/implement` hasta resolver una brecha.

## Resumen

| Capa | Tareas |
|------|--------|
| Datos | T01 |
| Refactor compartido | T02 |
| Estructura, estilos y movimiento | T03 |
| Verificación final | T04 |

## Cobertura de criterios

| Criterio | Tareas |
|----------|--------|
| CA-1.1 | T03, T04 |
| CA-1.2 | T01, T02, T03 |
| CA-1.3 | T01, T03 |
| CA-1.4 | T03 |
| CA-2.1 | T03 |
| CA-2.2 | T03 |
| CA-3.1 | T03, T04 |
| CA-3.2 | T03, T04 |
| CA-3.3 | T03 |
| CA-3.4 | T04 |

## Tareas

### [x] T01 — Datos de contacto del footer

- **Criterios**: CA-1.2, CA-1.3
- **Diseño**: `A · Firma — Escritorio 1440` (lista de contacto y copyright)
- **Archivos**: `src/lib/contact.ts` (crear), `tests/lib/contact.test.ts` (crear)
- **Qué hacer**: funciones puras en `src/lib/contact.ts`:
  - `displayUrl`: devuelve una URL sin protocolo (`https://`, `http://`), sin `www.` y sin la
    barra final.
  - `contactLinks`: a partir del correo, GitHub y LinkedIn del perfil, devuelve los tres enlaces
    en el orden Correo, GitHub, LinkedIn, cada uno con servicio, dato visible, `href` e icono
    (`mail`, `github`, `linkedin`); el correo usa `mailto:` y muestra la dirección tal cual, y
    GitHub y LinkedIn muestran `displayUrl`.
  - `copyrightLine`: devuelve `© {año} {nombre}`.
- **Test**: `displayUrl` con y sin `www.`, con `http` y `https`, con y sin barra final;
  `contactLinks` en orden con sus `href`, datos e iconos; con los datos reales de `profile`, los
  textos son `luisander.dev@gmail.com`, `github.com/Luisander2651` y
  `linkedin.com/in/luis-mario-gutierrez-valdovinos-6998a6357`; `copyrightLine` con nombre y
  año.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.

### [ ] T02 — Iconos de contacto compartidos

- **Criterios**: CA-1.2
- **Diseño**: `designs/011-footer/design.md` → Componentes (iconos de línea del hero)
- **Archivos**: `src/components/ContactIcon.astro` (crear),
  `tests/components/contact-icon.test.ts` (crear), `src/components/HomeHero.astro` (modificar)
- **Qué hacer**:
  - **`ContactIcon`**. Props: el nombre del icono (`mail`, `github` o `linkedin`). SVG de línea
    decorativo (`aria-hidden`, sin foco) con los mismos trazos que hoy usa el hero, en
    `currentColor`, y una clase para que cada componente lo dimensione con sus tokens.
  - **`HomeHero`**: sustituye sus SVG en línea por `ContactIcon`, sin cambiar su HTML visible
    ni sus estilos.
- **Test** (`contact-icon.test.ts`): cada nombre produce un único `svg` con `aria-hidden="true"`
  y sus trazos, sin `focusable` ni texto; los tests existentes del hero siguen en verde.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - Los iconos del hero se ven igual (revisión rápida en `bun run preview`).

### [ ] T03 — Footer en la home

- **Criterios**: CA-1.1, CA-1.2, CA-1.3, CA-1.4, CA-2.1, CA-2.2, CA-3.1, CA-3.2, CA-3.3
- **Diseño**: `A · Firma — Escritorio 1440` y `— Móvil 390` · `M-1` · `M-2`
- **Archivos**: `src/components/SiteFooter.astro` (crear),
  `tests/components/site-footer.test.ts` (crear),
  `tests/components/site-footer-styles.test.ts` (crear), `src/pages/index.astro` (modificar)
- **Qué hacer**:
  - **`SiteFooter`**. Props: nombre, rol, correo, GitHub, LinkedIn y año.
    - `footer` marcado como bloque revelable (`data-reveal`), sin `id`: firma (nombre y rol como
      párrafos), `nav aria-label="Contacto"` con la lista de `contactLinks` y la línea de
      `copyrightLine`.
    - Cada enlace: `ContactIcon`, servicio y dato; nombre accesible "{servicio}: {dato}"; sin
      `target`.
    - Sin botones, formularios ni campos.
  - **Estilos** con tokens, mobile-first, fieles a A · Firma: borde superior, padding
    `--space-section` / `--space-5` / `--space-gutter`, contenido `--section-max-width`;
    apilado por debajo de 768px y dos columnas desde 768px; nombre con los tokens de `h2`, rol
    `--color-text-muted`; enlace con alto `--control-height`, icono `--icon-size-sm` en
    `--color-text-muted`, servicio con `--text-mono-label-*`, dato `--font-mono`,
    `--text-small-size`, `--color-link` y `overflow-wrap: anywhere`; hover con
    `--color-link-hover`, subrayado `--color-glow` e icono `--color-glow`; foco con
    `--focus-ring` y `--focus-ring-offset`; copyright mono `--color-text-muted` sobre borde;
    transición de color `--duration-fast` / `--ease-out` solo sin reduced motion.
  - **`index.astro`**: renderizar `SiteFooter` justo después de `main` con los datos de
    `profile` y el año de la fecha de la build.
- **Test**:
  - `site-footer.test.ts`: un `footer` sin `id`, con `data-reveal`; firma con nombre y rol sin
    encabezados; `nav` "Contacto" con tres enlaces en orden, sus `href`, datos visibles y nombres
    accesibles; iconos decorativos; sin `target`, botones, formularios ni campos; copyright con el
    año recibido; `index.astro` renderiza `SiteFooter` justo después de `main` con los datos de
    `profile` y el año de la build.
  - `site-footer-styles.test.ts`: sin literales; usa los tokens citados; dos columnas desde
    768px; `overflow-wrap: anywhere` en el dato; foco con los tokens del sistema; transiciones
    solo sin reduced motion; ninguna regla oculta o desplaza contenido.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - JavaScript de la home sin scripts nuevos y ≤ 3 kB con gzip.
  - Comprobación manual en Chrome (sobre `bun run preview`): footer a 390px y 1440px contra
    `A · Firma — Móvil 390` y `— Escritorio 1440` (la URL de LinkedIn sin desbordar); hover y
    foco de los enlaces; revelado al entrar y al volver a entrar; con reduced motion y sin
    JavaScript, todo visible.

### [ ] T04 — Verificación final

- **Criterios**: todos
- **Diseño**: todas las pantallas de `designs/011-footer/design.md`
- **Archivos**: —
- **Qué hacer**: verificación completa de la spec.
- **Test**: cada CA tiene cobertura:
  - CA-1.1 → `tests/components/site-footer.test.ts` + revisión de `dist/`
  - CA-1.2 → `tests/lib/contact.test.ts` + `tests/components/contact-icon.test.ts` + `tests/components/site-footer.test.ts`
  - CA-1.3 → `tests/lib/contact.test.ts` + `tests/components/site-footer.test.ts`
  - CA-1.4, CA-2.2 → `tests/components/site-footer.test.ts`
  - CA-2.1 → `tests/components/site-footer.test.ts` + `tests/components/site-footer-styles.test.ts`
  - CA-3.1 → `tests/components/site-footer-styles.test.ts` + medición de `dist/`
  - CA-3.2 → `tests/components/site-footer.test.ts` + `tests/components/section-reveal.test.ts` + comprobación manual
  - CA-3.3 → `tests/components/site-footer-styles.test.ts` + `tests/styles/tokens.test.ts`
  - CA-3.4 → Lighthouse
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - `dist/index.html`: un único `footer` después de `main`, con los tres enlaces de contacto
    (textos y `href`), firma y copyright del año de la build; un único `h1`; JavaScript de la
    home ≤ 3 kB con gzip.
  - Teclado: los tres enlaces tras el contenido, en orden, con foco visible; contraste AA según
    tokens.
  - Revisión visual a 390px y 1440px contra A · Firma; revelado, reduced motion y JavaScript
    desactivado revisados (recargando).
  - Lighthouse ≥ 90 en todas las categorías (DevTools sobre `bun run preview`).

## Registro de decisiones

| Fecha | Tipo | Decisión | Motivo |
|-------|------|----------|--------|
| 2026-09-18 | Creación | Plan inicial de 4 tareas | — |
| 2026-09-18 | Planificación | Texto de las URL, lista de enlaces y copyright en `src/lib/contact.ts` (T01) | Lógica pura y testeable fuera del componente (constitución §4 y §5) |
| 2026-09-18 | Planificación | Iconos de correo, GitHub y LinkedIn extraídos del hero a `ContactIcon` (T02) | El footer los reutiliza; evita duplicar los trazos SVG en dos componentes |
| 2026-09-18 | Planificación | Estructura, estilos y marca de revelado del footer en una sola tarea (T03) | Es un único bloque con la misma revisión visual; el revelado reutiliza el script común |
| 2026-09-18 | Planificación | El año llega como prop desde `index.astro` (fecha de la build) | Permite testear el componente con cualquier año |
