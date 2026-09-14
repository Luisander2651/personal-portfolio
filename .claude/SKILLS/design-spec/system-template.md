---
id: "000"
title: Sistema de diseño
status: approved
canvas: <URL del Artifact de /design>
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Sistema de diseño

## Dirección elegida

<Dirección A/B/C elegida, qué se combinó de otras y por qué.>

## Color

| Token | Valor | Uso | Contraste sobre fondo |
|-------|-------|-----|-----------------------|
| `--color-bg` | `#…` | Fondo base | — |
| `--color-surface` | `#…` | Cards, paneles | — |
| `--color-text` | `#…` | Texto principal | ≥ 4.5:1 |
| `--color-text-muted` | `#…` | Texto secundario | ≥ 4.5:1 |
| `--color-accent` | `#…` | Azul de marca | — |
| `--color-glow` | `#…` | Bordes luminosos, spotlight | — |

## Tipografía

| Token | Familia | Pesos | Uso |
|-------|---------|-------|-----|
| `--font-sans` | <familia> | … | Contenido |
| `--font-mono` | <familia> | … | Código, etiquetas, metadatos |

Escala: <tamaños y line-height por nivel, móvil y escritorio>.

## Espaciado, radios y bordes

<Escala de espaciado, radios, grosor y estilo de bordes luminosos, glow.>

## Componentes base

<Botón, enlace, card con spotlight, etiqueta mono, bloque de código, navegación.
Para cada uno: anatomía, estados (reposo, hover, foco, activo, deshabilitado) y artboard de referencia.>

## Tokens de movimiento

| Token | Valor | Uso |
|-------|-------|-----|
| `--duration-fast` | `…ms` | Microinteracciones |
| `--duration-base` | `…ms` | Reveals |
| `--duration-slow` | `…ms` | Momentos protagonistas |
| `--ease-out` | `cubic-bezier(…)` | Entradas |
| `--ease-in-out` | `cubic-bezier(…)` | Transformaciones |

## Patrones de movimiento

<Reveal al scroll, scramble de texto, spotlight, borde luminoso animado, View Transition
entre páginas, hero código → UI. Para cada patrón: descripción, implementación
(CSS | View Transitions | Motion), versión reduced-motion.>

## Reglas de uso

- <Un momento protagonista por pantalla, límites de glow, etc.>

## Registro de decisiones

| Fecha | Decisión | Motivo | Fuente |
|-------|----------|--------|--------|
