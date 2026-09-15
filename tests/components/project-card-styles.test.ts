import { describe, expect, it } from 'vitest';
import projectCardSource from '../../src/components/ProjectCard.astro?raw';

type Rule = { selector: string; body: string; ancestors: string[] };

const LITERAL = /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?)\(|\b\d*\.?\d+(px|rem|em|vh|svh|dvh|vw|%|ms|s)\b/i;
const FINE_POINTER = /@media\s*\(\s*hover:\s*hover\s*\)\s*and\s*\(\s*pointer:\s*fine\s*\)/;
const REDUCED = /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)/;
const NO_PREFERENCE = /@media\s*\(\s*prefers-reduced-motion:\s*no-preference\s*\)/;
const HIDES_OR_MOVES = /(^|;|\s)(opacity|transform|filter|visibility|animation[\w-]*)\s*:|display:\s*none/;

const styles = (projectCardSource.match(/<style[^>]*>([\s\S]*?)<\/style>/)?.[1] ?? '').replace(/\/\*[\s\S]*?\*\//g, '');

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
const ruleFor = (selector: RegExp) => rules.filter((rule) => selector.test(rule.selector) && rule.ancestors.length === 0);

describe('ProjectCard styles', () => {
  it('has scoped styles', () => {
    expect(projectCardSource).not.toMatch(/<style[^>]*is:global/);
    expect(styles.trim()).not.toBe('');
  });

  it('uses no literal colors, sizes, spacing or durations', () => {
    const values = [...styles.matchAll(/:\s*([^;{}]+);/g)].map(([, value]) => value ?? '');
    expect(values.filter((value) => LITERAL.test(value))).toEqual([]);
  });

  it('is a system card', () => {
    const card = ruleFor(/^\.project-card$/).map(({ body }) => body).join(';');

    for (const token of ['--color-surface', '--color-border', '--radius-lg', '--card-padding', '--card-gap', '--border-width']) {
      expect(card).toContain(`var(${token})`);
    }
  });

  it('shows the index with the mono label tokens in the muted color', () => {
    const index = ruleFor(/^\.project-card-index$/).map(({ body }) => body).join(';');

    for (const token of ['--font-mono', '--text-mono-label-size', '--text-mono-label-weight', '--text-mono-label-tracking']) {
      expect(index).toContain(`var(${token})`);
    }
    expect(index).toMatch(/color:\s*var\(--color-text-muted\)/);
  });

  it('lists the achievements with a thin mark and muted body text', () => {
    const list = ruleFor(/^\.project-achievements$/).map(({ body }) => body).join(';');
    const item = ruleFor(/^\.project-achievement$/).map(({ body }) => body).join(';');
    const mark = ruleFor(/^\.project-achievement-mark$/).map(({ body }) => body).join(';');

    expect(list).toMatch(/gap:\s*var\(--space-3\)/);
    expect(item).toMatch(/grid-template-columns:\s*var\(--space-2\)\s+minmax\(0,\s*1fr\)/);
    expect(item).toContain('var(--text-body-size)');
    expect(item).toMatch(/color:\s*var\(--color-text-muted\)/);
    expect(mark).toMatch(/height:\s*var\(--border-width\)/);
    expect(mark).toMatch(/background-color:\s*var\(--color-border-strong\)/);
  });

  it('pushes the stack to the bottom of the card, with the system tags', () => {
    const stackList = ruleFor(/^\.project-stack$/).map(({ body }) => body).join(';');
    const tag = ruleFor(/^\.project-tag$/).map(({ body }) => body).join(';');

    expect(stackList).toMatch(/margin(-top)?:\s*auto/);
    expect(stackList).toMatch(/gap:\s*var\(--space-2\)/);
    for (const token of ['--tag-height', '--tag-padding-x', '--color-tag-bg', '--color-tag-text', '--tag-font-size']) {
      expect(tag).toContain(`var(${token})`);
    }
  });

  describe('spotlight (M-1)', () => {
    const lit = rules.filter(({ selector }) => /data-spotlight-active|:hover/.test(selector));

    it('brightens the achievements for the active card, and on hover with reduced motion', () => {
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
