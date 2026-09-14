---
name: spec
description: Diseña o refina una especificación en `specs/` para el portafolio. Cierra brechas con preguntas, resuelve contradicciones con la constitución, AGENTS.md, cv.md y otras specs, y guarda `specs/NNN-slug/spec.md` tras checklist de calidad y aprobación explícita. Usar cuando el usuario quiera crear, definir o refinar una spec.
argument-hint: "<idea de la spec> | <id de spec existente, p. ej. 002>"
---

# /spec — Diseño de especificaciones

Tu único trabajo es producir una especificación clara, sin brechas ni contradicciones.
**Nunca** escribes código, tests, planes, tareas ni diseño visual (el diseño se hace
exclusivamente con `/design-spec`).

Entrada: `$ARGUMENTS`

## 1. Cargar contexto (siempre, antes de preguntar nada)

Lee completos:
- `docs/constitution.md` — máxima jerarquía.
- `AGENTS.md`
- `docs/cv.md` — única fuente de datos profesionales.
- Todas las `specs/*/spec.md` existentes (frontmatter y contenido).

Determina el modo:
- **Refinar**: si `$ARGUMENTS` es un id (`002`) o nombre de carpeta existente en `specs/`.
  Invocar `/spec` sobre ella cuenta como petición explícita para modificarla.
- **Crear**: en cualquier otro caso. Si `$ARGUMENTS` está vacío, pregunta primero qué
  se quiere especificar.

## 2. Análisis de brechas y contradicciones

Antes de preguntar, construye internamente dos listas:

**Brechas** — todo lo que impida escribir criterios de aceptación verificables. Revisa como mínimo:
- Objetivo y público (visitante, reclutador, cliente…).
- Contenido exacto: qué datos se muestran y si existen en `docs/cv.md`.
- Comportamiento en móvil / escritorio.
- Estados vacíos, errores, enlaces externos, datos faltantes.
- Interactividad: ¿requiere isla de JS o basta con `.astro` estático?
- Accesibilidad y rendimiento específicos de la funcionalidad.
- Límites de alcance: qué queda fuera.
- Dependencias con otras specs.

**Contradicciones** — choques entre la petición y:
- La constitución (p. ej. pide Tailwind, pide un backend, pide datos que no están en cv.md).
- AGENTS.md (estilo, paleta azul/negro, reglas).
- Otras specs existentes (comportamientos o alcances incompatibles).
- La propia petición (requisitos que se excluyen entre sí).

No preguntes lo que ya responden la constitución, AGENTS.md, cv.md u otras specs:
aplícalo y anótalo en el registro de decisiones.

## 3. Rondas de preguntas

- Usa `AskUserQuestion` en rondas de **hasta 4 preguntas** agrupadas por tema.
- Cada pregunta tiene opciones concretas y, cuando haya una mejor, la primera va marcada
  con `(Recomendado)`.
- **Sin límite de rondas**: repite análisis → preguntas hasta que no quede ninguna brecha
  ni contradicción. Cada respuesta puede abrir brechas nuevas; reanalízalas.
- Prioriza por orden: contradicciones → alcance → contenido → comportamiento → detalles.

### Resolución de contradicciones

Por cada contradicción:
1. Explica el conflicto citando ambas fuentes (archivo y texto exacto).
2. Propón una resolución recomendada, respetando la jerarquía:
   constitución > AGENTS.md > specs existentes > petición actual.
3. Pregunta al usuario. Opciones típicas: ajustar la petición, ajustar la otra spec
   (solo si el usuario lo pide), o descartar el requisito.
4. **Nunca** modifiques `docs/constitution.md` ni `AGENTS.md` salvo petición explícita.
5. Anota la decisión en el registro de decisiones.

Si un dato profesional no está en `docs/cv.md`, no lo inventes: pregunta si se añade
al CV o si se excluye de la spec.

## 4. Redacción

Crear: carpeta `specs/NNN-slug/` donde `NNN` es el siguiente número de 3 dígitos y `slug`
es kebab-case en inglés (p. ej. `003-projects-grid`). Archivo único: `spec.md`, basado
en [template.md](template.md). Contenido en español.

Refinar: edita la `spec.md` existente conservando el registro de decisiones previo y
añadiendo las nuevas entradas con fecha.

Reglas de redacción:
- Criterios de aceptación en formato **Dado / Cuando / Entonces**, cada uno verificable
  con Vitest o con `bun run build`.
- Sin palabras vagas ("rápido", "bonito", "intuitivo") sin una métrica asociada.
- La sección **Diseño** enlaza a `designs/NNN-slug/design.md` si existe; si no, indica
  `Pendiente: ejecutar /design-spec NNN`. Si la spec no tiene interfaz visual
  (p. ej. configuración del proyecto), indica `No aplica: spec sin interfaz`.
  Nunca generes el diseño tú.
- Las specs describen qué debe ocurrir (incluido qué debe sentirse animado o destacado),
  no cómo se anima: duraciones, easings y técnica pertenecen a `/design-spec`.

## 5. Checklist de calidad (antes de mostrar al usuario)

Verifica y corrige hasta que todo se cumpla:
- [ ] No quedan brechas ni contradicciones sin resolver.
- [ ] Cada historia de usuario tiene al menos un criterio Dado/Cuando/Entonces.
- [ ] Todos los criterios son testeables y sin ambigüedad.
- [ ] Cumple cada principio de `docs/constitution.md`.
- [ ] Ningún dato profesional fuera de `docs/cv.md`.
- [ ] "Fuera de alcance" no está vacío.
- [ ] El registro de decisiones refleja todas las preguntas y resoluciones.
- [ ] No incluye código, tareas ni plan técnico.

## 6. Aprobación y guardado

1. Muestra un resumen: objetivo, nº de historias y criterios, fuera de alcance,
   decisiones clave y resultado del checklist.
2. Pide aprobación explícita con `AskUserQuestion`, incluyendo el estado con el que se
   guarda: `draft` o `active`.
3. Solo puede haber **una** spec `active`. Si ya existe otra, pregunta si pasa a
   `draft` o `done` antes de cambiarla.
4. Si el usuario pide cambios, vuelve al paso 3 o 4 según corresponda.
5. Escribe el archivo solo tras la aprobación y confirma la ruta final.
