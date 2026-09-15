---
id: 006
title: Proyectos
spec: specs/006-projects/spec.md
status: approved
canvas: https://claude.ai/artifact/PBgd66h2DwqMKpuyVvmgUR
created: 2026-09-15
updated: 2026-09-15
---

# Diseño — Proyectos

## Dirección elegida

**Composición A · "Sistema"**, elegida entre tres exploradas sobre el sistema de diseño aprobado
(A · Sistema, B · Índice, C · Commits). Sin combinar elementos de B ni C; las descartadas se
conservan en la página "Descartadas" del canvas.

DentissaApp se presenta como un pequeño diagrama de arquitectura: un panel hundido con rejilla de
puntos donde la plataforma y su microservicio de autenticación son dos nodos (cards de proyecto)
unidos por un conector luminoso decorativo. Debajo, los otros tres proyectos como cards del
sistema.

- **Motivo**: cuenta la relación entre la plataforma y el microservicio sin añadir texto que no
  esté en `docs/cv.md`, y da a la sección un ritmo propio frente al panel `about.md` (004) y al
  mosaico de "Tecnologías" (005).
- **Riesgo asumido**: la fila de tres cards iguales → la jerarquía la marca el panel destacado
  que la precede; cards con la altura igualada y el stack al pie.

## Pantallas

| Pantalla | Artboard móvil | Artboard escritorio | Criterios de la spec que cubre |
|----------|----------------|---------------------|--------------------------------|
| Proyectos · reposo y spotlight en la plataforma | `A · Sistema — Móvil 390` | `A · Sistema — Escritorio 1440` (DentissaApp — Dental Practice Management Platform con spotlight) | CA-1.1, CA-1.2, CA-1.3, CA-2.2, CA-4.1, CA-4.2 |
| Proyectos · anchos intermedios (768–1023px) | — | `A · Sistema — Intermedio 900` | CA-2.2, CA-4.1 |
| Spotlight · reposo → puntero dentro → se mueve → sale; táctil y reduced motion | — | `A · Sistema — Movimiento` (fila de spotlight) | CA-3.1, CA-3.2 |
| Revelado al entrar en pantalla · fuera → entra → completo; sin JS y reduced motion | — | `A · Sistema — Movimiento` (fila de revelado) | CA-3.2, CA-4.4 |

Página del canvas: "A · Sistema (elegida)".

## Composición y jerarquía

- **Sección**: `section#proyectos` a continuación de `#tecnologias`, con separación vertical
  `--space-section` y margen lateral `--space-gutter`; contenedor de ancho máximo
  `--section-max-width`, centrado; encabezado de sección común y `--section-header-gap` hasta el
  contenido. Entre el panel destacado y el resto de proyectos, `--section-header-gap`.
- **Orden de lectura** (igual en todos los anchos; el del campo `order`):
  1. Encabezado: ruta `PORTFOLIO / PROYECTOS` y `h2` "Proyectos".
  2. Panel destacado: DentissaApp — Dental Practice Management Platform y DentissaApp — Auth
     Microservice.
  3. Resto: Hardware Store Inventory Management API, Real-Time Movement & Telemetry Tracking
     System y Automated Event-Driven Integration API.
