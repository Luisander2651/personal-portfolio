import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import SeoHead from '../../src/components/SeoHead.astro';
import BaseLayout from '../../src/layouts/BaseLayout.astro';
import indexSource from '../../src/pages/index.astro?raw';

const SITE = 'https://example.com';
const profile = {
  name: 'Ana Beatriz Cruz',
  role: 'Rol de prueba',
  location: 'Región de prueba, País de prueba',
  email: 'ana@example.com',
  github: 'https://github.com/ana',
  linkedin: 'https://www.linkedin.com/in/ana/',
};
const props = { title: 'Ana Beatriz Cruz — Rol de prueba', description: 'Descripción de prueba.', profile, site: new URL(SITE) };

const attribute = (tag: string, name: string) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const decode = (text: string) => text.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, "'");

describe('SeoHead', () => {
  let html = '';

  beforeAll(async () => {
    const container = await AstroContainer.create();
    html = await container.renderToString(SeoHead, { props });
  });

  it('declares a single canonical URL for the home', () => {
    const canonicals = html.match(/<link\b[^>]*rel="canonical"[^>]*>/g) ?? [];
    expect(canonicals).toHaveLength(1);
    expect(attribute(canonicals[0] ?? '', 'href')).toBe(`${SITE}/`);
  });

  it('renders the ten Open Graph tags', () => {
    const tags = Object.fromEntries(
      [...html.matchAll(/<meta\b[^>]*property="(og:[^"]+)"[^>]*>/g)].map(([tag, property]) => [property, decode(attribute(tag, 'content') ?? '')]),
    );
    expect(tags).toEqual({
      'og:type': 'website',
      'og:site_name': 'Ana Beatriz Cruz',
      'og:title': props.title,
      'og:description': props.description,
      'og:url': `${SITE}/`,
      'og:locale': 'es_MX',
      'og:image': `${SITE}/og-image.png`,
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:alt': props.title,
    });
  });

  it('describes the author in a single JSON-LD Person', () => {
    const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
    expect(scripts).toHaveLength(1);
    expect(attribute(scripts[0]?.[1] ?? '', 'type')).toBe('application/ld+json');

    const person = JSON.parse(scripts[0]?.[2] ?? '{}');
    expect(person).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Ana Beatriz Cruz',
      jobTitle: 'Rol de prueba',
      url: `${SITE}/`,
      email: 'mailto:ana@example.com',
      address: { addressRegion: 'Región de prueba', addressCountry: 'País de prueba' },
      sameAs: [profile.github, profile.linkedin],
    });
  });

  it('leaves the site icons and theme-color to BaseLayout', () => {
    expect(html).not.toMatch(/rel="(icon|apple-touch-icon)"/);
    expect(html).not.toContain('theme-color');
  });
});

describe('BaseLayout with SEO metadata', () => {
  it('adds the SEO metadata to the head, keeping title and description', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(BaseLayout, {
      props: { title: props.title, description: props.description, seo: { profile, site: props.site } },
      slots: { default: '<p>Contenido</p>' },
    });
    const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? '';

    expect(head).toContain(`<title>${props.title}</title>`);
    expect(head).toContain(`<meta name="description" content="${props.description}"`);
    expect(head).toMatch(/rel="canonical"/);
    expect(head).toMatch(/application\/ld\+json/);
  });
});

describe('home page', () => {
  it('passes the profile and the site to the layout SEO metadata', () => {
    const layout = indexSource.match(/<BaseLayout\b[^>]*>/)?.[0] ?? '';
    expect(layout).toMatch(/\bseo=\{/);
    expect(indexSource).toMatch(/Astro\.site/);
    expect(indexSource).toMatch(/getPageMeta\(profile\.data\)/);
  });
});
