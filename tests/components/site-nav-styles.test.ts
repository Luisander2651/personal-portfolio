import { describe, expect, it } from 'vitest';
import siteNavSource from '../../src/components/SiteNav.astro?raw';

type Rule = { selector: string; body: string; ancestors: string[] };

const LITERAL = /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?)\(|\b\d*\.?\d+(px|rem|em|vh|svh|dvh|vw|%|ms|s)\b/i;
const WIDE = /@media\s*\(\s*(min-width:\s*1024px|width\s*>=\s*1024px)\s*\)/;
const NARROW = /@media\s*\(\s*width\s*<\s*1024px\s*\)/;
const REDUCED = /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)/;
const NO_PREFERENCE = /@media\s*\(\s*prefers-reduced-motion:\s*no-preference\s*\)/;
const HIDES = /(^|;|\s)(opacity:\s*0\s*(;|$)|visibility:\s*hidden|display:\s*none)/;
const READY = /\[data-nav-ready\]/;

const styles = (siteNavSource.match(/<style[^>]*>([\s\S]*?)<\/style>/)?.[1] ?? '').replace(/\/\*[\s\S]*?\*\//g, '');

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

const rules = parseRules(styles);
const inside = (rule: Rule, prelude: RegExp) => rule.ancestors.some((ancestor) => prelude.test(ancestor));
const bodyOf = (selector: RegExp, where: (rule: Rule) => boolean = () => true) =>
  rules
    .filter((rule) => selector.test(rule.selector) && where(rule))
    .map(({ body }) => body)
    .join(';');
const base = (rule: Rule) => rule.ancestors.length === 0;

describe('SiteNav styles', () => {
  it('has scoped styles', () => {
    expect(siteNavSource).not.toMatch(/<style[^>]*is:global/);
    expect(styles.trim()).not.toBe('');
  });

  it('uses no literal colors, sizes, spacing or durations', () => {
    const values = [...styles.matchAll(/:\s*([^;{}]+);/g)].map(([, value]) => value ?? '');
    expect(values.filter((value) => LITERAL.test(value))).toEqual([]);
  });

  it.each([
    '--nav-height',
    '--color-nav-bg',
    '--color-border',
    '--nav-row-height',
    '--nav-marker-size',
    '--shadow-nav-marker',
    '--section-max-width',
    '--space-gutter',
    '--control-height',
    '--font-mono',
    '--text-small-size',
    '--color-glow',
    '--color-tag-bg',
    '--color-border-strong',
    '--color-surface',
  ])('uses the %s token', (token) => {
    expect(styles).toContain(`var(${token})`);
  });

  it('paints the bar with the navigation background, bottom border and height', () => {
    const bar = bodyOf(/^\.site-nav$/, base);
    expect(bar).toMatch(/background-color:\s*var\(--color-nav-bg\)/);
    expect(bar).toMatch(/border-bottom:\s*var\(--border-width\) solid var\(--color-border\)/);
    expect(bodyOf(/^\.site-nav-inner$/, base)).toMatch(/min-height:\s*var\(--nav-height\)/);
  });

  it('fixes the bar from 1024px, and below only once the navigation script is ready', () => {
    const fixed = rules.filter(({ body }) => /position:\s*fixed/.test(body));

    expect(fixed.length).toBeGreaterThan(0);
    for (const rule of fixed) {
      expect(rule.selector.startsWith('.site-nav') || READY.test(rule.selector)).toBe(true);
      expect(inside(rule, WIDE) || READY.test(rule.selector)).toBe(true);
    }
    expect(fixed.some((rule) => inside(rule, WIDE))).toBe(true);
    expect(fixed.some((rule) => READY.test(rule.selector))).toBe(true);
  });

  it('never hides the link list unless the navigation script is ready', () => {
    const hidingList = rules.filter(
      // The decorative marker of each link is not part of the list content.
      (rule) => HIDES.test(rule.body) && /\.site-nav-links/.test(rule.selector) && !/\.site-nav-marker/.test(rule.selector),
    );

    expect(hidingList.length).toBeGreaterThan(0);
    for (const rule of hidingList) {
      expect(READY.test(rule.selector)).toBe(true);
      expect(inside(rule, NARROW)).toBe(true);
      expect(rule.selector).toMatch(/aria-expanded='false'|:not\(\[aria-expanded='true'\]\)/);
    }
  });

  it('lays the links in a row from 1024px and hides the menu button there', () => {
    expect(bodyOf(/^\.site-nav-links ul$/, (rule) => inside(rule, WIDE))).toMatch(/flex-direction:\s*row/);
    expect(bodyOf(/^\.site-nav-toggle$/, (rule) => inside(rule, WIDE))).toMatch(/display:\s*none/);
  });

  it('shows the menu button only when it is not hidden', () => {
    const shown = rules.filter((rule) => /\.site-nav-toggle/.test(rule.selector) && /display:\s*inline-flex/.test(rule.body));
    expect(shown.length).toBeGreaterThan(0);
    for (const rule of shown) expect(rule.selector).toContain(':not([hidden])');
  });

  it('paints the collapsible panel with the opaque page background', () => {
    expect(bodyOf(/\[data-nav-ready\]\) \.site-nav-links$/, (rule) => inside(rule, NARROW))).toMatch(
      /background-color:\s*var\(--color-bg\)/,
    );
  });

  it('uses rows of the navigation row height below 1024px', () => {
    expect(bodyOf(/^\.site-nav-links a$/, (rule) => inside(rule, NARROW))).toMatch(/min-height:\s*var\(--nav-row-height\)/);
  });

  it('keeps the skip link out of view until it has focus', () => {
    expect(bodyOf(/^\.site-nav-skip$/, base)).toMatch(/transform:\s*translateY\(/);
    expect(bodyOf(/^\.site-nav-skip:focus$/, base)).toMatch(/transform:\s*none/);
  });

  it('hides the full name only visually', () => {
    const name = bodyOf(/^\.site-nav-name$/, base);
    expect(name).toMatch(/position:\s*absolute/);
    expect(name).toMatch(/overflow:\s*hidden/);
    expect(name).not.toMatch(/display:\s*none|visibility:\s*hidden/);
  });

  it('marks the current link with the light marker and the glow number', () => {
    const current = rules.filter(({ selector }) => /\[aria-current='true'\]/.test(selector));
    const body = current.map(({ body }) => body).join(';');

    expect(current.some(({ selector }) => /\.site-nav-marker/.test(selector))).toBe(true);
    expect(body).toMatch(/opacity:\s*1/);
    expect(body).toMatch(/color:\s*var\(--color-glow\)/);
    expect(bodyOf(/\.site-nav-marker$/, base)).toMatch(/box-shadow:\s*var\(--shadow-nav-marker\)/);
  });

  it('shows the focus ring of the system on every control', () => {
    const focus = bodyOf(/:focus-visible/);
    expect(focus).toMatch(/outline:\s*var\(--focus-ring\)/);
    expect(focus).toMatch(/outline-offset:\s*var\(--focus-ring-offset\)/);
  });

  it('animates only opacity, transform, visibility and color, and only without reduced motion', () => {
    const transitions = rules.filter(({ body }) => /transition/.test(body));

    expect(transitions.length).toBeGreaterThan(0);
    for (const rule of transitions) {
      expect(inside(rule, NO_PREFERENCE)).toBe(true);
      expect(inside(rule, REDUCED)).toBe(false);
      const properties = [...rule.body.matchAll(/(?:^|,|:)\s*(opacity|transform|visibility|color|[\w-]+)\s+var\(--duration/g)].map(
        ([, property]) => property,
      );
      expect(properties.length).toBeGreaterThan(0);
      for (const property of properties) expect(['opacity', 'transform', 'visibility', 'color']).toContain(property);
    }
  });
});
