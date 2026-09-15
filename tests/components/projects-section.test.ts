import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import ProjectsSection from '../../src/components/ProjectsSection.astro';
import indexSource from '../../src/pages/index.astro?raw';

const project = (id: string, order: number, featured: boolean, achievements: string[]) => ({
  id,
  body: `\n${achievements.map((text) => `- ${text}`).join('\n')}\n`,
  data: {
    name: `Proyecto ${id}`,
    order,
    status: order === 2 ? 'in-progress' : 'completed',
    featured,
    stack: [`Tecnología ${id}`],
  },
});

const props = {
  featured: [project('a', 1, true, ['Logro A1.', 'Logro A2.']), project('b', 2, true, ['Logro B1.'])],
  rest: [project('c', 3, false, ['Logro C1.']), project('d', 4, false, ['Logro D1.']), project('e', 5, false, ['Logro E1.'])],
};

const HIDDEN = /<(\w+)[^>]*aria-hidden="true"[^>]*>[\s\S]*?<\/\1>/g;
const textOf = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const attribute = (tag: string, name: string) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
/** Content of the first element with the class, up to the next block with one of the boundary classes. */
const blockOf = (html: string, className: string, until: string[]) => {
  const start = html.search(new RegExp(`<div[^>]*class="[^"]*\\b${className}\\b`));
  if (start < 0) return '';
  const ends = until.map((name) => html.indexOf(`class="${name}`, start + 1)).filter((i) => i > start);
  return html.slice(start, Math.min(html.length, ...ends));
};
const cardNames = (html: string) => [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)].map(([, name]) => textOf(name ?? ''));

describe('ProjectsSection', () => {
  let html = '';

  beforeAll(async () => {
    const container = await AstroContainer.create();
    html = await container.renderToString(ProjectsSection, { props });
  });

  it('is a section with id "proyectos" labelled by the "Proyectos" h2', () => {
    const section = html.match(/<section[^>]*>/)?.[0] ?? '';
    const headings = [...html.matchAll(/<h2([^>]*)>([\s\S]*?)<\/h2>/g)];

    expect(attribute(section, 'id')).toBe('proyectos');
    expect(headings).toHaveLength(1);
    expect(attribute(headings[0]?.[1] ?? '', 'id')).toBe(attribute(section, 'aria-labelledby'));
    expect(textOf(headings[0]?.[2] ?? '')).toBe('Proyectos');
  });

  it('groups exactly the featured projects in the panel, with the hidden connector between them', () => {
    const panel = blockOf(html, 'projects-featured', ['projects-rest']);
    const connector = panel.match(/<span[^>]*class="[^"]*projects-connector[^"]*"[^>]*>/g) ?? [];

    expect(cardNames(panel)).toEqual(['Proyecto a', 'Proyecto b']);
    expect(connector).toHaveLength(1);
    expect(connector[0]).toMatch(/aria-hidden="true"/);
    expect(panel.indexOf('projects-connector')).toBeGreaterThan(panel.indexOf('Proyecto a'));
    expect(panel.indexOf('projects-connector')).toBeLessThan(panel.indexOf('Proyecto b'));
  });

  it('shows the other projects after the panel, in order', () => {
    const rest = blockOf(html, 'projects-rest', []);

    expect(html.indexOf('projects-rest')).toBeGreaterThan(html.indexOf('projects-featured'));
    expect(cardNames(rest)).toEqual(['Proyecto c', 'Proyecto d', 'Proyecto e']);
    expect(rest).not.toMatch(/projects-connector/);
  });

  it('takes the achievements of each card from the entry body', () => {
    const achievements = [...html.matchAll(/<ul[^>]*class="[^"]*project-achievements[^"]*"[^>]*>([\s\S]*?)<\/ul>/g)].map(([, list]) =>
      [...(list ?? '').matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map(([, item]) => textOf((item ?? '').replace(HIDDEN, ''))),
    );

    expect(achievements).toEqual([['Logro A1.', 'Logro A2.'], ['Logro B1.'], ['Logro C1.'], ['Logro D1.'], ['Logro E1.']]);
  });

  it('contains no focusable elements', () => {
    expect(html).not.toMatch(/<(a|button|input|select|textarea)\b|tabindex=/);
  });
});

describe('home page', () => {
  it('renders ProjectsSection right after TechStackSection inside main', () => {
    const main = indexSource.match(/<main>([\s\S]*?)<\/main>/)?.[1] ?? '';
    const components = [...main.matchAll(/<([A-Z]\w*)[\s/>]/g)].map(([, name]) => name);

    expect(components.slice(0, 4)).toEqual(['HomeHero', 'AboutSection', 'TechStackSection', 'ProjectsSection']);
  });

  it('groups the projects collection for the section', () => {
    expect(indexSource).toMatch(/getCollection\(\s*'projects'\s*\)/);
    expect(indexSource).toMatch(/groupProjectsForSection\(/);
  });
});
