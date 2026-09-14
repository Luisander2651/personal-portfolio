---
id: 003
title: Hero de la home
status: done
created: 2026-09-13
updated: 2026-09-14
depends_on: [001, 002]
---

# Hero de la home

## Objetivo

Construir la primera pantalla de la home: un bloque de código que se escribe, compila y se
transforma en la tarjeta de presentación con datos reales de `docs/cv.md`, para que un
reclutador sepa en segundos quién es el autor, qué hace y cómo contactarlo. El hero sustituye
la página `index` técnica de la spec 001.

## Historias de usuario

- **HU-1**: Como reclutador, quiero ver al entrar el nombre, el rol, la ubicación y el stack
  principal, para decidir en segundos si sigo leyendo.
- **HU-2**: Como visitante, quiero enlaces directos a GitHub, LinkedIn y correo, para ver el
  trabajo publicado o contactar.
- **HU-3**: Como visitante, quiero una presentación memorable en la que el código se convierte
  en la tarjeta, sin que el movimiento impida acceder al contenido.
- **HU-4**: Como visitante, quiero que la home cargue ligera y siga siendo accesible, para no
  esperar ni depender de la animación.

## Criterios de aceptación

### HU-1

- **CA-1.1**
  - **Dado** el sitio generado con `bun run build`
  - **Cuando** inspecciono `dist/index.html` sin ejecutar JavaScript
  - **Entonces** el hero contiene el nombre, el rol, la ubicación y las tecnologías del stack,
    todos tomados de la colección `profile` (ningún dato incrustado en componentes)
- **CA-1.2**
  - **Dado** la home
  - **Cuando** inspecciono sus encabezados
  - **Entonces** existe un único `h1` cuyo texto es el nombre; el rol aparece como subtítulo
    fuera del `h1`; y el `<title>` sigue siendo "Nombre — Rol"
- **CA-1.3**
  - **Dado** la colección `profile`
  - **Cuando** se ejecutan los tests
  - **Entonces** tiene un campo de stack destacado, validado por su esquema como lista no
    vacía, con exactamente `TypeScript`, `Node.js`, `Laravel 12` y `Spring Boot` en ese orden,
    y cada valor aparece en `docs/cv.md`

### HU-2

- **CA-2.1**
  - **Dado** el hero
  - **Cuando** inspecciono sus enlaces
  - **Entonces** existen exactamente tres: GitHub con `href` igual a `profile.github`,
    LinkedIn con `href` igual a `profile.linkedin` y correo con `href` `mailto:` + `profile.email`;
    ninguno abre una pestaña nueva y cada uno tiene un nombre accesible en español aunque
    visualmente sea un icono
- **CA-2.2**
  - **Dado** un visitante que navega con teclado
  - **Cuando** recorre el hero con Tab
  - **Entonces** alcanza los tres enlaces en orden de lectura y cada uno muestra el foco
    visible del sistema de diseño

### HU-3

- **CA-3.1**
  - **Dado** un visitante con JavaScript activo y sin `prefers-reduced-motion: reduce`
  - **Cuando** carga la home
  - **Entonces** el código se escribe, compila y se transforma en la tarjeta, y después el
    nombre se descifra; la secuencia ocurre una sola vez por carga
    (verificación: estructura por test y revisión visual contra los fotogramas F1–F3 del diseño)
- **CA-3.2**
  - **Dado** el bloque de código del hero
  - **Cuando** inspecciono el HTML generado
  - **Entonces** está oculto a lectores de pantalla (`aria-hidden="true"`) y su contenido se
    genera a partir de los datos de `profile` (nombre, rol y stack)
- **CA-3.3**
  - **Dado** un visitante con `prefers-reduced-motion: reduce`
  - **Cuando** carga la home
  - **Entonces** ve la tarjeta final directamente, sin escritura de código, desenfoque ni
    descifrado del nombre
- **CA-3.4**
  - **Dado** un visitante sin JavaScript
  - **Cuando** carga la home
  - **Entonces** ve la tarjeta completa con todos sus datos y enlaces, y ningún contenido queda
    oculto a la espera del script

### HU-4

- **CA-4.1**
  - **Dado** el sitio generado
  - **Cuando** mido el JavaScript de cliente de la home en `dist/`
  - **Entonces** su tamaño total comprimido con gzip es ≤ 3 kB, no depende de ningún paquete
    nuevo y solo implementa la animación del hero
- **CA-4.2**
  - **Dado** los estilos del hero
  - **Cuando** se ejecutan los tests
  - **Entonces** solo usan tokens del sistema de diseño (ningún color, tamaño, espaciado o
    duración literal)
- **CA-4.3**
  - **Dado** la home servida con `bun run preview`
  - **Cuando** se ejecuta Lighthouse (móvil)
  - **Entonces** obtiene ≥ 90 en Performance, Accessibility, Best Practices y SEO

## Contenido

Fuente: colección `profile` (derivada de `docs/cv.md`).

