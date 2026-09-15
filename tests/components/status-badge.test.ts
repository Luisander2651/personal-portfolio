import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import StatusBadge from '../../src/components/StatusBadge.astro';
import statusBadgeSource from '../../src/components/StatusBadge.astro?raw';

type Rule = { selector: string; body: string };

const LITERAL = /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?)\(|\b\d*\.?\d+(px|rem|em|vh|svh|dvh|vw|%|ms|s)\b/i;

const styles = (statusBadgeSource.match(/<style[^>]*>([\s\S]*?)<\/style>/)?.[1] ?? '').replace(/\/\*[\s\S]*?\*\//g, '');
const rules: Rule[] = [...styles.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selector = '', body = '']) => ({
  selector: selector.trim(),
  body,
}));
const textOf = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

describe('StatusBadge', () => {
  const rendered: Record<string, string> = {};

  beforeAll(async () => {
    const container = await AstroContainer.create();
    for (const status of ['completed', 'in-progress']) {
      rendered[status] = await container.renderToString(StatusBadge, { props: { status } });
    }
  });

  it.each([
    ['completed', 'Finalizado'],
    ['in-progress', 'En curso'],
  ])('shows the visible label of %s', (status, label) => {
    expect(textOf(rendered[status] ?? '')).toBe(label);
  });

  it.each(['completed', 'in-progress'])('marks the %s variant and hides its dot from assistive technology', (status) => {
    const html = rendered[status] ?? '';

    expect(html).toMatch(new RegExp(`class="[^"]*status-badge--${status}`));
    expect(html).toMatch(/<span[^>]*class="[^"]*status-badge-dot[^"]*"[^>]*aria-hidden="true"|<span[^>]*aria-hidden="true"[^>]*class="[^"]*status-badge-dot/);
  });

  describe('styles', () => {
    it('uses no literal colors, sizes, spacing or durations', () => {
      const values = [...styles.matchAll(/:\s*([^;{}]+);/g)].map(([, value]) => value ?? '');
      expect(values.filter((value) => LITERAL.test(value))).toEqual([]);
    });

    it.each(['--tag-height', '--tag-padding-x', '--tag-font-size', '--radius-full', '--status-dot-size', '--font-mono'])(
      'uses the %s token',
      (token) => {
        expect(styles).toContain(`var(${token})`);
      },
    );

    it.each([
      ['completed', 'success'],
      ['in-progress', 'warning'],
    ])('paints the %s variant with the %s colors', (status, tone) => {
      const body = rules
        .filter(({ selector }) => selector.includes(`status-badge--${status}`))
        .map(({ body }) => body)
        .join(';');

      expect(body).toContain(`var(--color-${tone})`);
      expect(body).toContain(`var(--color-${tone}-bg)`);
      expect(body).toContain(`var(--color-${tone}-border)`);
    });

    it('adds the halo only to the in-progress dot', () => {
      const halos = rules.filter(({ body }) => /box-shadow/.test(body));

      expect(halos).toHaveLength(1);
      expect(halos[0]?.selector).toMatch(/status-badge--in-progress[\s\S]*status-badge-dot/);
      expect(halos[0]?.body).toMatch(/box-shadow:\s*0 0 var\(--space-2\) var\(--color-warning\)/);
    });
  });
});
