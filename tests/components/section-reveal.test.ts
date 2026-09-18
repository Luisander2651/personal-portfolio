import { describe, expect, it } from 'vitest';
import sectionRevealSource from '../../src/components/SectionReveal.astro?raw';
import indexSource from '../../src/pages/index.astro?raw';

type Rule = { selector: string; body: string };

const LITERAL = /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?)\(|\b\d*\.?\d+(px|rem|em|vh|svh|dvh|vw|%|ms|s)\b/i;
const HIDES_OR_MOVES = /(^|;|\s)(opacity|transform|visibility|display)\s*:/;

const script = sectionRevealSource.match(/<script(?![^>]*is:inline)[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? '';
const styles = (sectionRevealSource.match(/<style[^>]*>([\s\S]*?)<\/style>/)?.[1] ?? '').replace(/\/\*[\s\S]*?\*\//g, '');

/** Innermost rules; at-rule preludes are not needed here. */
const rules: Rule[] = [...styles.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selector = '', body = '']) => ({
  selector: selector.trim(),
  body,
}));

describe('SectionReveal', () => {
  describe('script', () => {
    it('does nothing with prefers-reduced-motion: reduce', () => {
      expect(script).toMatch(/matchMedia\(\s*['"]\(prefers-reduced-motion: reduce\)['"]\s*\)/);
    });

    it('observes the revealable blocks with IntersectionObserver, without per-frame scroll work', () => {
      expect(script).toMatch(/new IntersectionObserver\(/);
      expect(script).toMatch(/\[data-reveal\]/);
      expect(script).not.toMatch(/addEventListener\(\s*['"]scroll['"]|requestAnimationFrame/);
    });

    it('starts the reveal at the --reveal-start-distance token, not at a visible share', () => {
      expect(script).toMatch(/getPropertyValue\(\s*['"]--reveal-start-distance['"]\s*\)/);
      expect(script).toMatch(/rootMargin:\s*`0px 0px -\$\{[^}]+\}px 0px`/);
      expect(script).not.toMatch(/REVEAL_THRESHOLD|0\.1\b/);
    });

    it('marks the document as active only from the script', () => {
      expect(script).toMatch(/dataset\.revealReady/);
    });

    it('imports only from src/lib', () => {
      const imports = [...script.matchAll(/from\s+['"]([^'"]+)['"]/g)].map(([, path]) => path);
      expect(imports).toEqual(['../lib/section-reveal']);
    });
  });

  describe('styles', () => {
    it('has global styles', () => {
      expect(sectionRevealSource).toMatch(/<style[^>]*is:global[^>]*>/);
      expect(styles.trim()).not.toBe('');
    });

    it('uses no literal colors, sizes, spacing or durations', () => {
      const values = [...styles.matchAll(/:\s*([^;{}]+);/g)].map(([, value]) => value ?? '');
      expect(values.filter((value) => LITERAL.test(value))).toEqual([]);
    });

    it.each(['--reveal-distance', '--duration-reveal', '--ease-out', '--stagger'])('uses the %s token', (token) => {
      expect(styles).toContain(`var(${token})`);
    });

    it('hides or moves blocks only when the document is active', () => {
      const hiding = rules.filter(({ body }) => HIDES_OR_MOVES.test(body));

      expect(hiding.length).toBeGreaterThan(0);
      expect(hiding.filter(({ selector }) => !selector.includes('data-reveal-ready'))).toEqual([]);
    });

    it('animates only the transition to the revealed state', () => {
      const transitions = rules.filter(({ body }) => /transition/.test(body));

      expect(transitions.length).toBeGreaterThan(0);
      for (const { selector } of transitions) expect(selector).toMatch(/\[data-reveal=["']shown["']\]/);
    });

    it('does not use filter', () => {
      expect(styles).not.toMatch(/filter/);
    });
  });
});

describe('home page', () => {
  it('renders SectionReveal once inside main', () => {
    const main = indexSource.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? '';

    expect(main.match(/<SectionReveal\b/g)).toHaveLength(1);
  });
});
