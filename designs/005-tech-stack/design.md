---
id: 005
title: Tecnologías
spec: specs/005-tech-stack/spec.md
status: approved
canvas: https://claude.ai/artifact/LmYFpxT1xKVunFxSWTRz7T
created: 2026-09-15
updated: 2026-09-15
---

# Diseño — Tecnologías

## Dirección elegida

**Composición A · "Bento"**, elegida entre tres exploradas sobre el sistema de diseño aprobado
(A · Bento, B · Dependencias, C · Capas). Sin combinar elementos de B ni C; las descartadas se
conservan en la página "Descartadas" del canvas.

Las 6 categorías con iconos son cards del sistema de tamaños distintos: las dos más amplias
(Lenguajes y Backend) abren la sección y las cuatro restantes forman una fila debajo. Los logos
dan reconocimiento inmediato y la categoría les da contexto. Debajo, "Arquitectura y prácticas"
como etiquetas y las tres categorías descriptivas como notas.

- **Motivo**: la más escaneable y la que mejor contrasta con el panel `about.md` de la sección
  anterior (004), que ya usa la metáfora de código.
- **Riesgo asumido**: aire de "dashboard" → acotado con cards de tamaños distintos, sin
  métricas ni gráficos, y el spotlight solo al pasar el puntero.

## Pantallas

| Pantalla | Artboard móvil | Artboard escritorio | Criterios de la spec que cubre |
|----------|----------------|---------------------|--------------------------------|
| Tecnologías · reposo y spotlight en una card | `A · Bento — Móvil 390` | `A · Bento — Escritorio 1440` (Backend y web con spotlight) | CA-1.1, CA-1.3, CA-1.4, CA-1.5, CA-2.1, CA-2.2, CA-4.1, CA-4.2 |
| Spotlight · reposo → puntero dentro → se mueve → sale | — | `A · Bento — Movimiento` (1 a 4) | CA-3.1 |
| Spotlight · táctil y reduced motion | — | `A · Bento — Movimiento` (Táctil, Reduced motion) | CA-3.2 |
| Revelado al entrar en pantalla · fuera → entra → completo; sin JS y reduced motion | — | `A · Bento — Movimiento` (fila de revelado) | CA-3.2, CA-4.4 |

Página del canvas: "A · Bento (elegida)".

## Composición y jerarquía

- **Sección**: `section#tecnologias` a continuación de `#sobre-mi`, con separación vertical
  `--space-section` y margen lateral `--space-gutter`; contenedor de ancho máximo
  `--section-max-width`, centrado; encabezado de sección común y `--section-header-gap` hasta
  el contenido. Entre bloques del contenido, `--section-header-gap`.
- **Orden de lectura** (igual en móvil y escritorio):
  1. Encabezado: ruta `PORTFOLIO / TECNOLOGIAS` y `h2` "Tecnologías".
  2. Mosaico de categorías con iconos, en el orden del CV: Lenguajes y fundamentos, Backend y
     web, Desarrollo móvil, Bases de datos y caché, DevOps y herramientas, Seguridad y pruebas.
  3. "Arquitectura y prácticas".
  4. Notas: Desarrollo asistido por IA, CI/CD, Contenedores / entornos.
- **Mosaico** (separación entre cards `--space-3` por debajo de 768px y `--space-4` desde 768px):
  - **Fila 1**: por debajo de 768px, una columna; desde 768px, Lenguajes y fundamentos y
    Backend y web en proporción 5:7.
  - **Fila 2**: las otras cuatro cards se reparten en tantas columnas iguales como quepan con
    un ancho mínimo de `--tech-card-min-width` (4 en fila a 1440px, 2×2 en anchos intermedios,
    1 columna en móvil).
- **Ítems dentro de una card**: rejilla de columnas iguales, tantas como quepan con un ancho
  mínimo de `--tech-item-min-width` (3 en Backend y 2 en Lenguajes a 1440px; 1 en móvil);
  separación `--space-3` vertical y `--space-4` horizontal.
- **Arquitectura y prácticas**: fila con `h3` y etiquetas (en columna por debajo de 768px),
  padding vertical `--space-5`, separadores `--border-width` `--color-border` arriba y abajo;
  separación interna `--space-5` (fila) / `--space-3` (columna).
- **Notas**: 3 columnas iguales desde 768px con separación `--space-6`; apiladas por debajo de
  768px con separación `--space-5`.
- **Momento protagonista**: ninguno; la sección es sobria y el spotlight solo aparece con el
  puntero.

## Componentes

