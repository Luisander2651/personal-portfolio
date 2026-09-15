---
id: 006
title: Proyectos
status: done
created: 2026-09-15
updated: 2026-09-15
depends_on: [001, 002, 003, 004, 005]
---

# Proyectos

## Objetivo

Añadir a la home, justo después de "Tecnologías", la sección "Proyectos" con los 5 proyectos
destacados de `docs/cv.md`: su nombre, estado, logros y stack. DentissaApp (la plataforma y su
microservicio de autenticación) forma un bloque destacado y los otros tres proyectos se
presentan con otra disposición, sin una rejilla de cards idénticas. El objetivo es que un
reclutador vea en qué ha trabajado el autor y con qué tecnologías, empezando por su proyecto
principal. La sección expone el ancla `#proyectos` que enlazará la navegación (spec 010).

## Historias de usuario

- **HU-1**: Como reclutador, quiero ver cada proyecto con su estado, sus logros y su stack, para
  valorar la experiencia práctica del autor.
- **HU-2**: Como visitante, quiero identificar de un vistazo el proyecto principal, para empezar
  por lo más relevante.
- **HU-3**: Como visitante con ratón o trackpad, quiero que los proyectos reaccionen con una luz
  al pasar el puntero, como las categorías de "Tecnologías", sin que eso afecte al contenido ni a
  quien no puede o no quiere verlo.
- **HU-4**: Como visitante, quiero que la sección sea ligera y accesible, sin depender de
  JavaScript ni de animaciones para leerla.

## Criterios de aceptación

### HU-1

- **CA-1.1**
  - **Dado** el sitio generado con `bun run build`
  - **Cuando** inspecciono `dist/index.html` sin ejecutar JavaScript
  - **Entonces** existe un único `<section id="proyectos">` etiquetado por su `h2`
    (`aria-labelledby`), cuyo texto es "Proyectos"; la sección es el siguiente bloque de
    contenido después de `#tecnologias` dentro de `main` y la página sigue teniendo un único `h1`
- **CA-1.2**
  - **Dado** la colección `projects` y la sección "Proyectos"
  - **Cuando** inspecciono su HTML
  - **Entonces** muestra los 5 proyectos en el orden del campo `order`; cada uno tiene un `h3`
    con su `name` exacto, una lista `ul` con sus logros (los puntos del cuerpo de la entrada, en
    su orden) y una lista con su `stack` como etiquetas de texto sin iconos, en su orden; ningún
    texto de proyecto está incrustado en componentes
- **CA-1.3**
  - **Dado** la sección "Proyectos"
  - **Cuando** inspecciono cada proyecto
  - **Entonces** muestra un indicador de estado con texto visible: "Finalizado" para
    `completed` y "En curso" para `in-progress` (el estado no se transmite solo con color)

### HU-2

- **CA-2.1**
  - **Dado** la colección `projects` y `docs/cv.md`
  - **Cuando** se ejecutan los tests
  - **Entonces** el esquema de `projects` tiene un campo obligatorio que indica si el proyecto
    forma parte del bloque destacado; solo lo tienen activado "DentissaApp — Dental Practice
    Management Platform" y "DentissaApp — Auth Microservice"; y las 5 entradas siguen
    coincidiendo con "Proyectos destacados" de `docs/cv.md` en nombre, estado, logros, stack y
    orden
- **CA-2.2**
  - **Dado** la sección "Proyectos"
  - **Cuando** inspecciono su HTML y sus estilos
  - **Entonces** los dos proyectos destacados están agrupados en un bloque que va antes que los
    otros tres, y el bloque destacado y el resto usan disposiciones distintas en sus estilos, de
    modo que la sección no es una rejilla de cards idénticas (verificación: test de estructura y
    estilos, y revisión manual contra el diseño)

### HU-3

- **CA-3.1**
  - **Dado** un visitante con puntero fino (`hover: hover`), JavaScript activo y sin
    `prefers-reduced-motion: reduce`
  - **Cuando** mueve el puntero sobre cualquiera de los 5 proyectos
  - **Entonces** una luz sigue al puntero sobre ese proyecto y desaparece al salir, con el mismo
    efecto que las categorías de "Tecnologías" (verificación: estructura por test y revisión
    manual contra el diseño)
