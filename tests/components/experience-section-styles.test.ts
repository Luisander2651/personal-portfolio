import { describe, expect, it } from 'vitest';
import experienceSectionSource from '../../src/components/ExperienceSection.astro?raw';

type Rule = { selector: string; body: string; ancestors: string[] };

const LITERAL = /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?)\(|\b\d*\.?\d+(px|rem|em|vh|svh|dvh|vw|%|ms|s)\b/i;
const DESKTOP = /@media\s*\(\s*min-width:\s*768px\s*\)/;
const FINE_POINTER = /@media\s*\(\s*hover:\s*hover\s*\)\s*and\s*\(\s*pointer:\s*fine\s*\)/;
const REDUCED = /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)/;
const NO_PREFERENCE = /@media\s*\(\s*prefers-reduced-motion:\s*no-preference\s*\)/;
const HIDES_OR_MOVES = /(^|;|\s)(opacity|transform|translate|filter|visibility|animation[\w-]*)\s*:|display:\s*none/;

const styles = (experienceSectionSource.match(/<style[^>]*>([\s\S]*?)<\/style>/)?.[1] ?? '').replace(/\/\*[\s\S]*?\*\//g, '');

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

describe('ExperienceSection styles', () => {
  it('has scoped styles', () => {
    expect(experienceSectionSource).not.toMatch(/<style[^>]*is:global/);
    expect(styles.trim()).not.toBe('');
  });

  it('uses no literal colors, sizes, spacing or durations', () => {
    const values = [...styles.matchAll(/:\s*([^;{}]+);/g)].map(([, value]) => value ?? '');
    expect(values.filter((value) => LITERAL.test(value))).toEqual([]);
  });

  it.each(['--section-max-width', '--section-header-gap', '--space-section', '--space-gutter', '--card-padding', '--space-5'])(
    'uses the %s token',
    (token) => {
      expect(styles).toContain(`var(${token})`);
    },
  );

  it('draws the row between hairlines, without a surface of its own, below 768px', () => {
    const row = bodyOf(/^\.experience-row$/, base);

    expect(row).toMatch(/border-top:\s*var\(--border-width\) solid var\(--color-border\)/);
    expect(row).not.toMatch(/background/);
    expect(bodyOf(/^\.experience-rows$/, base)).toMatch(/border-bottom:\s*var\(--border-width\) solid var\(--color-border\)/);
  });

  it('turns the row into a system card from 768px, with the rows spaced apart', () => {
    const row = bodyOf(/^\.experience-row$/, (rule) => inside(rule, DESKTOP));
    const rows = bodyOf(/^\.experience-rows$/, (rule) => inside(rule, DESKTOP));

    expect(row).toMatch(/border:\s*var\(--border-width\) solid var\(--color-border\)/);
    expect(row).toMatch(/border-radius:\s*var\(--radius-lg\)/);
    expect(row).toMatch(/background-color:\s*var\(--color-surface\)/);
    expect(rows).toMatch(/gap:\s*var\(--space-4\)/);
    expect(rows).toMatch(/border-bottom:\s*(0|none)\b/);
  });

  it('stacks the row below 768px and uses the meta column from 768px', () => {
    expect(bodyOf(/^\.experience-row$/, base)).toMatch(/grid-template-columns:\s*minmax\(0,\s*1fr\)/);
    expect(bodyOf(/^\.experience-row$/, (rule) => inside(rule, DESKTOP))).toMatch(
      /grid-template-columns:\s*var\(--experience-meta-width\)\s+minmax\(0,\s*1fr\)/,
    );
  });

  it('shows the period with the mono label tokens in the muted color', () => {
    const period = bodyOf(/^\.experience-period$/, base);

    for (const token of ['--font-mono', '--text-mono-label-size', '--text-mono-label-weight', '--text-mono-label-tracking']) {
      expect(period).toContain(`var(${token})`);
    }
    expect(period).toMatch(/color:\s*var\(--color-text-muted\)/);
  });

  it('shows the position as body text and the achievements like the project card', () => {
    expect(bodyOf(/^\.experience-position$/, base)).toMatch(/color:\s*var\(--color-text-secondary\)/);
    expect(bodyOf(/^\.experience-achievement$/, base)).toMatch(/grid-template-columns:\s*var\(--space-2\)\s+minmax\(0,\s*1fr\)/);
    expect(bodyOf(/^\.experience-achievement-mark$/, base)).toMatch(/background-color:\s*var\(--color-border-strong\)/);
  });

  describe('spotlight (M-1)', () => {
    const lit = rules.filter(({ selector }) => /data-spotlight-active|:hover/.test(selector));

    it('brightens the achievements and the period for the active row, and on hover with reduced motion', () => {
      const active = lit.filter(({ selector }) => /data-spotlight-active/.test(selector)).map(({ body }) => body).join(';');
      const hover = lit.filter((rule) => inside(rule, REDUCED)).map(({ body }) => body).join(';');

      for (const body of [active, hover]) {
        expect(body).toMatch(/color:\s*var\(--color-text-secondary\)/);
        expect(body).toMatch(/background-color:\s*var\(--color-glow\)/);
      }
    });

    it('keeps the lit rules inside the fine pointer media query, hover only with reduced motion', () => {
      expect(lit.length).toBeGreaterThan(0);
      for (const rule of lit) {
        expect(inside(rule, FINE_POINTER)).toBe(true);
        if (/:hover/.test(rule.selector)) expect(inside(rule, REDUCED)).toBe(true);
      }
    });

    it('animates the colors only without reduced motion', () => {
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
