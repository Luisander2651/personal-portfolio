import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import SectionHeader from '../../src/components/SectionHeader.astro';

const props = { anchor: 'seccion-de-prueba', title: 'Sección de prueba', headingId: 'seccion-de-prueba-title' };

const textOf = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

describe('SectionHeader', () => {
  let html = '';

  beforeAll(async () => {
    const container = await AstroContainer.create();
    html = await container.renderToString(SectionHeader, { props });
  });

  it('renders a single h2 with the title and the given id', () => {
    const headings = [...html.matchAll(/<h2([^>]*)>([\s\S]*?)<\/h2>/g)];

    expect(headings).toHaveLength(1);
    expect(headings[0]?.[1]).toMatch(new RegExp(`\\sid="${props.headingId}"`));
    expect(textOf(headings[0]?.[2] ?? '')).toBe(props.title);
  });

  it('renders no other heading level', () => {
    expect(html).not.toMatch(/<h[13-6][\s>]/);
  });

  it('shows the decorative path with the anchor, hidden from assistive technology', () => {
    const hidden = [...html.matchAll(/<(\w+)[^>]*aria-hidden="true"[^>]*>([\s\S]*?)<\/\1>/g)].map(([, , content]) =>
      textOf(content ?? ''),
    );
    const path = hidden.find((text) => text.includes(props.anchor));

    expect(path).toBeDefined();
    expect(path).toMatch(/portfolio\s*\/\s*seccion-de-prueba/);
    expect(path).not.toContain('#');
  });
});
