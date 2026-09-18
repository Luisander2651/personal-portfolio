---
id: 010
title: Navegación
spec: specs/010-navigation/spec.md
status: approved
canvas: https://claude.ai/artifact/4VVgTvHcfeXWZE7X5tMu93
created: 2026-09-18
updated: 2026-09-18
---

# Diseño — Navegación

## Dirección elegida

**Dirección A · "Índice"**, elegida entre tres exploradas sobre el sistema de diseño aprobado
(A · Índice, B · Cápsula, C · Línea). Sin combinar elementos de B ni C; las descartadas se
conservan en el canvas.

Barra completa y fija arriba, casi opaca, con una línea fina inferior. A la izquierda, la marca
**LMGV** en mono con un cuadrado de luz; a la derecha, los seis enlaces en mono numerados
`01`–`06`. El enlace activo enciende un punto de luz cian.

- **Motivo**: la numeración mono continúa el lenguaje de las rutas `PORTFOLIO / …` de los
  encabezados de sección y da a la barra un aire de índice técnico, con un único detalle de luz.
- **Riesgo asumido**: los números añaden ruido → van en `--color-text-muted` y solo el activo
  cambia a `--color-glow`.

## Pantallas

| Pantalla | Artboard móvil | Artboard escritorio | Criterios de la spec que cubre |
|----------|----------------|---------------------|--------------------------------|
| Barra sobre el hero, sin enlace activo; "Saltar al contenido" con foco | `A · Índice — Móvil 390 cerrado` | `A · Índice — Escritorio 1440` (franja 1) | CA-1.1, CA-1.3, CA-2.1, CA-4.1 |
| Barra sobre una sección con enlace activo, hover y foco | `A · Índice — Móvil 390 menú abierto` | `A · Índice — Escritorio 1440` (franja 2) | CA-1.4, CA-2.2, CA-3.1, CA-3.3, CA-4.1 |
| Menú móvil y cambio de enlace activo | — | `Movimiento — Menú y enlace activo` (fila del menú y fila de A) | CA-3.1, CA-5.4 |

## Composición y jerarquía

- **Cabecera** (`header`, antes de `main`), fija en la parte superior (`position: fixed` o
  `sticky`) por encima del contenido, alto `--nav-height`, fondo `--color-nav-bg` (sin
  `backdrop-filter`), borde inferior `--border-width` `--color-border`. Contenido alineado con
  el de las secciones: ancho máximo `--section-max-width` y margen lateral `--space-gutter`.
- **Orden**: "Saltar al contenido" (fuera de la vista hasta recibir foco) → marca → botón
  "Menú" (por debajo de 1024px) → `nav` con la lista de enlaces.
- **Marca** (enlace a `#top`): cuadrado de luz de `--nav-marker-size` en `--color-glow` con
  `--shadow-nav-marker`, y las iniciales con `--font-mono`, `--text-small-size`, peso
  `--text-h3-weight` y tracking `--text-mono-label-tracking`, en `--color-text`, separados
  `--space-2`. El nombre completo va como texto accesible (oculto a la vista). Alto mínimo
  `--control-height`.
- **Enlaces** (desde 1024px, en línea a la derecha, separación `--space-1`): cada uno con alto
  `--control-height`, padding horizontal `--space-2`, `--font-mono` y `--text-small-size`, en
  fila: marcador (hueco de `--nav-marker-size`), número (`01`–`06`) y texto, separados
  `--space-2`.
  - **Reposo**: número `--color-text-muted`, texto `--color-text-secondary`, sin marcador.
  - **Hover**: número `--color-link`, texto `--color-text`.
  - **Activo** (`aria-current="true"`): marcador visible (`--color-glow` + `--shadow-nav-marker`),
    número `--color-glow`, texto `--color-text`.
  - **Foco**: `outline: var(--focus-ring)`, `outline-offset: var(--focus-ring-offset)`, radio
    `--radius-sm`.
- **Por debajo de 1024px**: la barra muestra la marca y el botón **"Menú"** (alto
  `--control-height`, borde `--color-border-strong`, fondo `--color-tag-bg`, `--font-mono`,
  icono de dos líneas que pasa a una X cuando está abierto; abierto, borde con
  `--color-glow`). La lista es un panel bajo la barra, a todo el ancho, fondo
  `--color-nav-bg`, borde inferior `--color-border`: filas de `--nav-row-height` separadas por
  `--border-width` `--color-border`, con el mismo marcador, número y texto (`--text-body-size`).
