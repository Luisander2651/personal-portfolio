---
name: plan-spec
description: Divide una spec aprobada del portafolio en un plan de tareas pequeñas, ordenadas por capas y verificables (divide y vencerás), y lo guarda en `plans/NNN-slug/plan.md`. Cada tarea indica criterios que cubre, referencia de diseño, archivos, test y definición de terminado. No escribe código. Usar cuando haya que planificar o replanificar una spec.
argument-hint: "<id de spec, p. ej. 002>"
---

# /plan-spec — Planificación por tareas

Tu trabajo es convertir una spec (y su diseño) en un plan de **tareas pequeñas,
ordenadas y verificables** que `/implement` pueda ejecutar de una en una.
**Nunca** escribes código, tests, diseño ni modificas la spec o el diseño.

Entrada: `$ARGUMENTS`

## 1. Cargar contexto

Lee completos:
- `docs/constitution.md` (máxima jerarquía), `AGENTS.md`, `docs/cv.md`.
- `specs/NNN-slug/spec.md` (obligatorio).
- `designs/000-design-system/design.md` y `designs/NNN-slug/design.md` si existen.
- `plans/NNN-slug/plan.md` si existe (modo replanificar).
- Las specs listadas en `depends_on` (solo su frontmatter y objetivo).
- La estructura actual de `src/` y `tests/`, si existen, para usar rutas reales.

Si `$ARGUMENTS` está vacío, pregunta qué spec planificar.

## 2. Comprobar requisitos de entrada

Detente y explica qué falta (sin crear nada) si:
- La spec no existe → sugiere `/spec`.
- La spec no está en `active` → sugiere activarla con `/spec NNN`.
- La spec tiene interfaz y no existe `designs/NNN-slug/design.md` en `approved` →
  sugiere `/design-spec NNN`.
  - Una spec **sin interfaz** (p. ej. `001-foundation`) debe declararlo en su sección
    Diseño ("No aplica: spec sin interfaz"); en ese caso no se exige diseño.
- Alguna spec de `depends_on` no está en `done` → avisa y pregunta si se planifica igualmente.

## 3. Detectar brechas y contradicciones

Busca todo lo que impida planificar sin inventar decisiones:
- Criterios de aceptación ambiguos o no verificables.
- Criterios sin pantalla o animación en el diseño, o elementos del diseño sin criterio.
- Contradicciones entre spec, diseño, sistema de diseño y constitución
  (p. ej. el diseño usa Motion donde CSS bastaría, datos que no están en `cv.md`).

Si encuentras alguna: **detente**. Explica cada problema citando las fuentes y propone
el paso correcto (`/spec NNN` o `/design-spec NNN`). El plan nunca corrige la spec ni
el diseño por su cuenta.

Solo pregunta con `AskUserQuestion` (rondas de hasta 4, opción recomendada primero)
por decisiones **de planificación** que las fuentes no resuelvan, por ejemplo cómo
agrupar dos piezas muy acopladas. Anota las respuestas en el registro de decisiones del plan.

## 4. Dividir en tareas (divide y vencerás)

### Granularidad

Una tarea = **una unidad verificable** con su test: un esquema, una función de `src/lib/`,
un componente, un patrón de estilos, una animación. Debe caber en una ejecución de
`/implement` y un commit.

### Orden por capas

1. **Datos**: esquemas de Content Collections, funciones puras de `src/lib/`.
2. **Estructura estática**: componentes `.astro` semánticos con contenido real, sin JS.
3. **Estilos**: aplicación de tokens del sistema de diseño, responsive mobile-first.
4. **Movimiento e interacción**: en el orden de preferencia de la constitución
   (CSS → View Transitions → Web Animations API → Motion). Cada animación con su versión reduced-motion.
5. **Pulido**: estados de foco, casos vacíos, ajustes de accesibilidad.
6. **Verificación final** (obligatoria, siempre la última).

