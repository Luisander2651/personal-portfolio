---
id: 007
title: Experiencia profesional
spec: specs/007-experience/spec.md
status: approved
canvas: https://claude.ai/artifact/2zAjPc24ztTFx2miTmyMjh
created: 2026-09-15
updated: 2026-09-15
---

# Diseño — Experiencia profesional

## Dirección elegida

**Composición A · "Registro"**, elegida entre tres exploradas sobre el sistema de diseño aprobado
(A · Registro, B · Ficha, C · Rótulo). Sin combinar elementos de B ni C; las descartadas se
conservan en el canvas.

Cada experiencia es una fila entre líneas finas, como una entrada de registro: a la izquierda el
periodo y la duración en mono, discretos; a la derecha la empresa, el puesto y los logros. El
puesto y el impacto pesan más que las fechas.

- **Motivo**: da a la sección un ritmo propio frente a las cards de "Proyectos" (006) y al mosaico
  de "Tecnologías" (005), y escala bien si el CV suma más experiencias.
- **Riesgo asumido**: con una sola experiencia la fila puede parecer vacía → el spotlight la
  levanta como card al pasar el puntero y el contenido ocupa el ancho completo de la sección.

## Pantallas

| Pantalla | Artboard móvil | Artboard escritorio | Criterios de la spec que cubre |
|----------|----------------|---------------------|--------------------------------|
| Experiencia · reposo y spotlight en la fila | `A · Registro — Móvil 390` | `A · Registro — Escritorio 1440` (fila con spotlight) | CA-1.1, CA-1.2, CA-1.4, CA-3.1, CA-3.2 |
| Spotlight · reposo → puntero dentro → se mueve → sale; táctil y reduced motion | — | `Movimiento — Spotlight y revelado` (fila de spotlight) | CA-2.1, CA-2.2 |
| Revelado al entrar en pantalla · fuera → entra → completo; sin JS y reduced motion | — | `Movimiento — Spotlight y revelado` (fila de revelado) | CA-2.2, CA-3.4 |

## Composición y jerarquía

- **Sección**: `section#experiencia` a continuación de `#proyectos`, con separación vertical
  `--space-section` y margen lateral `--space-gutter`; contenedor de ancho máximo
  `--section-max-width`, centrado; encabezado de sección común y `--section-header-gap` hasta el
  contenido.
- **Orden de lectura**: encabezado (`PORTFOLIO / EXPERIENCIA` y `h2` "Experiencia profesional") →
  fila de la experiencia.
- **Fila de experiencia** (una por entrada de la colección, en el orden de la colección):
  - Sin card: borde superior e inferior de `--border-width` `--color-border`; padding
    `--card-padding` en vertical y `--space-5` en horizontal. Filas consecutivas comparten el
    borde (sin dobles líneas).
  - **Por debajo de 768px**: una columna; primero el periodo y la duración, después empresa,
    puesto y logros; separación `--card-gap`.
  - **Desde 768px**: dos columnas, `--experience-meta-width` para el periodo y el resto para el
    contenido, con separación `--space-6`.
- **Contenido de la fila**:
  1. **Periodo y duración**: en una línea, con `--font-mono`, `--text-mono-label-*` (mayúsculas,
     tracking del sistema) y `--color-text-muted`; el separador `·` en `--color-border-strong`.
  2. **Empresa**: `h3` con `--text-h3-*` y `--color-text`.
  3. **Puesto**: párrafo con `--text-body-*` y `--color-text-secondary`, separado `--space-2` de
     la empresa.
  4. **Logros**: `ul` con separación `--space-3`; cada punto en dos columnas (marca de `--space-2`
     × `--border-width` en `--color-border-strong`, alineada con el centro de la primera línea, y
     texto con `--text-body-*` en `--color-text-muted`), igual que en la card de proyecto (006).
- **Momento protagonista**: ninguno; la sección es breve y sobria.

## Componentes

