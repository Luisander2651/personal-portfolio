---
id: 010
title: Navegación
status: active
created: 2026-09-18
updated: 2026-09-18
depends_on: [001, 002, 003, 004, 005, 006, 007, 008, 009]
---

# Navegación

## Objetivo

Añadir a la home una barra de navegación fija en la parte superior, con las iniciales del autor
(que llevan al inicio) y enlaces a las seis secciones de contenido en su orden: "Sobre mí",
"Tecnologías", "Proyectos", "Experiencia", "Formación" e "Idiomas". En móvil los enlaces se
agrupan en un menú desplegable, y la barra indica en qué sección está el visitante. Incluye un
enlace "Saltar al contenido" para quien navega con teclado. El objetivo es que un reclutador
llegue a cualquier sección sin recorrer toda la página y sepa siempre dónde está.

## Historias de usuario

- **HU-1**: Como reclutador, quiero ir directamente a una sección desde una barra siempre
  visible, para no recorrer toda la página.
- **HU-2**: Como visitante que usa teclado o lector de pantalla, quiero saltar la navegación y
  recorrerla con un orden y un foco claros.
- **HU-3**: Como visitante en móvil, quiero abrir y cerrar la lista de secciones sin que ocupe
  la pantalla.
- **HU-4**: Como visitante, quiero ver en qué sección estoy mientras hago scroll.
- **HU-5**: Como visitante, quiero que la navegación sea ligera y accesible, y que funcione sin
  JavaScript.

## Criterios de aceptación

### HU-1

- **CA-1.1**
  - **Dado** el sitio generado con `bun run build`
  - **Cuando** inspecciono `dist/index.html` sin ejecutar JavaScript
  - **Entonces** existe un único `<header>` antes de `main` que contiene un
    `<nav aria-label="Principal">` con una lista de seis enlaces, en este orden y con estos
    textos y destinos: "Sobre mí" → `#sobre-mi`, "Tecnologías" → `#tecnologias`, "Proyectos" →
    `#proyectos`, "Experiencia" → `#experiencia`, "Formación" → `#formacion` e "Idiomas" →
    `#idiomas`
- **CA-1.2**
  - **Dado** la lista de enlaces de la navegación y la home
  - **Cuando** se ejecutan los tests
  - **Entonces** los textos y las anclas de los enlaces se definen en un único lugar (no
    repetidos en el componente), y cada ancla corresponde a un `<section>` de la home con ese
    `id`, en el mismo orden en que las secciones aparecen dentro de `main`
- **CA-1.3**
  - **Dado** la barra de navegación
  - **Cuando** inspecciono su HTML
  - **Entonces** su primer enlace es la marca: muestra las iniciales del campo `name` de la
    colección `profile` (la primera letra de cada palabra, en mayúscula: "LMGV"), su nombre
    accesible es ese nombre completo ("Luis Mario Gutiérrez Valdovinos"), y lleva al inicio de la
    página (`#top`); ningún texto de la marca está incrustado en componentes, de modo que si
    cambia el nombre cambian las iniciales
- **CA-1.4**
  - **Dado** un visitante que hace scroll por la home o salta a una sección desde un enlace
  - **Cuando** la página se desplaza
  - **Entonces** la barra permanece visible en la parte superior en todo momento, y al llegar a
    una sección por su ancla la barra no tapa el `h2` de esa sección (verificación: estilos por
    test y revisión manual)
- **CA-1.5**
  - **Dado** un visitante que pulsa un enlace de la navegación
  - **Cuando** la página va a la sección
  - **Entonces** el desplazamiento es suave sin `prefers-reduced-motion: reduce`, e inmediato
    con `prefers-reduced-motion: reduce`

### HU-2

- **CA-2.1**
  - **Dado** la home
  - **Cuando** un visitante pulsa Tab por primera vez
  - **Entonces** el primer elemento enfocable es un enlace "Saltar al contenido" que lleva a
    `main` (con `id="contenido"`); el enlace no se ve hasta recibir el foco y se ve mientras lo
    tiene
