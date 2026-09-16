---
id: 008
title: Formación
status: active
created: 2026-09-16
updated: 2026-09-16
depends_on: [001, 002, 003, 004, 005, 006, 007]
---

# Formación

## Objetivo

Añadir a la home, justo después de "Experiencia profesional", la sección "Formación" con las dos
titulaciones de `docs/cv.md`: titulación, especialidad, institución, años y estado. El objetivo es
que un reclutador sitúe la formación del autor y vea que la ingeniería sigue en curso. La sección
expone el ancla `#formacion` que enlazará la navegación (spec 010).

## Historias de usuario

- **HU-1**: Como reclutador, quiero ver qué estudia o ha estudiado el autor, dónde y en qué años,
  para situar su formación.
- **HU-2**: Como visitante con ratón o trackpad, quiero que la formación reaccione con una luz al
  pasar el puntero, como el resto de secciones, sin que eso afecte al contenido ni a quien no
  puede o no quiere verlo.
- **HU-3**: Como visitante, quiero que la sección sea ligera y accesible, sin depender de
  JavaScript ni de animaciones para leerla.

## Criterios de aceptación

### HU-1

- **CA-1.1**
  - **Dado** el sitio generado con `bun run build`
  - **Cuando** inspecciono `dist/index.html` sin ejecutar JavaScript
  - **Entonces** existe un único `<section id="formacion">` etiquetado por su `h2`
    (`aria-labelledby`), cuyo texto es "Formación"; la sección es el siguiente bloque de contenido
    después de `#experiencia` dentro de `main` y la página sigue teniendo un único `h1`
- **CA-1.2**
  - **Dado** la colección `education` y la sección "Formación"
  - **Cuando** inspecciono su HTML
  - **Entonces** muestra las formaciones en el orden del campo `order`, y cada una con su
    titulación, su especialidad, su institución (la abreviatura `UTCGG` junto al nombre completo),
    su rango de años (por ejemplo `2025 – 2026`) y su estado con texto visible ("En curso" o
    "Finalizado", el mismo indicador que usa "Proyectos"); ningún texto de la formación está
    incrustado en componentes
- **CA-1.3**
  - **Dado** `docs/cv.md` y la colección `education`
  - **Cuando** se ejecutan los tests
  - **Entonces** el esquema de `education` tiene los campos obligatorios `order` (entero
    positivo), `startYear` y `endYear` (enteros) e `institutionShort`, y ya no tiene
    `expectedYear`; las entradas son:
    - `Ingeniería en Tecnologías de la Información`: `order` 1, `startYear` 2025, `endYear` 2026,
      estado `in-progress`, `institutionShort` `UTCGG`
    - `TSU en Tecnologías de la Información`: `order` 2, `startYear` 2023, `endYear` 2025, estado
      `completed`, `institutionShort` `UTCGG`

    y en `docs/cv.md` cada formación nombra la institución como
    `Universidad Tecnológica de la Costa Grande de Guerrero (UTCGG)` e indica su rango y su estado
    (`*2025 – 2026 · En curso*` y `*2023 – 2025 · Finalizado*`), coincidiendo con la colección en
    titulación, especialidad, institución, abreviatura, años y estado
- **CA-1.4**
  - **Dado** la sección "Formación"
  - **Cuando** la colección `education` tiene más entradas
  - **Entonces** la sección las muestra todas, en el orden de `order` y sin cambios en el
    componente (verificación: test que renderiza la sección con varias entradas)

### HU-2

- **CA-2.1**
  - **Dado** un visitante con puntero fino (`hover: hover`), JavaScript activo y sin
    `prefers-reduced-motion: reduce`
  - **Cuando** mueve el puntero sobre el bloque de una formación
  - **Entonces** una luz sigue al puntero sobre ese bloque y desaparece al salir, con el mismo
    efecto que en "Tecnologías", "Proyectos" y "Experiencia profesional" (verificación: estructura
    por test y revisión manual contra el diseño)
- **CA-2.2**
  - **Dado** un visitante en un dispositivo táctil, con `prefers-reduced-motion: reduce` o sin
    JavaScript
  - **Cuando** carga la home y llega a la sección
  - **Entonces** no hay luz que siga al puntero, todo el contenido de la sección está en el HTML
    y es visible, y ningún estilo lo oculta salvo cuando el script de revelado se ha ejecutado y
    no hay reduced motion
- **CA-2.3**
  - **Dado** el sitio generado
  - **Cuando** mido el JavaScript de cliente de la home en `dist/`
  - **Entonces** su tamaño total comprimido con gzip es ≤ 3 kB, no depende de ningún paquete y
    solo implementa la animación del hero, el spotlight común y el script común de revelado de
    las secciones

### HU-3

- **CA-3.1**
  - **Dado** los estilos de la sección
  - **Cuando** se ejecutan los tests
  - **Entonces** solo usan tokens del sistema de diseño (ningún color, tamaño, espaciado o
    duración literal)
- **CA-3.2**
  - **Dado** la sección "Formación"
  - **Cuando** inspecciono su HTML
  - **Entonces** no contiene elementos enfocables (enlaces, botones, controles ni `tabindex`),
    de modo que el orden de tabulación de la home no cambia
- **CA-3.3**
  - **Dado** la home servida con `bun run preview`
  - **Cuando** se ejecuta Lighthouse (móvil)
  - **Entonces** obtiene ≥ 90 en Performance, Accessibility, Best Practices y SEO