- **Breakpoint ancho `1024px`** (constante nueva del sistema, ver "Cambios a incorporar al
  sistema"): las composiciones en fila solo aparecen desde ese ancho, porque entre 768px y
  1023px los nodos del panel y las tres cards quedarían con 180–230px de contenido.
- **Panel destacado**:
  - Fondo `--color-surface-sunken` con rejilla de puntos de `--border-width` en
    `--color-border-strong` cada `--grid-size`; borde `--border-width` `--color-border`,
    `--radius-lg`, padding `--card-padding`.
  - **Por debajo de 1024px**: los dos nodos apilados, a todo el ancho, con el conector vertical
    entre ellos (alto `--space-6`, centrado).
  - **Desde 1024px**: una fila con la plataforma y el microservicio en proporción 7:5 y el
    conector horizontal entre ellos (ancho `--space-7`, centrado en vertical); ambos nodos con la
    misma altura.
- **Conector** (decorativo, oculto a lectores de pantalla): línea de `--border-width` con
  degradado `--color-border-strong` → `--color-glow` → `--color-border-strong` en su dirección, y
  un punto de `--status-dot-size` en cada extremo con fondo `--color-bg` y borde `--border-width`
  `--color-glow`.
- **Resto de proyectos**:
  - Por debajo de 1024px: una columna, con separación `--space-3` por debajo de 768px y
    `--space-4` desde 768px.
  - Desde 1024px: 3 columnas iguales con separación `--space-4` y la misma altura.
- **Momento protagonista**: ninguno animado; el protagonismo visual es el panel destacado. El
  spotlight solo aparece con el puntero.

## Componentes

- **Encabezado de sección** (sistema): ancla `proyectos`, título "Proyectos".
- **Card de proyecto** (sistema, sin enlace): `--color-surface`, borde `--border-width`
  `--color-border`, `--radius-lg`, padding `--card-padding`, separación `--card-gap`, en columna:
  1. **Fila de metadatos**: a la izquierda el índice decorativo (`01`–`05`, número de `order` con
     dos dígitos, oculto a lectores de pantalla) con `--font-mono`, `--text-mono-label-size`,
     `--text-mono-label-weight`, `--text-mono-label-tracking` y `--color-text-muted`; a la
     derecha el badge de estado; separación `--space-3`, centrados en vertical.
  2. **`h3`** con el nombre: `--text-h3-*`, `--color-text`, `text-wrap: balance`.
  3. **Logros**: `ul` en columna con separación `--space-3`; cada punto en dos columnas (marca de
     `--space-2` y texto) con separación `--space-3`. Marca: línea de `--space-2` × `--border-width`
     en `--color-border-strong`, alineada con el centro de la primera línea de texto. Texto con
     `--text-body-*` en `--color-text-muted`.
  4. **Stack** al pie de la card (empuja hacia abajo cuando la card se estira): etiquetas de
     tecnología del sistema en fila con salto, separación `--space-2`, sin iconos.
  - Estados: reposo; spotlight (M-1); reduced motion (borde luminoso estático en hover).
- **Badge de estado** (sistema): "Finalizado" (`completed`, colores de éxito) o "En curso"
  (`in-progress`, colores de aviso con halo en el punto); el texto visible transmite el estado.
- **Etiqueta de tecnología** (sistema): el stack de cada proyecto.

## Especificación de movimiento

### M-1 — Spotlight en las cards de proyecto (patrón P-2)

- **Disparador**: movimiento del puntero fino (`hover: hover` y `pointer: fine`) sobre cualquiera
  de las 5 cards de proyecto, con JavaScript activo y sin `prefers-reduced-motion: reduce`.
- **Elementos**: fondo, borde, sombra, marcas y texto de los logros de la card bajo el puntero.
- **Propiedades**:
  - Luz: gradiente radial de `--color-spotlight` con radio `--spotlight-size`, centrado en la
    posición del puntero dentro de la card; la capa de luz pasa de `opacity: 0` a `1`.
  - Borde `--border-glow` y sombra `--shadow-glow-soft` (capa luminosa `opacity` 0 → 1).
  - Texto de los logros de `--color-text-muted` a `--color-text-secondary` y marcas de
    `--color-border-strong` a `--color-glow`.
- **Duración / easing**: aparición y desaparición de la luz, del borde y de los colores en
  `--duration-base` / `--ease-out`; la posición de la luz sigue al puntero sin transición.
- **Estado inicial → final**: reposo → luz, borde luminoso y sombra con el puntero dentro →
  reposo al salir.
- **Secuencia / stagger**: no aplica; cada card responde por separado (también los dos nodos del
  panel destacado).
- **Implementación**: la misma que el M-1 de "Tecnologías" (spec 005): CSS con variables de
  posición + un único script nativo mínimo, común a las cards de "Tecnologías" y "Proyectos", que
  actualiza esas variables con el puntero (una actualización por fotograma como máximo). Sin
  dependencias; JavaScript total de la home ≤ 3 kB con gzip (spec 006, CA-3.3).
- **Justificación de Motion**: no aplica (sin Motion).
- **Reduced motion**: sin seguimiento ni capa de luz; borde luminoso, sombra y colores de los
  logros estáticos en hover, sin transición.
- **Táctil (`hover: none`)**: sin efecto (las cards no son interactivas), como en 005.
- **Sin JavaScript**: sin luz; el contenido está completo en el HTML.
- **Fotogramas en canvas**: `A · Sistema — Movimiento` (1 · Reposo, 2 · Puntero dentro,
  3 · Puntero se mueve, 4 · Sale, Táctil, Reduced motion).

### M-2 — Revelado al entrar en pantalla (patrón P-1)

- **Disparador**: el del revelado común: el borde superior del bloque ha entrado
  `--reveal-start-distance` en pantalla, o el bloque ya se ve completo; se repite cada vez que
  vuelve a entrar tras haber salido del todo.
- **Elementos**: el encabezado de sección y cada una de las 5 cards de proyecto. El panel
  destacado y su conector no se revelan: quedan visibles mientras entran sus dos cards.
- **Propiedades**: `opacity` y `transform` (sin `filter`).
- **Duración / easing**: `--duration-reveal` / `--ease-out`.
- **Estado inicial → final**: `opacity: 0` y `translateY(var(--reveal-distance))` →
  `opacity: 1` y `translateY(0)`.
- **Secuencia / stagger**: los bloques que entran a la vez se escalonan `--stagger` en orden de
  lectura (desde 1024px, la plataforma antes que el microservicio y las tres cards de izquierda a
  derecha).
- **Salida**: al quedar completamente fuera de la pantalla vuelve al estado oculto sin animación.
- **Implementación**: el script común de revelado de la home (sin cambios), marcando los bloques
  como revelables.
- **Justificación de Motion**: no aplica (sin Motion).
- **Reduced motion**: nada se oculta; todo visible desde el inicio, sin animación.
- **Sin JavaScript**: todo visible; ningún estilo oculta contenido.
- **Compatibilidad con M-1**: el revelado anima `opacity` y `transform` de la card; el spotlight
  actúa sobre sus capas, borde, sombra y colores internos; no comparten propiedades.
- **Fotogramas en canvas**: `A · Sistema — Movimiento`, fila "Revelado al entrar en pantalla"
  (1 · Fuera de pantalla, 2 · Entra (120px dentro), 3 · t = 250 ms, 4 · t ≥ 620 ms,
  Sin JS · reduced motion).

## Cambios a incorporar al sistema

Se documentan aquí y **se incorporan a `designs/000-design-system/design.md` en la primera tarea
del plan 006**:

- **Constante nueva** en la tabla de constantes: `Breakpoint ancho` · `1024px` · composiciones en
  fila que no caben entre 768px y 1023px (panel destacado y fila de proyectos de la spec 006). No
  crea un modo nuevo de tokens: los tokens siguen cambiando solo en `768px`.
- **Card de proyecto**: nota de que las cards sin enlace (spec 006) no tienen estado de foco y en
  táctil no muestran efecto, como las cards de categoría de la spec 005.

Sin tokens nuevos.

## Accesibilidad

- **Contraste** (tokens del sistema, calculados): `h2` `--color-text` 17.1:1 sobre `--color-bg`;
  `h3` `--color-text` 16.2:1 y logros `--color-text-muted` 6.5:1 sobre `--color-surface` (con
  spotlight, `--color-text-secondary` 12.8:1); badge "Finalizado" `--color-success` y "En curso"
  `--color-warning` ≥ 10:1 sobre su fondo; etiquetas `--color-tag-text` 10.2:1 sobre
  `--color-tag-bg`; índice `--color-text-muted` (decorativo).
- **Encabezados**: `h2` "Proyectos" y un `h3` por proyecto.
- **Listas**: logros y stack en `ul` con semántica de lista.
- **Estado**: transmitido por el texto del badge, no solo por el color.
- **Decorativos ocultos**: ruta del encabezado, índice, marcas de los logros, rejilla de puntos y
  conector.
- **Teclado**: sin elementos enfocables; el spotlight no depende del foco.
- **Contenido sin animación**: todo en el HTML, visible sin JavaScript y con reduced motion.

## Anti-clichés

- **Grid de cards idénticas sin jerarquía**: evitado; DentissaApp como panel destacado con dos
  nodos de tamaños distintos (7:5) delante del resto.
- **Fila de logos de tecnologías sin contexto**: evitado; el stack va dentro de cada proyecto,
  como texto.
- **Timeline vertical genérico con puntos**: descartado junto con C · Commits.
- **Secciones con estructura idéntica**: evitado; panel diagrama frente al panel `about.md` de 004
  y al mosaico de 005.
- **Métricas inventadas**: solo los datos de `docs/cv.md` (incluido el equipo de 3 personas en 2
  semanas, que está en el CV).
- **Animaciones en todo sin jerarquía**: el spotlight solo reacciona al puntero y el revelado es
  el común.

## Registro de decisiones

| Fecha | Tipo | Pregunta / Conflicto | Decisión | Fuente |
|-------|------|----------------------|----------|--------|
| 2026-09-15 | Brecha | Qué explorar | 3 composiciones: A · Sistema, B · Índice, C · Commits | usuario |
| 2026-09-15 | Brecha | Etiqueta mono de la card de proyecto (el CV no da texto) | Índice decorativo `01`–`05` según `order`, oculto a lectores de pantalla | usuario, designs/000-design-system |
| 2026-09-15 | Diseño | Composición de la sección | A · Sistema, sin combinar | usuario |
| 2026-09-15 | Contradicción | Panel en fila 7:5 y fila de 3 cards desde 768px vs. 180–230px de contenido por card entre 768px y 1023px; el conector cambia de orientación, así que no sirven columnas automáticas por ancho mínimo | Constante nueva "breakpoint ancho 1024px" en el sistema: en fila desde 1024px, apilado por debajo; sin modo de tokens nuevo | usuario, designs/000-design-system |
| 2026-09-15 | Implícita | Valores del panel, conector y logros | Solo tokens existentes (`--card-padding`, `--grid-size`, `--space-*`, `--status-dot-size`, `--border-width`); canvas ajustado a esos valores | designs/000-design-system |
| 2026-09-15 | Implícita | Spotlight | Mismo patrón y script común que en "Tecnologías"; en táctil sin efecto (cards no interactivas); los logros se aclaran con la luz | specs/006-projects, designs/005-tech-stack |
| 2026-09-15 | Implícita | Revelado del panel destacado | Se revelan las cards, no el panel ni el conector (visibles mientras entran) | specs/006-projects (CA-4.4) |
