---
id: 009
title: Idiomas
spec: specs/009-languages/spec.md
status: approved
canvas: https://claude.ai/artifact/B9eXxaELa3VVQkgCbmSU7h
created: 2026-09-18
updated: 2026-09-18
---

# Diseño — Idiomas

## Dirección elegida

**Composición C · "Escala", sin la escala**, elegida entre tres exploradas sobre el sistema de
diseño aprobado (A · Sigla, B · Registro, C · Escala). La escala MCER A1…C2 de la propuesta
original se elimina: solo queda el código del nivel, B2, como etiqueta. Las direcciones A y B se
conservan en el canvas como descartadas.

Los dos idiomas son cards del sistema, una junto a otra desde 768px, con la misma anatomía:
idioma, nivel y una etiqueta mono con la referencia que respalda ese nivel.

- **Motivo**: con solo dos idiomas, el par se lee de un vistazo; el nivel dice cuánto domina el
  autor cada idioma y la etiqueta, qué lo respalda (el MCER en inglés, la lengua materna en
  español), así que las dos cards leen igual y son simétricas.
- **Riesgo asumido**: se parece al par de cards de "Formación" → aquí no hay fila de metadatos,
  ni badge, ni pie con institución; las cards son más cortas y ligeras, y la sección cierra la
  página.

## Pantallas

| Pantalla | Artboard móvil | Artboard escritorio | Criterios de la spec que cubre |
|----------|----------------|---------------------|--------------------------------|
| Idiomas · reposo | `C · Escala (ajustada) — Móvil` | `C · Escala (ajustada) — Escritorio` | CA-1.1, CA-1.2, CA-1.4, CA-3.1, CA-3.2 |
| Spotlight · reposo → puntero dentro → se mueve → sale; táctil y reduced motion | — | `Movimiento — Spotlight y revelado` (fila de spotlight) | CA-2.1, CA-2.2 |
| Revelado al entrar en pantalla · fuera → entra → completo; sin JS y reduced motion | — | `Movimiento — Spotlight y revelado` (fila de revelado) | CA-2.2, CA-3.4 |

## Composición y jerarquía

- **Sección**: `section#idiomas` a continuación de `#formacion`, con separación vertical
  `--space-section` y margen lateral `--space-gutter`; contenedor de ancho máximo
  `--section-max-width`, centrado; encabezado de sección común y `--section-header-gap` hasta el
  contenido.
- **Orden de lectura**: encabezado (`PORTFOLIO / IDIOMAS` y `h2` "Idiomas") → los idiomas en el
  orden de `profile.languages` (Español y después Inglés).
- **Rejilla**: una columna por debajo de 768px con separación `--space-3`; desde 768px, dos
  columnas iguales con separación `--space-4` y la misma altura.
- **Card de idioma** (card del sistema, sin enlace): `--color-surface`, borde `--border-width`
  `--color-border`, `--radius-lg`, padding `--card-padding`, separación `--card-gap`, en columna:
  1. **Idioma**: `h3` con `--text-h3-*` y `--color-text`.
  2. **Nivel**: párrafo con `--text-body-*` y `--color-text-secondary`, separado `--space-2` del
     idioma.
  3. **Etiqueta**: etiqueta de tecnología del sistema con la referencia del nivel (`B2`,
     `Lengua materna`), alineada a la izquierda y con su ancho natural.
- **Momento protagonista**: ninguno; la sección es breve y sobria.

## Componentes

- **Encabezado de sección** (sistema): ancla `idiomas`, título "Idiomas".
- **Card de idioma**: la card del sistema sin enlace (sin foco ni efecto táctil, como en las
  specs 006–008), con la anatomía descrita arriba. Sin índice decorativo.
- **Etiqueta de tecnología** (sistema): reutilizada para la referencia del nivel.
- Sin iconos, sin banderas, sin barras ni medidores, sin enlaces y sin elementos enfocables.

## Especificación de movimiento

### M-1 — Spotlight en las cards de idioma (patrón P-2)

- **Disparador**: movimiento del puntero fino (`hover: hover` y `pointer: fine`) sobre una card,
  con JavaScript activo y sin `prefers-reduced-motion: reduce`.
- **Elementos**: fondo, borde, sombra y nivel de la card bajo el puntero.
- **Propiedades**:
  - Luz: gradiente radial de `--color-spotlight` con radio `--spotlight-size`, centrado en la
    posición del puntero; la capa de luz pasa de `opacity: 0` a `1`.
  - Borde `--border-glow` y sombra `--shadow-glow-soft` (capa luminosa `opacity` 0 → 1).
  - Nivel de `--color-text-secondary` a `--color-text`.
- **Duración / easing**: `--duration-base` / `--ease-out`; la posición de la luz sigue al puntero
  sin transición.
- **Estado inicial → final**: card en reposo → card encendida con el puntero dentro → reposo al
  salir.
- **Secuencia / stagger**: no aplica; cada card responde por separado.
- **Implementación**: el spotlight común de la home (`CardSpotlight`, specs 005–008): CSS con
  variables de posición + un único script nativo mínimo, sin dependencias. Las cards se marcan
  como bloques con spotlight; no añade JavaScript nuevo. JavaScript total de la home ≤ 3 kB con
  gzip (spec 009, CA-2.3).
