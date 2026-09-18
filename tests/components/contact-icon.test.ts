import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import ContactIcon from '../../src/components/ContactIcon.astro';
import homeHeroSource from '../../src/components/HomeHero.astro?raw';

const icons = ['mail', 'github', 'linkedin'] as const;
const textOf = (html: string) => html.replace(/<[^>]+>/g, '').trim();

describe('ContactIcon', () => {
  const rendered: Record<string, string> = {};

  beforeAll(async () => {
    const container = await AstroContainer.create();
    for (const name of icons) rendered[name] = await container.renderToString(ContactIcon, { props: { name } });
  });

  it.each(icons)('draws %s as a single decorative line icon', (name) => {
    const html = rendered[name] ?? '';
    const svg = html.match(/<svg\b[^>]*>/)?.[0] ?? '';

    expect(html.match(/<svg\b/g)).toHaveLength(1);
    expect(svg).toMatch(/aria-hidden="true"/);
    expect(svg).toMatch(/stroke="currentColor"/);
    expect(svg).toMatch(/fill="none"/);
    expect(svg).toMatch(/class="[^"]*\bcontact-icon\b/);
    expect(html).not.toMatch(/tabindex|focusable="true"/);
    expect(textOf(html)).toBe('');
  });

  it('keeps the strokes the hero used', () => {
    expect(rendered.mail).toContain('m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7');
    expect(rendered.github).toContain('M9 18c-4.51 2-5-2-7-2');
    expect(rendered.linkedin).toContain('<circle cx="4" cy="4" r="2"');
  });

  it('draws a different icon for each name', () => {
    expect(new Set(Object.values(rendered)).size).toBe(icons.length);
  });
});

describe('HomeHero', () => {
  it('uses ContactIcon instead of inline icon paths', () => {
    expect(homeHeroSource).toMatch(/import ContactIcon from '\.\/ContactIcon\.astro'/);
    expect(homeHeroSource).toMatch(/<ContactIcon\s+name=\{\s*icon\s*\}/);
    expect(homeHeroSource).not.toMatch(/<path\b/);
  });
});
