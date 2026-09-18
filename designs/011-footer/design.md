---
id: 011
title: Footer
spec: specs/011-footer/spec.md
status: approved
canvas: https://claude.ai/artifact/Tkzxq9p5z3gDyMZpfYUe2N
created: 2026-09-18
updated: 2026-09-18
---

# Diseño — Footer

## Dirección elegida

**Dirección A · "Firma"**, elegida entre tres exploradas sobre el sistema de diseño aprobado
(A · Firma, B · Registro, C · Trío). Sin combinar elementos de B ni C; las descartadas se
conservan en el canvas.

El footer cierra la página como una firma: nombre y rol a la izquierda, la lista de contacto
(icono, servicio y dato) a la derecha, y la línea de copyright al pie.

- **Motivo**: se lee como un cierre claro y sobrio; el contacto queda legible y copiable sin
  convertirse en otra sección.
- **Riesgo asumido**: el nombre se repite respecto al hero → va a tamaño `h2`, no a tamaño de
  titular, y sin ser encabezado.

## Pantallas

| Pantalla | Artboard móvil | Artboard escritorio | Criterios de la spec que cubre |
|----------|----------------|---------------------|--------------------------------|
| Footer · reposo, hover (GitHub) y foco (LinkedIn) | `A · Firma — Móvil 390` | `A · Firma — Escritorio 1440` | CA-1.1, CA-1.2, CA-1.3, CA-1.4, CA-2.1, CA-2.2, CA-3.3 |
| Revelado al entrar en pantalla · fuera → entra → completo; sin JS y reduced motion | — | `Movimiento — Revelado del footer` | CA-3.1, CA-3.2 |

## Composición y jerarquía

- **`footer`** después de `main` y fuera de él: borde superior `--border-width`
  `--color-border`; padding superior `--space-section`, inferior `--space-5`, lateral
  `--space-gutter`. Contenido con ancho máximo `--section-max-width`, centrado, en columna con
  separación `--space-7` entre la fila principal y el copyright.
- **Fila principal**: por debajo de 768px, apilada (firma → contacto) con separación
  `--space-6`; desde 768px, dos columnas (`minmax(0, 1.2fr)` y `minmax(0, 1fr)`), firma a la
  izquierda y contacto a la derecha, separadas `--space-7`, alineadas arriba.
- **Firma** (párrafos, no encabezados): nombre (`profile.name`) con `--text-h2-size`,
  `--text-h2-line-height`, `--text-h2-weight`, `--text-h2-tracking` y `--color-text`,
  `text-wrap: balance`; debajo, a `--space-2`, el rol (`profile.role`) con `--text-body-*` y
  `--color-text-muted`.
- **Contacto** (`nav aria-label="Contacto"` con lista `ul`, separación `--space-1`): cada enlace
  en fila, alto mínimo `--control-height`, padding vertical `--space-2`, separación `--space-3`
  entre icono y texto, alineado arriba:
  1. Icono de línea del sistema (correo, GitHub, LinkedIn) de `--icon-size-sm`, trazo
     `--icon-stroke`, decorativo, en `--color-text-muted`.
  2. En columna: el servicio ("Correo", "GitHub", "LinkedIn") con `--font-mono`,
     `--text-mono-label-*` (mayúsculas) y `--color-text-muted`; y el dato con `--font-mono`,
     `--text-small-size` y `--color-link`, que parte líneas donde haga falta
     (`overflow-wrap: anywhere`) para que la URL de LinkedIn no desborde a 390px.
  - **Hover**: dato `--color-link-hover` con subrayado `--color-glow` separado `--space-1`;
    icono `--color-glow`.
  - **Foco**: `outline: var(--focus-ring)`, `outline-offset: var(--focus-ring-offset)`, radio
    `--radius-sm`; icono `--color-glow`.
  - Nombre accesible del enlace: "{servicio}: {dato}" ("Correo: luisander.dev@gmail.com").
- **Copyright**: `© {año} {nombre}` con `--font-mono`, `--text-mono-label-size` y
  `--color-text-muted`, sobre un borde superior `--border-width` `--color-border` con padding
  superior `--space-5`.
- **Momento protagonista**: ninguno; cierre sobrio.

## Componentes

