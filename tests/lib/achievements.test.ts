import { describe, expect, it } from 'vitest';
import { parseAchievements } from '../../src/lib/achievements';

describe('parseAchievements', () => {
  it('returns the text of every list item, in order', () => {
    const body = '\n- First achievement.\n- Second achievement, with a comma.\n';

    expect(parseAchievements(body)).toEqual(['First achievement.', 'Second achievement, with a comma.']);
  });

  it('ignores blank lines', () => {
    expect(parseAchievements('- One.\n\n\n- Two.')).toEqual(['One.', 'Two.']);
  });

  it('throws when the body has no list items', () => {
    expect(() => parseAchievements('Plain paragraph.')).toThrow(/achievement/);
    expect(() => parseAchievements('')).toThrow(/achievement/);
  });
});
