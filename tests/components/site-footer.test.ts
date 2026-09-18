import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import SiteFooter from '../../src/components/SiteFooter.astro';
import indexSource from '../../src/pages/index.astro?raw';

const props = {
  name: 'Ana Beatriz Cruz',
  role: 'Rol de prueba',
  email: 'ana@example.com',
  github: 'https://github.com/ana',
  linkedin: 'https://www.linkedin.com/in/ana-cruz/',
  year: 2031,
};

const textOf = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const attribute = (tag: string, name: string) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const linksOf = (html: string) => [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map(([, attrs = '', inner = '']) => ({ attrs, inner }));

describe('SiteFooter', () => {
  let html = '';

  beforeAll(async () => {
    const container = await AstroContainer.create();
    html = await container.renderToString(SiteFooter, { props });
  });

  it('is a single footer without an anchor, revealed as one block', () => {
    const footer = html.match(/<footer\b[^>]*>/)?.[0] ?? '';

    expect(html.match(/<footer\b/g)).toHaveLength(1);
    expect(attribute(footer, 'id')).toBeUndefined();
    expect(html.match(/\sdata-reveal(?=[\s=>])/g)).toHaveLength(1);
  });

  it('signs with the name and role as paragraphs, without headings', () => {
    const paragraphs = [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map(([, text]) => textOf(text ?? ''));

    expect(paragraphs).toContain('Ana Beatriz Cruz');
    expect(paragraphs).toContain('Rol de prueba');
    expect(html).not.toMatch(/<h[1-6]\b/);
  });

  it('lists the three contact links in order, labelled "Contacto"', () => {
    const nav = html.match(/<nav\b[^>]*>[\s\S]*?<\/nav>/)?.[0] ?? '';
    const links = linksOf(nav);

    expect(attribute(nav.match(/<nav\b[^>]*>/)?.[0] ?? '', 'aria-label')).toBe('Contacto');
    expect(links.map(({ attrs }) => attribute(attrs, 'href'))).toEqual([
      'mailto:ana@example.com',
      'https://github.com/ana',
      'https://www.linkedin.com/in/ana-cruz/',
    ]);
    // Service and value are separate elements, stacked in the link.
    const partsOf = (inner: string) => [...inner.matchAll(/<span\b[^>]*>([^<]+)<\/span>/g)].map(([, text]) => textOf(text ?? ''));
    expect(links.map(({ inner }) => partsOf(inner))).toEqual([
      ['Correo', 'ana@example.com'],
      ['GitHub', 'github.com/ana'],
      ['LinkedIn', 'linkedin.com/in/ana-cruz'],
    ]);
    expect(links.map(({ attrs }) => attribute(attrs, 'aria-label'))).toEqual([
      'Correo: ana@example.com',
      'GitHub: github.com/ana',
      'LinkedIn: linkedin.com/in/ana-cruz',
    ]);
    expect(nav).toMatch(/<ul\b[\s\S]*<li\b/);
  });

  it('gives every link a decorative icon and opens it in the same tab', () => {
    const links = linksOf(html);

    expect(links).toHaveLength(3);
    for (const { attrs, inner } of links) {
      expect(inner).toMatch(/<svg\b[^>]*aria-hidden="true"/);
      expect(attrs).not.toMatch(/\starget=/);
    }
  });

  it('has no forms, fields or buttons', () => {
    expect(html).not.toMatch(/<(form|input|textarea|select|button)\b/);
  });

  it('closes with the copyright line of the given year', () => {
    expect(textOf(html)).toContain('© 2031 Ana Beatriz Cruz');
  });
});

describe('home page', () => {
  it('renders SiteFooter right after main with the profile data and the build year', () => {
    expect(indexSource).toMatch(/<\/main>\s*<SiteFooter\b/);
    const tag = indexSource.match(/<SiteFooter\b[\s\S]*?\/>/)?.[0] ?? '';
    for (const prop of ['name', 'role', 'email', 'github', 'linkedin', 'year']) {
      expect(tag).toMatch(new RegExp(`\\b${prop}=\\{`));
    }
    expect(indexSource).toMatch(/new Date\(\)\.getFullYear\(\)/);
  });
});
