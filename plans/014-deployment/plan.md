---
id: 014
title: Despliegue
spec: specs/014-deployment/spec.md
design: —
status: approved
created: 2026-09-22
updated: 2026-09-22
---

# Plan — Despliegue

Leyenda: `[ ]` pendiente · `[x]` hecha · `[-]` obsoleta · una tarea `[ ]` con línea
**Bloqueo** está detenida por `/implement` hasta resolver una brecha.

## Resumen

| Capa | Tareas |
|------|--------|
| Integración continua | T01 |
| Configuración del hosting | T02 |
| Documentación | T03 |
| Verificación final | T04 |

## Cobertura de criterios

| Criterio | Tareas |
|----------|--------|
| CA-1.1 | T01 |
| CA-1.2 | T01 |
| CA-1.3 | T03 |
| CA-2.1 | T02 |
| CA-2.2 | T02 |
| CA-2.3 | T02 |
| CA-2.4 | T01, T02 |
| CA-3.1 | T04 |
| CA-3.2 | T04 |
| CA-3.3 | T04 |

## Tareas

### [ ] T01 — Workflow de integración continua

- **Criterios**: CA-1.1, CA-1.2, CA-2.4
- **Diseño**: —
- **Archivos**: `.github/workflows/ci.yml` (crear), `tests/project/ci-workflow.test.ts` (crear)
- **Qué hacer**: workflow de GitHub Actions con un único trabajo que:
  - se dispara en `push` a `main` y en `pull_request`;
  - hace checkout del repositorio y prepara Bun con la acción oficial de Bun;
  - instala con `bun install --frozen-lockfile`;
  - ejecuta `bun run test` y después `bun run build`;
  - no despliega, no define secretos ni variables de entorno propias y no añade dependencias
    al proyecto.
- **Test** (`ci-workflow.test.ts`): el archivo existe; declara los disparadores `push` sobre
  `main` y `pull_request`; instala con `--frozen-lockfile`; ejecuta `bun run test` y
  `bun run build`, en ese orden; no menciona `secrets.`, `vercel` ni pasos de despliegue;
  `package.json` no gana dependencias.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.

### [ ] T02 — Cabeceras del hosting

- **Criterios**: CA-2.1, CA-2.2, CA-2.3, CA-2.4
- **Diseño**: —
- **Archivos**: `vercel.json` (crear), `tests/project/vercel-config.test.ts` (crear)
- **Qué hacer**: `vercel.json` con dos entradas en `headers`:
  - `/_astro/*`: `Cache-Control: public, max-age=31536000, immutable`;
  - todas las rutas: `X-Content-Type-Options: nosniff`,
    `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY` y
    `Permissions-Policy` que desactiva cámara, micrófono y geolocalización.

  Sin `redirects`, `rewrites`, `cleanUrls`, `trailingSlash` ni cualquier otra opción que
  cambie las rutas del sitio.
- **Test** (`vercel-config.test.ts`): el archivo se analiza como JSON; la regla de `/_astro/*`
  con su `Cache-Control` exacto; la regla general con las cuatro cabeceras y sus valores;
  el objeto no tiene claves que alteren rutas (`redirects`, `rewrites`, `cleanUrls`,
  `trailingSlash`).
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.

### [ ] T03 — Documento de despliegue

- **Criterios**: CA-1.3
- **Diseño**: —
- **Archivos**: `docs/deployment.md` (crear), `tests/project/deployment-docs.test.ts` (crear)
- **Qué hacer**: `docs/deployment.md` en español, con:
  - hosting (Vercel), repositorio (`github.com/Luisander2651/personal-portfolio`), rama de
    producción (`main`) y URL de producción;
  - el flujo `push a main → build en Vercel → publicación`, y qué hace la CI de GitHub (avisa,
    no bloquea);
  - los comandos locales `bun run dev`, `bun run test`, `bun run build` y `bun run preview`;
  - cómo volver a una versión anterior desde el panel de Vercel;
  - la lista de verificación posterior al despliegue (home con sus seis secciones,
    `robots.txt`, `sitemap.xml`, 404 y Lighthouse);
  - qué refinar en la spec 012 si algún día cambia la URL.
- **Test** (`deployment-docs.test.ts`): el documento existe y contiene la URL de producción, el
  repositorio, la rama, los cuatro comandos y las secciones de reversión y de verificación; la
  URL coincide con `site` de `astro.config.mjs`.
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.

### [ ] T04 — Verificación final

- **Criterios**: todos
- **Diseño**: —
- **Archivos**: `docs/workflow.md` (modificar, para cerrar el roadmap)
- **Qué hacer**: verificación completa de la spec y cierre del roadmap.
- **Test**: cada CA tiene cobertura:
  - CA-1.1, CA-1.2 → `tests/project/ci-workflow.test.ts`
  - CA-1.3 → `tests/project/deployment-docs.test.ts`
  - CA-2.1, CA-2.2, CA-2.3, CA-2.4 → `tests/project/vercel-config.test.ts`
  - CA-3.1, CA-3.2 → comprobación manual en producción
  - CA-3.3 → revisión de `docs/workflow.md`
- **Terminado cuando**:
  - `bun run test` y `bun run build` en verde.
  - En producción, tras `git push` y el despliegue de Vercel: la home responde 200 con sus seis
    secciones; `/robots.txt` y `/sitemap.xml` responden 200; una ruta inexistente responde 404
    con la página de la spec 013; Lighthouse (móvil) ≥ 90 en las cuatro categorías.
  - El workflow de CI aparece en verde en GitHub para el último push.
  - Las catorce filas del roadmap de `docs/workflow.md` están en ✅ done.

## Registro de decisiones

| Fecha | Tipo | Decisión | Motivo |
|-------|------|----------|--------|
| 2026-09-22 | Creación | Plan inicial de 4 tareas | — |
| 2026-09-22 | Planificación | El `vercel.json` se analiza como JSON; el workflow se comprueba con aserciones sobre su texto (disparadores, pasos y comandos), sin analizador de YAML | El proyecto no tiene analizador de YAML y añadir uno exigiría justificar una dependencia nueva (constitución §1) |
| 2026-09-22 | Planificación | Tests del repositorio en `tests/project/` | Separa las comprobaciones de configuración de las de `src/` |
| 2026-09-22 | Planificación | El cierre del roadmap (14 filas en ✅) se hace en la verificación final (T04) | Es la última spec del roadmap |
