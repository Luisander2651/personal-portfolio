import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import TechStackSection from '../../src/components/TechStackSection.astro';
import techStackSource from '../../src/components/TechStackSection.astro?raw';

type Rule = { selector: string; body: string; ancestors: string[] };

const FINE_POINTER = /@media\s*\(\s*hover:\s*hover\s*\)\s*and\s*\(\s*pointer:\s*fine\s*\)/;
const REDUCED = /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)/;
const NO_PREFERENCE = /@media\s*\(\s*prefers-reduced-motion:\s*no-preference\s*\)/;

const styles = (techStackSource.match(/<style[^>]*>([\s\S]*?)<\/style>/)?.[1] ?? '').replace(/\/\*[\s\S]*?\*\//g, '');

/** Innermost rules with the preludes of every block that contains them. */
function parseRules(css: string): Rule[] {
  const rules: Rule[] = [];
  const stack: string[] = [];
  let buffer = '';
  for (const char of css) {
    if (char === '{') {
      stack.push(buffer.trim());
      buffer = '';
    } else if (char === '}') {
      const selector = stack.pop() ?? '';
      if (buffer.trim() !== '') rules.push({ selector, body: buffer.trim(), ancestors: [...stack] });
      buffer = '';
    } else {
      buffer += char;
    }
  }
  return rules;
}

const rules = parseRules(styles);
const inside = (rule: Rule, prelude: RegExp) => rule.ancestors.some((ancestor) => prelude.test(ancestor));

const category = (id: string, name: string, order: number, presentation: string, items: string[]) => ({
  id,
  data: { category: name, order, presentation, items },
});

const props = {
  icons: [
    category('languages', 'Lenguajes y fundamentos', 1, 'icons', ['TypeScript', 'SQL']),
    category('backend', 'Backend y web', 2, 'icons', ['Node.js']),
    category('mobile', 'Desarrollo móvil', 3, 'icons', ['Ionic']),
  ],
  tags: [category('architecture', 'Arquitectura y prácticas', 8, 'tags', ['microservicios'])],
  text: [category('ci-cd', 'CI/CD', 9, 'text', ['Texto de CI/CD de prueba'])],
};

describe('TechStackSection spotlight (M-1, shared CardSpotlight)', () => {
  let html = '';

  beforeAll(async () => {
    const container = await AstroContainer.create();
    html = await container.renderToString(TechStackSection, { props });
  });

  it('marks every category card with icons, and nothing else, as a spotlight card', () => {
    const opening = (className: string) =>
      [...html.matchAll(new RegExp(`<div[^>]*class="(?:[^"]*\\s)?${className}(?:\\s[^"]*)?"[^>]*>`, 'g'))].map(([tag]) => tag);
    const marked = (tag: string) => /\sdata-spotlight(?=[\s=>])/.test(tag);

    expect(opening('tech-card')).toHaveLength(3);
    expect(opening('tech-card').every(marked)).toBe(true);
    expect(html.match(/\sdata-spotlight(?=[\s=>])/g)).toHaveLength(3);
  });

  it('has no spotlight script or light layers of its own', () => {
    expect(techStackSource).not.toMatch(/<script\b/);
    expect(styles).not.toMatch(/::before|::after|radial-gradient|--color-spotlight|--border-glow|--shadow-glow-soft/);
  });

  it('turns the icons to --color-text for the active card, inside the fine pointer media query', () => {
    const lit = rules.filter(({ selector }) => /\.tech-icon\b/.test(selector) && /data-spotlight-active|:hover/.test(selector));

    expect(lit.filter(({ selector }) => /data-spotlight-active/.test(selector)).length).toBeGreaterThan(0);
    expect(lit.filter((rule) => inside(rule, REDUCED) && /:hover/.test(rule.selector)).length).toBeGreaterThan(0);
    for (const rule of lit) {
      expect(rule.body).toMatch(/color:\s*var\(--color-text\)/);
      expect(inside(rule, FINE_POINTER)).toBe(true);
    }
  });

  it('animates the icon color only without reduced motion', () => {
    const transitions = rules.filter(({ body }) => /transition/.test(body));

    expect(transitions.length).toBeGreaterThan(0);
    expect(transitions.filter((rule) => !inside(rule, NO_PREFERENCE) || !inside(rule, FINE_POINTER))).toEqual([]);
  });
});
