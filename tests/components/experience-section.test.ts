import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import ExperienceSection from '../../src/components/ExperienceSection.astro';
import indexSource from '../../src/pages/index.astro?raw';

const entry = (id: string, company: string, achievements: string[]) => ({
  id,
  body: `\n${achievements.map((text) => `- ${text}`).join('\n')}\n`,
  data: {
    company,
    position: `Puesto de ${id}`,
    period: `periodo de ${id}`,
    duration: `${achievements.length} meses`,
  },
});

const props = { experiences: [entry('a', 'Empresa A', ['Logro A1.', 'Logro A2.'])] };

const HIDDEN = /<(\w+)[^>]*aria-hidden="true"[^>]*>[\s\S]*?<\/\1>/g;
const textOf = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const attribute = (tag: string, name: string) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const render = async (sectionProps: { experiences: ReturnType<typeof entry>[] }) => {
  const container = await AstroContainer.create();
  return container.renderToString(ExperienceSection, { props: sectionProps });
};

describe('ExperienceSection', () => {
  let html = '';

  beforeAll(async () => {
    html = await render(props);
  });

  it('is a section with id "experiencia" labelled by the "Experiencia profesional" h2', () => {
    const section = html.match(/<section[^>]*>/)?.[0] ?? '';
    const headings = [...html.matchAll(/<h2([^>]*)>([\s\S]*?)<\/h2>/g)];

    expect(attribute(section, 'id')).toBe('experiencia');
    expect(headings).toHaveLength(1);
    expect(attribute(headings[0]?.[1] ?? '', 'id')).toBe(attribute(section, 'aria-labelledby'));
    expect(textOf(headings[0]?.[2] ?? '')).toBe('Experiencia profesional');
  });

  it('marks each row for the shared reveal and the shared spotlight', () => {
    const rows = html.match(/<article[^>]*>/g) ?? [];

    expect(rows).toHaveLength(1);
    for (const row of rows) {
      expect(row).toMatch(/\sdata-reveal(?=[\s=>])/);
      expect(row).toMatch(/\sdata-spotlight(?=[\s=>])/);
    }
  });

  it('shows the company as an h3, with the position, the period and the duration', () => {
    const headings = [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)].map(([, name]) => textOf(name ?? ''));
    const period = html.match(/<p[^>]*class="[^"]*experience-period[^"]*"[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? '';

    expect(headings).toEqual(['Empresa A']);
    expect(textOf(html)).toContain('Puesto de a');
    // The parts are separate spans spaced by the flex gap, so the text has no whitespace between them.
    expect(textOf(period)).toBe('periodo de a·2 meses');
    expect(period).toMatch(/<span[^>]*aria-hidden="true"[^>]*>\s*·\s*<\/span>/);
  });

  it('lists the achievements of the entry body in order, each with a decorative mark', () => {
    const list = html.match(/<ul[^>]*class="[^"]*experience-achievements[^"]*"[^>]*>([\s\S]*?)<\/ul>/)?.[1] ?? '';
    const items = [...list.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map(([, item]) => item ?? '');

    expect(items.map((item) => textOf(item.replace(HIDDEN, '')))).toEqual(['Logro A1.', 'Logro A2.']);
    for (const item of items) expect(item).toMatch(/<span[^>]*aria-hidden="true"[^>]*><\/span>/);
  });

  it('renders every experience of the collection, in order', async () => {
    const two = await render({
      experiences: [entry('a', 'Empresa A', ['Logro A1.']), entry('b', 'Empresa B', ['Logro B1.'])],
    });

    expect((two.match(/<article\b/g) ?? []).length).toBe(2);
    expect([...two.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)].map(([, name]) => textOf(name ?? ''))).toEqual([
      'Empresa A',
      'Empresa B',
    ]);
  });

  it('contains no focusable elements', () => {
    expect(html).not.toMatch(/<(a|button|input|select|textarea)\b|tabindex=/);
  });
});

describe('home page', () => {
  it('renders ExperienceSection right after ProjectsSection inside main', () => {
    const main = indexSource.match(/<main>([\s\S]*?)<\/main>/)?.[1] ?? '';
    const components = [...main.matchAll(/<([A-Z]\w*)[\s/>]/g)].map(([, name]) => name);

    expect(components.slice(0, 5)).toEqual([
      'HomeHero',
      'AboutSection',
      'TechStackSection',
      'ProjectsSection',
      'ExperienceSection',
    ]);
  });

  it('takes the experiences from the collection', () => {
    expect(indexSource).toMatch(/getCollection\(\s*'experience'\s*\)/);
  });
});