- **Encabezado de sección** (sistema): ancla `tecnologias`, título "Tecnologías".
- **Card de categoría** (variante de la card del sistema, no enlaza): `--color-surface`, borde
  `--border-width` `--color-border`, `--radius-lg`, padding `--card-padding`, separación
  `--card-gap`.
  - Cabecera: `h3` con `--text-h3-*` y `--color-text`, y a la derecha un contador decorativo
    (número de ítems con dos dígitos, oculto a lectores de pantalla) en `--font-mono`,
    `--tag-font-size`, `--color-text-muted`.
  - Lista de ítems: cada ítem es icono (`--icon-size-sm`, decorativo) + nombre con
    `--text-small-*` y `--color-text-secondary`, separación `--space-3`, alineados al centro.
  - Estados: reposo; spotlight (M-1); reduced motion (borde luminoso estático en hover).
- **Etiqueta de tecnología** (sistema): para "Arquitectura y prácticas", sin icono.
- **Nota**: `h3` con `--text-h3-*` + párrafo con `--text-body-*` y `--color-text-muted`,
  separación `--space-2`.

### Iconografía de la sección

- **Logos de tecnología** (Simple Icons 16.31.0, licencia CC0; SVG copiados al proyecto con
  fuente y licencia anotadas): relleno de un solo color (`currentColor`), cuadrícula de 24.
- **Iconos genéricos de línea** (estilo del sistema: cuadrícula de 24, trazo `--icon-stroke`,
  extremos y uniones redondeados): taza, tabla, llaves, flechas bidireccionales, enlace con
  flecha saliente y llave.
- Color en reposo `--color-text-secondary`; con spotlight, `--color-text`.

| Ítem | Icono |
|------|-------|
| TypeScript | logo `typescript` |
| JavaScript | logo `javascript` |
| PHP | logo `php` |
| Java | genérico: taza |
| Python | logo `python` |
| C++ | logo `cplusplus` |
| SQL | genérico: tabla |
| Node.js | logo `nodedotjs` |
| NestJS | logo `nestjs` |
| Next.js | logo `nextdotjs` |
| Express.js | logo `express` |
| Laravel 12 | logo `laravel` |
| Spring Boot | logo `springboot` |
| APIs REST | genérico: llaves |
| WebSockets | genérico: flechas bidireccionales |
| WebHooks | genérico: enlace con flecha saliente |
| Android nativo (Java, Kotlin) | logo `android` |
| Ionic | logo `ionic` |
| PostgreSQL | logo `postgresql` |
| MySQL | logo `mysql` |
| Redis | logo `redis` |
| Docker | logo `docker` |
| Git | logo `git` |
| GitHub | logo `github` |
| Vite | logo `vite` |
| Linux (nivel básico) | logo `linux` |
| OAuth 2.0 (GitHub, Google) | genérico: llave |
| autenticación con JWT | logo `jsonwebtokens` |
| JUnit para pruebas unitarias y de integración | logo `junit5` |

Los trazados de los iconos genéricos son los de los artboards del canvas.

### Cambios a incorporar al sistema

Se documentan aquí y **se incorporan a `designs/000-design-system/design.md` y a `tokens.css`
en la primera tarea del plan 005, en el mismo commit**, para que el test de tokens de la spec
002 no quede en rojo.

Sección nueva **"Tecnologías"**:

| Token | Modo | Móvil | Escritorio | Uso |
|-------|------|-------|------------|-----|
| `--tech-card-min-width` | fijo | `240px` | — | Ancho mínimo de las cards de la segunda fila del mosaico de tecnologías |
| `--tech-item-min-width` | fijo | `160px` | — | Ancho mínimo de columna de los ítems dentro de una card de tecnologías |

En **"Iconografía"**:

- Excepción **logos de tecnología**: SVG de Simple Icons (CC0) copiados al proyecto, relleno de
  un color del sistema, sin colores de marca; solo en la sección de tecnologías.
- Iconos genéricos de línea añadidos al set: taza, tabla, llaves, flechas bidireccionales,
  enlace con flecha saliente y llave.

Refinado del revelado (2026-09-15), a incorporar al sistema y al código en una tarea nueva del
plan 005:

- **P-1**: pasa a ser un revelado **por tiempo al entrar en pantalla** (ver M-2): `opacity` y
  `transform` en `--duration-reveal` / `--ease-out`, escalonado `--stagger`, repetido cada vez
  que el bloque vuelve a entrar; sin revelados ligados al scroll.
- **Constante nueva** (tabla "Constantes"): umbral de revelado del 10 % del bloque visible.
- **Tokens eliminados**: `--reveal-range-start`, `--reveal-range-length` y `--reveal-blur` (sin uso).
- **Componentes existentes**: `SectionHeader` y el panel `about.md` de la spec 004 pasan del
  revelado ligado al scroll a este revelado (sustituye su M-1); los bloques de "Tecnologías"
  usan el mismo.

## Especificación de movimiento

