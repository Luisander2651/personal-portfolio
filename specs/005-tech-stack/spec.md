---
id: 005
title: Tecnologías
status: active
created: 2026-09-15
updated: 2026-09-15
depends_on: [001, 002, 003, 004]
---

# Tecnologías

## Objetivo

Añadir a la home, justo después de "Sobre mí", la sección "Tecnologías" con las habilidades
técnicas de `docs/cv.md` agrupadas por categoría: las tecnologías concretas con su logo real,
las prácticas de arquitectura como etiquetas y las categorías descriptivas como texto. Las
categorías con iconos reaccionan con una luz que sigue al puntero. El objetivo es que un
reclutador evalúe el stack de un vistazo, con contexto y sin una fila de logos suelta. La
sección expone el ancla `#tecnologias` que enlazará la navegación (spec 010).

## Historias de usuario

- **HU-1**: Como reclutador, quiero ver las tecnologías agrupadas por categoría, para evaluar
  el stack del autor sin leer el CV completo.
- **HU-2**: Como visitante, quiero reconocer cada tecnología por su logo junto a su nombre,
  para identificarla de un vistazo.
- **HU-3**: Como visitante con ratón o trackpad, quiero que las categorías reaccionen con una
  luz al pasar el puntero, sin que eso afecte al contenido ni a quien no puede o no quiere verlo.
- **HU-4**: Como visitante, quiero que la sección sea ligera y accesible, sin depender de
  JavaScript ni de animaciones para leerla.

## Criterios de aceptación

### HU-1

- **CA-1.1**
  - **Dado** el sitio generado con `bun run build`
  - **Cuando** inspecciono `dist/index.html` sin ejecutar JavaScript
  - **Entonces** existe un único `<section id="tecnologias">` etiquetado por su `h2`
    (`aria-labelledby`), cuyo texto es "Tecnologías"; la sección es el siguiente bloque de
    contenido después de `#sobre-mi` dentro de `main` y la página sigue teniendo un único `h1`
- **CA-1.2**
  - **Dado** `docs/cv.md` y la colección `skills`
  - **Cuando** se ejecutan los tests
  - **Entonces** "Habilidades técnicas" incluye la categoría `### Desarrollo móvil` con el
    texto `Android nativo (Java, Kotlin), Ionic`, justo después de "Backend y web"; la colección
    tiene 10 categorías que coinciden con `cv.md` en nombre, ítems y orden ("Desarrollo móvil"
    es la 3.ª con los ítems `Android nativo (Java, Kotlin)` e `Ionic`)
- **CA-1.3**
  - **Dado** la sección "Tecnologías"
  - **Cuando** inspecciono su HTML
  - **Entonces** muestra primero las 6 categorías con iconos, en el orden del CV:
    "Lenguajes y fundamentos", "Backend y web", "Desarrollo móvil", "Bases de datos y caché",
    "DevOps y herramientas" y "Seguridad y pruebas"; cada una con un `h3` con su nombre y una
    lista con todos sus ítems en el orden del CV, cada ítem con su nombre visible exactamente
    como en el CV
- **CA-1.4**
  - **Dado** la sección "Tecnologías"
  - **Cuando** inspecciono su HTML
  - **Entonces** después de las 6 categorías con iconos aparece "Arquitectura y prácticas" con
    un `h3` y una lista de etiquetas de texto con sus 5 ítems en orden, sin iconos
- **CA-1.5**
  - **Dado** la sección "Tecnologías"
  - **Cuando** inspecciono su HTML
  - **Entonces** al final aparecen, en este orden, "Desarrollo asistido por IA", "CI/CD" y
    "Contenedores / entornos", cada una con un `h3` y un párrafo con el texto exacto del CV, sin
    iconos

### HU-2

- **CA-2.1**
  - **Dado** las 6 categorías con iconos
  - **Cuando** inspecciono su HTML
  - **Entonces** cada ítem tiene exactamente un icono SVG en línea, oculto a lectores de
    pantalla (el nombre visible es el nombre accesible): el logo de la tecnología tomado de
    Simple Icons cuando Simple Icons lo incluye (el logo de Android para
    `Android nativo (Java, Kotlin)`), y en otro caso un icono de línea genérico del sistema de
    diseño; la home no carga imágenes externas para estos iconos
- **CA-2.2**
  - **Dado** los estilos y los SVG de los iconos
  - **Cuando** se ejecutan los tests
  - **Entonces** los iconos se pintan con colores del sistema de diseño (ningún color de marca
    ni color literal)
- **CA-2.3**
  - **Dado** los logos usados
  - **Cuando** inspecciono el repositorio
  - **Entonces** los SVG están copiados en el proyecto con su fuente (Simple Icons) y su
    licencia (CC0) anotadas junto a ellos, y `package.json` no añade ninguna dependencia

### HU-3

- **CA-3.1**
  - **Dado** un visitante con puntero fino (`hover: hover`), JavaScript activo y sin
    `prefers-reduced-motion: reduce`
  - **Cuando** mueve el puntero sobre una de las 6 categorías con iconos
  - **Entonces** una luz sigue al puntero sobre esa categoría y desaparece al salir
    (verificación: estructura por test y revisión manual contra el diseño)
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
    solo implementa la animación del hero, el spotlight de esta sección y el script común de
    revelado de las secciones