- **Sin JavaScript**: el botón no se muestra y la lista es visible (en línea desde 1024px; por
  debajo, bajo la barra), sin estilos que la oculten.
- **"Saltar al contenido"**: enlace a `#contenido` (el `main`), fuera de la vista hasta recibir
  foco; con foco aparece arriba a la izquierda, por encima de la barra: etiqueta mono
  (`--font-mono`, `--text-small-size`) con fondo `--color-surface`, borde
  `--color-border-strong`, `--radius-sm`, alto `--control-height`, padding `--space-4`, punto de
  luz (`--color-glow` + `--shadow-nav-marker`), flecha "↓" en `--color-text-muted`, texto
  `--color-text`, y el foco del sistema.
- **Anclas**: cada sección con ancla deja un margen superior de desplazamiento
  (`scroll-margin-top`) igual a `--nav-height`, para que la barra no tape su `h2`.
- **Zona de lectura** (sección activa): la sección que cruza una línea horizontal situada a un
  tercio de la altura de la ventana. Mientras esa línea cae en el hero, ningún enlace está
  activo.
- **Momento protagonista**: ninguno; la barra acompaña sin competir.

## Componentes

- **Barra de navegación** (nuevo): cabecera, marca, botón "Menú", lista de enlaces y enlace
  "Saltar al contenido", con la anatomía anterior.
- **Enlace de navegación** (nuevo en el sistema): marcador, número mono y texto; estados reposo,
  hover, activo y foco.
- **Botón "Menú"**: variante mono del botón secundario del sistema, con icono inline de trazo.
- Iconos: SVG inline de trazo (`currentColor`), decorativos (`aria-hidden`).

## Especificación de movimiento

### M-1 — Apertura y cierre del menú móvil

- **Disparador**: pulsar "Menú" (abre o cierra), pulsar Escape o elegir un enlace (cierra), por
  debajo de 1024px con JavaScript activo.
- **Elementos**: el panel de la lista.
- **Propiedades**: `opacity` y `transform` (`translateY(calc(-1 * var(--space-2)))` → `0`).
- **Duración / easing**: `--duration-fast` / `--ease-out`.
- **Estado inicial → final**: plegado (`opacity: 0`, desplazado y no interactivo) → abierto
  (`opacity: 1`, en su sitio); el cierre recorre lo mismo a la inversa.
- **Secuencia / stagger**: ninguna.
- **Implementación**: CSS con el estado `aria-expanded` del botón; un script nativo mínimo
  cambia `aria-expanded`, cierra con Escape (devolviendo el foco al botón) y al elegir un enlace.
  Comparte script con M-2.
- **Justificación de Motion**: no aplica (sin Motion).
- **Reduced motion**: el panel aparece y desaparece al instante, sin desplazamiento.
- **Sin JavaScript**: sin botón; la lista siempre visible.
- **Fotogramas en canvas**: `Movimiento — Menú y enlace activo`, fila del menú (1 · cerrado,
  2 · pulsar, 3 · t = 75 ms, 4 · abierto, Reduced motion).

### M-2 — Cambio de enlace activo

- **Disparador**: la sección que cruza la zona de lectura cambia al hacer scroll (o al saltar a
  un ancla), con JavaScript activo.
- **Elementos**: marcador, número y texto del enlace que deja de estar activo y del nuevo.
- **Propiedades**: `opacity` del marcador (0 ↔ 1) y `color` del número y el texto.
- **Duración / easing**: `--duration-base` / `--ease-out` para el marcador; `--duration-fast`
  para los colores.
- **Estado inicial → final**: activo en la sección anterior → activo en la nueva; nunca dos a la
  vez; ninguno sobre el hero.
- **Implementación**: un `IntersectionObserver` en el script de la navegación marca
  `aria-current="true"` en el enlace; el estilo cuelga de ese atributo.
