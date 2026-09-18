import { describe, expect, it } from 'vitest';
import { groupProjectsForSection, sortProjects } from '../../src/lib/projects';

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

describe('groupProjectsForSection', () => {
  const entry = (id: string, order: number, featured: boolean) => ({ id, data: { order, featured } });

  it('splits the projects into featured and rest, each sorted by order', () => {
    const projects = [entry('e', 5, false), entry('b', 2, true), entry('c', 3, false), entry('a', 1, true), entry('d', 4, false)];

    const { featured, rest } = groupProjectsForSection(projects);

    expect(featured.map(({ id }) => id)).toEqual(['a', 'b']);
    expect(rest.map(({ id }) => id)).toEqual(['c', 'd', 'e']);
  });

  it('returns empty groups when there are no projects of a kind', () => {
    expect(groupProjectsForSection([entry('a', 1, false)])).toEqual({ featured: [], rest: [entry('a', 1, false)] });
    expect(groupProjectsForSection([])).toEqual({ featured: [], rest: [] });
  });

  it('does not mutate the original list', () => {
    const projects = [entry('b', 2, false), entry('a', 1, true)];
    const snapshot = structuredClone(projects);

    groupProjectsForSection(projects);

    expect(projects).toEqual(snapshot);
  });

  it('throws when two projects share the same order', () => {
    expect(() => groupProjectsForSection([entry('a', 1, true), entry('b', 1, false)])).toThrow(/order 1/);
  });
});