### HU-4

- **CA-4.1**
  - **Dado** los estilos de la sección
  - **Cuando** se ejecutan los tests
  - **Entonces** solo usan tokens del sistema de diseño (ningún color, tamaño, espaciado o
    duración literal)
- **CA-4.2**
  - **Dado** la sección "Tecnologías"
  - **Cuando** inspecciono su HTML
  - **Entonces** no contiene elementos enfocables (enlaces, botones, controles ni `tabindex`),
    de modo que el orden de tabulación de la home no cambia
- **CA-4.3**
  - **Dado** la home servida con `bun run preview`
  - **Cuando** se ejecuta Lighthouse (móvil)
  - **Entonces** obtiene ≥ 90 en Performance, Accessibility, Best Practices y SEO
- **CA-4.4**
  - **Dado** un visitante con JavaScript activo y sin `prefers-reduced-motion: reduce`
  - **Cuando** el encabezado, cada una de las 6 cards, el bloque "Arquitectura y prácticas" y el
    bloque de notas entran en pantalla al hacer scroll
  - **Entonces** se revelan con una animación, y vuelven a revelarse cada vez que entran de nuevo
    tras haber salido de pantalla (verificación: estructura por test y revisión manual, con
    scroll fluido con trackpad)

## Contenido

Fuente: colección `skills` (derivada de `docs/cv.md`, sección "Habilidades técnicas").

Categoría nueva en `docs/cv.md` (tras "Backend y web"):

```
### Desarrollo móvil
Android nativo (Java, Kotlin), Ionic
```

| Orden en el CV | Categoría | Presentación | Grupo en la sección |
|----------------|-----------|--------------|---------------------|
| 1 | Lenguajes y fundamentos | Ítems con icono | 1.º |
| 2 | Backend y web | Ítems con icono | 1.º |
| 3 | Desarrollo móvil (nueva) | Ítems con icono | 1.º |
| 4 | Bases de datos y caché | Ítems con icono | 1.º |
| 5 | DevOps y herramientas | Ítems con icono | 1.º |
| 6 | Seguridad y pruebas | Ítems con icono | 1.º |
| 7 | Desarrollo asistido por IA | Párrafo | 3.º |
| 8 | Arquitectura y prácticas | Etiquetas sin icono | 2.º |
| 9 | CI/CD | Párrafo | 3.º |
| 10 | Contenedores / entornos | Párrafo | 3.º |

Dentro de cada grupo se mantiene el orden del CV. Los ítems se muestran con el texto exacto del
CV (por ejemplo, "Linux (nivel básico)").

Iconos: logo de Simple Icons (CC0) cuando existe para la tecnología; si no (por ejemplo
"APIs REST", "WebSockets", "WebHooks" o "SQL", según disponibilidad en Simple Icons), un icono
de línea genérico del sistema. La correspondencia concreta ítem → icono se fija en el diseño.

Encabezado de la sección: "Tecnologías" (`docs/workflow.md`, roadmap), con el encabezado de
sección común del sistema.

## Diseño

