import { describe, expect, it } from 'vitest';
import techStackSource from '../../src/components/TechStackSection.astro?raw';

type Rule = { selector: string; body: string; ancestors: string[] };

const LITERAL = /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?)\(|\b\d*\.?\d+(px|rem|em|vh|svh|dvh|vw|%|ms|s)\b/i;
const FINE_POINTER = /@media\s*\(\s*hover:\s*hover\s*\)\s*and\s*\(\s*pointer:\s*fine\s*\)/;
const REDUCED = /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)/;
const SPOTLIGHT = /--color-spotlight|--spotlight-size|--border-glow|--shadow-glow-soft|data-spotlight|:hover/;

const script = techStackSource.match(/<script(?![^>]*is:inline)[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? '';
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
const spotlightRules = rules.filter((rule) => SPOTLIGHT.test(rule.selector) || SPOTLIGHT.test(rule.body));

describe('TechStackSection spotlight (M-1)', () => {
  describe('script', () => {
    it('runs only with a fine pointer and without prefers-reduced-motion: reduce', () => {
      expect(script).toMatch(/matchMedia\(\s*['"]\(hover: hover\) and \(pointer: fine\)['"]\s*\)/);
      expect(script).toMatch(/matchMedia\(\s*['"]\(prefers-reduced-motion: reduce\)['"]\s*\)/);
    });

    it('follows the pointer over the cards at most once per frame', () => {
      expect(script).toMatch(/\.tech-card/);
      expect(script).toMatch(/pointermove/);
      expect(script).toMatch(/requestAnimationFrame\(/);
      expect(script).toMatch(/--spotlight-x/);
      expect(script).toMatch(/--spotlight-y/);
    });

    it('marks the card while the pointer is inside', () => {
      expect(script).toMatch(/pointerenter/);
      expect(script).toMatch(/pointerleave/);
      expect(script).toMatch(/dataset\.spotlight/);
    });

    it('imports no packages', () => {
      expect(script).not.toMatch(/\bimport\b/);
    });
  });

  describe('styles', () => {
    it('uses no literal colors, sizes, spacing or durations', () => {
      const values = [...styles.matchAll(/:\s*([^;{}]+);/g)].map(([, value]) => value ?? '');
      expect(values.filter((value) => LITERAL.test(value))).toEqual([]);
    });

    it('draws the light with --color-spotlight and --spotlight-size at the pointer position', () => {
      const light = spotlightRules.filter(({ body }) => /radial-gradient\(/.test(body));

      expect(light).toHaveLength(1);
      expect(light[0]?.body).toMatch(/var\(--spotlight-size\)/);
      expect(light[0]?.body).toMatch(/var\(--color-spotlight\)/);
      expect(light[0]?.body).toMatch(/at\s+var\(--spotlight-x\)\s+var\(--spotlight-y\)/);
    });

    it('lights the border with --border-glow and --shadow-glow-soft', () => {
      const bodies = spotlightRules.map(({ body }) => body).join(';');

      expect(bodies).toMatch(/var\(--border-glow\)/);
      expect(bodies).toMatch(/var\(--shadow-glow-soft\)/);
    });

    it('turns the icons to --color-text while lit', () => {
      const lit = spotlightRules.filter(({ selector }) => /\.tech-icon\b/.test(selector) && /data-spotlight|:hover/.test(selector));

      expect(lit.length).toBeGreaterThan(0);
      for (const { body } of lit) expect(body).toMatch(/color:\s*var\(--color-text\)/);
    });

    it('keeps every spotlight rule inside the fine pointer media query', () => {
      expect(spotlightRules.length).toBeGreaterThan(0);
      expect(spotlightRules.filter((rule) => !inside(rule, FINE_POINTER))).toEqual([]);
    });

    it('lights only the cards marked by the script, except the static reduced motion hover', () => {
      const lit = rules.filter(({ selector }) => /\.tech-card[^,]*:hover/.test(selector));

      expect(lit.length).toBeGreaterThan(0);
      expect(lit.filter((rule) => !inside(rule, REDUCED))).toEqual([]);
    });

    it('has no light layer and no transitions with reduced motion', () => {
      const reduced = rules.filter((rule) => inside(rule, REDUCED));

      expect(reduced.length).toBeGreaterThan(0);
      for (const { body } of reduced) {
        expect(body).not.toMatch(/--color-spotlight|radial-gradient|transition/);
      }
      const transitions = rules.filter(({ body }) => /transition/.test(body));
      expect(transitions.length).toBeGreaterThan(0);
      expect(transitions.filter((rule) => !inside(rule, /prefers-reduced-motion:\s*no-preference/))).toEqual([]);
    });

    it('hides only its decorative layers, never content', () => {
      const hiding = rules.filter(({ body }) => /(^|;|\s)(opacity:\s*0\b|visibility:\s*hidden|display:\s*none)/.test(body));

      expect(hiding.filter(({ selector }) => !/::(before|after)$/.test(selector))).toEqual([]);
    });
  });
});
