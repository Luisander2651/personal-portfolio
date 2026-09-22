# Despliegue — personal-website

Dónde vive el sitio, cómo se publica y qué comprobar después. Referencia:
[specs/014-deployment](../specs/014-deployment/spec.md).

## Dónde vive

| Elemento | Valor |
|----------|-------|
| Hosting | Vercel (despliegue automático desde GitHub) |
| Repositorio | `github.com/Luisander2651/personal-portfolio` |
| Rama de producción | `main` |
| URL de producción | https://personal-portfolio-lemon-three-51.vercel.app |
| Comando de build | `bun run build` (`astro check && astro build`) |
| Salida | `dist/` |
| Cabeceras | `vercel.json` |

## Flujo de despliegue

```
commit en local → git push a main → Vercel construye el sitio → publicación
```

1. Trabajas en local y cierras cada tarea con `bun run test` y `bun run build` en verde.
2. `git push` a `main`.
3. Vercel detecta el push, ejecuta `bun run build` y publica el contenido de `dist/` en la
   URL de producción. Cada rama o pull request genera además una URL de vista previa, que
   Vercel marca con `X-Robots-Tag: noindex`; producción no la lleva.
4. En paralelo, GitHub Actions ejecuta el workflow `.github/workflows/ci.yml`
   (`bun install --frozen-lockfile`, `bun run test`, `bun run build`) en cada push a `main`
   y en cada pull request.

La integración continua **avisa, no bloquea**: si falla, el commit aparece en rojo en
GitHub, pero el despliegue de Vercel es independiente y sigue su curso. Si la CI se pone en
rojo, corrige en local y vuelve a subir.

## Comandos locales

| Comando | Para qué |
|---------|----------|
| `bun run dev` | Servidor de desarrollo con recarga en caliente |
| `bun run test` | Tests con Vitest (`vitest run`) |
| `bun run build` | Comprobación de tipos y build a `dist/` |
| `bun run preview` | Sirve `dist/` como lo hará producción (úsalo para Lighthouse) |

## Volver a una versión anterior

Desde el panel de Vercel, sin tocar el repositorio:

1. Abre el proyecto → pestaña **Deployments**.
2. Localiza el despliegue que sí funcionaba (cada uno muestra su commit).
3. Menú **···** del despliegue → **Promote to Production** (en versiones anteriores del
   panel, **Rollback**).
4. Confirma: la URL de producción vuelve a servir ese build en segundos.

Es una medida temporal: el siguiente push a `main` vuelve a desplegar el código del
repositorio. Para revertir de verdad, haz `git revert` del commit problemático y súbelo.

## Verificación posterior al despliegue

Después de cada despliegue a producción, sobre la URL de producción:

- [ ] La home responde 200 y se ven sus seis secciones: `#sobre-mi`, `#tecnologias`,
      `#proyectos`, `#experiencia`, `#formacion`, `#idiomas`.
- [ ] `/robots.txt` responde 200 y apunta al sitemap.
- [ ] `/sitemap.xml` responde 200 y lista la home con la URL canónica.
- [ ] Una ruta inexistente (p. ej. `/no-existe`) responde **404** con la página de la
      spec 013.
- [ ] Lighthouse (móvil, sobre la URL de producción o `bun run preview`) ≥ 90 en
      Performance, Accessibility, Best Practices y SEO.
- [ ] El workflow de CI aparece en verde en GitHub para ese commit.

## Si algún día cambia la URL

La URL de producción está incrustada en los metadatos del sitio. Cambiarla (dominio propio
o proyecto nuevo en Vercel) exige refinar la **spec 012** (`specs/012-seo-metadata`) y
actualizar con ella:

- `site` en `astro.config.mjs`, de donde salen la canónica, el sitemap, `robots.txt` y
  `og:url`;
- la URL de producción de esta guía y de `specs/014-deployment`;
- los tests que la comprueban (`tests/project/deployment-docs.test.ts`, `tests/lib/seo.test.ts`).