### M-1 — Spotlight en las cards de categoría (patrón P-2)

- **Disparador**: movimiento del puntero fino (`hover: hover` y `pointer: fine`) sobre una de
  las 6 cards, con JavaScript activo y sin `prefers-reduced-motion: reduce`.
- **Elementos**: fondo, borde, sombra e iconos de la card bajo el puntero.
- **Propiedades**:
  - Luz: gradiente radial de `--color-spotlight` con radio `--spotlight-size`, centrado en la
    posición del puntero dentro de la card; la capa de luz pasa de `opacity: 0` a `1`.
  - Borde `--border-glow` y sombra `--shadow-glow-soft` (capa luminosa `opacity` 0 → 1).
  - Iconos de `--color-text-secondary` a `--color-text`.
- **Duración / easing**: aparición y desaparición de la luz, del borde y del color en
  `--duration-base` / `--ease-out`; la posición de la luz sigue al puntero sin transición.
- **Estado inicial → final**: reposo → luz, borde luminoso y sombra con el puntero dentro →
  reposo al salir.
- **Secuencia / stagger**: no aplica; cada card responde por separado.
- **Implementación**: CSS con variables de posición + script nativo mínimo que actualiza esas
  variables con el puntero (una actualización por fotograma como máximo). Sin dependencias;
  JavaScript total de la home ≤ 3 kB con gzip (spec 005, CA-3.3).
- **Justificación de Motion**: no aplica (sin Motion).
- **Reduced motion**: sin seguimiento ni capa de luz; borde luminoso y sombra estáticos en hover,
  sin transición.
- **Táctil (`hover: none`)**: sin efecto. Variación respecto a P-2 (que añade borde luminoso al
  tocar): estas cards no son interactivas.
- **Sin JavaScript**: sin luz; el contenido está completo en el HTML.
- **Fotogramas en canvas**: `A · Bento — Movimiento` (1 · Reposo, 2 · Puntero dentro,
  3 · Puntero se mueve, 4 · Sale, Táctil, Reduced motion).

### M-2 — Revelado al entrar en pantalla (patrón P-1 refinado)

- **Disparador**: el bloque asoma al menos un 10 % en pantalla (al hacer scroll o al cargar);
  se repite cada vez que vuelve a entrar tras haber salido del todo.
- **Elementos**: el encabezado de sección, cada card del mosaico, el bloque "Arquitectura y
  prácticas" y el bloque de notas. En la sección "Sobre mí" (spec 004): el encabezado y la caja
  `about.md`.
- **Propiedades**: `opacity` y `transform` (sin `filter`).
- **Duración / easing**: `--duration-reveal` / `--ease-out`.
- **Estado inicial → final**: `opacity: 0` y `translateY(var(--reveal-distance))` →
  `opacity: 1` y `translateY(0)`.
- **Secuencia / stagger**: los bloques que entran a la vez se escalonan `--stagger` en orden de
  lectura.
- **Salida**: al quedar completamente fuera de la pantalla, el bloque vuelve al estado oculto sin
  animación (no es visible), listo para revelarse al volver a entrar.
- **Implementación**: CSS (transición con tokens entre el estado oculto y el revelado) + script
  común mínimo, sin dependencias, que observa la visibilidad de los bloques y marca el estado de
  cada uno. Los estilos del estado oculto solo aplican cuando el script se ha activado; los
  bloques ya visibles al activarse se muestran sin parpadeo. JavaScript total de la home ≤ 3 kB
  con gzip (spec 005, CA-3.3).
- **Justificación de Motion**: no aplica (sin Motion).
- **Reduced motion**: el script no oculta ningún bloque; todo visible desde el inicio, sin
  animación.
- **Sin JavaScript**: todo visible; ningún estilo oculta contenido.
- **Rendimiento**: sin trabajo por fotograma de scroll; en la prueba del usuario con todos los
  bloques de "Sobre mí" y "Tecnologías" el scroll con trackpad fue fluido.
- **Compatibilidad con M-1**: el revelado anima `opacity` y `transform` de la card; el
  spotlight actúa sobre su fondo, borde, sombra e iconos; no comparten propiedades.
- **Fotogramas en canvas**: `A · Bento — Movimiento`, fila "Revelado al entrar en pantalla ·
  por tiempo" (1 · Fuera de pantalla, 2 · Entra, 3 · t = 250 ms, 4 · t ≥ 680 ms,
  Sin JS · reduced motion).

## Accesibilidad

- **Contraste** (tokens del sistema, calculados): `h2` `--color-text` 17.1:1 sobre
  `--color-bg`; `h3` `--color-text` 16.2:1 y nombres `--color-text-secondary` 12.8:1 sobre
  `--color-surface`; contador y notas `--color-text-muted` 6.5:1 (card) / 6.8:1 (fondo);
  etiquetas `--color-tag-text` 10.2:1 sobre `--color-tag-bg`. Iconos decorativos (el nombre
  visible es el nombre accesible).
