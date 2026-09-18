---
id: 009
title: Idiomas
status: active
created: 2026-09-18
updated: 2026-09-18
depends_on: [001, 002, 003, 004, 005, 006, 007, 008]
---

# Idiomas

## Objetivo

Añadir a la home, justo después de "Formación", la sección "Idiomas" con los idiomas de
`docs/cv.md` y su nivel, con una etiqueta aparte que indica en qué se apoya ese nivel: el código
del Marco Común Europeo de Referencia (MCER) en inglés y "Lengua materna" en español. El objetivo es que un reclutador vea de un
vistazo en qué idiomas puede trabajar el autor. Es la última sección de contenido antes de la navegación (spec 010) y el
footer (spec 011), y expone el ancla `#idiomas`.

## Historias de usuario

- **HU-1**: Como reclutador, quiero ver qué idiomas habla el autor y con qué nivel, para saber si
  puede trabajar en inglés.
- **HU-2**: Como visitante con ratón o trackpad, quiero que cada idioma reaccione con una luz al
  pasar el puntero, como el resto de secciones, sin que eso afecte al contenido ni a quien no
  puede o no quiere verlo.
- **HU-3**: Como visitante, quiero que la sección sea ligera y accesible, sin depender de
  JavaScript ni de animaciones para leerla.

## Criterios de aceptación

### HU-1

- **CA-1.1**
  - **Dado** el sitio generado con `bun run build`
  - **Cuando** inspecciono `dist/index.html` sin ejecutar JavaScript
  - **Entonces** existe un único `<section id="idiomas">` etiquetado por su `h2`
    (`aria-labelledby`), cuyo texto es "Idiomas"; la sección es el siguiente bloque de contenido
    después de `#formacion` dentro de `main` y la página sigue teniendo un único `h1`
- **CA-1.2**
  - **Dado** `profile.languages` y la sección "Idiomas"
  - **Cuando** inspecciono su HTML
  - **Entonces** muestra cada idioma en el orden de `profile.languages`, con su nombre, su nivel y,
    si la tiene, su etiqueta, cada uno como texto visible separado; ningún texto de los idiomas
    está incrustado en componentes
- **CA-1.3**
  - **Dado** `docs/cv.md` y la colección `profile`
  - **Cuando** se ejecutan los tests
  - **Entonces** cada idioma de `profile.languages` tiene `language` y `level` obligatorios y un
    campo opcional `tag` de texto no vacío; los datos son `Español` con nivel `Dominio completo` y
    `tag` `Lengua materna`, e `Inglés` con nivel `Competencia profesional` y `tag` `B2`; y cada
    línea de la sección "Idiomas" de `docs/cv.md` coincide con el idioma, el nivel y, si existe,
    la etiqueta entre paréntesis, comparada sin distinguir mayúsculas
    (`- **Español:** Dominio completo (lengua materna)` y
    `- **Inglés:** Competencia profesional (B2)`)
- **CA-1.4**
  - **Dado** la sección "Idiomas"
  - **Cuando** inspecciono su HTML
  - **Entonces** no contiene barras, medidores ni porcentajes de nivel (`<progress>`, `<meter>`,
    `role="progressbar"` ni valores con `%`): el nivel se transmite solo con su texto
    (`anti-cliches.md`)

### HU-2

- **CA-2.1**
  - **Dado** un visitante con puntero fino (`hover: hover`), JavaScript activo y sin
    `prefers-reduced-motion: reduce`
  - **Cuando** mueve el puntero sobre el bloque de un idioma
  - **Entonces** una luz sigue al puntero sobre ese bloque y desaparece al salir, con el mismo
    efecto que en las secciones anteriores (verificación: estructura por test y revisión manual
    contra el diseño)
- **CA-2.2**
  - **Dado** un visitante en un dispositivo táctil, con `prefers-reduced-motion: reduce` o sin
    JavaScript
  - **Cuando** carga la home y llega a la sección
  - **Entonces** no hay luz que siga al puntero, todo el contenido de la sección está en el HTML
    y es visible, y ningún estilo lo oculta salvo cuando el script de revelado se ha ejecutado y
    no hay reduced motion
- **CA-2.3**
  - **Dado** el sitio generado
  - **Cuando** mido el JavaScript de cliente de la home en `dist/`
  - **Entonces** su tamaño total comprimido con gzip es ≤ 3 kB, no depende de ningún paquete y
    solo implementa la animación del hero, el spotlight común y el script común de revelado de
    las secciones

### HU-3

- **CA-3.1**
  - **Dado** los estilos de la sección
  - **Cuando** se ejecutan los tests
  - **Entonces** solo usan tokens del sistema de diseño (ningún color, tamaño, espaciado o
    duración literal)
- **CA-3.2**
  - **Dado** la sección "Idiomas"
  - **Cuando** inspecciono su HTML
  - **Entonces** no contiene elementos enfocables (enlaces, botones, controles ni `tabindex`),
    de modo que el orden de tabulación de la home no cambia
- **CA-3.3**
  - **Dado** la home servida con `bun run preview`
  - **Cuando** se ejecuta Lighthouse (móvil)
  - **Entonces** obtiene ≥ 90 en Performance, Accessibility, Best Practices y SEO
