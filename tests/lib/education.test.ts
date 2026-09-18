import { describe, expect, it } from 'vitest';
import { formatYearRange, sortEducation } from '../../src/lib/education';

const entry = (id: string, order: number) => ({ id, data: { order } });

describe('sortEducation', () => {
  it('sorts the entries by ascending order', () => {
    const unsorted = [entry('c', 3), entry('a', 1), entry('b', 2)];

    expect(sortEducation(unsorted).map(({ id }) => id)).toEqual(['a', 'b', 'c']);
  });

  it('does not mutate the original list', () => {
    const unsorted = [entry('b', 2), entry('a', 1)];
    const snapshot = structuredClone(unsorted);

    sortEducation(unsorted);

    expect(unsorted).toEqual(snapshot);
  });

  it('returns an empty list unchanged', () => {
    expect(sortEducation([])).toEqual([]);
  });

  it('throws when two entries share the same order', () => {
    expect(() => sortEducation([entry('a', 1), entry('b', 1)])).toThrow(/order 1/);
  });
});

describe('formatYearRange', () => {
  it('joins different years with a spaced en dash, as in the CV', () => {
    expect(formatYearRange(2025, 2026)).toBe('2025 – 2026');
  });

  it('returns a single year when both are the same', () => {
    expect(formatYearRange(2025, 2025)).toBe('2025');
  });
});
