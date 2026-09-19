import type { APIContext } from 'astro';
import { describe, expect, it } from 'vitest';
import packageJson from '../../package.json';
import { GET as getRobots } from '../../src/pages/robots.txt.ts';
import { GET as getSitemap } from '../../src/pages/sitemap.xml.ts';

const SITE = 'https://example.com';
const context = { site: new URL(SITE) } as APIContext;

describe('sitemap.xml endpoint', () => {
  it('serves the sitemap of the home as XML', async () => {
    const response = await getSitemap(context);
    const xml = await response.text();

    expect(response.headers.get('Content-Type')).toMatch(/^application\/xml/);
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml.match(/<loc>(.*?)<\/loc>/g)).toEqual([`<loc>${SITE}/</loc>`]);
    expect(xml).not.toContain('404');
  });
});

describe('robots.txt endpoint', () => {
  it('serves the crawling rules as plain text, pointing to the sitemap', async () => {
    const response = await getRobots(context);
    const text = await response.text();

    expect(response.headers.get('Content-Type')).toMatch(/^text\/plain/);
    expect(text).toContain('User-agent: *');
    expect(text).toContain('Allow: /');
    expect(text).toContain(`Sitemap: ${SITE}/sitemap.xml`);
  });
});

describe('dependencies', () => {
  it('generates the SEO files without new packages', () => {
    expect(Object.keys(packageJson.dependencies)).toEqual(['astro']);
    expect(Object.keys(packageJson.devDependencies).sort()).toEqual(['@astrojs/check', 'typescript', 'vitest']);
  });
});
