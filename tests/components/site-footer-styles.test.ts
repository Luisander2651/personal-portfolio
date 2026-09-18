import { describe, expect, it } from 'vitest';
import siteFooterSource from '../../src/components/SiteFooter.astro?raw';

type Rule = { selector: string; body: string; ancestors: string[] };

const LITERAL = /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?)\(|\b\d*\.?\d+(px|rem|em|vh|svh|dvh|vw|%|ms|s)\b/i;
const DESKTOP = /@media\s*\(\s*min-width:\s*768px\s*\)/;
const FINE_POINTER = /@media\s*\(\s*hover:\s*hover\s*\)\s*and\s*\(\s*pointer:\s*fine\s*\)/;
const REDUCED = /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)/;
const NO_PREFERENCE = /@media\s*\(\s*prefers-reduced-motion:\s*no-preference\s*\)/;
const HIDES_OR_MOVES = /(^|;|\s)(opacity|transform|translate|filter|visibility|animation[\w-]*)\s*:|display:\s*none/;

const styles = (siteFooterSource.match(/<style[^>]*>([\s\S]*?)<\/style>/)?.[1] ?? '').replace(/\/\*[\s\S]*?\*\//g, '');

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

describe('SiteFooter styles', () => {
  it('has scoped styles', () => {
    expect(siteFooterSource).not.toMatch(/<style[^>]*is:global/);
    expect(styles.trim()).not.toBe('');
  });

  it('uses no literal colors, sizes, spacing or durations', () => {
    const values = [...styles.matchAll(/:\s*([^;{}]+);/g)].map(([, value]) => value ?? '');
    expect(values.filter((value) => LITERAL.test(value))).toEqual([]);
  });

  it.each([
    '--section-max-width',
    '--space-section',
    '--space-gutter',
    '--color-border',
    '--text-h2-size',
    '--color-text-muted',
    '--control-height',
    '--icon-size-sm',
    '--text-mono-label-size',
    '--font-mono',
    '--text-small-size',
    '--color-link',
    '--color-link-hover',
    '--color-glow',
  ])('uses the %s token', (token) => {
    expect(styles).toContain(`var(${token})`);
  });

  it('paints a solid background, hiding the page grid behind the footer', () => {
    expect(bodyOf(/^\.site-footer$/, base)).toMatch(/background-color:\s*var\(--color-bg\)/);
  });

  it('draws a top border and stacks below 768px, two columns from 768px', () => {
    expect(bodyOf(/^\.site-footer$/, base)).toMatch(/border-top:\s*var\(--border-width\) solid var\(--color-border\)/);
    expect(bodyOf(/^\.site-footer-main$/, base)).not.toMatch(/grid-template-columns/);
    expect(bodyOf(/^\.site-footer-main$/, (rule) => inside(rule, DESKTOP))).toMatch(/grid-template-columns:\s*minmax\(0,\s*1\.2fr\)\s+minmax\(0,\s*1fr\)/);
  });

  it('lets the long contact values wrap anywhere', () => {
    expect(bodyOf(/^\.site-footer-value$/, base)).toMatch(/overflow-wrap:\s*anywhere/);
  });

  it('underlines the value in glow and lights the icon on hover and focus', () => {
    const lit = rules.filter(({ selector }) => /:hover|:focus-visible/.test(selector));
    const bodies = lit.map(({ body }) => body).join(';');

    expect(bodies).toMatch(/color:\s*var\(--color-link-hover\)/);
    expect(bodies).toMatch(/text-decoration-color:\s*var\(--color-glow\)/);
    expect(lit.some(({ selector, body }) => /contact-icon/.test(selector) && /color:\s*var\(--color-glow\)/.test(body))).toBe(true);
  });

  it('shows the focus ring of the system', () => {
    const focus = bodyOf(/:focus-visible$/);
    expect(focus).toMatch(/outline:\s*var\(--focus-ring\)/);
    expect(focus).toMatch(/outline-offset:\s*var\(--focus-ring-offset\)/);
  });

  it('animates the colors only without reduced motion', () => {
    const transitions = rules.filter(({ body }) => /transition/.test(body));

    expect(transitions.length).toBeGreaterThan(0);
    expect(transitions.filter((rule) => !inside(rule, NO_PREFERENCE))).toEqual([]);
    for (const { body } of transitions) expect(body).toMatch(/var\(--duration-fast\) var\(--ease-out\)/);
  });

  it('has no styles that hide or move content', () => {
    expect(rules.filter(({ body }) => HIDES_OR_MOVES.test(body))).toEqual([]);
  });
});