- **CA-2.2**
  - **Dado** un visitante que navega con teclado
  - **Cuando** recorre la cabecera con Tab
  - **Entonces** el orden es: "Saltar al contenido", marca, botón del menú (solo cuando existe)
    y los seis enlaces, antes del contenido; y cada uno muestra un indicador de foco visible
    con los tokens de foco del sistema de diseño

### HU-3

- **CA-3.1**
  - **Dado** un ancho de pantalla inferior a 1024px y JavaScript activo
  - **Cuando** carga la home
  - **Entonces** la lista de enlaces está plegada tras un botón con el texto "Menú",
    `aria-expanded="false"` y `aria-controls` apuntando a la lista; al pulsarlo la lista se
    muestra y `aria-expanded` pasa a `"true"`; y la lista se pliega de nuevo al pulsar el botón
    otra vez, al pulsar Escape (el foco vuelve al botón) o al elegir un enlace
- **CA-3.2**
  - **Dado** un visitante sin JavaScript
  - **Cuando** carga la home con cualquier ancho
  - **Entonces** la lista de enlaces es visible, el botón "Menú" no se muestra y ningún estilo
    oculta los enlaces
- **CA-3.3**
  - **Dado** un ancho de pantalla de 1024px o más
  - **Cuando** carga la home
  - **Entonces** los seis enlaces se muestran en línea en la barra y el botón "Menú" no se
    muestra

### HU-4

- **CA-4.1**
  - **Dado** un visitante con JavaScript activo
  - **Cuando** hace scroll por la home
  - **Entonces** el enlace de la sección que ocupa la zona de lectura fijada en el diseño lleva
    `aria-current="true"` y el estilo de enlace activo; nunca hay más de un enlace activo a la
    vez, y ninguno lo está mientras se ve el hero (verificación: lógica por test y revisión
    manual)
- **CA-4.2**
  - **Dado** un visitante sin JavaScript
  - **Cuando** carga la home
  - **Entonces** ningún enlace tiene `aria-current` y todos llevan a su sección

### HU-5

- **CA-5.1**
  - **Dado** el sitio generado
  - **Cuando** mido el JavaScript de cliente de la home en `dist/`
  - **Entonces** su tamaño total comprimido con gzip es ≤ 3 kB, no depende de ningún paquete y
    solo implementa la animación del hero, el spotlight común, el script común de revelado y el
    script de la navegación (menú y sección activa)
- **CA-5.2**
  - **Dado** los estilos de la navegación
  - **Cuando** se ejecutan los tests
  - **Entonces** solo usan tokens del sistema de diseño (ningún color, tamaño, espaciado o
    duración literal)
- **CA-5.3**
  - **Dado** la home servida con `bun run preview`
  - **Cuando** se ejecuta Lighthouse (móvil)
  - **Entonces** obtiene ≥ 90 en Performance, Accessibility, Best Practices y SEO
- **CA-5.4**
  - **Dado** un visitante con `prefers-reduced-motion: reduce`
  - **Cuando** abre o cierra el menú o cambia la sección activa
  - **Entonces** el cambio ocurre sin animación, con el mismo resultado final

## Contenido

| Texto del enlace | Destino | Sección (spec) |
|------------------|---------|----------------|
| Sobre mí | `#sobre-mi` | 004-about |
| Tecnologías | `#tecnologias` | 005-tech-stack |
| Proyectos | `#proyectos` | 006-projects |
| Experiencia | `#experiencia` | 007-experience ("Experiencia profesional") |
| Formación | `#formacion` | 008-education |
| Idiomas | `#idiomas` | 009-languages |

- Marca: iniciales "LMGV", calculadas a partir del campo `name` de la colección `profile`
  ("Luis Mario Gutiérrez Valdovinos"), que se mantiene completo como nombre accesible; enlaza a
  `#top`.
- Textos de interfaz: "Saltar al contenido", "Menú" y la etiqueta accesible "Principal" de la
  navegación.

## Diseño

