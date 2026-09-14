---
id: "000"
title: Sistema de diseño
status: approved
canvas: https://claude.ai/code/artifact/7951e0c7-1841-4152-9d8e-8752078f7990
created: 2026-09-13
updated: 2026-09-13
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

Artboards de referencia en el canvas: `A · Luz en la oscuridad — Sistema · escritorio`,
`A · Luz en la oscuridad — Móvil`, `A · Luz en la oscuridad — Hero código → tarjeta`.

## Color

Contraste medido (WCAG 2.x) sobre `--color-bg`. Todo texto de cuerpo ≥ 4.5:1.

### Base

| Token | Valor | Uso | Contraste sobre bg |
|-------|-------|-----|--------------------|
| `--color-bg` | `#05070D` | Fondo base de página | — |
| `--color-surface` | `#0B0F1A` | Cards, paneles | — |
| `--color-surface-raised` | `#121826` | Elementos elevados sobre surface | — |
| `--color-surface-sunken` | `#080B14` | Bloques de código | — |
| `--color-border` | `#1E2636` | Bordes por defecto, separadores | — |
| `--color-border-strong` | `#263047` | Borde de botón secundario | — |
| `--color-text` | `#E6EDF7` | Texto principal, titulares | 17.1:1 |
| `--color-text-secondary` | `#C9D4E5` | Texto de apoyo sobre cards, código | 13.5:1 |
| `--color-text-muted` | `#8B97AD` | Metadatos, descripciones, labels | 6.8:1 |
| `--color-text-disabled` | `#5B6578` | Solo controles deshabilitados (exentos de contraste) | — |

### Marca y luz

| Token | Valor | Uso | Contraste sobre bg |
|-------|-------|-----|--------------------|
| `--color-accent` | `#3B82F6` | Azul de marca, botón primario | 5.5:1 |
| `--color-accent-hover` | `#5B97F8` | Botón primario en hover | — |
| `--color-accent-active` | `#2F6FDB` | Botón primario activo | — |
| `--color-on-accent` | `#030712` | Texto sobre `--color-accent` | 5.5:1 sobre accent |
| `--color-link` | `#7DB0FF` | Enlaces | 9.1:1 |
| `--color-link-hover` | `#A9CBFF` | Enlaces en hover | — |
| `--color-glow` | `#22D3EE` | Luz: anillo de foco, bordes luminosos, caret, funciones en código | 11.1:1 |

### Estados (semánticos)

Solo para estados de proyectos/formación. **Siempre acompañados de texto**, nunca solo color.

| Token | Valor | Uso | Contraste sobre bg |
|-------|-------|-----|--------------------|
| `--color-warning` | `#F5B84A` | "En curso" | 11.4:1 |
| `--color-success` | `#4ADE80` | "Finalizado" | 11.6:1 |

Fondo y borde de badge: el mismo color al 10 % (fondo) y al 30 % (borde) de opacidad.

### Componentes y código

| Token | Valor | Uso | Contraste |
|-------|-------|-----|-----------|
| `--color-tag-bg` | `#0F1524` | Fondo de etiqueta de tecnología | — |
| `--color-tag-text` | `#B7C3D6` | Texto de etiqueta | 11.3:1 sobre bg |
| `--color-code-keyword` | `#7DB0FF` | Palabras clave | 9.1:1 |
| `--color-code-string` | `#8BE3F2` | Cadenas | ≥ 11:1 |
| `--color-code-function` | `#22D3EE` | Funciones | 11.1:1 |
| `--color-grid-line` | `rgba(148, 163, 184, 0.055)` | Líneas del grid de fondo | decorativo |

## Tipografía

| Token | Familia | Pesos | Uso |
|-------|---------|-------|-----|
| `--font-sans` | Geist, fallback `ui-sans-serif, system-ui, sans-serif` | 400, 500, 600 | Contenido y titulares |
| `--font-mono` | Geist Mono, fallback `ui-monospace, SFMono-Regular, Menlo, monospace` | 400, 500 | Código, etiquetas, metadatos |

