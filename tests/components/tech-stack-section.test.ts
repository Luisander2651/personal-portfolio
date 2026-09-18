import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import TechStackSection from '../../src/components/TechStackSection.astro';
import indexSource from '../../src/pages/index.astro?raw';

const category = (id: string, name: string, order: number, presentation: string, items: string[]) => ({
  id,
  data: { category: name, order, presentation, items },
});

const props = {
  icons: [
    category('languages', 'Lenguajes y fundamentos', 1, 'icons', ['TypeScript', 'Java', 'SQL']),
    category('backend', 'Backend y web', 2, 'icons', ['Node.js', 'APIs REST']),
    category('mobile', 'Desarrollo móvil', 3, 'icons', ['Android nativo (Java, Kotlin)', 'Ionic']),
  ],
  tags: [category('architecture', 'Arquitectura y prácticas', 8, 'tags', ['Clean Architecture', 'microservicios'])],
  text: [
    category('ai', 'Desarrollo asistido por IA', 7, 'text', ['Texto de IA de prueba']),
    category('ci-cd', 'CI/CD', 9, 'text', ['Texto de CI/CD de prueba']),
  ],
};

const HIDDEN = /<(\w+)[^>]*aria-hidden="true"[^>]*>[\s\S]*?<\/\1>/g;
const textOf = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const visibleText = (html: string) => textOf(html.replace(HIDDEN, ''));
const attribute = (tag: string, name: string) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const blocksOf = (html: string, className: string) => {
  const exactClass = new RegExp(`<div[^>]*class="(?:[^"]*\\s)?${className}(?:\\s[^"]*)?"`, 'g');
  const starts = [...html.matchAll(exactClass)].map((m) => m.index ?? 0);
  const boundaries = ['tech-practices', 'tech-notes']
    .filter((name) => name !== className)
    .map((name) => html.indexOf(`class="${name}`))
    .filter((i) => i >= 0);
  return starts.map((start, i) => {
    const end = Math.min(starts[i + 1] ?? html.length, ...boundaries.filter((boundary) => boundary > start));
    return html.slice(start, end);
  });
};

describe('TechStackSection', () => {
  let html = '';

  beforeAll(async () => {
    const container = await AstroContainer.create();
    html = await container.renderToString(TechStackSection, { props });
  });

  it('is a section with id "tecnologias" labelled by the "Tecnologías" h2', () => {
    const section = html.match(/<section[^>]*>/)?.[0] ?? '';
    const headings = [...html.matchAll(/<h2([^>]*)>([\s\S]*?)<\/h2>/g)];

    expect(attribute(section, 'id')).toBe('tecnologias');
    expect(headings).toHaveLength(1);
    expect(attribute(headings[0]?.[1] ?? '', 'id')).toBe(attribute(section, 'aria-labelledby'));
    expect(textOf(headings[0]?.[2] ?? '')).toBe('Tecnologías');
  });

  describe('icon categories', () => {
    const cards = () => blocksOf(html, 'tech-card');

    it('renders one card per category, in the order received', () => {
      expect(cards().map((card) => textOf(card.match(/<h3[^>]*>([\s\S]*?)<\/h3>/)?.[1] ?? ''))).toEqual([
        'Lenguajes y fundamentos',
        'Backend y web',
        'Desarrollo móvil',
      ]);
    });

    it.each([0, 1, 2])('lists every item of card %i in order, with its visible name', (index) => {
      const items = [...(cards()[index] ?? '').matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map(([, content]) => content ?? '');

      expect(items.map(visibleText)).toEqual(props.icons[index]?.data.items);
    });

    it('gives every item exactly one svg icon hidden from assistive technology', () => {
      const items = cards().flatMap((card) => [...card.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map(([, c]) => c ?? ''));

      expect(items).toHaveLength(7);
      for (const item of items) {
        const svgs = [...item.matchAll(/<svg([^>]*)>/g)];
        expect(svgs).toHaveLength(1);
        expect(svgs[0]?.[1]).toMatch(/aria-hidden="true"/);
        expect(svgs[0]?.[1]).not.toMatch(/fill="#|stroke="#|style=/);
      }
    });

    it('hides the item counter from assistive technology', () => {
      for (const [index, card] of cards().entries()) {
        const count = String(props.icons[index]?.data.items.length).padStart(2, '0');
        expect(card).toMatch(new RegExp(`<span[^>]*aria-hidden="true"[^>]*>${count}</span>`));
      }
    });
  });

  it('renders "Arquitectura y prácticas" as a list of tags without icons, after the cards', () => {
    const practices = blocksOf(html, 'tech-practices')[0] ?? '';
    const tags = [...practices.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map(([, content]) => textOf(content ?? ''));

    expect(html.indexOf('tech-practices')).toBeGreaterThan(html.lastIndexOf('tech-card'));
    expect(textOf(practices.match(/<h3[^>]*>([\s\S]*?)<\/h3>/)?.[1] ?? '')).toBe('Arquitectura y prácticas');
    expect(tags).toEqual(['Clean Architecture', 'microservicios']);
    expect(practices).not.toMatch(/<svg/);
  });

  it('renders the text categories as h3 + paragraph, in order, at the end and without icons', () => {
    const notes = blocksOf(html, 'tech-note');

    expect(html.indexOf('tech-note')).toBeGreaterThan(html.indexOf('tech-practices'));
    expect(notes.map((note) => textOf(note.match(/<h3[^>]*>([\s\S]*?)<\/h3>/)?.[1] ?? ''))).toEqual([
      'Desarrollo asistido por IA',
      'CI/CD',
    ]);
    expect(notes.map((note) => textOf(note.match(/<p[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? ''))).toEqual([
      'Texto de IA de prueba',
      'Texto de CI/CD de prueba',
    ]);
    for (const note of notes) expect(note).not.toMatch(/<svg/);
  });

  it('marks every card, the practices block and the notes block as revealable blocks', () => {
    const openingTags = (className: string) =>
      [...html.matchAll(new RegExp(`<div[^>]*class="(?:[^"]*\\s)?${className}(?:\\s[^"]*)?"[^>]*>`, 'g'))].map(([tag]) => tag);
    const revealable = (tag: string) => /\sdata-reveal(?=[\s=>])/.test(tag);

    expect(openingTags('tech-card')).toHaveLength(3);
    expect(openingTags('tech-card').every(revealable)).toBe(true);
    expect(openingTags('tech-practices').map(revealable)).toEqual([true]);
    expect(openingTags('tech-notes').map(revealable)).toEqual([true]);
    // Plus the section header, which SectionHeader marks itself.
    expect(html.match(/\sdata-reveal(?=[\s=>])/g)).toHaveLength(3 + 1 + 1 + 1);
  });

  it('contains no focusable elements', () => {
    expect(html).not.toMatch(/<(a|button|input|select|textarea)\b|tabindex=/);
  });
});

describe('home page', () => {
  it('renders TechStackSection right after AboutSection inside main', () => {
    const main = indexSource.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? '';
    const components = [...main.matchAll(/<([A-Z]\w*)[\s/>]/g)].map(([, name]) => name);

    expect(components.slice(0, 3)).toEqual(['HomeHero', 'AboutSection', 'TechStackSection']);
  });

  it('groups the skills collection for the section', () => {
    expect(indexSource).toMatch(/getCollection\(\s*'skills'\s*\)/);
    expect(indexSource).toMatch(/groupSkillsForSection\(/);
  });
});
