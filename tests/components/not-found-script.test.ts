import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import NotFoundScreen from '../../src/components/NotFoundScreen.astro';
import notFoundSource from '../../src/components/NotFoundScreen.astro?raw';

const scripts = [...notFoundSource.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].map(([, attrs = '', body = '']) => ({ attrs, body }));

describe('NotFoundScreen script', () => {
  const [script] = scripts;
  const body = script?.body ?? '';

  it('is a single bundled script that only uses the shared motion helpers', () => {
    const imports = [...body.matchAll(/import\s+[\s\S]*?from\s+'([^']+)'/g)].map(([, source]) => source);

    expect(scripts).toHaveLength(1);
    expect(script?.attrs).not.toMatch(/\bis:inline\b/);
    expect(imports).toEqual(['../lib/hero-motion']);
    expect(body).toMatch(/\bscrambleText\b/);
    expect(body).toMatch(/\bparseCssDuration\b/);
  });

  it('decodes the code during the scramble duration of the system', () => {
    expect(body).toMatch(/--duration-scramble/);
    expect(body).toMatch(/requestAnimationFrame/);
  });

  it('does nothing with reduced motion', () => {
    expect(body).toMatch(/prefers-reduced-motion:\s*reduce/);
  });

  it('writes only into the decorative text, never into the accessible name', () => {
    const code = body.replace(/\/\*[\s\S]*?\*\//g, '');

    expect(code).toMatch(/not-found-code-text/);
    expect(code).not.toMatch(/setAttribute\(\s*'aria-label'|\.ariaLabel\s*=/);
  });
});

describe('NotFoundScreen without JavaScript', () => {
  let html = '';

  beforeAll(async () => {
    const container = await AstroContainer.create();
    html = await container.renderToString(NotFoundScreen);
  });

  it('already shows the code and announces it as "404"', () => {
    expect(html).toMatch(/aria-hidden="true"[^>]*>404</);
    expect(html.match(/<p[^>]*class="[^"]*not-found-code[^"]*"[^>]*>/)?.[0]).toMatch(/aria-label="404"/);
  });
});