- **Justificación de Motion**: no aplica (sin Motion).
- **Reduced motion**: el cambio es inmediato, sin transición.
- **Sin JavaScript**: ningún enlace activo.
- **Fotogramas en canvas**: `Movimiento — Menú y enlace activo`, fila "A · cambio de activo"
  (inicio, t = 150 ms, final).

### M-3 — Desplazamiento a la sección

- **Disparador**: pulsar un enlace de la barra, la marca o "Saltar al contenido".
- **Propiedades**: desplazamiento del documento (`scroll-behavior: smooth`).
- **Implementación**: CSS en el documento.
- **Reduced motion**: `scroll-behavior: auto` (salto inmediato).

**Coste total**: un script nuevo pequeño y sin dependencias (menú + sección activa); el
JavaScript de la home debe seguir ≤ 3 kB con gzip (hoy 1,97 kB).

## Cambios a incorporar al sistema

| Token | Valor | Uso |
|-------|-------|-----|
| `--nav-height` | `60px` (móvil) · `64px` (desde 768px) | Alto de la barra y `scroll-margin-top` de las secciones |
| `--color-nav-bg` | `rgba(5, 7, 13, 0.92)` | Fondo de la barra y del panel del menú |
| `--nav-row-height` | `56px` | Filas del menú móvil |
| `--nav-marker-size` | `6px` | Punto de luz del enlace activo y de la marca |
| `--shadow-nav-marker` | `0 0 10px rgba(34, 211, 238, 0.8)` | Halo del punto de luz |

Patrón nuevo: **enlace de navegación** (marcador, número mono y texto; reposo, hover, activo y
foco), y **barra de navegación** con menú desplegable por debajo de 1024px.

## Accesibilidad

- **Contraste** (sobre `--color-nav-bg` ≈ `--color-bg`): texto `--color-text-secondary` 13.6:1,
  número `--color-text-muted` 6.9:1, activo `--color-glow` 11.1:1, hover `--color-link` 9.1:1;
  "Saltar al contenido" `--color-text` sobre `--color-surface` 16.2:1.
- **Estructura**: `header` → `nav aria-label="Principal"` → lista `ul`/`li`/`a`; el activo con
  `aria-current="true"`.
- **Marca**: texto visible "LMGV" y nombre completo como nombre accesible.
- **Menú**: `button` real con `aria-expanded` y `aria-controls`; Escape cierra y devuelve el
  foco; objetivo táctil ≥ 44px (`--control-height`).
- **Teclado**: orden "Saltar al contenido" → marca → "Menú" → enlaces → contenido; foco visible
  del sistema en todos.
- **Decorativos ocultos**: marcadores e iconos del botón.
- **Sin JavaScript y reduced motion**: todo visible y utilizable, sin animación.

## Anti-clichés

- **Navegación genérica de plantilla**: la numeración mono y el punto de luz son propios de la
  dirección, en continuidad con las rutas de sección.
- **Animaciones en todo sin jerarquía**: solo dos transiciones cortas de opacity y transform.
- **Gradiente morado-rosa**: solo cian y azules del sistema.
- **Métricas inventadas**: ninguna; la marca deriva de `profile.name`.

## Registro de decisiones

| Fecha | Tipo | Pregunta / Conflicto | Decisión | Fuente |
|-------|------|----------------------|----------|--------|
| 2026-09-18 | Brecha | Qué explorar | 3 direcciones: A · Índice, B · Cápsula (sin `backdrop-filter`, por el tirón de scroll de la spec 004), C · Línea | usuario |
| 2026-09-18 | Brecha | Marca en móvil | "LMGV" (iniciales de `profile.name`) en móvil y escritorio, con el nombre completo como nombre accesible; refinada en la spec 010 | usuario |
| 2026-09-18 | Diseño | Dirección de la barra | A · Índice, sin combinar | usuario |
| 2026-09-18 | Brecha | "Saltar al contenido" | Se mantiene la función, con el estilo de A (etiqueta mono con punto de luz) en lugar del botón primario | usuario |
| 2026-09-18 | Implícita | Punto de corte del menú | 1024px: los seis enlaces numerados no caben en línea entre 768px y 1023px; refinado en la spec 010 | designs/000-design-system |
| 2026-09-18 | Implícita | Zona de lectura | Línea a un tercio de la altura de la ventana; ningún activo sobre el hero | spec 010 CA-4.1 |
