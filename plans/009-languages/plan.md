---
id: 009
title: Idiomas
spec: specs/009-languages/spec.md
design: designs/009-languages/design.md
status: approved
created: 2026-09-18
updated: 2026-09-18
---

# Plan — Idiomas

Leyenda: `[ ]` pendiente · `[x]` hecha · `[-]` obsoleta · una tarea `[ ]` con línea
**Bloqueo** está detenida por `/implement` hasta resolver una brecha.

## Resumen

| Capa | Tareas |
|------|--------|
| Datos | T01 |
| Estructura, estilos y movimiento (sección) | T02 |
| Pulido | — (incluido en T02) |
| Verificación final | T03 |

## Cobertura de criterios

| Criterio | Tareas |
|----------|--------|
| CA-1.1 | T02, T03 |
| CA-1.2 | T02 |
| CA-1.3 | T01 |
| CA-1.4 | T02 |
| CA-2.1 | T02, T03 |
| CA-2.2 | T02, T03 |
| CA-2.3 | T02, T03 |
| CA-3.1 | T02 |
| CA-3.2 | T02 |
| CA-3.3 | T03 |
| CA-3.4 | T02, T03 |

## Tareas

### [x] T01 — Etiqueta y nivel de los idiomas

- **Criterios**: CA-1.3
- **Diseño**: —
- **Archivos**: `docs/cv.md` (modificar), `src/content/schemas.ts` (modificar),
  `src/content/profile/profile.md` (modificar), `tests/content/schemas.test.ts` (modificar),
  `tests/content/entries.test.ts` (modificar)
- **Qué hacer**:
  - `docs/cv.md`, sección "Idiomas": la línea de español pasa a
    `- **Español:** Dominio completo (lengua materna)`; la de inglés no cambia.
  - Esquema de `profile`: cada idioma tiene `language` y `level` obligatorios y un campo opcional
    `tag` de texto no vacío.
  - `profile.md`: Español → `level` `Dominio completo`, `tag` `Lengua materna`; Inglés → `level`
    `Competencia profesional`, `tag` `B2`.
- **Test**:
  - Esquema: acepta un idioma sin `tag`; rechaza un `tag` vacío; sigue rechazando un idioma sin
    `level`.
  - Entradas: los idiomas son exactamente Español (`Dominio completo`, `Lengua materna`) e Inglés
    (`Competencia profesional`, `B2`), en ese orden; el test existente de coherencia con el CV
    pasa a comprobar que cada línea de "Idiomas" es idioma, nivel y, si hay `tag`, la etiqueta
    entre paréntesis comparada sin distinguir mayúsculas, con el mismo número de líneas que de
    idiomas.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.

### [ ] T02 — Sección "Idiomas" en la home

- **Criterios**: CA-1.1, CA-1.2, CA-1.4, CA-2.1, CA-2.2, CA-2.3, CA-3.1, CA-3.2, CA-3.4
- **Diseño**: `C · Escala (ajustada) — Escritorio` y `— Móvil` · `M-1` · `M-2`
- **Archivos**: `src/components/LanguagesSection.astro` (crear),
  `tests/components/languages-section.test.ts` (crear),
  `tests/components/languages-section-styles.test.ts` (crear), `src/pages/index.astro` (modificar)
- **Qué hacer**:
  - **`LanguagesSection`**. Props: los idiomas de `profile.languages`.
    - `section` con id `idiomas` y `aria-labelledby` al `h2` de `SectionHeader` (ancla `idiomas`,
      título "Idiomas").
    - Una card por idioma, en el orden recibido, marcada como bloque revelable (`data-reveal`) y
      como card con spotlight (`data-spotlight`): `h3` con el idioma; párrafo con el nivel; y, solo
      si hay `tag`, la etiqueta del sistema con su texto.
    - Sin elementos enfocables, sin `<progress>`, `<meter>` ni `role="progressbar"`.
  - **Estilos** con tokens, mobile-first, fieles a la composición C ajustada:
    - Contenedor `--section-max-width`, separaciones `--section-header-gap`, padding de sección
      `--space-section` / `--space-gutter`.
    - Rejilla: una columna con separación `--space-3`; desde 768px, 2 columnas iguales con
      separación `--space-4` y la misma altura.
    - Card del sistema (`--color-surface`, borde, `--radius-lg`, `--card-padding`, `--card-gap`);
      idioma `--text-h3-*` en `--color-text`; nivel `--text-body-*` en `--color-text-secondary`,
      a `--space-2` del idioma; etiqueta del sistema (`--font-mono`, `--color-tag-bg`,
      `--color-tag-text`) alineada a la izquierda con su ancho natural.
    - Dentro de la media query de puntero fino: con el estado activo del spotlight, el nivel a
      `--color-text`, con transición `--duration-base` / `--ease-out` solo sin reduced motion; con
      reduced motion, el mismo cambio en hover y sin transición.
  - **`index.astro`**: renderizar `LanguagesSection` con `profile.languages` justo después de
    `EducationSection` dentro de `main`.
