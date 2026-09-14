import { describe, expect, it } from 'vitest';
import heroSource from '../../src/components/HomeHero.astro?raw';

const styles = heroSource.match(/<style[^>]*>([\s\S]*?)<\/style>/)?.[1] ?? '';
const withoutComments = styles.replace(/\/\*[\s\S]*?\*\//g, '');

/** Body of the first block whose prelude matches, including nested blocks. */
function blockBody(prelude: RegExp): string {
  const match = prelude.exec(withoutComments);
  if (!match) return '';
  const start = withoutComments.indexOf('{', match.index) + 1;
  let depth = 1;
  let index = start;
  while (index < withoutComments.length && depth > 0) {
    if (withoutComments[index] === '{') depth++;
    if (withoutComments[index] === '}') depth--;
    index++;
  }
  return withoutComments.slice(start, index - 1);
}

describe('HomeHero styles', () => {
  it('has scoped styles', () => {
    expect(styles.trim()).not.toBe('');
  });

  it('uses no literal colors, sizes, spacing or durations', () => {
    const values = [...withoutComments.matchAll(/:\s*([^;{}]+);/g)].map(([, value]) => value ?? '');
    const literals = values.filter((value) =>
      /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?)\(|\b\d*\.?\d+(px|rem|em|vh|svh|dvh|vw|%|ms|s)\b/i.test(value),
    );
    expect(literals).toEqual([]);
  });

  it.each(['--hero-min-height', '--hero-card-max-width', '--hero-card-padding', '--hero-card-gap', '--icon-frame-size'])(
    'uses the %s token',
    (token) => {
      expect(withoutComments).toContain(`var(${token})`);
    },
  );

  it('shows the render(profile) indicator only from 768px', () => {
    expect(blockBody(/\.hero-indicator\s*\{/)).toMatch(/display:\s*none/);
    expect(blockBody(/@media\s*\(\s*min-width:\s*768px\s*\)/)).toMatch(/\.hero-indicator/);
  });

  it('lights the link border on hover with a fine pointer', () => {
    expect(blockBody(/@media\s*\(\s*hover:\s*hover\s*\)\s*and\s*\(\s*pointer:\s*fine\s*\)/)).toMatch(/\.hero-link:hover/);
  });

  it('lights the link border on keyboard focus', () => {
    expect(withoutComments).toMatch(/\.hero-link:focus-visible/);
  });

  it('lights the link border on touch devices when tapped', () => {
    expect(blockBody(/@media\s*\(\s*hover:\s*none\s*\)/)).toMatch(/\.hero-link:active/);
  });

  it('animates the link state with the base duration and ease-out tokens', () => {
    expect(blockBody(/\.hero-link\s*\{/)).toMatch(/transition:[^;]*var\(--duration-base\)[^;]*var\(--ease-out\)/);
  });
});
