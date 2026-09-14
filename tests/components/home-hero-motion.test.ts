import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import HomeHero from '../../src/components/HomeHero.astro';
import heroSource from '../../src/components/HomeHero.astro?raw';

const props = {
  name: 'Persona de Prueba',
  role: 'Rol de Prueba',
  location: 'Ciudad de Prueba',
  featuredStack: ['Tech A', 'Tech B'],
  github: 'https://github.com/prueba',
  linkedin: 'https://www.linkedin.com/in/prueba',
  email: 'prueba@example.com',
};

const MOTION_ATTRIBUTE = 'data-hero-motion';
const LITERAL = /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?)\(|\b\d*\.?\d+(px|rem|em|vh|svh|dvh|vw|%|ms|s)\b/i;
const HIDING = /\b(opacity|visibility|transform)\s*:|display\s*:\s*none/;

const styles = (heroSource.match(/<style[^>]*>([\s\S]*?)<\/style>/)?.[1] ?? '').replace(/\/\*[\s\S]*?\*\//g, '');
/** Innermost style rules (selectors nested in at-rules are returned on their own). */
const rules = [...styles.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selector = '', body = '']) => ({
  selector: selector.trim(),
  body,
}));
const underAttribute = rules.filter(({ selector }) => selector.includes(MOTION_ATTRIBUTE));
const componentScript = heroSource.match(/<script(?![^>]*is:inline)[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? '';

describe('HomeHero motion', () => {
  let html = '';
  let inlineScript = '';

  beforeAll(async () => {
    const container = await AstroContainer.create();
    html = await container.renderToString(HomeHero, { props });
    inlineScript = html.match(/<script>([\s\S]*?)<\/script>/)?.[1] ?? '';
  });

  describe('inline pre-paint script', () => {
    it('is rendered before the hero slot', () => {
      expect(inlineScript).not.toBe('');
      expect(html.indexOf('<script>')).toBeLessThan(html.indexOf('class="hero-slot'));
    });

    it('marks the document as pending only without prefers-reduced-motion: reduce', () => {
      expect(inlineScript).toMatch(/matchMedia\(\s*['"]\(prefers-reduced-motion: reduce\)['"]\s*\)\.matches/);
      expect(inlineScript).toMatch(/heroMotion/);
    });

    it('removes the mark if the animation has not started within the total token time', () => {
      expect(inlineScript).toMatch(/setTimeout/);
      for (const token of ['--duration-hero-type', '--duration-hero-compile', '--duration-reveal', '--duration-scramble']) {
        expect(inlineScript).toContain(token);
      }
    });
  });

  describe('styles', () => {
    it('puts the card in its initial F3 state only under the animation attribute', () => {
      const card = underAttribute.find(({ selector }) => /\.hero-card\b/.test(selector));

      expect(card?.body).toMatch(/opacity:\s*0\b/);
      expect(card?.body).toMatch(/transform:\s*translateY\(var\(--hero-card-distance\)\)/);
    });

    it('shows the code block with hidden lines only under the animation attribute', () => {
      expect(underAttribute.find(({ selector }) => /\.hero-code\b/.test(selector))?.body).toMatch(/display:\s*block/);
      expect(underAttribute.find(({ selector }) => /\.code-line\b/.test(selector))?.body).toMatch(/opacity:\s*0\b/);
    });

    it('uses only tokens under the animation attribute', () => {
      expect(underAttribute.length).toBeGreaterThan(0);
      expect(underAttribute.filter(({ body }) => LITERAL.test(body))).toEqual([]);
    });

    it('has no styles hiding the card without the animation attribute', () => {
      const hidingCard = rules.filter(
        ({ selector, body }) =>
          /\.hero-card\b/.test(selector) && !selector.includes(MOTION_ATTRIBUTE) && HIDING.test(body),
      );

      expect(hidingCard).toEqual([]);
    });

    it('only displays the code block under the animation attribute', () => {
      const showingCode = rules.filter(
        ({ selector, body }) =>
          /\.hero-code\b/.test(selector) && !selector.includes(MOTION_ATTRIBUTE) && /display\s*:(?!\s*none)/.test(body),
      );

      expect(showingCode).toEqual([]);
    });
  });

  describe('rendered HTML without JavaScript', () => {
    it('keeps the code block hidden and aria-hidden', () => {
      const pre = html.match(/<pre[^>]*>/)?.[0] ?? '';

      expect(pre).toMatch(/\shidden\b/);
      expect(pre).toMatch(/aria-hidden="true"/);
    });

    it('keeps the real name in the h1', () => {
      expect(html).toMatch(new RegExp(`<h1[^>]*>\\s*${props.name}\\s*</h1>`));
    });

    it('does not render the animation attribute on any element', () => {
      expect(html.replace(/<script>[\s\S]*?<\/script>/g, '')).not.toContain(MOTION_ATTRIBUTE);
    });
  });

  describe('component script', () => {
    it('imports only the motion helpers from src/lib', () => {
      const imports = [...componentScript.matchAll(/from\s+['"]([^'"]+)['"]/g)].map(([, path]) => path);

      expect(imports).toEqual(['../lib/hero-motion']);
      expect(componentScript).toMatch(/parseCssDuration/);
      expect(componentScript).toMatch(/scrambleText/);
    });

    it('animates with the Web Animations API', () => {
      expect(componentScript).toMatch(/\.animate\(/);
    });

    it.each([
      '--duration-hero-type',
      '--stagger',
      '--duration-hero-compile',
      '--ease-in-out',
      '--hero-compile-blur',
      '--hero-compile-brightness',
      '--color-glow',
      '--shadow-glow-hero',
      '--duration-reveal',
      '--ease-out',
      '--hero-card-distance',
      '--duration-scramble',
    ])('reads the %s token', (token) => {
      expect(componentScript).toContain(`'${token}'`);
    });

    it('runs only when the document is pending and removes the mark when it ends', () => {
      expect(componentScript).toMatch(/heroMotion\s*===\s*'pending'/);
      expect(componentScript).toMatch(/delete\s+[\w.]*dataset\.heroMotion/);
    });
  });
});
