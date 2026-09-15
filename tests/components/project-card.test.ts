import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import ProjectCard from '../../src/components/ProjectCard.astro';

const props = {
  order: 3,
  name: 'Proyecto de prueba',
  status: 'in-progress',
  achievements: ['Primer logro de prueba.', 'Segundo logro, con coma.'],
  stack: ['Tecnología A', 'Tecnología B', 'Tecnología C'],
};

const textOf = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const HIDDEN = /<(\w+)[^>]*aria-hidden="true"[^>]*>[\s\S]*?<\/\1>/g;
const listItems = (html: string, className: string) => {
  const list = html.match(new RegExp(`<ul[^>]*class="[^"]*\\b${className}\\b[^"]*"[^>]*>([\\s\\S]*?)</ul>`))?.[1] ?? '';
  return [...list.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map(([, content]) => content ?? '');
};

describe('ProjectCard', () => {
  let html = '';

  beforeAll(async () => {
    const container = await AstroContainer.create();
    html = await container.renderToString(ProjectCard, { props });
  });

  it('is an article marked for the shared reveal and the shared spotlight', () => {
    const article = html.match(/<article[^>]*>/)?.[0] ?? '';

    expect(html.match(/<article\b/g)).toHaveLength(1);
    expect(article).toMatch(/\sdata-reveal(?=[\s=>])/);
    expect(article).toMatch(/\sdata-spotlight(?=[\s=>])/);
  });

  it('shows the two-digit order as a decorative index, hidden from assistive technology', () => {
    expect(html).toMatch(/<span[^>]*aria-hidden="true"[^>]*>03<\/span>/);
  });

  it('shows the status badge with its visible label', () => {
    expect(html).toMatch(/status-badge--in-progress/);
    expect(textOf(html.replace(HIDDEN, ''))).toContain('En curso');
  });

  it('renders the name as the only heading, an h3', () => {
    const headings = [...html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/g)];

    expect(headings.map(([, level, content]) => [level, textOf(content ?? '')])).toEqual([['3', props.name]]);
  });

  it('lists the achievements in order, each with a decorative mark hidden from assistive technology', () => {
    const items = listItems(html, 'project-achievements');

    expect(items.map((item) => textOf(item.replace(HIDDEN, '')))).toEqual(props.achievements);
    for (const item of items) expect(item).toMatch(/<span[^>]*aria-hidden="true"[^>]*><\/span>/);
  });

  it('lists the stack in order as text tags without icons', () => {
    const items = listItems(html, 'project-stack');

    expect(items.map(textOf)).toEqual(props.stack);
    expect(html).not.toMatch(/<svg/);
  });

  it('keeps the achievements before the stack', () => {
    expect(html.indexOf('project-achievements')).toBeLessThan(html.indexOf('project-stack'));
  });

  it('contains no focusable elements', () => {
    expect(html).not.toMatch(/<(a|button|input|select|textarea)\b|tabindex=/);
  });
});