Fuentes con licencia OFL, **autoalojadas** con `font-display: swap` (constitución §7).
El canvas las carga desde Google Fonts solo para previsualizar.

### Escala

Valores en px. Los tamaños se interpolan de forma fluida entre 390 px y 1440 px de ancho
de viewport; fuera de ese rango se quedan en el extremo.

| Token | Móvil (390) | Escritorio (1440) | Line-height (móvil / escritorio) | Peso | Tracking | Familia |
|-------|-------------|-------------------|----------------------------------|------|----------|---------|
| `--text-display` | 40 | 72 | 1.05 / 1.02 | 600 | -0.03em | sans |
| `--text-h1` | 30 | 48 | 1.15 / 1.1 | 600 | -0.02em | sans |
| `--text-h2` | 24 | 32 | 1.2 | 600 | -0.01em | sans |
| `--text-h3` | 19 | 22 | 1.3 | 600 | 0 | sans |
| `--text-body` | 16 | 17 | 1.6 / 1.65 | 400 | 0 | sans |
| `--text-small` | 14 | 14 | 1.5 | 400 | 0 | sans |
| `--text-mono-label` | 11 | 12 | 1.4 | 500 | 0.08em, mayúsculas | mono |
| `--text-code` | 12 | 14 | 1.75 | 400 | 0 | mono |

## Espaciado, radios y bordes

### Espaciado

| Token | Valor |
|-------|-------|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 24px |
| `--space-6` | 32px |
| `--space-7` | 48px |
| `--space-8` | 88px |
| `--space-section` | 56px (móvil) → 88px (escritorio), fluido |
| `--space-gutter` | 24px (móvil) → 72px (escritorio), fluido |

### Radios

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-sm` | 6px | Etiquetas |
| `--radius-md` | 10px | Botones, iconos enmarcados |
| `--radius-lg` | 16px | Cards, paneles, bloque de código, tarjeta del hero |
| `--radius-full` | 999px | Badges de estado |

### Bordes, luz y foco

| Token | Valor | Uso |
|-------|-------|-----|
| `--border-width` | 1px | Todos los bordes |
| `--border-glow` | gradiente 135° `--color-glow` → `--color-accent` 40 % → `--color-border` 75 % | Borde luminoso (card en hover, tarjeta del hero) |
| `--shadow-glow-accent` | `0 0 0 1px rgba(125,176,255,0.45), 0 10px 30px -8px rgba(59,130,246,0.6)` | Botón primario en hover |
| `--shadow-glow-soft` | `0 0 48px -12px rgba(34,211,238,0.35)` | Card en hover |
| `--shadow-glow-hero` | `0 0 70px -18px rgba(34,211,238,0.45)` | Tarjeta del hero |
| `--focus-ring` | `2px solid var(--color-glow)`, offset 3px | Foco visible en todo interactivo (contraste 11.1:1) |
| `--control-height` | 48px (móvil) · 44px (escritorio) | Botones; objetivo táctil ≥ 44px |

### Fondo de página

- Color `--color-bg`.
- Grid de líneas `--color-grid-line` cada 48px (escritorio) / 32px (móvil).
- Halo radial superior de `--color-accent` al 20 % de opacidad, estático.

## Componentes base

Referencia: artboard `A · Luz en la oscuridad — Sistema · escritorio`, sección 04, y
`A · … — Móvil`, sección Componentes.

### Botón primario

- **Anatomía**: etiqueta sans 500 15–16px, icono opcional de 18px a la izquierda, alto
  `--control-height`, padding horizontal 18px, `--radius-md`.
- **Reposo**: fondo `--color-accent`, texto `--color-on-accent`.
- **Hover**: fondo `--color-accent-hover` + `--shadow-glow-accent`.
- **Foco**: `--focus-ring`.
- **Activo**: fondo `--color-accent-active`, `translateY(1px)`.
- **Deshabilitado**: fondo `#111726`, texto `--color-text-disabled`, borde `#1B2231`, sin sombra.

### Botón secundario

- **Anatomía**: igual al primario; fondo `rgba(230,237,247,0.03)`, borde `--color-border-strong`,
  texto `--color-text`.
