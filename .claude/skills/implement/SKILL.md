---
name: implement
description: Ejecuta una única tarea de un plan aprobado del portafolio (`plans/NNN-slug/plan.md`) con TDD rojo → verde → refactor, siguiendo la spec, el diseño y la constitución; verifica con tests, build, checklist y revisión visual en Chrome, marca la tarea y propone el commit. Usar cuando haya que implementar la siguiente tarea de una spec o una tarea concreta.
argument-hint: "<id de spec> [id de tarea], p. ej. 002 | 002 T04"
---

# /implement — Ejecutar una tarea del plan

Tu trabajo es implementar **una sola tarea** del plan, exactamente como está descrita,
y dejarla verificada. No decides requisitos, diseño ni planificación: si algo no está
resuelto en las fuentes, te detienes.

Entrada: `$ARGUMENTS`

## 1. Cargar contexto

Lee completos:
- `docs/constitution.md` (máxima jerarquía) y `AGENTS.md`.
- `plans/NNN-slug/plan.md`, `specs/NNN-slug/spec.md`.
- `designs/000-design-system/design.md` y `designs/NNN-slug/design.md` si la spec tiene interfaz.
- `docs/cv.md` si la tarea usa contenido.
- Los archivos listados en la tarea y el código cercano que vayas a tocar, para seguir
  sus convenciones.

## 2. Comprobar requisitos

Detente y explica qué ejecutar si:
- No existe el plan → `/plan-spec NNN`.
- El plan no está en `approved` (si está en `done`, informa de que no quedan tareas).
- La spec no está en `active`.
- La fecha `updated` de la spec o del diseño es posterior a la del plan → el plan puede
  estar desfasado: sugiere `/plan-spec NNN` y pregunta si continuar.

## 3. Seleccionar la tarea

- `/implement NNN` → la **primera tarea `[ ]`** del plan, en orden.
- `/implement NNN T04` → esa tarea. Si hay tareas `[ ]` anteriores, avisa de cuáles se
  saltan y pide confirmación.
- Nunca ejecutes tareas `[x]` o `[-]`.
- Si la tarea tiene una nota **Bloqueo** sin resolver, muéstrala y pregunta si ya se resolvió.

Anuncia la tarea: id, título, criterios, archivos y "terminado cuando".

## 4. Detectar brechas antes de escribir nada

Comprueba que la tarea se puede ejecutar **sin inventar decisiones**:
- ¿La tarea, la spec y el diseño concretan todo lo necesario (nombres, datos, estados, tokens)?
- ¿Hay contradicciones entre tarea, spec, diseño y constitución?
- ¿Los datos existen en `docs/cv.md`?
- ¿Se necesita una dependencia no indicada en la tarea o no permitida por la constitución?

Si hay una brecha: **detente y deriva**. No modifiques código. Añade a la tarea en
`plan.md` una línea `- **Bloqueo**: YYYY-MM-DD — <motivo> — <siguiente paso>`, explícalo
citando las fuentes y sugiere `/spec NNN`, `/design-spec NNN` o `/plan-spec NNN`.
La misma regla aplica si la brecha aparece a mitad de la tarea.

## 5. Ciclo TDD: rojo → verde → refactor

### Rojo
1. Escribe el test descrito en **Test** de la tarea (Vitest), cubriendo sus criterios.
2. Ejecuta `bun run test` y confirma que **falla por la razón esperada**.
   - Si pasa sin implementar nada: el test no prueba el comportamiento nuevo. Corrígelo;
     si el comportamiento ya existía, informa y pregunta cómo seguir.
   - Excepción: en tareas de configuración donde el runner aún no existe (p. ej. crear el
     proyecto en `001-foundation`), escribe el test en cuanto Vitest esté instalado y
     comprueba que falla antes de completar la configuración que lo hace pasar.

### Verde
3. Implementa **lo mínimo** para que el test pase, siguiendo **Qué hacer** y `design.md`.
4. Ejecuta `bun run test`.

### Refactor
5. Mejora legibilidad y elimina duplicación sin cambiar comportamiento, con tests en verde.

### Reglas durante la implementación
- **Archivos**: modifica solo los listados en la tarea. Si necesitas otro, explica por qué
  y pide confirmación; anótalo en el registro de decisiones del plan.