- **Footer** (nuevo): firma, lista de contacto y copyright, con la anatomía anterior.
- **Enlace de contacto** (nuevo, variante del enlace del sistema): icono + servicio + dato.
- Reutiliza los iconos de línea del hero (correo, GitHub, LinkedIn).
- Sin cards, sin spotlight, sin botones ni formularios.

## Especificación de movimiento

### M-1 — Revelado al entrar en pantalla (patrón P-1)

- **Disparador**: el del revelado común: el borde superior del footer ha entrado
  `--reveal-start-distance` en pantalla, o se ve completo; se repite cada vez que vuelve a
  entrar tras haber salido del todo.
- **Elementos**: el contenido del footer como un único bloque revelable.
- **Propiedades**: `opacity` y `transform`.
- **Duración / easing**: `--duration-reveal` / `--ease-out`.
- **Estado inicial → final**: `opacity: 0` y `translateY(var(--reveal-distance))` →
  `opacity: 1` y `translateY(0)`.
- **Secuencia / stagger**: ninguna (un bloque).
- **Salida**: al quedar completamente fuera de la pantalla vuelve al estado oculto sin animación.
- **Implementación**: el script común de revelado de la home (sin cambios), marcando el bloque
  como revelable.
- **Justificación de Motion**: no aplica (sin Motion).
- **Reduced motion**: nada se oculta; visible desde el inicio.
- **Sin JavaScript**: visible; ningún estilo oculta contenido.
- **Fotogramas en canvas**: `Movimiento — Revelado del footer` (1 · Fuera de pantalla,
  2 · Entra, 3 · t = 250 ms, 4 · Completo · sin JS · reduced motion).

### M-2 — Hover y foco de los enlaces

- **Disparador**: puntero sobre un enlace o foco de teclado.
- **Propiedades**: `color` del dato y del icono, y el subrayado.
- **Duración / easing**: `--duration-fast` / `--ease-out`, solo sin reduced motion.
- **Reduced motion**: cambio inmediato.

**Coste**: sin JavaScript nuevo; el JavaScript de la home sigue ≤ 3 kB con gzip.

## Cambios a incorporar al sistema

Ninguno: sin tokens nuevos. Patrón "Enlace de contacto" documentado aquí como variante del
enlace del sistema.

## Accesibilidad

- **Contraste** (tokens del sistema): nombre `--color-text` 17.1:1; dato `--color-link` 9.1:1
  (hover `--color-link-hover` mayor); servicio, rol y copyright `--color-text-muted` 6.8:1;
  foco `--color-glow` 11.1:1.
- **Estructura**: `footer` (landmark `contentinfo`) → `nav aria-label="Contacto"` → `ul`/`li`/`a`;
  la firma son párrafos (sin encabezados nuevos).
- **Nombres accesibles**: "{servicio}: {dato}"; iconos decorativos ocultos.
- **Teclado**: los tres enlaces tras el contenido de `main`, en orden, con foco visible;
  objetivo táctil ≥ 44px (`--control-height`).
- **Sin JavaScript y reduced motion**: todo visible, sin animación.

## Anti-clichés

- **"Contáctame" con formulario / botón**: no hay; solo los datos reales como enlaces.
- **Grid de cards idénticas**: descartado junto con C · Trío.
- **Métricas o frases inventadas**: solo `profile` y el año de la build.
- **Animaciones sin jerarquía**: solo el revelado común y cambios de color.

## Registro de decisiones

| Fecha | Tipo | Pregunta / Conflicto | Decisión | Fuente |
|-------|------|----------------------|----------|--------|
| 2026-09-18 | Brecha | Qué explorar | 3 direcciones: A · Firma, B · Registro, C · Trío (con riesgo de parecerse a las cards de Formación e Idiomas) | usuario |
| 2026-09-18 | Diseño | Composición del footer | A · Firma, sin combinar | usuario |
| 2026-09-18 | Implícita | Tamaño del nombre | `--text-h2-size` como párrafo, no encabezado: firma sin competir con el hero ni alterar la jerarquía | anti-cliches.md, constitution.md §7 |
| 2026-09-18 | Implícita | Nombre accesible de los enlaces | "{servicio}: {dato}", que incluye el servicio exigido por CA-1.2 | specs/011-footer |
