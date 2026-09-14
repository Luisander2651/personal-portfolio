import { describe, expect, it } from 'vitest';
import baseCss from '../../src/styles/base.css?raw';

type Rules = Record<string, Record<string, string>>;

const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();

/** Reads flat `selector { property: value; }` rules (base.css has no nested blocks). */
function parseRules(css: string): Rules {
  const rules: Rules = {};
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const [, selector = '', body = ''] of withoutComments.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const declarations = rules[normalize(selector)] ?? {};
    for (const [, property = '', value = ''] of body.matchAll(/([\w-]+)\s*:\s*([^;]+);/g)) {
      declarations[property] = normalize(value);
    }
    rules[normalize(selector)] = declarations;
  }
  return rules;
}

const rules = parseRules(baseCss);

describe('base styles', () => {
  it('declares the dark color scheme on the document', () => {
    expect(rules[':root']).toMatchObject({ 'color-scheme': 'dark' });
  });

  it('paints the page background with the halo, grid lines and bg color', () => {
    const grid = 'var(--color-grid-line) var(--border-width), transparent var(--border-width)';
    expect(rules['body']).toMatchObject({
      'background-color': 'var(--color-bg)',
      'background-image': `var(--page-halo), linear-gradient(${grid}), linear-gradient(90deg, ${grid})`,
      'background-size': 'auto, var(--grid-size) var(--grid-size), var(--grid-size) var(--grid-size)',
    });
  });

  it('paints the halo once, fixed to the viewport, and repeats only the grid', () => {
    expect(rules['body']).toMatchObject({
      'background-repeat': 'no-repeat, repeat, repeat',
      'background-attachment': 'fixed, scroll, scroll',
    });
  });

  it('removes the default body margin', () => {
    expect(rules['body']).toMatchObject({ margin: '0' });
  });

  it('sets body text color and typography', () => {
    expect(rules['body']).toMatchObject({
      color: 'var(--color-text)',
      'font-family': 'var(--font-sans)',
      'font-size': 'var(--text-body-size)',
      'line-height': 'var(--text-body-line-height)',
      'font-weight': 'var(--text-body-weight)',
    });
  });

  it.each([
    ['h1', { 'font-size': 'var(--text-h1-size)', 'line-height': 'var(--text-h1-line-height)', 'font-weight': 'var(--text-h1-weight)', 'letter-spacing': 'var(--text-h1-tracking)' }],
    ['h2', { 'font-size': 'var(--text-h2-size)', 'line-height': 'var(--text-h2-line-height)', 'font-weight': 'var(--text-h2-weight)', 'letter-spacing': 'var(--text-h2-tracking)' }],
    ['h3', { 'font-size': 'var(--text-h3-size)', 'line-height': 'var(--text-h3-line-height)', 'font-weight': 'var(--text-h3-weight)' }],
    ['p', { 'font-size': 'var(--text-body-size)', 'line-height': 'var(--text-body-line-height)', 'font-weight': 'var(--text-body-weight)' }],
    ['small', { 'font-size': 'var(--text-small-size)', 'line-height': 'var(--text-small-line-height)' }],
    ['code', { 'font-family': 'var(--font-mono)', 'font-size': 'var(--text-code-size)', 'line-height': 'var(--text-code-line-height)' }],
  ])('styles %s with all the tokens of its level', (selector, declarations) => {
    expect(rules[selector]).toEqual(declarations);
  });

  it('colors links with the link tokens', () => {
    expect(rules['a']).toMatchObject({ color: 'var(--color-link)' });
    expect(rules['a:hover']).toMatchObject({ color: 'var(--color-link-hover)' });
  });

  it('shows the focus ring on keyboard focus', () => {
    expect(rules[':focus-visible']).toEqual({
      outline: 'var(--focus-ring)',
      'outline-offset': 'var(--focus-ring-offset)',
    });
  });

  it('styles text selection with the selection tokens', () => {
    expect(rules['::selection']).toEqual({
      'background-color': 'var(--color-selection-bg)',
      color: 'var(--color-selection-text)',
    });
  });

  it('uses no literal colors, sizes or durations', () => {
    const literals = Object.values(rules)
      .flatMap((declarations) => Object.values(declarations))
      .filter((value) => /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?)\(|\b\d*\.?\d+(px|rem|em|vh|vw|%|ms|s)\b/i.test(value));
    expect(literals).toEqual([]);
  });
});
