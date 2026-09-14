import { describe, expect, it } from 'vitest';
import designSystem from '../../designs/000-design-system/design.md?raw';
import tokensCss from '../../src/styles/tokens.css?raw';
import { contrastRatio } from '../helpers/contrast';
import { parseCssTokens } from '../helpers/css-tokens';
import { parseDesignTokens } from '../helpers/design-tokens';

const designTokens = parseDesignTokens(designSystem);
const css = parseCssTokens(tokensCss);
const documented = new Set(designTokens.map(({ token }) => token));

const fixedTokens = designTokens.filter(({ mode }) => mode === 'fijo');

const cssValue = (token: string) => {
  const value = css.root[token];
  if (value === undefined) throw new Error(`${token} is not declared in tokens.css`);
  return value;
};

describe('design tokens', () => {
  describe('fixed tokens', () => {
    it('has fixed tokens documented in design.md', () => {
      expect(fixedTokens.length).toBeGreaterThan(0);
    });

    it.each(fixedTokens.map(({ token, mobile }) => [token, mobile]))(
      'declares %s with the documented value',
      (token, value) => {
        expect(css.root[token]).toBe(value);
      },
    );
  });

  it('declares no token that is missing from design.md', () => {
    const declared = [
      ...Object.keys(css.root),
      ...Object.keys(css.desktop),
      ...Object.keys(css.reducedMotion),
    ];
    expect(declared.filter((token) => !documented.has(token))).toEqual([]);
  });

  it('points the font family tokens to the self-hosted font variables', () => {
    expect(cssValue('--font-sans')).toBe('var(--font-geist)');
    expect(cssValue('--font-mono')).toBe('var(--font-geist-mono)');
  });
});

describe('color contrast', () => {
  const textOnBackgrounds = [
    '--color-text',
    '--color-text-secondary',
    '--color-text-muted',
    '--color-link',
    '--color-warning',
    '--color-success',
  ].flatMap((foreground) =>
    ['--color-bg', '--color-surface'].map((background) => [foreground, background, 4.5] as const),
  );

  const pairs = [
    ...textOnBackgrounds,
    ['--color-on-accent', '--color-accent', 4.5],
    ['--color-tag-text', '--color-tag-bg', 4.5],
    ['--color-glow', '--color-bg', 3],
  ] as const;

  it.each(pairs)('%s over %s is at least %s:1', (foreground, background, minimum) => {
    expect(contrastRatio(cssValue(foreground), cssValue(background))).toBeGreaterThanOrEqual(minimum);
  });
});