- **CA-3.2**
  - **Dado** un visitante en un dispositivo táctil, con `prefers-reduced-motion: reduce` o sin
    JavaScript
  - **Cuando** carga la home y llega a la sección
  - **Entonces** no hay luz que siga al puntero, todo el contenido de la sección está en el HTML
    y es visible, y ningún estilo lo oculta salvo cuando el script de revelado se ha ejecutado y
    no hay reduced motion
- **CA-3.3**
  - **Dado** el sitio generado
  - **Cuando** mido el JavaScript de cliente de la home en `dist/`
  - **Entonces** su tamaño total comprimido con gzip es ≤ 3 kB, no depende de ningún paquete y
    solo implementa la animación del hero, un spotlight común para "Tecnologías" y "Proyectos" y
    el script común de revelado de las secciones

### HU-4

- **CA-4.1**
  - **Dado** los estilos de la sección
  - **Cuando** se ejecutan los tests
  - **Entonces** solo usan tokens del sistema de diseño (ningún color, tamaño, espaciado o
    duración literal)
- **CA-4.2**
  - **Dado** la sección "Proyectos"
  - **Cuando** inspecciono su HTML
  - **Entonces** no contiene elementos enfocables (enlaces, botones, controles ni `tabindex`),
    de modo que el orden de tabulación de la home no cambia
- **CA-4.3**
  - **Dado** la home servida con `bun run preview`
  - **Cuando** se ejecuta Lighthouse (móvil)
  - **Entonces** obtiene ≥ 90 en Performance, Accessibility, Best Practices y SEO
- **CA-4.4**
  - **Dado** un visitante con JavaScript activo y sin `prefers-reduced-motion: reduce`
  - **Cuando** el encabezado de la sección y cada uno de los 5 proyectos entran en pantalla al
    hacer scroll
  - **Entonces** se revelan con una animación, y vuelven a revelarse cada vez que entran de nuevo
    tras haber salido de pantalla (verificación: estructura por test y revisión manual, con
    scroll fluido con trackpad)

## Contenido

Fuente: colección `projects` (derivada de `docs/cv.md`, sección "Proyectos destacados").

| Proyecto (`name`) | `order` | Estado | Bloque destacado | Stack |
|-------------------|---------|--------|------------------|-------|
| DentissaApp — Dental Practice Management Platform | 1 | Finalizado | Sí | Laravel 12, PostgreSQL, Vite, Redis |
| DentissaApp — Auth Microservice | 2 | En curso | Sí | Java, Spring Boot, PostgreSQL, Docker, JUnit, OAuth 2.0, JWT, Azure App Service |
| Hardware Store Inventory Management API | 3 | Finalizado | No | Node.js, Express.js, JWT, CORS |
| Real-Time Movement & Telemetry Tracking System | 4 | Finalizado | No | Node.js, WebSockets, ESP32 |
| Automated Event-Driven Integration API | 5 | Finalizado | No | Node.js, Python, Webhooks |

- **Logros**: los puntos de cada proyecto en `docs/cv.md`, tal cual (cuerpo de cada entrada).
- **Nombres**: se muestran en inglés, como nombres propios de los proyectos.
- **Estado**: "Finalizado" (`completed`) o "En curso" (`in-progress`).
- **Bloque destacado**: dato de presentación nuevo en la colección (no cambia `docs/cv.md`).

Encabezado de la sección: "Proyectos" (`docs/workflow.md`, roadmap).

## Diseño

