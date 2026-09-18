import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import SiteNav from '../../src/components/SiteNav.astro';
import { NAV_LINKS } from '../../src/lib/navigation';
import indexSource from '../../src/pages/index.astro?raw';

const componentSources = import.meta.glob('/src/components/*.astro', { query: '?raw', import: 'default', eager: true }) as Record<
  string,
  string
>;

const textOf = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const attribute = (tag: string, name: string) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
/** Text a screen reader announces: everything except `aria-hidden` subtrees (leaf spans only). */
const accessibleTextOf = (html: string) => textOf(html.replace(/<span[^>]*aria-hidden="true"[^>]*>[^<]*<\/span>/g, ''));
const linksOf = (html: string) => [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map(([, attrs = '', inner = '']) => ({ attrs, inner }));

describe('SiteNav', () => {
  let html = '';

  beforeAll(async () => {
    const container = await AstroContainer.create();
    html = await container.renderToString(SiteNav, { props: { name: 'Ana Beatriz Cruz Díaz' } });
  });

  it('is a single header with the "Principal" navigation', () => {
    expect(html.match(/<header\b/g)).toHaveLength(1);
    expect(html.match(/<nav\b[^>]*>/g)).toEqual([expect.stringMatching(/aria-label="Principal"/)]);
  });

  it('lists the six section links in order, numbered, with their anchors', () => {
    const nav = html.match(/<nav\b[\s\S]*?<\/nav>/)?.[0] ?? '';
    const links = linksOf(nav);

    expect(links.map(({ attrs }) => attribute(attrs, 'href'))).toEqual(NAV_LINKS.map(({ anchor }) => `#${anchor}`));
    expect(links.map(({ inner }) => textOf(inner))).toEqual(
      NAV_LINKS.map(({ label }, index) => `${String(index + 1).padStart(2, '0')} ${label}`),
    );
    expect(nav).toMatch(/<ul\b[\s\S]*<li\b/);
  });

  it('puts the focusable elements in order: brand, menu button, six links', () => {
    const focusable = [...html.matchAll(/<(a|button)\b([^>]*)>/g)].map(([, tag, attrs = '']) =>
      tag === 'button' ? 'button' : attribute(attrs, 'href'),
    );

    expect(focusable).toEqual(['#top', 'button', ...NAV_LINKS.map(({ anchor }) => `#${anchor}`)]);
  });

  it('has no skip link (removed from the spec: landmarks and headings already bypass the bar)', () => {
    expect(html).not.toContain('#contenido');
    expect(html).not.toContain('Saltar al contenido');
  });

  it('shows the initials of the name in the brand and names it with the full name', () => {
    const brand = linksOf(html).find(({ attrs }) => attribute(attrs, 'href') === '#top')?.inner ?? '';

    expect(brand).toMatch(/<span[^>]*aria-hidden="true"[^>]*>ABCD<\/span>/);
    expect(accessibleTextOf(brand)).toBe('Ana Beatriz Cruz Díaz');
  });

  it('renders the menu button hidden and collapsed, controlling the link list', () => {
    const button = html.match(/<button\b[^>]*>/)?.[0] ?? '';
    const list = html.match(/<ul\b[^>]*>/)?.[0] ?? '';

    expect(button).toMatch(/\shidden(?=[\s=>])/);
    expect(attribute(button, 'type')).toBe('button');
    expect(attribute(button, 'aria-expanded')).toBe('false');
    expect(attribute(button, 'aria-controls')).toBe(attribute(list, 'id'));
    expect(attribute(list, 'id')).toBeTruthy();
    expect(textOf(html.match(/<button\b[\s\S]*?<\/button>/)?.[0] ?? '')).toBe('Menú');
  });

  it('marks no link as current without JavaScript', () => {
    expect(html).not.toContain('aria-current');
  });
});

describe('home page', () => {
  const main = indexSource.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? '';

  it('renders SiteNav with the profile name before main, and main with its content id', () => {
    expect(indexSource).toMatch(/<SiteNav\s+name=\{\s*name\s*\}\s*\/>\s*<main\b/);
    expect(indexSource).toMatch(/<main\s+id="contenido"\s*>/);
  });

  it('links every section of main, in the order they appear', () => {
    const components = [...main.matchAll(/<([A-Z]\w*)[\s/>]/g)].map(([, name]) => name);
    const sectionIds = components.flatMap((name) => {
      const source = componentSources[`/src/components/${name}.astro`] ?? '';
      const id = source.match(/<section\s[^>]*\bid="([^"{]+)"/)?.[1];
      return id ? [id] : [];
    });

    expect(sectionIds).toEqual(NAV_LINKS.map(({ anchor }) => anchor));
  });
});
