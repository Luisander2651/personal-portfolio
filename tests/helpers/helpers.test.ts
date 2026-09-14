import { describe, expect, it } from 'vitest';
import { contrastRatio } from './contrast';
import { parseClamp, parseCssTokens } from './css-tokens';
import { parseDesignTokens } from './design-tokens';

describe('parseDesignTokens', () => {
  const markdown = [
    '## Color',
    '',
    '| Token | Modo | Móvil | Escritorio | Uso |',
    '|-------|------|-------|------------|-----|',
    '| `--color-bg` | fijo | `#05070D` | — | Fondo base |',
    '| `--text-h1-size` | fluido | `30px` | `48px` | `h1` |',
    '| `--grid-size` | 768 | `32px` | `48px` | |',
    '| `--border-glow` | fijo | `linear-gradient(135deg, var(--color-glow) 0%, var(--color-accent) 40%)` | — | Borde |',
    '',
    '| Familia | Variable generada | Pesos |',
    '|---------|-------------------|-------|',
    '| Geist | `--font-geist` | `400` |',
    '',
    '| Constante | Valor | Uso |',
    '|-----------|-------|-----|',
    '| Breakpoint | `768px` | Cambio |',
    '',
    '| Fecha | Decisión | Motivo |',
    '|-------|----------|--------|',
    '| 2026-09-13 | Tablas `Token \\| Modo` | Spec |',
  ].join('\n');

  const tokens = parseDesignTokens(markdown);

  it('returns only token rows', () => {
    expect(tokens.map(({ token }) => token)).toEqual([
      '--color-bg',
      '--text-h1-size',
      '--grid-size',
      '--border-glow',
    ]);
  });

  it('reads a fixed token without desktop value', () => {
    expect(tokens[0]).toEqual({ token: '--color-bg', mode: 'fijo', mobile: '#05070D', desktop: null });
  });

  it('reads fluid and breakpoint tokens with both values', () => {
    expect(tokens[1]).toEqual({ token: '--text-h1-size', mode: 'fluido', mobile: '30px', desktop: '48px' });
    expect(tokens[2]).toEqual({ token: '--grid-size', mode: '768', mobile: '32px', desktop: '48px' });
  });

  it('keeps complex values intact', () => {
    expect(tokens[3]?.mobile).toBe(
      'linear-gradient(135deg, var(--color-glow) 0%, var(--color-accent) 40%)',
    );
  });

  it('rejects an unknown mode', () => {
    expect(() => parseDesignTokens('| `--x` | variable | `1px` | — | |')).toThrow(/--x/);
  });
});

describe('parseCssTokens', () => {
  const css = `
    /* tokens */
    :root {
      --color-bg: #05070D;
      --border-glow: linear-gradient(
        135deg,
        var(--color-glow) 0%
      );
      --grid-size: 32px;
    }

    @media (min-width: 768px) {
      :root {
        --grid-size: 48px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      :root {
        --duration-fast: 0ms;
      }
    }
  `;

  const contexts = parseCssTokens(css);

  it('reads base :root declarations with normalized whitespace', () => {
    expect(contexts.root).toEqual({
      '--color-bg': '#05070D',
      '--border-glow': 'linear-gradient( 135deg, var(--color-glow) 0% )',
      '--grid-size': '32px',
    });
  });

  it('reads declarations inside the 768px media query', () => {
    expect(contexts.desktop).toEqual({ '--grid-size': '48px' });
  });

  it('reads declarations inside the reduced motion media query', () => {
    expect(contexts.reducedMotion).toEqual({ '--duration-fast': '0ms' });
  });

  it('ignores non-root rules', () => {
    expect(parseCssTokens('body { --not-a-token: 1px; }').root).toEqual({});
  });
});

describe('parseClamp', () => {
  it('returns the minimum and maximum of a clamp()', () => {
    expect(parseClamp('clamp(30px, calc(30px + (48 - 30) * ((100vw - 390px) / 1050)), 48px)')).toEqual({
      min: '30px',
      max: '48px',
    });
  });

  it('returns null for values that are not a clamp()', () => {
    expect(parseClamp('32px')).toBeNull();
  });
});

describe('contrastRatio', () => {
  it('is 21 between black and white', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
  });

  it('is symmetric', () => {
    expect(contrastRatio('#E6EDF7', '#05070D')).toBe(contrastRatio('#05070D', '#E6EDF7'));
  });

  it('matches the documented ratio of text over bg', () => {
    expect(contrastRatio('#E6EDF7', '#05070D').toFixed(1)).toBe('17.1');
  });

  it('rejects colors that are not 6-digit hex', () => {
    expect(() => contrastRatio('rgba(0, 0, 0, 0.5)', '#FFFFFF')).toThrow(/hex/);
  });
});