Diseño aprobado: [designs/006-projects/design.md](../../designs/006-projects/design.md)
· [canvas](https://claude.ai/artifact/PBgd66h2DwqMKpuyVvmgUR) (composición A · Sistema).

Qué debe sentirse: el bloque DentissaApp es claramente el protagonista de la sección y los otros
tres proyectos lo acompañan con otra escala, sin una rejilla de cards idénticas
(`anti-cliches.md`). Borde luminoso y luz que sigue al puntero como en "Tecnologías"; revelado
sutil al entrar en pantalla, cada vez que entra, como en "Sobre mí" y "Tecnologías". La
técnica, los tiempos y la disposición se definen en `/design-spec`.

## Fuera de alcance

- Enlaces a repositorios, demos u otras webs de los proyectos (no hay en `docs/cv.md`).
- Páginas de detalle de proyecto y View Transitions entre páginas (el sitio es de una sola
  página).
- Etiqueta de tipo de proyecto (personal, académico o profesional): no está en `docs/cv.md`.
- Logos o iconos en el stack de los proyectos (ya están en "Tecnologías").
- Imágenes o capturas de los proyectos.
- Filtros, búsqueda u ordenación interactiva.
- Traducción de los nombres de los proyectos.
- Métricas, fechas o datos que no estén en `docs/cv.md`.
- Navegación del sitio (spec 010) y cambios de contenido en otras secciones.

## Registro de decisiones

| Fecha | Tipo | Pregunta / Conflicto | Decisión | Fuente |
|-------|------|----------------------|----------|--------|
| 2026-09-15 | Implícita | Número, slug, ancla y posición | `006-projects`, ancla `#proyectos`, sección siguiente a "Tecnologías" | docs/workflow.md |
| 2026-09-15 | Implícita | Encabezado de la sección | `h2` "Proyectos" con el encabezado de sección común; cada proyecto con `h3` | docs/workflow.md, designs/000-design-system |
| 2026-09-15 | Implícita | Sin páginas de detalle ni rejilla de cards idénticas | Todo en la home; proyecto destacado + variaciones de tamaño | docs/workflow.md, anti-cliches.md |
| 2026-09-15 | Contradicción | Constitución §9 ("contenido del sitio … en español") vs. nombres de proyecto en inglés en `docs/cv.md` | Los nombres se mantienen como nombres propios; logros, estado y textos de la sección en español | usuario, constitution.md, cv.md |
| 2026-09-15 | Brecha | Enlaces de los proyectos | Sin enlaces: no hay en `docs/cv.md`; GitHub ya está en el hero y estará en el footer | usuario, cv.md |
| 2026-09-15 | Brecha | Proyecto destacado | Bloque DentissaApp: la plataforma y su microservicio de autenticación (relacionados); los otros tres con otra disposición | usuario |
| 2026-09-15 | Implícita | Cómo se sabe qué forma el bloque destacado | Campo de presentación en el esquema de `projects`, no deducido del nombre | constitution.md §4, specs/005-tech-stack |
| 2026-09-15 | Brecha | Interacción con el puntero | El mismo spotlight que en "Tecnologías" en los 5 proyectos; reduced motion con borde estático, táctil y sin JS sin efecto | usuario, designs/000-design-system (card de proyecto) |
| 2026-09-15 | Implícita | JavaScript | Presupuesto compartido de la home ≤ 3 kB con gzip, sin dependencias: hero, spotlight común y revelado común; supera la frase de 005 CA-3.3 sobre "el spotlight de esta sección" (las specs cerradas no se editan) | specs/005-tech-stack, constitution.md §3 |
| 2026-09-15 | Brecha | Estado de los proyectos | Indicador en todos: "Finalizado" o "En curso", con texto visible | usuario, designs/000-design-system |
| 2026-09-15 | Brecha | Presentación del stack | Etiquetas de texto del sistema, sin logos | usuario |
| 2026-09-15 | Brecha | Tipo de proyecto | Sin etiqueta de tipo: no está en `docs/cv.md` | usuario, AGENTS.md |
| 2026-09-15 | Implícita | Revelado | Encabezado y cada proyecto con el revelado común al entrar en pantalla, cada vez que entran, uniforme con 004 y 005 | specs/004-about, specs/005-tech-stack |
| 2026-09-15 | Implícita | Orden | El del campo `order` (el de `docs/cv.md`) | cv.md, src/content |
| 2026-09-15 | Diseño | Composición de la sección | A · Sistema: DentissaApp como panel diagrama (plataforma y Auth Microservice unidos por un conector decorativo, en fila 7:5 desde 1024px y apilados por debajo) y los otros tres como cards del sistema (3 columnas desde 1024px); índice decorativo 01–05; spotlight común con "Tecnologías"; revelado común de encabezado y cards; constante "breakpoint ancho 1024px" a incorporar al sistema en la primera tarea del plan | /design-spec |
| 2026-09-15 | Cierre | Spec completada: las tareas T01 a T07 de `plans/006-projects/plan.md` verificadas (tests, `dist/`, revisión visual a 390px, 900px y 1440px, spotlight y revelado, rendimiento, reduced motion, sin JS y Lighthouse móvil ≥ 90) | Estado `done` | /implement |
