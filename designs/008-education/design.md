---
id: 008
title: Formación
spec: specs/008-education/spec.md
status: approved
canvas: https://claude.ai/artifact/EMeyH5csqSD8zJ6pSiRKvN
created: 2026-09-16
updated: 2026-09-16
---

# Diseño — Formación

## Dirección elegida

**Composición A · "Par"**, elegida entre tres exploradas sobre el sistema de diseño aprobado
(A · Par, B · Escalera, C · Expediente). Sin combinar elementos de B ni C; las descartadas se
conservan en la página "Descartadas" del canvas.

Las dos titulaciones son cards del sistema, una junto a otra desde 768px: arriba el rango de años
y el estado, después la titulación y su especialidad, y al pie la institución con la abreviatura
**UTCGG** como etiqueta mono delante del nombre completo.

- **Motivo**: con solo dos formaciones, el par equilibra la sección y se lee de un vistazo; la
  card ya es vocabulario del sitio y el badge distingue al momento la titulación en curso.
- **Riesgo asumido**: se parece a las cards de "Proyectos" → aquí no hay índice, ni logros, ni
  etiquetas de stack, y la fila de años y estado abre la card en lugar del índice.

## Pantallas

| Pantalla | Artboard móvil | Artboard escritorio | Criterios de la spec que cubre |
|----------|----------------|---------------------|--------------------------------|
| Formación · reposo | `A · Par — Móvil 390` | `A · Par — Escritorio 1440` | CA-1.1, CA-1.2, CA-1.4, CA-3.1, CA-3.2 |
| Spotlight · reposo → puntero dentro → se mueve → sale; táctil y reduced motion | — | `A · Par — Movimiento` (fila de spotlight) | CA-2.1, CA-2.2 |
| Revelado al entrar en pantalla · fuera → entra → completo; sin JS y reduced motion | — | `A · Par — Movimiento` (fila de revelado) | CA-2.2, CA-3.4 |

Página del canvas: "A · Par (elegida)".

## Composición y jerarquía

- **Sección**: `section#formacion` a continuación de `#experiencia`, con separación vertical
  `--space-section` y margen lateral `--space-gutter`; contenedor de ancho máximo
  `--section-max-width`, centrado; encabezado de sección común y `--section-header-gap` hasta el
  contenido.
- **Orden de lectura**: encabezado (`PORTFOLIO / FORMACION` y `h2` "Formación") → las formaciones
  en el orden del campo `order` (Ingeniería y después TSU).
- **Rejilla**: una columna por debajo de 768px con separación `--space-3`; desde 768px, dos
  columnas iguales con separación `--space-4` y la misma altura.
- **Card de formación** (card del sistema, sin enlace): `--color-surface`, borde `--border-width`
  `--color-border`, `--radius-lg`, padding `--card-padding`, separación `--card-gap`, en columna:
  1. **Fila de metadatos**: a la izquierda el rango de años (`2025 – 2026`) con `--font-mono`,
     `--text-mono-label-*` y `--color-text-muted`; a la derecha el badge de estado. Separación
     `--space-3`, centrados en vertical.
  2. **Titulación**: `h3` con `--text-h3-*`, `--color-text` y `text-wrap: balance`.
  3. **Especialidad**: párrafo con `--text-body-*` y `--color-text-secondary`, separado
     `--space-2` de la titulación.
  4. **Institución** al pie de la card (empuja hacia abajo cuando la card se estira): etiqueta de
     tecnología del sistema con la abreviatura (`UTCGG`) y, a su lado, el nombre completo con
     `--text-body-*` en `--color-text-muted`; separación `--space-3`, alineados por la línea base
     y con salto si no caben.
- **Momento protagonista**: ninguno; la sección es corta y sobria.

## Componentes

- **Encabezado de sección** (sistema): ancla `formacion`, título "Formación".
- **Card de formación**: la card del sistema sin enlace (sin foco ni efecto táctil, como en las
  specs 006 y 007), con la anatomía descrita arriba. No usa índice decorativo.
- **Badge de estado** (sistema): "En curso" (`in-progress`, colores de aviso con halo en el punto)
  y "Finalizado" (`completed`, colores de éxito); el texto visible transmite el estado.
- **Etiqueta de tecnología** (sistema): reutilizada para la abreviatura de la institución.
- Sin iconos, sin logos, sin enlaces y sin elementos enfocables.

## Especificación de movimiento

### M-1 — Spotlight en las cards de formación (patrón P-2)

- **Disparador**: movimiento del puntero fino (`hover: hover` y `pointer: fine`) sobre una card,
  con JavaScript activo y sin `prefers-reduced-motion: reduce`.
- **Elementos**: fondo, borde, sombra, institución y rango de años de la card bajo el puntero.
- **Propiedades**:
  - Luz: gradiente radial de `--color-spotlight` con radio `--spotlight-size`, centrado en la
    posición del puntero; la capa de luz pasa de `opacity: 0` a `1`.
  - Borde `--border-glow` y sombra `--shadow-glow-soft` (capa luminosa `opacity` 0 → 1).
  - Institución y rango de años de `--color-text-muted` a `--color-text-secondary`.
- **Duración / easing**: `--duration-base` / `--ease-out`; la posición de la luz sigue al puntero
  sin transición.
- **Estado inicial → final**: card en reposo → card encendida con el puntero dentro → reposo al
  salir.
- **Secuencia / stagger**: no aplica; cada card responde por separado.
- **Implementación**: el spotlight común de la home (`CardSpotlight`, specs 005–007): CSS con
  variables de posición + un único script nativo mínimo, sin dependencias. Las cards se marcan
  como bloques con spotlight; no añade JavaScript nuevo. JavaScript total de la home ≤ 3 kB con
  gzip (spec 008, CA-2.3).