- **Dependencias**: solo las nombradas en la tarea y permitidas por la constitución, con
  `bun add` (nunca npm, yarn o pnpm) y **tras confirmación**. Cualquier otra es una brecha.
- **Estilos**: solo tokens del sistema de diseño, CSS nativo scoped, mobile-first.
- **Animaciones**: la técnica indicada en `design.md`, respetando el orden
  CSS → View Transitions → Web Animations API → Motion, y siempre con su rama
  `prefers-reduced-motion`. El contenido debe existir en el HTML sin JS.
- **Contenido**: solo desde Content Collections / `docs/cv.md`, nunca incrustado ni inventado.
- **Idioma**: código e identificadores en inglés; textos del sitio en español.

### Fallos
Si `bun run test` o `bun run build` fallan inesperadamente, intenta corregir hasta
**3 intentos**. Si siguen fallando, detente con un informe: error, causa probable, qué
intentaste y siguiente paso sugerido. No marques la tarea.

## 6. Verificación

1. `bun run test` y `bun run build` en verde.
2. **Autorrevisión** del diff de la tarea:
   - [ ] Cumple cada principio de `docs/constitution.md`.
   - [ ] Implementa exactamente **Qué hacer**; nada fuera del alcance de la tarea.
   - [ ] Los criterios de la tarea están cubiertos por el test.
   - [ ] Sin valores de color, tipografía, espaciado o duración sueltos: solo tokens.
   - [ ] Fiel a los artboards y animaciones de `design.md` referenciados.
   - [ ] Cada animación tiene rama reduced-motion y el contenido es visible sin JS.
   - [ ] HTML semántico, foco visible, navegable con teclado, textos alternativos.
   - [ ] Ningún dato fuera de `docs/cv.md`.
   - [ ] Solo se tocaron archivos listados o confirmados.
   Corrige lo que no cumpla y vuelve a ejecutar tests y build.
3. **Comprobaciones manuales** (si "Terminado cuando" las incluye):
   - Carga la skill `claude-in-chrome`, levanta el sitio (`bun run dev` en segundo plano)
     y abre la página en una pestaña nueva.
   - Toma capturas a 390px y 1440px de ancho, y los estados o fotogramas indicados.
   - Para reduced-motion, si no puedes emularlo desde Chrome, indica al usuario cómo
     activarlo (DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion`).
   - Muestra las capturas junto a los nombres de los artboards y el enlace al canvas, y
     pide **confirmación explícita** con `AskUserQuestion` antes de continuar.
   - Si el usuario detecta diferencias, corrígelas y repite.
   - Detén el servidor al terminar.

## 7. Cerrar la tarea

1. Marca la tarea `[x]` en `plan.md`, elimina su nota de bloqueo si la tenía y actualiza
   `updated`.
2. **Commit** (si el proyecto es un repositorio git; si aún no lo es, indícalo y omite
   este paso):
   - Muestra el resumen de cambios (`git status` / `git diff --stat`) y el mensaje propuesto.
   - Mensaje en inglés, Conventional Commits con spec y tarea:
     ```
     <type>(NNN): TNN <short description>

     Covers CA-x.y, CA-x.z
     Plan: plans/NNN-slug/plan.md
     ```
     `type`: `feat`, `fix`, `test`, `style`, `refactor`, `chore` o `docs`.
   - Tras **confirmación**, añade solo los archivos de la tarea (nunca `git add -A`) y
     haz el commit, respetando las reglas de atribución vigentes en la sesión.
   - **Nunca** hagas `git push`.
3. **Informe**: tarea completada, archivos cambiados, test añadido y criterios cubiertos,
   resultado de tests y build, decisiones anotadas, y siguiente tarea pendiente.
4. **Detente**. No encadenes la siguiente tarea.

## 8. Última tarea del plan

Si ya no quedan tareas `[ ]`:
1. Propón con `AskUserQuestion` marcar `status: done` en `plan.md` y en la spec.
2. Tras confirmación, actualiza ambos estados y sus fechas `updated`, y añade la entrada
   en el registro de decisiones de la spec.
3. Sugiere `git push` (lo ejecuta el usuario) y la siguiente spec del roadmap de
   `docs/workflow.md`.
