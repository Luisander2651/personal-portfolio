import { describe, expect, it } from 'vitest';
import aboutSource from '../../src/components/AboutSection.astro?raw';
import sectionHeaderSource from '../../src/components/SectionHeader.astro?raw';

type Rule = { selector: string; body: string; ancestors: string[] };

const LITERAL = /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?)\(|\b\d*\.?\d+(px|rem|em|vh|svh|dvh|vw|%|ms|s)\b/i;
const MOTION_PROPERTIES = /(^|;|\s)(animation[\w-]*|opacity|transform|filter)\s*:/;

const stylesOf = (source: string) =>
  (source.match(/<style[^>]*>([\s\S]*?)<\/style>/)?.[1] ?? '').replace(/\/\*[\s\S]*?\*\//g, '');

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

const components = { SectionHeader: stylesOf(sectionHeaderSource), AboutSection: stylesOf(aboutSource) };
const allStyles = Object.values(components).join('\n');
const rulesOf = (css: string) => parseRules(css);

describe('About section styles', () => {
  it.each(Object.entries(components))('%s has scoped styles', (_name, css) => {
    expect(css.trim()).not.toBe('');
  });

  it('uses no literal colors, sizes, spacing or durations', () => {
    const values = [...allStyles.matchAll(/:\s*([^;{}]+);/g)].map(([, value]) => value ?? '');
    expect(values.filter((value) => LITERAL.test(value))).toEqual([]);
  });

  it.each([
    '--space-section',
    '--space-gutter',
    '--section-max-width',
    '--section-header-gap',
    '--about-panel-padding',
    '--about-panel-gap',
    '--about-groups-gap',
    '--about-text-max-width',
  ])('uses the %s token', (token) => {
    expect(allStyles).toContain(`var(${token})`);
  });

  it('places the groups in two columns from 768px', () => {
    const desktop = rulesOf(components.AboutSection).filter(({ ancestors }) =>
      ancestors.some((prelude) => /@media\s*\(\s*min-width:\s*768px\s*\)/.test(prelude)),
    );

    expect(desktop.some(({ body }) => /grid-template-columns:\s*repeat\(2,/.test(body))).toBe(true);
  });

  it('uses no glow border or glow shadow', () => {
    expect(allStyles).not.toMatch(/--border-glow|--shadow-glow/);
  });

  describe('M-1 reveal (shared on-enter reveal)', () => {
    it.each(Object.entries(components))('%s defines no reveal animation of its own', (_name, css) => {
      expect(css).not.toMatch(/animation|@keyframes|will-change/);
    });

    it.each(Object.entries(components))('%s has no styles that hide or move its content', (_name, css) => {
      expect(rulesOf(css).filter((rule) => MOTION_PROPERTIES.test(rule.body))).toEqual([]);
    });
  });
});
