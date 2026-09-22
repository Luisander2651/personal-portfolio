import { describe, expect, it } from 'vitest';
import docs from '../../docs/deployment.md?raw';
import astroConfig from '../../astro.config.mjs?raw';

const PRODUCTION_URL = 'https://personal-portfolio-lemon-three-51.vercel.app';

describe('deployment documentation', () => {
  it('names the hosting, the repository and the production branch', () => {
    expect(docs).toMatch(/Vercel/);
    expect(docs).toMatch(/github\.com\/Luisander2651\/personal-portfolio/);
    expect(docs).toMatch(/`main`/);
  });

  it('gives the production URL that the site is built with', () => {
    expect(docs).toContain(PRODUCTION_URL);
    expect(astroConfig).toContain(`site: '${PRODUCTION_URL}'`);
  });

  it('lists the local commands', () => {
    for (const command of ['bun run dev', 'bun run test', 'bun run build', 'bun run preview']) {
      expect(docs).toContain(command);
    }
  });

  it('explains the deployment flow and what the continuous integration does', () => {
    expect(docs).toMatch(/## Flujo de despliegue/);
    expect(docs).toMatch(/\.github\/workflows\/ci\.yml/);
  });

  it('explains how to roll back and what to check afterwards', () => {
    expect(docs).toMatch(/## Volver a una versión anterior/);
    expect(docs).toMatch(/## Verificación posterior al despliegue/);
    for (const check of ['robots.txt', 'sitemap.xml', '404', 'Lighthouse']) {
      expect(docs).toContain(check);
    }
  });

  it('says what to refine if the URL ever changes', () => {
    expect(docs).toMatch(/spec 012/);
  });
});
