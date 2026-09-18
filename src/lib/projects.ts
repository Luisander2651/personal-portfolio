type OrderedEntry = { data: { order: number } };
type FeaturedEntry = { data: { order: number; featured: boolean } };

export type ProjectGroups<T> = { featured: T[]; rest: T[] };

/** Returns a new list of projects sorted by ascending `order`. */
export function sortProjects<T extends OrderedEntry>(projects: readonly T[]): T[] {
  const seen = new Set<number>();
  for (const { data } of projects) {
    if (seen.has(data.order)) {
      throw new Error(`Duplicated project order ${data.order}`);
    }
    seen.add(data.order);
  }

  return [...projects].sort((a, b) => a.data.order - b.data.order);
}

/** Splits the projects into the featured block and the rest, each sorted by ascending `order`. */
export function groupProjectsForSection<T extends FeaturedEntry>(projects: readonly T[]): ProjectGroups<T> {
  const sorted = sortProjects(projects);
  return {
    featured: sorted.filter(({ data }) => data.featured),
    rest: sorted.filter(({ data }) => !data.featured),
  };
}
