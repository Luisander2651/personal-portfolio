import { describe, expect, it } from 'vitest';
import { groupSkillsForSection } from '../../src/lib/skills';

type Presentation = 'icons' | 'tags' | 'text';

const skill = (id: string, order: number, presentation: Presentation) => ({ id, data: { order, presentation } });
const ids = (entries: readonly { id: string }[]) => entries.map(({ id }) => id);

describe('groupSkillsForSection', () => {
  it('groups categories by presentation, each in ascending order', () => {
    const unsorted = [
      skill('containers', 10, 'text'),
      skill('backend', 2, 'icons'),
      skill('architecture', 8, 'tags'),
      skill('ai', 7, 'text'),
      skill('languages', 1, 'icons'),
      skill('ci-cd', 9, 'text'),
      skill('security', 6, 'icons'),
    ];

    const { icons, tags, text } = groupSkillsForSection(unsorted);

    expect(ids(icons)).toEqual(['languages', 'backend', 'security']);
    expect(ids(tags)).toEqual(['architecture']);
    expect(ids(text)).toEqual(['ai', 'ci-cd', 'containers']);
  });

  it('returns empty groups when there are no categories of a presentation', () => {
    const { icons, tags, text } = groupSkillsForSection([skill('languages', 1, 'icons')]);

    expect(ids(icons)).toEqual(['languages']);
    expect(tags).toEqual([]);
    expect(text).toEqual([]);
  });

  it('returns three empty groups for an empty list', () => {
    expect(groupSkillsForSection([])).toEqual({ icons: [], tags: [], text: [] });
  });

  it('does not mutate the original list', () => {
    const unsorted = [skill('b', 2, 'icons'), skill('a', 1, 'icons')];
    const snapshot = [...unsorted];

    groupSkillsForSection(unsorted);

    expect(unsorted).toEqual(snapshot);
  });

  it('throws when two categories share the same order, even across presentations', () => {
    const duplicated = [skill('a', 1, 'icons'), skill('b', 2, 'tags'), skill('c', 2, 'text')];

    expect(() => groupSkillsForSection(duplicated)).toThrow(/order 2/);
  });
});
