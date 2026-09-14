---
name: design-spec
description: Diseña la interfaz visual y el movimiento de una spec del portafolio (o el sistema de diseño global) usando internamente la skill `/design`. Explora 2-3 direcciones creativas tech premium, valida contra clichés de portafolio, documenta tokens y especificación de animaciones en `designs/NNN-slug/design.md` y enlaza el resultado en la spec. Usar cuando haya que diseñar una spec o el sistema de diseño.
argument-hint: "<id de spec, p. ej. 003> | system"
---

# /design-spec — Diseño visual y de movimiento

Tu trabajo es producir un diseño **creativo, tecnológico y memorable** — nunca un
portafolio genérico o reciclado — y documentarlo para que pueda implementarse sin
ambigüedad. **Nunca** escribes código, tests, planes ni tareas.

El diseño visual se genera **siempre** invocando la skill `design` con la herramienta
`Skill`. No uses ninguna otra herramienta para generar mockups.

Entrada: `$ARGUMENTS`

## 1. Cargar contexto

Lee completos:
- `docs/constitution.md` (máxima jerarquía), `AGENTS.md`, `docs/cv.md`.
- [creative-direction.md](creative-direction.md) — dirección creativa fijada del proyecto.
- [anti-cliches.md](anti-cliches.md) — lista de clichés prohibidos.
- `designs/000-design-system/design.md` si existe.
- La spec objetivo `specs/NNN-slug/spec.md` y su `designs/NNN-slug/design.md` si existe.

## 2. Determinar el modo

1. **Sistema** — si `$ARGUMENTS` es `system` **o** no existe
   `designs/000-design-system/design.md`. Si el usuario pidió una spec pero no hay sistema,
   explícalo y diseña primero el sistema: ninguna spec se diseña sin sistema aprobado.
2. **Spec** — si `$ARGUMENTS` es un id o carpeta de `specs/`.
   - La spec debe estar en `active` o `draft`. Si está en `done`, pide confirmación.
   - Si no existe la spec, detente y sugiere ejecutar `/spec`.
3. **Refinar** — si ya existe `designs/NNN-slug/design.md`: pregunta si se regenera el
   canvas desde cero (nuevo `/design`) o solo se actualiza la documentación. Los ajustes
   finos del canvas se hacen en el propio Artifact publicado, no relanzando `/design`.

## 3. Cerrar brechas antes de diseñar

Con `AskUserQuestion`, en rondas de hasta 4 preguntas y opción recomendada primero,
resuelve solo lo que no respondan las fuentes. Típicamente:
- Contenido real a mostrar (debe existir en `docs/cv.md`; si no, preguntar).
- Pantallas y estados necesarios (vacío, hover, foco, carga, error).
- Qué momentos merecen animación protagonista y cuáles deben ser sobrios.
- Contradicciones entre la spec, la dirección creativa y la constitución: cita ambas
  fuentes, propone resolución (constitución > AGENTS.md > sistema de diseño > spec) y pregunta.

## 4. Explorar direcciones con `/design`

Construye un **brief** y pásalo como `args` al invocar la skill `design`:

```
Proyecto: portafolio personal de un Software Engineer (Astro, sitio estático).
Modo: <sistema | spec NNN-slug>
Objetivo: <objetivo de la spec o del sistema>
Dirección creativa: <resumen de creative-direction.md>
Sistema de diseño: <tokens clave de 000-design-system, o "a definir" en modo sistema>
Contenido real: <textos y datos exactos de cv.md; nunca lorem ipsum ni datos inventados>
Artboards requeridos:
  - Direcciones A, B y C (2-3 propuestas claramente distintas entre sí)
  - Cada dirección en móvil (390px) y escritorio (1440px)
  - Estados clave: <hover, foco, vacío…>
  - Momentos de animación como secuencia de fotogramas anotados (inicio → medio → final)
Restricciones: paleta azul/negro, contraste WCAG AA, foco visible, sin clichés de anti-cliches.md.
```

En **modo sistema** los artboards son *style tiles*: paleta, tipografía (sans + mono),
escala de espaciado, radios, bordes luminosos y glow, botones, cards con spotlight,
bloque de código, enlaces, iconografía y una muestra del hero código → UI.

Tras publicar, comparte el enlace del canvas y pide al usuario con `AskUserQuestion`
que elija una dirección (o combine elementos). Si pide cambios mayores, reinvoca
`/design` con el brief ajustado.

## 5. Validación anti-clichés y constitución

Revisa la dirección elegida contra [anti-cliches.md](anti-cliches.md) y la constitución.
Si detectas un cliché o un conflicto, muéstralo y propone una alternativa concreta antes
de documentar.

## 6. Documentar

Crea o actualiza el archivo espejo (mismo nombre de carpeta que la spec):
- Modo sistema → `designs/000-design-system/design.md` con [system-template.md](system-template.md).
- Modo spec → `designs/NNN-slug/design.md` con [design-template.md](design-template.md).

Cada animación documentada debe tener: disparador, elementos, propiedades animadas,
duración y easing (usando tokens del sistema), estados inicial y final, implementación
(`CSS` | `View Transitions` | `Motion`), justificación si usa Motion, y **versión
`prefers-reduced-motion`** equivalente y cuidada.

En modo spec, actualiza la sección **Diseño** de `specs/NNN-slug/spec.md` con el enlace
al canvas y a `designs/NNN-slug/design.md` (invocar `/design-spec` sobre la spec cuenta
como petición explícita para esta modificación) y añade la entrada en su registro de decisiones.

## 7. Checklist de calidad

- [ ] Existe sistema de diseño aprobado (o este es el sistema).
- [ ] Se exploraron 2-3 direcciones y el usuario eligió una.
- [ ] Artboards de móvil y escritorio para cada pantalla.
- [ ] Ningún cliché de `anti-cliches.md`.
- [ ] Contraste WCAG AA y foco visible definidos.
- [ ] Todo el contenido proviene de `docs/cv.md`.
- [ ] Toda animación tiene versión reduced-motion y anima solo `transform`, `opacity`
      o `filter` (salvo justificación).
- [ ] Motion solo se usa donde CSS o View Transitions no bastan, y está justificado.
- [ ] Solo se usan tokens del sistema de diseño (sin valores sueltos).
- [ ] Ningún efecto compromete Lighthouse ≥ 90: si hay duda, se simplifica.
- [ ] No incluye código de implementación, tareas ni plan.

## 8. Aprobación

Muestra un resumen (dirección elegida, enlace al canvas, pantallas, animaciones y su
coste, resultado del checklist) y pide aprobación explícita con `AskUserQuestion`
antes de escribir `design.md` y modificar la spec. Tras aprobar, sugiere el siguiente
paso: `/plan-spec NNN`.
