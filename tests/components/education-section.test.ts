import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import EducationSection from '../../src/components/EducationSection.astro';
import indexSource from '../../src/pages/index.astro?raw';

const entry = (id: string, order: number, status: 'completed' | 'in-progress', startYear: number, endYear: number) => ({
  id,
  data: {
    degree: `Titulación ${id}`,
    specialization: `Especialidad ${id}`,
    institution: `Institución ${id}`,
    institutionShort: `SIG${id.toUpperCase()}`,
    status,
    order,
    startYear,
    endYear,
  },
});

// Deliberately unsorted: the section orders the cards by `order`.
const props = { entries: [entry('b', 2, 'completed', 2023, 2025), entry('a', 1, 'in-progress', 2025, 2026)] };

const textOf = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const attribute = (tag: string, name: string) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const cardsOf = (html: string) => html.split(/<article\b/).slice(1);

describe('EducationSection', () => {
  let html = '';

  beforeAll(async () => {
    const container = await AstroContainer.create();
    html = await container.renderToString(EducationSection, { props });
  });

  it('is a section with id "formacion" labelled by the "Formación" h2', () => {
    const section = html.match(/<section[^>]*>/)?.[0] ?? '';
    const headings = [...html.matchAll(/<h2([^>]*)>([\s\S]*?)<\/h2>/g)];

    expect(attribute(section, 'id')).toBe('formacion');
    expect(headings).toHaveLength(1);
    expect(attribute(headings[0]?.[1] ?? '', 'id')).toBe(attribute(section, 'aria-labelledby'));
    expect(textOf(headings[0]?.[2] ?? '')).toBe('Formación');
  });

  it('renders one card per entry in the order of `order`', () => {
    const degrees = [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)].map(([, degree]) => textOf(degree ?? ''));

    expect(degrees).toEqual(['Titulación a', 'Titulación b']);
  });

  it('shows the years, the status, the specialization and the institution with its abbreviation', () => {
    const [first, second] = cardsOf(html).map(textOf);

    expect(first).toContain('2025 – 2026');
    expect(first).toContain('En curso');
    expect(first).toContain('Especialidad a');
    expect(first).toContain('SIGA');
    expect(first).toContain('Institución a');
    expect(second).toContain('2023 – 2025');
    expect(second).toContain('Finalizado');
  });

  it('shows the abbreviation before the full institution name', () => {
    const [first = ''] = cardsOf(html);

    expect(first.indexOf('SIGA')).toBeGreaterThan(-1);
    expect(first.indexOf('SIGA')).toBeLessThan(first.indexOf('Institución a'));
  });

  it('marks each card for the shared reveal and the shared spotlight', () => {
    const cards = html.match(/<article[^>]*>/g) ?? [];

    expect(cards).toHaveLength(2);
    for (const card of cards) {
      expect(card).toMatch(/\sdata-reveal(?=[\s=>])/);
      expect(card).toMatch(/\sdata-spotlight(?=[\s=>])/);
    }
  });

  it('contains no focusable elements', () => {
    expect(html).not.toMatch(/<(a|button|input|select|textarea)\b|tabindex=/);
  });
});

describe('home page', () => {
  it('renders EducationSection right after ExperienceSection inside main', () => {
    const main = indexSource.match(/<main>([\s\S]*?)<\/main>/)?.[1] ?? '';
    const components = [...main.matchAll(/<([A-Z]\w*)[\s/>]/g)].map(([, name]) => name);

    expect(components.slice(0, 6)).toEqual([
      'HomeHero',
      'AboutSection',
      'TechStackSection',
      'ProjectsSection',
      'ExperienceSection',
      'EducationSection',
    ]);
  });

  it('takes the entries from the education collection', () => {
    expect(indexSource).toMatch(/getCollection\(\s*'education'\s*\)/);
  });
});