Diseño aprobado: [designs/005-tech-stack/design.md](../../designs/005-tech-stack/design.md)
· [canvas](https://claude.ai/artifact/LmYFpxT1xKVunFxSWTRz7T) (composición A · Bento).

Qué debe sentirse: una sección técnica y ordenada, con los logos como detalle reconocible y
no como fila decorativa; los bloques se revelan al entrar en pantalla, cada vez que entran, y
las categorías con iconos responden al puntero con una luz sutil (patrón P-2 del sistema). No
compite con el hero. La técnica y los tiempos se definen en `/design-spec`.

## Fuera de alcance

- Niveles, porcentajes o barras de dominio.
- Colores de marca en los logos.
- Enlaces a documentación de las tecnologías o a los proyectos donde se usan (spec 006).
- Tooltips, filtros o búsqueda de tecnologías.
- Iconos en "Arquitectura y prácticas", "Desarrollo asistido por IA", "CI/CD" y
  "Contenedores / entornos".
- Separar "Android nativo (Java, Kotlin)" en varios ítems.
- Spotlight activado con teclado o foco (las categorías no son interactivas).
- Tilt 3D (patrón P-7).
- Navegación del sitio (spec 010).
- Cambios en el hero (003) y en "Sobre mí" (004), salvo el presupuesto de JavaScript.

## Registro de decisiones

| Fecha | Tipo | Pregunta / Conflicto | Decisión | Fuente |
|-------|------|----------------------|----------|--------|
| 2026-09-15 | Implícita | Número, slug, ancla y posición | `005-tech-stack`, ancla `#tecnologias`, tras "Sobre mí" | docs/workflow.md |
| 2026-09-15 | Implícita | Agrupación y contexto de los logos | Agrupados por las categorías del CV con icono + nombre, nunca una fila de logos suelta | docs/workflow.md, anti-cliches.md |
| 2026-09-15 | Implícita | Encabezado | Encabezado de sección común (ruta + `h2`) | designs/000-design-system |
| 2026-09-15 | Contradicción | La iconografía del sistema es "iconos de línea … SVG inline (sin librerías)" y los logos de tecnologías son marcas rellenas; la constitución §1 exige justificar dependencias | SVG de Simple Icons (CC0) copiados al repo, sin dependencia nueva, en colores del sistema; la excepción "logos de tecnología" se añade a la iconografía del sistema en `/design-spec 005` | usuario, constitution.md §1, designs/000-design-system |
| 2026-09-15 | Brecha | Ítems sin logo reconocible ("APIs REST", "WebSockets", "WebHooks", "SQL"…) | Icono de línea genérico del sistema | usuario |
| 2026-09-15 | Brecha | Texto y posición de la categoría nueva | `### Desarrollo móvil` con "Android nativo (Java, Kotlin), Ionic", tras "Backend y web" (3.ª categoría) | usuario |
| 2026-09-15 | Contradicción | El roadmap pone Seguridad, IA, Arquitectura, CI/CD y Contenedores como texto, pero Seguridad y Arquitectura son listas | Solo IA, CI/CD y Contenedores como párrafo; Seguridad y pruebas con iconos; Arquitectura y prácticas como etiquetas sin icono | usuario, docs/workflow.md |
| 2026-09-15 | Brecha | Orden de las categorías | Agrupadas por tipo (iconos → etiquetas → texto), con el orden del CV dentro de cada grupo | usuario |
| 2026-09-15 | Brecha | Interacción | Spotlight con JS mínimo (patrón P-2) | usuario |
| 2026-09-15 | Brecha | Título de la sección | `h2` "Tecnologías" (el CV la llama "Habilidades técnicas") | usuario, docs/workflow.md |
| 2026-09-15 | Brecha | Icono del ítem "Android nativo (Java, Kotlin)" | Logo de Android; Java y Kotlin se leen en el nombre | usuario |
| 2026-09-15 | Contradicción | 003 CA-4.1 ("solo implementa la animación del hero") y 004 CA-4.2 ("el JavaScript de la home sigue siendo solo el de la animación del hero") vs. spotlight con JS | Presupuesto compartido: JS total de la home ≤ 3 kB con gzip, sin dependencias, solo hero + spotlight; esta spec supera esas frases (las specs cerradas no se editan) | usuario, specs/003-home-hero, specs/004-about |
| 2026-09-15 | Brecha | Alcance del spotlight | Solo las 6 categorías con iconos; etiquetas y párrafos sobrios | usuario |
| 2026-09-15 | Implícita | Glow en elementos no interactivos | Las 6 categorías son cards del sistema (P-2 aplica a cards); no son enfocables ni enlazan | designs/000-design-system |
| 2026-09-15 | Implícita | Comportamiento sin puntero fino, con reduced motion o sin JS | Sin seguimiento del puntero; contenido completo en el HTML (P-2) | designs/000-design-system, constitution.md §7 |
| 2026-09-15 | Diseño | Composición de la sección | A · Bento: mosaico de cards de tamaños distintos (5:7 y fila de cuatro), etiquetas de arquitectura y notas; 21 logos de Simple Icons y 6 iconos genéricos; spotlight P-2 (táctil sin efecto); tokens `--tech-card-min-width` y `--tech-item-min-width` e iconografía a incorporar al sistema en la primera tarea del plan | /design-spec |
| 2026-09-15 | Diseño | Revelado refinado tras el bloqueo de T05 por tirones de scroll | Solo los encabezados de sección se revelan (rango `entry`, desde que asoman hasta que entran completos, `--ease-out`); cards, etiquetas, notas y panel de "Sobre mí" estáticos; sin JavaScript nuevo | /design-spec |
| 2026-09-15 | Contradicción | El revelado ligado al scroll (CSS scroll-driven) trababa el scroll con trackpad al sumar secciones; CA-3.3 limitaba el JS de la home al hero y al spotlight | Revelado disparado al entrar en pantalla con un script común de la home; CA-3.2 y CA-3.3 reescritos (visible sin JS o con reduced motion; JS total de la home ≤ 3 kB con gzip: hero, spotlight y revelado) | usuario, constitution.md §3 y §7, specs/004-about |
| 2026-09-15 | Brecha | Repetición y elementos del revelado | Cada vez que entran en pantalla, como en 004 (CA-4.4); se revelan el encabezado, cada card, el bloque de arquitectura y el de notas | usuario, specs/004-about |
| 2026-09-15 | Diseño | Revelado por tiempo al entrar en pantalla | Umbral 10 %, `--duration-reveal` / `--ease-out`, sin desenfoque, escalonado `--stagger`, oculto sin animación al salir y revelado de nuevo al entrar; CSS con script común mínimo; sin JS o con reduced motion todo visible | /design-spec |
| 2026-09-15 | Diseño | Inicio del revelado | Empieza cuando el borde superior del bloque ha entrado `--reveal-start-distance` (80px / 120px) o el bloque se ve completo, como en el refinado anterior; solo cambió la técnica | /design-spec |
