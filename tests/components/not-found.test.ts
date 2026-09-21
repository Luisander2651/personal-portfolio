import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import BrandHeader from '../../src/components/BrandHeader.astro';
import NotFoundScreen from '../../src/components/NotFoundScreen.astro';
import SiteBrand from '../../src/components/SiteBrand.astro';
import siteBrandSource from '../../src/components/SiteBrand.astro?raw';
import notFoundSource from '../../src/pages/404.astro?raw';

const textOf = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const attribute = (tag: string, name: string) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
/** Text a screen reader announces: everything except `aria-hidden` leaf elements. */
const accessibleTextOf = (html: string) => textOf(html.replace(/<(\w+)[^>]*aria-hidden="true"[^>]*>[^<]*<\/\1>/g, ''));

describe('SiteBrand', () => {
  it('shows the initials and keeps the full name as its accessible name', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SiteBrand, { props: { name: 'Ana Beatriz Cruz', href: '/' } });
    const link = html.match(/<a\b[^>]*>/)?.[0] ?? '';

    expect(attribute(link, 'href')).toBe('/');
    expect(html).toMatch(/aria-hidden="true"[^>]*>ABC</);
    expect(accessibleTextOf(html)).toBe('Ana Beatriz Cruz');
  });
});

describe('BrandHeader', () => {
  let html = '';

  beforeAll(async () => {
    const container = await AstroContainer.create();
    html = await container.renderToString(BrandHeader, { props: { name: 'Ana Beatriz Cruz' } });
  });

  it('is a header with the brand alone, linking to the home', () => {
    const links = html.match(/<a\b[^>]*>/g) ?? [];

    expect(html.match(/<header\b/g)).toHaveLength(1);
    expect(links).toHaveLength(1);
    expect(attribute(links[0] ?? '', 'href')).toBe('/');
  });

  it('has no section links and no menu button', () => {
    expect(html).not.toMatch(/<nav\b|<button\b|<ul\b/);
  });
});

describe('NotFoundScreen', () => {
  let html = '';

  beforeAll(async () => {
    const container = await AstroContainer.create();
    html = await container.renderToString(NotFoundScreen);
  });

  it('shows the code, the heading, the line and the link, in that order', () => {
    const code = html.match(/404/)?.index ?? -1;
    const heading = html.match(/<h1\b/)?.index ?? -1;
    const line = html.indexOf('La ruta que buscas no existe o se ha movido.');
    const link = html.match(/<a\b/)?.index ?? -1;

    expect(code).toBeGreaterThan(-1);
    expect(heading).toBeGreaterThan(code);
    expect(line).toBeGreaterThan(heading);
    expect(link).toBeGreaterThan(line);
  });

  it('has a single h1 "Página no encontrada"', () => {
    const headings = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)];
    expect(headings).toHaveLength(1);
    expect(textOf(headings[0]?.[1] ?? '')).toBe('Página no encontrada');
  });

  it('announces the code as "404", whatever the decoded text shows', () => {
    const code = html.match(/<p[^>]*class="[^"]*not-found-code[^"]*"[^>]*>/)?.[0] ?? '';

    expect(attribute(code, 'aria-label')).toBe('404');
    expect(html).toMatch(/aria-hidden="true"[^>]*>404</);
  });

  it('links back to the home with a decorative arrow', () => {
    const links = [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)];

    expect(links).toHaveLength(1);
    expect(attribute(links[0]?.[1] ?? '', 'href')).toBe('/');
    expect(textOf(links[0]?.[2] ?? '')).toBe('Volver al inicio');
    expect(links[0]?.[2]).toMatch(/<svg\b[^>]*aria-hidden="true"/);
  });

  it('needs no JavaScript for its content', () => {
    expect(html).not.toMatch(/<script/i);
  });
});

describe('404 page', () => {
  it('renders the brand header, the screen and the footer, in that order', () => {
    const order = ['<BrandHeader', '<main', '<NotFoundScreen', '</main>', '<SiteFooter'].map((tag) => notFoundSource.indexOf(tag));
    expect(order.every((index) => index > -1)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it('is not indexed and carries no sharing metadata', () => {
    const layout = notFoundSource.match(/<BaseLayout\b[\s\S]*?>/)?.[0] ?? '';
    expect(layout).toMatch(/\bnoindex\b/);
    expect(layout).not.toMatch(/\bseo=/);
    expect(notFoundSource).toMatch(/getNotFoundMeta\(profile\.data\)/);
  });
});

describe('SiteBrand styles', () => {
  const styles = siteBrandSource.match(/<style[^>]*>([\s\S]*?)<\/style>/)?.[1] ?? '';

  it('hides the full name only visually', () => {
    const name = styles.match(/\.site-brand-name\s*\{([^}]*)\}/)?.[1] ?? '';

    expect(name).toMatch(/position:\s*absolute/);
    expect(name).toMatch(/overflow:\s*hidden/);
    expect(name).not.toMatch(/display:\s*none|visibility:\s*hidden/);
  });

  it('uses only design tokens', () => {
    const values = [...styles.matchAll(/:\s*([^;{}]+);/g)].map(([, value]) => value ?? '');
    expect(values.filter((value) => /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?)\(|\b\d*\.?\d+(px|rem|em|%|ms|s)\b/i.test(value))).toEqual([]);
  });

  it('shows the focus ring of the system', () => {
    expect(styles).toMatch(/\.site-brand:focus-visible\s*\{[^}]*outline:\s*var\(--focus-ring\)/);
  });
});
