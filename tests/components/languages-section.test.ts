import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import LanguagesSection from '../../src/components/LanguagesSection.astro';
import indexSource from '../../src/pages/index.astro?raw';

const props = {
  languages: [
    { language: 'Idioma a', level: 'Nivel a', tag: 'Etiqueta a' },
    { language: 'Idioma b', level: 'Nivel b' },
    { language: 'Idioma c', level: 'Nivel c', tag: 'C1' },
  ],
};

const textOf = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const attribute = (tag: string, name: string) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const cardsOf = (html: string) => html.split(/<article\b/).slice(1);
/** Tag and text of every element of a card that holds only text, in document order. */
const leavesOf = (card: string) =>
  [...card.matchAll(/<(\w+)[^>]*>([^<]+)<\/\1>/g)].map(([, tag, text]) => ({ tag, text: textOf(text ?? '') }));

describe('LanguagesSection', () => {
  let html = '';

  beforeAll(async () => {
    const container = await AstroContainer.create();
    html = await container.renderToString(LanguagesSection, { props });
  });

  it('is a section with id "idiomas" labelled by the "Idiomas" h2', () => {
    const section = html.match(/<section[^>]*>/)?.[0] ?? '';
    const headings = [...html.matchAll(/<h2([^>]*)>([\s\S]*?)<\/h2>/g)];

    expect(attribute(section, 'id')).toBe('idiomas');
    expect(headings).toHaveLength(1);
    expect(attribute(headings[0]?.[1] ?? '', 'id')).toBe(attribute(section, 'aria-labelledby'));
    expect(textOf(headings[0]?.[2] ?? '')).toBe('Idiomas');
  });

  it('renders one card per language in the order received', () => {
    const languages = [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)].map(([, language]) => textOf(language ?? ''));

    expect(languages).toEqual(['Idioma a', 'Idioma b', 'Idioma c']);
  });

  it('shows the language, the level and the tag as separate text elements', () => {
    const [first = ''] = cardsOf(html);

    expect(leavesOf(first)).toEqual([
      { tag: 'h3', text: 'Idioma a' },
      { tag: 'p', text: 'Nivel a' },
      { tag: 'span', text: 'Etiqueta a' },
    ]);
  });

  it('renders no tag for a language without one', () => {
    const [, second = ''] = cardsOf(html);

    expect(leavesOf(second)).toEqual([
      { tag: 'h3', text: 'Idioma b' },
      { tag: 'p', text: 'Nivel b' },
    ]);
  });

  it('marks each card for the shared reveal and the shared spotlight', () => {
    const cards = html.match(/<article[^>]*>/g) ?? [];

    expect(cards).toHaveLength(3);
    for (const card of cards) {
      expect(card).toMatch(/\sdata-reveal(?=[\s=>])/);
      expect(card).toMatch(/\sdata-spotlight(?=[\s=>])/);
    }
  });

  it('contains no focusable elements', () => {
    expect(html).not.toMatch(/<(a|button|input|select|textarea)\b|tabindex=/);
  });

  it('shows the level only as text, with no bars, meters or percentages', () => {
    expect(html).not.toMatch(/<(progress|meter)\b|role="progressbar"/);
    expect(textOf(html)).not.toContain('%');
  });
});

describe('home page', () => {
  it('renders LanguagesSection right after EducationSection inside main', () => {
    const main = indexSource.match(/<main>([\s\S]*?)<\/main>/)?.[1] ?? '';
    const components = [...main.matchAll(/<([A-Z]\w*)[\s/>]/g)].map(([, name]) => name);

    expect(components.slice(0, 7)).toEqual([
      'HomeHero',
      'AboutSection',
      'TechStackSection',
      'ProjectsSection',
      'ExperienceSection',
      'EducationSection',
      'LanguagesSection',
    ]);
  });

  it('takes the languages from the profile', () => {
    expect(indexSource).toMatch(/<LanguagesSection\s+languages=\{\s*languages\s*\}/);
    expect(indexSource).toMatch(/\blanguages\b[^;]*=\s*profile\.data/);
  });
});
