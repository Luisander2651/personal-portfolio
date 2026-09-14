import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import HomeHero from '../../src/components/HomeHero.astro';

const props = {
  name: 'Persona de Prueba',
  role: 'Rol de Prueba',
  location: 'Ciudad de Prueba',
  featuredStack: ['Tech A', 'Tech B', 'Tech C', 'Tech D'],
  github: 'https://github.com/prueba',
  linkedin: 'https://www.linkedin.com/in/prueba',
  email: 'prueba@example.com',
};

const decode = (text: string) =>
  text.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const textOf = (html: string) => decode(html.replace(/<[^>]+>/g, '')).trim();
const attribute = (tag: string, name: string) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

describe('HomeHero', () => {
  let html = '';

  beforeAll(async () => {
    const container = await AstroContainer.create();
    html = await container.renderToString(HomeHero, { props });
  });

  describe('card content', () => {
    it('renders a single h1 with only the name', () => {
      const headings = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)];

      expect(headings).toHaveLength(1);
      expect(textOf(headings[0]?.[1] ?? '')).toBe(props.name);
    });

    it('shows the role as a paragraph outside the h1', () => {
      const roleParagraph = [...html.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/g)].find(
        ([, content]) => textOf(content ?? '') === props.role,
      );

      expect(roleParagraph).toBeDefined();
      expect(html.match(/<h1[^>]*>[\s\S]*?<\/h1>/)?.[0]).not.toContain(props.role);
    });

    it('shows the location', () => {
      expect(textOf(html)).toContain(props.location);
    });

    it('lists the featured stack in order', () => {
      const items = [...html.matchAll(/<li[^>]*>([^<]*)<\/li>/g)].map(([, content]) => textOf(content ?? ''));
      expect(items).toEqual(props.featuredStack);
    });
  });

  describe('links', () => {
    const links = () => [...html.matchAll(/<a\s[^>]*>/g)].map(([tag]) => tag);

    it('renders exactly GitHub, LinkedIn and email links in that order', () => {
      expect(links().map((tag) => attribute(tag, 'href'))).toEqual([
        props.github,
        props.linkedin,
        `mailto:${props.email}`,
      ]);
    });

    it('gives every link a Spanish accessible name', () => {
      expect(links().map((tag) => attribute(tag, 'aria-label'))).toEqual(['GitHub', 'LinkedIn', 'Correo']);
    });

    it('keeps every link in the same tab', () => {
      expect(links().some((tag) => /\starget=/.test(tag))).toBe(false);
    });
  });

  describe('decorative code', () => {
    const codeBlock = () => html.match(/<pre[^>]*>[\s\S]*?<\/pre>/)?.[0] ?? '';

    it('is hidden and hidden from assistive technology', () => {
      const openingTag = codeBlock().match(/<pre[^>]*>/)?.[0] ?? '';

      expect(attribute(openingTag, 'aria-hidden')).toBe('true');
      expect(openingTag).toMatch(/\shidden(\s|>|=)/);
    });

    it('contains the code generated from the profile data', () => {
      const code = textOf(codeBlock());

      expect(code).toContain('const profile = {');
      expect(code).toContain(`name: "${props.name}",`);
      expect(code).toContain(`role: "${props.role}",`);
      expect(code).toContain('stack: ["Tech A", "Tech B", "Tech C", "Tech D"],');
      expect(code).toContain('render(profile);');
    });

    it('hides the render(profile) indicator from assistive technology', () => {
      const indicator = [...html.matchAll(/<(\w+)([^>]*)>render\(profile\)<\/\1>/g)];

      expect(indicator).toHaveLength(1);
      expect(indicator[0]?.[2]).toMatch(/aria-hidden="true"/);
    });
  });

  it('does not include client-side scripts yet', () => {
    expect(html).not.toMatch(/<script/i);
  });
});
