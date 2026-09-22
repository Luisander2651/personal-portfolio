---
id: 014
title: Despliegue
status: active
created: 2026-09-22
updated: 2026-09-22
depends_on: [001, 012, 013]
---

# Despliegue

## Objetivo

Dejar el despliegue del sitio documentado y con garantías: que cada push ejecute los tests y el
build en GitHub, que Vercel sirva los archivos con las cabeceras adecuadas y que el sitio
publicado se verifique con una lista concreta. Es la última spec del roadmap
(`docs/workflow.md`).

## Historias de usuario

- **HU-1**: Como autor, quiero que cada cambio que subo ejecute los tests y el build y que el
  despliegue esté documentado, para publicar sin miedo y saber qué hacer si algo falla.
- **HU-2**: Como visitante, quiero que los archivos del sitio se sirvan con buen rendimiento y
  con cabeceras de seguridad razonables.
- **HU-3**: Como autor, quiero comprobar el sitio ya publicado, para saber que lo que se ve en
  producción es lo que las specs anteriores verificaron en local.

## Criterios de aceptación

### HU-1

- **CA-1.1**
  - **Dado** el repositorio
  - **Cuando** inspecciono `.github/workflows/ci.yml`
  - **Entonces** existe un workflow que se dispara en cada push a `main` y en cada pull
    request, instala las dependencias con Bun usando el lockfile y ejecuta `bun run test` y
    `bun run build`; si cualquiera de los dos falla, el workflow falla
- **CA-1.2**
  - **Dado** `.github/workflows/ci.yml`
  - **Cuando** inspecciono sus pasos
  - **Entonces** no despliega el sitio, no usa secretos ni variables de entorno propias, y no
    añade dependencias a `package.json`; el despliegue lo sigue haciendo Vercel desde GitHub
- **CA-1.3**
  - **Dado** `docs/deployment.md`
  - **Cuando** lo leo
  - **Entonces** documenta el hosting (Vercel), el repositorio
    (`github.com/Luisander2651/personal-portfolio`), la URL de producción
    (`https://personal-portfolio-lemon-three-51.vercel.app`), el flujo
    `push a main → build → publicación`, los comandos locales (`bun run dev`, `bun run test`,
    `bun run build`, `bun run preview`), cómo volver a una versión anterior desde Vercel y qué
    hay que refinar (spec 012) si algún día cambia la URL

### HU-2

- **CA-2.1**
  - **Dado** `vercel.json`
  - **Cuando** inspecciono sus cabeceras
  - **Entonces** las rutas de `/_astro/*` (archivos con hash en el nombre) se sirven con
    `Cache-Control: public, max-age=31536000, immutable`
- **CA-2.2**
  - **Dado** `vercel.json`
  - **Cuando** inspecciono sus cabeceras
  - **Entonces** todas las respuestas llevan `X-Content-Type-Options: nosniff`,
    `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY` y una
    `Permissions-Policy` que desactiva cámara, micrófono y geolocalización
- **CA-2.3**
  - **Dado** `vercel.json`
  - **Cuando** inspecciono el resto de su contenido
  - **Entonces** no define redirecciones, reescrituras, `cleanUrls`, `trailingSlash` ni ninguna
    otra opción que cambie las rutas del sitio verificadas en las specs 012 y 013
- **CA-2.4**
  - **Dado** `vercel.json` y `.github/workflows/ci.yml`
  - **Cuando** se ejecutan los tests
  - **Entonces** ambos archivos se analizan (JSON y YAML) y se comprueban sus reglas, de modo
    que un error de escritura se detecta sin necesidad de desplegar

### HU-3

- **CA-3.1**
  - **Dado** el sitio publicado en la URL de producción
  - **Cuando** lo compruebo tras un despliegue
  - **Entonces** la home responde 200 y contiene las seis secciones (`#sobre-mi`,
    `#tecnologias`, `#proyectos`, `#experiencia`, `#formacion`, `#idiomas`), `/robots.txt` y
    `/sitemap.xml` responden 200 con el contenido de la spec 012, y una ruta inexistente
    responde 404 con la página de la spec 013 (verificación: manual en producción)
- **CA-3.2**
  - **Dado** la URL de producción
  - **Cuando** se ejecuta Lighthouse (móvil)
  - **Entonces** obtiene ≥ 90 en Performance, Accessibility, Best Practices y SEO
- **CA-3.3**
  - **Dado** `docs/workflow.md`
  - **Cuando** se cierra esta spec
  - **Entonces** las catorce filas del roadmap están en ✅ done

## Contenido

| Elemento | Valor |
|----------|-------|
| Hosting | Vercel (despliegue automático desde GitHub) |
| Repositorio | `github.com/Luisander2651/personal-portfolio` |
| Rama de producción | `main` |
| URL de producción | `https://personal-portfolio-lemon-three-51.vercel.app` |
| Comando de build | `bun run build` (`astro check && astro build`) |
| Salida | `dist/` |
| CI | `.github/workflows/ci.yml`: `bun install --frozen-lockfile`, `bun run test`, `bun run build` |
| Cabeceras | `vercel.json` |

## Diseño

No aplica: spec sin interfaz.

## Fuera de alcance

- Dominio propio: se mantiene el de Vercel; cambiarlo exigiría refinar la spec 012 (canónica,
  sitemap, `robots.txt` y `og:image`).
- Bloquear el despliegue cuando la CI falla (Ignored Build Step de Vercel o protección de rama):
  se configura en paneles externos, no en el repositorio.
- Entornos de staging o preview propios, analítica, monitorización y alertas.
- Despliegue manual por CLI y gestión de secretos en la CI.
- Cambiar de proveedor de hosting.

## Registro de decisiones

| Fecha | Tipo | Pregunta / Conflicto | Decisión | Fuente |
|-------|------|----------------------|----------|--------|
| 2026-09-22 | Implícita | Número, slug y alcance | `014-deployment`: conectar el repositorio a un hosting estático y verificar el sitio publicado | docs/workflow.md |
| 2026-09-22 | Brecha | Qué cubre la spec, con el sitio ya en Vercel | Documentar el despliegue, añadir CI en GitHub Actions y cabeceras en `vercel.json` | usuario |
| 2026-09-22 | Brecha | Qué hace la CI si falla | Marca el commit en rojo en GitHub; el despliegue de Vercel sigue siendo independiente | usuario |
| 2026-09-22 | Brecha | Dominio | Se mantiene el dominio de Vercel que ya usa la spec 012 | usuario |
| 2026-09-22 | Brecha | Verificación del sitio publicado | Home con sus seis secciones, `robots.txt`, `sitemap.xml`, 404 y Lighthouse móvil ≥ 90 | usuario |
| 2026-09-22 | Implícita | Gestor de paquetes en la CI | Bun con `--frozen-lockfile`; prohibido npm, yarn o pnpm | constitution.md §1 |
| 2026-09-22 | Implícita | Comandos de la CI | `bun run test` y `bun run build`, la misma puerta que exige cada tarea | constitution.md §5 |
| 2026-09-22 | Implícita | Sin interfaz | La spec no tiene pantallas: su sección Diseño dice "No aplica" | docs/workflow.md, specs/001-foundation |
