---
id: "000"
title: Sistema de diseño
status: approved
canvas: https://claude.ai/code/artifact/7951e0c7-1841-4152-9d8e-8752078f7990
created: 2026-09-13
updated: 2026-09-19
---

# Sistema de diseño

## Dirección elegida

**Dirección A · "Luz en la oscuridad"**, elegida entre tres exploradas en el canvas
(A · Luz en la oscuridad, B · Terminal refinada, C · Editorial técnico).

La luz es el material: fondo negro profundo con grid fino, azul como color de marca y
cian como luz. El glow y los bordes luminosos se reservan para lo interactivo y para el
único momento protagonista (hero código → tarjeta). No se combinaron elementos de B ni C.

- **Motivo**: es la dirección más fiel a "tech premium" de `creative-direction.md`; el
  spotlight y los bordes luminosos son naturales en ella.
- **Riesgo asumido**: el glow cansa si se abusa → acotado por las [reglas de uso](#reglas-de-uso).
- **Solo tema oscuro**.

Artboards de referencia en el canvas (página "Sistema · Dirección A (aprobada)"):
`A · Luz en la oscuridad — Sistema · escritorio`, `A · Luz en la oscuridad — Móvil`,
`A · Luz en la oscuridad — Hero código → tarjeta`.

## Convenciones de tokens

Todas las tablas de tokens de este documento usan las columnas
`Token | Modo | Móvil | Escritorio | Uso`, con estas reglas:

- **Token**: nombre exacto de la variable CSS global.
- **Valor**: CSS exacto, literal, tal como se declara (sin prosa ni aproximaciones).
- **Modo**:
  - `fijo`: un único valor en la columna **Móvil**; **Escritorio** vale `—`.
  - `fluido`: interpolación lineal según el ancho de viewport entre **Móvil** (a 390px, mínimo)
    y **Escritorio** (a 1440px, máximo); fuera de ese rango se queda en el extremo.
  - `768`: vale **Móvil** por debajo de 768px de ancho y **Escritorio** desde 768px.
- **Reduced motion**: con `prefers-reduced-motion: reduce`, todos los tokens `--duration-*`
  y `--stagger` valen `0ms`.
- Un token cuyo valor referencia otro token lo hace con `var(--token)`.

### Constantes (no son variables CSS)

| Constante | Valor | Uso |
|-----------|-------|-----|
| Breakpoint | `768px` | Cambio de valores en modo `768` (`min-width: 768px`) |
| Breakpoint ancho | `1024px` | Composiciones en fila que no caben entre 768px y 1023px (panel destacado y fila de proyectos de la spec 006); los tokens siguen cambiando solo en `768px` |
| Viewport mínimo de interpolación | `390px` | Extremo inferior del modo `fluido` |
| Viewport máximo de interpolación | `1440px` | Extremo superior del modo `fluido` |

## Color

Contraste medido (WCAG 2.x) sobre `--color-bg` salvo que se indique otro fondo.
Todo texto de cuerpo ≥ 4.5:1.

### Base

| Token | Modo | Móvil | Escritorio | Uso |
|-------|------|-------|------------|-----|
| `--color-bg` | fijo | `#05070D` | — | Fondo base de página |
| `--color-surface` | fijo | `#0B0F1A` | — | Cards, paneles |
| `--color-surface-raised` | fijo | `#121826` | — | Elementos elevados sobre surface |
| `--color-surface-sunken` | fijo | `#080B14` | — | Bloques de código |
| `--color-border` | fijo | `#1E2636` | — | Bordes por defecto, separadores |
| `--color-border-strong` | fijo | `#263047` | — | Borde de botón secundario |
| `--color-text` | fijo | `#E6EDF7` | — | Texto principal, titulares · 17.1:1 |
| `--color-text-secondary` | fijo | `#C9D4E5` | — | Texto de apoyo sobre cards, código · 13.5:1 |
| `--color-text-muted` | fijo | `#8B97AD` | — | Metadatos, descripciones, labels · 6.8:1 |
| `--color-text-disabled` | fijo | `#5B6578` | — | Solo controles deshabilitados (exentos de contraste) |

### Marca y luz

| Token | Modo | Móvil | Escritorio | Uso |
|-------|------|-------|------------|-----|
| `--color-accent` | fijo | `#3B82F6` | — | Azul de marca, botón primario · 5.5:1 |
| `--color-accent-hover` | fijo | `#5B97F8` | — | Botón primario en hover |
| `--color-accent-active` | fijo | `#2F6FDB` | — | Botón primario activo |
| `--color-accent-subtle` | fijo | `rgba(59, 130, 246, 0.1)` | — | Fondo de botón secundario activo |
| `--color-on-accent` | fijo | `#030712` | — | Texto sobre `--color-accent` · 5.5:1 sobre accent |
| `--color-link` | fijo | `#7DB0FF` | — | Enlaces · 9.1:1 |
| `--color-link-hover` | fijo | `#A9CBFF` | — | Enlaces en hover |
| `--color-glow` | fijo | `#22D3EE` | — | Luz: anillo de foco, bordes luminosos, caret, funciones en código · 11.1:1 |
| `--color-spotlight` | fijo | `rgba(59, 130, 246, 0.18)` | — | Luz radial del spotlight |
| `--color-selection-bg` | fijo | `rgba(59, 130, 246, 0.35)` | — | Fondo de la selección de texto |
| `--color-selection-text` | fijo | `var(--color-text)` | — | Texto seleccionado |

### Estados (semánticos)

Solo para estados de proyectos/formación. **Siempre acompañados de texto**, nunca solo color.

| Token | Modo | Móvil | Escritorio | Uso |
|-------|------|-------|------------|-----|
| `--color-warning` | fijo | `#F5B84A` | — | Texto y punto de "En curso" · 11.4:1 |
| `--color-warning-bg` | fijo | `rgba(245, 184, 74, 0.1)` | — | Fondo del badge "En curso" |
| `--color-warning-border` | fijo | `rgba(245, 184, 74, 0.3)` | — | Borde del badge "En curso" |
| `--color-success` | fijo | `#4ADE80` | — | Texto y punto de "Finalizado" · 11.6:1 |
| `--color-success-bg` | fijo | `rgba(74, 222, 128, 0.1)` | — | Fondo del badge "Finalizado" |
| `--color-success-border` | fijo | `rgba(74, 222, 128, 0.3)` | — | Borde del badge "Finalizado" |

### Componentes y código

| Token | Modo | Móvil | Escritorio | Uso |
|-------|------|-------|------------|-----|
| `--color-secondary-bg` | fijo | `rgba(230, 237, 247, 0.03)` | — | Fondo de botón secundario |
| `--color-disabled-bg` | fijo | `#111726` | — | Fondo de control deshabilitado |
| `--color-disabled-border` | fijo | `#1B2231` | — | Borde de control deshabilitado |
| `--color-tag-bg` | fijo | `#0F1524` | — | Fondo de etiqueta de tecnología |
| `--color-tag-text` | fijo | `#B7C3D6` | — | Texto de etiqueta · 11.3:1 sobre bg |
| `--color-code-keyword` | fijo | `#7DB0FF` | — | Palabras clave · 9.1:1 |
| `--color-code-string` | fijo | `#8BE3F2` | — | Cadenas |
| `--color-code-function` | fijo | `var(--color-glow)` | — | Funciones |
| `--color-grid-line` | fijo | `rgba(148, 163, 184, 0.055)` | — | Líneas del grid de fondo (decorativo) |

## Tipografía

| Token | Modo | Móvil | Escritorio | Uso |
|-------|------|-------|------------|-----|
| `--font-sans` | fijo | `var(--font-geist)` | — | Contenido y titulares |
| `--font-mono` | fijo | `var(--font-geist-mono)` | — | Código, etiquetas, metadatos |

### Carga de fuentes

Las familias se sirven **autoalojadas** (constitución §7). La carga de fuentes registra una
variable CSS por familia cuyo valor es la familia autoalojada seguida de sus fallbacks; esas
variables las genera la carga de fuentes y **no se declaran en los estilos globales**.

| Familia | Variable generada | Pesos | `font-display` | Fallbacks (en orden) |
|---------|-------------------|-------|----------------|----------------------|
| Geist | `--font-geist` | `400`, `500`, `600` | `swap` | `ui-sans-serif`, `system-ui`, `sans-serif` |
| Geist Mono | `--font-geist-mono` | `400`, `500` | `swap` | `ui-monospace`, `SFMono-Regular`, `Menlo`, `monospace` |

Licencia OFL. La carga de fuentes puede anteponer a los fallbacks una familia de fallback
con métricas ajustadas; los fallbacks de la tabla deben aparecer en ese orden. El canvas
carga las fuentes desde Google Fonts solo para previsualizar.

### Escala

| Token | Modo | Móvil | Escritorio | Uso |
|-------|------|-------|------------|-----|
| `--text-display-size` | fluido | `40px` | `72px` | Display (solo donde una spec lo pida) |
| `--text-display-line-height` | 768 | `1.05` | `1.02` | |
| `--text-display-weight` | fijo | `600` | — | |
| `--text-display-tracking` | fijo | `-0.03em` | — | |
| `--text-h1-size` | fluido | `30px` | `48px` | `h1` |
| `--text-h1-line-height` | 768 | `1.15` | `1.1` | |
| `--text-h1-weight` | fijo | `600` | — | |
| `--text-h1-tracking` | fijo | `-0.02em` | — | |
| `--text-h2-size` | fluido | `24px` | `32px` | `h2` |
| `--text-h2-line-height` | fijo | `1.2` | — | |
| `--text-h2-weight` | fijo | `600` | — | |
| `--text-h2-tracking` | fijo | `-0.01em` | — | |
| `--text-h3-size` | fluido | `19px` | `22px` | `h3` |
| `--text-h3-line-height` | fijo | `1.3` | — | |
| `--text-h3-weight` | fijo | `600` | — | |
| `--text-body-size` | fluido | `16px` | `17px` | `p`, body |
| `--text-body-line-height` | 768 | `1.6` | `1.65` | |
| `--text-body-weight` | fijo | `400` | — | |
| `--text-small-size` | fijo | `14px` | — | `small`, metadatos |
| `--text-small-line-height` | fijo | `1.5` | — | |
| `--text-mono-label-size` | fluido | `11px` | `12px` | Etiquetas mono en mayúsculas |
| `--text-mono-label-line-height` | fijo | `1.4` | — | |
| `--text-mono-label-weight` | fijo | `500` | — | |
| `--text-mono-label-tracking` | fijo | `0.08em` | — | |
| `--text-mono-label-transform` | fijo | `uppercase` | — | |
| `--text-code-size` | fluido | `12px` | `14px` | `code`, bloques de código |
| `--text-code-line-height` | fijo | `1.75` | — | |

## Espaciado, radios y bordes

### Espaciado

| Token | Modo | Móvil | Escritorio | Uso |
|-------|------|-------|------------|-----|
| `--space-1` | fijo | `4px` | — | |
| `--space-2` | fijo | `8px` | — | |
| `--space-3` | fijo | `12px` | — | |
| `--space-4` | fijo | `16px` | — | |
| `--space-5` | fijo | `24px` | — | |
| `--space-6` | fijo | `32px` | — | |
| `--space-7` | fijo | `48px` | — | |
| `--space-8` | fijo | `88px` | — | |
| `--space-section` | fluido | `56px` | `88px` | Separación entre secciones |
| `--space-gutter` | fluido | `24px` | `72px` | Margen lateral de página |

### Radios

| Token | Modo | Móvil | Escritorio | Uso |
|-------|------|-------|------------|-----|
| `--radius-sm` | fijo | `6px` | — | Etiquetas |
| `--radius-md` | fijo | `10px` | — | Botones, iconos enmarcados |
| `--radius-lg` | fijo | `16px` | — | Cards, paneles, bloque de código, tarjeta del hero |
| `--radius-full` | fijo | `999px` | — | Badges de estado |

### Bordes, luz y foco

| Token | Modo | Móvil | Escritorio | Uso |
|-------|------|-------|------------|-----|
| `--border-width` | fijo | `1px` | — | Todos los bordes |
| `--border-glow` | fijo | `linear-gradient(135deg, var(--color-glow) 0%, var(--color-accent) 40%, var(--color-border) 75%)` | — | Borde luminoso (card en hover, tarjeta del hero) |
| `--shadow-glow-accent` | fijo | `0 0 0 1px rgba(125, 176, 255, 0.45), 0 10px 30px -8px rgba(59, 130, 246, 0.6)` | — | Botón primario en hover |
| `--shadow-glow-secondary` | fijo | `0 0 24px -6px rgba(59, 130, 246, 0.55)` | — | Botón secundario en hover |
| `--shadow-glow-soft` | fijo | `0 0 48px -12px rgba(34, 211, 238, 0.35)` | — | Card en hover |
| `--shadow-glow-hero` | fijo | `0 0 70px -18px rgba(34, 211, 238, 0.45)` | — | Tarjeta del hero |
| `--shadow-glow-text` | fijo | `0 0 60px rgba(34, 211, 238, 0.45), 0 0 18px rgba(34, 211, 238, 0.25)` | — | Halo del texto protagonista (el "404") |
| `--focus-ring` | fijo | `2px solid var(--color-glow)` | — | `outline` de foco visible (contraste 11.1:1) |
| `--focus-ring-offset` | fijo | `3px` | — | `outline-offset` del foco visible |

### Fondo de página

| Token | Modo | Móvil | Escritorio | Uso |
|-------|------|-------|------------|-----|
| `--grid-size` | 768 | `32px` | `48px` | Separación de las líneas del grid de fondo |
| `--page-halo` | 768 | `radial-gradient(420px 260px at 20% -6%, rgba(59, 130, 246, 0.22), transparent 70%)` | `radial-gradient(900px 420px at 18% -4%, rgba(59, 130, 246, 0.2), transparent 70%)` | Halo superior estático |

El fondo de página combina, de arriba abajo: `--page-halo`, líneas horizontales y verticales
de `--border-width` en `--color-grid-line` cada `--grid-size`, y `--color-bg`.

- **Halo**: se pinta una sola vez (`no-repeat`), anclado al viewport (`fixed`): permanece en la
  parte superior de la pantalla al hacer scroll.
- **Grid**: se repite en toda la página y se desplaza con el contenido (`repeat`, `scroll`).

### Controles y componentes

| Token | Modo | Móvil | Escritorio | Uso |
|-------|------|-------|------------|-----|
| `--control-height` | 768 | `48px` | `44px` | Alto de botones (objetivo táctil ≥ 44px) |
| `--control-padding-x` | fijo | `18px` | — | Padding horizontal de botones |
| `--control-font-size` | 768 | `16px` | `15px` | Tamaño de etiqueta de botones |
| `--control-font-weight` | fijo | `500` | — | Peso de etiqueta de botones |
| `--tag-height` | fijo | `26px` | — | Alto de etiquetas y badges |
| `--tag-padding-x` | fijo | `10px` | — | Padding horizontal de etiquetas y badges |
| `--tag-font-size` | fijo | `12px` | — | Tamaño de texto de etiquetas y badges |
| `--status-dot-size` | fijo | `6px` | — | Punto de badge de estado |
| `--card-padding` | 768 | `20px` | `28px` | Padding de cards |
| `--card-gap` | 768 | `14px` | `18px` | Separación interna de cards |
| `--code-padding` | 768 | `14px 16px` | `18px 22px` | Padding del cuerpo del bloque de código |
| `--icon-size-sm` | fijo | `18px` | — | Iconos en botones y tarjeta del hero |
| `--icon-size-md` | fijo | `22px` | — | Iconos enmarcados |
| `--icon-stroke` | fijo | `1.75` | — | Grosor de trazo de iconos |
| `--icon-frame-size` | 768 | `48px` | `52px` | Marco de icono (objetivo táctil ≥ 44px) |

### Hero

| Token | Modo | Móvil | Escritorio | Uso |
|-------|------|-------|------------|-----|
| `--hero-min-height` | fijo | `100svh` | — | Alto mínimo del hero (pantalla completa) |
| `--hero-card-max-width` | fijo | `560px` | — | Ancho máximo de la tarjeta del hero y del hueco del código |
| `--hero-card-padding` | 768 | `24px` | `40px` | Padding de la tarjeta del hero |
| `--hero-card-gap` | 768 | `18px` | `24px` | Separación entre bloques de la tarjeta del hero |
| `--hero-caret-width` | fijo | `8px` | — | Ancho del caret de escritura |
| `--hero-caret-height` | fijo | `16px` | — | Alto del caret de escritura |

### Secciones

| Token | Modo | Móvil | Escritorio | Uso |
|-------|------|-------|------------|-----|
| `--section-max-width` | fijo | `1120px` | — | Ancho máximo del contenido de las secciones |
| `--section-header-gap` | 768 | `24px` | `32px` | Separación entre el encabezado de sección y su contenido |

### Sobre mí

| Token | Modo | Móvil | Escritorio | Uso |
|-------|------|-------|------------|-----|
| `--about-panel-padding` | 768 | `24px 20px 28px` | `40px 48px 48px` | Padding del cuerpo del panel `about.md` |
| `--about-panel-gap` | 768 | `32px` | `40px` | Separación entre resumen, separador y grupos |
| `--about-groups-gap` | 768 | `32px` | `48px` | Separación entre los grupos |
| `--about-text-max-width` | fijo | `72ch` | — | Ancho máximo de lectura del resumen |

### Tecnologías

| Token | Modo | Móvil | Escritorio | Uso |
|-------|------|-------|------------|-----|
| `--tech-card-min-width` | fijo | `240px` | — | Ancho mínimo de las cards de la segunda fila del mosaico de tecnologías |
| `--tech-item-min-width` | fijo | `160px` | — | Ancho mínimo de columna de los ítems dentro de una card de tecnologías |

### Experiencia

| Token | Modo | Móvil | Escritorio | Uso |
|-------|------|-------|------------|-----|
| `--experience-meta-width` | fijo | `220px` | — | Ancho de la columna de periodo y duración en la fila de experiencia (desde 768px) |

### Navegación

| Token | Modo | Móvil | Escritorio | Uso |
|-------|------|-------|------------|-----|
| `--nav-height` | 768 | `60px` | `64px` | Alto de la barra de navegación y `scroll-margin-top` de las secciones con ancla |
| `--color-nav-bg` | fijo | `rgba(5, 7, 13, 0.92)` | — | Fondo de la barra de navegación (el panel del menú usa `--color-bg`, opaco) |
| `--nav-row-height` | fijo | `56px` | — | Filas del menú de navegación por debajo de 1024px |
| `--nav-marker-size` | fijo | `6px` | — | Punto de luz del enlace activo y de la marca |
| `--shadow-nav-marker` | fijo | `0 0 10px rgba(34, 211, 238, 0.8)` | — | Halo del punto de luz de la navegación |

### Página 404

| Token | Modo | Móvil | Escritorio | Uso |
|-------|------|-------|------------|-----|
| `--not-found-code-size` | fluido | `112px` | `208px` | Tamaño del "404" de la página no encontrada |

## Componentes base

Referencia: artboard `A · Luz en la oscuridad — Sistema · escritorio`, sección 04, y
`A · … — Móvil`, sección Componentes. Todos los valores son tokens.

### Botón primario

- **Anatomía**: etiqueta `--font-sans`, `--control-font-size`, `--control-font-weight`;
  icono opcional `--icon-size-sm` a la izquierda con separación `--space-2`; alto
  `--control-height`; padding horizontal `--control-padding-x`; `--radius-md`.
- **Reposo**: fondo `--color-accent`, texto `--color-on-accent`.
- **Hover**: fondo `--color-accent-hover` + `--shadow-glow-accent`.
- **Foco**: `outline: var(--focus-ring)`, `outline-offset: var(--focus-ring-offset)`.
- **Activo**: fondo `--color-accent-active`, desplazamiento vertical de `1px`.
- **Deshabilitado**: fondo `--color-disabled-bg`, texto `--color-text-disabled`, borde
  `--color-disabled-border`, sin sombra.

### Botón secundario

- **Anatomía**: igual al primario; fondo `--color-secondary-bg`, borde `--border-width`
  `--color-border-strong`, texto `--color-text`.
- **Hover**: borde `--color-accent` + `--shadow-glow-secondary`.
- **Foco**: como el primario. **Activo**: fondo `--color-accent-subtle`.
  **Deshabilitado**: como el primario.

### Enlace

- **Reposo**: `--color-link`, sin subrayado.
- **Hover**: `--color-link-hover`, subrayado `--color-glow` separado `--space-1`; flecha
  externa `--icon-size-sm` si sale del sitio.
- **Foco**: como el botón primario.

### Etiqueta de tecnología

- `--font-mono`, `--text-mono-label-weight`, `--tag-font-size`, alto `--tag-height`,
  padding `--tag-padding-x`, `--radius-sm`, fondo
  `--color-tag-bg`, borde `--border-width` `--color-border`, texto `--color-tag-text`.
  Sin estados interactivos.

### Badge de estado

- `--font-mono`, `--text-mono-label-weight`, `--tag-font-size`, alto `--tag-height`,
  padding `--tag-padding-x`, `--radius-full`, separación `--space-2`.
- Punto de `--status-dot-size` del color del estado.
- "En curso": texto y punto `--color-warning`, fondo `--color-warning-bg`, borde
  `--color-warning-border`; el punto lleva un halo `0 0 8px` de `--color-warning`.
- "Finalizado": texto y punto `--color-success`, fondo `--color-success-bg`, borde
  `--color-success-border`.

### Card de proyecto

- **Anatomía**: `--color-surface`, borde `--border-width` `--color-border`, `--radius-lg`,
  padding `--card-padding`, separación `--card-gap`. Orden: fila label mono + badge de
  estado → título `h3` → descripción `--text-body-size` en `--color-text-muted` →
  etiquetas de stack con separación `--space-2`.
- **Hover (puntero fino)**: `--border-glow` + `--shadow-glow-soft` + spotlight radial de
  `--color-spotlight` (P-2); flecha externa `--color-glow` junto al título si la card enlaza.
- **Foco (`:focus-visible` / `:focus-within`)**: mismo tratamiento que hover sin spotlight,
  más el foco visible.
- **Táctil (`hover: none`)**: al tocar, `--border-glow` + `--shadow-glow-soft`; sin spotlight.
- **Cards sin enlace** (spec 006): no tienen estado de foco y en táctil no muestran efecto, como
  las cards de categoría de la spec 005.
- **Jerarquía**: las secciones de proyectos no deben repetir cards idénticas en grid
  (ver `anti-cliches.md`); la variación se define en cada spec.

### Fila de experiencia

- **Anatomía**: padding `--card-padding` en vertical y `--space-5` en horizontal, con dos
  variantes según el ancho:
  - **Desde 768px**: card del sistema — `--color-surface`, borde `--border-width`
    `--color-border` y `--radius-lg`; filas consecutivas separadas `--space-4`. Dos columnas:
    `--experience-meta-width` para el periodo y la duración, y el resto para el contenido, con
    separación `--space-6`.
  - **Por debajo de 768px**: sin superficie propia, entre bordes superior e inferior de
    `--border-width` `--color-border` (las filas consecutivas comparten borde) y en una sola
    columna.
- **Contenido**: periodo y duración en `--font-mono` con `--text-mono-label-*` y
  `--color-text-muted`; título `h3` con la organización; línea de apoyo con `--text-body-*` en
  `--color-text-secondary`; lista de logros como en la card de proyecto.
- **Hover (puntero fino)**: el spotlight (P-2) añade la luz, el borde `--border-glow` y la sombra
  `--shadow-glow-soft`; en móvil no aplica (sin puntero fino).
- **Foco y táctil**: sin estados propios, como las cards sin enlace (spec 006).

### Bloque de código

- `--color-surface-sunken`, borde `--border-width` `--color-border`, `--radius-lg`,
  `--font-mono`, `--text-code-size`, `--text-code-line-height`.
- Cabecera de una línea con nombre de archivo y lenguaje en `--color-text-muted`, padding
  `--space-3` vertical y `--space-4` horizontal, separada por borde inferior.
- Cuerpo con padding `--code-padding`.
- Colores de sintaxis: `--color-code-keyword`, `--color-code-string`,
  `--color-code-function`; resto `--color-text-secondary`.
- Por debajo de 768px el código hace `pre-wrap` (sin scroll horizontal).

### Iconografía

- Iconos de línea en cuadrícula de 24 unidades, trazo `--icon-stroke`, extremos y uniones
  redondeados, SVG inline (sin librerías). Set base: GitHub, LinkedIn, correo, flecha externa.
- Icono enmarcado: marco `--icon-frame-size`, icono `--icon-size-md`, `--radius-md`, borde
  `--border-width` `--color-border`, color `--color-text-secondary`; la flecha externa
  usa `--color-glow`.
- Iconos genéricos de línea añadidos por la spec 005: taza, tabla, llaves, flechas
  bidireccionales, enlace con flecha saliente y llave (trazados del canvas de la spec 005).
- **Excepción · logos de tecnología**: solo en la sección de tecnologías se usan logos de
  Simple Icons (licencia CC0) copiados al proyecto con su fuente y licencia anotadas; son
  marcas rellenas en un solo color del sistema (`currentColor`), nunca con colores de marca.

### Encabezado de sección

Patrón común de las secciones de la home (specs 004–009); cada sección aporta su ancla.
Referencia: artboard `B · about.md — Escritorio 1440` y `— Móvil 390` del canvas de la spec 004.

- **Anatomía**: columna con separación `--space-3`:
  1. **Ruta** (decorativa, oculta a lectores de pantalla): fila con separación `--space-2` de
     `portfolio` en `--color-text-muted`, `/` en `--color-border-strong` y el ancla sin `#`
     en `--color-text-secondary`; tipografía `--text-mono-label-*` (mayúsculas).
  2. **`h2`**: tokens `--text-h2-*`, color `--color-text`; es el nombre accesible de la sección
     (`aria-labelledby`).
- Separación con el contenido de la sección: `--section-header-gap`. Contenido de la sección
  con ancho máximo `--section-max-width`.
- **Estados**: ninguno (no interactivo).
- **Variación entre secciones**: el encabezado es común; el layout del contenido varía en cada
  sección (ver `anti-cliches.md`).

### Barra de navegación

- **Cabecera** fija arriba por encima del contenido, alto `--nav-height`, fondo `--color-nav-bg`
  (sin `backdrop-filter`) y borde inferior `--border-width` `--color-border`; contenido con
  `--section-max-width` y `--space-gutter`.
- **Marca**: punto de luz de `--nav-marker-size` en `--color-glow` con `--shadow-nav-marker` y
  las iniciales en `--font-mono`; el nombre completo como nombre accesible.
- **Desde 1024px** (breakpoint ancho): enlaces en línea. **Por debajo**: botón "Menú" (variante
  mono del botón secundario, alto `--control-height`) que despliega un panel de filas de
  `--nav-row-height`; sin JavaScript la lista siempre se ve.
- Las secciones con ancla dejan `scroll-margin-top: var(--nav-height)`.
- Detalle y movimiento: `designs/010-navigation/design.md`.

### Enlace de navegación

- **Anatomía**: marcador (hueco de `--nav-marker-size`), número mono `01`–`06` y texto, en
  `--font-mono` y `--text-small-size`; alto `--control-height`.
- **Reposo**: número `--color-text-muted`, texto `--color-text-secondary`, sin marcador.
- **Hover**: número `--color-link`, texto `--color-text`.
- **Activo** (`aria-current="true"`): marcador `--color-glow` con `--shadow-nav-marker`, número
  `--color-glow`, texto `--color-text`.
- **Foco**: `outline: var(--focus-ring)`, `outline-offset: var(--focus-ring-offset)`.

## Tokens de movimiento

| Token | Modo | Móvil | Escritorio | Uso |
|-------|------|-------|------------|-----|
| `--duration-fast` | fijo | `150ms` | — | Hover, foco, cambios de color |
| `--duration-base` | fijo | `300ms` | — | Borde luminoso, aparición del spotlight |
| `--duration-reveal` | fijo | `500ms` | — | Reveals, entrada de la tarjeta del hero, View Transitions |
| `--duration-hero-type` | fijo | `1200ms` | — | Escritura completa del código del hero |
| `--duration-hero-compile` | fijo | `400ms` | — | Fase de compilación del hero |
| `--duration-scramble` | fijo | `600ms` | — | Scramble/decode del nombre |
| `--stagger` | fijo | `60ms` | — | Retraso entre líneas o elementos consecutivos |
| `--ease-out` | fijo | `cubic-bezier(0.16, 1, 0.3, 1)` | — | Entradas |
| `--ease-in-out` | fijo | `cubic-bezier(0.65, 0, 0.35, 1)` | — | Transformaciones y compilación |
| `--reveal-distance` | fijo | `16px` | — | Desplazamiento vertical inicial del reveal |
| `--reveal-start-distance` | 768 | `80px` | `120px` | Distancia que el borde superior de un bloque ha entrado en pantalla cuando empieza el revelado P-1 |
| `--hero-card-distance` | fijo | `12px` | — | Desplazamiento vertical inicial de la tarjeta del hero |
| `--hero-compile-blur` | fijo | `3px` | — | Desenfoque del código al compilar |
| `--hero-compile-brightness` | fijo | `1.25` | — | Brillo del código al compilar |
| `--spotlight-size` | fijo | `360px` | — | Radio de la luz del spotlight |
| `--tilt-max` | fijo | `4deg` | — | Inclinación máxima del tilt |

Con `prefers-reduced-motion: reduce`, `--duration-*` y `--stagger` valen `0ms`.

## Patrones de movimiento

Todas las animaciones animan solo `transform`, `opacity` o `filter`; `filter` solo en el
reveal y en el hero. Ninguna usa Motion (ver registro de decisiones).

### P-1 — Revelado al entrar en pantalla

- **Disparador**: el borde superior del bloque ha entrado `--reveal-start-distance` en pantalla
  (medido desde el borde inferior), o el bloque ya se ve completo aunque no llegue a esa distancia;
  al cargar o al hacer scroll. Se repite cada vez que vuelve a entrar tras haber salido del todo.
- **Elementos**: bloques de sección marcados como revelables (encabezados de sección, paneles,
  cards y bloques de contenido).
- **Propiedades**: `opacity` 0 → 1 y `transform` `translateY(var(--reveal-distance))` → 0; sin
  `filter`.
- **Duración / easing**: `--duration-reveal` / `--ease-out`; los bloques que entran a la vez se
  escalonan `--stagger` en orden de lectura.
- **Salida**: al quedar completamente fuera de la pantalla, el bloque vuelve al estado oculto sin
  animación.
- **Implementación**: CSS (transición con tokens entre el estado oculto y el revelado) + un script
  común mínimo, sin dependencias, que observa la visibilidad y marca el estado de cada bloque.
  Los estilos del estado oculto solo aplican cuando el script se ha activado; los bloques ya
  visibles al activarse se muestran sin parpadeo. Sin trabajo por fotograma de scroll.
- **Reduced motion**: el script no oculta ningún bloque; contenido visible de inmediato, sin
  transición.
- **Sin JavaScript**: contenido visible; ningún estilo oculta bloques.

### P-2 — Spotlight en cards

- **Disparador**: movimiento del puntero fino (`hover: hover`) sobre la card.
- **Elementos**: fondo de la card.
- **Propiedades**: gradiente radial de `--color-spotlight` y radio `--spotlight-size`
  centrado en el puntero; `opacity` 0 → 1 al entrar.
- **Duración / easing**: `--duration-base` / `--ease-out`.
- **Implementación**: CSS con variables de posición + script nativo mínimo que actualiza
  las variables con el puntero.
- **Reduced motion**: sin seguimiento; borde luminoso estático en hover.
- **Táctil**: sin spotlight; borde luminoso al tocar.

### P-3 — Borde luminoso

- **Disparador**: hover, `:focus-visible` o toque.
- **Propiedades**: borde de `--color-border` a `--border-glow`; sombra a `--shadow-glow-soft`
  (`opacity` de la capa luminosa 0 → 1).
- **Duración / easing**: `--duration-base` / `--ease-out`.
- **Implementación**: CSS.
- **Reduced motion**: cambio sin transición.

### P-4 — Scramble / decode de texto

- **Disparador**: fin de P-5 (F3), una sola vez.
- **Elementos**: nombre en la tarjeta del hero.
- **Propiedades**: sustitución de caracteres por glifos aleatorios de `--font-mono` que se
  resuelven de izquierda a derecha hasta el texto real.
- **Duración**: `--duration-scramble`.
- **Implementación**: script nativo mínimo. El texto real está en el HTML desde el inicio
  y es el que leen los lectores de pantalla (la animación es decorativa).
- **Reduced motion**: texto final directo.

### P-5 — Hero código → tarjeta

Artboard: `A · Luz en la oscuridad — Hero código → tarjeta` (F1, F2, F3, Reduced motion).

1. **F1 · Escritura**: el bloque de código aparece línea a línea con caret `--color-glow`;
   `--duration-hero-type` en total, `--stagger` por línea.
2. **F2 · Compilación**: el bloque pasa a `filter: blur(var(--hero-compile-blur))
   brightness(var(--hero-compile-brightness))`, borde a `--color-glow` y sombra
   `--shadow-glow-hero`; `--duration-hero-compile`, `--ease-in-out`.
3. **F3 · Tarjeta**: la tarjeta entra con `opacity` 0 → 1 y
   `translateY(var(--hero-card-distance))` → 0; `--duration-reveal`, `--ease-out`; después
   el nombre ejecuta P-4.

- **Implementación**: Web Animations API encadenando fases. El código es decorativo
  (oculto a lectores de pantalla); la tarjeta con los datos reales está en el HTML desde el
  inicio.
- **Reduced motion**: tarjeta final directa, sin código, sin desenfoque ni scramble; misma
  jerarquía y contenido.
- **Coste**: un único elemento con `filter` durante `--duration-hero-compile`; sin dependencias.

### P-6 — View Transitions entre páginas

- **Disparador**: navegación de una card a su página de detalle.
- **Elementos**: la card se transforma en la cabecera de destino.
- **Duración / easing**: `--duration-reveal` / `--ease-out`.
- **Implementación**: View Transitions de Astro.
- **Reduced motion**: navegación sin animación.

### P-7 — Tilt 3D sutil (opcional por spec)

- **Disparador**: movimiento del puntero fino sobre cards destacadas.
- **Propiedades**: `transform` con rotación máxima `--tilt-max` en cada eje.
- **Duración / easing**: `--duration-fast` / `--ease-out`.
- **Implementación**: CSS con variables actualizadas por el mismo script de P-2.
- **Reduced motion**: sin tilt. **Táctil**: sin tilt.

## Estilos base

Estilos globales que aplican a todas las páginas:

- Documento con `color-scheme: dark`.
- `body`: `margin: 0`; fondo de página (ver [Fondo de página](#fondo-de-página)), color `--color-text`,
  `--font-sans`, `--text-body-size`, `--text-body-line-height`, `--text-body-weight`.
- `h1`, `h2`, `h3`: sus tokens `--text-h1-*`, `--text-h2-*`, `--text-h3-*`.
- `p`: `--text-body-*`. `small`: `--text-small-*`. `code`: `--font-mono` y `--text-code-*`.
- Enlaces: `--color-link`; en hover `--color-link-hover`.
- `:focus-visible`: `outline: var(--focus-ring)`, `outline-offset: var(--focus-ring-offset)`.
- Selección de texto: fondo `--color-selection-bg`, texto `--color-selection-text`.

## Reglas de uso

- **Un momento protagonista por página**: en la home es P-5; el resto usa P-1 a P-4.
- **El glow es para lo interactivo**: solo en hover/foco de controles y cards, y en la
  tarjeta del hero. Nunca en bloques de texto estáticos.
- **Como máximo un borde luminoso visible en reposo por viewport** (la tarjeta del hero).
- **El cian (`--color-glow`) no se usa para párrafos**: solo luz, foco, caret y código.
- **Estados siempre con texto**: `--color-warning` y `--color-success` nunca van solos.
- **Grid de fondo discreto**: estático; opacidad de línea la de `--color-grid-line`.
- **Contenido sin JS**: todo texto y enlace existe y es visible sin ejecutar scripts.
- **Solo tokens**: ningún valor de color, tipografía, espaciado, tamaño o duración suelto.
- **Rendimiento y accesibilidad primero**: si un efecto amenaza Lighthouse ≥ 90 o el
  contraste AA, se simplifica.

## Registro de decisiones

| Fecha | Decisión | Motivo | Fuente |
|-------|----------|--------|--------|
| 2026-09-13 | Solo tema oscuro | Coherente con "fondo negro profundo" y el glow azul | usuario |
| 2026-09-13 | Paleta: azul principal, cian para luz, neutros fríos y dos semánticos (ámbar "En curso", verde "Finalizado") | Mantener azul y negro predominantes | usuario, AGENTS.md |
| 2026-09-13 | Explorar 3 direcciones (Luz, Terminal, Editorial), cada una con su pareja tipográfica | Elegir viendo el resultado | usuario |
| 2026-09-13 | Dirección A · Luz en la oscuridad, sin combinar con B ni C | Elección del usuario tras revisar el canvas | usuario |
| 2026-09-13 | Geist + Geist Mono autoalojadas con `font-display: swap` | Pareja de la dirección A; constitución §7 | usuario, constitution.md |
| 2026-09-13 | Sin Motion en el sistema: hero con Web Animations API; scramble, spotlight y tilt con scripts nativos mínimos. Motion solo si una spec demuestra que lo nativo no basta | Conflicto entre `creative-direction.md` y constitución §3; prevalece la constitución | usuario, constitution.md |
| 2026-09-13 | Contrastes documentados calculados, no estimados | Constitución §7 (WCAG AA) | constitution.md |
| 2026-09-13 | Tamaños tipográficos y espaciado de sección fluidos entre 390 y 1440px | Artboards móvil y escritorio definen los extremos | canvas |
| 2026-09-13 | Tilt 3D queda opcional por spec | Está en la dirección creativa pero no es necesario en todas las cards | creative-direction.md |
| 2026-09-13 | Normalización: cada token con valor CSS exacto y tablas `Token \| Modo \| Móvil \| Escritorio \| Uso`; tipografía desglosada en tokens de tamaño, line-height, peso y tracking | Spec 002 exige comparar tokens con design.md por test | specs/002-design-tokens |
| 2026-09-13 | Breakpoint único en 768px para valores no fluidos | Spec 002 | usuario |
| 2026-09-13 | Token de selección: `--color-selection-bg` = accent al 35 %, `--color-selection-text` = `--color-text` | Spec 002 | usuario |
| 2026-09-13 | Valores sueltos de componentes y patrones convertidos en tokens (fondos de estados, controles, cards, código, iconos, distancias y desenfoques de movimiento, spotlight, tilt, halo, grid), con los mismos valores de los artboards de la dirección A | Regla "solo tokens" y comparación exacta de la spec 002 | canvas |
| 2026-09-13 | Sección "Estilos base" añadida | Alcance de estilos base decidido en la spec 002 | specs/002-design-tokens |
| 2026-09-13 | `--font-sans` y `--font-mono` referencian las variables generadas `--font-geist` y `--font-geist-mono`; pesos, `font-display` y fallbacks documentados en "Carga de fuentes" | La API de fuentes de Astro registra cada familia con nombre único (con hash), por lo que un nombre literal "Geist" no existiría (detectado en `/plan-spec 002`) | usuario, código de Astro 7 |
| 2026-09-13 | Halo del fondo pintado una sola vez y anclado al viewport; grid repetido y desplazable | En la revisión visual de la spec 002 el halo se repetía en franjas porque la repetición y el anclaje de las capas no estaban definidos | usuario |
| 2026-09-13 | `--icon-frame-size` pasa a `48px` en móvil (antes `36px`) | Los iconos enmarcados son interactivos y deben cumplir el objetivo táctil ≥ 44px (diseño de la spec 003) | usuario, designs/003-home-hero |
| 2026-09-13 | Sección de tokens "Hero": `--hero-min-height`, `--hero-card-max-width`, `--hero-card-padding`, `--hero-card-gap`, `--hero-caret-width`, `--hero-caret-height` | Medidas de la composición A del hero, incorporadas al sistema en la tarea T01 del plan 003 | designs/003-home-hero |
| 2026-09-13 | `body` con `margin: 0` en Estilos base | El hero de `--hero-min-height` desbordaba por el margen por defecto del navegador | usuario, designs/003-home-hero |
| 2026-09-15 | Secciones de tokens "Secciones" (`--section-max-width`, `--section-header-gap`) y "Sobre mí" (`--about-panel-padding`, `--about-panel-gap`, `--about-groups-gap`, `--about-text-max-width`), y `--reveal-range-length` en movimiento | Medidas de la composición B de "Sobre mí", incorporadas en la tarea T01 del plan 004 | designs/004-about |
| 2026-09-15 | Componente base "Encabezado de sección" (ruta decorativa + `h2`) | Patrón común aprobado para las secciones 004–009 | designs/004-about |
| 2026-09-15 | P-1 pasa a progreso ligado al scroll con `--reveal-range-length` (sin duración), escalonado por posición y sin desenfoque en elementos de gran superficie | La implementación CSS scroll-driven no tiene duración temporal y un revelado por tiempo exigiría JavaScript | usuario, designs/004-about |
| 2026-09-15 | P-1 refinado: nuevo `--reveal-range-start` (80px / 120px), `--reveal-range-length` pasa a 240px / 360px y la curva a `--ease-in-out` | En la revisión manual de la spec 004 el revelado empezaba en el borde inferior y terminaba casi al instante, sin percibirse; incorporado en la tarea T05 del plan 004 | usuario, designs/004-about |
| 2026-09-15 | Sección de tokens "Tecnologías" (`--tech-card-min-width`, `--tech-item-min-width`), 6 iconos genéricos de línea y excepción "logos de tecnología" (Simple Icons, CC0, un color) en Iconografía | Composición A · Bento de la sección de tecnologías, incorporada en la tarea T01 del plan 005 | designs/005-tech-stack |
| 2026-09-15 | P-1 pasa a revelado por tiempo al entrar en pantalla (umbral 10 % como constante, `--duration-reveal` / `--ease-out`, escalonado `--stagger`, repetición al volver a entrar, sin desenfoque) con un script común; se eliminan `--reveal-range-start`, `--reveal-range-length` y `--reveal-blur` | Los revelados ligados al scroll trababan el scroll con trackpad al sumar secciones; el revelado disparado al entrar fue fluido en la prueba del usuario. Incorporado en la tarea T08 del plan 005 | usuario, designs/005-tech-stack |
| 2026-09-15 | P-1 empieza cuando el borde superior del bloque ha entrado `--reveal-start-distance` (80px / 120px) o el bloque se ve completo; se quita la constante "umbral de revelado 10 %" | Con el 10 % del alto el revelado empezaba casi pegado al borde en bloques bajos; se recupera el inicio aprobado antes. Incorporado en la tarea T10 del plan 005 | usuario, designs/005-tech-stack |
| 2026-09-15 | Constante "breakpoint ancho" (`1024px`) para composiciones en fila que no caben entre 768px y 1023px, sin modo de tokens nuevo; nota de cards de proyecto sin enlace (sin foco y sin efecto táctil) | Panel destacado y fila de proyectos de la composición A · Sistema quedaban con 180–230px de contenido entre 768px y 1023px. Incorporado en la tarea T01 del plan 006 | usuario, designs/006-projects |
| 2026-09-15 | Sección de tokens "Experiencia" (`--experience-meta-width`) y patrón "Fila de experiencia" (bloque entre líneas, sin superficie propia, que adopta el tratamiento de card solo con el spotlight) | Composición A · Registro de la sección de experiencia, incorporada en la tarea T01 del plan 007 | designs/007-experience |
| 2026-09-15 | El patrón "Fila de experiencia" pasa a tener dos variantes: card del sistema desde 768px (separación `--space-4`) y bloque entre líneas por debajo de 768px | En la revisión manual de T04 el usuario pidió que en escritorio la fila se vea siempre como card; el estado encendido del spotlight ya no es lo que la convierte en card | usuario, designs/007-experience |
| 2026-09-18 | Sección de tokens "Navegación" (`--nav-height`, `--color-nav-bg`, `--nav-row-height`, `--nav-marker-size`, `--shadow-nav-marker`) y patrones "Barra de navegación" y "Enlace de navegación" | Dirección A · Índice de la navegación, incorporada en la tarea T01 del plan 010 | designs/010-navigation |
| 2026-09-18 | Se quita "Saltar al contenido" del patrón "Barra de navegación" | Refinamiento de la spec 010: poco útil con solo tres enlaces enfocables tras la barra; los landmarks y encabezados ya permiten saltarla | usuario, specs/010-navigation |
| 2026-09-19 | Tokens `--shadow-glow-text` (halo de texto protagonista) y sección "Página 404" (`--not-found-code-size`) | Dirección A · Señal de la página 404, incorporada en la tarea T01 del plan 013 | designs/013-not-found-page |