- **Test**:
  - `languages-section.test.ts`: `section#idiomas` con `aria-labelledby` al `h2` "Idiomas"; una
    card por idioma en el orden recibido, con el idioma en `h3`, el nivel y la etiqueta como
    elementos de texto separados; un idioma sin `tag` no renderiza etiqueta; cada card lleva
    `data-reveal` y `data-spotlight`; sin enlaces, botones, controles ni `tabindex`; sin
    `<progress>`, `<meter>`, `role="progressbar"` ni `%`; `index.astro` renderiza la sección
    después de `EducationSection` dentro de `main` con `profile.languages`.
  - `languages-section-styles.test.ts`: sin literales; usa los tokens citados; una columna por
    debajo de 768px y 2 columnas iguales desde 768px; reglas del estado activo y del hover dentro
    de la media query de puntero fino, con transiciones solo sin reduced motion; ninguna regla
    oculta o desplaza contenido.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - JavaScript de la home sin scripts nuevos y ≤ 3 kB con gzip.
  - Comprobación manual en Chrome (sobre `bun run preview`):
    - Sección a 390px y 1440px contra `C · Escala (ajustada) — Móvil` y `— Escritorio`.
    - Spotlight en las dos cards (el nivel se aclara) y sin cambios en las secciones anteriores.
    - Revelado del encabezado y de las cards al entrar y otra vez al volver a entrar; scroll
      fluido con trackpad.
    - Con reduced motion y con JavaScript desactivado (recargando), todo visible y sin animación.

### [ ] T03 — Verificación final

- **Criterios**: todos
- **Diseño**: todas las pantallas de `designs/009-languages/design.md`
- **Archivos**: —
- **Qué hacer**: verificación completa de la spec.
- **Test**: cada CA tiene cobertura:
  - CA-1.1 → `tests/components/languages-section.test.ts` + revisión de `dist/`
  - CA-1.2 → `tests/components/languages-section.test.ts`
  - CA-1.3 → `tests/content/schemas.test.ts` + `tests/content/entries.test.ts`
  - CA-1.4 → `tests/components/languages-section.test.ts`
  - CA-2.1 → `tests/components/card-spotlight.test.ts` + `tests/components/languages-section.test.ts` + comprobación manual
  - CA-2.2 → `tests/components/languages-section-styles.test.ts` + `tests/components/card-spotlight.test.ts` + comprobación manual
  - CA-2.3 → medición de `dist/`
  - CA-3.1 → `tests/components/languages-section-styles.test.ts` + `tests/styles/tokens.test.ts`
  - CA-3.2 → `tests/components/languages-section.test.ts`
  - CA-3.3 → Lighthouse
  - CA-3.4 → `tests/components/languages-section.test.ts` + `tests/components/section-reveal.test.ts` + comprobación manual
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - `dist/index.html`:
    - `section#idiomas` única tras `#formacion` dentro de `main`, con los dos idiomas (idioma,
      nivel y etiqueta) sin JavaScript.
    - Un único `h1`.
    - JavaScript de la home ≤ 3 kB con gzip (hero + revelado común + spotlight común).
  - Spotlight y revelado revisados en la sección; reduced motion y JavaScript desactivado
    revisados (recargando).
  - Rendimiento: pestaña Performance con scroll y puntero por las últimas secciones (trackpad),
    sin tareas largas.
  - Contraste AA según tokens y orden de tabulación sin cambios.
  - Revisión visual a 390px y 1440px contra la composición C ajustada.
  - Lighthouse ≥ 90 en todas las categorías (DevTools sobre `bun run preview`).

## Registro de decisiones

| Fecha | Tipo | Decisión | Motivo |
|-------|------|----------|--------|
| 2026-09-18 | Creación | Plan inicial de 3 tareas | — |
| 2026-09-18 | Planificación | Campo opcional `tag` en el esquema de `profile`, nuevo nivel de español en el CV y en los datos, y ajuste del test de coherencia con el CV (T01) | La spec fija esos datos (CA-1.3) |
| 2026-09-18 | Planificación | Sin funciones nuevas en `src/lib/` | La sección muestra los idiomas en el orden de los datos y sin formateo |
| 2026-09-18 | Planificación | Estructura, estilos y marcas de revelado y spotlight en una sola tarea (T02) | Son dos cards con la misma revisión visual; el movimiento reutiliza `CardSpotlight` y `SectionReveal` |
| 2026-09-18 | Planificación | Sin tarea propia de animación ni cambios en el sistema | El diseño 009 no añade tokens ni patrones |
