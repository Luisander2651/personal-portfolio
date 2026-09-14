---
id: NNN
title: <Título de la spec>
spec: specs/NNN-slug/spec.md
design: designs/NNN-slug/design.md   # o "no aplica"
status: approved
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Plan — <Título>

Leyenda: `[ ]` pendiente · `[x]` hecha · `[-]` obsoleta · una tarea `[ ]` con línea
**Bloqueo** está detenida por `/implement` hasta resolver una brecha.

## Resumen

| Capa | Tareas |
|------|--------|
| Datos | T01 |
| Estructura estática | T02 |
| Estilos | T03 |
| Movimiento e interacción | T04, T05 |
| Pulido | — |
| Verificación final | T06 |

## Cobertura de criterios

| Criterio | Tareas |
|----------|--------|
| CA-1.1 | T01, T02 |

## Tareas

### [ ] T01 — <título corto>

- **Criterios**: CA-1.1
- **Diseño**: — | `<artboard>` · `M-n`
- **Archivos**: `ruta/archivo` (crear | modificar)
- **Qué hacer**: <estructura: componentes, campos, props principales, técnica>
- **Test**: <qué comprueba el test de Vitest>
- **Terminado cuando**:
  - Test en verde.
  - <condición concreta>

### [ ] T0N — Verificación final

- **Criterios**: todos
- **Diseño**: todas las pantallas de `design.md`
- **Archivos**: —
- **Qué hacer**: verificación completa de la spec.
- **Test**: cada CA tiene al menos un test (listar CA → archivo de test).
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - Reduced-motion revisado en todas las animaciones.
  - Contraste WCAG AA y navegación por teclado comprobados.
  - Revisión visual contra el canvas en móvil y escritorio.
  - Lighthouse ≥ 90 en todas las categorías (`bun run preview`).

## Registro de decisiones

| Fecha | Tipo | Decisión | Motivo |
|-------|------|----------|--------|
| YYYY-MM-DD | Creación | Plan inicial | — |