- **CA-3.4**
  - **Dado** un visitante con JavaScript activo y sin `prefers-reduced-motion: reduce`
  - **Cuando** el encabezado de la sección y cada bloque de idioma entran en pantalla al hacer
    scroll
  - **Entonces** se revelan con una animación, y vuelven a revelarse cada vez que entran de nuevo
    tras haber salido de pantalla (verificación: estructura por test y revisión manual, con
    scroll fluido con trackpad)

## Contenido

Fuente: `profile.languages` (derivado de `docs/cv.md`, sección "Idiomas").

| Idioma (`language`) | Nivel (`level`) | Etiqueta (`tag`) | Línea en `docs/cv.md` |
|---------------------|-----------------|------------------|------------------------|
| Español | Dominio completo | Lengua materna | `- **Español:** Dominio completo (lengua materna)` |
| Inglés | Competencia profesional | B2 | `- **Inglés:** Competencia profesional (B2)` |

Cambio en `docs/cv.md` (aprobado por el usuario): la línea de español pasa de
`- **Español:** Nativo` a `- **Español:** Dominio completo (lengua materna)`. La de inglés no
cambia; en los datos, el código `B2` se separa del texto del nivel.

Encabezado de la sección: "Idiomas" (`docs/workflow.md`, roadmap).

## Diseño

Diseño aprobado: [designs/009-languages/design.md](../../designs/009-languages/design.md)
· [canvas](https://claude.ai/artifact/B9eXxaELa3VVQkgCbmSU7h) (composición C · Escala, sin la
escala).

Qué debe sentirse: una sección breve que cierra el contenido de la página, con el nivel de
inglés fácil de encontrar y sin gráficos de nivel. Luz que sigue al puntero como en las otras
secciones y revelado sutil al entrar en pantalla, cada vez que entra. La composición, la técnica
y los tiempos se definen en `/design-spec`.

## Fuera de alcance

- Certificaciones de idiomas (TOEFL, Cambridge…): no están en `docs/cv.md`.
- Idiomas adicionales: solo los del CV.
- Pruebas, autoevaluaciones o desglose por habilidad (lectura, escritura, conversación).
- Barras, porcentajes o medidores de nivel (`anti-cliches.md`).
- Banderas u otros símbolos de país: mezclan idioma y país.
- Navegación (spec 010) y footer (spec 011).

## Registro de decisiones

| Fecha | Tipo | Pregunta / Conflicto | Decisión | Fuente |
|-------|------|----------------------|----------|--------|
| 2026-09-18 | Implícita | Número, slug, ancla y posición | `009-languages`, ancla `#idiomas`, sección siguiente a "Formación" | docs/workflow.md |
| 2026-09-18 | Implícita | Encabezado de la sección | `h2` "Idiomas" con el encabezado de sección común | docs/workflow.md, designs/000-design-system |
| 2026-09-18 | Implícita | Fuente de los datos | `profile.languages`, ya validado por el esquema de `profile` desde la spec 001 | docs/workflow.md, specs/001-foundation |
| 2026-09-18 | Brecha | Certificación de inglés | Ninguna: solo el nivel del CV | usuario |
| 2026-09-18 | Brecha | Código MCER | Campo opcional `cefr` (A1–C2) separado del texto del nivel; el CV no cambia y un test comprueba que ambos juntos reproducen la línea del CV | usuario |
| 2026-09-18 | Brecha | Interacción con el puntero | El mismo spotlight común que en las secciones anteriores | usuario |
| 2026-09-18 | Implícita | Barras o porcentajes de nivel | Prohibidos: el nivel se muestra como texto (CA-1.4) | anti-cliches.md, constitution.md §8 |
| 2026-09-18 | Implícita | JavaScript | Presupuesto compartido de la home ≤ 3 kB con gzip, sin dependencias: hero, spotlight común y revelado común | specs/008-education, constitution.md §3 |
| 2026-09-18 | Implícita | Revelado | Encabezado y bloques con el revelado común al entrar en pantalla, cada vez, uniforme con 004–008 | specs/004-about, specs/008-education |
| 2026-09-18 | Diseño | Composición de la sección | C · Escala sin la escala A1…C2: dos cards del sistema (una columna en móvil, dos desde 768px) con idioma, nivel y una etiqueta mono (`Lengua materna`, `B2`); spotlight y revelado comunes; sin tokens ni patrones nuevos. Pendiente: refinar esta spec (`/spec 009`) para cambiar el nivel de español a "Dominio completo" con la etiqueta "Lengua materna" en `docs/cv.md` y sustituir `cefr` por el campo opcional `tag` (CA-1.2, CA-1.3, Contenido) | /design-spec |
| 2026-09-18 | Brecha | Etiqueta de la card de español y modelo de datos (pedidos en el diseño) | Campo opcional `tag` de texto no vacío en lugar de `cefr` (A1–C2): Español → `Lengua materna`, Inglés → `B2`; la etiqueta del CV se compara sin distinguir mayúsculas | usuario, designs/009-languages |
| 2026-09-18 | Conflicto | Redundancia entre "Nativo" y "Lengua materna" | El nivel de español pasa a "Dominio completo" en `docs/cv.md` y en los datos: `- **Español:** Dominio completo (lengua materna)` | usuario, designs/009-languages |
