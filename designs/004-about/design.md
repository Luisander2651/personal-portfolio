---
id: 004
title: Sobre mí
spec: specs/004-about/spec.md
status: approved
canvas: https://claude.ai/artifact/SjN7VKYTSwaC63f61kDDaq
created: 2026-09-15
updated: 2026-09-15
---

# Diseño — Sobre mí

## Dirección elegida

**Composición B · "about.md"**, elegida entre tres exploradas sobre el sistema de diseño
aprobado (A · Documento técnico, B · about.md, C · Señal). Sin combinar elementos de A ni C;
las descartadas se conservan en la página "Descartadas" del canvas.

La sección se presenta como un archivo `about.md` renderizado: el bloque de código del sistema
hace de marco y dentro el contenido se lee como texto (sans), con marcadores de markdown en
mono como detalle técnico. Es la composición más "de desarrollador" sin sacrificar la lectura
y contrasta con la tarjeta luminosa del hero: superficie hundida, sin glow.

- **Riesgo asumido**: repetir el panel de archivo en más secciones lo convertiría en plantilla
  → el panel es exclusivo de esta sección (ver [Componentes](#componentes)).

## Pantallas

| Pantalla | Artboard móvil | Artboard escritorio | Criterios de la spec que cubre |
|----------|----------------|---------------------|--------------------------------|
| Sobre mí · estado final | `B · about.md — Móvil 390` | `B · about.md — Escritorio 1440` | CA-1.1, CA-2.2, CA-3.1, CA-4.3 |
| Sobre mí · revelado | — | `B · about.md — Movimiento` (Entra en pantalla, A mitad del rango, Revelado) | CA-4.1 |
| Sobre mí · reduced motion / sin JavaScript | — | `B · about.md — Movimiento` (Reduced motion · sin soporte) | CA-4.1, CA-4.2 |

Página del canvas: "B · about.md (elegida)".

## Composición y jerarquía

- **Sección**: `section#sobre-mi` a continuación del hero, con separación vertical
  `--space-section` (arriba y abajo) y margen lateral `--space-gutter`.
- **Contenedor**: ancho máximo `--section-max-width`, centrado; en móvil ocupa el ancho útil.
- **Orden de lectura** (igual en móvil y escritorio):
  1. Encabezado de sección: ruta mono `PORTFOLIO / SOBRE-MI` y `h2` "Sobre mí".
  2. Separación `--section-header-gap`.
  3. Panel `about.md`:
     1. Cabecera: `about.md` a la izquierda y `markdown` a la derecha.
     2. Resumen profesional (párrafo), ancho máximo `--about-text-max-width`.
     3. Separador horizontal.
     4. Grupo "Experiencia práctica" y grupo "Enfoque".
- **Grupos**: una columna por debajo de 768px; dos columnas iguales desde 768px, separadas
  `--about-groups-gap` (mismo valor entre grupos apilados en móvil).
- **Momento protagonista**: ninguno; la sección es sobria (el protagonista de la home es el hero).

## Componentes

### Encabezado de sección (componente nuevo del sistema)

Patrón común para las secciones 004–009; cada spec aporta su ancla. Se incorpora a
`designs/000-design-system/design.md` (Componentes base) en la primera tarea del plan 004.

- **Anatomía**: columna con separación `--space-3`:
  1. **Ruta** (decorativa, oculta a lectores de pantalla): fila con separación `--space-2` de
     `portfolio` en `--color-text-muted`, `/` en `--color-border-strong` y el ancla sin `#`
     (`sobre-mi`) en `--color-text-secondary`; tipografía `--text-mono-label-*` (mayúsculas).
  2. **`h2`**: tokens `--text-h2-*`, color `--color-text`; es el nombre accesible de la sección
     (`aria-labelledby`).
- **Estados**: ninguno (no interactivo).
- **Variación entre secciones**: el encabezado es común; el layout del contenido debe variar
  en cada sección (`anti-cliches.md`).

### Panel `about.md` (variante del bloque de código, exclusiva de esta sección)

- **Marco**: `--color-surface-sunken`, borde `--border-width` `--color-border`, `--radius-lg`,
  sin glow ni borde luminoso (no es interactivo).
- **Cabecera**: la del bloque de código del sistema: `--font-mono`, `--text-code-size`,
  `--color-text-muted`, padding `--space-3` vertical y `--space-4` horizontal, borde inferior
  `--border-width` `--color-border`; texto `about.md` y `markdown` en los extremos. Decorativa
  (oculta a lectores de pantalla).
- **Cuerpo**: padding `--about-panel-padding`, columna con separación `--about-panel-gap`.
- **Resumen**: párrafo con `--text-body-*`, color `--color-text-secondary`, ancho máximo
  `--about-text-max-width`, `text-wrap: pretty`.
- **Separador**: línea de `--border-width` en `--color-border`.
- **Grupo**:
  - Título: fila con separación `--space-2` y alineación a la línea base: marcador `##`
    (`--font-mono`, `--text-code-size`, `--color-text-muted`, decorativo) + `h3` con
    `--text-h3-*` y `--color-text`.
  - Lista `ul` sin viñetas nativas (conservando la semántica de lista), separación entre
    elementos `--space-3`, a `--card-gap` del título.
  - Elemento: fila con separación `--space-2` y alineación a la línea base: marcador `-`
    (`--font-mono`, `--text-code-size`, `--color-text-muted`, decorativo) + texto con
    `--text-body-*` y `--color-text-secondary`.
- **No reutilizable**: ninguna otra sección usa el panel de archivo.

### Tokens a incorporar al sistema

Se documentan aquí y **se incorporan a `designs/000-design-system/design.md` y a `tokens.css`
en la primera tarea del plan 004, en el mismo commit**, para que el test de tokens de la
spec 002 no quede en rojo entre el diseño y la implementación.

Sección nueva **"Secciones"**:

| Token | Modo | Móvil | Escritorio | Uso |
|-------|------|-------|------------|-----|
| `--section-max-width` | fijo | `1120px` | — | Ancho máximo del contenido de las secciones |
| `--section-header-gap` | 768 | `24px` | `32px` | Separación entre el encabezado de sección y su contenido |

Sección nueva **"Sobre mí"**:

| Token | Modo | Móvil | Escritorio | Uso |
|-------|------|-------|------------|-----|
| `--about-panel-padding` | 768 | `24px 20px 28px` | `40px 48px 48px` | Padding del cuerpo del panel `about.md` |
| `--about-panel-gap` | 768 | `32px` | `40px` | Separación entre resumen, separador y grupos |
| `--about-groups-gap` | 768 | `32px` | `48px` | Separación entre los grupos |
| `--about-text-max-width` | fijo | `72ch` | — | Ancho máximo de lectura del resumen |

En **"Tokens de movimiento"**:

| Token | Modo | Móvil | Escritorio | Uso |
|-------|------|-------|------------|-----|
| `--reveal-range-length` | 768 | `160px` | `240px` | Distancia de scroll que dura el revelado P-1 desde que el elemento entra en pantalla |

Cambio a incorporar en el patrón **P-1 — Reveal al hacer scroll** del sistema, en la misma tarea:

- **Duración / easing**: sustituir "`--duration-reveal` / `--ease-out`; `--stagger` entre
  hermanos" por: progreso ligado al scroll desde que el elemento entra en pantalla hasta
  `--reveal-range-length` después, con curva `--ease-out`; el escalonado entre hermanos sale de
  su posición (cada elemento tiene su propia línea de tiempo). Al hacer scroll hacia arriba,
  el revelado retrocede.
- **Propiedades**: el desenfoque (`--reveal-blur`) se omite en elementos de gran superficie
  (paneles o cards que ocupan buena parte del viewport).

## Especificación de movimiento

### M-1 — Revelado de la sección (patrón P-1)

- **Disparador**: scroll; cada elemento avanza mientras entra en pantalla por la parte inferior.
- **Elementos**: encabezado de sección y panel `about.md` (el contenido del panel se revela con él).
- **Propiedades**:
  - Encabezado: `opacity`, `transform` y `filter`.
  - Panel: `opacity` y `transform` (sin `filter`, por su superficie).
- **Duración / easing**: rango de scroll desde la entrada del borde superior del elemento
  hasta `--reveal-range-length` después / `--ease-out`. Sin duración temporal.
- **Estado inicial → final**:
  - Encabezado: `opacity: 0`, `translateY(var(--reveal-distance))`, `blur(var(--reveal-blur))`
    → `opacity: 1`, `translateY(0)`, sin desenfoque.
  - Panel: `opacity: 0`, `translateY(var(--reveal-distance))` → `opacity: 1`, `translateY(0)`.
- **Secuencia / stagger**: implícito por posición (el panel entra en pantalla después que el
  encabezado); sin retrasos.
- **Implementación**: CSS (scroll-driven animations), solo cuando el navegador las soporta y
  no hay `prefers-reduced-motion: reduce`. Sin JavaScript.
- **Justificación de Motion**: no aplica (sin Motion).
- **Reduced motion**: contenido visible desde el inicio, sin revelado.
- **Sin soporte del navegador**: contenido visible desde el inicio; ningún estilo lo oculta
  por defecto.
- **Sin JavaScript**: el revelado no depende de JavaScript (es CSS); el contenido está en el
  HTML y nada lo oculta a la espera de un script.
- **Táctil**: no depende del cursor.
- **Fotogramas en canvas**: `B · about.md — Movimiento` (Entra en pantalla, A mitad del
  rango, Revelado, Reduced motion · sin soporte).

## Accesibilidad

- **Contraste** (calculado con los tokens del sistema):
  - `h2` `--color-text` sobre `--color-bg`: 17.1:1.
  - Ancla de la ruta `--color-text-secondary` sobre `--color-bg`: 13.5:1; `portfolio` en
    `--color-text-muted`: 6.8:1. La `/` en `--color-border-strong` (1.5:1) es decorativa.
  - Dentro del panel (`--color-surface-sunken`): `h3` `--color-text` 16.7:1; resumen y puntos
    `--color-text-secondary` 13.1:1; cabecera y marcadores `--color-text-muted` 6.7:1.
- **Encabezados**: `h2` "Sobre mí" (nombre accesible de la sección) y dos `h3`; la página
  mantiene un único `h1` (hero).
- **Listas**: `ul` con elementos `li`; se conserva la semántica de lista aunque se quiten las
  viñetas nativas.
- **Decorativos ocultos**: ruta del encabezado, cabecera del panel y marcadores `##` y `-`.
- **Teclado**: la sección no tiene elementos interactivos; no altera el orden de tabulación.
- **Contenido sin animación**: todo el texto está en el HTML y visible sin JavaScript, sin
  soporte de scroll-driven animations y con reduced motion.

## Anti-clichés

- **Foto circular + "Hola, soy…"**: evitado; sin foto (pendiente en la spec) y el tono es un
  archivo de proyecto, no un saludo.
- **Barras o porcentajes de habilidades**: evitado; los puntos son frases literales del CV.
- **Secciones About / Skills / Projects con estructura idéntica**: el encabezado es común pero
  el panel de archivo es exclusivo de esta sección; las siguientes deben variar su layout.
- **Animaciones en todo sin jerarquía**: un revelado sobrio ligado al scroll, sin competir con
  el hero.
- **Lorem ipsum o métricas inventadas**: evitado; solo el resumen y los puntos de `cv.md`.

## Registro de decisiones

| Fecha | Tipo | Pregunta / Conflicto | Decisión | Fuente |
|-------|------|----------------------|----------|--------|
| 2026-09-15 | Brecha | Qué explorar con el sistema visual ya fijado | 3 composiciones: A · Documento técnico, B · about.md, C · Señal | usuario |
| 2026-09-15 | Brecha | Alcance del encabezado de sección | Patrón común para las secciones 004–009, incorporado al sistema | usuario |
| 2026-09-15 | Diseño | Composición de la sección | B · about.md, sin combinar | usuario |
| 2026-09-15 | Contradicción | P-1 define el revelado con duración (`--duration-reveal`) e implementación CSS scroll-driven, que avanza con el scroll y no por tiempo; un revelado por tiempo exigiría JavaScript, prohibido por la spec 004 (CA-4.2) | Revelado ligado al scroll y sin JS, con el token `--reveal-range-length`; se corrige P-1 en el sistema en la primera tarea del plan | usuario, specs/004-about, designs/000-design-system |
| 2026-09-15 | Implícita | Desenfoque del revelado en el panel | Solo `opacity` y `transform` en el panel; el desenfoque de un área grande durante el scroll penaliza el rendimiento | constitution.md §7, designs/000-design-system (reglas de uso) |
| 2026-09-15 | Implícita | Medidas nuevas | Tokens del sistema (`--section-*`, `--about-*`, `--reveal-range-length`) incorporados en la primera tarea del plan, como en 003 | designs/003-home-hero |
| 2026-09-15 | Implícita | Glow en la sección | Sin glow ni borde luminoso: la sección no es interactiva | designs/000-design-system (reglas de uso) |
| 2026-09-15 | Implícita | Panel de archivo en otras secciones | Exclusivo de 004 para evitar secciones con estructura idéntica | anti-cliches.md |
| 2026-09-15 | Contradicción | M-1 decía "sin JavaScript: contenido visible desde el inicio", pero el revelado CSS también se ejecuta sin JS (detectado en `/plan-spec 004`) | Se separan los casos: sin soporte, visible desde el inicio; sin JS, el revelado no depende de JS y nada espera a un script | usuario, specs/004-about |
