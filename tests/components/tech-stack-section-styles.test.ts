import { describe, expect, it } from 'vitest';
import techStackSource from '../../src/components/TechStackSection.astro?raw';

type Rule = { selector: string; body: string; ancestors: string[] };

const LITERAL = /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?)\(|\b\d*\.?\d+(px|rem|em|vh|svh|dvh|vw|%|ms|s)\b/i;
const MOTION_PROPERTIES = /(^|;|\s)(animation[\w-]*|opacity|transform|filter|visibility)\s*:/;
const DESKTOP = /@media\s*\(\s*min-width:\s*768px\s*\)/;

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

describe('TechStackSection styles', () => {
  it('has scoped styles', () => {
    expect(styles.trim()).not.toBe('');
  });

  it('uses no literal colors, sizes, spacing or durations', () => {
    const values = [...styles.matchAll(/:\s*([^;{}]+);/g)].map(([, value]) => value ?? '');
    expect(values.filter((value) => LITERAL.test(value))).toEqual([]);
  });

  it.each([
    '--section-max-width',
    '--section-header-gap',
    '--space-section',
    '--space-gutter',
    '--tech-card-min-width',
    '--tech-item-min-width',
    '--card-padding',
    '--card-gap',
  ])('uses the %s token', (token) => {
    expect(styles).toContain(`var(${token})`);
  });

  it('places Lenguajes and Backend in 5:7 from 768px', () => {
    const desktop = rules.filter((rule) => inside(rule, DESKTOP));
    expect(desktop.some(({ body }) => /grid-template-columns:\s*minmax\(\s*0,\s*5fr\s*\)\s+minmax\(\s*0,\s*7fr\s*\)/.test(body))).toBe(
      true,
    );
  });

  it('fits the second row cards and the items by their minimum width tokens', () => {
    expect(styles).toMatch(/repeat\(\s*auto-fit,\s*minmax\(\s*min\(\s*var\(--tech-card-min-width\),\s*100%\s*\),\s*1fr\s*\)\s*\)/);
    expect(styles).toMatch(/repeat\(\s*auto-fill,\s*minmax\(\s*min\(\s*var\(--tech-item-min-width\),\s*100%\s*\),\s*1fr\s*\)\s*\)/);
  });

  it('paints the icons with currentColor in the secondary text color', () => {
    const icon = rules.find(({ selector }) => /^\.tech-icon$/.test(selector));

    expect(icon?.body).toMatch(/color:\s*var\(--color-text-secondary\)/);
    expect(styles).toMatch(/fill:\s*currentColor/);
    expect(styles).toMatch(/stroke:\s*currentColor/);
    expect(styles).toMatch(/stroke-width:\s*var\(--icon-stroke\)/);
  });

  describe('M-2 reveal (shared on-enter reveal)', () => {
    it('defines no reveal animation of its own', () => {
      expect(styles).not.toMatch(/animation|@keyframes|will-change/);
    });

    it('has no styles that hide or move its content', () => {
      expect(rules.filter((rule) => MOTION_PROPERTIES.test(rule.body))).toEqual([]);
    });
  });
});