Diseño aprobado: [designs/010-navigation/design.md](../../designs/010-navigation/design.md)
· [canvas](https://claude.ai/artifact/4VVgTvHcfeXWZE7X5tMu93) (dirección A · Índice).

Qué debe sentirse: una barra discreta que acompaña sin competir con las secciones, con la
sección activa fácil de ver y un menú móvil que se abre y se cierra con suavidad. Desplazamiento
suave hasta cada sección. El aspecto, la zona de lectura y los tiempos se definen en
`/design-spec`.

## Fuera de alcance

- Enlaces externos en la barra (GitHub, LinkedIn, correo): están en el hero y en el footer
  (spec 011).
- Descarga del CV, selector de idioma o de tema, y buscador.
- Otras páginas: el sitio es de una sola página; la 404 (spec 013) no lleva esta navegación.
- Ocultar la barra al hacer scroll hacia abajo.
- Footer (spec 011) y metadatos SEO (spec 012).

## Registro de decisiones

| Fecha | Tipo | Pregunta / Conflicto | Decisión | Fuente |
|-------|------|----------------------|----------|--------|
| 2026-09-18 | Implícita | Número, slug y enlaces | `010-navigation`; enlaza en orden las anclas fijadas por 004–009 | docs/workflow.md |
| 2026-09-18 | Brecha | Posición de la barra | Fija en la parte superior desde el inicio y durante todo el scroll, compensando su altura al saltar a un ancla | usuario |
| 2026-09-18 | Brecha | Enlaces en móvil | Menú desplegable con botón "Menú" (`aria-expanded`, Escape cierra); sin JavaScript la lista se ve siempre | usuario |
| 2026-09-18 | Brecha | Indicador de sección | Sección activa con `aria-current="true"` y estilo propio, con JavaScript; ninguna sobre el hero | usuario |
| 2026-09-18 | Brecha | Texto de los enlaces | Etiquetas cortas; "Experiencia" abrevia el `h2` "Experiencia profesional" | usuario |
| 2026-09-18 | Brecha | Marca | `profile.name` enlazando al inicio (`#top`) | usuario |
| 2026-09-18 | Brecha | Salto de navegación | Enlace "Saltar al contenido" como primer elemento enfocable, visible solo con foco, hacia `main#contenido` | usuario |
| 2026-09-18 | Brecha | Desplazamiento | Suave; inmediato con reduced motion | usuario |
| 2026-09-18 | Brecha | Otros elementos en la barra | Ninguno: los enlaces externos ya están en el hero y estarán en el footer | usuario |
| 2026-09-18 | Implícita | JavaScript | Presupuesto compartido de la home ≤ 3 kB con gzip, sin dependencias: hero, spotlight común, revelado común y script de la navegación | constitution.md §3, specs/009-languages |
| 2026-09-18 | Implícita | Punto de corte, aspecto, zona de lectura y animaciones | Se fijan en `/design-spec` | constitution.md §6 |
| 2026-09-18 | Diseño | Marca de la barra | Iniciales "LMGV" calculadas de `profile.name` (primera letra de cada palabra, en mayúscula), con el nombre completo como nombre accesible; sustituye al nombre visible completo, que no cabía junto al botón "Menú" | usuario, designs/010-navigation |
| 2026-09-18 | Diseño | Punto de corte del menú | 1024px (punto de corte ancho del sistema): los seis enlaces numerados de la dirección A no caben en línea entre 768px y 1023px | designs/010-navigation, designs/000-design-system |
| 2026-09-18 | Diseño | Composición de la barra | A · Índice: barra completa fija, marca "LMGV" en mono con punto de luz, enlaces mono numerados 01–06 con punto de luz en el activo, menú desplegable por debajo de 1024px, "Saltar al contenido" como etiqueta mono; zona de lectura a un tercio de la ventana; tokens nuevos `--nav-height`, `--color-nav-bg`, `--nav-row-height`, `--nav-marker-size` y `--shadow-nav-marker` a incorporar al sistema | /design-spec |
