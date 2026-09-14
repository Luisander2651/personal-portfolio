import { describe, expect, it } from 'vitest';
import { sortProjects } from '../../src/lib/projects';

const project = (id: string, order: number) => ({ id, data: { order } });

describe('sortProjects', () => {
  it('sorts projects by ascending order', () => {
    const unsorted = [project('c', 3), project('a', 1), project('b', 2)];

    expect(sortProjects(unsorted).map(({ id }) => id)).toEqual(['a', 'b', 'c']);
  });

  it('does not mutate the original list', () => {
    const unsorted = [project('b', 2), project('a', 1)];
    const snapshot = [...unsorted];

    sortProjects(unsorted);

    expect(unsorted).toEqual(snapshot);
  });

  it('returns an empty list unchanged', () => {
    expect(sortProjects([])).toEqual([]);
  });

  it('throws when two projects share the same order', () => {
    const duplicated = [project('a', 1), project('b', 2), project('c', 1)];

    expect(() => sortProjects(duplicated)).toThrow(/order 1/);
  });
});