- **Justificación de Motion**: no aplica (sin Motion).
- **Reduced motion**: sin seguimiento ni capa de luz; borde luminoso, sombra y color del nivel
  estáticos en hover, sin transición.
- **Táctil (`hover: none`)**: sin efecto (las cards no son interactivas), como en 005–008.
- **Sin JavaScript**: sin luz; el contenido está completo en el HTML.
- **Fotogramas en canvas**: `Movimiento — Spotlight y revelado` (1 · Reposo, 2 · Puntero dentro,
  3 · Puntero se mueve, 4 · Sale, Táctil, Reduced motion).

### M-2 — Revelado al entrar en pantalla (patrón P-1)

- **Disparador**: el del revelado común: el borde superior del bloque ha entrado
  `--reveal-start-distance` en pantalla, o el bloque ya se ve completo; se repite cada vez que
  vuelve a entrar tras haber salido del todo.
- **Elementos**: el encabezado de sección y cada card de idioma.
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
  actúa sobre sus capas y sobre el color del nivel; no comparten propiedades.
- **Fotogramas en canvas**: `Movimiento — Spotlight y revelado`, fila de revelado (1 · Fuera de
  pantalla, 2 · Entra (120px dentro), 3 · t = 250 ms, 4 · Completo · sin JS · reduced motion).

## Cambios a incorporar al sistema

Ninguno: sin tokens nuevos y sin patrones nuevos. La sección usa la card del sistema y la etiqueta
de tecnología ya documentadas.

**Datos nuevos pendientes en la spec**: antes de implementar hay que refinar la spec 009
(`/spec 009`):

- En `docs/cv.md`, la línea de español pasa a `- **Español:** Dominio completo (lengua materna)`;
  la de inglés no cambia (`- **Inglés:** Competencia profesional (B2)`).
- En `profile.languages`, el campo `cefr` (A1–C2) se sustituye por `tag`, texto libre opcional:
  Español → nivel `Dominio completo`, `tag` `Lengua materna`; Inglés → nivel
  `Competencia profesional`, `tag` `B2`.
- El test de coherencia con el CV comprueba que nivel + `(tag)` reproducen cada línea, comparando
  la etiqueta sin distinguir mayúsculas (en la card empieza en mayúscula; en el CV, en minúscula).
- Afecta a CA-1.2, CA-1.3 y a la tabla de Contenido de la spec.

## Accesibilidad

- **Contraste** (tokens del sistema, calculados): `h2` `--color-text` 17.1:1 sobre `--color-bg`;
  idioma `--color-text` 16.2:1 y nivel `--color-text-secondary` 12.8:1 sobre `--color-surface`
  (con spotlight, `--color-text` 16.2:1); etiqueta `--color-tag-text` 10.2:1 sobre
  `--color-tag-bg`.
- **Encabezados**: `h2` "Idiomas" y un `h3` por idioma.
- **Nivel**: transmitido solo con texto; sin gráficos, barras ni porcentajes (CA-1.4).
- **Etiqueta `B2`**: acompaña siempre al texto del nivel, así que no depende de que el visitante
  conozca el MCER.
- **Decorativos ocultos**: ruta del encabezado.
- **Teclado**: sin elementos enfocables; el spotlight no depende del foco.
- **Contenido sin animación**: todo en el HTML, visible sin JavaScript y con reduced motion.

## Anti-clichés

- **Barras de habilidad con porcentajes**: descartada la escala A1…C2 de C, que se leía como una
  barra de nivel; el nivel es solo texto y una etiqueta.
- **Banderas**: no se usan; mezclan idioma y país.
- **Secciones con estructura idéntica**: el par recuerda a "Formación", pero sin fila de
  metadatos, badge ni pie; cards más cortas y ligeras.
- **Métricas inventadas**: solo datos de `docs/cv.md` (con el cambio de texto aprobado por el
  usuario que se añadirá).
- **Animaciones en todo sin jerarquía**: el spotlight solo reacciona al puntero y el revelado es
  el común.

## Registro de decisiones

| Fecha | Tipo | Pregunta / Conflicto | Decisión | Fuente |
|-------|------|----------------------|----------|--------|
| 2026-09-18 | Brecha | Qué explorar | 3 composiciones: A · Sigla, B · Registro, C · Escala (esta con riesgo de cliché marcado) | usuario |
| 2026-09-18 | Diseño | Composición de la sección | C · Escala sin la escala A1…C2: solo el código `B2` como etiqueta | usuario |
| 2026-09-18 | Brecha | Simetría de las cards | La card de español lleva también una etiqueta, `Lengua materna`; dato nuevo que la spec debe añadir a `docs/cv.md` y a la colección | usuario |
| 2026-09-18 | Brecha | Modelo de datos de la etiqueta | Campo opcional `tag` de texto libre en lugar de `cefr` (A1–C2) | usuario |
| 2026-09-18 | Conflicto | Redundancia entre "Nativo" y "Lengua materna" | El nivel de español pasa a "Dominio completo" (cuánto domina) y la etiqueta "Lengua materna" (qué lo respalda), igual que "Competencia profesional" + `B2` | usuario |
| 2026-09-18 | Implícita | Spotlight y revelado | Los comunes de la home, sin JavaScript nuevo | specs/005-tech-stack … specs/008-education |
