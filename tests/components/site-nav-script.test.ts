import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import SiteNav from '../../src/components/SiteNav.astro';
import siteNavSource from '../../src/components/SiteNav.astro?raw';

const scripts = [...siteNavSource.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].map(([, attrs = '', body = '']) => ({ attrs, body }));
const inlineScripts = scripts.filter(({ attrs }) => /\bis:inline\b/.test(attrs));
const moduleScripts = scripts.filter(({ attrs }) => !/\bis:inline\b/.test(attrs));

describe('SiteNav scripts', () => {
  it('has one inline script and one bundled script', () => {
    expect(inlineScripts).toHaveLength(1);
    expect(moduleScripts).toHaveLength(1);
  });

  describe('inline script (runs before the first paint)', () => {
    const [inline] = inlineScripts;
    const body = inline?.body ?? '';

    it('comes right after the header, so the bar is fixed and collapsed from the first paint', () => {
      expect(siteNavSource).toMatch(/<\/header>\s*<script\s+is:inline>/);
    });

    it('marks the document as ready and shows the menu button', () => {
      expect(body).toMatch(/document\.documentElement\.dataset\.navReady\s*=\s*''/);
      expect(body).toMatch(/\.hidden\s*=\s*false/);
    });

    it('stays tiny and imports nothing', () => {
      expect(body).not.toMatch(/\bimport\b/);
      expect(body.trim().length).toBeLessThan(300);
    });
  });

  describe('bundled script', () => {
    const [bundled] = moduleScripts;
    const body = bundled?.body ?? '';
    const imports = [...body.matchAll(/import\s+[\s\S]*?from\s+'([^']+)'/g)].map(([, source]) => source);

    it('uses the navigation logic and no package', () => {
      expect(imports).toEqual(['../lib/navigation']);
      expect(body).toMatch(/\bNAV_LINKS\b/);
      expect(body).toMatch(/\bpickActiveSection\b/);
    });

    it('toggles the menu with aria-expanded and closes it with Escape, returning the focus', () => {
      expect(body).toMatch(/'aria-expanded'/);
      expect(body).toMatch(/'Escape'/);
      expect(body).toMatch(/\.focus\(\)/);
    });

    it('closes the menu when a link is chosen', () => {
      expect(body).toMatch(/for \(const link of links\)[\s\S]*addEventListener\('click'/);
    });

    it('marks the active link with aria-current from an IntersectionObserver', () => {
      expect(body).toMatch(/new IntersectionObserver\(/);
      expect(body).toMatch(/setAttribute\('aria-current', 'true'\)/);
      expect(body).toMatch(/removeAttribute\('aria-current'\)/);
    });
  });

  it('still renders the menu button hidden in the HTML', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SiteNav, { props: { name: 'Ana Cruz' } });
    expect(html.match(/<button\b[^>]*>/)?.[0]).toMatch(/\shidden(?=[\s=>])/);
  });
});