- **Encabezado de sección** (sistema): ancla `experiencia`, título "Experiencia profesional".
- **Fila de experiencia** (variante nueva, documentada en "Cambios a incorporar al sistema"): no
  es una card del sistema en reposo; con el puntero dentro adopta el tratamiento de card
  (superficie, borde luminoso y sombra) que aporta el spotlight común.
- **Marca de logro**: la misma de la card de proyecto (006).
- Sin badge de estado, sin etiquetas de stack, sin iconos y sin elementos enfocables.

## Especificación de movimiento

### M-1 — Spotlight en la fila de experiencia (patrón P-2)

- **Disparador**: movimiento del puntero fino (`hover: hover` y `pointer: fine`) sobre la fila,
  con JavaScript activo y sin `prefers-reduced-motion: reduce`.
- **Elementos**: fondo, borde, sombra, texto de los logros, marcas y línea de periodo de la fila.
- **Propiedades**:
  - Luz: gradiente radial de `--color-spotlight` con radio `--spotlight-size`, centrado en la
    posición del puntero; la capa de luz pasa de `opacity: 0` a `1`.
  - Capa luminosa (`opacity` 0 → 1): rellena `--color-surface` y dibuja el borde `--border-glow`
    con la sombra `--shadow-glow-soft`; mientras está encendida, la fila se lee como una card y
    sus líneas finas quedan cubiertas por el borde luminoso.
  - Texto de los logros y de la línea de periodo de `--color-text-muted` a
    `--color-text-secondary`; marcas de `--color-border-strong` a `--color-glow`.
- **Duración / easing**: `--duration-base` / `--ease-out`; la posición de la luz sigue al puntero
  sin transición.
- **Estado inicial → final**: fila entre líneas → fila encendida con puntero dentro → reposo al
  salir.
- **Secuencia / stagger**: no aplica; cada fila responde por separado.
- **Implementación**: el spotlight común de la home (`CardSpotlight`, specs 005 y 006): CSS con
  variables de posición + un único script nativo mínimo, sin dependencias. La fila se marca como
  bloque con spotlight; no añade JavaScript nuevo. JavaScript total de la home ≤ 3 kB con gzip
  (spec 007, CA-2.3).
- **Justificación de Motion**: no aplica (sin Motion).
- **Reduced motion**: sin seguimiento ni capa de luz; borde luminoso, sombra y colores del texto
  estáticos en hover, sin transición.
- **Táctil (`hover: none`)**: sin efecto (la fila no es interactiva), como en 005 y 006.
- **Sin JavaScript**: sin luz; el contenido está completo en el HTML.
- **Fotogramas en canvas**: `Movimiento — Spotlight y revelado` (1 · Reposo, 2 · Puntero dentro,
  3 · Puntero se mueve, 4 · Sale, Táctil, Reduced motion).

### M-2 — Revelado al entrar en pantalla (patrón P-1)

- **Disparador**: el del revelado común: el borde superior del bloque ha entrado
  `--reveal-start-distance` en pantalla, o el bloque ya se ve completo; se repite cada vez que
  vuelve a entrar tras haber salido del todo.
- **Elementos**: el encabezado de sección y cada fila de experiencia.
- **Propiedades**: `opacity` y `transform` (sin `filter`).
- **Duración / easing**: `--duration-reveal` / `--ease-out`.
- **Estado inicial → final**: `opacity: 0` y `translateY(var(--reveal-distance))` →
  `opacity: 1` y `translateY(0)`.
- **Secuencia / stagger**: los bloques que entran a la vez se escalonan `--stagger` en orden de
  lectura (encabezado y después la fila).
- **Salida**: al quedar completamente fuera de la pantalla vuelve al estado oculto sin animación.
- **Implementación**: el script común de revelado de la home (sin cambios), marcando el encabezado
  y cada fila como bloques revelables.
- **Justificación de Motion**: no aplica (sin Motion).
- **Reduced motion**: nada se oculta; todo visible desde el inicio, sin animación.
- **Sin JavaScript**: todo visible; ningún estilo oculta contenido.
- **Compatibilidad con M-1**: el revelado anima `opacity` y `transform` de la fila; el spotlight
  actúa sobre sus capas y sobre los colores internos; no comparten propiedades.
