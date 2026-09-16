---
id: 007
title: Experiencia profesional
status: active
created: 2026-09-15
updated: 2026-09-15
depends_on: [001, 002, 003, 004, 005, 006]
---

# Experiencia profesional

## Objetivo

Añadir a la home, justo después de "Proyectos", la sección "Experiencia profesional" con la
experiencia laboral de `docs/cv.md`: empresa, puesto, periodo y logros. El objetivo es que un
reclutador vea dónde ha trabajado el autor y qué hizo allí, sin un timeline genérico. La sección
expone el ancla `#experiencia` que enlazará la navegación (spec 010).

## Historias de usuario

- **HU-1**: Como reclutador, quiero ver dónde ha trabajado el autor, cuánto tiempo y qué hizo,
  para valorar su experiencia laboral.
- **HU-2**: Como visitante con ratón o trackpad, quiero que la experiencia reaccione con una luz
  al pasar el puntero, como "Tecnologías" y "Proyectos", sin que eso afecte al contenido ni a
  quien no puede o no quiere verlo.
- **HU-3**: Como visitante, quiero que la sección sea ligera y accesible, sin depender de
  JavaScript ni de animaciones para leerla.

## Criterios de aceptación

### HU-1

- **CA-1.1**
  - **Dado** el sitio generado con `bun run build`
  - **Cuando** inspecciono `dist/index.html` sin ejecutar JavaScript
  - **Entonces** existe un único `<section id="experiencia">` etiquetado por su `h2`
    (`aria-labelledby`), cuyo texto es "Experiencia profesional"; la sección es el siguiente
    bloque de contenido después de `#proyectos` dentro de `main` y la página sigue teniendo un
    único `h1`
- **CA-1.2**
  - **Dado** la colección `experience` y la sección "Experiencia profesional"
  - **Cuando** inspecciono su HTML
  - **Entonces** por cada entrada muestra la empresa, el puesto, el periodo y la duración, y una
    lista `ul` con sus logros (los puntos del cuerpo de la entrada, en su orden); ningún texto de
    la experiencia está incrustado en componentes
- **CA-1.3**
  - **Dado** `docs/cv.md` y la colección `experience`
  - **Cuando** se ejecutan los tests
  - **Entonces** el esquema de `experience` tiene un campo obligatorio `period`; en `docs/cv.md`
    la experiencia incluye la línea `**Periodo:** mayo – agosto de 2025` justo antes de
    `**Duración:** 4 meses`, y sus logros son estos tres, en este orden:
    1. `Contribuí a la construcción de una sección de la página principal corporativa para
       presentar un producto que aún no estaba en el catálogo, y desarrollé una sección específica
       dedicada a ese producto.`
    2. `Mantuve y optimicé plataformas web corporativas, desplegando funcionalidades a medida que
       mejoraron la estructura del sitio y la navegación de los usuarios.`
    3. `Redacté documentación técnica y guías de uso de APIs para equipos internos, agilizando la
       incorporación de personal y el mantenimiento de las plataformas.`

    y la entrada de la colección coincide con `docs/cv.md` en empresa, puesto, periodo, duración y
    logros
- **CA-1.4**
  - **Dado** la sección "Experiencia profesional"
  - **Cuando** la colección `experience` tiene más de una entrada
  - **Entonces** la sección las muestra todas, sin cambios en el componente (verificación: test
    que renderiza la sección con varias entradas)

### HU-2

- **CA-2.1**
  - **Dado** un visitante con puntero fino (`hover: hover`), JavaScript activo y sin
    `prefers-reduced-motion: reduce`
  - **Cuando** mueve el puntero sobre el bloque de una experiencia
  - **Entonces** una luz sigue al puntero sobre ese bloque y desaparece al salir, con el mismo
    efecto que las cards de "Tecnologías" y "Proyectos" (verificación: estructura por test y
    revisión manual contra el diseño)
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
  - **Dado** la sección "Experiencia profesional"
  - **Cuando** inspecciono su HTML
  - **Entonces** no contiene elementos enfocables (enlaces, botones, controles ni `tabindex`),
    de modo que el orden de tabulación de la home no cambia
- **CA-3.3**
  - **Dado** la home servida con `bun run preview`
  - **Cuando** se ejecuta Lighthouse (móvil)
  - **Entonces** obtiene ≥ 90 en Performance, Accessibility, Best Practices y SEO
- **CA-3.4**
  - **Dado** un visitante con JavaScript activo y sin `prefers-reduced-motion: reduce`
  - **Cuando** el encabezado de la sección y el bloque de la experiencia entran en pantalla al
    hacer scroll
  - **Entonces** se revelan con una animación, y vuelven a revelarse cada vez que entran de nuevo
    tras haber salido de pantalla (verificación: estructura por test y revisión manual, con
    scroll fluido con trackpad)