- **Hover**: borde `--color-accent` + `0 0 24px -6px rgba(59,130,246,0.55)`.
- **Foco**: `--focus-ring`. **Activo**: fondo `--color-accent` al 10 %. **Deshabilitado**: como el primario.

### Enlace

- **Reposo**: `--color-link`, sin subrayado.
- **Hover**: `--color-link-hover`, subrayado `--color-glow` con offset 4px; flecha externa de 14px si sale del sitio.
- **Foco**: `--focus-ring`.

### Etiqueta de tecnología

- Mono 500 12px, alto 26px, padding 10px, `--radius-sm`, fondo `--color-tag-bg`,
  borde `--color-border`, texto `--color-tag-text`. Sin estados interactivos.

### Badge de estado

- Mono 500 12px, alto 26px, `--radius-full`, punto de 6px del color del estado, texto
  "En curso" (`--color-warning`) o "Finalizado" (`--color-success`), fondo al 10 % y
  borde al 30 % del mismo color. El punto de "En curso" lleva un halo de 8px.

### Card de proyecto

- **Anatomía**: `--color-surface`, borde `--color-border`, `--radius-lg`, padding 28px
  (escritorio) / 20px (móvil), gap 18px / 14px. Orden: fila label mono + badge de estado →
  título h3 → descripción `--text-body` en `--color-text-muted` → etiquetas de stack.
- **Hover (puntero fino)**: `--border-glow` + `--shadow-glow-soft` + spotlight radial de
  `--color-accent` al 18 % que sigue al cursor; flecha externa `--color-glow` junto al título
  si la card enlaza.
- **Foco (`:focus-visible` / `:focus-within`)**: mismo tratamiento que hover sin spotlight,
  más `--focus-ring`.
- **Táctil (`hover: none`)**: al tocar, `--border-glow` + sombra suave; sin spotlight.
- **Jerarquía**: las secciones de proyectos no deben repetir cards idénticas en grid
  (ver `anti-cliches.md`); la variación se define en cada spec.

### Bloque de código

- `--color-surface-sunken`, borde `--color-border`, `--radius-lg`, `--text-code`.
- Cabecera de 1 línea con nombre de archivo y lenguaje en `--color-text-muted`, separada
  por borde inferior.
- Colores de sintaxis: `--color-code-keyword`, `--color-code-string`,
  `--color-code-function`; resto `--color-text-secondary`.
- En móvil el código hace `pre-wrap` (sin scroll horizontal).

### Iconografía

- Iconos de línea, trazo 1.75, cuadrícula 24px, extremos redondeados, SVG inline
  (sin librerías). Set base: GitHub, LinkedIn, correo, flecha externa.
- Icono enmarcado: 52px (escritorio) / 36px (tarjeta del hero), `--radius-md`, borde
  `--color-border`, color `--color-text-secondary`; la flecha externa usa `--color-glow`.

## Tokens de movimiento

| Token | Valor | Uso |
|-------|-------|-----|
| `--duration-fast` | `150ms` | Hover, foco, cambios de color |
| `--duration-base` | `300ms` | Borde luminoso, aparición del spotlight |
| `--duration-reveal` | `500ms` | Reveals al hacer scroll, entrada de la tarjeta del hero, View Transitions |
| `--duration-hero-type` | `1200ms` | Escritura completa del código del hero |
| `--duration-hero-compile` | `400ms` | Fase de compilación del hero |
| `--duration-scramble` | `600ms` | Scramble/decode del nombre |
| `--stagger` | `60ms` | Retraso entre líneas o elementos consecutivos |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entradas |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Transformaciones y compilación |

## Patrones de movimiento

Todas las animaciones animan solo `transform`, `opacity` o `filter`; `filter: blur` solo en
el hero. Ninguna usa Motion (ver registro de decisiones).

### P-1 — Reveal al hacer scroll

- **Descripción**: secciones y cards pasan de `opacity 0`, `translateY(16px)`, `blur(4px)`
  a su estado final al entrar en viewport; `--duration-reveal`, `--ease-out`, `--stagger`
  entre hermanos.
