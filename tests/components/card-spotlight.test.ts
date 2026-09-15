import { describe, expect, it } from 'vitest';
import cardSpotlightSource from '../../src/components/CardSpotlight.astro?raw';
import indexSource from '../../src/pages/index.astro?raw';

type Rule = { selector: string; body: string; ancestors: string[] };

const LITERAL = /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?)\(|\b\d*\.?\d+(px|rem|em|vh|svh|dvh|vw|%|ms|s)\b/i;
const FINE_POINTER = /@media\s*\(\s*hover:\s*hover\s*\)\s*and\s*\(\s*pointer:\s*fine\s*\)/;
const REDUCED = /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)/;
const NO_PREFERENCE = /@media\s*\(\s*prefers-reduced-motion:\s*no-preference\s*\)/;

const script = cardSpotlightSource.match(/<script(?![^>]*is:inline)[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? '';
const styles = (cardSpotlightSource.match(/<style[^>]*>([\s\S]*?)<\/style>/)?.[1] ?? '').replace(/\/\*[\s\S]*?\*\//g, '');

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

describe('CardSpotlight', () => {
  describe('script', () => {
    it('runs only with a fine pointer and without prefers-reduced-motion: reduce', () => {
      expect(script).toMatch(/matchMedia\(\s*['"]\(hover: hover\) and \(pointer: fine\)['"]\s*\)/);
      expect(script).toMatch(/matchMedia\(\s*['"]\(prefers-reduced-motion: reduce\)['"]\s*\)/);
    });

    it('follows the pointer over the cards marked with data-spotlight at most once per frame', () => {
      expect(script).toMatch(/\[data-spotlight\]/);
      expect(script).toMatch(/pointermove/);
      expect(script).toMatch(/requestAnimationFrame\(/);
      expect(script).toMatch(/--spotlight-x/);
      expect(script).toMatch(/--spotlight-y/);
    });

    it('sets data-spotlight-active while the pointer is inside', () => {
      expect(script).toMatch(/pointerenter/);
      expect(script).toMatch(/pointerleave/);
      expect(script).toMatch(/dataset\.spotlightActive|['"]data-spotlight-active['"]/);
    });

    it('imports no packages', () => {
      expect(script).not.toMatch(/\bimport\b/);
    });
  });

  describe('styles', () => {
    it('has global styles', () => {
      expect(cardSpotlightSource).toMatch(/<style[^>]*is:global[^>]*>/);
      expect(styles.trim()).not.toBe('');
    });

    it('uses no literal colors, sizes, spacing or durations', () => {
      const values = [...styles.matchAll(/:\s*([^;{}]+);/g)].map(([, value]) => value ?? '');
      expect(values.filter((value) => LITERAL.test(value))).toEqual([]);
    });

    it('applies only to cards marked with data-spotlight', () => {
      expect(rules.length).toBeGreaterThan(0);
      for (const { selector } of rules) {
        for (const part of selector.split(',')) expect(part).toMatch(/\[data-spotlight\]/);
      }
    });

    it('draws the light with --color-spotlight and --spotlight-size at the pointer position', () => {
      const light = rules.filter(({ body }) => /radial-gradient\(/.test(body));

      expect(light).toHaveLength(1);
      expect(light[0]?.selector).toMatch(/::after$/);
      expect(light[0]?.body).toMatch(/var\(--spotlight-size\)/);
      expect(light[0]?.body).toMatch(/var\(--color-spotlight\)/);
      expect(light[0]?.body).toMatch(/at\s+var\(--spotlight-x\)\s+var\(--spotlight-y\)/);
    });

    it('lights the border with --border-glow and --shadow-glow-soft', () => {
      const glow = rules.find(({ body }) => /var\(--border-glow\)/.test(body));

      expect(glow?.selector).toMatch(/::before$/);
      expect(glow?.body).toMatch(/var\(--shadow-glow-soft\)/);
    });

    it('lights the layers only for the active card, or on hover with reduced motion', () => {
      const lit = rules.filter(({ body }) => /(^|;|\s)opacity:\s*1\b/.test(body));

      expect(lit.length).toBeGreaterThan(0);
      for (const rule of lit) {
        if (inside(rule, REDUCED)) expect(rule.selector).toMatch(/:hover::before$/);
        else for (const part of rule.selector.split(',')) expect(part).toMatch(/\[data-spotlight-active\]/);
      }
    });

    it('keeps every rule inside the fine pointer media query', () => {
      expect(rules.filter((rule) => !inside(rule, FINE_POINTER))).toEqual([]);
    });

    it('has no light layer and no transitions with reduced motion', () => {
      const reduced = rules.filter((rule) => inside(rule, REDUCED));

      expect(reduced.length).toBeGreaterThan(0);
      for (const { selector, body } of reduced) {
        expect(selector).not.toMatch(/::after/);
        expect(body).not.toMatch(/--color-spotlight|radial-gradient|transition/);
      }
      const transitions = rules.filter(({ body }) => /transition/.test(body));
      expect(transitions.length).toBeGreaterThan(0);
      expect(transitions.filter((rule) => !inside(rule, NO_PREFERENCE))).toEqual([]);
    });

    it('hides only its decorative layers, never content', () => {
      const hiding = rules.filter(({ body }) => /(^|;|\s)(opacity:\s*0\b|visibility:\s*hidden|display:\s*none)/.test(body));

      expect(hiding.filter(({ selector }) => !/::(before|after)$/.test(selector))).toEqual([]);
    });
  });
});

describe('home page', () => {
  it('renders CardSpotlight once inside main', () => {
    const main = indexSource.match(/<main>([\s\S]*?)<\/main>/)?.[1] ?? '';

    expect(indexSource).toMatch(/import CardSpotlight from '\.\.\/components\/CardSpotlight\.astro';/);
    expect(main.match(/<CardSpotlight\b/g)).toHaveLength(1);
  });
});
