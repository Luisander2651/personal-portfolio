---
id: 004
title: Sobre mí
status: done
created: 2026-09-15
updated: 2026-09-15
depends_on: [001, 002, 003]
---

# Sobre mí

## Objetivo

Añadir a la home, justo después del hero, la sección "Sobre mí" con el resumen profesional
de `docs/cv.md` y dos grupos de puntos clave extraídos literalmente de ese resumen
(experiencia práctica y enfoque), para que un reclutador entienda el perfil y sus fortalezas
sin tener que leer todo el párrafo. La sección expone el ancla `#sobre-mi` que enlazará la
navegación (spec 010).

## Historias de usuario

- **HU-1**: Como reclutador, quiero leer un resumen de quién es el autor y cómo trabaja, para
  valorar su perfil.
- **HU-2**: Como visitante, quiero ver de un vistazo su experiencia práctica y su enfoque,
  para identificar sus fortalezas sin leer el párrafo completo.
- **HU-3**: Como visitante que llega desde la navegación o un enlace directo, quiero ir a la
  sección con `#sobre-mi`.
- **HU-4**: Como visitante, quiero que la sección cargue ligera y sea accesible, sin depender
  de JavaScript ni de animaciones.

## Criterios de aceptación

### HU-1

- **CA-1.1**
  - **Dado** el sitio generado con `bun run build`
  - **Cuando** inspecciono `dist/index.html` sin ejecutar JavaScript
  - **Entonces** existe un `<section id="sobre-mi">` etiquetado por su `h2` (`aria-labelledby`),
    cuyo texto es "Sobre mí", y la sección contiene el resumen completo tomado del campo
    `summary` de la colección `profile` (ningún texto incrustado en componentes)
- **CA-1.2**
  - **Dado** `docs/cv.md` y la colección `profile`
  - **Cuando** se ejecutan los tests
  - **Entonces** el resumen profesional empieza por "Estudiante de Ingeniería en Tecnologías
    de la Información, especializado en Desarrollo de Software Multiplataforma, con experiencia
    práctica en", conserva el resto del texto actual y es idéntico en `docs/cv.md` y en
    `profile.summary`
- **CA-1.3**
  - **Dado** la home generada
  - **Cuando** inspecciono su `<meta name="description">`
  - **Entonces** su contenido es el resumen corregido de CA-1.2

### HU-2

- **CA-2.1**
  - **Dado** la colección `profile`
  - **Cuando** se ejecutan los tests
  - **Entonces** tiene un campo de experiencia práctica y otro de enfoque, validados por su
    esquema como listas no vacías, con exactamente estos valores y en este orden:
    - Experiencia práctica: `Diseño de APIs REST modulares`, `Arquitecturas en tiempo real
      orientadas a eventos`, `Sistemas de bases de datos relacionales`
    - Enfoque: `Clean Architecture`, `Microservicios`, `Escalabilidad de sistemas`,
      `Trabajo en equipo ágil`

    y cada valor aparece en el resumen profesional de `docs/cv.md` (sin distinguir la
    mayúscula inicial)
- **CA-2.2**
  - **Dado** la sección "Sobre mí"
  - **Cuando** inspecciono su HTML
  - **Entonces** muestra dos grupos, cada uno con un `h3` ("Experiencia práctica" y
    "Enfoque", en ese orden) seguido de una lista `ul` con sus puntos en el orden de CA-2.1

### HU-3

- **CA-3.1**
  - **Dado** la home generada
  - **Cuando** inspecciono `dist/index.html`
  - **Entonces** el id `sobre-mi` aparece una sola vez, la sección es el siguiente bloque de
    contenido después del hero dentro de `main` y la página sigue teniendo un único `h1`
    (el nombre del hero)

### HU-4

- **CA-4.1**
  - **Dado** un visitante con `prefers-reduced-motion: reduce`, sin JavaScript o con un
    navegador sin soporte del revelado
  - **Cuando** carga la home y llega a la sección
  - **Entonces** todo el contenido de "Sobre mí" está en el HTML y ningún estilo lo oculta por
    defecto ni a la espera de un script; con reduced motion o sin soporte del revelado se ve
    directamente, sin animación, y sin JavaScript el revelado (si el navegador lo soporta)
    solo avanza con el scroll
- **CA-4.2**
  - **Dado** el sitio generado
  - **Cuando** mido el JavaScript de cliente de la home en `dist/`
  - **Entonces** la sección no añade scripts: el JavaScript de la home sigue siendo solo el de
    la animación del hero y cumple CA-4.1 de la spec 003 (≤ 3 kB con gzip)
- **CA-4.3**
  - **Dado** los estilos de la sección y la home servida con `bun run preview`
  - **Cuando** se ejecutan los tests y Lighthouse (móvil)
  - **Entonces** los estilos solo usan tokens del sistema de diseño (ningún color, tamaño,
    espaciado o duración literal) y la home obtiene ≥ 90 en Performance, Accessibility,
    Best Practices y SEO

## Contenido

Fuente: colección `profile` (derivada de `docs/cv.md`, sección "Resumen profesional").

| Dato | Campo | Uso |
|------|-------|-----|
| Resumen profesional | `summary` | Párrafo principal de la sección y meta description de la home |
| Experiencia práctica | campo nuevo | Grupo con `h3` "Experiencia práctica" y 3 puntos |
| Enfoque | campo nuevo | Grupo con `h3` "Enfoque" y 4 puntos |

