import { describe, expect, it } from 'vitest';
import brandHeaderSource from '../../src/components/BrandHeader.astro?raw';
import notFoundSource from '../../src/components/NotFoundScreen.astro?raw';

type Rule = { selector: string; body: string; ancestors: string[] };

const LITERAL = /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?)\(|\b\d*\.?\d+(px|rem|em|vh|svh|dvh|vw|%|ms|s)\b/i;
const REDUCED = /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)/;
const NO_PREFERENCE = /@media\s*\(\s*prefers-reduced-motion:\s*no-preference\s*\)/;
const HIDES = /(^|;|\s)(visibility:\s*hidden|display:\s*none|opacity:\s*0\s*(;|$))/;

const stylesOf = (source: string) => (source.match(/<style[^>]*>([\s\S]*?)<\/style>/)?.[1] ?? '').replace(/\/\*[\s\S]*?\*\//g, '');

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
      if (buffer.trim() !== '') rules.push({ selector: selector.replace(/\s+/g, ' '), body: buffer.trim(), ancestors: [...stack] });
      buffer = '';
    } else {
      buffer += char;
    }
  }
  return rules;
}

const screenStyles = stylesOf(notFoundSource);
const headerStyles = stylesOf(brandHeaderSource);
const rules = parseRules(screenStyles);
const inside = (rule: Rule, prelude: RegExp) => rule.ancestors.some((ancestor) => prelude.test(ancestor));
const bodyOf = (selector: RegExp) =>
  rules
    .filter((rule) => selector.test(rule.selector))
    .map(({ body }) => body)
    .join(';');

describe('404 styles', () => {
  it('are scoped and present in both components', () => {
    expect(notFoundSource).not.toMatch(/<style[^>]*is:global/);
    expect(brandHeaderSource).not.toMatch(/<style[^>]*is:global/);
    expect(screenStyles.trim()).not.toBe('');
    expect(headerStyles.trim()).not.toBe('');
  });

  it('use no literal colors, sizes, spacing or durations', () => {
    for (const styles of [screenStyles, headerStyles]) {
      const values = [...styles.matchAll(/:\s*([^;{}]+);/g)].map(([, value]) => value ?? '');
      expect(values.filter((value) => LITERAL.test(value))).toEqual([]);
    }
  });

  it('gives the header the navigation height and background, without fixing it', () => {
    expect(headerStyles).toMatch(/min-height:\s*var\(--nav-height\)/);
    expect(headerStyles).toMatch(/background-color:\s*var\(--color-nav-bg\)/);
    expect(headerStyles).toMatch(/border-bottom:\s*var\(--border-width\) solid var\(--color-border\)/);
    expect(headerStyles).toContain('var(--section-max-width)');
    expect(headerStyles).toContain('var(--space-gutter)');
    expect(headerStyles).not.toMatch(/position:\s*(fixed|sticky)/);
  });

  it('centres the screen in what is left of the viewport', () => {
    const screen = bodyOf(/^\.not-found$/);

    expect(screen).toMatch(/min-height:\s*calc\(var\(--hero-min-height\) - var\(--nav-height\)\)/);
    expect(screen).toMatch(/justify-content:\s*center/);
    expect(screen).toMatch(/align-items:\s*center/);
    expect(screen).toMatch(/text-align:\s*center/);
    expect(screen).toContain('var(--space-section)');
    expect(screen).toContain('var(--space-gutter)');
  });

  it('draws the code with the 404 tokens and its glow', () => {
    const code = bodyOf(/^\.not-found-code$/);

    expect(code).toMatch(/font-family:\s*var\(--font-mono\)/);
    expect(code).toMatch(/font-size:\s*var\(--not-found-code-size\)/);
    expect(code).toMatch(/text-shadow:\s*var\(--shadow-glow-text\)/);
    expect(code).toMatch(/color:\s*var\(--color-text\)/);
  });

  it('shows the line as muted body text', () => {
    expect(bodyOf(/^\.not-found-line$/)).toMatch(/color:\s*var\(--color-text-muted\)/);
  });

  it('styles the link as the secondary button of the system', () => {
    const link = bodyOf(/^\.not-found-link$/);

    for (const token of ['--control-height', '--control-padding-x', '--radius-md', '--color-secondary-bg', '--color-border-strong']) {
      expect(link).toContain(`var(${token})`);
    }
    const hover = bodyOf(/\.not-found-link:hover$/);
    expect(hover).toMatch(/border-color:\s*var\(--color-accent\)/);
    expect(hover).toMatch(/box-shadow:\s*var\(--shadow-glow-secondary\)/);
    expect(bodyOf(/\.not-found-link:hover \.not-found-arrow|\.not-found-link:focus-visible \.not-found-arrow/)).toMatch(
      /color:\s*var\(--color-glow\)/,
    );
  });

  it('shows the focus ring of the system on the link', () => {
    const focus = bodyOf(/^\.not-found-link:focus-visible$/);
    expect(focus).toMatch(/outline:\s*var\(--focus-ring\)/);
    expect(focus).toMatch(/outline-offset:\s*var\(--focus-ring-offset\)/);
  });

  it('animates the link only without reduced motion', () => {
    const transitions = rules.filter(({ body }) => /transition/.test(body));

    expect(transitions.length).toBeGreaterThan(0);
    for (const rule of transitions) {
      expect(inside(rule, NO_PREFERENCE)).toBe(true);
      expect(inside(rule, REDUCED)).toBe(false);
      expect(rule.body).toMatch(/var\(--duration-fast\) var\(--ease-out\)/);
    }
  });

  it('has no styles that hide content', () => {
    expect(rules.filter(({ body }) => HIDES.test(body))).toEqual([]);
  });
});