- **Fotogramas en canvas**: `Movimiento — Spotlight y revelado`, fila de revelado (1 · Fuera de
  pantalla, 2 · Entra (120px dentro), 3 · t = 250 ms, 4 · t ≥ 560 ms, Sin JS · reduced motion).

## Cambios a incorporar al sistema

Se documentan aquí y **se incorporan a `designs/000-design-system/design.md` y a `tokens.css` en
la primera tarea del plan 007**:

Sección nueva **"Experiencia"**:

| Token | Modo | Móvil | Escritorio | Uso |
|-------|------|-------|------------|-----|
| `--experience-meta-width` | fijo | `220px` | — | Ancho de la columna de periodo y duración en la fila de experiencia (desde 768px) |

En **Componentes**, patrón nuevo **"Fila de experiencia"**: bloque entre líneas de
`--border-width` `--color-border`, sin superficie propia en reposo, que adopta el tratamiento de
card (superficie, `--border-glow` y `--shadow-glow-soft`) solo mientras el spotlight lo ilumina;
sin foco ni efecto táctil, como las cards sin enlace de la spec 006.

## Accesibilidad

- **Contraste** (tokens del sistema, calculados): `h2` y `h3` `--color-text` 17.1:1 y 16.2:1 sobre
  `--color-bg`; puesto `--color-text-secondary` 13.5:1; logros y línea de periodo
  `--color-text-muted` 6.8:1 sobre `--color-bg` y 6.5:1 sobre `--color-surface` cuando el
  spotlight enciende la fila.
- **Encabezados**: `h2` "Experiencia profesional" y un `h3` por experiencia (la empresa).
- **Listas**: logros en `ul` con semántica de lista.
- **Periodo**: texto normal, no transmitido por color; la duración acompaña al periodo.
- **Decorativos ocultos**: ruta del encabezado, marcas de los logros y el separador `·`.
- **Teclado**: sin elementos enfocables; el spotlight no depende del foco.
- **Contenido sin animación**: todo en el HTML, visible sin JavaScript y con reduced motion.

## Anti-clichés

- **Timeline vertical genérico con puntos**: evitado; filas de registro sin carril ni nodos.
- **Secciones con estructura idéntica**: evitado; fila entre líneas frente a las cards de 006, el
  mosaico de 005 y el panel `about.md` de 004.
- **Fila de logos sin contexto**: no hay logo de la empresa.
- **Métricas inventadas**: solo los datos de `docs/cv.md`.
- **Animaciones en todo sin jerarquía**: el spotlight solo reacciona al puntero y el revelado es
  el común.

## Registro de decisiones

| Fecha | Tipo | Pregunta / Conflicto | Decisión | Fuente |
|-------|------|----------------------|----------|--------|
| 2026-09-15 | Brecha | Qué explorar | 3 composiciones: A · Registro, B · Ficha, C · Rótulo | usuario |
| 2026-09-15 | Brecha | Énfasis entre puesto y fechas | El puesto manda: periodo y duración en mono, discretos | usuario, specs/007-experience |
| 2026-09-15 | Diseño | Composición de la sección | A · Registro, sin combinar | usuario |
| 2026-09-15 | Implícita | La fila no es una card del sistema en reposo | El spotlight común rellena `--color-surface` al encenderse, así que la fila se levanta como card solo con el puntero dentro; se documenta como patrón "Fila de experiencia" | designs/000-design-system (P-2), specs/006-projects |
| 2026-09-15 | Implícita | Columna del periodo | Token nuevo `--experience-meta-width` (220px) desde 768px; por debajo, apilado. Sin usar el breakpoint ancho de 1024px: la fila solo tiene dos columnas | designs/000-design-system |
| 2026-09-15 | Implícita | Marca de los logros y colores | Los mismos de la card de proyecto (006), para no inventar un tratamiento nuevo | designs/006-projects |
| 2026-09-15 | Implícita | Varias experiencias | Filas consecutivas que comparten borde; el diseño no cambia con más entradas (CA-1.4) | specs/007-experience |