| Dato | Campo | Uso en el hero |
|------|-------|----------------|
| Nombre | `name` | `h1` de la tarjeta; también en el código decorativo |
| Rol | `role` | Subtítulo; también en el código decorativo |
| Ubicación | `location` | Metadato de la tarjeta |
| Stack destacado | campo nuevo | Etiquetas de la tarjeta y código decorativo: `TypeScript`, `Node.js`, `Laravel 12`, `Spring Boot` |
| GitHub | `github` | Enlace |
| LinkedIn | `linkedin` | Enlace |
| Correo | `email` | Enlace `mailto:` |

Origen del stack en `docs/cv.md`: resumen profesional ("Dominio de TypeScript, Node.js,
PHP (Laravel 12) y Java / Spring Boot") con los nombres de framework tal como aparecen en
"Habilidades técnicas" ("Laravel 12", "Spring Boot").

## Diseño

Diseño aprobado: [designs/003-home-hero/design.md](../../designs/003-home-hero/design.md)
· [canvas](https://claude.ai/code/artifact/1fd35525-0141-41e5-8257-a47f545f0423)
(composición A · Escenario).

Referencias del sistema de diseño: patrones P-5 (hero código → tarjeta), P-4 (scramble del
nombre) y P-3 (borde luminoso) en `designs/000-design-system/design.md`.

## Fuera de alcance

- Cabecera y navegación del sitio.
- Resumen profesional y demás secciones (sobre mí, habilidades, proyectos, experiencia,
  formación, contacto).
- Botón "Ver proyectos" (se añadirá en la spec de proyectos).
- Easter egg con mensaje ASCII en la consola.
- View Transitions, spotlight y tilt en la tarjeta.
- Control para repetir o saltar la animación (la secuencia dura menos de 5 s).
- Descarga del CV, metadatos Open Graph y SEO avanzado.

## Registro de decisiones

| Fecha | Tipo | Pregunta / Conflicto | Decisión | Fuente |
|-------|------|----------------------|----------|--------|
| 2026-09-13 | Implícita | Patrón de animación | P-5 (código → compilación → tarjeta) y P-4 (scramble), con su versión reduced motion | design.md |
| 2026-09-13 | Implícita | Técnica de animación | Web Animations API y script nativo mínimo; sin Motion | design.md, constitution.md §3 |
| 2026-09-13 | Implícita | Contenido sin JS | Todo el contenido y los enlaces existen en el HTML generado | design.md, constitution.md §3 |
| 2026-09-13 | Implícita | Datos de la tarjeta | Solo desde la colección `profile` | constitution.md §4, §8 |
| 2026-09-13 | Implícita | Página `index` técnica | El hero la sustituye | specs/001-foundation |
| 2026-09-13 | Brecha | Alcance | Solo el hero | usuario |
| 2026-09-13 | Brecha | Acciones del hero sin sección de proyectos | Enlaces a GitHub, LinkedIn y correo; "Ver proyectos" en la spec de proyectos | usuario |
| 2026-09-13 | Brecha | Origen del stack de la tarjeta | Campo nuevo en `profile` | usuario |
| 2026-09-13 | Brecha | Valores del stack | `TypeScript`, `Node.js`, `Laravel 12`, `Spring Boot` (nombres de framework de "Habilidades técnicas") | usuario, cv.md |
| 2026-09-13 | Brecha | Estructura del encabezado | `h1` = nombre; rol como subtítulo; `<title>` "Nombre — Rol". Supera el formato de `h1` de 001 CA-4.1 | usuario |
| 2026-09-13 | Brecha | Resumen en el hero | No se muestra | usuario |
| 2026-09-13 | Brecha | Comportamiento de enlaces | Misma pestaña; correo con `mailto:`; nombre accesible en español | usuario |
| 2026-09-13 | Contradicción | 001 CA-4.2 y 002 CA-4.5 exigen index sin JavaScript vs. hero con script de animación | Se permite un script mínimo solo para la animación; esos criterios quedan superados por esta spec (describían la index técnica) | usuario, constitution.md §3 |
| 2026-09-13 | Brecha | Presupuesto de JavaScript | ≤ 3 kB con gzip | usuario |
| 2026-09-13 | Implícita | Control de pausa de la animación | No necesario: la secuencia dura menos de 5 s (WCAG 2.2.2) | constitution.md §7 |
| 2026-09-13 | Diseño | Composición del hero | A · Escenario (tarjeta centrada, iconos enmarcados); tokens nuevos del hero y `--icon-frame-size` a 48px en móvil, a incorporar al sistema en la primera tarea del plan | /design-spec |
| 2026-09-14 | Cierre | Spec completada: las 8 tareas de `plans/003-home-hero/plan.md` verificadas (tests, `dist/`, teclado, reduced motion, sin JS, contraste, revisión visual y Lighthouse móvil ≥ 90) | Estado `done` | /implement |