- **Encabezados**: `h2` "Tecnologías" y un `h3` por categoría (6 + Arquitectura + 3 notas).
- **Listas**: ítems y etiquetas en `ul` con semántica de lista.
- **Decorativos ocultos**: iconos, contadores y ruta del encabezado.
- **Teclado**: sin elementos enfocables; el spotlight no depende del foco.
- **Contenido sin animación**: todo en el HTML, visible sin JavaScript, sin soporte de
  scroll-driven animations y con reduced motion.

## Anti-clichés

- **Fila de logos de tecnologías sin contexto**: evitado; los logos van dentro de su categoría
  con nombre visible.
- **Barras o porcentajes de habilidades**: evitado; sin niveles ni métricas.
- **Grid de cards idénticas sin jerarquía**: evitado; cards de tamaños distintos (5:7 arriba,
  cuatro menores debajo) y bloques de etiquetas y notas con otro ritmo.
- **Secciones con estructura idéntica**: evitado; mosaico de cards frente al panel `about.md`
  de 004.
- **Animaciones en todo sin jerarquía**: el spotlight solo reacciona al puntero y el revelado es
  el común.

## Registro de decisiones

| Fecha | Tipo | Pregunta / Conflicto | Decisión | Fuente |
|-------|------|----------------------|----------|--------|
| 2026-09-15 | Brecha | Icono de "Java" (Simple Icons no incluye su logo; solo OpenJDK) | Icono genérico de línea (taza) | usuario, Simple Icons 16.31.0 |
| 2026-09-15 | Brecha | Iconos genéricos de los ítems sin logo | SQL tabla, APIs REST llaves, WebSockets flechas bidireccionales, WebHooks enlace con flecha saliente, OAuth llave, Java taza | usuario |
| 2026-09-15 | Brecha | Qué explorar | 3 composiciones: A · Bento, B · Dependencias, C · Capas | usuario |
| 2026-09-15 | Diseño | Composición de la sección | A · Bento, sin combinar | usuario |
| 2026-09-15 | Contradicción | El mosaico de 12 columnas a 1440px vs. breakpoint único de 768px del sistema (se aplastaría en anchos intermedios) | Fila 1 en 5:7 desde 768px; fila 2 e ítems con columnas automáticas por ancho mínimo (`--tech-card-min-width`, `--tech-item-min-width`), sin breakpoints nuevos | designs/000-design-system, canvas |
| 2026-09-15 | Contradicción | Títulos de card a 19px y notas a 17px en la primera versión del canvas no eran tokens | Todos los `h3` con `--text-h3-*`; canvas actualizado | designs/000-design-system |
| 2026-09-15 | Contradicción | P-2 añade borde luminoso al tocar, pero estas cards no son interactivas | Táctil sin efecto en esta sección | usuario, specs/005-tech-stack (CA-3.2) |
| 2026-09-15 | Implícita | Revelado de las cards | P-1 sin `filter` y con capa propia durante el revelado, como el panel de 004 (evita tirones con trackpad) | plans/004-about (incidencia T03) |
| 2026-09-15 | Implícita | Iconografía de logos | Excepción "logos de tecnología" (Simple Icons, CC0, un color) y 6 iconos genéricos a incorporar al sistema en la primera tarea del plan | specs/005-tech-stack, designs/000-design-system |
| 2026-09-15 | Refinado | Scroll con trackpad trabado con revelados ligados al scroll en encabezados, panel de "Sobre mí" y bloques de "Tecnologías" (bloqueo de T05); pruebas del usuario: fluido con solo los encabezados y también con revelado por tiempo con script | Solo se revelan los encabezados de sección, con rango `entry` (desde que asoma hasta que entra completo) y `--ease-out`; paneles, cards y bloques estáticos; se eliminan `--reveal-range-start` y `--reveal-range-length`; sin JavaScript nuevo. Sustituye el revelado de cards de la primera versión de M-2 y el del panel de 004 | usuario, constitution.md §7 |
| 2026-09-15 | Refinado | Tras el cambio de specs 004 y 005 (revelado disparado al entrar, cada vez que entra, con script común) | M-2 por tiempo: umbral 10 %, `--duration-reveal` / `--ease-out`, sin desenfoque, escalonado `--stagger`, oculto sin animación al salir del todo; aplica a encabezado, cards, arquitectura y notas (y a encabezado y caja de 004). Sustituye la versión "solo encabezados"; se eliminan `--reveal-range-start`, `--reveal-range-length` y `--reveal-blur` | usuario, specs/004-about, specs/005-tech-stack |
