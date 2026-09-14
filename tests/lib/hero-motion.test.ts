import { describe, expect, it } from 'vitest';
import { parseCssDuration, scrambleText } from '../../src/lib/hero-motion';

describe('parseCssDuration', () => {
  it.each([
    ['400ms', 400],
    ['.4s', 400],
    ['0s', 0],
    ['0ms', 0],
    ['1.2s', 1200],
    ['.15s', 150],
    ['  500ms  ', 500],
  ])('converts %s to %s milliseconds', (value, expected) => {
    expect(parseCssDuration(value)).toBe(expected);
  });

  it.each(['', 'fast', '400', '4px', 'var(--duration-base)'])('rejects the invalid duration "%s"', (value) => {
    expect(() => parseCssDuration(value)).toThrow(/duration/i);
  });
});

describe('scrambleText', () => {
  const glyph = () => '#';

  it('reveals no character at progress 0, keeping spaces', () => {
    expect(scrambleText('Luis Mario', 0, glyph)).toBe('#### #####');
  });

  it('returns the original text at progress 1', () => {
    expect(scrambleText('Luis Mario', 1, glyph)).toBe('Luis Mario');
  });

  it('resolves the first half at progress 0.5', () => {
    expect(scrambleText('abcdefgh', 0.5, glyph)).toBe('abcd####');
  });

  it('resolves characters from left to right', () => {
    expect(scrambleText('abcdefgh', 0.25, glyph)).toBe('ab######');
    expect(scrambleText('abcdefgh', 0.75, glyph)).toBe('abcdef##');
  });

  it('clamps progress outside 0..1', () => {
    expect(scrambleText('abc', -1, glyph)).toBe('###');
    expect(scrambleText('abc', 2, glyph)).toBe('abc');
  });

  it('uses the glyph generator it receives for every unresolved character', () => {
    let calls = 0;
    const counting = () => {
      calls++;
      return '*';
    };

    expect(scrambleText('ab cd', 0, counting)).toBe('** **');
    expect(calls).toBe(4);
  });

  it('keeps accented characters intact once resolved', () => {
    expect(scrambleText('Gutiérrez', 1, glyph)).toBe('Gutiérrez');
  });
});
