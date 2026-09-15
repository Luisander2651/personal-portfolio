import { describe, expect, it } from 'vitest';
import aboutSource from '../../src/components/AboutSection.astro?raw';
import sectionHeaderSource from '../../src/components/SectionHeader.astro?raw';

type Rule = { selector: string; body: string; ancestors: string[] };

const LITERAL = /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?)\(|\b\d*\.?\d+(px|rem|em|vh|svh|dvh|vw|%|ms|s)\b/i;
const MOTION_PROPERTIES = /(^|;|\s)(animation[\w-]*|opacity|transform|filter)\s*:/;
const NO_PREFERENCE = /@media\s*\(\s*prefers-reduced-motion:\s*no-preference\s*\)/;
const SCROLL_DRIVEN = /@supports\s*\(\s*animation-timeline:\s*view\(\)\s*\)/;

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
const isKeyframe = ({ ancestors }: Rule) => ancestors.some((prelude) => prelude.startsWith('@keyframes'));
const insideRevealConditions = ({ ancestors }: Rule) =>
  ancestors.some((prelude) => NO_PREFERENCE.test(prelude)) && ancestors.some((prelude) => SCROLL_DRIVEN.test(prelude));

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
    '--reveal-range-start',
    '--reveal-range-length',
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

  describe('M-1 reveal', () => {
    it.each(Object.entries(components))('%s animates only under no-preference and scroll-driven support', (_name, css) => {
      const motionRules = rulesOf(css).filter((rule) => isKeyframe(rule) || MOTION_PROPERTIES.test(rule.body));

      expect(motionRules.length).toBeGreaterThan(0);
      expect(motionRules.filter((rule) => !insideRevealConditions(rule))).toEqual([]);
    });

    it.each(Object.entries(components))(
      '%s reveals once it has entered the start distance, over the range length, with the ease-in-out curve',
      (_name, css) => {
        const animated = rulesOf(css).filter(
          (rule) => !isKeyframe(rule) && /animation-timeline:\s*view\(\)/.test(rule.body),
        );

        expect(animated.length).toBeGreaterThan(0);
        for (const { body } of animated) {
          expect(body).toMatch(/animation-range-start:\s*entry\s+var\(--reveal-range-start\)\s*;/);
          expect(body).toMatch(
            /animation-range-end:\s*entry\s+calc\(\s*var\(--reveal-range-start\)\s*\+\s*var\(--reveal-range-length\)\s*\)/,
          );
          expect(body).toMatch(/animation-timing-function:\s*var\(--ease-in-out\)/);
        }
      },
    );

    it('starts the header from the reveal distance with blur', () => {
      const frames = rulesOf(components.SectionHeader).filter(isKeyframe).map(({ body }) => body).join(';');

      expect(frames).toMatch(/opacity:\s*0\b/);
      expect(frames).toMatch(/translateY\(var\(--reveal-distance\)\)/);
      expect(frames).toMatch(/blur\(var\(--reveal-blur\)\)/);
    });

    it('promotes the panel to its own layer while it can reveal, to keep scrolling smooth', () => {
      const panelReveal = rulesOf(components.AboutSection).find(
        (rule) => !isKeyframe(rule) && /animation-timeline:\s*view\(\)/.test(rule.body),
      );

      expect(panelReveal && insideRevealConditions(panelReveal)).toBe(true);
      expect(panelReveal?.body).toMatch(/will-change:\s*opacity,\s*transform\s*;/);
    });

    it('starts the panel from the reveal distance without filter', () => {
      const frames = rulesOf(components.AboutSection).filter(isKeyframe).map(({ body }) => body).join(';');

      expect(frames).toMatch(/opacity:\s*0\b/);
      expect(frames).toMatch(/translateY\(var\(--reveal-distance\)\)/);
      expect(frames).not.toMatch(/filter/);
    });
  });
});
