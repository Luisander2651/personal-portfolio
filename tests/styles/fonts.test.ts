import { describe, expect, it } from 'vitest';
import astroConfig from '../../astro.config.mjs';

type FontFamilyConfig = {
  provider: { name: string };
  name: string;
  cssVariable: string;
  weights?: Array<number | string>;
  styles?: string[];
  subsets?: string[];
  display?: string;
  fallbacks?: string[];
};

const families = (astroConfig.fonts ?? []) as FontFamilyConfig[];
const family = (cssVariable: string) => families.find((font) => font.cssVariable === cssVariable);

const expectedFamilies = [
  {
    cssVariable: '--font-geist',
    name: 'Geist',
    weights: [400, 500, 600],
    fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
  },
  {
    cssVariable: '--font-geist-mono',
    name: 'Geist Mono',
    weights: [400, 500],
    fallbacks: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
  },
];

describe('self-hosted fonts', () => {
  it('registers exactly the two design system font families', () => {
    expect(families.map(({ cssVariable }) => cssVariable).sort()).toEqual(['--font-geist', '--font-geist-mono']);
  });

  describe.each(expectedFamilies)('$name ($cssVariable)', ({ cssVariable, name, weights, fallbacks }) => {
    it('uses the Google provider through the Astro fonts API', () => {
      expect(family(cssVariable)?.provider.name).toBe('google');
    });

    it('loads the documented family, weights, style and subset', () => {
      expect(family(cssVariable)).toMatchObject({ name, weights, styles: ['normal'], subsets: ['latin'] });
    });

    it('swaps text while the font loads', () => {
      expect(family(cssVariable)?.display).toBe('swap');
    });

    it('declares the documented fallbacks in order', () => {
      expect(family(cssVariable)?.fallbacks).toEqual(fallbacks);
    });
  });
});