- **Implementación**: CSS scroll-driven animations. Sin soporte del navegador, el contenido
  se muestra directamente (nunca oculto por defecto).
- **Reduced motion**: contenido visible de inmediato, sin transición.

### P-2 — Spotlight en cards

- **Descripción**: luz radial de `--color-accent` al 18 % centrada en el cursor dentro de la
  card; aparece con `--duration-base`.
- **Implementación**: CSS (gradiente con variables de posición) + script mínimo que
  actualiza las variables con el puntero. Solo con puntero fino (`hover: hover`).
- **Reduced motion**: sin seguimiento; borde luminoso estático en hover.
- **Táctil**: sin spotlight; borde luminoso al tocar.

### P-3 — Borde luminoso

- **Descripción**: el borde pasa de `--color-border` a `--border-glow` con
  `--shadow-glow-soft`; `--duration-base`, `--ease-out`.
- **Implementación**: CSS.
- **Reduced motion**: cambio sin transición.

### P-4 — Scramble / decode de texto

- **Descripción**: los caracteres del texto se sustituyen por glifos aleatorios de
  `--font-mono` y se resuelven de izquierda a derecha hasta el texto real; una sola vez,
  `--duration-scramble`. Uso previsto: nombre en la tarjeta del hero.
- **Implementación**: script nativo mínimo. El texto real está en el HTML desde el inicio
  y es el que leen los lectores de pantalla (la animación es decorativa).
- **Reduced motion**: texto final directo.

### P-5 — Hero código → tarjeta

Artboard: `A · Luz en la oscuridad — Hero código → tarjeta` (F1, F2, F3, Reduced motion).

1. **F1 · Escritura**: el bloque de código aparece línea a línea con caret `--color-glow`;
   `--duration-hero-type`, `--stagger` por línea.
2. **F2 · Compilación**: el bloque pasa a `blur(3px)` + `brightness(1.25)`, borde a
   `--color-glow` y halo cian; `--duration-hero-compile`, `--ease-in-out`.
3. **F3 · Tarjeta**: la tarjeta entra con `opacity` 0 → 1 y `translateY(12px)` → 0;
   `--duration-reveal`, `--ease-out`; después el nombre ejecuta P-4.

- **Implementación**: Web Animations API encadenando fases. El código es decorativo
  (oculto a lectores de pantalla); la tarjeta con los datos reales está en el HTML desde el
  inicio.
- **Reduced motion**: tarjeta final directa, sin código, sin desenfoque ni scramble; grid y
  halo atenuados; misma jerarquía y contenido.
- **Coste**: un único elemento con `filter` durante 400ms; sin dependencias.

### P-6 — View Transitions entre páginas

- **Descripción**: al navegar de una card a su página de detalle, la card se transforma en
  la cabecera; `--duration-reveal`, `--ease-out`.
- **Implementación**: View Transitions de Astro.
- **Reduced motion**: navegación sin animación.

### P-7 — Tilt 3D sutil (opcional por spec)

- **Descripción**: inclinación máxima de 4° siguiendo el puntero en cards destacadas.
- **Implementación**: CSS con variables actualizadas por el mismo script de P-2.
- **Reduced motion**: sin tilt. **Táctil**: sin tilt.

## Reglas de uso

- **Un momento protagonista por página**: en la home es P-5; el resto usa P-1 a P-4.
- **El glow es para lo interactivo**: solo en hover/foco de controles y cards, y en la
  tarjeta del hero. Nunca en bloques de texto estáticos.
- **Como máximo un borde luminoso visible en reposo por viewport** (la tarjeta del hero).
- **El cian (`--color-glow`) no se usa para párrafos**: solo luz, foco, caret y código.
- **Estados siempre con texto**: `--color-warning` y `--color-success` nunca van solos.
- **Grid de fondo discreto**: opacidad de línea ≤ 0.06; estático.
- **Contenido sin JS**: todo texto y enlace existe y es visible sin ejecutar scripts.
- **Solo tokens**: ningún valor de color, tipografía, espaciado o duración suelto.
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
