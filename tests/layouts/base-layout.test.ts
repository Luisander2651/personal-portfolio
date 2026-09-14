import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import BaseLayout from '../../src/layouts/BaseLayout.astro';

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
});