Resumen corregido (en `docs/cv.md` y `profile.summary`):

> Estudiante de Ingeniería en Tecnologías de la Información, especializado en Desarrollo de
> Software Multiplataforma, con experiencia práctica en el diseño de APIs REST modulares,
> arquitecturas en tiempo real orientadas a eventos y sistemas de bases de datos
> relacionales. Dominio de TypeScript, Node.js, PHP (Laravel 12) y Java / Spring Boot, con un
> fuerte enfoque en Clean Architecture, microservicios, escalabilidad de sistemas y trabajo en
> equipo ágil.

Los puntos clave son fragmentos literales del resumen con la primera letra en mayúscula.

Encabezado de la sección: "Sobre mí" (`docs/workflow.md`, roadmap).

## Diseño

Diseño aprobado: [designs/004-about/design.md](../../designs/004-about/design.md)
· [canvas](https://claude.ai/artifact/SjN7VKYTSwaC63f61kDDaq) (composición B · about.md).

Qué debe sentirse: una sección sobria después del momento protagonista del hero; se revela de
forma sutil al entrar en pantalla (patrón P-1 del sistema de diseño, ligado al scroll), sin
competir con el hero y con su versión reduced motion.

## Fuera de alcance

- Fotografía: queda pendiente para una futura actualización de esta spec, cuando el usuario
  aporte la imagen.
- Llamadas a la acción en la sección (descargar CV, enlace a proyectos o contacto).
- Grupo "Dominio" con tecnologías (ya están en el hero y en la spec 005).
- Datos de otras secciones: tecnologías (005), formación (008) e idiomas (009).
- Logros y reconocimientos (no hay en `docs/cv.md`).
- Navegación del sitio (spec 010).
- Spotlight, tilt u otras interacciones con el puntero.
- Cambios en el hero (spec 003).

## Registro de decisiones

| Fecha | Tipo | Pregunta / Conflicto | Decisión | Fuente |
|-------|------|----------------------|----------|--------|
| 2026-09-15 | Implícita | Número, slug, ancla y posición | `004-about`, ancla `#sobre-mi`, primera sección tras el hero | docs/workflow.md |
| 2026-09-15 | Implícita | Encabezado de la sección | `h2` "Sobre mí"; el `h1` sigue siendo el nombre del hero | docs/workflow.md, specs/003-home-hero |
| 2026-09-15 | Contradicción | El resumen de `cv.md` dice "Estudiante de Ingeniería de Software especializado en Desarrollo Multiplataforma" y "Formación" dice "Ingeniería en Tecnologías de la Información (Desarrollo de Software Multiplataforma)" | Se alinea el resumen con el título oficial en `cv.md` y `profile`; el resto del texto no cambia | usuario, cv.md |
| 2026-09-15 | Brecha | Contenido de la sección | Resumen completo + puntos clave extraídos literalmente del resumen | usuario |
| 2026-09-15 | Brecha | Grupos de puntos clave | "Experiencia práctica" y "Enfoque"; sin grupo "Dominio" para no repetir el stack del hero | usuario |
| 2026-09-15 | Brecha | Textos de los puntos clave | 3 de experiencia práctica y 4 de enfoque, literales del resumen con mayúscula inicial | usuario, cv.md |
| 2026-09-15 | Brecha | Fotografía | Sin foto en esta versión; pendiente de una actualización de la spec cuando el usuario aporte la imagen | usuario |
| 2026-09-15 | Brecha | Llamada a la acción | Ninguna: el contacto está en el hero y estará en el footer | usuario |
| 2026-09-15 | Implícita | Movimiento | Revelado sutil al entrar en pantalla (P-1), nunca oculto por defecto; un solo momento protagonista por página (el hero) | designs/000-design-system |
| 2026-09-15 | Implícita | JavaScript | La sección no añade scripts; se conserva el presupuesto de JS de la home de la spec 003 | constitution.md §3, specs/003-home-hero |
| 2026-09-15 | Implícita | Meta description | Pasa a ser el resumen corregido (ya se genera desde `profile.summary`) | specs/001-foundation, specs/003-home-hero |
| 2026-09-15 | Diseño | Composición de la sección | B · about.md: encabezado de sección común (ruta mono + `h2`), panel de archivo con resumen y grupos, revelado ligado al scroll sin JS; tokens nuevos y ajuste de P-1 a incorporar al sistema en la primera tarea del plan | /design-spec |
| 2026-09-15 | Contradicción | CA-4.1 exigía contenido visible sin animación también sin JavaScript, pero el revelado aprobado es CSS y no depende de JS (detectado en `/plan-spec 004`) | CA-4.1 refinado: con reduced motion o sin soporte, visible sin animación; sin JS, contenido en el HTML y nunca oculto a la espera de un script | usuario, designs/004-about |
| 2026-09-15 | Diseño | Revelado M-1 refinado tras la revisión de T03 | Inicio del rango tras `--reveal-range-start`, recorrido `--reveal-range-length` (240px / 360px) y curva `--ease-in-out` para encabezado y panel; desenfoque del encabezado se mantiene y se vigila en la verificación final | /design-spec |
| 2026-09-15 | Cierre | Spec completada: las tareas T01, T02, T05, T03 y T04 de `plans/004-about/plan.md` verificadas (tests, `dist/`, revisión visual, rendimiento del revelado, reduced motion, sin JS y Lighthouse móvil ≥ 90) | Estado `done` | /implement |