- **CA-3.4**
  - **Dado** un visitante con JavaScript activo y sin `prefers-reduced-motion: reduce`
  - **Cuando** el encabezado de la sección y cada bloque de formación entran en pantalla al hacer
    scroll
  - **Entonces** se revelan con una animación, y vuelven a revelarse cada vez que entran de nuevo
    tras haber salido de pantalla (verificación: estructura por test y revisión manual, con
    scroll fluido con trackpad)

## Contenido

Fuente: colección `education` (derivada de `docs/cv.md`, sección "Formación").

| Titulación | `order` | Especialidad | Institución | Abreviatura | Años | Estado |
|------------|---------|--------------|-------------|-------------|------|--------|
| Ingeniería en Tecnologías de la Información | 1 | Desarrollo de Software Multiplataforma | Universidad Tecnológica de la Costa Grande de Guerrero | UTCGG | 2025 – 2026 | En curso |
| TSU en Tecnologías de la Información | 2 | Desarrollo de Software | Universidad Tecnológica de la Costa Grande de Guerrero | UTCGG | 2023 – 2025 | Finalizado |

Cambios en `docs/cv.md` (aprobados por el usuario):

- Cada formación indica su rango de años junto al estado — `*2025 – 2026 · En curso*` y
  `*2023 – 2025 · Finalizado*` — en lugar de `*En curso, egreso esperado en 2026*` y
  `*Finalizado*`.
- La institución pasa a nombrarse
  `Universidad Tecnológica de la Costa Grande de Guerrero (UTCGG)`.

Encabezado de la sección: "Formación" (`docs/workflow.md`, roadmap).

## Diseño

Diseño aprobado: [designs/008-education/design.md](../../designs/008-education/design.md)
· [canvas](https://claude.ai/artifact/EMeyH5csqSD8zJ6pSiRKvN) (composición A · Par).

Qué debe sentirse: una sección corta y ordenada, con un ritmo propio frente a "Experiencia
profesional", donde se distinga de un vistazo la titulación en curso de la finalizada. Luz que
sigue al puntero como en las otras secciones y revelado sutil al entrar en pantalla, cada vez que
entra. La composición, la técnica y los tiempos se definen en `/design-spec`.

## Fuera de alcance

- Notas, promedios, créditos o materias.
- Certificaciones, cursos y formación no reglada: no están en `docs/cv.md`.
- Logo, enlace o descripción de la universidad, y ubicación del campus.
- Título o documento descargable.
- Idiomas (spec 009) y navegación (spec 010).

## Registro de decisiones

| Fecha | Tipo | Pregunta / Conflicto | Decisión | Fuente |
|-------|------|----------------------|----------|--------|
| 2026-09-16 | Implícita | Número, slug, ancla y posición | `008-education`, ancla `#formacion`, sección siguiente a "Experiencia profesional" | docs/workflow.md |
| 2026-09-16 | Implícita | Encabezado de la sección | `h2` "Formación" con el encabezado de sección común | docs/workflow.md, designs/000-design-system |
| 2026-09-16 | Brecha | Orden de las formaciones (la colección no tenía campo de orden y dependía del nombre de archivo) | Campo `order` obligatorio en el esquema, como en `skills` y `projects`: 1 Ingeniería, 2 TSU | usuario |
| 2026-09-16 | Brecha | Fechas de cada formación (el CV solo tenía "egreso esperado en 2026") | Se añaden los rangos al CV y a la colección: TSU 2023 – 2025 e Ingeniería 2025 – 2026, con campos `startYear` y `endYear`; desaparece `expectedYear` | usuario |
| 2026-09-16 | Brecha | Cómo se muestra el periodo | Rango de años, discreto, junto al estado | usuario |
| 2026-09-16 | Brecha | Indicador de estado | El badge del sistema que ya usa "Proyectos": "En curso" y "Finalizado", con texto visible | usuario, designs/000-design-system |
| 2026-09-16 | Brecha | Interacción con el puntero | El mismo spotlight común que en las secciones anteriores | usuario |
| 2026-09-16 | Implícita | JavaScript | Presupuesto compartido de la home ≤ 3 kB con gzip, sin dependencias: hero, spotlight común y revelado común | specs/007-experience, constitution.md §3 |
| 2026-09-16 | Implícita | Revelado | Encabezado y bloques con el revelado común al entrar en pantalla, cada vez, uniforme con 004–007 | specs/004-about, specs/007-experience |
| 2026-09-16 | Diseño | Composición de la sección | A · Par: dos cards del sistema (una columna en móvil, dos desde 768px) con rango de años y badge de estado en la fila superior, titulación, especialidad y, al pie, la institución con la etiqueta mono `UTCGG` delante del nombre completo; spotlight y revelado comunes; sin tokens ni patrones nuevos. Pendiente: añadir la abreviatura a `docs/cv.md` y el campo `institutionShort` a la colección refinando esta spec | /design-spec |
| 2026-09-16 | Brecha | Abreviatura de la universidad pedida en el diseño (no estaba en `docs/cv.md`) | Se añade `(UTCGG)` al nombre de la institución en `docs/cv.md` y un campo obligatorio `institutionShort` en el esquema y en las dos entradas; la sección muestra la sigla junto al nombre completo | usuario, designs/008-education |