## Contenido

Fuente: colección `experience` (derivada de `docs/cv.md`, sección "Experiencia").

| Dato | Campo | Valor |
|------|-------|-------|
| Empresa | `company` | Syspyra Solutions |
| Puesto | `position` | Webmaster (practicante) |
| Periodo | `period` (campo nuevo) | mayo – agosto de 2025 |
| Duración | `duration` | 4 meses |
| Logros | cuerpo de la entrada | Los tres puntos de CA-1.3, en ese orden |

Cambios en `docs/cv.md` (aprobados por el usuario):

- Línea `**Periodo:** mayo – agosto de 2025` antes de `**Duración:** 4 meses`.
- Logro nuevo, en primer lugar: `Contribuí a la construcción de una sección de la página principal
  corporativa para presentar un producto que aún no estaba en el catálogo, y desarrollé una
  sección específica dedicada a ese producto.`

Encabezado de la sección: "Experiencia profesional" (`docs/workflow.md`, roadmap).

## Diseño

Diseño aprobado: [designs/007-experience/design.md](../../designs/007-experience/design.md)
· [canvas](https://claude.ai/artifact/2zAjPc24ztTFx2miTmyMjh) (composición A · Registro).

Qué debe sentirse: una sección breve y sobria, con otro ritmo visual que "Proyectos" y sin
timeline vertical genérico (`anti-cliches.md`), donde el puesto y el impacto pesen más que las
fechas. Luz que sigue al puntero como en las otras secciones y revelado sutil al entrar en
pantalla, cada vez que entra. La composición, la técnica y los tiempos se definen en
`/design-spec`.

## Fuera de alcance

- Stack o tecnologías de la experiencia: no están en `docs/cv.md`.
- Logo, enlace o descripción de la empresa.
- Ubicación del puesto y tipo de contrato más allá de lo que dice el puesto.
- Referencias, cartas de recomendación o contactos.
- Experiencias adicionales: solo la que está en `docs/cv.md`.
- Timeline vertical genérico con puntos (`anti-cliches.md`).
- Formación (spec 008), idiomas (spec 009) y navegación (spec 010).

## Registro de decisiones

| Fecha | Tipo | Pregunta / Conflicto | Decisión | Fuente |
|-------|------|----------------------|----------|--------|
| 2026-09-15 | Implícita | Número, slug, ancla y posición | `007-experience`, ancla `#experiencia`, sección siguiente a "Proyectos" | docs/workflow.md |
| 2026-09-15 | Implícita | Encabezado de la sección | `h2` "Experiencia profesional" con el encabezado de sección común | docs/workflow.md, designs/000-design-system |
| 2026-09-15 | Contradicción | El roadmap pide la experiencia "con stack e impacto", pero `docs/cv.md` no indica tecnologías en esa sección y la constitución §8 prohíbe inventarlas | Sin stack: solo empresa, puesto, periodo, duración y logros | usuario, cv.md, constitution.md |
| 2026-09-15 | Brecha | Fechas del puesto | Se añade `**Periodo:** mayo – agosto de 2025` a `docs/cv.md` y se muestra junto a la duración | usuario |
| 2026-09-15 | Brecha | Logro adicional aportado por el usuario | Se añade a `docs/cv.md` como primer logro, con la redacción de CA-1.3 | usuario |
| 2026-09-15 | Brecha | Número de experiencias | Solo la que está en el CV; la sección recorre la colección y admite más (CA-1.4) | usuario |
| 2026-09-15 | Brecha | Interacción con el puntero | El mismo spotlight común que en "Tecnologías" y "Proyectos" | usuario, designs/000-design-system |
| 2026-09-15 | Implícita | JavaScript | Presupuesto compartido de la home ≤ 3 kB con gzip, sin dependencias: hero, spotlight común y revelado común | specs/006-projects, constitution.md §3 |
| 2026-09-15 | Implícita | Revelado | Encabezado y bloque con el revelado común al entrar en pantalla, cada vez, uniforme con 004, 005 y 006 | specs/004-about, specs/005-tech-stack, specs/006-projects |
| 2026-09-15 | Diseño | Composición de la sección | A · Registro: cada experiencia es una fila entre líneas finas, con periodo y duración en mono a la izquierda (columna `--experience-meta-width` desde 768px) y empresa, puesto y logros a la derecha; el spotlight común la levanta como card al pasar el puntero; revelado común de encabezado y fila; token nuevo `--experience-meta-width` y patrón "Fila de experiencia" a incorporar al sistema en la primera tarea del plan | /design-spec |
