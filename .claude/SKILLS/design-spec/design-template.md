---
id: NNN
title: <Título de la spec>
spec: specs/NNN-slug/spec.md
status: approved
canvas: <URL del Artifact de /design>
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Diseño — <Título>

## Dirección elegida

<Dirección A/B/C, elementos combinados y motivo.>

## Pantallas

| Pantalla | Artboard móvil | Artboard escritorio | Criterios de la spec que cubre |
|----------|----------------|---------------------|--------------------------------|
| <nombre> | <nombre del artboard> | <nombre del artboard> | CA-1.1, CA-1.2 |

## Composición y jerarquía

<Layout por breakpoint, orden de lectura, momento protagonista de la pantalla.>

## Componentes

<Componentes del sistema usados, variantes nuevas (con justificación) y estados.>

## Especificación de movimiento

### M-1 — <nombre>

- **Disparador**: <carga | scroll al entrar en viewport | hover | clic | navegación>
- **Elementos**: <qué se anima>
- **Propiedades**: <transform, opacity, filter…>
- **Duración / easing**: `--duration-…` / `--ease-…`
- **Estado inicial → final**: <descripción>
- **Secuencia / stagger**: <orden y retrasos, si aplica>
- **Implementación**: CSS | View Transitions | Motion
- **Justificación de Motion**: <solo si aplica: por qué CSS no basta>
- **Reduced motion**: <versión estática equivalente>
- **Táctil**: <alternativa si depende del cursor>
- **Fotogramas en canvas**: <artboards de referencia>

## Accesibilidad

<Contrastes verificados, foco visible, orden de tabulación, textos alternativos,
contenido disponible sin animación.>

## Anti-clichés

<Clichés evaluados y cómo se evitaron.>

## Registro de decisiones

| Fecha | Tipo | Pregunta / Conflicto | Decisión | Fuente |
|-------|------|----------------------|----------|--------|