El sitio debe funcionar y ser accesible sin JS antes de cualquier tarea de animación.
En specs sin interfaz, adapta las capas (p. ej. configuración → tokens → esquemas →
verificación) manteniendo la verificación final.

### Límite

Máximo **~10 tareas** incluida la verificación final. Si salen más, la spec es demasiado
grande: detente y propone cómo dividirla con `/spec`.

### Contenido de cada tarea

Usa [template.md](template.md). Cada tarea tiene:
- **Criterios**: CA de la spec que cubre (toda CA debe quedar cubierta por al menos una tarea).
- **Diseño**: pantalla/artboard y animación (`M-n`) de `design.md`, o `—`.
- **Archivos**: rutas a crear o modificar.
- **Qué hacer**: nivel **estructura** — nombres de componentes, campos de esquemas,
  props principales y técnica de animación. Sin código, firmas completas ni implementación.
- **Test**: qué comprueba el test de Vitest (sin código). `/implement` lo escribe primero.
- **Terminado cuando**: condiciones concretas.

### Tareas visuales y de animación

Vitest no verifica bien lo visual. En esas tareas:
- **Test**: lo verificable — estructura, atributos, clases o variables CSS con tokens,
  existencia de la rama `prefers-reduced-motion`, que el contenido es visible sin JS.
- **Terminado cuando**: añade una **comprobación manual** contra el canvas
  (artboards concretos) y con reduced-motion activado.

### Verificación final (obligatoria)

La última tarea comprueba:
- Todas las CA de la spec cubiertas por tests (lista CA → test).
- `bun run test` y `bun run build` en verde.
- Reduced-motion revisado en todas las animaciones.
- Contraste WCAG AA y navegación por teclado.
- Revisión visual contra el canvas en móvil y escritorio.
- Lighthouse ≥ 90 en todas las categorías (DevTools de Chrome sobre `bun run preview`).

## 5. Replanificar (si ya existe `plan.md`)

- Conserva las tareas `[x]` tal cual.
- Marca como `[-]` (obsoleta) las tareas pendientes que ya no apliquen, indicando el motivo.
- Añade tareas nuevas con numeración correlativa (nunca reutilices números).
- Si un cambio invalida una tarea ya hecha, añade una tarea nueva para ajustarla.
- Revisa las notas **Bloqueo** que haya dejado `/implement`: si el cambio las resuelve,
  elimínalas y ajusta la tarea; si no, mantenlas.
- Mantén la verificación final como última tarea pendiente.
- Registra el cambio y su causa en el registro de decisiones y actualiza `updated`.

## 6. Checklist de calidad

- [ ] Requisitos de entrada cumplidos (spec `active`; diseño `approved` o spec sin interfaz).
- [ ] Sin brechas ni contradicciones pendientes.
- [ ] Cada CA de la spec está cubierta por al menos una tarea.
- [ ] Cada animación de `design.md` tiene tarea y versión reduced-motion.
- [ ] Orden por capas: nada de animación antes de la estructura estática.
- [ ] Cada tarea tiene criterios, diseño, archivos, qué hacer, test y terminado cuando.
- [ ] Máximo ~10 tareas; la última es la verificación final.
- [ ] Toda función de `src/lib/` y todo esquema tiene test (constitución §5).
- [ ] Motion solo donde `design.md` lo justifica.
- [ ] Ningún dato fuera de `docs/cv.md`.
- [ ] Sin código ni firmas completas.

## 7. Aprobación y guardado

1. Muestra un resumen: nº de tareas por capa, lista de tareas (una línea cada una),
   matriz CA → tareas y resultado del checklist.
2. Pide aprobación explícita con `AskUserQuestion`.
3. Si hay cambios, vuelve al paso 4.
4. Tras aprobar, escribe `plans/NNN-slug/plan.md` (mismo nombre de carpeta que la spec)
   con `status: approved`.
5. Sugiere el siguiente paso: `/implement NNN`.

Estados del plan: `approved` (listo o en curso) → `done` (lo marca `/implement` cuando
todas las tareas están `[x]`).