- **Justificación de Motion**: no aplica (sin Motion).
- **Reduced motion**: sin seguimiento ni capa de luz; borde luminoso, sombra y colores estáticos
  en hover, sin transición.
- **Táctil (`hover: none`)**: sin efecto (las cards no son interactivas), como en 005–007.
- **Sin JavaScript**: sin luz; el contenido está completo en el HTML.
- **Fotogramas en canvas**: `A · Par — Movimiento` (1 · Reposo, 2 · Puntero dentro, 3 · Puntero se
  mueve, 4 · Sale, Táctil, Reduced motion).

### M-2 — Revelado al entrar en pantalla (patrón P-1)

- **Disparador**: el del revelado común: el borde superior del bloque ha entrado
  `--reveal-start-distance` en pantalla, o el bloque ya se ve completo; se repite cada vez que
  vuelve a entrar tras haber salido del todo.
- **Elementos**: el encabezado de sección y cada card de formación.
- **Propiedades**: `opacity` y `transform` (sin `filter`).
- **Duración / easing**: `--duration-reveal` / `--ease-out`.
- **Estado inicial → final**: `opacity: 0` y `translateY(var(--reveal-distance))` →
  `opacity: 1` y `translateY(0)`.
- **Secuencia / stagger**: los bloques que entran a la vez se escalonan `--stagger` en orden de
  lectura (encabezado, después las cards de izquierda a derecha).
- **Salida**: al quedar completamente fuera de la pantalla vuelve al estado oculto sin animación.
- **Implementación**: el script común de revelado de la home (sin cambios), marcando el encabezado
  y cada card como bloques revelables.
- **Justificación de Motion**: no aplica (sin Motion).
- **Reduced motion**: nada se oculta; todo visible desde el inicio, sin animación.
- **Sin JavaScript**: todo visible; ningún estilo oculta contenido.
- **Compatibilidad con M-1**: el revelado anima `opacity` y `transform` de la card; el spotlight
  actúa sobre sus capas y sobre los colores internos; no comparten propiedades.
- **Fotogramas en canvas**: `A · Par — Movimiento`, fila de revelado (1 · Fuera de pantalla,
  2 · Entra (120px dentro), 3 · t = 250 ms, 4 · t ≥ 620 ms, Sin JS · reduced motion).

## Cambios a incorporar al sistema

Ninguno: sin tokens nuevos y sin patrones nuevos. La sección usa la card del sistema, el badge de
estado y la etiqueta de tecnología ya documentados.

**Dato nuevo pendiente en la spec**: la abreviatura `UTCGG` no está hoy en `docs/cv.md`. Antes de
implementar hay que refinar la spec 008 (`/spec 008`) para añadir el campo `institutionShort` al
esquema de `education` y a las dos entradas, y la abreviatura a `docs/cv.md`.

## Accesibilidad

- **Contraste** (tokens del sistema, calculados): `h2` `--color-text` 17.1:1 sobre `--color-bg`;
  titulación `--color-text` 16.2:1 y especialidad `--color-text-secondary` 12.8:1 sobre
  `--color-surface`; institución y años `--color-text-muted` 6.5:1 (con spotlight,
  `--color-text-secondary` 12.8:1); etiqueta `--color-tag-text` 10.2:1 sobre `--color-tag-bg`;
  badges "En curso" y "Finalizado" ≥ 10:1 sobre su fondo.
- **Encabezados**: `h2` "Formación" y un `h3` por titulación.
- **Estado**: transmitido por el texto del badge, no solo por el color.
- **Abreviatura**: la etiqueta `UTCGG` acompaña siempre al nombre completo, así que no depende de
  que el visitante conozca la sigla.
- **Decorativos ocultos**: ruta del encabezado y punto del badge.
- **Teclado**: sin elementos enfocables; el spotlight no depende del foco.
- **Contenido sin animación**: todo en el HTML, visible sin JavaScript y con reduced motion.

## Anti-clichés

- **Timeline vertical genérico con puntos**: descartado junto con B · Escalera.
- **Grid de cards idénticas sin jerarquía**: son solo dos y el badge las distingue; la sección
  entera es corta y no compite con "Proyectos".
- **Secciones con estructura idéntica**: la fila de años y estado abre la card, sin índice ni
  etiquetas de stack, frente a las cards de 006 y a la fila de 007.
- **Métricas inventadas**: solo los datos de `docs/cv.md` (más la abreviatura que se añadirá).
- **Animaciones en todo sin jerarquía**: el spotlight solo reacciona al puntero y el revelado es
  el común.

## Registro de decisiones

| Fecha | Tipo | Pregunta / Conflicto | Decisión | Fuente |
|-------|------|----------------------|----------|--------|
| 2026-09-16 | Brecha | Qué explorar | 3 composiciones: A · Par, B · Escalera, C · Expediente | usuario |
| 2026-09-16 | Brecha | Institución repetida en las dos titulaciones | Se repite en cada card (funciona igual si algún día hay otra institución); por eso se descarta la cabecera común de C · Expediente | usuario |
| 2026-09-16 | Diseño | Composición de la sección | A · Par, sin combinar | usuario |
| 2026-09-16 | Brecha | Abreviatura de la universidad | Etiqueta mono `UTCGG` (etiqueta de tecnología del sistema) delante del nombre completo; dato nuevo que la spec 008 debe añadir a `docs/cv.md` y a la colección como `institutionShort` | usuario |
| 2026-09-16 | Implícita | Indicador de estado y rango de años | Badge del sistema y años en mono, en la misma fila que abre la card | specs/008-education, designs/000-design-system |
| 2026-09-16 | Implícita | Spotlight y revelado | Los comunes de la home, sin JavaScript nuevo | specs/005-tech-stack, specs/006-projects, specs/007-experience |
