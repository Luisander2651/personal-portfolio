import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import BaseLayout from '../../src/layouts/BaseLayout.astro';
import tokensCss from '../../src/styles/tokens.css?raw';

const props = {
  title: 'Título de prueba — Rol de prueba',
  description: 'Descripción de prueba del sitio.',
};

describe('BaseLayout', () => {
  let html = '';

  beforeAll(async () => {
    const container = await AstroContainer.create();
    html = await container.renderToString(BaseLayout, {
      props,
      slots: { default: '<p>Contenido de prueba</p>' },
    });
  });

  it('declares Spanish as the document language', () => {
    expect(html).toMatch(/<html[^>]*\slang="es"/);
  });

  it('declares charset and viewport', () => {
    expect(html).toMatch(/<meta charset="utf-8"/i);
    expect(html).toMatch(/<meta name="viewport" content="width=device-width, initial-scale=1"/);
  });

  it('renders the given title', () => {
    expect(html).toContain(`<title>${props.title}</title>`);
  });

  it('renders the given description as meta description', () => {
    expect(html).toContain(`<meta name="description" content="${props.description}"`);
  });

  it('renders the slot content inside the body', () => {
    expect(html).toMatch(/<body>[\s\S]*<p>Contenido de prueba<\/p>[\s\S]*<\/body>/);
  });

  it('does not include client-side scripts', () => {
    expect(html).not.toMatch(/<script/i);
  });

  it('links the three site icons on every page', () => {
    const links = html.match(/<link\b[^>]*>/g) ?? [];
    const has = (pattern: RegExp) => links.some((link) => pattern.test(link));

    expect(has(/rel="icon"[^>]*href="\/favicon\.svg"[^>]*type="image\/svg\+xml"/)).toBe(true);
    expect(has(/rel="icon"[^>]*href="\/favicon-32\.png"[^>]*sizes="32x32"/)).toBe(true);
    expect(has(/rel="apple-touch-icon"[^>]*href="\/apple-touch-icon\.png"/)).toBe(true);
  });

  it('sets theme-color to the page background token on every page', () => {
    const colorBg = tokensCss.match(/--color-bg:\s*([^;]+);/)?.[1]?.trim().toLowerCase();
    const meta = html.match(/<meta\b[^>]*name="theme-color"[^>]*>/)?.[0] ?? '';
    expect(meta.match(/content="([^"]*)"/)?.[1]?.toLowerCase()).toBe(colorBg);
  });

  it('is indexable unless asked otherwise', () => {
    expect(html).not.toContain('name="robots"');
  });

  it('asks search engines not to index the page with noindex', async () => {
    const container = await AstroContainer.create();
    const noindexHtml = await container.renderToString(BaseLayout, {
      props: { ...props, noindex: true },
      slots: { default: '<p>Contenido de prueba</p>' },
    });
    expect(noindexHtml).toMatch(/<meta name="robots" content="noindex"/);
  });
});
