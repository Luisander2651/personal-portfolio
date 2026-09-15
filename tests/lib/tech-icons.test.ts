import { describe, expect, it } from 'vitest';
import techIconsSource from '../../src/lib/tech-icons.ts?raw';
import { getTechIcon } from '../../src/lib/tech-icons';

type SkillFrontmatter = { category: string; presentation: string; items: string[] };

const skills = Object.values(
  import.meta.glob<{ frontmatter: SkillFrontmatter }>('/src/content/skills/*.md', { eager: true }),
).map(({ frontmatter }) => frontmatter);

const iconItems = skills.filter(({ presentation }) => presentation === 'icons').flatMap(({ items }) => items);

const LINE_ICONS = [
  'Java',
  'SQL',
  'APIs REST',
  'WebSockets',
  'WebHooks',
  'OAuth 2.0 (GitHub, Google)',
];

describe('tech icons', () => {
  it('reads the 29 items of the icon categories', () => {
    expect(iconItems).toHaveLength(29);
  });

  it.each(iconItems)('has an icon for "%s"', (item) => {
    expect(() => getTechIcon(item)).not.toThrow();
  });

  it.each(iconItems)('uses the kind of the design table for "%s"', (item) => {
    expect(getTechIcon(item).kind).toBe(LINE_ICONS.includes(item) ? 'line' : 'logo');
  });

  it('uses 23 logos and 6 line icons', () => {
    const kinds = iconItems.map((item) => getTechIcon(item).kind);

    expect(kinds.filter((kind) => kind === 'logo')).toHaveLength(23);
    expect(kinds.filter((kind) => kind === 'line')).toHaveLength(6);
  });

  it('gives "Android nativo (Java, Kotlin)" the Android logo', () => {
    expect(getTechIcon('Android nativo (Java, Kotlin)').slug).toBe('android');
  });

  it.each(iconItems)('draws "%s" with non-empty paths and no colors', (item) => {
    const { paths } = getTechIcon(item);

    expect(paths.length).toBeGreaterThan(0);
    for (const path of paths) {
      expect(path).toMatch(/^[Mm]/);
      expect(path).not.toMatch(/#|rgb|hsl|fill|stroke|url\(/i);
    }
  });

  it('documents the source and license of the logos', () => {
    expect(techIconsSource).toMatch(/Simple Icons/);
    expect(techIconsSource).toMatch(/16\.31\.0/);
    expect(techIconsSource).toMatch(/CC0/);
  });

  it('throws for an item without icon', () => {
    expect(() => getTechIcon('Tecnología desconocida')).toThrow(/Tecnología desconocida/);
  });
});
