---
id: 012
title: SEO y metadatos
spec: specs/012-seo-metadata/spec.md
status: approved
canvas: https://claude.ai/artifact/PDypkF76GZLqEUBMHuDeyg
created: 2026-09-18
updated: 2026-09-18
---

# Diseño — SEO y metadatos

## Dirección elegida

Combinación de dos de las tres direcciones exploradas (A · Tarjeta, B · Índice, C · Código):

- **Imagen Open Graph: A · Tarjeta** — la tarjeta del hero, con borde luminoso, sobre la
  cuadrícula y el halo de la página.
- **Icono del sitio: B · Índice** — "LM" en mono con el punto de luz de la marca.

- **Motivo**: la imagen OG repite la primera pantalla del sitio, así que el enlace compartido y
  la web se reconocen como la misma pieza; el icono usa las letras de la marca "LMGV" de la
  barra, reconocible en la pestaña.
- **Riesgo asumido**: a 16 px "LM" queda justo → trazo grueso (peso 600) y alto contraste; se
  acepta tras revisarlo en pestañas oscuras y claras en el canvas.

## Pantallas

| Pieza | Artboard | Criterios de la spec que cubre |
|-------|----------|--------------------------------|
| Imagen Open Graph 1200×630 | `A · Tarjeta — Imagen OG 1200×630` (y su vista previa como enlace compartido en `A · Tarjeta — Icono y vista previa`) | CA-2.1, CA-2.2 |
| Icono a 180, 32 y 16 px; pestaña oscura y clara | `B · Índice — Icono y vista previa` | CA-3.1 |

## Imagen Open Graph (A · Tarjeta)

- **Lienzo**: 1200×630 px, fondo de página: `--color-bg`, halo superior (`--page-halo` de
  escritorio) y cuadrícula `--color-grid-line` cada 48 px. Margen seguro de 64 px en todos los
  bordes.
- **Marca** (arriba a la izquierda, a 64 px): cuadrado de luz `--color-glow` con halo y "LMGV"
  en `--font-mono`, peso 600, tracking amplio, `--color-text`.
- **Tarjeta** centrada (ligeramente por debajo del centro óptico), 820 px de ancho, padding
  48 × 56 px, radio 24 px, fondo `--color-surface`, borde luminoso `--border-glow` de 2 px y
  halo cian (`--shadow-glow-hero` ampliado), en columna con separación de 22 px:
  1. Ubicación (`profile.location`) en mayúsculas, `--font-mono`, 18 px,
     `--color-text-muted`.
  2. Nombre (`profile.name`) a 60 px, peso 600, tracking negativo, `--color-text`.
  3. Rol (`profile.role`) a 28 px, `--color-text-secondary`.
  4. Etiquetas de tecnología del sistema con `profile.featuredStack` (TypeScript, Node.js,
     Laravel 12, Spring Boot), en `--font-mono`, fondo `--color-tag-bg`, borde
     `--color-border`, texto `--color-tag-text`.
- **Sin fotografía** ni otros textos.
- **Archivo**: `public/og-image.png`, PNG de 1200×630, ≤ 300 kB. Se genera una vez a partir
  de este diseño con las fuentes Geist y Geist Mono del sitio; si cambian el nombre, el rol, la
  ubicación o el stack, se regenera.

## Icono del sitio (B · Índice)

- **Dibujo** en una retícula de 64 × 64: cuadrado con radio 14, fondo `--color-bg` y borde de
  1 unidad en `--color-border-strong`; "LM" centrado (línea base en 42) en Geist Mono 600,
  tamaño 26, tracking −0,5, `--color-text`; punto de luz `--color-glow` de radio 3,5 centrado
  en (14, 14).
- **`favicon.svg`**: el dibujo anterior con "LM" **convertido a trazos** (paths), sin
  depender de fuentes del sistema, y sin filtros.
- **`favicon-32.png`** (32×32) y **`apple-touch-icon.png`** (180×180): el mismo dibujo
  rasterizado a cada tamaño.
- **`theme-color`**: `--color-bg` (`#05070D`), coherente con el fondo del icono y del sitio.

## Especificación de movimiento

No aplica: la imagen Open Graph y los iconos son archivos estáticos.

## Cambios a incorporar al sistema

Ninguno: sin tokens nuevos ni patrones de interfaz nuevos.

## Accesibilidad

- **Contraste** (tokens del sistema): nombre `--color-text` 16.2:1 y rol
  `--color-text-secondary` 12.8:1 sobre `--color-surface`; ubicación `--color-text-muted`
  6.5:1; "LM" `--color-text` 17.1:1 sobre `--color-bg`.
- **Texto alternativo**: `og:image:alt` = "Nombre — Rol" (spec 012, CA-2.1).
- Los iconos son decorativos para el navegador; no afectan a la navegación por teclado.

## Anti-clichés

- **Foto circular / avatar genérico**: no hay fotografía ni ilustraciones; solo datos y el
  lenguaje del sitio (grid, luz, mono).
- **Métricas o frases inventadas**: solo `profile` (nombre, rol, ubicación y stack destacado).
- **Gradiente morado-rosa**: solo azules y cian del sistema.

## Registro de decisiones

| Fecha | Tipo | Pregunta / Conflicto | Decisión | Fuente |
|-------|------|----------------------|----------|--------|
| 2026-09-18 | Brecha | Qué explorar | 3 direcciones, cada una con imagen OG e icono: A · Tarjeta, B · Índice, C · Código | usuario |
| 2026-09-18 | Diseño | Imagen Open Graph | A · Tarjeta | usuario |
| 2026-09-18 | Diseño | Icono del sitio | B · Índice ("LM" mono con punto de luz) | usuario |
| 2026-09-18 | Implícita | Texto en el favicon SVG | "LM" convertido a trazos, para no depender de las fuentes del sistema | designs/012-seo-metadata (canvas) |
| 2026-09-18 | Implícita | Datos de la imagen OG | `profile.location`, `name`, `role` y `featuredStack`, sin fotografía | docs/cv.md, anti-cliches.md |
