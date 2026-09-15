import { describe, expect, it } from 'vitest';
import projectsSectionSource from '../../src/components/ProjectsSection.astro?raw';

type Rule = { selector: string; body: string; ancestors: string[] };

const LITERAL = /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?)\(|\b\d*\.?\d+(px|rem|em|vh|svh|dvh|vw|%|ms|s)\b/i;
const WIDE = /@media\s*\(\s*min-width:\s*1024px\s*\)/;
const HIDES_OR_MOVES = /(^|;|\s)(opacity|transform|translate|filter|visibility|animation[\w-]*)\s*:|display:\s*none/;

const styles = (projectsSectionSource.match(/<style[^>]*>([\s\S]*?)<\/style>/)?.[1] ?? '').replace(/\/\*[\s\S]*?\*\//g, '');

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
const bodyOf = (selector: RegExp, where: (rule: Rule) => boolean) =>
  rules
    .filter((rule) => selector.test(rule.selector) && where(rule))
    .map(({ body }) => body)
    .join(';');
const base = (rule: Rule) => rule.ancestors.length === 0;
const wide = (rule: Rule) => inside(rule, WIDE);

describe('ProjectsSection styles', () => {
  it('has scoped styles', () => {
    expect(projectsSectionSource).not.toMatch(/<style[^>]*is:global/);
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
    '--grid-size',
    '--card-padding',
    '--space-6',
    '--space-7',
    '--status-dot-size',
  ])('uses the %s token', (token) => {
    expect(styles).toContain(`var(${token})`);
  });

  it('paints the featured panel as a sunken surface with a dot grid', () => {
    const panel = bodyOf(/^\.projects-featured$/, base);

    expect(panel).toMatch(/background-color:\s*var\(--color-surface-sunken\)/);
    expect(panel).toMatch(/radial-gradient\(\s*var\(--color-border-strong\)/);
    expect(panel).toMatch(/background-size:\s*var\(--grid-size\)\s+var\(--grid-size\)/);
    expect(panel).toMatch(/padding:\s*var\(--card-padding\)/);
    expect(panel).toMatch(/border-radius:\s*var\(--radius-lg\)/);
  });

  it('stacks the panel and the rest below 1024px', () => {
    expect(bodyOf(/^\.projects-featured$/, base)).toMatch(/grid-template-columns:\s*minmax\(0,\s*1fr\)/);
    expect(bodyOf(/^\.projects-rest$/, base)).not.toMatch(/repeat\(\s*3/);
    expect(bodyOf(/^\.projects-connector$/, base)).toMatch(/height:\s*var\(--space-6\)/);
  });

  it('lays out the panel 7:5 around the connector and the rest in 3 columns from 1024px', () => {
    const panel = bodyOf(/^\.projects-featured$/, wide);
    const rest = bodyOf(/^\.projects-rest$/, wide);

    expect(panel).toMatch(/grid-template-columns:\s*minmax\(0,\s*7fr\)\s+var\(--space-7\)\s+minmax\(0,\s*5fr\)/);
    expect(rest).toMatch(/grid-template-columns:\s*repeat\(\s*3,\s*minmax\(0,\s*1fr\)\s*\)/);
    expect(bodyOf(/^\.projects-connector$/, wide)).toMatch(/height:\s*var\(--border-width\)/);
  });

  it('draws the connector as a glowing line between two dots', () => {
    const line = bodyOf(/\.projects-connector$/, () => true);
    const dots = bodyOf(/\.projects-connector::(before|after)/, () => true);

    expect(line).toMatch(/linear-gradient\([^;]*var\(--color-border-strong\)[^;]*var\(--color-glow\)[^;]*var\(--color-border-strong\)\)/);
    expect(dots).toMatch(/var\(--status-dot-size\)/);
    expect(dots).toMatch(/var\(--color-glow\)/);
    expect(dots).toMatch(/var\(--color-bg\)/);
  });

  it('has no styles that hide or move content', () => {
    expect(rules.filter(({ body }) => HIDES_OR_MOVES.test(body))).toEqual([]);
  });
});
