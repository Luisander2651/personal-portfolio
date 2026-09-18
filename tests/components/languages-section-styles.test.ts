import { describe, expect, it } from 'vitest';
import languagesSectionSource from '../../src/components/LanguagesSection.astro?raw';

type Rule = { selector: string; body: string; ancestors: string[] };

const LITERAL = /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?)\(|\b\d*\.?\d+(px|rem|em|vh|svh|dvh|vw|%|ms|s)\b/i;
const DESKTOP = /@media\s*\(\s*min-width:\s*768px\s*\)/;
const FINE_POINTER = /@media\s*\(\s*hover:\s*hover\s*\)\s*and\s*\(\s*pointer:\s*fine\s*\)/;
const REDUCED = /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)/;
const NO_PREFERENCE = /@media\s*\(\s*prefers-reduced-motion:\s*no-preference\s*\)/;
const HIDES_OR_MOVES = /(^|;|\s)(opacity|transform|translate|filter|visibility|animation[\w-]*)\s*:|display:\s*none/;

const styles = (languagesSectionSource.match(/<style[^>]*>([\s\S]*?)<\/style>/)?.[1] ?? '').replace(/\/\*[\s\S]*?\*\//g, '');

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
const bodyOf = (selector: RegExp, where: (rule: Rule) => boolean = () => true) =>
  rules
    .filter((rule) => selector.test(rule.selector) && where(rule))
    .map(({ body }) => body)
    .join(';');
const base = (rule: Rule) => rule.ancestors.length === 0;

describe('LanguagesSection styles', () => {
  it('has scoped styles', () => {
    expect(languagesSectionSource).not.toMatch(/<style[^>]*is:global/);
    expect(styles.trim()).not.toBe('');
  });

  it('uses no literal colors, sizes, spacing or durations', () => {
    const values = [...styles.matchAll(/:\s*([^;{}]+);/g)].map(([, value]) => value ?? '');
    expect(values.filter((value) => LITERAL.test(value))).toEqual([]);
  });

  it.each(['--section-max-width', '--section-header-gap', '--space-section', '--space-gutter'])('uses the %s token', (token) => {
    expect(styles).toContain(`var(${token})`);
  });

  it('stacks the cards below 768px and uses two equal columns from 768px', () => {
    expect(bodyOf(/^\.languages-list$/, base)).toMatch(/gap:\s*var\(--space-3\)/);
    const desktop = bodyOf(/^\.languages-list$/, (rule) => inside(rule, DESKTOP));
    expect(desktop).toMatch(/grid-template-columns:\s*repeat\(\s*2,\s*minmax\(0,\s*1fr\)\s*\)/);
    expect(desktop).toMatch(/gap:\s*var\(--space-4\)/);
  });

  it('draws each language as a system card', () => {
    const card = bodyOf(/^\.language-card$/, base);

    for (const token of ['--color-surface', '--color-border', '--radius-lg', '--card-padding', '--card-gap', '--border-width']) {
      expect(card).toContain(`var(${token})`);
    }
  });

  it('shows the level as secondary body text close to the language', () => {
    const level = bodyOf(/^\.language-level$/, base);

    expect(level).toMatch(/color:\s*var\(--color-text-secondary\)/);
    expect(level).toContain('var(--text-body-size)');
    expect(bodyOf(/^\.language-heading$/, base)).toMatch(/gap:\s*var\(--space-2\)/);
  });

  it('shows the tag as a system tag with its natural width, aligned to the left', () => {
    const tag = bodyOf(/^\.language-tag$/, base);

    for (const token of ['--font-mono', '--tag-height', '--tag-padding-x', '--color-tag-bg', '--color-tag-text', '--tag-font-size']) {
      expect(tag).toContain(`var(${token})`);
    }
    expect(tag).toMatch(/align-self:\s*flex-start/);
  });

  describe('spotlight (M-1)', () => {
    const lit = rules.filter(({ selector }) => /data-spotlight-active|:hover/.test(selector));

    it('brightens the level for the active card, and on hover with reduced motion', () => {
      const active = lit.filter(({ selector }) => /data-spotlight-active/.test(selector));
      const hover = lit.filter((rule) => inside(rule, REDUCED));

      for (const group of [active, hover]) {
        expect(group.length).toBeGreaterThan(0);
        for (const { selector, body } of group) {
          expect(selector).toMatch(/\.language-level/);
          expect(body).toMatch(/color:\s*var\(--color-text\)/);
        }
      }
    });

    it('keeps the lit rules inside the fine pointer media query, hover only with reduced motion', () => {
      expect(lit.length).toBeGreaterThan(0);
      for (const rule of lit) {
        expect(inside(rule, FINE_POINTER)).toBe(true);
        if (/:hover/.test(rule.selector)) expect(inside(rule, REDUCED)).toBe(true);
      }
    });

    it('animates the color only without reduced motion', () => {
      const transitions = rules.filter(({ body }) => /transition/.test(body));

      expect(transitions.length).toBeGreaterThan(0);
      expect(transitions.filter((rule) => !inside(rule, NO_PREFERENCE) || !inside(rule, FINE_POINTER))).toEqual([]);
      for (const { body } of transitions) expect(body).toMatch(/var\(--duration-base\) var\(--ease-out\)/);
    });
  });

  it('has no styles that hide or move content', () => {
    expect(rules.filter(({ body }) => HIDES_OR_MOVES.test(body))).toEqual([]);
  });
});
